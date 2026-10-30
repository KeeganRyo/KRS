import { db } from '@/lib/db';
import { adminEnabled, isAdmin } from '@/lib/session';
import { STATUSES, longDate, rp, total } from '@/lib/invoice';
import { AdminLogin } from '@/components/AdminClient';
import AdminNav from '@/components/AdminNav';
import { InvoiceStatusSelect } from '@/components/InvoiceClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Invoice', robots: { index: false, follow: false } };

const fmt = new Intl.NumberFormat('id-ID');

async function allInvoices() {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db().from('invoices').select('*').order('id', { ascending: false }).range(from, from + 999);
    if (error) return { error };
    rows.push(...data);
    if (data.length < 1000) break;
  }
  // Terbaru dulu (database tiruan untuk tes lokal tidak mengurutkan).
  rows.sort((a, b) => b.number.localeCompare(a.number));
  return { rows };
}

export default async function InvoicesPage({ searchParams }) {
  if (!adminEnabled()) return <div className="admin-gate card"><h1>Admin belum aktif</h1></div>;
  if (!(await isAdmin())) return <AdminLogin />;

  const sp = (await searchParams) || {};
  const q = String(sp.q || '').trim().toLowerCase().slice(0, 60);
  const s = STATUSES.some(([k]) => k === sp.s) ? sp.s : '';
  const { rows = [], error } = await allInvoices();

  const searched = rows.filter((v) => !q || `${v.number} ${v.buyer} ${v.buyer_phone || ''}`.toLowerCase().includes(q));
  const shown = s ? searched.filter((v) => v.status === s) : searched;
  const sum = (st) => rows.filter((v) => v.status === st).reduce((a, v) => a + total(v), 0);
  const unpaidCount = rows.filter((v) => v.status === 'unpaid').length;
  const href = (patch) => {
    const p = new URLSearchParams();
    Object.entries({ q: sp.q || '', s, ...patch }).forEach(([k, val]) => { if (val) p.set(k, val); });
    const str = p.toString();
    return str ? `/admin/invoice?${str}` : '/admin/invoice';
  };

  return (
    <div className="admin">
      <AdminNav current="/admin/invoice" />

      <div className="stat-row admin-stats inv-stats">
        <div className="stat"><strong>{rp(sum('paid'))}</strong><span>Sudah dibayar</span></div>
        <div className="stat"><strong>{rp(sum('unpaid'))}</strong><span>Belum dibayar ({fmt.format(unpaidCount)})</span></div>
        <div className="stat"><strong>{fmt.format(rows.length)}</strong><span>Invoice</span></div>
      </div>

      <div className="admin-tools">
        <form className="admin-search" role="search">
          <label htmlFor="q" className="sr-only">Cari nomor, pembeli, atau nomor WA</label>
          <input id="q" name="q" defaultValue={sp.q || ''} placeholder="Cari nomor atau pembeli" />
          {s && <input type="hidden" name="s" value={s} />}
          <button type="submit">Cari</button>
        </form>
        <a className="btn btn-auto" href="/admin/invoice/baru">Buat invoice</a>
      </div>

      <nav className="admin-filters" aria-label="Saring status">
        <a href={href({ s: '' })} className={`chip${!s ? ' on' : ''}`} aria-current={!s ? 'page' : undefined}>Semua <span className="count">{fmt.format(searched.length)}</span></a>
        {STATUSES.map(([k, label]) => (
          <a key={k} href={href({ s: k })} className={`chip${s === k ? ' on' : ''}`} aria-current={s === k ? 'page' : undefined}>{label} <span className="count">{fmt.format(searched.filter((v) => v.status === k).length)}</span></a>
        ))}
      </nav>

      {error && <p className="err" role="alert">Gagal memuat invoice: {error.message}. Sudah jalankan migrasi SQL 009?</p>}

      <div className="table-wrap">
        <table className="admin-table invoice-table">
          <thead>
            <tr>
              <th scope="col">Invoice</th>
              <th scope="col">Pembeli</th>
              <th scope="col" className="num">Total</th>
              <th scope="col">Status</th>
              <th scope="col"><span className="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((v) => (
              <tr key={v.id} className={v.status === 'void' ? 'is-void' : undefined}>
                <td><strong className="mono">{v.number.replace('INV-KRS-', '')}</strong><span className="sub">{longDate(v.issued_on)}</span></td>
                <td><strong>{v.buyer}</strong><span className="sub">{(v.items || []).map((it) => `${it.qty}× ${it.name}`).join(', ')}</span></td>
                <td className="num">{rp(total(v))}</td>
                <td>
                  <InvoiceStatusSelect id={v.id} status={v.status} label={v.number} />
                  {v.status === 'paid' && v.paid_on && <span className="sub">Dibayar {longDate(v.paid_on)}</span>}
                </td>
                <td><div className="row-actions"><a className="mini" href={`/admin/invoice/${v.id}`}>Lihat</a></div></td>
              </tr>
            ))}
            {shown.length === 0 && !error && (
              <tr><td colSpan={5} className="empty">{rows.length ? 'Tidak ada invoice di filter ini.' : 'Belum ada invoice. Klik "Buat invoice".'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
