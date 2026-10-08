import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { isCode, normCode } from '@/lib/validate';
import { hasEditSession } from '@/lib/session';
import { codeMissAllowed } from '@/lib/throttle';
import { describeTarget } from '@/lib/target-types';
import { lockCard } from '@/app/actions';
import CardShell from '@/components/CardShell';
import TooManyMisses from '@/components/TooManyMisses';
import UnlockForm from '@/components/UnlockForm';
import ScanStats from '@/components/ScanStats';
import { NameForm, PinForm, TargetForm } from '@/components/EditForms';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit kartu' };

export default async function EditPage({ params }) {
  const code = normCode((await params).code);
  if (!isCode(code)) notFound();

  const { data: card } = await db()
    .from('cards')
    .select('code,status,business_name,target_type,target_value,target_url,google_url')
    .eq('code', code)
    .maybeSingle();
  if (!card) {
    if (!(await codeMissAllowed())) return <TooManyMisses />;
    notFound();
  }

  if (card.status !== 'active') {
    return (
      <CardShell title="Kartu belum aktif">
        <p>Aktifkan kartunya dulu sebelum bisa diedit.</p>
        <a className="btn" href={`/c/${code}`}>Aktifkan kartu</a>
      </CardShell>
    );
  }

  if (!(await hasEditSession(code))) {
    return (
      <CardShell title="Masukkan PIN">
        <p>
          Kode kartu <span className="code">{code}</span>
          {card.business_name ? <> · {card.business_name}</> : null}
        </p>
        <UnlockForm code={code} />
      </CardShell>
    );
  }

  const [{ data: statRows }, { data: daily }] = await Promise.all([
    db().rpc('card_stats', { p_code: code }),
    db().rpc('card_daily', { p_code: code, p_days: 14 }),
  ]);

  // Kartu lama (sebelum migrasi) hanya punya google_url.
  const type = card.target_type || (card.google_url ? 'review' : null);
  const value = card.target_value || card.google_url?.match(/placeid=([^&]+)/)?.[1] || '';
  const initial = type ? { type, value: decodeURIComponent(value), name: card.business_name || '' } : null;

  return (
    <CardShell title={card.business_name || 'Kartu kamu'} wide>
      <p className="sub-title">Kode kartu <span className="code">{code}</span></p>
      <div className="now">
        <span>Saat di-tap, kartu membuka</span>
        <a href={card.target_url || card.google_url || '#'} target="_blank" rel="noreferrer">
          {type ? describeTarget(type, initial.value, card.business_name) : 'Belum diatur'}
        </a>
      </div>

      <ScanStats stats={statRows?.[0]} daily={daily || []} />

      <section className="panel">
        <h2>Ganti tujuan</h2>
        <p className="hint">Papan tidak perlu dicetak ulang. Perubahan langsung berlaku.</p>
        <TargetForm code={code} initial={initial} />
      </section>

      <section className="panel">
        <h2>Nama bisnis</h2>
        <NameForm code={code} name={card.business_name} />
      </section>

      <section className="panel">
        <h2>Ganti PIN</h2>
        <PinForm code={code} />
      </section>

      <form action={lockCard.bind(null, code)} className="logout">
        <button type="submit" className="link-btn">Kunci lagi halaman ini</button>
      </form>
    </CardShell>
  );
}
