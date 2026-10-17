'use client';
import { useState } from 'react';
import { WA_NUMBER } from '@/lib/contact';

// 0812..., +62 812..., 62812... jadi 62812... (sama seperti normalizeWhatsapp di server).
const normPhone = (raw) => {
  let d = String(raw || '').replace(/[^\d+]/g, '').replace(/^\+/, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  if (d.startsWith('8')) d = '62' + d;
  return /^\d{9,15}$/.test(d) ? d : null;
};

// "Lupa kode kartu": website tidak menampilkan kode apa pun. Pemilik mengirim WA ke kami,
// lalu admin mencocokkan nomor pengirim dengan nomor yang terdaftar di kartu dan membalas kodenya.
export default function ForgotCodeForm() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  function send(e) {
    e.preventDefault();
    const n = normPhone(phone);
    if (!n) {
      setError('Nomor HP tidak valid. Contoh: 0812 3456 7890.');
      return;
    }
    const text = `Halo KR Solutions, saya lupa kode kartu saya. Nomor HP yang terdaftar: +${n}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  return (
    <form onSubmit={send} noValidate>
      <div className="field">
        <label htmlFor="lupa-hp">Nomor HP</label>
        <input id="lupa-hp" type="tel" inputMode="tel" autoComplete="tel" placeholder="0812 3456 7890" maxLength={30}
          value={phone} onChange={(e) => { setPhone(e.target.value); setError(''); }}
          aria-invalid={Boolean(error)} aria-describedby="lupa-err" required />
      </div>
      <p id="lupa-err" className="err" role="alert">{error}</p>
      <button type="submit">Kirim lewat WhatsApp</button>
      <p className="hint">
        Kirim dari WhatsApp di nomor yang sama, supaya kami bisa memastikan kartu itu milik kamu.
        Kode kartu kami balas lewat chat.
      </p>
    </form>
  );
}
