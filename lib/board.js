// Desain papan NFC + QR sebagai SVG (dipakai di /admin/desain). Sama dengan template mockup lama
// (tools/mockup/mock.html): putih, blob warna logo di 4 sudut, logo di tengah, baris NFC | QR.
// Satuan papan: 728 = 10 cm. Bisa dipanggil di browser (tanpa server-only).
import QRCode from 'qrcode';

export const UNIT_PER_MM = 7.28;
export const BLEED = 3 * UNIT_PER_MM; // 3 mm

export const HEADINGS = {
  review: { label: 'Review Google', l1: 'Tinggalkan review', l2: 'kamu di Google' },
  menu: { label: 'Papan menu', l1: 'Scan untuk', l2: 'lihat menu' },
  info: { label: 'Info tamu', l1: 'WiFi & info', l2: 'untuk tamu' },
  ig: { label: 'Instagram', l1: 'Follow kami', l2: 'di Instagram' },
  wa: { label: 'WhatsApp', l1: 'Chat kami', l2: 'di WhatsApp' },
  custom: { label: 'Tulisan sendiri', l1: '', l2: '' },
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const hx = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a, b, t) => {
  const x = hx(a), y = hx(b);
  return '#' + x.map((v, i) => Math.round(v * (1 - t) + y[i] * t).toString(16).padStart(2, '0')).join('');
};
export const isHex = (s) => /^#[0-9a-f]{6}$/i.test(String(s || ''));

// Blob acak per bisnis (seed dari nama): bentuk sama setiap kali dirender ulang.
// bleed > 0: sisi luar blob diperpanjang ke area bleed supaya tidak ada garis putih saat dipotong.
function blobs(name, acc, bleed) {
  let seed = [...String(name || 'KR')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = (a, b) => { seed = (seed * 1664525 + 1013904223) >>> 0; return a + (seed / 4294967296) * (b - a); };
  const cols = [acc, mix(acc, '#FFFFFF', 0.45), mix(acc, '#000000', 0.22), mix(acc, '#FFFFFF', 0.68)];
  for (let i = cols.length - 1; i > 0; i--) { const j = Math.floor(rnd(0, i + 1)); [cols[i], cols[j]] = [cols[j], cols[i]]; }
  const lim = [[230, 190], [250, 215], [135, 125], [150, 120]];
  const corner = [[0, 0, 1, 1], [728, 0, -1, 1], [0, 728, 1, -1], [728, 728, -1, -1]];
  const B = bleed;
  let svg = '';
  corner.forEach(([ox, oy, sx, sy], i) => {
    const [W, H] = lim[i];
    const w = rnd(W * 0.62, W), h = rnd(H * 0.62, H);
    const mx = w * rnd(0.3, 0.62), my = h * rnd(0.3, 0.62);
    const P = (x, y) => (ox + sx * x).toFixed(1) + ' ' + (oy + sy * y).toFixed(1);
    const d = 'M' + P(-B, -B) + 'L' + P(w, -B) + 'L' + P(w, 0) + 'C' + P(w + rnd(-10, 25), h * rnd(0.15, 0.4)) + ' ' + P(mx + w * rnd(0.1, 0.3), my - h * rnd(0.15, 0.3)) + ' ' + P(mx, my)
      + 'C' + P(mx - w * rnd(0.1, 0.3), my + h * rnd(0.15, 0.3)) + ' ' + P(w * rnd(0.15, 0.4), h + rnd(-10, 25)) + ' ' + P(0, h) + 'L' + P(-B, h) + 'Z';
    svg += `<path fill="${cols[i]}" d="${d}"/>`;
    if (i < 2 && rnd(0, 1) < 0.75) {
      const r = Math.min(rnd(14, 24), Math.min(w, h) * 0.13);
      const cx = rnd(r + 12, Math.max(r + 12, w * 0.3)), cy = rnd(r + 12, Math.max(r + 12, h * 0.3));
      svg += `<circle fill="#fff" cx="${(ox + sx * cx).toFixed(1)}" cy="${(oy + sy * cy).toFixed(1)}" r="${r.toFixed(1)}"/>`;
    }
  });
  const dots = [[rnd(696, 712), rnd(250, 360), rnd(7, 11), acc], [rnd(16, 34), rnd(380, 470), rnd(6, 9), mix(acc, '#FFFFFF', 0.35)]];
  if (rnd(0, 1) < 0.6) dots.push([rnd(640, 700), rnd(470, 520), rnd(5, 7), mix(acc, '#FFFFFF', 0.5)]);
  dots.forEach(([x, y, r, c]) => { svg += `<circle fill="${c}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>`; });
  return svg;
}

// QR sebagai satu path (vektor, tajam saat dicetak).
export function qrPath(text) {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  let d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.modules.get(x, y)) d += `M${x} ${y}h1v1h-1z`;
  return { n, d };
}

