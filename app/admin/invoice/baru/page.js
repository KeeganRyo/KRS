import { adminEnabled, isAdmin } from '@/lib/session';
import { AdminLogin } from '@/components/AdminClient';
import AdminNav from '@/components/AdminNav';
import { InvoiceForm } from '@/components/InvoiceClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Invoice baru', robots: { index: false, follow: false } };

export default async function NewInvoicePage({ searchParams }) {
  if (!adminEnabled()) return <div className="admin-gate card"><h1>Admin belum aktif</h1></div>;
  if (!(await isAdmin())) return <AdminLogin />;
  const sp = (await searchParams) || {};
  // Bisa diisi dari halaman Prospek: /admin/invoice/baru?name=...&phone=...
  const initial = { buyer: String(sp.name || '').slice(0, 120), buyer_phone: String(sp.phone || '').slice(0, 30) };
  return (
    <div className="admin">
      <AdminNav current="/admin/invoice" />
      <p className="inv-back"><a href="/admin/invoice">← Riwayat invoice</a></p>
      <InvoiceForm initial={initial} />
    </div>
  );
}
