import 'server-only';
import { randomUUID } from 'crypto';
import { db } from './db';

// Foto profil kartu nama di Supabase Storage (bucket publik 'avatars', lihat 004_avatars.sql).
// Browser sudah memotong foto jadi persegi JPEG kecil (ProfileFields); server hanya memeriksa
// bahwa isinya benar-benar JPEG dan tidak terlalu besar, lalu menyimpannya dengan nama acak.
const BUCKET = 'avatars';
const MAX_BYTES = 400 * 1024;

export function photoUrl(path) {
  if (!path) return null;
  return `${process.env.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET}/${path}`;
}

function decodeJpeg(dataUrl) {
  const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
  if (!m) return null;
  const buf = Buffer.from(m[1], 'base64');
  if (buf.length < 100 || buf.length > MAX_BYTES) return null;
  // Tanda awal dan akhir file JPEG.
  if (buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) return null;
  if (buf[buf.length - 2] !== 0xff || buf[buf.length - 1] !== 0xd9) return null;
  return buf;
}

// Tentukan foto dari isian form: foto baru, hapus foto, atau tetap pakai yang lama.
// Kembalikan { photo, added, old } atau { error }. `added` = file baru yang perlu dihapus kalau
// penyimpanan ke database gagal; `old` = file lama yang perlu dihapus kalau berhasil.
export async function readPhoto(formData, code, current) {
  const data = formData.get('p_photo_data');
  if (data) {
    const buf = decodeJpeg(data);
    if (!buf) return { error: 'Foto tidak bisa dipakai. Coba foto lain (maksimal 400 KB setelah dikecilkan).' };
    const path = `${code}/${randomUUID()}.jpg`;
    const { error } = await db().storage.from(BUCKET).upload(path, buf, { contentType: 'image/jpeg', upsert: false });
    if (error) return { error: 'Gagal mengunggah foto. Coba lagi.' };
    return { photo: path, added: path, old: current || null };
  }
  if (formData.get('p_photo_remove') === '1') return { photo: null, old: current || null };
  return { photo: current || null };
}

// Foto menu digital: JPEG yang sudah diperkecil browser, disimpan di KODE/menu/ dengan nama acak.
export async function uploadMenuJpeg(code, dataUrl) {
  const buf = decodeJpeg(dataUrl);
  if (!buf) return { error: 'Foto tidak bisa dipakai. Coba foto lain.' };
  const path = `${code}/menu/${randomUUID()}.jpg`;
  const { error } = await db().storage.from(BUCKET).upload(path, buf, { contentType: 'image/jpeg', upsert: false });
  if (error) return { error: 'Gagal mengunggah foto. Coba lagi.' };
  return { path, url: photoUrl(path) };
}

// Hapus file foto. Gagal hapus tidak menggagalkan proses utama (sisa file tidak berbahaya).
export async function removePhoto(path) {
  if (!path) return;
  try { await db().storage.from(BUCKET).remove([path]); } catch { /* biarkan */ }
}

// Untuk vCard: ambil isi foto sebagai base64 (null kalau gagal).
export async function photoBase64(path) {
  if (!path) return null;
  try {
    const { data, error } = await db().storage.from(BUCKET).download(path);
    if (error || !data) return null;
    const buf = Buffer.from(await data.arrayBuffer());
    return buf.length <= MAX_BYTES ? buf.toString('base64') : null;
  } catch {
    return null;
  }
}
