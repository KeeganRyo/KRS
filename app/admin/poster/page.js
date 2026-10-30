import { adminEnabled, isAdmin } from '@/lib/session';
import { todayJakarta } from '@/lib/invoice';
import { AdminLogin } from '@/components/AdminClient';
import AdminNav from '@/components/AdminNav';
import PosterStudio from '@/components/PosterStudio';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Poster hari besar', robots: { index: false, follow: false } };

export default async function PosterPage() {
  if (!adminEnabled()) return <div className="admin-gate card"><h1>Admin belum aktif</h1></div>;
  if (!(await isAdmin())) return <AdminLogin />;
  return (
    <div className="admin">
      <AdminNav current="/admin/poster" />
      <PosterStudio today={todayJakarta()} />
    </div>
  );
}
