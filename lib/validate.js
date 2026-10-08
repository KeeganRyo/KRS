export const isPin = (v) => /^\d{4}$/.test(v || '');
export const normCode = (v) => String(v || '').trim().toUpperCase();
// Kode kartu: huruf/angka 4–16 karakter (kode cetakan saat ini 6 karakter).
export const isCode = (v) => /^[A-Z0-9]{4,16}$/.test(v || '');
