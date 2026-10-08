import KMark from './KMark';

export default function CardShell({ title, eyebrow, children, wide = false }) {
  return (
    <div className={`card${wide ? ' card-wide' : ''}`}>
      <a className="card-brand" href="/" aria-label="KR Solutions, ke halaman utama">
        <KMark size={22} /> KR Solutions
      </a>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {children}
    </div>
  );
}
