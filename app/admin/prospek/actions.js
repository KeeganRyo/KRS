'use server';

import { db } from '@/lib/db';
import { isAdmin } from '@/lib/session';
import { isStatus, parseSheetRows } from '@/lib/prospects';

const badId = (id) => !Number.isSafeInteger(Number(id)) || Number(id) <= 0;

export async function setProspectStatus(id, status) {
  if (!(await isAdmin())) return { error: 'Sesi admin habis. Login lagi.' };
  if (badId(id) || !isStatus(status)) return { error: 'Data tidak valid.' };
  const patch = { status, updated_at: new Date().toISOString() };
  if (status !== 'baru') patch.contacted_at = patch.updated_at;
  const { error } = await db().from('prospects').update(patch).eq('id', Number(id));
  if (error) return { error: 'Gagal menyimpan status.' };
  return { success: true };
}

// Dipanggil saat "Buka WA" diklik: prospek yang belum di-chat otomatis jadi "Sudah di-chat".
export async function markChatted(id) {
  if (!(await isAdmin())) return { error: 'Sesi admin habis. Login lagi.' };
  if (badId(id)) return { error: 'Data tidak valid.' };
  const now = new Date().toISOString();
  const { error } = await db().from('prospects').update({ status: 'chat', contacted_at: now, updated_at: now }).eq('id', Number(id)).eq('status', 'baru');
  if (error) return { error: 'Gagal menyimpan status.' };
  return { success: true };
}

export async function setProspectNote(id, note) {
  if (!(await isAdmin())) return { error: 'Sesi admin habis. Login lagi.' };
  if (badId(id)) return { error: 'Data tidak valid.' };
  const clean = String(note || '').trim().slice(0, 500) || null;
  const { error } = await db().from('prospects').update({ note: clean, updated_at: new Date().toISOString() }).eq('id', Number(id));
  if (error) return { error: 'Gagal menyimpan catatan.' };
  return { success: true };
}

// Ambil semua kunci yang sudah ada (Supabase membatasi 1000 baris per query).
async function existingKeys() {
  const keys = new Set();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db().from('prospects').select('key').order('id').range(from, from + 999);
    if (error) throw error;
    data.forEach((r) => keys.add(r.key));
    if (data.length < 1000) break;
  }
  return keys;
}

// Tempel baris dari Google Sheet (atau batch baru). Prospek yang sudah ada (nomor/nama sama) dilewati.
export async function importProspects(prev, formData) {
  if (!(await isAdmin())) return { error: 'Sesi admin habis. Login lagi.' };
  const rows = parseSheetRows(formData.get('rows'));
  if (!rows.length) return { error: 'Tidak ada baris yang terbaca. Copy baris dari sheet (kolom A sampai N), lalu tempel di sini.' };
  if (rows.length > 3000) return { error: 'Maksimal 3000 baris sekali impor.' };
  const batch = String(formData.get('batch') || '').trim().slice(0, 40) || null;
  let keys;
  try { keys = await existingKeys(); } catch { return { error: 'Gagal membaca data. Sudah jalankan migrasi 008?' }; }
  const fresh = [];
  for (const r of rows) {
    if (keys.has(r.key)) continue;
    keys.add(r.key);
    fresh.push({ ...r, batch });
  }
  for (let i = 0; i < fresh.length; i += 200) {
    const { error } = await db().from('prospects').insert(fresh.slice(i, i + 200));
    if (error) return { error: `Gagal menyimpan (sudah masuk ${i} baris).` };
  }
  return { success: true, message: `${fresh.length} prospek baru masuk, ${rows.length - fresh.length} dilewati karena sudah ada.` };
}
