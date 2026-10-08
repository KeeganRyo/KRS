import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { isCode, normCode } from '@/lib/validate';
import CardShell from '@/components/CardShell';
import ActivateForm from '@/components/ActivateForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Aktifkan kartu' };

export default async function CardPage({ params }) {
  const code = normCode((await params).code);
  if (!isCode(code)) notFound();

  // Satu panggilan: kalau kartu aktif, scan dicatat dan URL tujuan dikembalikan.
  const { data: url } = await db().rpc('card_hit', { p_code: code });
  if (url) redirect(url);

  const { data: card } = await db().from('cards').select('code,status').eq('code', code).maybeSingle();
  if (!card) notFound();
  if (card.status === 'active') {
    // Aktif tapi belum punya tujuan (data lama yang tidak lengkap).
    redirect(`/c/${code}/edit`);
  }

  return (
    <CardShell title="Aktifkan kartu kamu" eyebrow="Kartu baru">
      <ActivateForm code={code} />
    </CardShell>
  );
}
