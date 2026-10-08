'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { hashPin, verifyPin } from '@/lib/pin';
import { isCode, isPin, normCode } from '@/lib/validate';
import { lookup, suggest } from '@/lib/places';
import { buildTarget, TARGET_TYPES } from '@/lib/targets';
import { activationToken, checkActivationToken, endEditSession, hasEditSession, startEditSession } from '@/lib/session';
import { allow, codeMissAllowed } from '@/lib/throttle';

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

const getCard = async (code, cols = 'code,status') =>
  (await db().from('cards').select(cols).eq('code', code).maybeSingle()).data;

// Pencarian bisnis memakai kuota Google Places, jadi hanya boleh untuk:
// kartu yang belum aktif (aktivasi), atau kartu aktif yang sudah dibuka dengan PIN (edit).
async function mayUsePlaces(code) {
  const c = normCode(code);
  if (!isCode(c)) return { error: 'Kartu tidak ditemukan.' };
  if (!(await allow('places', 60, 600))) return { error: 'Terlalu banyak pencarian. Coba lagi beberapa menit lagi.' };
  const card = await getCard(c);
  if (!card) return { error: 'Kartu tidak ditemukan.' };
  if (card.status === 'unactivated' || (await hasEditSession(c))) return { ok: true };
  return { error: 'Sesi edit sudah habis. Masukkan PIN lagi.' };
}

export async function lookupBusiness(code, query) {
  const gate = await mayUsePlaces(code);
  return gate.ok ? lookup(query) : gate;
}

export async function suggestBusiness(code, input) {
  const gate = await mayUsePlaces(code);
  return gate.ok ? suggest(input) : gate;
}

function readTarget(formData) {
  const type = String(formData.get('target_type') || '');
  if (!TARGET_TYPES.includes(type)) return { error: 'Pilih tujuan kartu.' };
  return buildTarget(type, formData.get('target_value'));
}

