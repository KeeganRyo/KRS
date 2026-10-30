import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { adminEnabled, isAdmin } from '@/lib/session';
import { STATUS_LABEL, longDate, rp, total } from '@/lib/invoice';
import { AdminLogin } from '@/components/AdminClient';
import AdminNav from '@/components/AdminNav';
import { InvoiceActions, InvoiceForm, InvoiceImage } from '@/components/InvoiceClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Invoice', robots: { index: false, follow: false } };

export default async function InvoicePage({ params, searchParams }) {
  if (!adminEnabled()) return <div className="admin-gate card"><h1>Admin belum aktif</h1></div>;
  if (!(await isAdmin())) return <AdminLogin />;
  const { id } = await params;
  const sp = (await searchParams) || {};
  if (!/^\d{1,15}$/.test(id)) notFound();
  const { data: inv } = await db().from('invoices').select('*').eq('id', Number(id)).maybeSingle();
  if (!inv) notFound();

  return (
    <div className="admin">
      <AdminNav current="/admin/invoice" />
      <p className="inv-back"><a href="/admin/invoice">← Riwayat invoice</a></p>
      {sp.edit ? <InvoiceForm initial={inv} /> : (
        <div className="inv-screen">
          <div className="card inv-form">
            <h2>{inv.buyer}</h2>
            <p className="hint">{inv.number} · {longDate(inv.issued_on)}</p>
            <p className="inv-total">{rp(total(inv))} <span className={`tag inv-tag-${inv.status}`}>{STATUS_LABEL[inv.status]}</span></p>
            {inv.status === 'paid' && inv.paid_on && <p className="hint">Dibayar {longDate(inv.paid_on)}</p>}
            {inv.buyer_phone && <p className="hint">WA {inv.buyer_phone}</p>}
            <InvoiceActions inv={inv} />
            <p className="hint">Belum dibayar: kirim PNG sebagai tagihan. Setelah transfer masuk, klik Tandai lunas, lalu kirim PNG versi LUNAS sebagai bukti bayar.</p>
          </div>
          <div className="inv-preview"><InvoiceImage inv={inv} /></div>
        </div>
      )}
    </div>
  );
}
