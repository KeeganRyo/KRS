import Image from 'next/image';
import localFont from 'next/font/local';
import './landing.css';
import EditCodeForm from '@/components/EditCodeForm';
import KMark from '@/components/KMark';
import ScanStats from '@/components/ScanStats';
import { IconAt, IconCamera, IconChat, IconLink, IconMail, IconMenu, IconMusic, IconPlus, IconStar } from '@/components/Icons';
import { EMAIL, GRAB, IG_DM, IG_HANDLE, IG_URL, THREADS_URL, TIKTOK_URL, WA_KARTU_NAMA, WA_NUMBER, WA_PAPAN_MENU, WA_URL, waLupaPin } from '@/lib/contact';

// Font judul landing. Disimpan di repo (app/fonts) supaya build tidak bergantung pada Google Fonts.
const instrumentSerif = localFont({
  src: [{ path: './fonts/InstrumentSerif-Regular.woff2', style: 'normal', weight: '400' }],
  variable: '--f-serif',
  display: 'swap',
});

export const metadata = {
  title: { absolute: 'KR Solutions | Papan NFC + QR dan kartu nama NFC untuk bisnis' },
  description:
    'Papan akrilik dan kartu nama dengan NFC + QR. Pelanggan tinggal tap atau scan, lalu review Google, menu, WiFi, atau kontak kamu langsung terbuka. Mulai Rp65.000.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'KR Solutions | Pelanggan tinggal tap, langsung sampai',
    description: 'Papan NFC + QR untuk review Google, menu, WiFi tamu, dan sosmed. Plus kartu nama NFC. Desain ikut brand kamu.',
    url: '/',
    siteName: 'KR Solutions',
    locale: 'id_ID',
    type: 'website',
  },
};

export const viewport = { themeColor: '#F5F2EC' };

// Semua foto produk ada di public/foto: 1200x900 (4:3), warna sudah diseragamkan.
const PHOTO = { width: 1200, height: 900 };

// Bisnis yang sudah memakai papan KR Solutions (logo dari Instagram/file resmi mereka, dibuat satu warna).
const CLIENTS = [
  ['the-clean-bar', 'The Clean-Bar', 240, 141],
  ['firstly-coffee', 'Firstly Coffee', 240, 240],
  ['ikonik-kopi', 'Ikonik Kopi', 240, 153],
  ['bakso-pak-diran', 'Bakso Pak Diran', 240, 201],
  ['mayota', 'Mayota', 149, 240],
  ['podjok-kopi', 'Podjok Kopi', 133, 240],
  ['sudut-temu-rasa', 'Sudut Temu Rasa', 234, 240],
];

const HERO = [
  ['review-oranye', 'Papan review', 'Papan review Google putih dengan garis oranye, ikon NFC, dan kode QR'],
  ['menu-krem', 'Papan menu', 'Papan menu krem Kopi Senja dengan kode QR'],
  ['kartu-putih', 'Kartu nama', 'Kartu nama NFC putih John Doe di atas meja'],
];

// Masalah yang sering ditemui pemilik usaha, dan produk yang menjawabnya.
const PROBLEMS = [
  ['Pelanggan puas, tapi malas cari nama tempatmu di Google Maps.', 'Papan review', 'Tap sekali, kolom bintang dan ulasan bisnis kamu langsung terbuka.'],
  ['Harga naik, menu cetak harus diganti lagi.', 'Papan menu', 'Menu terbuka di HP pelanggan. Isinya kamu ganti kapan saja, papannya tetap.'],
  ['Tamu bolak-balik tanya password WiFi.', 'Papan WiFi tamu', 'Nama dan password WiFi muncul di HP, lengkap dengan tombol salin.'],
  ['Kartu nama kertas dibuang, kontakmu ikut hilang.', 'Kartu nama NFC', 'Tempel kartu ke HP, profil kamu terbuka dan kontak tersimpan sekali tap.'],
];