export async function activateCard(prev, formData) {
  const code = normCode(formData.get('code'));
  const pin = String(formData.get('pin') || '');
  const pin2 = String(formData.get('pin_confirm') || '');
  const name = String(formData.get('business_name') || '').trim().slice(0, 120);

  if (!isCode(code)) return { error: 'Kode kartu tidak valid.' };
  if (!(await allow('activate', 20, 600))) return { error: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' };
  const target = readTarget(formData);
  if (target.error) return { error: target.error };
  if (!isPin(pin)) return { error: 'PIN harus 4 digit angka.' };
  if (pin !== pin2) return { error: 'Konfirmasi PIN tidak sama. Ketik ulang PIN kamu.' };

  const { data, error } = await db()
    .from('cards')
    .update({
      target_type: target.type,
      target_value: target.value,
      target_url: target.url,
      google_url: target.type === 'review' ? target.url : null,
      business_name: name || null,
      pin_hash: hashPin(pin),
      status: 'active',
      activated_at: new Date().toISOString(),
    })
    .eq('code', code)
    .eq('status', 'unactivated')
    .select('code');

  if (error) return { error: 'Terjadi kesalahan server. Coba lagi.' };
  if (!data || data.length === 0) return { error: 'Kartu ini sudah aktif atau kodenya tidak valid.' };
  // Token untuk tombol "Lihat statistik" (lihat editAfterActivation), supaya tidak perlu ketik PIN lagi.
  return { success: true, code, token: activationToken(code) };
}

function lockMessage(lockedUntil) {
  const mins = Math.max(1, Math.ceil((new Date(lockedUntil) - Date.now()) / 60000));
  return `Terlalu banyak salah PIN. Kartu dikunci, coba lagi dalam ${mins} menit.`;
}

// Langkah 1 edit: cek PIN, lalu buka sesi edit (cookie 20 menit).
export async function unlockCard(prev, formData) {
  const code = normCode(formData.get('code'));
  const pin = String(formData.get('pin') || '');
  if (!isCode(code)) return { error: 'Kode kartu tidak valid.' };
  if (!isPin(pin)) return { error: 'PIN harus 4 digit angka.' };
  if (!(await allow('pin', 30, 900))) return { error: 'Terlalu banyak percobaan dari perangkat ini. Coba lagi nanti.' };

  // Ambil jatah percobaan SEBELUM cek PIN (atomik di database), supaya permintaan
  // paralel tidak bisa melewati batas 5 kali.
  const { data: rows, error } = await db().rpc('claim_pin_attempt', {
    p_code: code, p_max: MAX_ATTEMPTS, p_base_minutes: LOCK_MINUTES,
  });
  if (error) return { error: 'Terjadi kesalahan server. Coba lagi.' };

  if (!rows || rows.length === 0) {
    const card = await getCard(code, 'code,status,locked_until');
    if (!card || card.status !== 'active') return { error: 'Kartu belum aktif atau tidak ditemukan.' };
    return { error: lockMessage(card.locked_until), locked: true };
  }

  const { pin_hash: hash, attempts } = rows[0];
  if (!verifyPin(pin, hash)) {
    const left = MAX_ATTEMPTS - attempts;
    if (left <= 0) {
      const card = await getCard(code, 'locked_until');
      return { error: lockMessage(card?.locked_until), locked: true };
    }
    return { error: `PIN salah. Sisa ${left} percobaan sebelum kartu dikunci.` };
  }

  await db().from('cards').update({ failed_attempts: 0, lockouts: 0, locked_until: null }).eq('code', code);
  await startEditSession(code);
  return { success: true };
}

// Tombol setelah aktivasi berhasil: tukar token aktivasi dengan sesi edit, lalu buka halaman edit.
export async function editAfterActivation(code, formData) {
  const c = normCode(code);
  if (!isCode(c)) redirect('/');
  if (checkActivationToken(String(formData.get('token') || ''), c)) await startEditSession(c);
  redirect(`/c/${encodeURIComponent(c)}/edit`);
}

// Form "Edit kartu" di landing page. Tetap jalan tanpa JavaScript (form POST biasa).
export async function openEdit(prev, formData) {
  const code = normCode(formData.get('code')).replace(/\s+/g, '');
  const keep = { code };
  if (!isCode(code)) return { ...keep, error: 'Kode kartu berisi 4 sampai 16 huruf atau angka, contoh: ABC123. Lihat di belakang papan.' };
  const card = await getCard(code);
  if (!card) {
    if (!(await codeMissAllowed())) return { ...keep, error: 'Terlalu banyak kode yang salah. Coba lagi 10 menit lagi.' };
    return { ...keep, error: 'Kode kartu tidak ditemukan. Cek lagi huruf dan angkanya di belakang papan.' };
  }
  redirect(`/c/${encodeURIComponent(code)}/edit`);
}

export async function lockCard(code) {
  await endEditSession();
  redirect(`/c/${encodeURIComponent(normCode(code))}/edit`);
}

async function requireSession(formData) {
  const code = normCode(formData.get('code'));
  if (!isCode(code) || !(await hasEditSession(code))) {
    return { error: 'Sesi edit sudah habis. Muat ulang halaman dan masukkan PIN lagi.', expired: true };
  }
  return { code };
}

export async function saveTarget(prev, formData) {
  const s = await requireSession(formData);
  if (s.error) return s;
  const target = readTarget(formData);
  if (target.error) return { error: target.error };
  const name = String(formData.get('business_name') || '').trim().slice(0, 120);

  const patch = {
    target_type: target.type,
    target_value: target.value,
    target_url: target.url,
    google_url: target.type === 'review' ? target.url : null,
  };
  if (target.type === 'review' && name) patch.business_name = name;

  const { error } = await db().from('cards').update(patch).eq('code', s.code).eq('status', 'active');
  if (error) return { error: 'Gagal menyimpan. Coba lagi.' };
  return { success: true, at: Date.now() };
}

export async function saveName(prev, formData) {
  const s = await requireSession(formData);
  if (s.error) return s;
  const name = String(formData.get('business_name') || '').trim().slice(0, 120);
  const { error } = await db().from('cards').update({ business_name: name || null }).eq('code', s.code).eq('status', 'active');
  if (error) return { error: 'Gagal menyimpan. Coba lagi.' };
  return { success: true, at: Date.now() };
}

export async function changePin(prev, formData) {
  const s = await requireSession(formData);
  if (s.error) return s;
  const pin = String(formData.get('new_pin') || '');
  const pin2 = String(formData.get('new_pin_confirm') || '');
  if (!isPin(pin)) return { error: 'PIN baru harus 4 digit angka.' };
  if (pin !== pin2) return { error: 'Konfirmasi PIN tidak sama.' };
  const { error } = await db().from('cards').update({ pin_hash: hashPin(pin) }).eq('code', s.code);
  if (error) return { error: 'Gagal menyimpan. Coba lagi.' };
  return { success: true, at: Date.now() };
}
