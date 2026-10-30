'use server';

import { db } from '@/lib/db';
import { isAdmin } from '@/lib/session';
import { cleanItems, isInvoiceStatus, nextNumber, todayJakarta } from '@/lib/invoice';

const badId = (id) => !Number.isSafeInteger(Number(id)) || Number(id) <= 0;
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

async function allNumbers() {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db().from('invoices').select('number').range(from, from + 999);
    if (error) throw error;
    out.push(...data.map((r) => r.number));
    if (data.length < 1000) return out;
  }
}

// Buat atau ubah invoice. Nomor dibuat otomatis sekali saat invoice baru disimpan.
export async function saveInvoice(prev, fd) {
  if (!(await isAdmin())) return { error: 'Sesi admin habis. Login lagi.' };
  const id = String(fd.get('id') || '');
  const buyer = String(fd.get('buyer') || '').trim().slice(0, 120);
  const issued = String(fd.get('issued_on') || '');
  const status = String(fd.get('status') || 'unpaid');
  let items;
  try { items = cleanItems(JSON.parse(String(fd.get('items') || '[]'))); } catch { items = []; }
  if (!buyer) return { error: 'Isi nama pembeli.' };
  if (!isDate(issued)) return { error: 'Tanggal tidak valid.' };
  if (!items.length) return { error: 'Tambahkan minimal 1 produk.' };
  if (!isInvoiceStatus(status)) return { error: 'Status tidak valid.' };
  if (id && badId(id)) return { error: 'Data tidak valid.' };

  const paidOn = String(fd.get('paid_on') || '');
  const row = {
    buyer,
    buyer_phone: String(fd.get('buyer_phone') || '').trim().slice(0, 30) || null,
    issued_on: issued,
    items,
    discount: Math.max(0, Math.min(100_000_000, Math.round(Number(fd.get('discount')) || 0))),
    discount_note: String(fd.get('discount_note') || '').trim().slice(0, 120) || null,
    note: String(fd.get('note') || '').trim().slice(0, 300) || null,
    status,
    paid_on: status === 'paid' ? (isDate(paidOn) ? paidOn : todayJakarta()) : null,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await db().from('invoices').update(row).eq('id', Number(id));
    if (error) return { error: 'Gagal menyimpan invoice.' };
    return { success: true, id: Number(id) };
  }

  // Dua percobaan kalau nomor bentrok (dua tab menyimpan bersamaan).
  for (let i = 0; i < 2; i++) {
    let numbers;
    try { numbers = await allNumbers(); } catch { return { error: 'Gagal memuat invoice. Sudah jalankan migrasi SQL 009?' }; }
    const number = nextNumber(numbers, issued);
    const { data, error } = await db().from('invoices').insert({ ...row, number }).select('id').single();
    if (!error) return { success: true, id: data.id };
    if (error.code !== '23505') return { error: 'Gagal menyimpan invoice.' };
  }
  return { error: 'Nomor invoice bentrok. Coba simpan lagi.' };
}

// Ganti status dari riwayat. Lunas: tanggal bayar = hari ini kalau belum ada.
export async function setInvoiceStatus(id, status) {
  if (!(await isAdmin())) return { error: 'Sesi admin habis. Login lagi.' };
  if (badId(id) || !isInvoiceStatus(status)) return { error: 'Data tidak valid.' };
  const { data: cur, error: e1 } = await db().from('invoices').select('paid_on').eq('id', Number(id)).maybeSingle();
  if (e1 || !cur) return { error: 'Invoice tidak ditemukan.' };
  const patch = { status, updated_at: new Date().toISOString(), paid_on: status === 'paid' ? cur.paid_on || todayJakarta() : null };
  const { error } = await db().from('invoices').update(patch).eq('id', Number(id));
  if (error) return { error: 'Gagal menyimpan status.' };
  return { success: true };
}
