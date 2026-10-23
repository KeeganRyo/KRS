// WiFi tamu (tujuan kartu 'wifi', halaman /w/KODE): nama tempat, nama WiFi, password,
// plus info tambahan opsional (WA resepsionis, jam sarapan, link review).
// Server membersihkan setiap isian sebelum disimpan; halaman publik menampilkan password apa adanya.
import { normalizeLink, normalizeWhatsapp } from './targets';

export const WIFI_INFO_LINES = 4;

const text = (v, max) => String(v || '').replace(/\s+/g, ' ').trim().slice(0, max);

// Kembalikan { wifi } atau { error }.
export function buildWifi(formData) {
  const w = {};
  w.name = text(formData.get('w_name'), 60);
  if (!w.name) return { error: 'Isi nama tempat dulu (misalnya Hotel Senja).' };

  // SSID boleh berisi spasi di tengah, jadi hanya dipotong di ujung.
  w.ssid = String(formData.get('w_ssid') || '').trim().slice(0, 32);
  if (!w.ssid) return { error: 'Isi nama WiFi (SSID).' };

  w.open = formData.get('w_open') === '1';
  if (!w.open) {
    const pass = String(formData.get('w_pass') || '');
    if (pass.length < 8 || pass.length > 63) return { error: 'Password WiFi harus 8 sampai 63 karakter.' };
    w.pass = pass;
  }

  const waRaw = String(formData.get('w_wa') || '').trim();
  if (waRaw) {
    const wa = normalizeWhatsapp(waRaw);
    if (!wa) return { error: 'Nomor WhatsApp resepsionis tidak valid. Contoh: 0812 3456 7890.' };
    w.wa = wa;
  }

  const reviewRaw = String(formData.get('w_review') || '').trim();
  if (reviewRaw) {
    const review = normalizeLink(reviewRaw);
    if (!review) return { error: 'Link review tidak valid. Salin link review dari Google Maps.' };
    w.review = review;
  }

  const info = String(formData.get('w_info') || '')
    .split('\n')
    .map((l) => text(l, 80))
    .filter(Boolean);
  if (info.length > WIFI_INFO_LINES) return { error: `Info tambahan maksimal ${WIFI_INFO_LINES} baris.` };
  if (info.length) w.info = info;

  return { wifi: w };
}

// Teks QR WiFi standar (dibaca kamera iPhone dan Android): WIFI:T:WPA;S:nama;P:password;;
const esc = (s) => String(s).replace(/([\\;,:"])/g, '\\$1');
export const wifiQrText = (w) =>
  w.open ? `WIFI:T:nopass;S:${esc(w.ssid)};;` : `WIFI:T:WPA;S:${esc(w.ssid)};P:${esc(w.pass)};;`;

// Baris info "Sarapan: 06.30–10.00" dipecah jadi label dan isi (kalau ada titik dua).
export function splitInfo(line) {
  const i = line.indexOf(':');
  return i > 0 && i < 30 ? { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() } : { label: null, value: line };
}
