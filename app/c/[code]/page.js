import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { normCode } from '@/lib/validate';
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
    <div className="card">
      <h1>Aktivasi Kartu</h1>
      <p>Kode kartu: <strong>{code}</strong>. Isi kolom di bawah untuk mengaktifkan kartu.</p>
      <ActivateForm code={code} />
    </div>
  );
}
