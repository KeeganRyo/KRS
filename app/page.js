import Image from 'next/image';
import './landing.css';
import EditCodeForm from '@/components/EditCodeForm';
import KMark from '@/components/KMark';
import ScanStats from '@/components/ScanStats';
import { IconAt, IconCamera, IconChat, IconCheck, IconLink, IconMail, IconMenu, IconMusic, IconPlus, IconStar } from '@/components/Icons';
import { EMAIL, GRAB, IG_DM, IG_HANDLE, IG_URL, THREADS_URL, TIKTOK_URL, WA_KARTU_NAMA, WA_URL, waLupaPin } from '@/lib/contact';

export const metadata = {
  title: { absolute: 'KR Solutions | Papan review Google NFC + QR untuk bisnis kamu' },
  description:
    'Papan akrilik NFC dan QR. Pelanggan tempel HP atau scan, lalu halaman review Google, menu, atau sosmed bisnis kamu terbuka. Rp65.000 per papan.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'KR Solutions | Satu tap, halaman review Google kamu terbuka',
    description: 'Papan akrilik NFC + QR untuk kafe, resto, salon, klinik, dan bengkel. Desain ikut brand kamu. Rp65.000 per papan.',
    url: '/',
    siteName: 'KR Solutions',
    locale: 'id_ID',
    type: 'website',
  },
};

const DESIGNS = [
  ['/desain-hijau.jpg', 'Hijau geometris', 'Papan review Google krem dengan pola geometris hijau dan oranye di keempat sudut'],
  ['/desain-oranye.jpg', 'Garis oranye', 'Papan review Google putih susu dengan garis-garis oranye di keempat sudut'],
  ['/desain-biru.jpg', 'Gradien biru', 'Papan review Google dengan gradien biru tua ke hitam dan teks putih'],
  ['/desain-senja.jpg', 'Senja oranye', 'Papan review Google cokelat oranye dengan foto kelopak oranye di sudut kiri atas'],
];

// Contoh desain kartu nama (file di public/social/kartu-nama/desain): [file, nama, lebar, tinggi].
const NAMECARD_DESIGNS = [
  ['kr-logo-front', 'KR Solutions', 1012, 637],
  ['noir-front', 'Noir', 1012, 637],
  ['garis-front', 'Garis', 1012, 637],
  ['klasik-front', 'Klasik', 1012, 637],
  ['korporat-front', 'Corporate', 1012, 637],
  ['id-kantor-front', 'Office ID', 637, 1012],
  ['sekolah-front', 'Student Card', 637, 1012],
];

const DESTINATIONS = [
  [IconStar, 'Review Google', 'Pelanggan langsung sampai di kolom bintang dan ulasan bisnis kamu.'],
  [IconMenu, 'Menu digital', 'Pelanggan buka menu di HP sendiri. Isi menu kamu ganti kapan saja, papannya tetap.'],
  [IconCamera, 'Instagram atau TikTok', 'Profil bisnis kamu terbuka, pelanggan tinggal follow.'],
  [IconChat, 'WhatsApp', 'Pelanggan langsung masuk ke chat WhatsApp bisnis kamu.'],
  [IconLink, 'Link lain', 'Linktree, Google Form, halaman promo, atau link apa pun.'],
];

// Contoh angka untuk cuplikan halaman statistik (bukan data klien).
const SAMPLE_STATS = { total: 128, last_7: 23, last_30: 87 };
const SAMPLE_DAILY = [3, 5, 2, 6, 4, 7, 3, 2, 4, 3, 5, 1, 6, 2].map((n, i) => ({
  day: `2026-03-${String(i + 1).padStart(2, '0')}`,
  n,
}));

