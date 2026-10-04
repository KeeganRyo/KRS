'use client';
import { useState, useTransition } from 'react';
import { lookupBusiness } from '@/app/actions';

export default function BusinessPicker({ code, label }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  function search() {
    setError('');
    setSelected(null);
    start(async () => {
      const r = await lookupBusiness(code, query);
      if (r?.error) {
        setResults([]);
        setError(r.error);
        return;
      }
      setResults(r.results);
      if (r.results.length === 1) setSelected(r.results[0]);
    });
  }

  return (
    <div>
      <label>{label}</label>
      <input type="hidden" name="place_id" value={selected?.placeId || ''} />
      <input type="hidden" name="business_name" value={selected?.name || ''} />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); search(); } }}
        placeholder="Nama bisnis atau link Google Maps"
        autoComplete="off"
      />
      <button type="button" className="secondary" onClick={search} disabled={pending || query.trim().length < 3}>
        {pending ? 'Mencari...' : 'Cari bisnis'}
      </button>

      {error && <p className="err">{error}</p>}

      {results.length > 0 && (
        <ul className="results">
          {results.map((r) => (
            <li key={r.placeId}>
              <button
                type="button"
                className={'result' + (selected?.placeId === r.placeId ? ' sel' : '')}
                onClick={() => setSelected(r)}
              >
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
    </div>
  );
}
