'use client';
import { useFormState } from 'react-dom';
import { activateCard } from '@/app/actions';
import SubmitButton from './SubmitButton';

export default function ActivateForm({ code }) {
  const [state, action] = useFormState(activateCard, null);

  if (state?.success) {
    return (
      <div>
        <p className="ok">Kartu aktif. Coba scan atau tap kartunya untuk memastikan berfungsi.</p>
        <a className="btn" href={`/c/${code}`}>Tes halaman review</a>
      </div>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="code" value={code} />
      <label>Link Google bisnis (Maps atau link review)</label>
      <input name="google_url" type="url" placeholder="https://..." required />
      <label>Nama bisnis (opsional)</label>
      <input name="business_name" type="text" />
      <label>Buat PIN (4 digit angka)</label>
      <input name="pin" type="password" inputMode="numeric" pattern="\d{4}" maxLength={4} required />
      <p className="hint">Simpan PIN baik-baik, dipakai untuk edit atau reset nanti.</p>
      {state?.error && <p className="err">{state.error}</p>}
      <SubmitButton>Aktifkan Kartu</SubmitButton>
    </form>
  );
}
