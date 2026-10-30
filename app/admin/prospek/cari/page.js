import { adminEnabled, isAdmin } from '@/lib/session';
import { todayJakarta } from '@/lib/invoice';
import { AdminLogin } from '@/components/AdminClient';
import AdminNav from '@/components/AdminNav';
import LeadFinder from '@/components/LeadFinder';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 10 pencarian × 2 halaman ke Google
export const metadata = { title: 'Cari leads', robots: { index: false, follow: false } };

export default async function FindLeadsPage() {
  if (!adminEnabled()) return <div className="admin-gate card"><h1>Admin belum aktif</h1></div>;
  if (!(await isAdmin())) return <AdminLogin />;
  const [, m, d] = todayJakarta().split('-');
  return (
    <div className="admin">
      <AdminNav current="/admin/prospek" />
      <p className="inv-back"><a href="/admin/prospek">← Prospek</a></p>
      <LeadFinder batch={`leads ${d}-${m}`} />
    </div>
  );
}
