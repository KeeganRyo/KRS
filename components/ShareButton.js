'use client';
import { useState } from 'react';
import { IconShare } from './Icons';

// Bagikan link kartu nama. Pakai menu bagikan bawaan HP; kalau tidak ada, salin link.
export default function ShareButton({ url, title }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* dibatalkan pengguna */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard diblokir */ }
  }

  return (
    <button type="button" className="pf-share" onClick={share} aria-label="Bagikan kartu nama">
      <IconShare size={18} />
      <span aria-live="polite">{copied ? 'Link disalin' : 'Bagikan'}</span>
    </button>
  );
}
