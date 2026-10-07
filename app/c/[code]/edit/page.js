import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { normCode } from '@/lib/validate';
import CardShell from '@/components/CardShell';
import EditForm from '@/components/EditForm';

export const dynamic = 'force-dynamic';

export default async function EditPage({ params }) {
  const code = normCode(params.code);
  const { data: card } = await db().from('cards').select('code,status').eq('code', code).maybeSingle();
  if (!card) notFound();

  if (card.status !== 'active') {
    return (
      <CardShell title="Kartu belum aktif">
        <p>Aktifkan kartunya dulu sebelum bisa diedit.</p>
        <a className="btn" href={`/c/${code}`}>Aktifkan kartu</a>
      </CardShell>
    );
  }

  return (
    <CardShell title="Edit kartu">
      <p>Kode kartu <span className="code">{code}</span></p>
      <EditForm code={code} />
    </CardShell>
  );
}