const PRODUCTS = [
  { id: 'review', img: 'review-putih', title: 'Review Google', text: 'Untuk kasir atau meja. Pelanggan langsung sampai di halaman ulasan bisnis kamu.', alt: 'Papan akrilik review Google dengan ikon NFC dan kode QR' },
  { id: 'menu', img: 'menu-maroon', title: 'Menu digital', text: 'Pakai link menu yang sudah ada, atau bikin menu digital gratis di sistem kami.', alt: 'Papan menu merah marun Kopi Senja dengan kode QR', link: ['/contoh-menu', 'Lihat contoh menu'] },
  { id: 'wifi', img: 'wifi-tamu', title: 'WiFi tamu', text: 'Untuk hotel, villa, atau kafe. Ganti password sekali, semua papan ikut berubah.', alt: 'Halaman WiFi tamu Hotel Contoh dengan nama WiFi, password, dan tombol salin', link: ['/contoh-wifi', 'Lihat contoh WiFi'] },
  { id: 'kartu', img: 'kartu-navy', title: 'Kartu nama NFC', text: 'Tempel ke HP, profil dan tombol Simpan kontak langsung muncul.', alt: 'Kartu nama NFC biru tua dengan logo dan kode QR' },
];

const DESTINATIONS = [
  [IconStar, 'Review Google', 'Kolom bintang dan ulasan bisnis kamu.'],
  [IconMenu, 'Menu digital', 'Link menu kamu, atau menu gratis dari kami.'],
  [IconLink, 'WiFi tamu', 'Nama dan password WiFi dengan tombol salin.'],
  [IconCamera, 'Instagram atau TikTok', 'Profil bisnis kamu, tinggal follow.'],
  [IconChat, 'WhatsApp atau link lain', 'Chat bisnis, Linktree, Google Form, promo.'],
];

// Hasil cetak asli (difoto, bukan render).
const GALLERY = [
  ['flatlay-menu', 'Sembilan desain papan menu', 'Sembilan papan menu NFC berbagai warna di atas meja putih'],
  ['menu-merah', 'Papan menu Merah', 'Papan menu merah dengan tiga langkah pesan'],
  ['menu-resto', 'Papan menu Resto', 'Papan menu putih susu dengan nama resto dan info WiFi'],
  ['menu-putih', 'Papan menu Putih', 'Papan menu putih bertuliskan MENU dengan kode QR'],
  ['review-hijau', 'Papan review Hijau', 'Papan review Google krem dengan pola geometris hijau'],
  ['kartu-id', 'Kartu ID karyawan', 'Kartu ID karyawan NFC dengan foto dan nama'],
];

// Kutipan dari Instagram story klien (teks asli, dipotong dengan elipsis).
const QUOTES = [
  ['Teknologi canggih… cuma sekali tap, ulasan bintang 5 langsung meluncur!', 'Sudut Temu Rasa'],
  ['Easy to operate and very helpful… now just takes one tap.', 'Pelangi Montessori Preschool'],
];

// Contoh angka untuk cuplikan halaman statistik (bukan data klien).
const SAMPLE_STATS = { total: 128, last_7: 23, last_30: 87 };
const SAMPLE_DAILY = [3, 5, 2, 6, 4, 7, 3, 2, 4, 3, 5, 1, 6, 2].map((n, i) => ({
  day: `2026-03-${String(i + 1).padStart(2, '0')}`,
  n,
}));

const WA_WIFI = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo KR Solutions, saya mau tanya papan WiFi tamu.')}`;

