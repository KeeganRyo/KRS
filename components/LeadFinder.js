'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { addLeads, findLeads } from '@/app/admin/prospek/cari/actions';
import { MAX_QUERIES, SKIP_LABELS } from '@/lib/leads';
import SubmitButton from './SubmitButton';
import { FormMessage } from './Fields';

const CITIES = ['Jakarta', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Timur', 'Tangerang', 'Tangerang Selatan', 'Bekasi', 'Depok', 'Bogor'];
const count = (v) => new Set(String(v || '').split(/[,\n]/).map((x) => x.trim().toLowerCase()).filter(Boolean)).size;
const fmt = new Intl.NumberFormat('id-ID');

// Cari usaha di Google Maps (Places API), pilih, lalu masukkan ke Prospek.
export default function LeadFinder({ batch: defaultBatch }) {
  const [state, action] = useActionState(findLeads, null);
  const [kinds, setKinds] = useState('');
  const [areas, setAreas] = useState('');
  const [city, setCity] = useState('Jakarta');
  const [picked, setPicked] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [batch, setBatch] = useState(defaultBatch);
  const [msg, setMsg] = useState(null);
  const [pending, start] = useTransition();
  const n = count(kinds) * count(areas);
  const leads = state?.leads || [];

  useEffect(() => {
    setPicked(new Set((state?.leads || []).map((l) => l.id)));
    setSaved(new Set());
    setMsg(null);
  }, [state]);

  const toggle = (id) => setPicked((s) => { const x = new Set(s); x.has(id) ? x.delete(id) : x.add(id); return x; });
  const open = leads.filter((l) => !saved.has(l.id));
  const chosen = open.filter((l) => picked.has(l.id));
  const save = () => start(async () => {
    const r = await addLeads(chosen, batch);
    setMsg(r);
    if (r?.success) setSaved((s) => new Set([...s, ...chosen.map((l) => l.id)]));
  });

  return (
    <>
      <form action={action} className="card inv-form lead-form">
        <h2>Cari leads dari Google Maps</h2>
        <label className="field"><span className="label">Jenis usaha</span>
          <input name="kinds" value={kinds} onChange={(e) => setKinds(e.target.value)} placeholder="coffee shop, billiard, padel" required />
        </label>
        <label className="field"><span className="label">Area</span>
          <input name="areas" value={areas} onChange={(e) => setAreas(e.target.value)} placeholder="Tebet, Kemang, Blok M" required />
        </label>
        <label className="field"><span className="label">Kota</span>
          <input name="city" list="lead-cities" value={city} onChange={(e) => setCity(e.target.value)} />
          <datalist id="lead-cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
        </label>
        <p className={n > MAX_QUERIES ? 'err' : 'hint'}>
          {n ? `${n} pencarian (jenis × area), maksimal ${MAX_QUERIES}.` : 'Pisahkan dengan koma.'} Tiap pencarian dapat sampai 40 tempat.
        </p>
        <SubmitButton>Cari</SubmitButton>
        <FormMessage state={state?.error ? state : null} />
      </form>

      {state?.success && (
        <section className="lead-results">
          <p className="hint">
            Ketemu {fmt.format(state.total)} tempat dari {state.queries} pencarian, {fmt.format(leads.length)} lolos saringan.{' '}
            Dibuang: {Object.entries(state.skip).filter(([, v]) => v).map(([k, v]) => `${SKIP_LABELS[k]} ${v}`).join(', ') || '-'}.
          </p>
          {state.warn && <p className="err">{state.warn}</p>}

          {open.length > 0 && (
            <div className="lead-save card inv-form">
              <label className="field"><span className="label">Nama batch</span><input value={batch} onChange={(e) => setBatch(e.target.value)} maxLength={40} /></label>
              <button type="button" disabled={pending || !chosen.length} onClick={save}>
                {pending ? 'Menyimpan...' : `Masukkan ${chosen.length} ke Prospek`}
              </button>
              <button type="button" className="link-btn" onClick={() => setPicked(new Set(chosen.length === open.length ? [] : open.map((l) => l.id)))}>
                {chosen.length === open.length ? 'Kosongkan pilihan' : 'Pilih semua'}
              </button>
            </div>
          )}
          {msg && <p className={msg.error ? 'err' : 'ok'} role="status">{msg.error || msg.message} {msg.success && <a href="/admin/prospek?s=baru">Buka Prospek</a>}</p>}

          {leads.length > 0 && (
            <div className="table-wrap">
              <table className="admin-table lead-table">
                <thead><tr><th scope="col"><span className="sr-only">Pilih</span></th><th scope="col">Usaha</th><th scope="col">Kontak</th><th scope="col" className="num">Review</th></tr></thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className={saved.has(l.id) ? 'is-void' : undefined}>
                      <td><input type="checkbox" aria-label={`Pilih ${l.name}`} checked={saved.has(l.id) || picked.has(l.id)} disabled={saved.has(l.id)} onChange={() => toggle(l.id)} /></td>
                      <td>
                        <strong>{l.name}</strong>
                        <span className="sub">{[l.category, [l.area, l.city].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}</span>
                        {l.maps_url && <a className="sub" href={l.maps_url} target="_blank" rel="noreferrer">Lihat di Maps</a>}
                      </td>
                      <td><span>+{l.phone}</span>{l.instagram && <span className="sub">{l.instagram}</span>}</td>
                      <td className="num">{fmt.format(l.reviews)}{l.rating ? <span className="sub">★ {l.rating}</span> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </>
  );
}
