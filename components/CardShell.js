import KMark from './KMark';

// Bingkai kartu putih. Tanpa `title`, isi kartu memasang judulnya sendiri (misalnya form aktivasi).
export default function CardShell({ title, children, wide = false }) {
  return (
    <div className={`card${wide ? ' card-wide' : ''}`}>
      <a className="card-brand" href="/" aria-label="KR Solutions, ke halaman utama">
        <KMark size={22} /> KR Solutions
      </a>
      {title && <h1>{title}</h1>}
      {children}
    </div>
  );
}
