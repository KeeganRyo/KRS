import KMark from './KMark';

export default function CardShell({ title, children }) {
  return (
    <div className="card">
      <a className="card-brand" href="/" aria-label="KR Solutions">
        <KMark size={22} /> KR Solutions
      </a>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
