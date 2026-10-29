'use client';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { importProspects, markChatted, setProspectNote, setProspectStatus } from '@/app/admin/prospek/actions';
import { STATUSES, WA_TEXT, waNumber } from '@/lib/prospects';
import SubmitButton from './SubmitButton';
import { FormMessage } from './Fields';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' });

export function ProspectRow({ p }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState(p.status);
  const [msg, setMsg] = useState(null);
  const num = waNumber(p.phone);
  const ig = p.instagram ? p.instagram.replace(/^@/, '') : '';

  const save = (fn) => start(async () => {
    const r = await fn();
    setMsg(r?.error ? r : null);
    router.refresh();
  });

  const onStatus = (e) => {
    const v = e.target.value;
    setStatus(v);
    save(() => setProspectStatus(p.id, v));
  };

  const editNote = () => {
    const v = window.prompt(`Catatan untuk ${p.name}`, p.note || '');
    if (v !== null) save(() => setProspectNote(p.id, v));
  };

  const designHref = `/admin/desain?${new URLSearchParams({ name: p.name, ...(p.instagram ? { ig: p.instagram } : {}) })}`;

  return (
    <tr className={pending ? 'is-pending' : undefined}>
      <td>
        <strong>{p.name}</strong>
        <span className="sub">{[p.area, p.city].filter(Boolean).join(', ')}{p.category ? ` · ${p.category}` : ''}{p.rating ? ` · ★ ${p.rating}` : ''}</span>
        {p.note && <span className="sub note" title={p.note}>{p.note}</span>}
      </td>
      <td>
        {p.phone ? <span className="mono">+{p.phone}</span> : <span className="muted">Tanpa nomor</span>}
        {ig && <a className="sub" href={`https://www.instagram.com/${ig}/`} target="_blank" rel="noreferrer">@{ig}</a>}
      </td>
      <td>
        <label className="sr-only" htmlFor={`st-${p.id}`}>Status {p.name}</label>
        <select id={`st-${p.id}`} className={`status-select st-${status}`} value={status} onChange={onStatus} disabled={pending}>
          {STATUSES.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
        </select>
        {p.contacted_at && <span className="sub">Dihubungi {dateFmt.format(new Date(p.contacted_at))}</span>}
      </td>
      <td>
        <div className="row-actions">
          {num && (
            <a className="mini mini-wa" href={`https://wa.me/${num}?text=${encodeURIComponent(WA_TEXT)}`} target="_blank" rel="noreferrer"
              onClick={() => { if (status === 'baru') { setStatus('chat'); save(() => markChatted(p.id)); } }}>Buka WA</a>
          )}
          <a className="mini" href={designHref}>Desain</a>
          <button type="button" className="link-btn" onClick={editNote}>Catatan</button>
          {msg?.error && <p className="err" role="alert">{msg.error}</p>}
        </div>
      </td>
    </tr>
  );
}

export function ImportProspects() {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(importProspects, null);
  const router = useRouter();
  useEffect(() => { if (state?.success) router.refresh(); }, [state, router]);
  if (!open) return <button type="button" className="secondary btn-auto" onClick={() => setOpen(true)}>Impor dari sheet</button>;
  return (
    <form action={action} className="card import-card">
      <div className="field">
        <label htmlFor="imp-rows">Tempel baris dari Google Sheet</label>
        <textarea id="imp-rows" name="rows" rows={6} required placeholder="Pilih baris di sheet Prospek (kolom A sampai N), Ctrl+C, lalu Ctrl+V di sini" />
        <p className="hint">Prospek dengan nomor (atau nama) yang sudah ada dilewati, jadi aman ditempel ulang.</p>
      </div>
      <div className="field">
        <label htmlFor="imp-batch">Nama batch <span className="opt">(opsional)</span></label>
        <input id="imp-batch" name="batch" maxLength={40} placeholder="Contoh: 29-10" />
      </div>
      <FormMessage state={state} />
      <SubmitButton>Impor</SubmitButton>
      <button type="button" className="link-btn" onClick={() => setOpen(false)}>Tutup</button>
    </form>
  );
}
