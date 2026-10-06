'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    const c = code.trim();
    if (!c) return;
    router.push(`/c/${encodeURIComponent(c)}/edit`);
  }

  return (
    <form className="s-codeform" onSubmit={onSubmit}>
      <label htmlFor="kode-kartu">Kode kartu</label>
      <input
        id="kode-kartu"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Contoh: ABC123"
        autoComplete="off"
        autoCapitalize="characters"
        required
      />
      <button type="submit">Buka halaman edit</button>
    </form>
  );
}
