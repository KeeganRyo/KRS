// Invoice KR Solutions: hitungan, nomor, dan gambar invoice (SVG -> PNG di browser).
// Tampilan meniru template lama my-video/sales-kit/invoice/invoice.html. Dipakai server dan client.

export const STATUSES = [
  ['unpaid', 'Belum dibayar'],
  ['paid', 'Lunas'],
  ['void', 'Batal'],
];
export const STATUS_LABEL = Object.fromEntries(STATUSES);
export const isInvoiceStatus = (s) => s in STATUS_LABEL;

export const PAYMENT = { bank: 'BCA 0760146056', holder: 'Keegan Ryo Soerjadi', wa: '0877-7665-2015' };

// Produk siap pilih (harga sama dengan teks WA di lib/prospects.js). Sisanya diisi manual.
export const PRESETS = [
  { name: 'Papan Review Google NFC + QR', detail: '1 pcs · akrilik cetak UV, desain custom', qty: 1, amount: 70000 },
  { name: 'Papan Review Google NFC + QR', detail: 'Paket 2 pcs · akrilik cetak UV, desain custom', qty: 2, amount: 120000 },
];

const rpFmt = new Intl.NumberFormat('id-ID');
export const rp = (n) => `Rp${rpFmt.format(Math.round(Number(n) || 0))}`;

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
// '2026-10-29' -> '29 Oktober 2026'
export function longDate(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : '';
}

// Tanggal hari ini di Jakarta, format YYYY-MM-DD.
export const todayJakarta = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());

export const subtotal = (inv) => (inv.items || []).reduce((s, it) => s + (Number(it.amount) || 0), 0);
export const total = (inv) => Math.max(0, subtotal(inv) - (Number(inv.discount) || 0));

// Nomor berikutnya: urutan terakhir + 1, tanggal = tanggal invoice.
export function nextNumber(numbers, issuedOn) {
  const last = numbers.reduce((max, n) => Math.max(max, Number((String(n).match(/-(\d{3,})$/) || [])[1]) || 0), 0);
  return `INV-KRS-${String(issuedOn).replace(/-/g, '')}-${String(last + 1).padStart(3, '0')}`;
}

// Bersihkan item dari form. Baris tanpa nama dibuang.
export function cleanItems(list) {
  return (Array.isArray(list) ? list : [])
    .map((it) => ({
      name: String(it?.name || '').trim().slice(0, 80),
      detail: String(it?.detail || '').trim().slice(0, 120),
      qty: Math.max(1, Math.min(999, Number.parseInt(it?.qty, 10) || 1)),
      amount: Math.max(0, Math.min(100_000_000, Math.round(Number(it?.amount) || 0))),
    }))
    .filter((it) => it.name)
    .slice(0, 20);
}

export const fileName = (inv) => `invoice-${String(inv.buyer || 'kr').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'kr'}${inv.status === 'paid' ? '-LUNAS' : ''}.png`;

