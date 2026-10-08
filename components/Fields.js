'use client';
import { useId } from 'react';

// Catatan: form memakai `action={...}` (bukan onSubmit) supaya tetap terkirim sebagai POST
// walaupun JavaScript belum selesai dimuat. React 19 mengosongkan input tak terkontrol setelah
// action selesai, jadi isian yang perlu tetap utuh dibuat terkontrol (useState).

export function PinInput({ name, label, autoFocus = false }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type="password"
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        autoComplete="off"
        autoFocus={autoFocus}
        className="pin"
        required
      />
    </div>
  );
}

// Pesan hasil form, dibacakan pembaca layar.
export function FormMessage({ state }) {
  if (state?.error) return <p className="err" role="alert">{state.error}</p>;
  if (state?.success && state.message) return <p className="ok" role="status">{state.message}</p>;
  return null;
}
