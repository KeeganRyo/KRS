// Poster ucapan hari besar 1080×1350 (feed IG / WA) sebagai SVG. Port dari
// my-video/out/print/hari-besar/template.html: putih, judul Instrument Serif, logo KR, ilustrasi per hari (lib/poster-art.js).
// Teks isi pakai Poppins (font yang sudah disisipkan untuk /admin/desain).

import { artSvg } from './poster-art';

export const POSTER_W = 1080;
export const POSTER_H = 1350;

const K_PATH = 'M295 0 L500 0 Q522 2 516 22 L443 199 Q437 210 427 210 L285 210 Q264 214 272 237 L672 652 Q684 675 662 681 L417 681 Q408 680 403 673 C352 612 297 540 270 475 C240 400 228 330 228 245 C228 170 250 95 280 10 Q284 0 295 0 Z';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lines = (s) => String(s || '').split('|').map((x) => x.trim()).filter(Boolean);

// Perkiraan lebar teks kalau tidak ada pengukur dari browser (Instrument Serif ±0,42 em per huruf).
const guess = (text, size, family) => text.length * size * (family === 'serif' ? 0.42 : 0.56);

// o = { tag, title, date, msg, acc, acc2, art }; art = kunci ilustrasi (kosong = lingkaran polos). measure(text, sizePx, 'serif'|'sans') -> lebar px (opsional).
export function posterSvg(o, fontCss = '', measure = guess) {
  const X = 88;
  const maxW = POSTER_W - X * 2;
  const acc = o.acc || '#C8102E';
  const acc2 = o.acc2 || '#F2B705';
  const title = lines(o.title);
  const msg = lines(o.msg);

  // Judul sebesar mungkin sampai 124 px, mengecil kalau ada baris yang lebih lebar dari kanvas.
  const widest = Math.max(1, ...title.map((t) => measure(t, 124, 'serif')));
  const ts = Math.max(64, Math.min(124, Math.floor((124 * maxW) / widest)));
  const tl = ts * 0.95;

  // Susun dari bawah ke atas: footer, pesan, tanggal, judul, label.
  const footY = POSTER_H - 76 - 6;
  const ruleY = footY - 24 - 28;
  let y = ruleY - 64;
  const msgYs = msg.map((_, i) => y - (msg.length - 1 - i) * 46 - 10);
  y = (msg.length ? msgYs[0] - 32 - 30 : y) - 6;
  const dateY = y;
  y = dateY - 32 - 26;
  const titleYs = title.map((_, i) => y - (title.length - 1 - i) * tl);
  const tagBottom = (titleYs[0] ?? y) - ts * 0.78 - 34;
  const tagW = measure(String(o.tag || ''), 22, 'sans') * 1.08 + String(o.tag || '').length * 22 * 0.16 + 44;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${POSTER_W}" height="${POSTER_H}" viewBox="0 0 ${POSTER_W} ${POSTER_H}">
<defs><style>${fontCss}
.s{font-family:Poppins,Arial,sans-serif}.t{font-family:'Instrument Serif',Georgia,serif}</style></defs>
<rect width="${POSTER_W}" height="${POSTER_H}" fill="#fff"/>
${o.art ? artSvg(o.art, acc, acc2) : `<circle cx="980" cy="80" r="310" fill="${acc}"/>
<circle cx="650" cy="280" r="130" fill="${acc2}"/>
<circle cx="900" cy="480" r="53" fill="none" stroke="${acc}" stroke-width="14"/>`}
<g transform="translate(${X} 84) scale(${36 / 684})" fill="#111113"><rect width="208" height="677" rx="16"/><path d="${K_PATH}"/></g>
<text class="s" x="${X + 50}" y="113" font-size="28" font-weight="600" fill="#111113">KR Solutions</text>
${o.tag ? `<rect x="${X}" y="${tagBottom - 50}" width="${tagW}" height="50" rx="25" fill="#F4F4F7"/>
<text class="s" x="${X + 22}" y="${tagBottom - 17}" font-size="22" font-weight="600" letter-spacing="3.5" fill="${acc}">${esc(o.tag)}</text>` : ''}
${title.map((t, i) => `<text class="t" x="${X - 4}" y="${titleYs[i]}" font-size="${ts}" letter-spacing="${(-ts * 0.015).toFixed(1)}" fill="#111113">${esc(t)}</text>`).join('\n')}
<text class="s" x="${X}" y="${dateY}" font-size="32" font-weight="600" fill="${acc}">${esc(o.date)}</text>
${msg.map((t, i) => `<text class="s" x="${X}" y="${msgYs[i]}" font-size="32" fill="#5E5E66">${esc(t)}</text>`).join('\n')}
<rect x="${X}" y="${ruleY}" width="${maxW}" height="2" fill="#E5E5EA"/>
<text class="s" x="${X}" y="${footY}" font-size="24" fill="#5E5E66">Papan &amp; kartu NFC untuk bisnis</text>
<text class="s" x="${POSTER_W - X}" y="${footY}" font-size="24" font-weight="600" text-anchor="end" fill="#111113">krsolutions.tech</text>
</svg>`;
}
