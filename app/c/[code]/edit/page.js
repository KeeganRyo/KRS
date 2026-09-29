import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { normCode } from '@/lib/validate';
import EditForm from '@/components/EditForm';

export const dynamic = 'force-dynamic';

export default async function EditPage({ params }) {
  const code = normCode(params.code);
  const { data: card } = await db().from('cards').select('code,status').eq('code', code).maybeSingle();
  if (!card) notFound();

  if (card.status !== 'active') {
    return (
      <div className="card">
        <h1>Kartu belum aktif</h1>
        <p><a href={`/c/${code}`}>Aktifkan dulu</a></p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>Edit Kartu</h1>
      <p>Kode kartu: <strong>{code}</strong></p>
      <EditForm code={code} />
    </div>
  );
}
