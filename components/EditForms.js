'use client';
import { useActionState, useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { changePin, saveName, saveTarget } from '@/app/actions';
import SubmitButton from './SubmitButton';
import DestinationPicker from './DestinationPicker';
import { FormMessage, PinInput } from './Fields';

// Setelah tersimpan, muat ulang data server (tujuan/nama terbaru tampil di atas).
function useRefreshOnSuccess(state) {
  const router = useRouter();
  useEffect(() => {
    if (state?.success || state?.expired) router.refresh();
  }, [state, router]);
}

const withMessage = (state, message) => (state?.success ? { ...state, message } : state);

export function TargetForm({ code, initial }) {
  const [state, action] = useActionState(saveTarget, null);
  useRefreshOnSuccess(state);
  return (
    <form action={action}>
      <input type="hidden" name="code" value={code} />
      <DestinationPicker code={code} initial={initial} />
      <FormMessage state={withMessage(state, 'Tujuan kartu tersimpan. Tap kartunya untuk mengetes.')} />
      <SubmitButton>Simpan tujuan</SubmitButton>
    </form>
  );
}

export function NameForm({ code, name }) {
  const id = useId();
  const [value, setValue] = useState(name || '');
  const [state, action] = useActionState(saveName, null);
  useRefreshOnSuccess(state);
  return (
    <form action={action}>
      <input type="hidden" name="code" value={code} />
      <div className="field">
        <label htmlFor={id}>Nama bisnis</label>
        <input id={id} name="business_name" value={value} onChange={(e) => setValue(e.target.value)} maxLength={120} placeholder="Nama yang tampil di halaman ini" />
      </div>
      <FormMessage state={withMessage(state, 'Nama tersimpan.')} />
      <SubmitButton className="secondary">Simpan nama</SubmitButton>
    </form>
  );
}

// Isian PIN otomatis dikosongkan React setelah action selesai (diinginkan untuk PIN).
export function PinForm({ code }) {
  const [state, action] = useActionState(changePin, null);
  useRefreshOnSuccess(state);
  return (
    <form action={action}>
      <input type="hidden" name="code" value={code} />
      <div className="pin-row">
        <PinInput name="new_pin" label="PIN baru" />
        <PinInput name="new_pin_confirm" label="Ulangi PIN baru" />
      </div>
      <FormMessage state={withMessage(state, 'PIN baru tersimpan.')} />
      <SubmitButton className="secondary">Ganti PIN</SubmitButton>
    </form>
  );
}