// Nama di lingkaran warna (kalau tidak ada logo): dipecah maksimal 3 baris.
function wordMark(text, acc) {
  const t = String(text || '').trim() || 'Logo';
  const size = t.length <= 6 ? 42 : t.length <= 10 ? 32 : t.length <= 14 ? 28 : t.length <= 20 ? 25 : 22;
  const max = Math.floor(146 / (size * 0.58));
  const lines = [];
  for (const w of t.split(/\s+/)) {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + ' ' + w).length <= max) lines[lines.length - 1] = last + ' ' + w;
    else lines.push(w);
  }
  const shown = lines.slice(0, 3);
  const lh = size * 1.15;
  const y0 = 165 - ((shown.length - 1) * lh) / 2 + size * 0.35;
  return `<circle cx="364" cy="165" r="95" fill="${acc}"/>` + shown.map((l, i) =>
    `<text x="364" y="${(y0 + i * lh).toFixed(1)}" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="${size}" fill="#fff">${esc(l)}</text>`).join('');
}

const G = '<tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>';

function heading(type, l1, l2, acc) {
  const base = 'x="364" text-anchor="middle" font-family="Poppins" font-size="54"';
  if (type === 'review') {
    return `<text ${base} y="352" font-weight="500" fill="#1F1F1F">Tinggalkan review</text><text ${base} y="421" font-weight="500" fill="#1F1F1F">kamu di ${G}</text>`;
  }
  const fill = type === 'ig' ? 'url(#igGrad)' : type === 'wa' ? '#1FAF54' : mix(acc, '#000000', 0.15);
  const one = !String(l2 || '').trim();
  return `<text ${base} y="${one ? 386 : 352}" font-weight="500" fill="#1F1F1F">${esc(l1)}</text>`
    + (one ? '' : `<text ${base} y="421" font-weight="600" fill="${fill}">${esc(l2)}</text>`);
}

const NFC_ICON = '<g transform="translate(169.5 490) scale(4.333)" fill="none" stroke="#1F1F1F" stroke-width="1.7" stroke-linecap="round"><path d="M7 8.5a5 5 0 0 1 0 7M10.5 6a8.5 8.5 0 0 1 0 12M14 3.5a12 12 0 0 1 0 17"/><circle cx="4" cy="12" r="1.3" fill="#1F1F1F" stroke="none"/></g>';

// Isi papan (tanpa <svg> pembungkus), koordinat 0..728.
// o: { name, acc, logo (data URL) | null, word, type, l1, l2, qr: {n, d}, bleed }
export function boardInner(o) {
  const acc = isHex(o.acc) ? o.acc : '#B8916A';
  const B = o.bleed || 0;
  const qrScale = 150 / o.qr.n;
  const mark = o.logo
    ? `<circle cx="364" cy="169" r="101" fill="#000" opacity=".12" filter="url(#soft)"/><circle cx="364" cy="165" r="101" fill="#fff"/>`
      + `<clipPath id="logoClip"><circle cx="364" cy="165" r="95"/></clipPath>`
      + `<image href="${o.logo}" x="269" y="70" width="190" height="190" preserveAspectRatio="xMidYMid slice" clip-path="url(#logoClip)"/>`
    : `<circle cx="364" cy="165" r="101" fill="#fff"/>` + wordMark(o.word || o.name, acc);
  return `<defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>`
    + `<linearGradient id="igGrad" x1="0" x2="1"><stop offset="0" stop-color="#F58529"/><stop offset=".45" stop-color="#DD2A7B"/><stop offset=".75" stop-color="#8134AF"/><stop offset="1" stop-color="#515BD4"/></linearGradient></defs>`
    + `<rect x="${-B}" y="${-B}" width="${728 + 2 * B}" height="${728 + 2 * B}" fill="#fff"/>`
    + blobs(o.name, acc, B)
    + mark
    + heading(o.type, o.l1, o.l2, acc)
    + NFC_ICON
    + `<text x="221.5" y="633" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="32" fill="#1F1F1F">NFC</text>`
    + `<text x="221.5" y="664" text-anchor="middle" font-family="Poppins" font-size="19" fill="#3A3A3A">Tempelkan HP kamu</text>`
    + `<rect x="363" y="499" width="2" height="170" fill="#D9D9D9"/>`
    + `<g transform="translate(431.5 490) scale(${qrScale})"><path fill="#1F1F1F" d="${o.qr.d}" shape-rendering="crispEdges"/></g>`
    + `<text x="506.5" y="664" text-anchor="middle" font-family="Poppins" font-size="19" fill="#3A3A3A">Scan QR</text>`;
}

