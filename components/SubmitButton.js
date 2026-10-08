'use client';
import { useFormStatus } from 'react-dom';

export default function SubmitButton({ children, className, pending }) {
  const status = useFormStatus();
  const busy = pending ?? status.pending;
  return (
    <button type="submit" disabled={busy} className={className} aria-busy={busy}>
      {busy ? 'Memproses...' : children}
    </button>
  );
}
