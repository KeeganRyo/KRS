'use client';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addCards, adminLogin, deleteCard, resetCard, resetPin, unlockCard } from '@/app/admin/actions';
import KMark from './KMark';
import SubmitButton from './SubmitButton';
import { FormMessage } from './Fields';

export function AdminLogin() {
  const [state, action] = useActionState(adminLogin, null);
  const router = useRouter();
  useEffect(() => { if (state?.success) router.refresh(); }, [state, router]);
  return (
    <div className="card admin-gate">
      <span className="card-brand"><KMark size={22} /> KR Solutions</span>
      <h1>Admin</h1>
      <form action={action}>
        <div className="field">
          <label htmlFor="admin-pw">Password</label>
          <input id="admin-pw" name="password" type="password" autoComplete="current-password" required autoFocus />
        </div>
        <FormMessage state={state} />
        <SubmitButton>Masuk</SubmitButton>
      </form>
    </div>
  );
}

// Tombol aksi per kartu. Hasil (misalnya PIN baru) tampil di baris itu.
export function RowActions({ code, active, locked }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState(null);

  const run = (fn, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    start(async () => {
      const r = await fn(code);
      setMsg(r);
      router.refresh();
    });
  };

  // Kartu aktif dipakai klien: minta kode diketik ulang supaya tidak terhapus tidak sengaja.
  const remove = () => {
    let typed = '';
    if (active) {
      typed = window.prompt(`Kartu ${code} sedang AKTIF dipakai. Kalau dihapus, tap kartunya jadi halaman tidak ditemukan dan riwayat scan hilang.\n\nKetik ${code} untuk menghapus:`);
      if (typed === null) return;
    } else if (!window.confirm(`Hapus kode ${code}? Kode ini hilang dari database.`)) {
      return;
    }
    start(async () => {
      const r = await deleteCard(code, typed);
      setMsg(r);
      router.refresh();
    });
  };

  return (
    <div className="row-actions">
      <a className="mini" href={`/admin/qr/${code}`} download={`qr_${code}.svg`}>QR</a>
      {active && (
        <button type="button" className="mini" disabled={pending}
          onClick={() => run(resetPin, `Buat PIN baru untuk ${code}? PIN lama tidak berlaku lagi.`)}>
          Reset PIN
        </button>
      )}
      {locked && (
        <button type="button" className="mini" disabled={pending} onClick={() => run(unlockCard)}>Buka kunci</button>
      )}
      {active && (
        <button type="button" className="mini danger" disabled={pending}
          onClick={() => run(resetCard, `Kosongkan kartu ${code}? Tujuan, PIN, dan riwayat scan dihapus, dan kartu harus diaktivasi ulang.`)}>
          Kosongkan
        </button>
      )}
      <button type="button" className="mini danger" disabled={pending} onClick={remove}>Hapus</button>
      {msg && (
        <p className={msg.error ? 'err' : 'ok'} role="status">
          {msg.error || msg.message}
          {msg.pin && <> · kirim ke pemilik kartu, PIN ini hanya tampil sekali.</>}
        </p>
      )}
    </div>
  );
}

export function AddCardsForm() {
  const [state, action] = useActionState(addCards, null);
  const router = useRouter();
  useEffect(() => { if (state?.success) router.refresh(); }, [state, router]);
  return (
    <form action={action} className="add-cards">
      <label htmlFor="count">Kartu baru</label>
      <input id="count" name="count" type="number" min={1} max={100} defaultValue={10} />
      <label htmlFor="kind" className="sr-only">Jenis kartu</label>
      <select id="kind" name="kind" defaultValue="board">
        <option value="board">Papan</option>
        <option value="namecard">Kartu nama</option>
      </select>
      <SubmitButton className="secondary">Buat kode</SubmitButton>
      <FormMessage state={state} />
      {state?.codes && (
        <p className="ok" role="status">
          {state.codes.length} kode dibuat: <span className="codes">{state.codes.join(', ')}</span>. Download QR dari tabel.
        </p>
      )}
    </form>
  );
}

// Tabel admin dibaca langsung dari Supabase. Komponen ini memuat ulang datanya tiap beberapa detik
// (hanya saat tab terlihat) dan saat tab dibuka lagi, jadi perubahan dari luar ikut tampil tanpa refresh.
export function AutoRefresh({ seconds = 10 }) {
  const router = useRouter();
  const [at, setAt] = useState(null);
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      router.refresh();
      setAt(new Date());
    };
    setAt(new Date());
    const id = setInterval(tick, seconds * 1000);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [router, seconds]);
  return (
    <span className="live-sync" role="status">
      <span className="dot" aria-hidden="true" />
      Sinkron dengan database{at ? ` · ${at.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
    </span>
  );
}