// SVG papan siap cetak: 106 x 106 mm (10 cm + bleed 3 mm tiap sisi).
export function boardSvg(o, fontCss = '') {
  const B = BLEED;
  const s = 728 + 2 * B;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${(s / UNIT_PER_MM).toFixed(2)}mm" height="${(s / UNIT_PER_MM).toFixed(2)}mm" viewBox="${-B} ${-B} ${s} ${s}">`
    + (fontCss ? `<style>${fontCss}</style>` : '') + boardInner({ ...o, bleed: B }) + '</svg>';
}

// Mockup untuk dikirim ke prospek (1080 x 1350): papan di atas foto tempatnya (atau warna polos).
export function sceneSvg(o, fontCss = '') {
  const acc = isHex(o.acc) ? o.acc : '#B8916A';
  const sceneCol = mix(acc, '#FFFFFF', 0.82);
  const photo = Boolean(o.photo);
  const name = String(o.name || '');
  const nameSize = name.length > 30 ? 40 : name.length > 24 ? 46 : name.length > 20 ? 52 : 58;
  const light = photo ? '#fff' : '#1E1A16';
  const soft = photo ? 'rgba(255,255,255,.85)' : '#6B6157';
  const bg = photo
    ? `<filter id="blur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="7"/></filter>`
      + `<image href="${o.photo}" x="-30" y="-30" width="1140" height="1410" preserveAspectRatio="xMidYMid slice" filter="url(#blur)"/>`
      + `<linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C0A08" stop-opacity=".62"/><stop offset=".35" stop-color="#0C0A08" stop-opacity=".25"/><stop offset=".7" stop-color="#0C0A08" stop-opacity=".35"/><stop offset="1" stop-color="#0C0A08" stop-opacity=".7"/></linearGradient>`
      + `<rect width="1080" height="1350" fill="url(#shade)"/>`
    : `<radialGradient id="scene" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${sceneCol}"/></radialGradient><rect width="1080" height="1350" fill="url(#scene)"/>`;
  const leg = (x) => `<rect x="${x}" y="1030" width="120" height="58" rx="14" fill="#fff" fill-opacity=".75" filter="url(#legShadow)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">`
    + (fontCss ? `<style>${fontCss}</style>` : '')
    + `<defs><filter id="frameShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="40" stdDeviation="34" flood-color="#1E140A" flood-opacity=".45"/></filter>`
    + `<filter id="legShadow" x="-30%" y="-30%" width="160%" height="200%"><feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#1E140A" flood-opacity=".35"/></filter>`
    + `<clipPath id="boardClip"><rect x="0" y="0" width="728" height="728" rx="30"/></clipPath></defs>`
    + bg
    + `<text x="540" y="128" text-anchor="middle" font-family="Poppins" font-weight="500" font-size="30" fill="${soft}">Contoh desain</text>`
    + `<text x="540" y="${128 + 12 + nameSize}" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="${nameSize}" fill="${light}">${esc(name)}</text>`
    + leg(340) + leg(620)
    + `<rect x="160" y="290" width="760" height="760" rx="44" fill="#fff" fill-opacity=".72" stroke="#fff" stroke-width="2" filter="url(#frameShadow)"/>`
    + `<svg x="176" y="306" width="728" height="728" viewBox="0 0 728 728"><g clip-path="url(#boardClip)">${boardInner({ ...o, bleed: 0 })}</g></svg>`
    + `<text x="540" y="1266" text-anchor="middle" font-family="Poppins" font-size="25" fill="${soft}">Papan akrilik NFC + QR · desain oleh <tspan font-weight="600" fill="${photo ? '#fff' : '#2C21C4'}">KR Solutions</tspan></text>`
    + '</svg>';
}

// Warna aksen dari logo: warna berwarna yang paling dominan; logo hitam-putih -> charcoal.
// px: Uint8ClampedArray RGBA (gambar kecil, misalnya 64x64).
export function accentFromPixels(px) {
  const counts = new Map();
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] < 128) continue;
    const q = [px[i], px[i + 1], px[i + 2]].map((c) => Math.floor(c / 20) * 20 + 10);
    const k = q.join(',');
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  const total = px.length / 4;
  let best = null;
  let colored = 0;
  for (const [k, n] of counts) {
    const [r, g, b] = k.split(',').map((v) => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    if (l > 0.15 && l < 0.88 && s > 0.25) {
      colored += n;
      const score = n * s * (1.25 - Math.abs(l - 0.5));
      if (!best || score > best.score) best = { score, k };
    }
  }
  if (!best || colored < total * 0.04) return '#222222';
  return '#' + best.k.split(',').map((v) => Number(v).toString(16).padStart(2, '0')).join('');
}