const FAQ = [
  ['Berapa harganya?', 'Papan NFC Rp65.000 per papan, atau Rp100.000 untuk paket dua papan. Kartu nama NFC Rp99.000 per kartu. Untuk papan menu dan papan WiFi dengan ukuran khusus, tanya lewat WhatsApp.'],
  ['Pelanggan perlu install aplikasi?', 'Tidak. Tap NFC atau scan QR langsung membuka halaman tujuan di browser HP mereka.'],
  ['HP apa saja yang bisa tap?', 'Sebagian besar HP Android dengan NFC dan iPhone XS ke atas bisa langsung tap. HP tanpa NFC tinggal scan QR pakai kamera.'],
  ['Bisa ganti tujuan setelah papan dipasang?', 'Bisa, kapan saja. Buka bagian "Kelola kartu" di halaman ini, masukkan kode kartu dan PIN, lalu pilih tujuan baru. Papannya tidak perlu dicetak ulang.'],
  ['Bisa lihat berapa kali papannya dipakai?', 'Bisa. Halaman edit kartu menampilkan jumlah tap dan scan: total, 7 hari, 30 hari, dan grafik 14 hari terakhir.'],
  ['Papan menu NFC itu apa?', 'Papan akrilik di meja yang membuka menu kafe kamu saat di-tap atau di-scan, misalnya GoFood, GrabFood, Linktree, Google Drive, atau website kamu. Belum punya menu online? Kamu bisa bikin menu digital gratis di sistem kami, termasuk nama dan password WiFi dengan tombol salin.'],
  ['Papan WiFi tamu itu apa?', 'Papan untuk kamar hotel, villa, atau kafe. Tamu tap atau scan, lalu nama dan password WiFi muncul di HP mereka dengan tombol salin. Kalau password diganti, cukup ubah sekali di halaman edit, semua papan dengan kode yang sama ikut berubah.'],
  ['Lupa kode kartu, gimana?', 'Klik "Lupa kode kartu?" di bagian Kelola kartu, masukkan nomor HP yang kamu isi waktu aktivasi, lalu kirim lewat WhatsApp. Kami cocokkan nomornya dan balas dengan kode kartu kamu.'],
  ['Lupa PIN, gimana?', 'Chat WhatsApp kami di 0877-7665-2015 dan sebutkan kode kartunya. Kami bantu reset PIN kamu.'],
  ['Aman nggak? Data HP bisa kecolongan?', 'Aman. Chip NFC cuma menyimpan satu link, sama seperti QR code. Kartu tidak bisa membaca atau mengambil data apa pun dari HP yang menempel, dan hanya terbaca dari jarak beberapa senti.'],
  ['Isi kartu bisa diubah orang lain?', 'Tidak. Halaman edit dilindungi PIN yang disimpan terenkripsi, dan kartu otomatis terkunci kalau PIN salah 5 kali. Chip-nya juga bisa dikunci supaya tidak bisa ditimpa aplikasi NFC lain.'],
  ['Kalau kartu nama hilang?', 'Buka halaman edit kartu lalu centang "Nonaktifkan kartu sementara". Halaman kartu langsung tertutup sampai kamu aktifkan lagi. Profil kartu nama juga tidak diindeks Google.'],
  ['Bisa pakai desain sendiri?', 'Bisa. Warna, logo, dan layout kami sesuaikan dengan brand kamu. Kirim brief desain lewat Instagram atau email.'],
];

const ext = { target: '_blank', rel: 'noopener noreferrer' };

// Semua akun resmi KR Solutions (dipakai di footer).
const SOCIALS = [
  { key: 'instagram', label: 'Instagram @krsolutions.id', href: IG_URL, Icon: IconCamera },
  { key: 'tiktok', label: 'TikTok @krsolutions.id', href: TIKTOK_URL, Icon: IconMusic },
  { key: 'threads', label: 'Threads @krsolutions.id', href: THREADS_URL, Icon: IconAt },
  { key: 'whatsapp', label: 'WhatsApp 0877-7665-2015', href: WA_URL, Icon: IconChat },
  { key: 'email', label: `Email ${EMAIL}`, href: `mailto:${EMAIL}`, Icon: IconMail },
];

const Photo = ({ name, alt, sizes, priority }) => (
  <Image className="s-photo" src={`/foto/${name}.webp`} {...PHOTO} sizes={sizes} alt={alt} priority={priority} />
);

