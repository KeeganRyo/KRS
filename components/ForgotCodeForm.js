'use client';
import { useActionState } from 'react';
import { findMyCards } from '@/app/actions';
import { WA_URL } from '@/lib/contact';
import { TARGET_LABELS } from '@/lib/target-types';
import SubmitButton from './SubmitButton';
import { FormMessage } from './Fields';

export default function ForgotCodeForm() {
  const [state, action] = useActionState(findMyCards, null);
  return (
    <>
      <form action={action}>
        <div className="field">
          <label htmlFor="lupa-hp">Nomor HP</label>
          <input id="lupa-hp" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0812 3456 7890"
            maxLength={30} defaultValue={state?.phone || ''} key={state?.phone || ''} required />
        </div>
        <FormMessage state={state} />
        <SubmitButton>Cari kartu saya</SubmitButton>
      </form>

      {state?.notFound && (
        <p className="hint" role="status">
          Nomor ini belum terdaftar di kartu mana pun. Kartu lama mungkin belum punya nomor HP.{' '}
          <a href={WA_URL} target="_blank" rel="noreferrer">Chat WhatsApp kami</a> untuk bantuan.
        </p>
      )}

      {state?.cards?.length > 0 && (
        <ul className="found-cards" role="status">
          {state.cards.map((c) => (
            <li key={c.code}>
              <div>
                <span className="code">{c.code}</span>
                <span>{c.name || 'Kartu kamu'}{c.type ? ` · ${TARGET_LABELS[c.type] || ''}` : ''}</span>
              </div>
              <a className="btn secondary" href={`/c/${encodeURIComponent(c.code)}/edit`}>Edit kartu ini</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
