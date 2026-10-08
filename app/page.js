import './landing.css';
import EditCodeForm from '@/components/EditCodeForm';
import KMark from '@/components/KMark';
import { EMAIL, GRAB, IG_DM, IG_HANDLE, IG_URL } from '@/lib/contact';

export const metadata = {
  title: { absolute: 'KR Solutions | NFC automation untuk bisnis kamu' },
  description:
    'Papan akrilik NFC dan QR: satu tap membuka review Google, menu, atau sosmed bisnis kamu. Desain bisa custom.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'KR Solutions | Satu tap, review dan sosmed langsung terbuka',
    description: 'Papan akrilik NFC + QR untuk kafe, resto, salon, klinik, dan bengkel. Desain sesuai brand kamu.',
    url: '/',
    siteName: 'KR Solutions',
    locale: 'id_ID',
    type: 'website',
  },
};

const USES = [
  { img: '/papan.jpg', alt: 'Papan review Google dengan ikon NFC dan kode QR', t: 'Review Google', d: 'Tap atau scan, halaman review bisnis kamu langsung terbuka. Tanpa ngetik link.' },
  { img: '/d-menu-white.jpg', alt: 'Papan menu dengan tulisan See our Menu, ikon NFC, dan kode QR', t: 'Menu digital', d: 'Pelanggan buka menu di HP mereka. Ganti isi menu kapan saja, papannya tetap sama.' },
  { img: null, t: 'Sosmed dan link lain', d: 'Arahkan ke Instagram, TikTok, WhatsApp, atau halaman promo. Tujuan tap bisa diganti tanpa cetak ulang.' },
];

const DESIGNS = [
  ['/d-orange.jpg', 'Desain review dengan garis oranye'],
  ['/d-green.jpg', 'Desain review dengan pola geometris hijau'],
  ['/d-blue.jpg', 'Desain review dengan gradien biru'],
  ['/d-sunset.jpg', 'Desain review dengan latar oranye gelap'],
  ['/d-menu-black.jpg', 'Desain menu hitam dengan sudut membulat'],
];

const FAQ = [
  ['Pelanggan perlu install aplikasi?', 'Tidak. Tap NFC atau scan QR langsung membuka halaman tujuan di browser HP mereka.'],
  ['HP apa saja yang bisa tap?', 'Sebagian besar HP Android dengan NFC dan iPhone XS ke atas bisa langsung tap. HP tanpa NFC tinggal scan QR dengan kamera.'],
  ['Bisa ganti tujuan setelah papan dipasang?', 'Bisa, kapan saja. Buka bagian "Edit kartu" di halaman ini, masukkan kode kartu dan PIN, lalu pilih tujuan baru. Papan tidak perlu dicetak ulang.'],
  ['Bisa lihat berapa kali papannya dipakai?', 'Bisa. Di halaman edit kartu ada jumlah tap dan scan, total dan 14 hari terakhir.'],
  ['Lupa PIN, gimana?', `DM Instagram ${IG_HANDLE}. Kami bantu reset PIN kartu kamu.`],
  ['Bisa pakai desain sendiri?', 'Bisa. Warna, logo, dan layout disesuaikan dengan brand kamu. Kirim brief desain lewat Instagram atau email.'],
];

const ext = { target: '_blank', rel: 'noopener noreferrer' };

export default function Home() {
  return (
    <div className="site">
      <header className="s-hero">
        <div className="s-wrap">
          <nav className="s-nav" aria-label="Utama">
            <a className="s-brand" href="#" aria-label="KR Solutions"><KMark /> KR Solutions</a>
            <div className="s-navlinks">
              <a href="#cara-kerja">Cara kerja</a>
              <a href="#custom">Desain</a>
              <a href="#faq">FAQ</a>
              <a className="s-pill" href="#edit">Edit kartu</a>
            </div>
          </nav>
          <div className="s-herogrid">
            <div className="s-copy">
              <h1>Satu tap. Review, menu, dan sosmed kamu langsung terbuka.</h1>
              <p className="s-lead">
                NFC automation untuk bisnis. Papan akrilik dengan chip NFC dan QR yang bisa diarahkan ke
                mana saja, dengan desain sesuai brand kamu.
              </p>
              <div className="s-btns">
                <a className="s-btn s-main" href={GRAB} {...ext}>GRAB YOURS NOW</a>
                <a className="s-btn s-ghost" href="#custom">Lihat desain</a>
              </div>
              <ul className="s-proof">
                <li>Tanpa install aplikasi</li>
                <li>Tujuan bisa diganti</li>
                <li>Statistik tap</li>
              </ul>
            </div>
            <div className="s-shot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/tap.jpg" width="900" height="1200" fetchPriority="high" alt="Pelanggan menempelkan HP ke papan review Google di meja kasir kafe" />
              <div className="s-tapbadge" aria-hidden="true"><i /> Halaman review terbuka</div>
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
                  <div className="s-linkblock" role="img" aria-label="Contoh halaman link bisnis dengan tombol Instagram, WhatsApp, dan Menu">
                    <div className="s-phone">
                      <div className="s-phone-av"><KMark size={22} /></div>
                      <div className="s-phone-name">@bisniskamu</div>
                      <div className="s-phone-btn on">Instagram</div>
                      <div className="s-phone-btn">WhatsApp</div>
                      <div className="s-phone-btn">Menu</div>
                    </div>
                  </div>
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
          <a className="s-btn s-dark" href={GRAB} {...ext}>GRAB YOURS NOW</a>
        </div>
      </section>

      <section className="s-sec s-edit" id="edit">
        <div className="s-wrap s-editgrid">
          <div>
            <h2>Sudah punya kartu? Kelola di sini.</h2>
            <ul>
              <li>Ganti tujuan: review, menu, sosmed, atau WhatsApp</li>
              <li>Lihat berapa kali papan kamu di-tap</li>
              <li>Ganti nama bisnis dan PIN</li>
            </ul>
            <p className="s-note">Kartu baru? Tap atau scan kartunya untuk aktivasi pertama. Lupa PIN? <a href={IG_DM} {...ext}>DM {IG_HANDLE}</a>.</p>
          </div>
          <EditCodeForm />
        </div>
      </section>

      <section className="s-sec" id="faq">
        <div className="s-wrap s-faqgrid">
          <h2>Pertanyaan yang sering ditanya.</h2>
          <div className="s-faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec s-contact" id="pesan">
        <div className="s-wrap">
          <h2>Bikin bisnis kamu gampang di-review.</h2>
          <p>Pesan papan siap pakai, atau kirim brief desain kamu lewat Instagram atau email.</p>
          <div className="s-btns">
            <a className="s-btn s-main" href={GRAB} {...ext}>GRAB YOURS NOW</a>
            <a className="s-btn s-ghost" href={IG_URL} {...ext}>Instagram {IG_HANDLE}</a>
          </div>
          <p className="s-mail">Atau email ke <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
        </div>
      </section>

      <footer className="s-foot">
        <div className="s-wrap">
          <a className="s-brand" href="#" aria-label="KR Solutions"><KMark size={24} /> KR Solutions</a>
          <span>&copy; {new Date().getFullYear()} KR Solutions. Jakarta, Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}
