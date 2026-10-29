// Status prospek + teks WA pertama. Dipakai di /admin/prospek (server dan client).

export const STATUSES = [
  ['baru', 'Belum di-chat'],
  ['chat', 'Sudah di-chat'],
  ['balas', 'Dibalas'],
  ['follow', 'Follow up'],
  ['tertarik', 'Tertarik'],
  ['beli', 'Beli'],
  ['tolak', 'Tolak'],
  ['diam', 'Tidak dibalas'],
];
export const STATUS_LABEL = Object.fromEntries(STATUSES);
export const isStatus = (s) => s in STATUS_LABEL;

// Pesan pembuka (versi Keegan, sama dengan sales-kit/08-template-jualan-berbayar.md bagian 1).
export const WA_TEXT = `Halo kak 👋

Aku Keegan dari KR Solutions, usaha lokal Jakarta.

Aku bikin papan review Google NFC + QR: pelanggan tinggal tap HP ke papan, halaman review Google bisnis langsung kebuka.

Nggak perlu cari-cari nama tempatnya di Maps lagi.
Udah dipakai lumayan banyak usaha di jakarta 🙏 (videonya aku lampirin ya).

Papannya juga bisa diarahin ke Instagram, TikTok, WhatsApp, atau link lain, dan bisa diganti kapan aja.

Harganya Rp70rb, atau Rp120rb buat 2 papan. Sekali bayar, desain pakai logo kakak.`;

// 0812-3456-7890 / +62 812... -> 6281234567890 (hanya nomor HP Indonesia).
export function waNumber(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  else if (d.startsWith('8')) d = '62' + d;
  return /^628\d{7,12}$/.test(d) ? d : null;
}

const CITY = { jakbar: 'Jakarta Barat', jaksel: 'Jakarta Selatan', jakpus: 'Jakarta Pusat', jakut: 'Jakarta Utara', jaktim: 'Jakarta Timur' };

// Status dari kolom Status (J) dan catatan chat (N) di Google Sheet prospek lama.
function sheetStatus(j, n) {
  const s = `${j} ${n}`.toLowerCase();
  if (/\bbeli\b/.test(s)) return 'beli';
  if (/tolak|jangan/.test(s)) return 'tolak';
  if (/mau \(gratis\)|titip/.test(s)) return 'tertarik';
  if (/follow/.test(s)) return 'follow';
  if (/tidak dibalas/.test(s)) return 'diam';
  // "Belum dikontak" juga mengandung kata "dikontak", jadi kolom J dicocokkan utuh.
  if (/sudah di-chat|di-dm/.test(s) || j.trim().toLowerCase() === 'dikontak') return 'chat';
  return 'baru';
}

// Baris hasil copy dari Google Sheet "Prospek" (kolom A..N, dipisah tab) -> data prospek.
// A Prioritas, B Area, C Nama, D Rating, E Review, F Jenis, G Alamat, H Telepon/WA, I Instagram,
// J Status, K Tanggal kontak, L Catatan, M -, N Catatan chat WA, O-P -, Q Lat, R Lng.
export function parseSheetRows(text) {
  const out = [];
  for (const line of String(text || '').split(/\r?\n/)) {
    const c = line.split('\t').map((x) => x.trim());
    const name = c[2];
    if (!name || name.toLowerCase() === 'nama') continue;
    const area = c[1] || '';
    const tag = (area.match(/\((jak\w+)\)/i) || [])[1]?.toLowerCase();
    // Ambil nomor pertama saja (sel kadang berisi 2 nomor atau catatan).
    const phone = waNumber((c[7] || '').match(/(?:\+?62|0)\s?8[\d\s-]{7,16}/)?.[0]);
    const ig = (c[8] || '').match(/@[\w.]+/)?.[0] || null;
    const note = [c[11], c[13]].filter(Boolean).join(' · ').slice(0, 500) || null;
    const lat = Number.parseFloat(c[16]);
    const lng = Number.parseFloat(c[17]);
    const hasPos = Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && lat !== 0;
    out.push({
      key: phone || name.toLowerCase().replace(/\s+/g, ' '),
      name: name.slice(0, 120),
      area: area.replace(/\s*\(.*\)\s*$/, '').slice(0, 80) || null,
      city: CITY[tag] || (tag ? null : 'Jakarta Barat'),
      category: (c[5] || '').slice(0, 60) || null,
      address: (c[6] || '').slice(0, 240) || null,
      phone,
      instagram: ig,
      rating: Number.parseFloat(c[3]) || null,
      reviews: Number.parseInt(c[4], 10) || null,
      status: sheetStatus(c[9] || '', c[13] || ''),
      note,
      lat: hasPos ? lat : null,
      lng: hasPos ? lng : null,
    });
  }
  return out;
}
