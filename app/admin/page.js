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

  const q = String((await searchParams)?.q || '').trim().slice(0, 60);
  const { data: rows, error } = await db().rpc('admin_cards', { p_q: q });
  const cards = rows || [];
  const active = cards.filter((c) => c.status === 'active');
  const total30 = active.reduce((n, c) => n + (c.last_30 || 0), 0);

  return (
    <div className="admin">
      <header className="admin-top">
        <a className="card-brand" href="/"><KMark size={22} /> KR Solutions · Admin</a>
        <form action={adminLogout}><button className="link-btn" type="submit">Keluar</button></form>
      </header>

      <div className="stat-row admin-stats">
        <div className="stat"><strong>{fmt.format(cards.length)}</strong><span>Kartu{q ? ' (hasil cari)' : ''}</span></div>
        <div className="stat"><strong>{fmt.format(active.length)}</strong><span>Aktif</span></div>
        <div className="stat"><strong>{fmt.format(total30)}</strong><span>Scan 30 hari</span></div>
      </div>

      <div className="admin-tools">
        <form className="admin-search" role="search">
          <label htmlFor="q" className="sr-only">Cari kode atau nama bisnis</label>
          <input id="q" name="q" defaultValue={q} placeholder="Cari kode atau nama bisnis" />
          <button type="submit">Cari</button>
        </form>
        <AddCardsForm />
      </div>

      {error && <p className="err" role="alert">Gagal memuat data: {error.message}. Sudah jalankan migrasi SQL?</p>}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Kode</th>
              <th scope="col">Bisnis / tujuan</th>
              <th scope="col" className="num">Scan</th>
              <th scope="col" className="num">30 hari</th>
              <th scope="col">Aktif sejak</th>
              <th scope="col"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => {
              const locked = c.locked_until && new Date(c.locked_until) > new Date();
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
                  <td>{d(c.activated_at)}</td>
                  <td><RowActions code={c.code} active={c.status === 'active'} locked={Boolean(locked)} /></td>
                </tr>
              );
            })}
            {cards.length === 0 && !error && (
              <tr><td colSpan={6} className="empty">Tidak ada kartu{q ? ` untuk "${q}"` : ''}.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
