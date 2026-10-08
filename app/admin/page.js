import { db } from '@/lib/db';
import { adminEnabled, isAdmin } from '@/lib/session';
import { TARGET_LABELS } from '@/lib/target-types';
import { adminLogout } from './actions';
import KMark from '@/components/KMark';
import { AddCardsForm, AdminLogin, RowActions } from '@/components/AdminClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin', robots: { index: false, follow: false } };

const fmt = new Intl.NumberFormat('id-ID');
const dateFmt = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' });
const d = (v) => (v ? dateFmt.format(new Date(v)) : '—');
const ago = (v) => {
  if (!v) return 'Belum pernah';
  const days = Math.floor((Date.now() - new Date(v)) / 86400000);
  return days <= 0 ? 'Hari ini' : days === 1 ? 'Kemarin' : `${days} hari lalu`;
};
const FILTERS = [
  ['', 'Semua'],
  ['aktif', 'Aktif'],
  ['baru', 'Belum aktif'],
  ['terkunci', 'Terkunci'],
  ['sepi', 'Sepi 14 hari'],
];
const isLocked = (c) => c.locked_until && new Date(c.locked_until) > new Date();
const matches = {
  aktif: (c) => c.status === 'active',
  baru: (c) => c.status !== 'active',
  terkunci: isLocked,
  // Kartu aktif yang tidak di-tap 14 hari: bahan follow-up ke klien.
  sepi: (c) => c.status === 'active' && (!c.last_scan_at || Date.now() - new Date(c.last_scan_at) > 14 * 86400000),
};
const shortUrl = (u) => String(u || '').replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');

export default async function AdminPage({ searchParams }) {
  if (!adminEnabled()) {
    return (
      <div className="admin-gate card">
        <h1>Admin belum aktif</h1>
        <p>Isi environment variable <code>ADMIN_PASSWORD</code> di Vercel (minimal 16 karakter), lalu redeploy.</p>
      </div>
    );
  }
  if (!(await isAdmin())) return <AdminLogin />;

  const sp = (await searchParams) || {};
  const q = String(sp.q || '').trim().slice(0, 60);
  const f = matches[sp.f] ? sp.f : '';
  const { data: rows, error } = await db().rpc('admin_cards', { p_q: q });
  const all = rows || [];
  const cards = f ? all.filter(matches[f]) : all;
  const active = all.filter((c) => c.status === 'active');
  const href = (key) => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (key) p.set('f', key);
    const s = p.toString();
    return s ? `/admin?${s}` : '/admin';
  };
  const total30 = active.reduce((n, c) => n + (c.last_30 || 0), 0);

  return (
    <div className="admin">
      <header className="admin-top">
        <a className="card-brand" href="/"><KMark size={22} /> KR Solutions · Admin</a>
        <form action={adminLogout}><button className="link-btn" type="submit">Keluar</button></form>
      </header>

      <div className="stat-row admin-stats">
        <div className="stat"><strong>{fmt.format(all.length)}</strong><span>Kartu{q ? ' (hasil cari)' : ''}</span></div>
        <div className="stat"><strong>{fmt.format(active.length)}</strong><span>Aktif</span></div>
        <div className="stat"><strong>{fmt.format(total30)}</strong><span>Scan 30 hari</span></div>
      </div>

      <div className="admin-tools">
        <form className="admin-search" role="search">
          <label htmlFor="q" className="sr-only">Cari kode atau nama bisnis</label>
          <input id="q" name="q" defaultValue={q} placeholder="Cari kode atau nama bisnis" />
          {f && <input type="hidden" name="f" value={f} />}
          <button type="submit">Cari</button>
        </form>
        <AddCardsForm />
      </div>

      <nav className="admin-filters" aria-label="Saring kartu">
        {FILTERS.map(([key, label]) => (
          <a key={key || 'all'} href={href(key)} className={`chip${f === key ? ' on' : ''}`} aria-current={f === key ? 'page' : undefined}>
            {label}{' '}
            <span className="count">{fmt.format(key ? all.filter(matches[key]).length : all.length)}</span>
          </a>
        ))}
      </nav>

      {error && <p className="err" role="alert">Gagal memuat data: {error.message}. Sudah jalankan migrasi SQL?</p>}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Kode</th>
              <th scope="col">Bisnis / tujuan</th>
              <th scope="col" className="num">Scan</th>
              <th scope="col" className="num">30 hari</th>
              <th scope="col">Scan terakhir</th>
              <th scope="col">Aktif sejak</th>
              <th scope="col"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => {
              const locked = isLocked(c);
              return (
                <tr key={c.code}>
                  <td>
                    <span className="code">{c.code}</span>
                    <span className={`tag ${c.status === 'active' ? 'tag-on' : ''}`}>{c.status === 'active' ? 'Aktif' : 'Baru'}</span>
                    {locked && <span className="tag tag-warn">Terkunci</span>}
                  </td>
                  <td>
                    <strong>{c.business_name || (c.status === 'active' ? 'Tanpa nama' : '—')}</strong>
                    {c.target_type && (
                      <a className="sub" href={c.target_url} target="_blank" rel="noreferrer">
                        {TARGET_LABELS[c.target_type]}
                        {c.target_type !== 'review' ? ` · ${shortUrl(c.target_url)}` : ''}
                      </a>
                    )}
                  </td>
                  <td className="num">{fmt.format(c.scans || 0)}</td>
                  <td className="num">{fmt.format(c.last_30 || 0)}</td>
                  <td className="muted">{c.status === 'active' ? ago(c.last_scan_at) : '—'}</td>
                  <td>{d(c.activated_at)}</td>
                  <td><RowActions code={c.code} active={c.status === 'active'} locked={Boolean(locked)} /></td>
                </tr>
              );
            })}
            {cards.length === 0 && !error && (
              <tr><td colSpan={7} className="empty">Tidak ada kartu{q ? ` untuk "${q}"` : ''}{f ? ' di filter ini' : ''}.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
