'use client';
import { useId, useState } from 'react';

// Isian kartu nama. Terkontrol (useState) supaya tidak hilang saat server mengembalikan error.
const FIELDS = [
  { k: 'name', label: 'Nama lengkap', placeholder: 'Contoh: Riska Bella', max: 60, required: true },
  { k: 'title', label: 'Jabatan', placeholder: 'Contoh: Marketing Manager', max: 60 },
  { k: 'company', label: 'Perusahaan / bisnis', placeholder: 'Contoh: Kopi Senja', max: 80 },
  { k: 'bio', label: 'Bio singkat', placeholder: 'Satu-dua kalimat tentang kamu atau bisnismu', max: 200, area: true },
  { k: 'whatsapp', label: 'Nomor WhatsApp', placeholder: '0812 3456 7890', mode: 'tel', max: 30 },
  { k: 'email', label: 'Email', placeholder: 'nama@email.com', mode: 'email', max: 120 },
  { k: 'instagram', label: 'Instagram', prefix: 'instagram.com/', placeholder: 'username', max: 120 },
  { k: 'tiktok', label: 'TikTok', prefix: 'tiktok.com/@', placeholder: 'username', max: 120 },
  { k: 'linkedin', label: 'LinkedIn', prefix: 'linkedin.com/in/', placeholder: 'username', max: 200 },
  { k: 'website', label: 'Website', placeholder: 'https://bisniskamu.com', mode: 'url', max: 500 },
];

export default function ProfileFields({ initial }) {
  const id = useId();
  const [v, setV] = useState(() => {
    const p = initial || {};
    return { ...p, whatsapp: p.whatsapp ? `+${p.whatsapp}` : '' };
  });
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  return (
    <div className="profile-fields">
      <p className="hint">Isi yang perlu saja. Yang kosong tidak tampil di kartu.</p>
      {FIELDS.map((f) => {
        const props = {
          id: `${id}-${f.k}`,
          name: `p_${f.k}`,
          value: v[f.k] || '',
          onChange: set(f.k),
          placeholder: f.placeholder,
          maxLength: f.max,
          required: f.required,
        };
        const input = f.area ? (
          <textarea {...props} rows={3} />
        ) : (
          <input
            {...props}
            type={f.mode === 'email' ? 'email' : 'text'}
            inputMode={f.mode === 'tel' ? 'tel' : f.mode === 'url' ? 'url' : f.mode === 'email' ? 'email' : 'text'}
            autoComplete="off"
            autoCapitalize={f.prefix || f.mode ? 'off' : 'words'}
            spellCheck={!f.prefix && !f.mode}
          />
        );
        return (
          <div className="field" key={f.k}>
            <label htmlFor={props.id}>
              {f.label} {!f.required && <span className="opt">(opsional)</span>}
            </label>
            {f.prefix ? (
              <div className="prefixed">
                <span aria-hidden="true">{f.prefix}</span>
                {input}
              </div>
            ) : input}
          </div>
        );
      })}
    </div>
  );
}
