import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { normCode } from '@/lib/validate';
import CardShell from '@/components/CardShell';
import ActivateForm from '@/components/ActivateForm';

export const dynamic = 'force-dynamic';

export default async function CardPage({ params }) {
  const code = normCode(params.code);
  const { data: card } = await db()
    .from('cards')
    .select('code,status,google_url,scans')
    .eq('code', code)
    .maybeSingle();

  if (!card) notFound();

  if (card.status === 'active' && card.google_url) {
    await db().from('cards').update({ scans: (card.scans || 0) + 1 }).eq('code', code);
    redirect(card.google_url);
  }

  return (
    <CardShell title="Aktifkan kartu kamu">
      <p>Kode kartu <span className="code">{code}</span>. Pilih bisnis kamu di Google dan buat PIN, lalu kartu siap dipakai.</p>
      <ActivateForm code={code} />
    </CardShell>
  );
}
