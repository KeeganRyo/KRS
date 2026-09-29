'use client';
import { useFormStatus } from 'react-dom';

export default function SubmitButton({ children }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Memproses...' : children}
    </button>
  );
}
