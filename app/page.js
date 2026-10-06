import './landing.css';
import EditCodeForm from '@/components/EditCodeForm';

export const metadata = {
  title: 'KR Solutions | Papan NFC dan QR untuk Review Google',
  description:
    'Papan NFC dan QR dari KR Solutions. Pelanggan tinggal tap atau scan, halaman review Google bisnis kamu langsung terbuka.',
  robots: { index: true, follow: true },
};

// Ganti dengan nomor WhatsApp kamu, format 628123456789 (tanpa + dan spasi)
const WA_NUMBER = '62XXXXXXXXXX';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  'Halo KR Solutions, saya mau pesan papan review Google'
)}`;

function KMark({ size = 30 }) {
  return (
    <svg className="s-k" width={size} height={size} viewBox="470 450 690 710" aria-hidden="true">
      <path d="M496.26,470.85c.76,0,1.52,0,2.3-.01c2.55-.01,5.1-.01,7.65-.02c1.82,0,3.64-.01,5.47-.02c4.96-.01,9.92-.02,14.88-.03c3.1-.01,6.2-.01,9.3-.02c9.7-.02,19.39-.03,29.08-.04c11.2-.01,22.39-.04,33.59-.08c8.65-.03,17.3-.04,25.95-.05c5.16,0,10.33-.01,15.5-.03c4.86-.03,9.72-.03,14.59-.02c1.78,0,3.57-.01,5.35-.02c2.44-.02,4.87-.01,7.31,0c.35,0,.35,0,2.14-.03c5.03,.06,7.82,1.28,11.63,4.52c5.27,5.92,5.72,10.26,5.63,18.04c0,1.11,.01,2.21,.02,3.36c.01,3.72,0,7.45-.02,11.18c0,2.69,.01,5.39,.02,8.08c.02,5.86,.01,11.73,0,17.59c-.02,8.72-.01,17.44,0,26.16c.02,15.58,.02,31.15,0,46.73c-.02,13.63-.02,27.26-.02,40.89c0,.9,0,1.8,0,2.74c0,3.66,0,7.33,0,11c.01,34.42,0,68.84-.04,103.26c-.02,30.59-.03,61.17-.01,91.76c0,7.83,0,15.66,.01,23.49c0,.49,0,.49,0,2.93c.01,25.54,0,51.09-.01,76.64c0,2.75,0,5.5,0,8.25c-.01,1.82-.01,3.65-.01,5.47c0,13.62,0,27.24,.01,40.87c0,15.48,0,30.97-.03,46.46c-.01,8.67-.02,17.34,0,26.01c0,5.79,0,11.58-.02,17.36c-.01,3.3-.01,6.6,0,9.9c.01,3.56,0,7.11-.02,10.67c.01,1.02,.01,2.05,.02,3.1c-.06,6.05-.78,11.12-4.53,16.06c-2.27,1.75-4.37,2.78-7,4c-.66,.33-1.32,.66-2,1c-2.39,.11-4.75,.15-7.13,.15c-.75,.01-1.49,.01-2.26,.02c-2.5,.01-5,.02-7.51,.02c-1.79,.01-3.58,.02-5.37,.03c-5.89,.02-11.78,.04-17.68,.05c-2.02,.01-4.05,.01-6.08,.02c-8.43,.02-16.87,.04-25.3,.05c-12.09,.02-24.18,.05-36.27,.11c-8.5,.04-17,.06-25.5,.06c-5.07,0-10.15,.02-15.22,.05c-4.78,.03-9.56,.04-14.34,.02c-1.75,0-3.5,.01-5.25,.03c-15.88,.15-15.88,.15-21.57-3.85c-5.54-6.41-6.1-11.59-6.02-19.82c-.01-1.11-.01-2.22-.02-3.36c-.02-3.74,0-7.47,.01-11.21c0-2.7-.01-5.4-.02-8.1c-.01-5.87-.01-11.75,0-17.63c.01-8.74,.01-17.47-.01-26.21c-.02-15.61-.01-31.21,0-46.82c.01-13.66,.01-27.31,0-40.97c0-.9,0-1.81,0-2.74c0-3.68,0-7.35,0-11.03c-.01-34.48,0-68.96,.02-103.44c.02-30.65,.02-61.3,0-91.94c-.02-34.42-.03-68.84-.02-103.26c0-3.67,0-7.34,0-11.01c.01-.9,.01-1.8,.01-2.73c0-13.65-.01-27.3-.02-40.95c-.01-15.52,0-31.03,.02-46.55c.01-8.69,.01-17.38,0-26.07c-.01-5.79-.01-11.59,.01-17.39c.01-3.31,.01-6.61,0-9.92c-.01-3.56,0-7.12,.02-10.68c-.01-1.03-.02-2.06-.03-3.12c.06-5.94,.6-9.28,4.53-13.81c4.94-4.35,7.83-5.15,14.26-5.15Z" />
      <path d="M776.67,470.61c.87,0,1.75-.01,2.65-.01c2.92-.02,5.84-.01,8.77,0c2.09-.01,4.19-.02,6.28-.02c5.7-.02,11.39-.02,17.09-.02c4.75,.01,9.5,0,14.26,0c11.21-.02,22.43-.02,33.65-.01c11.57,.02,23.14,0,34.71-.03c9.93-.02,19.86-.02,29.8-.02c5.93,.01,11.86,0,17.8-.01c5.58-.02,11.16-.02,16.74,0c2.04,.01,4.09,0,6.14-.01c2.79-.01,5.59,0,8.39,.02c.4-.01,.4-.01,2.44-.03c6.38,.08,11.87,1.82,16.49,6.39c.37,.62,.74,1.25,1.12,1.89c.39,.61,.78,1.23,1.19,1.86c2.79,8.2-.63,14.97-3.81,22.52c-.53,1.27-1.05,2.54-1.57,3.82c-1.21,2.95-2.43,5.89-3.66,8.84c-2.46,5.95-4.89,11.92-7.32,17.89c-.93,2.29-1.85,4.57-2.78,6.85c-.47,1.15-.94,2.31-1.42,3.5c-2.41,5.91-4.82,11.82-7.24,17.74c-4.06,9.96-8.11,19.92-12.14,29.89c-5.83,14.39-11.67,28.78-17.53,43.16c-.89,2.18-1.77,4.35-2.66,6.53c-1.24,3.05-2.48,6.11-3.72,9.16c-.37,.9-.73,1.79-1.11,2.72c-9.39,23-9.39,23-18.23,26.77c-3.11,.37-3.11,.37-6.48,.37c-1.29,.01-2.57,.02-3.9,.02c-1.41-.01-2.82-.01-4.23-.02c-1.5,0-3,.01-4.5,.01c-3.21,.01-6.43,.01-9.65,0c-5.08-.01-10.17,0-15.26,.02c-12.64,.03-25.28,.04-37.92,.04c-9.83-.01-19.66,0-29.48,.04c-5.06,.01-10.12,.01-15.17,0c-3.15-.01-6.3,0-9.45,.02c-1.46,0-2.91,0-4.37-.01c-13.79-.1-13.79-.1-19.59,4.51c-3.55,4.3-4.68,8.31-4.37,13.88c.62,3.52,2.08,5.38,4.37,8.12c.27,.32,.27,.32,1.64,1.96c5.91,6.82,12.37,13.11,18.8,19.44c3.45,3.42,6.83,6.84,9.99,10.53c4.26,4.95,8.92,9.49,13.57,14.07c5.26,5.18,10.39,10.37,15.2,15.98c3.58,4.02,7.46,7.75,11.3,11.52c5.12,5.04,10.1,10.1,14.78,15.56c3.68,4.15,7.74,7.96,11.73,11.82c.64,.64,1.29,1.27,1.95,1.92c.3,.29,.3,.29,1.77,1.72C853,813,853,813,853,815c.6,.26,1.2,.53,1.82,.8c2.31,1.27,3.41,2.4,5.06,4.45c4.02,4.77,8.42,9.11,12.88,13.47c2.98,2.94,5.83,5.92,8.55,9.09c4.31,4.99,9,9.57,13.69,14.19c5.26,5.18,10.39,10.37,15.2,15.98c3.58,4.02,7.46,7.75,11.3,11.52c9.1,8.95,9.1,8.95,12.97,13.47c4.24,4.94,8.89,9.46,13.53,14.03c5.26,5.18,10.39,10.37,15.2,15.98c3.58,4.02,7.46,7.75,11.3,11.52c5.09,5.01,10.03,10.04,14.68,15.46c3.59,4.02,7.48,7.76,11.32,11.54c9.1,8.95,9.1,8.95,12.97,13.47c4.24,4.94,8.89,9.46,13.53,14.03c5.26,5.18,10.39,10.37,15.2,15.98c3.58,4.02,7.46,7.75,11.3,11.52c9.1,8.95,9.1,8.95,12.97,13.47c4.24,4.94,8.89,9.46,13.53,14.03c5.26,5.18,10.39,10.37,15.2,15.98c3.58,4.02,7.46,7.75,11.3,11.52c9.1,8.95,9.1,8.95,12.97,13.47c4.24,4.94,8.89,9.46,13.53,14.03c22.09,21.76,22.09,21.76,22.31,30.25c-.05,5.09-.81,7.87-4.31,11.75c-4.35,4.03-7.56,5.12-13.39,5.14c-.88,0-1.75,.01-2.66,.01c-.48,0-.48,0-2.91,0c-1.02,.01-2.04,.01-3.1,.02c-3.43,.01-6.87,.02-10.31,.02c-2.46,.01-4.92,.02-7.38,.03c-7.39,.02-14.78,.04-22.17,.05c-2.09,0-4.18,.01-6.26,.01c-12.97,.03-25.94,.05-38.91,.06c-3.01,0-6.01,.01-9.01,.01c-.75,0-1.49,0-2.26,0c-12.09,.02-24.18,.05-36.27,.09c-12.42,.04-24.84,.07-37.25,.07c-6.97,0-13.94,.02-20.91,.05c-6.56,.03-13.11,.04-19.67,.02c-2.41,0-4.81,.01-7.22,.03c-3.29,.02-6.57,.01-9.86,0c-.95,.01-1.9,.03-2.88,.04c-7.61-.09-12.52-2.53-17.84-7.95c-.61-.81-1.23-1.62-1.86-2.45c-.75-.96-1.5-1.91-2.27-2.9c-.41-.53-.81-1.06-1.24-1.6c-2.11-2.69-4.3-5.31-6.49-7.93c-6.48-7.81-12.74-15.74-18.88-23.82c-1.58-2.04-3.17-4.08-4.75-6.12c-5.96-7.74-11.74-15.61-17.5-23.49c-1.63-2.22-3.26-4.44-4.9-6.66c-35.44-48.23-64.3-99.43-85.05-155.57c-.74-1.99-1.48-3.99-2.24-5.98c-5.04-13.41-9.34-26.82-12.9-40.69c-.61-2.31-1.27-4.59-1.96-6.88c-4.09-13.64-6.36-27.58-8.7-41.61c-.18-1.02-.35-2.03-.53-3.08c-1.23-7.16-2.2-14.33-3.03-21.54c-.13-1.04-.25-2.08-.38-3.14c-2.25-19.36-2.31-38.77-2.36-58.23c0-3.11-.02-6.22-.06-9.33c-.21-21.26,.99-41.66,4.36-62.68c.16-1.03,.32-2.06,.49-3.11c1.06-6.65,2.25-13.27,3.51-19.89c.17-.92,.34-1.84,.52-2.78c2.9-15.45,6.48-30.64,10.56-45.82c.93-3.42,1.84-6.86,2.75-10.29c4.22-15.86,8.7-31.61,13.65-47.26c1.25-3.98,2.48-7.96,3.7-11.95c.59-1.94,1.19-3.89,1.79-5.83c.58-1.9,1.16-3.79,1.73-5.69c1.91-6.2,3.93-12.28,6.43-18.27c.87-2.12,1.62-4.26,2.37-6.42c3.84-9.43,9.31-12.15,19.17-12.08Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="site">
      <header className="s-hero">
        <div className="s-wrap">
          <nav className="s-nav" aria-label="Utama">
            <a className="s-brand" href="#" aria-label="KR Solutions">
              <KMark /> KR Solutions
            </a>
            <a className="s-pill" href="#edit">Edit Kartu</a>
          </nav>
          <div className="s-herogrid">
            <div>
              <h1>Review Google, dibikin gampang.</h1>
              <p className="s-lead">
                Papan NFC dan QR dari KR Solutions. Pelanggan tinggal tap atau scan, halaman review
                bisnis kamu langsung terbuka.
              </p>
              <div className="s-btns">
                <a className="s-btn s-main" href={WA_LINK} target="_blank" rel="noopener noreferrer">Chat di WhatsApp</a>
                <a className="s-btn s-ghost" href="#edit">Edit kartu kamu</a>
              </div>
            </div>
            <div className="s-float">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/produk.jpg"
                width="400"
                height="497"
                alt="Papan akrilik KR Solutions dengan tulisan Tinggalkan review kamu di Google, ikon NFC, dan kode QR, melayang di udara"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="s-sec">
        <div className="s-wrap s-why">
          <h2>Sebelum datang, orang cek Google dulu.</h2>
          <div>
            <p>
              Rating dan review menentukan bisnis kamu dipilih atau dilewati. Pelanggan yang puas sering
              lupa menulisnya, dan meminta review langsung terasa canggung.
            </p>
            <p>Papan ini yang mengingatkan mereka. Tanpa mengetik link, tanpa mencari nama bisnis kamu di Maps.</p>
          </div>
        </div>
      </section>

      <section className="s-sec s-steps" id="cara-kerja">
        <div className="s-wrap">
          <h2>Tiga langkah, selesai.</h2>
          <ol>
            <li><h3>Taruh di tempat yang kelihatan</h3><p>Di kasir, meja, atau meja resepsionis. Satu papan sudah cukup.</p></li>
            <li><h3>Tap HP atau scan QR</h3><p>Tempelkan HP ke ikon NFC, atau scan kode QR dengan kamera.</p></li>
            <li><h3>Tulis review</h3><p>Halaman review Google bisnis kamu langsung terbuka. Pelanggan tinggal menulis.</p></li>
          </ol>
        </div>
      </section>

      <section className="s-sec">
        <div className="s-wrap">
          <h2>Pilih tampilan yang cocok dengan tempat kamu.</h2>
          <div className="s-models">
            <div className="s-model">
              <h3>Standar</h3>
              <p>Papan akrilik frosted dengan dudukan akrilik bening. Ringan, bersih, cocok untuk meja kasir.</p>
            </div>
            <div className="s-model s-premium">
              <h3>Premium</h3>
              <p>Papan yang sama dengan dudukan metal. Tampil lebih mewah untuk kafe dan restoran yang mengutamakan suasana.</p>
            </div>
          </div>
          <p className="s-fit">Cocok untuk kafe, restoran, salon, barbershop, klinik, dan bengkel. Hubungi kami untuk harga dan jumlah pesanan.</p>
        </div>
      </section>

      <section className="s-sec s-edit" id="edit">
        <div className="s-wrap s-editgrid">
          <div>
            <h2>Sudah punya kartu? Edit di sini.</h2>
            <p>
              Ganti bisnis tujuan review, ubah nama, atau ganti PIN. Masukkan kode kartu, lalu konfirmasi
              dengan PIN 4 digit.
            </p>
            <p className="s-note">Kartu baru? Tap atau scan kartunya untuk aktivasi pertama.</p>
          </div>
          <EditCodeForm />
        </div>
      </section>

      <section className="s-sec s-contact" id="pesan">
        <div className="s-wrap">
          <h2>Siap menambah review untuk bisnis kamu?</h2>
          <p>Kirim nama bisnis dan jenis tempat kamu. Kami bantu pilih papan yang pas.</p>
          <div className="s-btns">
            <a className="s-btn s-main" href={WA_LINK} target="_blank" rel="noopener noreferrer">Chat di WhatsApp</a>
            <a className="s-btn s-ghost" href="https://instagram.com/krsolutions.id" target="_blank" rel="noopener noreferrer">Instagram @krsolutions.id</a>
          </div>
          <p className="s-mail">Atau kirim email ke <a href="mailto:keegan@krsolutions.tech">keegan@krsolutions.tech</a></p>
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
