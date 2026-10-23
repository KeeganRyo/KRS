import WifiView from '@/components/WifiView';
import { WIFI_THEMES, wifiTheme } from '@/lib/wifi-themes';

// Contoh halaman WiFi tamu untuk demo papan WiFi NFC. Hotel, WiFi, dan nomor di sini fiktif.
// ?tema=navy dll menampilkan tema lain, supaya calon klien bisa membandingkan.
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

const DOT = { krem: '#F6F4EF', navy: '#141B2B', emerald: '#0F2E24', hitam: '#0E0E0E', putih: '#FFFFFF', terakota: '#C9805F' };

export default async function ContohWifi({ searchParams }) {
  const theme = wifiTheme((await searchParams)?.tema);
  const picker = (
    <div className="wf-demo">
      <p>Contoh · data hotel fiktif · pilih tema</p>
      <nav aria-label="Tema">
        {Object.entries(WIFI_THEMES).map(([t, label]) => (
          <a key={t} href={`?tema=${t}`} aria-current={t === theme ? 'page' : undefined}>
            <i style={{ background: DOT[t] }} /> {label}
          </a>
        ))}
      </nav>
    </div>
  );
  return <WifiView wifi={{ ...DEMO, theme }} demo={picker} mark="LOGO" />;
}
