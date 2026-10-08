import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { isCode, normCode } from '@/lib/validate';
import { isBotRequest } from '@/lib/bots';
import { codeMissAllowed } from '@/lib/throttle';
import CardShell from '@/components/CardShell';
import ActivateForm from '@/components/ActivateForm';
import TooManyMisses from '@/components/TooManyMisses';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Aktifkan kartu' };

export default async function CardPage({ params }) {
  const code = normCode((await params).code);
  if (!isCode(code)) notFound();

  if (isBotRequest(await headers())) {
    // Robot preview link: arahkan ke tujuan tanpa mencatat scan.
    const { data: c } = await db().from('cards').select('status,target_url,google_url').eq('code', code).maybeSingle();
    const url = c?.status === 'active' ? c.target_url || c.google_url : null;
    if (url) redirect(url);
  } else {
    // Satu panggilan: kalau kartu aktif, scan dicatat dan URL tujuan dikembalikan.
    const { data: url } = await db().rpc('card_hit', { p_code: code });
    if (url) redirect(url);
  }

  const { data: card } = await db().from('cards').select('code,status').eq('code', code).maybeSingle();
  if (!card) {
    if (!(await codeMissAllowed())) return <TooManyMisses />;
    notFound();
  }
  if (card.status === 'active') {
    // Aktif tapi belum punya tujuan (data lama yang tidak lengkap).
    redirect(`/c/${code}/edit`);
  }

  return (
    <CardShell>
      <ActivateForm code={code} />
    </CardShell>
  );
}