// Pesan WA untuk pembeli (gambar invoice dilampirkan manual).
export function waMessage(inv) {
  if (inv.status === 'paid') {
    return `Halo kak, terima kasih pembayarannya 🙏\n\nTerlampir invoice LUNAS ${inv.number} (${rp(total(inv))}).`;
  }
  return `Halo kak, berikut invoice ${inv.number}.\n\nTotal: ${rp(total(inv))}\nTransfer ke ${PAYMENT.bank} a.n. ${PAYMENT.holder}.\n\nKalau sudah transfer, mohon kirim bukti transfernya di chat ini ya. Terima kasih 🙏`;
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Pecah teks per kata supaya muat di kolom (perkiraan jumlah karakter).
function wrap(text, max) {
  const out = [];
  let line = '';
  for (const w of String(text || '').split(/\s+/).filter(Boolean)) {
    if (line && (line + ' ' + w).length > max) { out.push(line); line = w; } else line = line ? `${line} ${w}` : w;
  }
  if (line) out.push(line);
  return out;
}

const K_PATH = 'M295 0 L500 0 Q522 2 516 22 L443 199 Q437 210 427 210 L285 210 Q264 214 272 237 L672 652 Q684 675 662 681 L417 681 Q408 680 403 673 C352 612 297 540 270 475 C240 400 228 330 228 245 C228 170 250 95 280 10 Q284 0 295 0 Z';

const BADGE = {
  unpaid: { text: 'BELUM DIBAYAR', bg: '#FFF4E0', fg: '#A15C00', w: 118 },
  paid: { text: 'LUNAS', bg: '#E6F4EA', fg: '#1B7A3A', w: 64 },
  void: { text: 'BATAL', bg: '#EEEFF2', fg: '#6B7080', w: 62 },
};

// Gambar invoice lebar 600 (unit = px CSS). Mengembalikan { svg, w, h }.
export function invoiceSvg(inv, fontCss = '') {
  const W = 600;
  const L = 40;
  const R = W - 40;
  const ink = '#16181D';
  const mute = '#6B7080';
  const line = '#E6E8EC';
  const parts = [];
  const t = (x, y, s, { size = 13.5, w = 400, fill = ink, anchor = 'start', ls = 0 } = {}) =>
    parts.push(`<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}"${ls ? ` letter-spacing="${ls}"` : ''}>${esc(s)}</text>`);

  // Kepala: logo, nama, judul, nomor, status.
  parts.push(`<rect x="${L}" y="40" width="56" height="56" rx="14" fill="#0C0D0F"/>`);
  parts.push(`<g transform="translate(${L + 14} 54) scale(${28 / 684})"><rect width="208" height="677" rx="16" fill="#fff"/><path d="${K_PATH}" fill="#fff"/></g>`);
  t(L + 70, 64, 'KR Solutions', { size: 19, w: 600 });
  t(L + 70, 84, 'Papan NFC + QR', { size: 12.5, fill: mute });
  t(R, 66, 'INVOICE', { size: 26, w: 600, anchor: 'end', ls: 3 });
  t(R, 88, `No. ${inv.number || 'INV-KRS-…'}`, { size: 12.5, fill: mute, anchor: 'end' });
  const b = BADGE[inv.status] || BADGE.unpaid;
  parts.push(`<rect x="${R - b.w}" y="98" width="${b.w}" height="22" rx="11" fill="${b.bg}"/>`);
  t(R - b.w / 2, 113, b.text, { size: 11, w: 600, fill: b.fg, anchor: 'middle', ls: 1 });

  // Pembeli dan tanggal.
  let y = 156;
  t(L, y, 'DITAGIHKAN KEPADA', { size: 11, fill: mute, ls: 1 });
  t(R, y, 'TANGGAL', { size: 11, fill: mute, anchor: 'end', ls: 1 });
  const buyer = wrap(inv.buyer || '-', 40);
  buyer.forEach((s, i) => t(L, y + 22 + i * 18, s, { size: 13.5, w: 600 }));
  t(R, y + 22, longDate(inv.issued_on), { size: 13.5, w: 600, anchor: 'end' });
  y += 22 + (buyer.length - 1) * 18 + 30;

  // Tabel produk.
  const qx = 452;
  t(L, y, 'PRODUK', { size: 11, fill: mute, ls: 1 });
  t(qx, y, 'QTY', { size: 11, fill: mute, anchor: 'end', ls: 1 });
  t(R, y, 'JUMLAH', { size: 11, fill: mute, anchor: 'end', ls: 1 });
  y += 12;
  parts.push(`<rect x="${L}" y="${y}" width="${R - L}" height="1.5" fill="${ink}"/>`);
  for (const it of inv.items || []) {
    let ry = y + 26;
    const names = wrap(it.name, 46);
    names.forEach((s, i) => t(L, ry + i * 18, s));
    t(qx, ry, String(it.qty), { anchor: 'end' });
    t(R, ry, rp(it.amount), { anchor: 'end' });
    ry += (names.length - 1) * 18;
    for (const s of wrap(it.detail, 56)) { ry += 18; t(L, ry, s, { size: 12, fill: mute }); }
    y = ry + 16;
    parts.push(`<rect x="${L}" y="${y}" width="${R - L}" height="1" fill="${line}"/>`);
  }

  // Total.
  const tx = R - 260;
  y += 30;
  t(tx, y, 'Subtotal');
  t(R, y, rp(subtotal(inv)), { anchor: 'end' });
  if (Number(inv.discount) > 0) {
    y += 28;
    t(tx, y, 'Potongan');
    t(R, y, `−${rp(inv.discount)}`, { anchor: 'end' });
    for (const s of wrap(inv.discount_note, 36)) { y += 16; t(tx, y, s, { size: 11.5, fill: mute }); }
  }
  y += 16;
  parts.push(`<rect x="${tx}" y="${y}" width="260" height="1.5" fill="${ink}"/>`);
  y += 28;
  t(tx, y, 'Total', { size: 17, w: 600 });
  t(R, y, rp(total(inv)), { size: 17, w: 600, anchor: 'end' });

  // Pembayaran.
  y += 30;
  const noteLines = wrap(inv.note, 70);
  const boxH = 86 + noteLines.length * 20;
  parts.push(`<rect x="${L}" y="${y}" width="${R - L}" height="${boxH}" rx="12" fill="#F4F5F7"/>`);
  t(L + 18, y + 26, 'PEMBAYARAN', { size: 11, fill: mute, ls: 1 });
  const bank = `<tspan font-weight="600">${esc(PAYMENT.bank)}</tspan> a.n. ${esc(PAYMENT.holder)}`;
  if (inv.status === 'paid') {
    parts.push(`<text x="${L + 18}" y="${y + 50}" font-size="13" fill="${ink}">Sudah dibayar via transfer ke: ${bank}</text>`);
    parts.push(`<text x="${L + 18}" y="${y + 72}" font-size="13" fill="${ink}">Status: <tspan font-weight="600" fill="#1B7A3A">LUNAS</tspan>${inv.paid_on ? ` · ${esc(longDate(inv.paid_on))}` : ''}</text>`);
  } else {
    parts.push(`<text x="${L + 18}" y="${y + 50}" font-size="13" fill="${ink}">Transfer ke: ${bank}</text>`);
    t(L + 18, y + 72, `Mohon kirim bukti transfer via WhatsApp ${PAYMENT.wa}.`, { size: 13 });
  }
  noteLines.forEach((s, i) => t(L + 18, y + 96 + i * 20, s, { size: 12.5, fill: mute }));
  y += boxH + 26;

  // Kaki.
  parts.push(`<rect x="${L}" y="${y}" width="${R - L}" height="1" fill="${line}"/>`);
  y += 24;
  t(L, y, 'krsolutions.tech · IG @krsolutions.id', { size: 12, fill: mute });
  t(R, y, 'Terima kasih!', { size: 12, fill: mute, anchor: 'end' });
  const H = Math.ceil(y + 32);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
    + (fontCss ? `<style>${fontCss}</style>` : '')
    + `<g font-family="Poppins, 'Segoe UI', Arial, sans-serif"><rect width="${W}" height="${H}" fill="#fff"/>${parts.join('')}</g></svg>`;
  return { svg, w: W, h: H };
}
