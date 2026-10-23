import WifiView from '@/components/WifiView';

// Contoh halaman WiFi tamu untuk demo papan WiFi NFC. Hotel, WiFi, dan nomor di sini fiktif.
export const metadata = { title: 'Contoh WiFi tamu · Hotel Contoh', description: 'Contoh halaman WiFi tamu untuk papan NFC KR Solutions.', robots: { index: false } };

// Bentuk data sama dengan yang disimpan pemilik kartu (lib/wifi.js).
const DEMO = {
  name: 'Hotel Contoh',
  ssid: 'HotelContoh_Tamu',
  pass: 'selamatdatang123',
  wa: '6281200000000',
  info: ['Sarapan: 06.30–10.00, Lantai 1', 'Check-out: 12.00', 'Kolam renang: 07.00–21.00'],
  review: 'https://www.google.com/maps',
};

export default function ContohWifi() {
  return <WifiView wifi={DEMO} demo />;
}
