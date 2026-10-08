'use server';

import { randomInt } from 'crypto';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { hashPin } from '@/lib/pin';
import { isCode, normCode } from '@/lib/validate';
import { checkAdminPassword, endAdminSession, isAdmin, startAdminSession } from '@/lib/session';
import { allow } from '@/lib/throttle';

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
  const { error } = await db()
    .from('cards')
    .update({
      status: 'unactivated', business_name: null, google_url: null, target_type: null, target_value: null,
      target_url: null, pin_hash: null, scans: 0, failed_attempts: 0, lockouts: 0, locked_until: null,
      activated_at: null, last_scan_at: null,
    })
    .eq('code', c);
  if (error) return { error: 'Gagal reset kartu.' };
  await db().from('card_scans').delete().eq('code', c);
  return { success: true, message: 'Kartu kembali jadi kartu baru.' };
}

export async function addCards(prev, formData) {
  const bad = await guard();
  if (bad) return bad;
  const n = Math.min(100, Math.max(1, parseInt(formData.get('count'), 10) || 0));

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
    ({ error } = await db().from('cards').insert(codes.map((code) => ({ code }))));
    if (!error || error.code !== '23505') break;
  }
  if (error) return { error: 'Gagal membuat kartu.' };
  return { success: true, codes };
}
