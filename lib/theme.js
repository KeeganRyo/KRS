// Warna kartu nama. Dipakai di editor (pilihan warna) dan halaman profil (warna latar).
// Teks di kartu selalu putih, jadi warna yang terlalu terang otomatis digelapkan untuk latar.

export const DEFAULT_COLOR = '#2C21C4';

export const COLOR_PRESETS = [
  { hex: '#2C21C4', label: 'Indigo' },
  { hex: '#1C1C1E', label: 'Hitam' },
  { hex: '#12306B', label: 'Navy' },
  { hex: '#0E6B6B', label: 'Teal' },
  { hex: '#1E5B45', label: 'Hijau tua' },
  { hex: '#5A3A22', label: 'Kopi' },
  { hex: '#7A1F2B', label: 'Maroon' },
  { hex: '#5B2A86', label: 'Ungu' },
];

export const normColor = (v) => {
  const s = String(v || '').trim();
  return /^#[0-9a-fA-F]{6}$/.test(s) ? s.toUpperCase() : null;
};

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (c) => '#' + c.map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
const lum = (c) => {
  const [r, g, b] = c.map((x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Variabel CSS untuk halaman kartu nama dari satu warna.
export function themeVars(color) {
  const c = rgb(normColor(color) || DEFAULT_COLOR);
  // Gelapkan sampai teks putih tetap terbaca (kontras >= ~7:1 untuk latar utama).
  let base = c;
  for (let i = 0; i < 12 && lum(base) > 0.06; i++) base = mix(base, [0, 0, 0], 0.15);
  const deep = mix(base, [0, 0, 0], 0.62);
  const glow = mix(c, [255, 255, 255], lum(c) > 0.35 ? 0 : 0.18);
  return {
    '--pf-base': toHex(base),
    '--pf-deep': toHex(deep),
    '--pf-glow': toHex(glow),
    '--pf-accent': toHex(base),
  };
}

// Tata letak halaman kartu nama. 'klasik' = tampilan awal, tidak disimpan di profil.
export const DEFAULT_LAYOUT = 'klasik';
export const LAYOUTS = [
  { key: 'klasik', label: 'Klasik' },
  { key: 'cover', label: 'Cover' },
  { key: 'bento', label: 'Bento' },
  { key: 'putih', label: 'Putih' },
];
export const normLayout = (v) => (LAYOUTS.some((l) => l.key === v) ? v : null);
