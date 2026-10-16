'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => (i.naturalWidth && i.naturalHeight ? resolve(i) : reject(new Error('kosong')));
    i.onerror = reject;
    i.src = src;
  });
}

// Simpan potongan persegi (koordinat piksel asli) sebagai JPEG maks 512 px. Server hanya menerima
// JPEG kecil, jadi foto besar dari kamera HP cukup dikirim sekitar 50–150 KB.
function cropJpeg(img, sx, sy, side) {
  const size = Math.round(Math.min(512, side));
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
  for (const q of [0.85, 0.7, 0.55]) {
    const data = canvas.toDataURL('image/jpeg', q);
    if (data.length < 500000) return data;
  }
  throw new Error('terlalu besar');
}

const CROP_VIEW = 280;
const MAX_ZOOM = 4;

// Layar potong foto: geser dengan jari/mouse, perbesar dengan slider, scroll, atau dua jari.
function PhotoCropper({ img, onCancel, onDone }) {
  const view = CROP_VIEW;
  const base = view / Math.min(img.naturalWidth, img.naturalHeight);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef(null);
  const pointers = useRef(new Map());
  const scale = base * zoom;

  // Gambar harus selalu menutupi seluruh kotak.
  const clamp = (p, z) => {
    const s = base * z;
    const mx = Math.max(0, (img.naturalWidth * s - view) / 2);
    const my = Math.max(0, (img.naturalHeight * s - view) / 2);
    return { x: Math.min(mx, Math.max(-mx, p.x)), y: Math.min(my, Math.max(-my, p.y)) };
  };
  const zoomTo = (z, from = { zoom, pos }) => {
    const nz = Math.min(MAX_ZOOM, Math.max(1, z));
    setZoom(nz);
    setPos(clamp({ x: (from.pos.x * nz) / from.zoom, y: (from.pos.y * nz) / from.zoom }, nz));
  };

  // Sekali saat dibuka: kunci scroll halaman dan tutup dengan Escape.
  const cancelRef = useRef(onCancel);
  cancelRef.current = onCancel;
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') cancelRef.current(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, []);

  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    drag.current = { x: e.clientX, y: e.clientY, pos, zoom, dist: null };
  };
  const move = (e) => {
    if (!drag.current || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length >= 2) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (!drag.current.dist) drag.current.dist = dist;
      else zoomTo((drag.current.zoom * dist) / drag.current.dist, drag.current);
      return;
    }
    const d = drag.current;
    setPos(clamp({ x: d.pos.x + e.clientX - d.x, y: d.pos.y + e.clientY - d.y }, zoom));
  };
  const up = (e) => {
    pointers.current.delete(e.pointerId);
    const left = [...pointers.current.values()][0];
    drag.current = left ? { x: left.x, y: left.y, pos, zoom, dist: null } : null;
  };

  const done = () => {
    const side = view / scale;
    const sx = img.naturalWidth / 2 - (view / 2 + pos.x) / scale;
    const sy = img.naturalHeight / 2 - (view / 2 + pos.y) / scale;
    onDone(img, sx, sy, side);
  };

  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  // Portal ke <body>: kartu induk punya animasi transform yang membuat position:fixed ikut kartu.
  return createPortal(
    <div className="crop-overlay" role="dialog" aria-modal="true" aria-label="Atur foto profil">
      <div className="crop-box">
        <p className="crop-title">Atur foto</p>
        <p className="crop-hint">Geser untuk mengatur posisi, perbesar dengan slider.</p>
        <div
          className="crop-view"
          style={{ width: view, height: view }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onWheel={(e) => zoomTo(zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08))}
        >
          <img
            src={img.src}
            alt=""
            draggable={false}
            style={{ width: w, height: h, left: (view - w) / 2 + pos.x, top: (view - h) / 2 + pos.y }}
          />
          <div className="crop-mask" aria-hidden="true" />
        </div>
        <label className="crop-zoom">
          <span className="sr-only">Perbesar</span>
          <span aria-hidden="true">−</span>
          <input type="range" min={1} max={MAX_ZOOM} step={0.01} value={zoom} onChange={(e) => zoomTo(Number(e.target.value))} />
          <span aria-hidden="true">+</span>
        </label>
        <div className="crop-actions">
          <button type="button" className="secondary" onClick={onCancel}>Batal</button>
          <button type="button" onClick={done}>Pakai foto</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function PhotoField({ initialUrl }) {
  const id = useId();
  const [data, setData] = useState('');
  const [removed, setRemoved] = useState(false);
  const [err, setErr] = useState('');
  const [source, setSource] = useState(null); // foto asli terakhir dipilih, supaya bisa diatur ulang
  const [cropping, setCropping] = useState(false);
  const preview = data || (removed ? null : initialUrl);

  useEffect(() => () => { if (source) URL.revokeObjectURL(source.src); }, [source]);

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErr('');
    try {
      setSource(await loadImage(URL.createObjectURL(file)));
      setCropping(true);
    } catch {
      setErr('Foto ini tidak bisa dibuka. Coba foto lain (JPG atau PNG).');
    }
  }

  function finish(img, sx, sy, side) {
    setCropping(false);
    try {
      setData(cropJpeg(img, sx, sy, side));
      setRemoved(false);
    } catch {
      setErr('Foto terlalu besar. Coba foto lain.');
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
          <div className="photo-links">
            {data && source && (
              <button type="button" className="link-btn" onClick={() => setCropping(true)}>Atur posisi</button>
            )}
            {preview && (
              <button type="button" className="link-btn" onClick={() => { setData(''); setRemoved(true); }}>
                Hapus foto
              </button>
            )}
          </div>
        </div>
      </div>
      <input type="hidden" name="p_photo_data" value={data} />
      <input type="hidden" name="p_photo_remove" value={removed ? '1' : ''} />
      {err && <p className="err" role="alert">{err}</p>}
      {cropping && source && <PhotoCropper img={source} onCancel={() => setCropping(false)} onDone={finish} />}
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
