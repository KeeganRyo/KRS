import './landing.css';
import EditCodeForm from '@/components/EditCodeForm';
import KMark from '@/components/KMark';

export const metadata = {
  title: 'KR Solutions | NFC automation untuk bisnis kamu',
  description:
    'Papan akrilik NFC dan QR: satu tap membuka review Google, menu, atau sosmed bisnis kamu. Desain bisa custom.',
  robots: { index: true, follow: true },
};

const GRAB = 'https://lynk.id/krsolutions';

const USES = [
  { img: '/papan.jpg', alt: 'Papan review Google dengan ikon NFC dan kode QR', t: 'Review Google', d: 'Tap atau scan, halaman review bisnis kamu langsung terbuka. Tanpa ngetik link.' },
  { img: '/d-menu-white.jpg', alt: 'Papan menu dengan tulisan See our Menu, ikon NFC, dan kode QR', t: 'Menu digital', d: 'Pelanggan buka menu di HP mereka. Ganti isi menu kapan saja, papannya tetap sama.' },
  { img: null, t: 'Sosmed dan link lain', d: 'Arahkan ke Instagram, WhatsApp, atau halaman promo. Tujuan tap bisa diganti tanpa cetak ulang.' },
];

const DESIGNS = [
  ['/d-orange.jpg', 'Desain review dengan garis oranye'],
  ['/d-green.jpg', 'Desain review dengan pola geometris hijau'],
  ['/d-blue.jpg', 'Desain review dengan gradien biru'],
  ['/d-sunset.jpg', 'Desain review dengan latar oranye gelap'],
  ['/d-menu-black.jpg', 'Desain menu hitam dengan sudut membulat'],
];

export default function Home() {
  return (
    <div className="site">
      <header className="s-hero">
        <div className="s-wrap">
          <nav className="s-nav" aria-label="Utama">
            <a className="s-brand" href="#" aria-label="KR Solutions"><KMark /> KR Solutions</a>
            <a className="s-pill" href="#edit">Edit kartu</a>
          </nav>
          <div className="s-herogrid">
            <div className="s-copy">
              <h1>Satu tap. Review, menu, dan sosmed kamu langsung terbuka.</h1>
              <p className="s-lead">
                NFC automation untuk bisnis. Papan akrilik dengan chip NFC dan QR yang bisa diarahkan ke
                mana saja, dengan desain sesuai brand kamu.
              </p>
              <div className="s-btns">
                <a className="s-btn s-main" href={GRAB} target="_blank" rel="noopener noreferrer">GRAB YOURS NOW</a>
                <a className="s-btn s-ghost" href="#custom">Lihat desain</a>
              </div>
            </div>
            <div className="s-shot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/tap.jpg" width="900" height="1200" alt="Pelanggan menempelkan HP ke papan review Google di meja kasir kafe" />
            </div>
          </div>
        </div>
      </header>

      <section className="s-sec" id="fungsi">
        <div className="s-wrap">
          <h2>Satu papan, tujuannya terserah kamu.</h2>
          <div className="s-uses">
            {USES.map((u) => (
              <article key={u.t} className="s-use">
                {u.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u.img} width="640" height="640" alt={u.alt} loading="lazy" />
                ) : (
                  <div className="s-linkblock" aria-hidden="true"><KMark size={64} /><span>@krsolutions.id</span></div>
                )}
                <h3>{u.t}</h3>
                <p>{u.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec s-steps" id="cara-kerja">
        <div className="s-wrap s-stepgrid">
          <div>
            <h2>Cara pakainya cuma tiga langkah.</h2>
            <p className="s-sub">Pelanggan tidak perlu install aplikasi apa pun.</p>
          </div>
          <ol>
            <li><h3>Taruh di tempat yang kelihatan</h3><p>Di kasir, meja, atau resepsionis. Satu papan sudah cukup.</p></li>
            <li><h3>Tap HP atau scan QR</h3><p>Tempelkan HP ke ikon NFC, atau scan kode QR dengan kamera.</p></li>
            <li><h3>Tujuan terbuka</h3><p>Halaman review, menu, atau sosmed kamu langsung muncul di layar.</p></li>
          </ol>
        </div>
      </section>

      <section className="s-sec s-custom" id="custom">
        <div className="s-wrap">
          <h2>Desain yang cocok dengan tempat kamu.</h2>
          <p className="s-sub">Warna, logo, dan layout disesuaikan dengan brand kamu. Berikut beberapa contohnya.</p>
        </div>
        <ul className="s-rail" aria-label="Contoh desain papan">
          {DESIGNS.map(([src, alt]) => (
            <li key={src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} width="640" height="640" alt={alt} loading="lazy" />
            </li>
          ))}
        </ul>
        <div className="s-wrap s-fit">
          <p>Cocok untuk kafe, restoran, salon, barbershop, klinik, dan bengkel.</p>
          <a className="s-btn s-dark" href={GRAB} target="_blank" rel="noopener noreferrer">GRAB YOURS NOW</a>
        </div>
      </section>

      <section className="s-sec s-edit" id="edit">
        <div className="s-wrap s-editgrid">
          <div>
            <h2>Sudah punya kartu? Edit di sini.</h2>
            <p>Ganti bisnis tujuan review, ubah nama, atau ganti PIN. Masukkan kode kartu, lalu konfirmasi dengan PIN 4 digit.</p>
            <p className="s-note">Kartu baru? Tap atau scan kartunya untuk aktivasi pertama.</p>
          </div>
          <EditCodeForm />
        </div>
      </section>

      <section className="s-sec s-contact" id="pesan">
        <div className="s-wrap">
          <h2>Bikin bisnis kamu gampang di-review.</h2>
          <p>Pesan papan siap pakai, atau kirim brief desain kamu lewat Instagram atau email.</p>
          <div className="s-btns">
            <a className="s-btn s-main" href={GRAB} target="_blank" rel="noopener noreferrer">GRAB YOURS NOW</a>
            <a className="s-btn s-ghost" href="https://instagram.com/krsolutions.id" target="_blank" rel="noopener noreferrer">Instagram @krsolutions.id</a>
          </div>
          <p className="s-mail">Atau email ke <a href="mailto:keegan@krsolutions.tech">keegan@krsolutions.tech</a></p>
        </div>
      </section>

      <footer className="s-foot">
        <div className="s-wrap">
          <a className="s-brand" href="#" aria-label="KR Solutions"><KMark size={24} /> KR Solutions</a>
          <span>&copy; 2026 KR Solutions. Jakarta, Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}
