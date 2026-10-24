'use client';
import { useId, useRef, useState } from 'react';
import { uploadMenuPhoto } from '@/app/actions';
import { MENU_SWATCH, MENU_THEMES, menuTheme } from '@/lib/menu-themes';

// Editor menu digital: info tempat, kategori, dan item (nama, harga, keterangan, label, foto).
// Semua isi dikirim sebagai JSON di input tersembunyi `m_data`; server membersihkannya (lib/menu.js).
// Foto hanya bisa diunggah setelah kartu aktif (perlu sesi PIN), jadi saat aktivasi pertama disembunyikan.
const newId = () => Math.random().toString(36).slice(2, 10);
const blankItem = () => ({ id: newId(), name: '', price: '', desc: '', tag: '', photo: null, photoUrl: null });
const blankCat = (name = '') => ({ id: newId(), name, items: [blankItem()] });

// Potong tengah jadi persegi 480 px, JPEG di bawah ~380 KB.
async function squareJpeg(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 480;
    canvas.getContext('2d').drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, 480, 480);
    for (const q of [0.85, 0.75, 0.6, 0.45]) {
      const data = canvas.toDataURL('image/jpeg', q);
      if (data.length * 0.75 < 380 * 1024) return data;
    }
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

const move = (list, i, d) => {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const out = [...list];
  [out[i], out[j]] = [out[j], out[i]];
  return out;
};

