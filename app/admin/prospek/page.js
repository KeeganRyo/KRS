import { db } from '@/lib/db';
import { adminEnabled, isAdmin } from '@/lib/session';
import { STATUSES } from '@/lib/prospects';
import { AdminLogin } from '@/components/AdminClient';
import AdminNav from '@/components/AdminNav';
import { ImportProspects, ProspectRow } from '@/components/ProspectClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Prospek', robots: { index: false, follow: false } };

const fmt = new Intl.NumberFormat('id-ID');

async function allProspects() {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db().from('prospects').select('*').order('id', { ascending: false }).range(from, from + 999);
    if (error) return { error };
    rows.push(...data);
    if (data.length < 1000) break;
  }
  // Terbaru dulu (database tiruan untuk tes lokal tidak mengurutkan).
  rows.sort((a, b) => b.id - a.id);
  return { rows };
}

export default async function ProspectsPage({ searchParams }) {
  if (!adminEnabled()) return <div className="admin-gate card"><h1>Admin belum aktif</h1></div>;
  if (!(await isAdmin())) return <AdminLogin />;

  const sp = (await searchParams) || {};
  const q = String(sp.q || '').trim().toLowerCase().slice(0, 60);
  const s = STATUSES.some(([k]) => k === sp.s) ? sp.s : '';
  const city = String(sp.city || '').slice(0, 30);
  const { rows = [], error } = await allProspects();

  const searched = rows.filter((p) => (!q || `${p.name} ${p.area || ''} ${p.instagram || ''} ${p.phone || ''}`.toLowerCase().includes(q)) && (!city || p.city === city));
  const shown = s ? searched.filter((p) => p.status === s) : searched;
  const cities = [...new Set(rows.map((p) => p.city).filter(Boolean))].sort();
  const href = (patch) => {
    const p = new URLSearchParams();
    const v = { q: sp.q || '', s, city, ...patch };
    Object.entries(v).forEach(([k, val]) => { if (val) p.set(k, val); });
    const str = p.toString();
    return str ? `/admin/prospek?${str}` : '/admin/prospek';
  };
  const count = (k) => searched.filter((p) => p.status === k).length;

  return (
    <div className="admin">
      <AdminNav current="/admin/prospek" />

      <div className="stat-row admin-stats">
        <div className="stat"><strong>{fmt.format(rows.length)}</strong><span>Prospek</span></div>
        <div className="stat"><strong>{fmt.format(rows.filter((p) => p.status === 'baru').length)}</strong><span>Belum di-chat</span></div>
        <div className="stat"><strong>{fmt.format(rows.filter((p) => p.status === 'beli').length)}</strong><span>Beli</span></div>
      </div>

      <div className="admin-tools">
        <form className="admin-search" role="search">
          <label htmlFor="q" className="sr-only">Cari nama, area, Instagram, atau nomor</label>
          <input id="q" name="q" defaultValue={sp.q || ''} placeholder="Cari nama, area, IG, atau nomor" />
          {s && <input type="hidden" name="s" value={s} />}
          {city && <input type="hidden" name="city" value={city} />}
          <button type="submit">Cari</button>
        </form>
        <ImportProspects />
      </div>

      <nav className="admin-filters" aria-label="Saring status">
        <a href={href({ s: '' })} className={`chip${!s ? ' on' : ''}`} aria-current={!s ? 'page' : undefined}>Semua <span className="count">{fmt.format(searched.length)}</span></a>
        {STATUSES.map(([k, label]) => (
          <a key={k} href={href({ s: k })} className={`chip${s === k ? ' on' : ''}`} aria-current={s === k ? 'page' : undefined}>{label} <span className="count">{fmt.format(count(k))}</span></a>
        ))}
      </nav>
      {cities.length > 1 && (
        <nav className="admin-filters" aria-label="Saring kota">
          <a href={href({ city: '' })} className={`chip${!city ? ' on' : ''}`}>Semua kota</a>
          {cities.map((c) => <a key={c} href={href({ city: c })} className={`chip${city === c ? ' on' : ''}`}>{c}</a>)}
        </nav>
      )}

      {error && <p className="err" role="alert">Gagal memuat prospek: {error.message}. Sudah jalankan migrasi SQL 008?</p>}

      <div className="table-wrap">
        <table className="admin-table prospect-table">
          <thead>
            <tr>
              <th scope="col">Usaha</th>
              <th scope="col">Kontak</th>
              <th scope="col">Status</th>
              <th scope="col"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => <ProspectRow key={p.id} p={p} />)}
            {shown.length === 0 && !error && (
              <tr><td colSpan={4} className="empty">{rows.length ? 'Tidak ada prospek di filter ini.' : 'Belum ada prospek. Klik "Impor dari sheet" untuk memasukkan data.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
