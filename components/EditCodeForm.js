'use client';

import { useActionState } from 'react';
import { openEdit } from '@/app/actions';
import SubmitButton from './SubmitButton';

// Form POST ke server action: tetap jalan walaupun JavaScript belum dimuat,
// dan kode yang salah dijawab di sini (bukan halaman 404).
export default function EditCodeForm() {
  const [state, action] = useActionState(openEdit, null);
  return (
    <form className="s-codeform" action={action}>
      <label htmlFor="kode-kartu">Kode kartu</label>
      <input
        id="kode-kartu"
        name="code"
        type="text"
        defaultValue={state?.code || ''}
        key={state?.code || ''}
        autoFocus={Boolean(state?.error)}
        placeholder="Contoh: ABC123"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={20}
        aria-describedby="kode-err"
        aria-invalid={Boolean(state?.error)}
        required
      />
      <p id="kode-err" className="s-err" role="alert">{state?.error || ''}</p>
      <SubmitButton>Kelola kartu</SubmitButton>
    </form>
  );
}
