'use client';
import { useEffect, useRef, useState } from 'react';
import { lookupBusiness, suggestBusiness } from '@/app/actions';

const looksLikeUrl = (q) =>
  !/\s/.test(q) && /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/|\?|$)/i.test(q.trim());

export default function BusinessPicker({ code, label }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);
  const skip = useRef(false);

  // Saat mengetik: saran otomatis untuk nama bisnis, atau baca link kalau yang ditempel URL.
  useEffect(() => {
    if (skip.current) { skip.current = false; return; }
    const q = query.trim();
    const id = ++seq.current;
    setError('');
    if (q.length < 3) { setResults([]); setBusy(false); return; }

    const isUrl = looksLikeUrl(q);
    const t = setTimeout(async () => {
      setBusy(true);
      const r = isUrl ? await lookupBusiness(code, q) : await suggestBusiness(code, q);
      if (id !== seq.current) return; // jawaban lama, abaikan
      setBusy(false);
      if (r?.error) { setResults([]); setError(r.error); return; }
      setResults(r.results || []);
      if (isUrl && r.results?.length === 1) setSelected(r.results[0]);
    }, isUrl ? 700 : 350);
    return () => clearTimeout(t);
  }, [query, code]);

  async function searchNow() {
    const id = ++seq.current;
    setError('');
    setBusy(true);
    const r = await lookupBusiness(code, query);
    if (id !== seq.current) return;
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
    <div>
      <label>{label}</label>
      <input type="hidden" name="place_id" value={selected?.placeId || ''} />
      <input type="hidden" name="business_name" value={selected?.name || ''} />

      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchNow(); } }}
        placeholder="Ketik nama bisnis atau tempel link Google Maps"
        autoComplete="off"
      />

      {busy && <p className="hint">Mencari...</p>}
      {error && <p className="err">{error}</p>}

      {results.length > 0 && (
        <ul className="results">
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

      {selected && (
        <p className="ok">
          Dipilih: <strong>{selected.name || 'Bisnis dari link'}</strong>{' '}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(selected.placeId)}`}
            target="_blank"
            rel="noreferrer"
          >
            Cek di Maps
          </a>
        </p>
      )}

      {!selected && (
        <button type="button" className="secondary" onClick={searchNow} disabled={busy || query.trim().length < 3}>
          Cari bisnis
        </button>
      )}
    </div>
  );
}