export default function Home() {
  return (
    <div className={`site ${instrumentSerif.variable}`}>
      <a className="s-skip" href="#produk">Langsung ke isi</a>

      <header className="s-wrap">
        <nav className="s-nav" aria-label="Utama">
          <a className="s-brand" href="#" aria-label="KR Solutions"><KMark size={24} /> KR Solutions</a>
          <div className="s-navlinks">
            <a href="#produk">Produk</a>
            <a href="#klien">Klien</a>
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#harga">Harga</a>
            <a href="#faq">FAQ</a>
            <a href="#edit">Kelola kartu</a>
          </div>
          <a className="s-btn s-ink s-sm" href={WA_URL} {...ext}>Chat WhatsApp</a>
        </nav>

        <div className="s-hero">
          <h1>Pelanggan tinggal tap, langsung sampai.</h1>
          <div className="s-herotext">
            <p className="s-lead">
              Papan akrilik dan kartu nama dengan NFC + QR. Satu tap ke review Google, menu, WiFi,
              atau kontak kamu. Tanpa aplikasi, dan tujuannya bisa diganti kapan saja.
            </p>
            <div className="s-btns">
              <a className="s-btn s-ink" href="#produk">Lihat produk</a>
              <a className="s-btn s-line" href={WA_URL} {...ext}>Chat WhatsApp</a>
            </div>
          </div>
        </div>
        <ul className="s-trio" aria-label="Produk KR Solutions">
          {HERO.map(([name, label, alt], i) => (
            <li key={name}>
              <Photo name={name} alt={alt} sizes="(max-width: 820px) 90vw, 380px" priority={i < 2} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </header>

      <section className="s-clients" id="klien" aria-labelledby="klien-h">
        <div className="s-wrap">
          <h2 id="klien-h" className="s-label">Sudah dipakai di</h2>
          <ul className="s-logos">
            {CLIENTS.map(([file, name, w, h]) => (
              <li key={file}>
                <Image src={`/klien/${file}.png`} width={w} height={h} sizes="120px" alt={name} title={name} />
              </li>
            ))}
            <li className="s-logo-text" title="Pelangi Montessori Preschool">Pelangi Montessori</li>
          </ul>
        </div>
      </section>

      <section className="s-sec" id="produk">
        <div className="s-wrap">
          <div className="s-head">
            <h2>Masalah kecil yang tiap hari makan waktu.</h2>
            <p className="s-sub">Satu tap dari HP pelanggan menggantikan semuanya. Ini yang kami beresin.</p>
          </div>
          <ol className="s-problist">
            {PROBLEMS.map(([problem, product, fix], i) => (
              <li key={product}>
                <span className="s-num">0{i + 1}</span>
                <p className="s-prob">{problem}</p>
                <div><h3>{product}</h3><p>{fix}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="produk-h">
        <div className="s-wrap">
          <div className="s-head">
            <h2 id="produk-h">Dua produk, banyak kegunaan.</h2>
            <p className="s-sub">Papan NFC untuk tempat usaha kamu, kartu nama NFC untuk kamu dan tim.</p>
          </div>
          <ul className="s-cards">
            {PRODUCTS.map((p) => (
              <li key={p.id}>
                <Photo name={p.img} alt={p.alt} sizes="(max-width: 820px) 90vw, 280px" />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                {p.link && <a className="s-more" href={p.link[0]} {...ext}>{p.link[1]}</a>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="s-sec" id="tujuan">
        <div className="s-wrap s-split">
          <div>
            <h2>Satu papan, tujuannya kamu yang pilih.</h2>
            <p className="s-sub">Ganti tujuan kapan saja dari HP kamu. Papannya tidak perlu dicetak ulang.</p>
          </div>
          <ul className="s-rows">
            {DESTINATIONS.map(([Icon, t, d]) => (
              <li key={t}>
                <span className="s-ico"><Icon size={20} /></span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="s-sec" id="desain">
        <div className="s-wrap">
          <div className="s-head">
            <h2>Desainnya ikut brand kamu.</h2>
            <p className="s-sub">Warna, logo, bentuk, dan ukuran kami sesuaikan dengan tempat kamu. Ini hasil cetak asli kami.</p>
          </div>
          <ul className="s-gallery">
            {GALLERY.map(([name, label, alt]) => (
              <li key={name}>
                <Photo name={name} alt={alt} sizes="(max-width: 820px) 90vw, 380px" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <p className="s-note">Logo dan nama tempat di contoh hanya ilustrasi.</p>
        </div>
      </section>

      <section className="s-sec" id="cara-kerja">
        <div className="s-wrap s-split">
          <div>
            <h2>Cara pakainya cuma tiga langkah.</h2>
            <ol className="s-steps">
              <li><h3>Taruh di tempat yang kelihatan</h3><p>Di kasir, meja, kamar, atau resepsionis.</p></li>
              <li><h3>Pelanggan tap HP atau scan QR</h3><p>Tempel HP ke ikon NFC, atau scan kode QR pakai kamera. Tanpa aplikasi.</p></li>
              <li><h3>Tujuan langsung terbuka</h3><p>Review, menu, WiFi, atau sosmed kamu muncul di layar.</p></li>
            </ol>
          </div>
          <figure className="s-video">
            <video
              src="/social/demo/demo-asli-tap-review.mp4"
              poster="/social/demo/demo-asli-poster.jpg"
              controls
              muted
              playsInline
              preload="none"
              width={720}
              height={1280}
              aria-label="Video HP: papan review di-tap, kartu diaktifkan, lalu dipakai memberi review Google bintang lima"
            />
            <figcaption>Video asli dari HP, tanpa edit. 42 detik.</figcaption>
          </figure>
        </div>
      </section>

      <section className="s-sec s-quotes" aria-labelledby="kata-h">
        <div className="s-wrap">
          <h2 id="kata-h" className="s-label">Kata mereka</h2>
          <div className="s-quotegrid">
            {QUOTES.map(([q, who]) => (
              <figure key={who}>
                <blockquote>“{q}”</blockquote>
                <figcaption>{who}, dari Instagram story</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec" id="kartu-nama">
        <div className="s-wrap s-split">
          <div>
            <h2>Kartu nama yang nggak dibuang.</h2>
            <p className="s-sub">
              Tempel kartu ke HP, profil kamu langsung terbuka: nama, jabatan, WhatsApp, Instagram, TikTok,
              LinkedIn, dan link kamu sendiri, plus tombol Simpan kontak.
            </p>
            <ul className="s-list">
              <li>Desain kartu custom pakai logo dan warna kamu.</li>
              <li>Isi profil bisa diganti kapan saja tanpa cetak ulang.</li>
              <li>Simpan kontak sekali tap, lengkap dengan foto.</li>
            </ul>
            <div className="s-btns">
              <a className="s-btn s-ink" href={WA_KARTU_NAMA} {...ext}>Pesan kartu nama</a>
            </div>
          </div>
          <figure className="s-video">
            <video
              src="/social/kartu-nama/kartu-nama-demo.mp4"
              poster="/social/kartu-nama/kartu-nama-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              width={720}
              height={1280}
              aria-label="Video demo: kartu nama hitam KR ditempel ke iPhone, profil Keegan Ryo terbuka, lalu kontak disimpan"
            />
            <figcaption>Demo asli: kartu nama ditempel ke iPhone.</figcaption>
          </figure>
        </div>
      </section>

      <section className="s-sec" id="harga">
        <div className="s-wrap">
          <div className="s-head">
            <h2>Harga yang jelas.</h2>
            <p className="s-sub">Semua sudah termasuk chip NFC, kode QR, desain pakai logo kamu, dan halaman edit.</p>
          </div>
          <div className="s-prices">
            <article className="s-price">
              <h3>1 papan NFC</h3>
              <p className="s-amount">Rp65.000</p>
              <p>Pas untuk satu kasir atau meja depan.</p>
              <a className="s-btn s-line" href={GRAB} {...ext}>Pesan</a>
            </article>
            <article className="s-price s-best">
              <h3>Paket 2 papan NFC <span className="s-badge">Hemat Rp30.000</span></h3>
              <p className="s-amount">Rp100.000</p>
              <p>Rp50.000 per papan. Dua meja, atau dua tujuan berbeda.</p>
              <a className="s-btn s-ink" href={GRAB} {...ext}>Pesan paket</a>
            </article>
            <article className="s-price">
              <h3>Kartu nama NFC</h3>
              <p className="s-amount">Rp99.000</p>
              <p>Per kartu, desain custom sudah termasuk.</p>
              <a className="s-btn s-line" href={WA_KARTU_NAMA} {...ext}>Pesan kartu</a>
            </article>
          </div>
          <p className="s-note">
            Papan menu atau WiFi dengan ukuran khusus? <a href={WA_PAPAN_MENU} {...ext}>Tanya papan menu</a> atau{' '}
            <a href={WA_WIFI} {...ext}>tanya papan WiFi</a> lewat WhatsApp.
          </p>
        </div>
      </section>

      <section className="s-sec" id="edit">
        <div className="s-wrap s-split s-top">
          <div>
            <h2>Sudah punya kartu? Kelola di sini.</h2>
            <ul className="s-list">
              <li>Ganti tujuan: review, menu, WiFi, sosmed, atau WhatsApp.</li>
              <li>Lihat berapa kali papan kamu di-tap dan di-scan.</li>
              <li>Ganti nama bisnis, password WiFi, dan PIN.</li>
            </ul>
            <EditCodeForm />
            <p className="s-note">Kartu baru? Tap atau scan kartunya untuk aktivasi pertama. Lupa PIN? <a href={waLupaPin()} {...ext}>Minta reset lewat WhatsApp</a>.</p>
          </div>
          <figure className="s-statpanel">
            <ScanStats stats={SAMPLE_STATS} daily={SAMPLE_DAILY} />
            <figcaption>Contoh tampilan statistik. Angka di atas bukan data klien.</figcaption>
          </figure>
        </div>
      </section>

      <section className="s-sec" id="faq">
        <div className="s-wrap s-split s-top s-faqgrid">
          <h2>Pertanyaan yang sering ditanya.</h2>
          <div className="s-faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<span className="s-toggle" aria-hidden="true"><IconPlus size={18} /></span></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec s-contact" id="pesan">
        <div className="s-wrap">
          <h2>Siap bikin pelanggan tinggal tap?</h2>
          <p className="s-sub">Ceritakan tempat usaha kamu. Kami bantu pilih papan, tujuan, dan desainnya.</p>
          <div className="s-btns">
            <a className="s-btn s-ink" href={WA_URL} {...ext}>Chat WhatsApp</a>
            <a className="s-btn s-line" href={IG_DM} {...ext}>DM {IG_HANDLE}</a>
          </div>
        </div>
      </section>

      <footer className="s-foot">
        <div className="s-wrap">
          <a className="s-brand" href="#" aria-label="KR Solutions"><KMark size={20} /> KR Solutions</a>
          <nav className="s-footsoc" aria-label="Sosial media dan kontak">
            {SOCIALS.map(({ key, label, href, Icon }) => (
              <a key={key} href={href} {...(href.startsWith('mailto:') ? {} : ext)} aria-label={label} title={label}><Icon size={20} /></a>
            ))}
          </nav>
          <span>&copy; {new Date().getFullYear()} KR Solutions · Jakarta · <a href={GRAB} {...ext}>lynk.id/krsolutions</a></span>
        </div>
      </footer>
    </div>
  );
}
