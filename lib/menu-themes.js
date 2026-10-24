// Tema halaman menu digital. Aman dipakai di browser (tanpa import server).
// 'krem' = tampilan lama, jadi menu yang disimpan sebelum ada tema tetap terlihat sama.
export const MENU_THEMES = {
  krem: 'Krem kopi',
  hitam: 'Espresso gelap',
  matcha: 'Hijau matcha',
  putih: 'Putih minimal',
  pastel: 'Pastel manis',
  retro: 'Retro warung',
};
export const menuTheme = (t) => (Object.hasOwn(MENU_THEMES, t) ? t : 'krem');

// Warna contoh tiap tema (latar, aksen) untuk pilihan tema di editor dan halaman contoh; sama dengan MenuView.css.
export const MENU_SWATCH = {
  krem: ['#F7F3EE', '#3B2A1E'],
  hitam: ['#14110F', '#C8A46A'],
  matcha: ['#EEF2E6', '#4F7A4A'],
  putih: ['#FFFFFF', '#111111'],
  pastel: ['#FFF0F3', '#FF6F91'],
  retro: ['#FBF3E0', '#D7372F'],
};
