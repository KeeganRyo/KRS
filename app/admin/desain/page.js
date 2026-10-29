import { adminEnabled, isAdmin } from '@/lib/session';
import { AdminLogin } from '@/components/AdminClient';
import AdminNav from '@/components/AdminNav';
import DesignStudio from '@/components/DesignStudio';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Desain papan', robots: { index: false, follow: false } };

export default async function DesignPage({ searchParams }) {
  if (!adminEnabled()) return <div className="admin-gate card"><h1>Admin belum aktif</h1></div>;
  if (!(await isAdmin())) return <AdminLogin />;
  const sp = (await searchParams) || {};
  // QR selalu ke domain produksi supaya file cetak dari mana pun tetap benar.
  const baseUrl = (process.env.PUBLIC_BASE_URL || 'https://www.krsolutions.tech').replace(/\/$/, '');
  return (
    <div className="admin">
      <AdminNav current="/admin/desain" />
      <DesignStudio baseUrl={baseUrl} initialName={String(sp.name || '').slice(0, 60)} instagram={String(sp.ig || '').slice(0, 40)} />
    </div>
  );
}
