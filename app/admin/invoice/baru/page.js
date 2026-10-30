import { db } from '@/lib/db';
import { adminEnabled, isAdmin } from '@/lib/session';
import { AdminLogin } from '@/components/AdminClient';
import AdminNav from '@/components/AdminNav';
import { InvoiceForm } from '@/components/InvoiceClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Invoice baru', robots: { index: false, follow: false } };

// 6281234... -> 081234... (format yang biasa diketik).
const localPhone = (p) => (p ? `0${String(p).replace(/^62/, '')}` : '');

// Nama usaha untuk saran: pembeli invoice lama dulu, lalu semua prospek. Tidak dobel per nama.
async function businesses() {
  const out = new Map();
  const add = (name, phone) => {
    const k = String(name || '').trim().toLowerCase();
    if (k && !out.has(k)) out.set(k, { name: String(name).trim(), phone: phone || '' });
  };
  const { data: inv } = await db().from('invoices').select('buyer,buyer_phone');
  (inv || []).forEach((r) => add(r.buyer, r.buyer_phone));
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db().from('prospects').select('name,phone').range(from, from + 999);
    if (error || !data) break;
    data.forEach((r) => add(r.name, localPhone(r.phone)));
    if (data.length < 1000) break;
  }
  return [...out.values()].sort((a, b) => a.name.localeCompare(b.name, 'id'));
}

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
      <InvoiceForm initial={initial} businesses={await businesses()} />
    </div>
  );
}
