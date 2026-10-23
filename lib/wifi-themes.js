// Tema warna halaman WiFi tamu, disamakan dengan pilihan warna papan akrilik.
// Aman dipakai di browser (tanpa import server).
export const WIFI_THEMES = {
  krem: 'Krem klasik',
  navy: 'Navy',
  emerald: 'Hijau emerald',
  hitam: 'Hitam & emas',
  putih: 'Putih minimal',
  terakota: 'Terakota',
};
export const wifiTheme = (t) => (Object.hasOwn(WIFI_THEMES, t) ? t : 'krem');

