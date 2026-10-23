import QRCode from 'qrcode';
import { Bodoni_Moda, Cormorant_Garamond, Fraunces, Jost, Marcellus, Playfair_Display } from 'next/font/google';
import './WifiView.css';
import KMark from './KMark';
import CopyButton from './CopyButton';
import { IconChat, IconStar } from './Icons';
import { splitInfo, wifiQrText, wifiTheme } from '@/lib/wifi';

// Font judul per tema (khusus halaman tamu hotel/villa; font brand KR Solutions tetap dipakai di tempat lain).
// preload: false, jadi browser hanya mengunduh font tema yang sedang tampil.
// (next/font mewajibkan setiap font jadi konstanta sendiri dengan opsi literal.)
const fKrem = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--f-krem', display: 'swap', preload: false });
const fNavy = Playfair_Display({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--f-navy', display: 'swap', preload: false });
const fEmerald = Marcellus({ subsets: ['latin'], weight: '400', variable: '--f-emerald', display: 'swap', preload: false });
const fHitam = Bodoni_Moda({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--f-hitam', display: 'swap', preload: false });
const fPutih = Jost({ subsets: ['latin'], weight: ['300', '400'], variable: '--f-putih', display: 'swap', preload: false });
const fTerakota = Fraunces({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--f-terakota', display: 'swap', preload: false });
const FONTS = [fKrem, fNavy, fEmerald, fHitam, fPutih, fTerakota].map((f) => f.variable).join(' ');

const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const Chevron = () => (
  <svg className="wf-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

// Warna QR mengikuti tema (QR selalu di atas kotak putih supaya tetap mudah di-scan).
const QR_INK = { krem: '#1C2230', navy: '#141B2B', emerald: '#0F2E24', hitam: '#0E0E0E', putih: '#191919', terakota: '#3A2418' };

// Halaman WiFi tamu (dipakai /w/KODE dan contoh /contoh-wifi).
// Website tidak bisa menyambungkan HP ke WiFi, jadi tamu menyalin password lalu menempelnya
// di Pengaturan. QR di bawah untuk HP/tablet lain dan langsung tersambung saat di-scan.
// `mark`: teks di lingkaran logo (contoh memakai "LOGO"); kalau kosong, inisial nama tempat.
export default async function WifiView({ wifi, demo = null, mark = null }) {
  const theme = wifiTheme(wifi.theme);
  const qr = await QRCode.toString(wifiQrText(wifi), { type: 'svg', margin: 1, color: { dark: QR_INK[theme], light: '#FFFFFF' } });
  const hasLinks = wifi.wa || wifi.review;
  return (
    <div className={`wf wf-t-${theme} ${FONTS}`}>
      {demo}

      <header className="wf-head">
        <div className={`wf-logo${mark ? ' wf-logo-text' : ''}`} aria-hidden="true"><span>{mark || initials(wifi.name)}</span></div>
        <p className="wf-eyebrow">WiFi untuk tamu</p>
        <h1>{wifi.name}</h1>
        <div className="wf-rule" />
        <p className="wf-welcome">Selamat datang, semoga istirahat kamu nyaman.</p>
      </header>

      <section className="wf-card">
        <div className="wf-row">
          <span className="wf-k">Nama WiFi</span>
          <span className="wf-v">{wifi.ssid}</span>
        </div>
        {wifi.open ? (
          <p className="wf-steps">Tanpa password. Buka <b>Pengaturan → WiFi</b>, lalu pilih <b>{wifi.ssid}</b>.</p>
        ) : (
          <>
            <div className="wf-row">
              <span className="wf-k">Password</span>
              <span className="wf-v">{wifi.pass}</span>
            </div>
            <CopyButton text={wifi.pass} />
            <ol className="wf-steps">
              <li>Buka <b>Pengaturan → WiFi</b></li>
              <li>Pilih <b>{wifi.ssid}</b></li>
              <li>Tahan kolom password, lalu <b>Tempel</b></li>
            </ol>
          </>
        )}
      </section>

      {wifi.info?.length > 0 && (
        <section className="wf-group">
          <h2 className="wf-gh">Info tamu</h2>
          <ul className="wf-list">
            {wifi.info.map((line, i) => {
              const { label, value } = splitInfo(line);
              return (
                <li key={i} className="wf-item">
                  {label && <span className="wf-il">{label}</span>}
                  <span className="wf-iv">{value}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {hasLinks && (
        <section className="wf-group">
          <ul className="wf-list">
            {wifi.wa && (
              <li>
                <a className="wf-link" href={`https://wa.me/${wifi.wa}`} target="_blank" rel="noreferrer">
                  <IconChat width={19} height={19} /> <span>Chat resepsionis</span> <Chevron />
                </a>
              </li>
            )}
            {wifi.review && (
              <li>
                <a className="wf-link" href={wifi.review} target="_blank" rel="noreferrer">
                  <IconStar width={19} height={19} /> <span>Kasih review di Google</span> <Chevron />
                </a>
              </li>
            )}
          </ul>
        </section>
      )}

      <details className="wf-qr">
        <summary>Sambungkan HP atau tablet lain <Chevron /></summary>
        <p>Buka kamera di HP atau tablet lain, arahkan ke QR ini, langsung tersambung.</p>
        <div className="wf-qr-img" dangerouslySetInnerHTML={{ __html: qr }} />
      </details>

      <a className="wf-foot" href="/">
        <KMark size={12} /> WiFi tamu NFC dari KR Solutions
      </a>
    </div>
  );
}