function ItemRow({ code, item, canUpload, onChange, onMove, onRemove, first, last }) {
  const id = useId();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k) => (e) => onChange({ ...item, [k]: e.target.value });

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErr('');
    setBusy(true);
    try {
      const data = await squareJpeg(file);
      if (!data) throw new Error('Foto terlalu besar. Coba foto lain.');
      const r = await uploadMenuPhoto(code, data);
      if (r.error) throw new Error(r.error);
      onChange({ ...item, photo: r.path, photoUrl: r.url });
    } catch (x) {
      setErr(x.message || 'Foto tidak bisa dipakai.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mi">
      {canUpload && (
        <div className="mi-photo">
          <button type="button" className="mi-thumb" onClick={() => fileRef.current?.click()} aria-label={`Foto untuk ${item.name || 'item ini'}`} disabled={busy}>
            {item.photoUrl ? <img src={item.photoUrl} alt="" /> : <span>{busy ? '…' : '+ Foto'}</span>}
          </button>
          {item.photoUrl && !busy && (
            <button type="button" className="link-btn mi-del-photo" onClick={() => onChange({ ...item, photo: null, photoUrl: null })}>Hapus foto</button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={pick} tabIndex={-1} />
        </div>
      )}
      <div className="mi-fields">
        <div className="mi-top">
          <label htmlFor={`${id}-n`} className="sr-only">Nama menu</label>
          <input id={`${id}-n`} value={item.name} onChange={set('name')} placeholder="Nama menu, misal Es Kopi Susu" maxLength={60} />
          <label htmlFor={`${id}-p`} className="sr-only">Harga</label>
          <input id={`${id}-p`} className="mi-price" value={item.price} onChange={set('price')} placeholder="28K" maxLength={20} />
        </div>
        <label htmlFor={`${id}-d`} className="sr-only">Keterangan</label>
        <input id={`${id}-d`} value={item.desc} onChange={set('desc')} placeholder="Keterangan (opsional)" maxLength={120} />
        <div className="mi-bottom">
          <label htmlFor={`${id}-t`} className="sr-only">Label</label>
          <input id={`${id}-t`} className="mi-tag" value={item.tag} onChange={set('tag')} placeholder="Label: Favorit / Baru" maxLength={16} list="menu-tags" />
          <div className="mi-actions">
            <button type="button" className="mini" onClick={() => onMove(-1)} disabled={first} aria-label="Naikkan item">↑</button>
            <button type="button" className="mini" onClick={() => onMove(1)} disabled={last} aria-label="Turunkan item">↓</button>
            <button type="button" className="mini danger" onClick={onRemove} aria-label={`Hapus ${item.name || 'item'}`}>Hapus</button>
          </div>
        </div>
        {err && <p className="err" role="alert">{err}</p>}
      </div>
    </div>
  );
}

export default function MenuFields({ code, initial, canUpload = false }) {
  const id = useId();
  const [info, setInfo] = useState({ name: initial?.name || '', hours: initial?.hours || '', wifi: initial?.wifi || '', wifiPass: initial?.wifiPass || '', note: initial?.note || '' });
  const [cats, setCats] = useState(() =>
    initial?.categories?.length
      ? initial.categories.map((c) => ({ ...c, items: c.items.map((it) => ({ ...blankItem(), ...it })) }))
      : [blankCat('Minuman'), blankCat('Makanan')],
  );
  const [theme, setTheme] = useState(() => menuTheme(initial?.theme));
  const setInfoKey = (k) => (e) => setInfo((s) => ({ ...s, [k]: e.target.value }));
  const updCat = (ci, fn) => setCats((cs) => cs.map((c, i) => (i === ci ? fn(c) : c)));
  const data = JSON.stringify({
    ...info,
    theme,
    categories: cats.map((c) => ({ id: c.id, name: c.name, items: c.items.map(({ photoUrl, ...it }) => it) })),
  });

  return (
    <div className="menu-fields">
      <input type="hidden" name="m_data" value={data} />
      <datalist id="menu-tags"><option value="Favorit" /><option value="Baru" /><option value="Pedas" /><option value="Best seller" /></datalist>

      <div className="field">
        <label htmlFor={`${id}-name`}>Nama tempat</label>
        <input id={`${id}-name`} value={info.name} onChange={setInfoKey('name')} placeholder="Contoh: Kopi Senja" maxLength={60} required />
      </div>
      <div className="field">
        <label htmlFor={`${id}-hours`}>Jam buka <span className="opt">(opsional)</span></label>
        <input id={`${id}-hours`} value={info.hours} onChange={setInfoKey('hours')} placeholder="Buka setiap hari 08.00–22.00" maxLength={60} />
      </div>
      <div className="field">
        <label htmlFor={`${id}-wifi`}>Nama Wi-Fi <span className="opt">(opsional)</span></label>
        <input id={`${id}-wifi`} value={info.wifi} onChange={setInfoKey('wifi')} placeholder="KopiSenja_Guest" maxLength={40} />
      </div>
      <div className="field">
        <label htmlFor={`${id}-wifipass`}>Password Wi-Fi <span className="opt">(opsional)</span></label>
        <input id={`${id}-wifipass`} value={info.wifiPass} onChange={setInfoKey('wifiPass')} maxLength={63}
          autoComplete="off" autoCapitalize="off" spellCheck={false} disabled={!info.wifi} placeholder={info.wifi ? '' : 'Isi nama Wi-Fi dulu'} />
        <p className="hint">Kalau diisi, password tampil di menu dengan tombol salin. Pakai Wi-Fi khusus tamu, jangan Wi-Fi kantor.</p>
      </div>

      <fieldset className="chips">
        <legend>Tema halaman menu</legend>
        {Object.entries(MENU_THEMES).map(([t, label]) => (
          <label key={t} className={`chip${t === theme ? ' on' : ''}`}>
            <input type="radio" name={`${id}-theme`} value={t} checked={t === theme} onChange={() => setTheme(t)} />
            <span className="swatch" aria-hidden="true" style={{ background: MENU_SWATCH[t][0], boxShadow: `inset 0 0 0 1px rgba(0,0,0,.18), inset 0 -6px 0 ${MENU_SWATCH[t][1]}` }} />
            {label}
          </label>
        ))}
      </fieldset>
      <p className="hint">Lihat semua tema di <a href="/contoh-menu" target="_blank" rel="noreferrer">krsolutions.tech/contoh-menu</a>.</p>

      {!canUpload && <p className="hint">Foto menu bisa ditambahkan setelah kartu aktif, dari halaman edit kartu.</p>}

      {cats.map((c, ci) => (
        <fieldset key={c.id} className="mc">
          <legend className="sr-only">Kategori {ci + 1}</legend>
          <div className="mc-head">
            <label htmlFor={`${id}-c${c.id}`} className="sr-only">Nama kategori</label>
            <input id={`${id}-c${c.id}`} className="mc-name" value={c.name} onChange={(e) => updCat(ci, (x) => ({ ...x, name: e.target.value }))} placeholder="Nama kategori, misal Kopi" maxLength={30} />
            <button type="button" className="mini" onClick={() => setCats((cs) => move(cs, ci, -1))} disabled={ci === 0} aria-label="Naikkan kategori">↑</button>
            <button type="button" className="mini" onClick={() => setCats((cs) => move(cs, ci, 1))} disabled={ci === cats.length - 1} aria-label="Turunkan kategori">↓</button>
            <button type="button" className="mini danger" onClick={() => window.confirm(`Hapus kategori "${c.name || 'ini'}" beserta semua itemnya?`) && setCats((cs) => cs.filter((_, i) => i !== ci))}>Hapus</button>
          </div>
          {c.items.map((it, ii) => (
            <ItemRow
              key={it.id}
              code={code}
              item={it}
              canUpload={canUpload}
              first={ii === 0}
              last={ii === c.items.length - 1}
              onChange={(v) => updCat(ci, (x) => ({ ...x, items: x.items.map((y, j) => (j === ii ? v : y)) }))}
              onMove={(d) => updCat(ci, (x) => ({ ...x, items: move(x.items, ii, d) }))}
              onRemove={() => updCat(ci, (x) => ({ ...x, items: x.items.filter((_, j) => j !== ii) }))}
            />
          ))}
          <button type="button" className="secondary mc-add" onClick={() => updCat(ci, (x) => ({ ...x, items: [...x.items, blankItem()] }))}>+ Tambah item</button>
        </fieldset>
      ))}
      <button type="button" className="secondary" onClick={() => setCats((cs) => [...cs, blankCat()])}>+ Tambah kategori</button>

      <div className="field">
        <label htmlFor={`${id}-note`}>Catatan di bawah menu <span className="opt">(opsional)</span></label>
        <input id={`${id}-note`} value={info.note} onChange={setInfoKey('note')} placeholder="Harga sudah termasuk pajak." maxLength={160} />
      </div>
    </div>
  );
}
