'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    const c = code.trim().toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z0-9]{4,16}$/.test(c)) {
      setError('Kode kartu berisi huruf dan angka, contoh: ABC123. Lihat di belakang papan.');
      return;
    }
    router.push(`/c/${encodeURIComponent(c)}/edit`);
  }

  return (
    <form className="s-codeform" onSubmit={onSubmit} noValidate>
      <label htmlFor="kode-kartu">Kode kartu</label>
      <input
        id="kode-kartu"
        type="text"
        value={code}
        onChange={(e) => { setCode(e.target.value); setError(''); }}
        placeholder="Contoh: ABC123"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        aria-describedby="kode-err"
        aria-invalid={Boolean(error)}
        required
      />
      <p id="kode-err" className="s-err" role="alert">{error}</p>
      <button type="submit">Kelola kartu</button>
    </form>
  );
}
