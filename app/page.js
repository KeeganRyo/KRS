import Image from 'next/image';
import localFont from 'next/font/local';
import './landing.css';
import EditCodeForm from '@/components/EditCodeForm';
import KMark from '@/components/KMark';
import ScanStats from '@/components/ScanStats';
import { IconAt, IconCamera, IconChat, IconCheck, IconLink, IconMail, IconMenu, IconMusic, IconPlus, IconStar } from '@/components/Icons';
import { EMAIL, GRAB, IG_DM, IG_HANDLE, IG_URL, THREADS_URL, TIKTOK_URL, WA_KARTU_NAMA, WA_NUMBER, WA_PAPAN_MENU, WA_URL, waLupaPin } from '@/lib/contact';

// Font judul landing. Disimpan di repo (app/fonts) supaya build tidak bergantung pada Google Fonts.
const instrumentSerif = localFont({
  src: [
    { path: './fonts/InstrumentSerif-Regular.woff2', style: 'normal', weight: '400' },
    { path: './fonts/InstrumentSerif-Italic.woff2', style: 'italic', weight: '400' },
  ],
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

// Masalah yang sering ditemui pemilik usaha, dan produk yang menjawabnya.
const PROBLEMS = [
  ['Pelanggan puas, tapi malas cari nama tempatmu di Google Maps.', 'Papan review', 'Tap sekali, kolom bintang dan ulasan bisnis kamu langsung terbuka.'],
  ['Harga naik, menu cetak harus diganti lagi.', 'Papan menu', 'Menu terbuka di HP pelanggan. Isinya kamu ganti kapan saja, papannya tetap.'],
  ['Tamu bolak-balik tanya password WiFi.', 'Papan WiFi tamu', 'Nama dan password WiFi muncul di HP, lengkap dengan tombol salin.'],
  ['Kartu nama kertas dibuang, kontakmu ikut hilang.', 'Kartu nama NFC', 'Tempel kartu ke HP, profil kamu terbuka dan kontak tersimpan sekali tap.'],
];

const PRODUCTS = [
  { id: 'review', img: '/web/papan-review.webp', w: 900, h: 899, tag: 'Papan', title: 'Review Google', text: 'Untuk kasir atau meja. Pelanggan langsung sampai di halaman ulasan bisnis kamu.', alt: 'Papan akrilik review Google dengan ikon NFC dan kode QR' },
  { id: 'menu', img: '/web/papan-menu.webp', w: 1100, h: 646, tag: 'Papan meja', title: 'Menu digital', text: 'Pakai link menu yang sudah ada, atau bikin menu digital gratis di sistem kami.', alt: 'Papan menu NFC hitam, putih, dan bulat bertuliskan See our Menu', link: ['/contoh-menu', 'Lihat contoh menu'] },
  { id: 'wifi', img: '/web/wifi-tamu.webp', w: 480, h: 490, tag: 'Papan kamar', title: 'WiFi tamu', text: 'Untuk hotel, villa, atau kafe. Ganti password sekali, semua papan ikut berubah.', alt: 'Halaman WiFi tamu Hotel Contoh dengan nama WiFi, password, dan tombol salin', link: ['/contoh-wifi', 'Lihat contoh WiFi'] },
  { id: 'kartu', img: '/web/kartu-nama.webp', w: 720, h: 960, tag: 'Kartu', title: 'Kartu nama NFC', text: 'Tempel ke HP, profil dan tombol Simpan kontak langsung muncul.', alt: 'Kartu nama NFC ditempel ke iPhone, profil Keegan Ryo terbuka' },
];

const DESTINATIONS = [
  [IconStar, 'Review Google', 'Kolom bintang dan ulasan bisnis kamu.'],
  [IconMenu, 'Menu digital', 'Link menu kamu, atau menu gratis dari kami.'],
  [IconLink, 'WiFi tamu', 'Nama dan password WiFi dengan tombol salin.'],
  [IconCamera, 'Instagram atau TikTok', 'Profil bisnis kamu, tinggal follow.'],
  [IconChat, 'WhatsApp atau link lain', 'Chat bisnis, Linktree, Google Form, promo.'],
];

const DESIGNS = [
  ['/desain-hijau.jpg', 928, 1152, 'Hijau geometris', 'Papan review krem dengan pola geometris hijau dan oranye'],
  ['/social/papan-menu/noir-120x50.webp', 900, 400, 'Menu Noir', 'Papan menu meja hitam'],
  ['/desain-oranye.jpg', 928, 1152, 'Garis oranye', 'Papan review putih susu dengan garis oranye'],
  ['/social/papan-menu/ivory-120x50.webp', 900, 400, 'Menu Ivory', 'Papan menu meja krem'],
  ['/desain-biru.jpg', 928, 1152, 'Gradien biru', 'Papan review gradien biru tua'],
  ['/social/papan-menu/forest-120x50.webp', 900, 400, 'Menu Forest', 'Papan menu meja hijau tua'],
  ['/desain-senja.jpg', 928, 1152, 'Senja oranye', 'Papan review cokelat oranye'],
];

// Contoh desain kartu nama (file di public/social/kartu-nama/desain): [file, nama, lebar, tinggi].
const NAMECARD_DESIGNS = [
  ['kr-logo-front', 'KR Solutions', 1012, 637],
  ['noir-front', 'Noir', 1012, 637],
  ['garis-front', 'Garis', 1012, 637],
  ['klasik-front', 'Klasik', 1012, 637],
  ['korporat-front', 'Corporate', 1012, 637],
  ['id-kantor-front', 'Office ID', 637, 1012],
];

// Kutipan dari Instagram story klien (teks asli, dipotong dengan elipsis).
const QUOTES = [
  ['Teknologi canggih… cuma sekali tap, ulasan bintang 5 langsung meluncur!', 'Sudut Temu Rasa', '@sudut.temurasa'],
  ['Easy to operate and very helpful… now just takes one tap.', 'Pelangi Montessori Preschool', '@pelangimontessori'],
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

// Semua akun resmi KR Solutions (dipakai di bagian kontak dan footer).
const SOCIALS = [
  { key: 'instagram', label: 'Instagram @krsolutions.id', href: IG_URL, Icon: IconCamera },
  { key: 'tiktok', label: 'TikTok @krsolutions.id', href: TIKTOK_URL, Icon: IconMusic },
  { key: 'threads', label: 'Threads @krsolutions.id', href: THREADS_URL, Icon: IconAt },
  { key: 'whatsapp', label: 'WhatsApp 0877-7665-2015', href: WA_URL, Icon: IconChat },
  { key: 'email', label: `Email ${EMAIL}`, href: `mailto:${EMAIL}`, Icon: IconMail },
];

export default function Home() {
  return (
    <div className={`site ${instrumentSerif.variable}`}>
      <a className="s-skip" href="#produk">Langsung ke isi</a>

      <header className="s-hero">
        <div className="s-wrap">
          <nav className="s-nav" aria-label="Utama">
            <a className="s-brand" href="#" aria-label="KR Solutions"><KMark size={26} /> KR Solutions</a>
            <div className="s-navlinks">
              <a href="#produk">Produk</a>
              <a href="#klien">Klien</a>
              <a href="#cara-kerja">Cara kerja</a>
              <a href="#harga">Harga</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="s-navcta">
              <a className="s-link" href="#edit">Kelola kartu</a>
              <a className="s-btn s-ink s-sm" href={WA_URL} {...ext}>Chat WhatsApp</a>
            </div>
          </nav>

          <div className="s-herogrid">
            <div className="s-copy">
              <p className="s-eyebrow">Papan &amp; kartu NFC + QR · Jakarta</p>
              <h1>Pelanggan tinggal tap, <em>langsung sampai.</em></h1>
              <p className="s-lead">
                Papan akrilik dan kartu nama dengan NFC + QR. Satu tap ke review Google, menu, WiFi,
                atau kontak kamu. Tanpa aplikasi, dan tujuannya bisa diganti kapan saja.
              </p>
              <div className="s-btns">
                <a className="s-btn s-ink" href="#produk">Lihat produk</a>
                <a className="s-btn s-line" href={WA_URL} {...ext}>Chat WhatsApp</a>
              </div>
              <p className="s-hint">Mulai Rp65.000 per papan. Desain ikut logo dan warna kamu.</p>
            </div>
            <div className="s-collage" aria-hidden="true">
              <figure className="s-tile s-tile-a">
                <Image src="/web/tap.webp" width={900} height={1200} priority sizes="(max-width: 820px) 56vw, 300px" alt="" />
                <figcaption>Review Google</figcaption>
              </figure>
              <figure className="s-tile s-tile-b">
                <Image src="/web/papan-menu.webp" width={1100} height={646} priority sizes="(max-width: 820px) 60vw, 320px" alt="" />
                <figcaption>Menu meja</figcaption>
              </figure>
              <figure className="s-tile s-tile-c">
                <Image src="/web/kartu-nama.webp" width={720} height={960} sizes="(max-width: 820px) 40vw, 210px" alt="" />
                <figcaption>Kartu nama</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </header>

      <section className="s-clients" id="klien" aria-labelledby="klien-h">
        <div className="s-wrap">
          <h2 id="klien-h" className="s-kicker">Sudah dipakai di</h2>
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

      <section className="s-sec s-problems" id="produk">
        <div className="s-wrap">
          <div className="s-head">
            <h2>Masalah kecil yang tiap hari <em>makan waktu.</em></h2>
            <p className="s-sub">Satu tap dari HP pelanggan menggantikan semuanya. Ini yang kami beresin.</p>
          </div>
          <ol className="s-problist">
            {PROBLEMS.map(([problem, product, fix], i) => (
              <li key={product}>
                <span className="s-num">0{i + 1}</span>
                <p className="s-prob">{problem}</p>
                <div className="s-fix"><h3>{product}</h3><p>{fix}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="s-sec s-products" aria-labelledby="produk-h">
        <div className="s-wrap">
          <div className="s-head">
            <h2 id="produk-h">Dua produk, <em>banyak kegunaan.</em></h2>
            <p className="s-sub">Papan NFC untuk tempat usaha kamu, kartu nama NFC untuk kamu dan tim.</p>
          </div>
          <ul className="s-cards">
            {PRODUCTS.map((p) => (
              <li key={p.id} className={`s-card s-card-${p.id}`}>
                <div className="s-cardimg"><Image src={p.img} width={p.w} height={p.h} sizes="(max-width: 820px) 90vw, 270px" alt={p.alt} /></div>
                <p className="s-tag">{p.tag}</p>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                {p.link && <a className="s-more" href={p.link[0]} {...ext}>{p.link[1]} →</a>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="s-sec s-dest" id="tujuan">
        <div className="s-wrap s-split">
          <div>
            <h2>Satu papan, <em>tujuannya kamu yang pilih.</em></h2>
            <p className="s-sub">Ganti tujuan kapan saja dari HP kamu. Papannya tidak perlu dicetak ulang.</p>
          </div>
          <ul className="s-destlist">
            {DESTINATIONS.map(([Icon, t, d]) => (
              <li key={t}>
                <span className="s-ico"><Icon size={20} /></span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="s-sec s-designs" id="desain">
        <div className="s-wrap s-head">
          <h2>Desainnya <em>ikut brand kamu.</em></h2>
          <p className="s-sub">Warna, logo, bentuk, dan ukuran kami sesuaikan dengan tempat kamu. Beberapa contoh:</p>
        </div>
        <ul className="s-gallery" aria-label="Contoh desain papan">
          {DESIGNS.map(([src, w, h, name, alt]) => (
            <li key={src} className={w > h ? 's-wide' : undefined}>
              <figure>
                <Image src={src} width={w} height={h} sizes="(max-width: 820px) 70vw, 300px" alt={alt} />
                <figcaption>{name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="s-wrap s-note">Logo dan nama tempat di contoh hanya ilustrasi.</p>
      </section>

      <section className="s-sec s-steps" id="cara-kerja">
        <div className="s-wrap s-split">
          <div>
            <h2>Cara pakainya <em>cuma tiga langkah.</em></h2>
            <ol className="s-steplist">
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
          <h2 id="kata-h" className="s-kicker">Kata mereka</h2>
          <div className="s-quotegrid">
            {QUOTES.map(([q, who, handle]) => (
              <figure key={who}>
                <blockquote>“{q}”</blockquote>
                <figcaption><strong>{who}</strong> · {handle}, dari Instagram story</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec s-nama" id="kartu-nama">
        <div className="s-wrap s-split">
          <div>
            <p className="s-tag">Kartu nama NFC</p>
            <h2>Kartu nama yang <em>nggak dibuang.</em></h2>
            <p className="s-sub">
              Tempel kartu ke HP, profil kamu langsung terbuka: nama, jabatan, WhatsApp, Instagram, TikTok,
              LinkedIn, dan link kamu sendiri, plus tombol Simpan kontak.
            </p>
            <ul className="s-checks">
              <li><IconCheck size={18} /> Desain kartu custom pakai logo dan warna kamu.</li>
              <li><IconCheck size={18} /> Isi profil bisa diganti kapan saja tanpa cetak ulang.</li>
              <li><IconCheck size={18} /> Simpan kontak sekali tap, lengkap dengan foto.</li>
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
        <div className="s-wrap">
          <ul className="s-namadesigns" aria-label="Contoh desain kartu nama">
            {NAMECARD_DESIGNS.map(([file, name, w, h]) => (
              <li key={file} className={h > w ? 's-tall' : undefined}>
                <Image src={`/social/kartu-nama/desain/${file}.webp`} width={w} height={h} sizes="(max-width: 820px) 60vw, 220px" alt={`Contoh desain kartu nama ${name}`} />
                <span>{name}</span>
              </li>
            ))}
          </ul>
          <p className="s-note">Nama, logo, dan foto di atas hanya contoh.</p>
        </div>
      </section>

      <section className="s-sec s-pricing" id="harga">
        <div className="s-wrap">
          <div className="s-head">
            <h2>Harga <em>yang jelas.</em></h2>
            <p className="s-sub">Semua sudah termasuk chip NFC, kode QR, desain pakai logo kamu, dan halaman edit.</p>
          </div>
          <div className="s-prices">
            <article className="s-price">
              <h3>1 papan NFC</h3>
              <p className="s-amount"><span>Rp</span>65.000</p>
              <p className="s-per">Pas untuk satu kasir atau meja depan.</p>
              <a className="s-btn s-line" href={GRAB} {...ext}>Pesan</a>
            </article>
            <article className="s-price s-best">
              <p className="s-badge">Hemat Rp30.000</p>
              <h3>Paket 2 papan NFC</h3>
              <p className="s-amount"><span>Rp</span>100.000</p>
              <p className="s-per">Rp50.000 per papan. Dua meja, atau dua tujuan berbeda.</p>
              <a className="s-btn s-paper" href={GRAB} {...ext}>Pesan paket</a>
            </article>
            <article className="s-price">
              <h3>Kartu nama NFC</h3>
              <p className="s-amount"><span>Rp</span>99.000</p>
              <p className="s-per">Per kartu, desain custom sudah termasuk.</p>
              <a className="s-btn s-line" href={WA_KARTU_NAMA} {...ext}>Pesan kartu</a>
            </article>
          </div>
          <p className="s-paynote">
            Papan menu atau WiFi dengan ukuran khusus? <a href={WA_PAPAN_MENU} {...ext}>Tanya papan menu</a> atau{' '}
            <a href={WA_WIFI} {...ext}>tanya papan WiFi</a> lewat WhatsApp.
          </p>
        </div>
      </section>

      <section className="s-sec s-edit" id="edit">
        <div className="s-wrap s-split">
          <div>
            <h2>Sudah punya kartu? <em>Kelola di sini.</em></h2>
            <ul className="s-checks">
              <li><IconCheck size={18} /> Ganti tujuan: review, menu, WiFi, sosmed, atau WhatsApp</li>
              <li><IconCheck size={18} /> Lihat berapa kali papan kamu di-tap dan di-scan</li>
              <li><IconCheck size={18} /> Ganti nama bisnis, password WiFi, dan PIN</li>
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

      <section className="s-sec s-faqsec" id="faq">
        <div className="s-wrap s-split s-faqgrid">
          <h2>Pertanyaan yang <em>sering ditanya.</em></h2>
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

      <section className="s-contact" id="pesan">
        <div className="s-wrap">
          <h2>Siap bikin pelanggan <em>tinggal tap?</em></h2>
          <p>Ceritakan tempat usaha kamu. Kami bantu pilih papan, tujuan, dan desainnya.</p>
          <div className="s-btns">
            <a className="s-btn s-paper" href={WA_URL} {...ext}>Chat WhatsApp</a>
            <a className="s-btn s-line-light" href={IG_DM} {...ext}>DM {IG_HANDLE}</a>
          </div>
        </div>
      </section>

      <footer className="s-foot">
        <div className="s-wrap">
          <a className="s-brand" href="#" aria-label="KR Solutions"><KMark size={22} /> KR Solutions</a>
          <span>Papan NFC + QR dan kartu nama NFC.</span>
          <nav className="s-footsoc" aria-label="Sosial media dan kontak">
            {SOCIALS.map(({ key, label, href, Icon }) => (
              <a key={key} href={href} {...(href.startsWith('mailto:') ? {} : ext)} aria-label={label} title={label}><Icon size={20} /></a>
            ))}
          </nav>
          <span>&copy; {new Date().getFullYear()} KR Solutions · Jakarta, Indonesia · <a href={GRAB} {...ext}>lynk.id/krsolutions</a></span>
        </div>
      </footer>
    </div>
  );
}
