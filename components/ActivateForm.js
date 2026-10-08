'use client';
import { useActionState } from 'react';
import { activateCard } from '@/app/actions';
import { IG_DM, IG_HANDLE } from '@/lib/contact';
import SubmitButton from './SubmitButton';
import DestinationPicker from './DestinationPicker';
import { FormMessage, PinInput } from './Fields';

export default function ActivateForm({ code }) {
  const [state, action] = useActionState(activateCard, null);

  if (state?.success) {
    return (
      <div className="done" role="status">
        <div className="done-badge" aria-hidden="true">✓</div>
        <h2>Kartu aktif!</h2>
        <p>Tap atau scan kartunya sekali untuk memastikan tujuannya benar.</p>
        <div className="keep">
          <span>Simpan baik-baik</span>
          <p>Kode kartu <span className="code">{code}</span> dan PIN kamu. Keduanya dipakai untuk mengganti tujuan atau melihat statistik di <strong>krsolutions.tech</strong>.</p>
        </div>
        <a className="btn" href={`/c/${code}`}>Tes kartu sekarang</a>
        <a className="btn btn-soft" href={`/c/${code}/edit`}>Buka halaman edit</a>
      </div>
    );
  }

  return (
    <form action={action}>
      <p className="intro">
        Kode kartu <span className="code">{code}</span>. Pilih ke mana kartu ini dibuka saat di-tap,
        lalu buat PIN. Selesai dalam satu menit.
      </p>
      <input type="hidden" name="code" value={code} />
      <DestinationPicker code={code} />
      <div className="pin-row">
        <PinInput name="pin" label="Buat PIN (4 angka)" />
        <PinInput name="pin_confirm" label="Ulangi PIN" />
      </div>
      <p className="hint">PIN dipakai untuk edit kartu nanti. Lupa PIN? DM <a href={IG_DM} target="_blank" rel="noreferrer">{IG_HANDLE}</a>.</p>
      <FormMessage state={state} />
      <SubmitButton>Aktifkan kartu</SubmitButton>
    </form>
  );
}
