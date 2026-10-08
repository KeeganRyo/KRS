'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { lookupBusiness, suggestBusiness } from '@/app/actions';

const looksLikeUrl = (q) =>
  !/\s/.test(q) && /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/|\?|$)/i.test(q.trim());

const mapsUrl = (placeId) =>
  `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(placeId)}`;

// Cari bisnis dengan nama atau link Google Maps. Hasil pilihan dikirim lewat input
// tersembunyi `valueName` (Place ID) dan `business_name`.
export default function BusinessPicker({ code, label, valueName = 'target_value', initial = null }) {
  const id = useId();
  const [query, setQuery] = useState(initial?.name || '');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);
  const skip = useRef(Boolean(initial));

  // Saat mengetik: saran otomatis untuk nama bisnis, atau baca link kalau yang ditempel URL.
  useEffect(() => {
    if (skip.current) { skip.current = false; return; }
    const q = query.trim();
    const n = ++seq.current;
    setError('');
    if (q.length < 3) { setResults([]); setBusy(false); return; }

    const isUrl = looksLikeUrl(q);
    const t = setTimeout(async () => {
      setBusy(true);
      const r = isUrl ? await lookupBusiness(code, q) : await suggestBusiness(code, q);
      if (n !== seq.current) return; // jawaban lama, abaikan
      setBusy(false);
      if (r?.error) { setResults([]); setError(r.error); return; }
      setResults(r.results || []);
      if (isUrl && r.results?.length === 1) pick(r.results[0]);
    }, isUrl ? 700 : 350);
    return () => clearTimeout(t);
  }, [query, code]); // eslint-disable-line react-hooks/exhaustive-deps

  async function searchNow() {
    const n = ++seq.current;
    setError('');
    setBusy(true);
    const r = await lookupBusiness(code, query);
    if (n !== seq.current) return;
    setBusy(false);
    if (r?.error) { setResults([]); setError(r.error); return; }
    setResults(r.results || []);
    if (r.results?.length === 1) pick(r.results[0]);
  }

  function pick(r) {
    skip.current = true;
    seq.current++;
    setSelected(r);
    setQuery(r.name || query);
    setResults([]);
    setError('');
    setBusy(false);
  }

  return (
    <div className="field">
      <label htmlFor={`${id}-q`}>{label}</label>
      <input type="hidden" name={valueName} value={selected?.placeId || ''} />
      <input type="hidden" name="business_name" value={selected?.name || ''} />

      <input
        id={`${id}-q`}
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchNow(); } }}
        placeholder="Ketik nama bisnis atau tempel link Google Maps"
        autoComplete="off"
        aria-describedby={`${id}-msg`}
      />

      <div id={`${id}-msg`} aria-live="polite">
        {busy && <p className="hint">Mencari...</p>}
        {error && <p className="err">{error}</p>}
      </div>

      {results.length > 0 && (
        <ul className="results" aria-label="Hasil pencarian bisnis">
          {results.map((r) => (
            <li key={r.placeId}>
              <button type="button" className="result" onClick={() => pick(r)}>
                <strong>{r.name || 'Bisnis'}</strong>
                {r.address && <span>{r.address}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected ? (
        <p className="picked">
          <span>Dipilih: <strong>{selected.name || 'Bisnis dari link'}</strong></span>
          <a href={mapsUrl(selected.placeId)} target="_blank" rel="noreferrer">Cek di Maps</a>
        </p>
      ) : (
        <button type="button" className="secondary" onClick={searchNow} disabled={busy || query.trim().length < 3}>
          Cari bisnis
        </button>
      )}
    </div>
  );
}
