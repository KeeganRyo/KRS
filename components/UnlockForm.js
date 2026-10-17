'use client';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { unlockCard } from '@/app/actions';
import { waLupaPin } from '@/lib/contact';
import SubmitButton from './SubmitButton';
import { FormMessage, PinInput } from './Fields';

export default function UnlockForm({ code }) {
  const [state, action] = useActionState(unlockCard, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={action}>
      <input type="hidden" name="code" value={code} />
      <PinInput name="pin" label="PIN kartu" autoFocus />
      <FormMessage state={state} />
      <SubmitButton>Buka</SubmitButton>
      <p className="hint center">
        Lupa PIN? <a href={waLupaPin(code)} target="_blank" rel="noreferrer">Minta reset lewat WhatsApp</a>.
      </p>
    </form>
  );
}
