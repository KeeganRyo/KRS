import KMark from './KMark';
import { adminLogout } from '@/app/admin/actions';

const TABS = [
  ['/admin', 'Kartu'],
  ['/admin/prospek', 'Prospek'],
  ['/admin/desain', 'Desain'],
  ['/admin/invoice', 'Invoice'],
  ['/admin/poster', 'Poster'],
];

// Header admin + tab antar halaman admin.
export default function AdminNav({ current, children }) {
  return (
    <>
      <header className="admin-top">
        <a className="card-brand" href="/"><KMark size={22} /> KR Solutions · Admin</a>
        {children}
        <form action={adminLogout}><button className="link-btn" type="submit">Keluar</button></form>
      </header>
      <nav className="admin-tabs" aria-label="Menu admin">
        {TABS.map(([href, label]) => (
          <a key={href} href={href} className={current === href ? 'on' : undefined} aria-current={current === href ? 'page' : undefined}>{label}</a>
        ))}
      </nav>
    </>
  );
}
