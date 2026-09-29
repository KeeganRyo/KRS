'use client';
import { useFormState } from 'react-dom';
import { editCard } from '@/app/actions';
import SubmitButton from './SubmitButton';

export default function EditForm({ code }) {
  const [state, action] = useFormState(editCard, null);

  return (
    <form action={action}>
      <input type="hidden" name="code" value={code} />
      <label>PIN saat ini</label>
      <input name="pin" type="password" inputMode="numeric" pattern="\d{4}" maxLength={4} required />
      <label>Link Google baru (kosongkan jika tidak diubah)</label>
      <input name="google_url" type="url" placeholder="https://..." />
      <label>Nama bisnis baru (opsional)</label>
      <input name="business_name" type="text" />
      <label>PIN baru (opsional, 4 digit)</label>
      <input name="new_pin" type="password" inputMode="numeric" pattern="\d{4}" maxLength={4} />
      {state?.error && <p className="err">{state.error}</p>}
      {state?.success && <p className="ok">Perubahan tersimpan.</p>}
      <SubmitButton>Simpan Perubahan</SubmitButton>
    </form>
  );
}