const FAQ = [
  ['Berapa harganya?', 'Rp65.000 untuk satu papan, atau Rp100.000 untuk paket dua papan. Pesan lewat tombol Pesan sekarang.'],
  ['Pelanggan perlu install aplikasi?', 'Tidak. Tap NFC atau scan QR langsung membuka halaman tujuan di browser HP mereka.'],
  ['HP apa saja yang bisa tap?', 'Sebagian besar HP Android dengan NFC dan iPhone XS ke atas bisa langsung tap. HP tanpa NFC tinggal scan QR pakai kamera.'],
  ['Bisa ganti tujuan setelah papan dipasang?', 'Bisa, kapan saja. Buka bagian "Edit kartu" di halaman ini, masukkan kode kartu dan PIN, lalu pilih tujuan baru. Papannya tidak perlu dicetak ulang.'],
  ['Bisa lihat berapa kali papannya dipakai?', 'Bisa. Halaman edit kartu menampilkan jumlah tap dan scan: total, 7 hari, 30 hari, dan grafik 14 hari terakhir.'],
  ['Lupa kode kartu, gimana?', 'Klik "Lupa kode kartu?" di bagian Kelola kartu, masukkan nomor HP yang kamu isi waktu aktivasi, lalu kirim lewat WhatsApp. Kami cocokkan nomornya dan balas dengan kode kartu kamu.'],
  ['Lupa PIN, gimana?', 'Chat WhatsApp kami di 0877-7665-2015 dan sebutkan kode kartunya. Kami bantu reset PIN kamu.'],
  ['Aman nggak? Data HP bisa kecolongan?', 'Aman. Chip NFC cuma menyimpan satu link, sama seperti QR code. Kartu tidak bisa membaca atau mengambil data apa pun dari HP yang menempel, dan hanya terbaca dari jarak beberapa senti.'],
  ['Isi kartu bisa diubah orang lain?', 'Tidak. Halaman edit dilindungi PIN yang disimpan terenkripsi, dan kartu otomatis terkunci kalau PIN salah 5 kali. Chip-nya juga bisa dikunci supaya tidak bisa ditimpa aplikasi NFC lain.'],
  ['Kalau kartu nama hilang?', 'Buka halaman edit kartu lalu centang "Nonaktifkan kartu sementara". Halaman kartu langsung tertutup sampai kamu aktifkan lagi. Profil kartu nama juga tidak diindeks Google.'],
  ['Berapa harga kartu nama NFC?', 'Rp99.000 per kartu, sudah termasuk desain custom pakai logo dan warna kamu. Pesan lewat tombol Pesan kartu nama atau DM Instagram kami.'],
  ['Bisa pakai desain sendiri?', 'Bisa. Warna, logo, dan layout kami sesuaikan dengan brand kamu. Kirim brief desain lewat Instagram atau email.'],
];

const ext = { target: '_blank', rel: 'noopener noreferrer' };

// Semua akun resmi KR Solutions (dipakai di bagian Pesan dan footer).
const SOCIALS = [
  { label: 'Instagram', handle: '@krsolutions.id', href: IG_URL, Icon: IconCamera },
  { label: 'TikTok', handle: '@krsolutions.id', href: TIKTOK_URL, Icon: IconMusic },
  { label: 'Threads', handle: '@krsolutions.id', href: THREADS_URL, Icon: IconAt },
  { label: 'WhatsApp', handle: '0877-7665-2015', href: WA_URL, Icon: IconChat },
  { label: 'Toko', handle: 'lynk.id/krsolutions', href: GRAB, Icon: IconLink },
  { label: 'Email', handle: EMAIL, href: `mailto:${EMAIL}`, Icon: IconMail },
];
const Grab = ({ className = 's-main' }) => (
  <a className={`s-btn ${className}`} href={GRAB} {...ext}>Pesan sekarang</a>
);

