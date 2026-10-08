'use client';
import { useId, useState } from 'react';
import BusinessPicker from './BusinessPicker';
import { TARGET_LABELS, TARGET_TYPES } from '@/lib/target-types';

const FIELDS = {
  instagram: { label: 'Username Instagram', prefix: 'instagram.com/', placeholder: 'namabisnis', mode: 'text' },
  tiktok: { label: 'Username TikTok', prefix: 'tiktok.com/@', placeholder: 'namabisnis', mode: 'text' },
  whatsapp: { label: 'Nomor WhatsApp', prefix: null, placeholder: '0812 3456 7890', mode: 'tel' },
  link: { label: 'Link menu atau halaman lain', prefix: null, placeholder: 'https://menu.bisniskamu.com', mode: 'url' },
};

// Pilih tujuan kartu: review Google, sosmed, WhatsApp, atau link (menu dll).
// `withName`: tampilkan isian nama bisnis untuk tujuan selain review (review mengambil nama dari Google).
export default function DestinationPicker({ code, initial = null, withName = false }) {
  const id = useId();
  const [type, setType] = useState(initial?.type || 'review');
  const [name, setName] = useState('');
  // Terkontrol, supaya isian tidak hilang saat server mengembalikan error. Disimpan per jenis.
  const [values, setValues] = useState(initial && initial.type !== 'review' ? { [initial.type]: initial.value } : {});
  const f = FIELDS[type];
  const initialPlace = initial?.type === 'review' && initial.value ? { placeId: initial.value, name: initial.name || '' } : null;

  return (
    <div>
      {/* Nilai yang dikirim ada di input tersembunyi: setelah action gagal, React 19 mereset radio
          ke pilihan awal (Review Google) walaupun tampilan masih menunjukkan pilihan lain. */}
      <input type="hidden" name="target_type" value={type} />
      <fieldset className="chips">
        <legend>Kartu dibuka ke mana?</legend>
        {TARGET_TYPES.map((t) => (
          <label key={t} className={`chip${t === type ? ' on' : ''}`}>
            <input type="radio" name={`${id}-type`} value={t} checked={t === type} onChange={() => setType(t)} />
            {TARGET_LABELS[t]}
          </label>
        ))}
      </fieldset>

      {type === 'review' ? (
        <BusinessPicker key="review" code={code} label="Bisnis kamu di Google" initial={initialPlace} />
      ) : (
        <div className="field" key={type}>
          <label htmlFor={`${id}-v`}>{f.label}</label>
          <div className={f.prefix ? 'prefixed' : undefined}>
            {f.prefix && <span aria-hidden="true">{f.prefix}</span>}
            <input
              id={`${id}-v`}
              name="target_value"
              type="text"
              inputMode={f.mode === 'tel' ? 'tel' : f.mode === 'url' ? 'url' : 'text'}
              value={values[type] || ''}
              onChange={(e) => setValues((v) => ({ ...v, [type]: e.target.value }))}
              placeholder={f.placeholder}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              required
            />
          </div>
          {type === 'whatsapp' && <p className="hint">Pelanggan langsung masuk ke chat WhatsApp bisnis kamu.</p>}
          {type === 'link' && <p className="hint">Misalnya menu digital, Linktree, Google Form, atau halaman promo.</p>}
        </div>
      )}

      {withName && type !== 'review' && (
        <div className="field">
          <label htmlFor={`${id}-n`}>Nama bisnis <span className="opt">(opsional)</span></label>
          <input
            id={`${id}-n`}
            name="business_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            placeholder="Contoh: Kopi Senja"
          />
        </div>
      )}
    </div>
  );
}
