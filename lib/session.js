import 'server-only';
import { createHmac, createHash, timingSafeEqual } from 'crypto';
import { cookies, headers } from 'next/headers';

// Cookie bertanda tangan (HMAC). Kunci: SESSION_SECRET, atau diturunkan dari service role key
// supaya tidak wajib menambah env var baru.
function secret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  const base = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base) throw new Error('SESSION_SECRET atau SUPABASE_SERVICE_ROLE_KEY belum diisi');
  return createHmac('sha256', base).update('krs-session-v1').digest('hex');
}

const sign = (data) => createHmac('sha256', secret()).update(data).digest('base64url');

function safeEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

const EDIT_COOKIE = 'krs_edit';
const ADMIN_COOKIE = 'krs_admin';
const EDIT_MINUTES = 20;
const ADMIN_HOURS = 8;

const cookieOpts = (maxAge, path = '/') => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path,
  maxAge,
});

function makeToken(subject, seconds) {
  const exp = Math.floor(Date.now() / 1000) + seconds;
  const data = `${subject}.${exp}`;
  return `${data}.${sign(data)}`;
}

function readToken(token, subject) {
  if (!token) return false;
  const i = token.lastIndexOf('.');
  if (i < 0) return false;
  const data = token.slice(0, i);
  const [sub, exp] = [data.slice(0, data.lastIndexOf('.')), data.slice(data.lastIndexOf('.') + 1)];
  if (sub !== subject || !(Number(exp) > Date.now() / 1000)) return false;
  return safeEqual(token.slice(i + 1), sign(data));
}

// ---- Sesi edit kartu (setelah PIN benar) ----
export async function startEditSession(code) {
  (await cookies()).set(EDIT_COOKIE, makeToken(`edit:${code}`, EDIT_MINUTES * 60), cookieOpts(EDIT_MINUTES * 60));
}
export async function hasEditSession(code) {
  return readToken((await cookies()).get(EDIT_COOKIE)?.value, `edit:${code}`);
}
export async function endEditSession() {
  (await cookies()).delete(EDIT_COOKIE);
}

// Token sekali pakai setelah aktivasi: pemilik baru saja membuat PIN, jadi tombol "Lihat statistik"
// boleh langsung membuka sesi edit tanpa PIN lagi. Berlaku 10 menit, dikirim lewat POST (tidak di URL).
// (Cookie tidak dipasang langsung saat aktivasi: Next.js akan memuat ulang /c/<kode>, dan kartu yang
// sudah aktif langsung redirect ke tujuannya.)
export const activationToken = (code) => makeToken(`act:${code}`, 600);
export const checkActivationToken = (token, code) => readToken(token, `act:${code}`);

// ---- Sesi admin ----
export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

export function checkAdminPassword(input) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  const h = (s) => createHash('sha256').update(String(s)).digest();
  return timingSafeEqual(h(input), h(real));
}
export async function startAdminSession() {
  (await cookies()).set(ADMIN_COOKIE, makeToken('admin', ADMIN_HOURS * 3600), cookieOpts(ADMIN_HOURS * 3600));
}
export async function isAdmin() {
  return adminEnabled() && readToken((await cookies()).get(ADMIN_COOKIE)?.value, 'admin');
}
export async function endAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

// IP pengunjung (Vercel mengisi x-forwarded-for; elemen pertama adalah klien).
export async function clientIp() {
  const h = await headers();
  return (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'local';
}