export default function Home() {
  return (
    <div className="site">
      <a className="s-skip" href="#desain">Langsung ke isi</a>

      <header className="s-hero">
        <div className="s-wrap">
          <nav className="s-nav" aria-label="Utama">
            <a className="s-brand" href="#" aria-label="KR Solutions"><KMark /> KR Solutions</a>
            <div className="s-navlinks">
              <a href="#desain">Desain</a>
              <a href="#cara-kerja">Cara kerja</a>
              <a href="#harga">Harga</a>
              <a href="#kartu-nama">Kartu nama</a>
              <a href="#faq">FAQ</a>
              <a className="s-pill" href="#edit">Edit kartu</a>
            </div>
          </nav>
          <div className="s-herogrid">
            <div className="s-copy">
              <h1>Pelanggan tinggal tap, review Google kamu langsung terbuka.</h1>
              <p className="s-lead">
                Papan akrilik NFC + QR untuk kasir atau meja kamu. Pelanggan nggak perlu install aplikasi,
                dan desainnya bisa ikut logo serta warna brand kamu.
              </p>
              <div className="s-btns">
                <Grab />
                <a className="s-btn s-ghost" href="#desain">Lihat desain</a>
              </div>
              <p className="s-price-hint">Rp65.000 per papan, atau Rp100.000 untuk dua.</p>
              <ul className="s-proof">
                <li><IconCheck size={16} /> Tanpa aplikasi</li>
                <li><IconCheck size={16} /> Tujuan bisa diganti</li>
                <li><IconCheck size={16} /> Statistik tap</li>
              </ul>
            </div>
            <div className="s-shot">
              <Image
                src="/tap.jpg"
                width={900}
                height={1200}
                priority
                sizes="(max-width: 820px) 100vw, 430px"
                alt="Pelanggan menempelkan HP ke papan review Google di meja kasir kafe"
              />
              <div className="s-tapbadge" aria-hidden="true"><i /> Halaman review terbuka</div>
            </div>
          </div>
        </div>
      </header>

      <section className="s-sec s-designs" id="desain">
        <div className="s-wrap s-head">
          <h2>Desainnya ikut brand kamu.</h2>
          <p className="s-sub">Warna, logo, dan layout kami sesuaikan dengan tempat kamu. Ini beberapa contohnya.</p>
        </div>
        <ul className="s-gallery" aria-label="Contoh desain papan">
          {DESIGNS.map(([src, name, alt]) => (
            <li key={src}>
              <figure>
                <Image src={src} width={928} height={1152} sizes="(max-width: 820px) 78vw, 280px" alt={alt} />
                <figcaption>{name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="s-wrap s-fit">
          <p>Cocok untuk kafe, restoran, salon, barbershop, klinik, dan bengkel.</p>
          <Grab className="s-dark" />
        </div>
      </section>

      <section className="s-sec s-dest" id="fungsi">
        <div className="s-wrap s-destgrid">
          <div className="s-stack" aria-hidden="true">
            <Image className="s-sheet s-sheet-back" src="/papan.jpg" width={720} height={720} sizes="(max-width: 820px) 70vw, 380px" alt="" />
            <Image className="s-sheet s-sheet-front" src="/d-menu-white.jpg" width={640} height={640} sizes="(max-width: 820px) 56vw, 300px" alt="" />
          </div>
          <div>
            <h2>Satu papan, tujuannya kamu yang pilih.</h2>
            <p className="s-sub">Ganti tujuan kapan saja dari HP kamu. Papannya tidak perlu dicetak ulang.</p>
            <ul className="s-destlist">
              {DESTINATIONS.map(([Icon, t, d]) => (
                <li key={t}>
                  <span className="s-ico"><Icon /></span>
                  <div><h3>{t}</h3><p>{d}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="s-sec s-steps" id="cara-kerja">
        <div className="s-wrap s-stepgrid">
          <div>
            <h2>Cara pakainya cuma tiga langkah.</h2>
            <p className="s-sub">Pelanggan tidak perlu install aplikasi apa pun.</p>
            <ol>
              <li><h3>Taruh di tempat yang kelihatan</h3><p>Di kasir, meja, atau resepsionis. Satu papan sudah cukup.</p></li>
              <li><h3>Tap HP atau scan QR</h3><p>Pelanggan tempel HP ke ikon NFC, atau scan kode QR pakai kamera.</p></li>
              <li><h3>Tujuan terbuka</h3><p>Halaman review, menu, atau sosmed kamu langsung muncul di layar.</p></li>
            </ol>
          </div>
          <figure className="s-demo">
            <div className="s-phoneframe">
              <video
                src="/demo-aktivasi.mp4#t=1"
                controls
                muted
                playsInline
                preload="metadata"
                width={384}
                height={848}
                aria-label="Rekaman layar HP: kartu baru di-tap, diaktifkan, lalu dipakai memberi review Google"
              />
            </div>
            <figcaption>Rekaman layar asli: kartu baru di-tap, diaktifkan, lalu dipakai kasih review. 45 detik.</figcaption>
          </figure>
        </div>
      </section>

      <section className="s-sec s-steps s-real" id="demo-asli">
        <div className="s-wrap s-stepgrid">
          <div>
            <h2>Lihat langsung di tangan.</h2>
            <p className="s-sub">
              Direkam pakai HP biasa, tanpa edit. Papan di-tap, diaktifkan sekali, lalu dipakai kasih review Google.
            </p>
            <p className="s-sub">HP tanpa NFC tetap bisa: tinggal scan QR di papan yang sama.</p>
          </div>
          <figure className="s-demo">
            <video
              className="s-realvid"
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
            <figcaption>Video asli dari HP. 42 detik.</figcaption>
          </figure>
        </div>
      </section>

      <section className="s-sec s-statsec" id="statistik">
        <div className="s-wrap s-statgrid">
          <div>
            <h2>Lihat berapa kali papan kamu dipakai.</h2>
            <p className="s-sub">
              Masukkan kode kartu dan PIN, lalu kamu lihat jumlah tap dan scan: total, 7 hari, 30 hari,
              dan grafik 14 hari terakhir.
            </p>
            <p className="s-sub">Dari situ kamu tahu papan mana yang paling sering dipakai pelanggan.</p>
          </div>
          <figure className="s-statpanel">
            <ScanStats stats={SAMPLE_STATS} daily={SAMPLE_DAILY} />
            <figcaption>Contoh tampilan. Angka di atas bukan data klien.</figcaption>
          </figure>
        </div>
      </section>

      <section className="s-sec s-pricing" id="harga">
        <div className="s-wrap">
          <h2>Pilih satu atau dua papan.</h2>
          <p className="s-sub">Fiturnya sama. Paket dua papan bikin harga per papan lebih murah.</p>
          <div className="s-prices">
            <article className="s-price">
              <h3>1 papan</h3>
              <p className="s-amount"><span>Rp</span>65.000</p>
              <p className="s-per">Pas untuk satu kasir atau meja depan.</p>
              <Grab className="s-dark" />
            </article>
            <article className="s-price s-best">
              <p className="s-badge">Hemat Rp30.000</p>
              <h3>Paket 2 papan</h3>
              <p className="s-amount"><span>Rp</span>100.000</p>
              <p className="s-per">Rp50.000 per papan. Pasang di dua meja, atau arahkan ke dua tujuan berbeda.</p>
              <Grab className="s-dark" />
            </article>
          </div>
          <ul className="s-incl">
            <li><IconCheck size={18} /> Chip NFC dan kode QR di setiap papan</li>
            <li><IconCheck size={18} /> Akrilik cetak UV langsung, bukan stiker tempel</li>
            <li><IconCheck size={18} /> Tujuan bisa diganti kapan saja</li>
            <li><IconCheck size={18} /> Statistik tap dan scan</li>
            <li><IconCheck size={18} /> Pelanggan tidak perlu aplikasi</li>
          </ul>
          <p className="s-paynote">
            Pesan lewat lynk.id/krsolutions. Mau tanya desain custom dulu? <a href={IG_DM} {...ext}>DM {IG_HANDLE}</a>.
          </p>
        </div>
      </section>

      <section className="s-sec s-nama" id="kartu-nama">
        <div className="s-wrap s-namagrid">
          <div>
            <p className="s-tag">Baru: kartu nama NFC</p>
            <h2>Kartu nama yang nggak dibuang.</h2>
            <p className="s-sub">
              Tempel kartu ke HP, profil kamu langsung terbuka: nama, jabatan, WhatsApp, Instagram, TikTok,
              LinkedIn, dan link kamu sendiri, plus tombol Simpan kontak. Orang yang menerima nggak perlu
              install aplikasi.
            </p>
            <ul className="s-namalist">
              <li><IconCheck size={18} /> Desain kartu custom pakai logo dan warna kamu.</li>
              <li><IconCheck size={18} /> Isi profil bisa diganti kapan saja: foto, link, warna, urutan tombol. Kartunya tidak perlu dicetak ulang.</li>
              <li><IconCheck size={18} /> Simpan kontak sekali tap, lengkap dengan foto.</li>
            </ul>
            <p className="s-namaprice"><strong>Rp99.000</strong> per kartu</p>
            <div className="s-btns">
              <a className="s-btn s-main" href={WA_KARTU_NAMA} {...ext}>Pesan kartu nama</a>
            </div>
          </div>
          <figure className="s-demo s-namavid">
            <video
              className="s-realvid"
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

        <div className="s-wrap s-namadesigns">
          <h3>Bisa custom, banyak pilihan desain. Contoh:</h3>
          <ul>
            {NAMECARD_DESIGNS.map(([file, name, w, h]) => (
              <li key={file} className={h > w ? 's-tall' : undefined}>
                <Image src={`/social/kartu-nama/desain/${file}.webp`} width={w} height={h} sizes="(max-width: 820px) 60vw, 260px" alt={`Contoh desain kartu nama ${name}`} />
                <span>{name}</span>
              </li>
            ))}
          </ul>
          <p className="s-namanote">Nama, logo, dan foto di atas hanya contoh. Desainnya kami sesuaikan dengan logo, warna, dan data kamu.</p>
        </div>
      </section>

      <section className="s-sec s-edit" id="edit">
        <div className="s-wrap s-editgrid">
          <div>
            <h2>Sudah punya kartu? Kelola di sini.</h2>
            <ul>
              <li><span className="s-dot"><IconCheck size={14} /></span> Ganti tujuan: review, menu, sosmed, atau WhatsApp</li>
              <li><span className="s-dot"><IconCheck size={14} /></span> Lihat berapa kali papan kamu di-tap</li>
              <li><span className="s-dot"><IconCheck size={14} /></span> Ganti nama bisnis dan PIN</li>
            </ul>
            <p className="s-note">Kartu baru? Tap atau scan kartunya untuk aktivasi pertama. Lupa PIN? <a href={waLupaPin()} {...ext}>Minta reset lewat WhatsApp</a>.</p>
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
                <summary>{q}<span className="s-toggle" aria-hidden="true"><IconPlus size={18} /></span></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec s-contact" id="pesan">
        <div className="s-wrap">
          <h2>Siap pesan?</h2>
          <p>Papan review NFC untuk bisnis kamu, atau kartu nama NFC untuk kamu dan tim. Mau desain custom? Kirim brief lewat Instagram atau email.</p>
          <div className="s-btns">
            <a className="s-btn s-main" href={GRAB} {...ext}>Pesan papan review</a>
            <a className="s-btn s-main" href={WA_KARTU_NAMA} {...ext}>Pesan kartu nama</a>
            <a className="s-btn s-ghost" href={IG_URL} {...ext}>Instagram {IG_HANDLE}</a>
          </div>
          <ul className="s-socials" aria-label="Sosial media dan kontak KR Solutions">
            {SOCIALS.map(({ label, handle, href, Icon }) => (
              <li key={label}>
                <a href={href} {...(href.startsWith('mailto:') ? {} : ext)}>
                  <Icon size={20} aria-hidden="true" />
                  <span><strong>{label}</strong>{handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="s-foot">
        <div className="s-wrap">
          <a className="s-brand" href="#" aria-label="KR Solutions"><KMark size={24} /> KR Solutions</a>
          <span>Papan review Google dan kartu nama NFC.</span>
          <nav className="s-footsoc" aria-label="Sosial media">
            {SOCIALS.slice(0, 4).map(({ label, href, Icon }) => (
              <a key={label} href={href} {...ext} aria-label={label} title={label}><Icon size={20} /></a>
            ))}
          </nav>
          <span>&copy; {new Date().getFullYear()} KR Solutions. Jakarta, Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}
