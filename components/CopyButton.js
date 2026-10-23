'use client';
import { useState } from 'react';

// Salin teks (password WiFi). Clipboard API butuh HTTPS; kalau diblokir, pakai cara lama (execCommand).
export default function CopyButton({ text, label = 'Salin password', done = 'Password tersalin', className = 'wf-copy' }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      const t = document.createElement('textarea');
      t.value = text;
      t.setAttribute('readonly', '');
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      t.remove();
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <button type="button" className={className} onClick={copy}>
      <span aria-live="polite">{copied ? `✓ ${done}` : label}</span>
    </button>
  );
}
