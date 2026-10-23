import QRCode from 'qrcode';
import './WifiView.css';
import KMark from './KMark';
import CopyButton from './CopyButton';
import { IconChat, IconStar } from './Icons';
import { splitInfo, wifiQrText } from '@/lib/wifi';

const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const Chevron = () => (
  <svg className="wf-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

// Halaman WiFi tamu (dipakai /w/KODE dan contoh /contoh-wifi).
// Website tidak bisa menyambungkan HP ke WiFi, jadi tamu menyalin password lalu menempelnya
// di Pengaturan. QR di bawah untuk perangkat lain (laptop/tablet) dan langsung tersambung saat di-scan.
export default async function WifiView({ wifi, demo = false }) {
  const qr = await QRCode.toString(wifiQrText(wifi), { type: 'svg', margin: 1, color: { dark: '#1C2230', light: '#FFFFFF' } });
  const hasLinks = wifi.wa || wifi.review;
  return (
    <div className="wf">
      {demo && <p className="wf-demo">Contoh halaman WiFi · data hotel fiktif</p>}

      <header className="wf-head">
        <div className="wf-logo" aria-hidden="true">{initials(wifi.name)}</div>
        <p className="wf-eyebrow">WiFi untuk tamu</p>
        <h1>{wifi.name}</h1>
        <p className="wf-welcome">Selamat datang. Semoga istirahat kamu nyaman.</p>
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
              <span className="wf-v wf-pass">{wifi.pass}</span>
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
                  <IconChat width={20} height={20} /> <span>Chat resepsionis</span> <Chevron />
                </a>
              </li>
            )}
            {wifi.review && (
              <li>
                <a className="wf-link" href={wifi.review} target="_blank" rel="noreferrer">
                  <IconStar width={20} height={20} /> <span>Kasih review di Google</span> <Chevron />
                </a>
              </li>
            )}
          </ul>
        </section>
      )}

      <details className="wf-qr">
        <summary>Sambungkan laptop atau tablet <Chevron /></summary>
        <p>Scan QR ini pakai kamera perangkat lain, langsung tersambung.</p>
        <div className="wf-qr-img" dangerouslySetInnerHTML={{ __html: qr }} />
      </details>

      <a className="wf-foot" href="/">
        <KMark size={13} /> WiFi tamu NFC dari KR Solutions
      </a>
    </div>
  );
}
