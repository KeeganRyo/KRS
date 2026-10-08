'use client';
import { useActionState } from 'react';
import { activateCard, editAfterActivation } from '@/app/actions';
import { IG_DM, IG_HANDLE } from '@/lib/contact';
import SubmitButton from './SubmitButton';
import DestinationPicker from './DestinationPicker';
import { FormMessage, PinInput } from './Fields';
import { IconCheck } from './Icons';

export default function ActivateForm({ code }) {
  const [state, action] = useActionState(activateCard, null);

  if (state?.success) {
    return (
      <div className="done" role="status">
        <div className="done-badge" aria-hidden="true"><IconCheck size={30} /></div>
        <h1>Kartu aktif!</h1>
        <p>Tap atau scan kartunya sekali untuk memastikan tujuannya benar.</p>
        <div className="keep">
          <span>Simpan baik-baik</span>
          <p>Kode kartu <span className="code">{code}</span> dan PIN kamu. Keduanya kamu pakai untuk mengganti tujuan atau melihat statistik di krsolutions.tech.</p>
        </div>
        <a className="btn" href={`/c/${code}`}>Tes kartu sekarang</a>
        <form action={editAfterActivation.bind(null, code)}>
          <input type="hidden" name="token" value={state.token || ''} />
          <button type="submit" className="secondary btn-gap">Lihat statistik dan pengaturan</button>
        </form>
      </div>
    );
  }

  return (
    <form action={action}>
      <h1>Aktifkan kartu kamu</h1>
      <p className="intro">
        Kode kartu <span className="code">{code}</span>. Pilih ke mana kartu ini dibuka saat di-tap,
        lalu buat PIN. Cuma butuh semenit.
      </p>
      <input type="hidden" name="code" value={code} />
      <DestinationPicker code={code} withName />
      <div className="pin-row">
        <PinInput name="pin" label="Buat PIN (4 angka)" />
        <PinInput name="pin_confirm" label="Ulangi PIN" />
      </div>
      <p className="hint">PIN kamu pakai untuk edit kartu nanti. Lupa PIN? DM <a href={IG_DM} target="_blank" rel="noreferrer">{IG_HANDLE}</a>.</p>
      <FormMessage state={state} />
      <SubmitButton>Aktifkan kartu</SubmitButton>
    </form>
  );
}
