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

// Potong tengah jadi persegi 512 px dan simpan sebagai JPEG. Server hanya menerima JPEG kecil,
// jadi foto besar dari kamera HP cukup dikirim sekitar 50–150 KB.
async function squareJpeg(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    if (!side) throw new Error('kosong');
    const size = Math.min(512, side);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
    for (const q of [0.85, 0.7, 0.55]) {
      const data = canvas.toDataURL('image/jpeg', q);
      if (data.length < 500000) return data;
    }
    throw new Error('terlalu besar');
  } finally {
    URL.revokeObjectURL(url);
  }
}

function PhotoField({ initialUrl }) {
  const id = useId();
  const [data, setData] = useState('');
  const [removed, setRemoved] = useState(false);
  const [err, setErr] = useState('');
  const preview = data || (removed ? null : initialUrl);

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErr('');
    try {
      setData(await squareJpeg(file));
      setRemoved(false);
    } catch {
      setErr('Foto ini tidak bisa dibuka. Coba foto lain (JPG atau PNG).');
    }
  }

  return (
    <div className="field photo-field">
      <span className="label">Foto profil <span className="opt">(opsional)</span></span>
      <div className="photo-row">
        <div className="photo-preview" aria-hidden="true">
          {preview ? <img src={preview} alt="" /> : <span>Foto</span>}
        </div>
        <div className="photo-actions">
          <label htmlFor={id} className="photo-pick">{preview ? 'Ganti foto' : 'Pilih foto'}</label>
          <input id={id} type="file" accept="image/*" onChange={pick} className="sr-only" />
          {preview && (
            <button type="button" className="link-btn" onClick={() => { setData(''); setRemoved(true); }}>
              Hapus foto
            </button>
          )}
        </div>
      </div>
      <input type="hidden" name="p_photo_data" value={data} />
      <input type="hidden" name="p_photo_remove" value={removed ? '1' : ''} />
      {err && <p className="err" role="alert">{err}</p>}
    </div>
  );
}

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
      {/* key: setelah tersimpan (foto berubah), isian foto dikosongkan supaya tidak diunggah ulang. */}
      <PhotoField key={initial?.photoUrl || 'none'} initialUrl={initial?.photoUrl} />
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
