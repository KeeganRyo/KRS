'use server';

import { randomInt } from 'crypto';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { hashPin } from '@/lib/pin';
import { normalizeWhatsapp } from '@/lib/targets';
import { isCode, normCode } from '@/lib/validate';
import { checkAdminPassword, endAdminSession, isAdmin, startAdminSession } from '@/lib/session';
import { allow } from '@/lib/throttle';
import { removePhoto } from '@/lib/avatar';
import { menuPhotos } from '@/lib/menu';

// Jenis fisik kartu: papan review, kartu nama, atau papan menu.
const KINDS = ['board', 'namecard', 'menu'];
const readKind = (v) => (KINDS.includes(v) ? v : 'board');

// Huruf/angka tanpa yang mirip (0/O, 1/I/L), sama dengan tools/generate_qr_and_seed.py.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

async function guard(code) {
  if (!(await isAdmin())) return { error: 'Sesi admin habis. Login lagi.' };
  if (code !== undefined && !isCode(normCode(code))) return { error: 'Kode tidak valid.' };
  return null;
}

export async function adminLogin(prev, formData) {
  if (!(await allow('admin-login', 5, 900))) return { error: 'Terlalu banyak percobaan. Coba lagi 15 menit lagi.' };
  if (!checkAdminPassword(String(formData.get('password') || ''))) return { error: 'Password salah.' };
  await startAdminSession();
  return { success: true };
}

export async function adminLogout() {
  await endAdminSession();
  redirect('/admin');
}

export async function resetPin(code) {
  const bad = await guard(code);
  if (bad) return bad;
  const pin = String(randomInt(0, 10000)).padStart(4, '0');
  const { error } = await db()
    .from('cards')
    .update({ pin_hash: hashPin(pin), failed_attempts: 0, lockouts: 0, locked_until: null })
    .eq('code', normCode(code))
    .eq('status', 'active');
  if (error) return { error: 'Gagal reset PIN.' };
  return { success: true, message: `PIN baru: ${pin}`, pin };
}

// Isi atau hapus nomor HP pemilik dari admin (misalnya untuk kartu lama yang belum punya nomor).
export async function setOwnerPhone(code, raw) {
  const bad = await guard(code);
  if (bad) return bad;
  const s = String(raw || '').trim();
  const phone = s ? normalizeWhatsapp(s) : null;
  if (s && !phone) return { error: 'Nomor HP tidak valid. Contoh: 0812 3456 7890.' };
  const { error } = await db().from('cards').update({ owner_phone: phone }).eq('code', normCode(code));
  if (error) return { error: 'Gagal menyimpan nomor HP.' };
  return { success: true, message: phone ? `Nomor pemilik: +${phone}` : 'Nomor pemilik dihapus.' };
}

export async function unlockCard(code) {
  const bad = await guard(code);
  if (bad) return bad;
  const { error } = await db()
    .from('cards')
    .update({ failed_attempts: 0, lockouts: 0, locked_until: null })
    .eq('code', normCode(code));
  if (error) return { error: 'Gagal membuka kunci.' };
  return { success: true, message: 'Kunci dibuka.' };
}

// Kembalikan kartu ke kondisi baru (untuk dipakai ulang klien lain). Riwayat scan ikut terhapus.
export async function resetCard(code) {
  const bad = await guard(code);
  if (bad) return bad;
  const c = normCode(code);
  const { data: before } = await db().from('cards').select('*').eq('code', c).maybeSingle();
  const { error } = await db()
    .from('cards')
    .update({
      status: 'unactivated', business_name: null, google_url: null, target_type: null, target_value: null,
      target_url: null, profile: null, pin_hash: null, scans: 0, failed_attempts: 0, lockouts: 0, locked_until: null,
      activated_at: null, last_scan_at: null, owner_phone: null,
    })
    .eq('code', c);
  if (error) return { error: 'Gagal reset kartu.' };
  await db().from('card_scans').delete().eq('code', c);
  await removePhoto(before?.profile?.photo);
  for (const p of menuPhotos(before?.menu)) await removePhoto(p);
  if (before && 'menu' in before) await db().from('cards').update({ menu: null }).eq('code', c);
  return { success: true, message: 'Kartu kembali jadi kartu baru.' };
}

// Hapus kode dari database (misalnya kode salah buat / chip rusak). Riwayat scan ikut terhapus
// (on delete cascade), foto profil juga. Kartu yang sudah aktif hanya terhapus kalau kodenya diketik ulang.
export async function deleteCard(code, typed) {
  const bad = await guard(code);
  if (bad) return bad;
  const c = normCode(code);
  // select('*'): kolom menu mungkin belum ada kalau migrasi 006 belum dijalankan.
  const { data: card } = await db().from('cards').select('*').eq('code', c).maybeSingle();
  if (!card) return { success: true, message: 'Kartu sudah tidak ada.' };
  if (card.status === 'active' && normCode(typed || '') !== c) {
    return { error: 'Kode yang diketik tidak cocok. Kartu tidak dihapus.' };
  }
  const { error } = await db().from('cards').delete().eq('code', c);
  if (error) return { error: 'Gagal menghapus kartu.' };
  await removePhoto(card.profile?.photo);
  for (const p of menuPhotos(card.menu)) await removePhoto(p);
  return { success: true, message: `Kartu ${c} dihapus.` };
}

export async function addCards(prev, formData) {
  const bad = await guard();
  if (bad) return bad;
  const n = Math.min(100, Math.max(1, parseInt(formData.get('count'), 10) || 0));
  const kind = readKind(formData.get('kind'));

  // Kode acak dari 31 karakter (6 digit = ~887 juta kombinasi). Kalau kebetulan bentrok dengan
  // kode yang sudah ada, database menolak (primary key) dan kita coba lagi dengan kode baru.
  // (Tidak membaca semua kode lama: Supabase hanya mengembalikan 1000 baris per query.)
  const gen = () => {
    const set = new Set();
    while (set.size < n) {
      let c = '';
      for (let i = 0; i < 6; i++) c += ALPHABET[randomInt(ALPHABET.length)];
      set.add(c);
    }
    return [...set];
  };
  let codes = [];
  let error = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    codes = gen();
    ({ error } = await db().from('cards').insert(codes.map((code) => ({ code, kind }))));
    if (!error || error.code !== '23505') break;
  }
  if (error) return { error: 'Gagal membuat kartu.' };
  return { success: true, codes };
}

// Tambah kode tertentu (misalnya kode yang sudah ditulis ke chip NFC). Kode yang sudah ada dilewati.
export async function addManualCodes(prev, formData) {
  const bad = await guard();
  if (bad) return bad;
  const kind = readKind(formData.get('kind'));
  const raw = String(formData.get('codes') || '').split(/[\s,;]+/).map((c) => normCode(c)).filter(Boolean);
  const codes = [...new Set(raw)];
  if (!codes.length) return { error: 'Ketik minimal satu kode.' };
  if (codes.length > 50) return { error: 'Maksimal 50 kode sekali tambah.' };
  const invalid = codes.filter((c) => !isCode(c));
  if (invalid.length) return { error: `Kode tidak valid: ${invalid.join(', ')}. Kode berisi 4-16 huruf/angka.` };
  const added = [];
  const exists = [];
  for (const code of codes) {
    const { error } = await db().from('cards').insert({ code, kind });
    if (!error) added.push(code);
    else if (error.code === '23505') exists.push(code);
    else return { error: `Gagal menyimpan ${code}.`, added };
  }
  return { success: true, added, exists };
}
