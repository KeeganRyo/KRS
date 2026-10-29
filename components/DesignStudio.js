'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addCards, addManualCodes } from '@/app/admin/actions';
import { HEADINGS, accentFromPixels, boardSvg, isHex, qrPath, sceneSvg } from '@/lib/board';

// Font Poppins disisipkan ke SVG yang diunduh/diubah jadi PNG (SVG sebagai gambar tidak bisa
// memakai font halaman). Diambil sekali dari /public/fonts.
let fontCssPromise;
function fontCss() {
  if (!fontCssPromise) {
    const b64 = async (w) => {
      const buf = await (await fetch(`/fonts/poppins-${w}.woff2`)).arrayBuffer();
      let s = '';
      new Uint8Array(buf).forEach((c) => { s += String.fromCharCode(c); });
      return `@font-face{font-family:Poppins;font-weight:${w};src:url(data:font/woff2;base64,${btoa(s)}) format('woff2')}`;
    };
    fontCssPromise = Promise.all([400, 500, 600].map(b64)).then((x) => x.join(''));
  }
  return fontCssPromise;
}

// File gambar -> data URL persegi (logo) atau diperkecil (foto tempat).
function readImage(file, { square, max }) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      const x = c.getContext('2d');
      if (square) {
        const s = Math.min(img.width, img.height);
        c.width = c.height = Math.min(max, s);
        x.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, c.width, c.height);
      } else {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        x.drawImage(img, 0, 0, c.width, c.height);
      }
      const small = document.createElement('canvas');
      small.width = small.height = 64;
      small.getContext('2d').drawImage(c, 0, 0, 64, 64);
      URL.revokeObjectURL(url);
      resolve({
        data: square ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.85),
        accent: accentFromPixels(small.getContext('2d').getImageData(0, 0, 64, 64).data),
      });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Gambar tidak bisa dibaca.')); };
    img.src = url;
  });
}

async function svgToPngBlob(svg, w, h) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    return await new Promise((r) => c.toBlob(r, 'image/png'));
  } finally {
    URL.revokeObjectURL(url);
  }
}

function download(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

const slug = (s) => String(s || 'desain').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'desain';
const KIND_OF = { review: 'board', ig: 'board', wa: 'board', custom: 'board', menu: 'menu', info: 'wifi' };

export default function DesignStudio({ baseUrl, initialName = '', instagram = '' }) {
  const [name, setName] = useState(initialName);
  const [word, setWord] = useState('');
  const [logo, setLogo] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [acc, setAcc] = useState('#B8916A');
  const [autoAcc, setAutoAcc] = useState(true);
  const [type, setType] = useState('review');
  const [l1, setL1] = useState('');
  const [l2, setL2] = useState('');
  const [count, setCount] = useState(1);
  const [codeMode, setCodeMode] = useState('new'); // new | manual
  const [manual, setManual] = useState('');
  const [codes, setCodes] = useState([]);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState(null);
  const logoInput = useRef(null);

  const pickType = (t) => {
    setType(t);
    if (t !== 'review') { setL1(HEADINGS[t].l1); setL2(HEADINGS[t].l2); }
  };

  const onLogo = async (file) => {
    if (!file) return;
    try {
      const r = await readImage(file, { square: true, max: 640 });
      setLogo(r.data);
      if (autoAcc) setAcc(r.accent);
    } catch (e) { setMsg({ error: e.message }); }
  };
  const onPhoto = async (file) => {
    if (!file) return;
    try { setPhoto((await readImage(file, { square: false, max: 1200 })).data); } catch (e) { setMsg({ error: e.message }); }
  };

  // Tempel logo langsung dari clipboard (misalnya setelah copy foto profil IG).
  useEffect(() => {
    const onPaste = (e) => {
      const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'));
      if (item) { e.preventDefault(); onLogo(item.getAsFile()); }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  });

  const design = { name, acc: isHex(acc) ? acc : '#B8916A', logo, word: word || name, type, l1, l2 };
  const sampleQr = useMemo(() => qrPath(baseUrl), [baseUrl]);
  const qrs = useMemo(() => codes.map((c) => ({ code: c, qr: qrPath(`${baseUrl}/c/${c}`) })), [codes, baseUrl]);
  const scene = sceneSvg({ ...design, photo, qr: qrs[0]?.qr || sampleQr });

  const mockupPng = async () => svgToPngBlob(sceneSvg({ ...design, photo, qr: qrs[0]?.qr || sampleQr }, await fontCss()), 1080, 1350);

  const run = async (label, fn) => {
    setBusy(label);
    setMsg(null);
    try { await fn(); } catch (e) { setMsg({ error: e.message || 'Gagal.' }); }
    setBusy('');
  };

  const makeCodes = () => run('codes', async () => {
    const fd = new FormData();
    fd.set('kind', KIND_OF[type]);
    if (codeMode === 'new') {
      fd.set('count', String(count));
      const r = await addCards(null, fd);
      if (r?.error) throw new Error(r.error);
      setCodes(r.codes);
      setMsg({ message: `${r.codes.length} kode baru sudah terdaftar: ${r.codes.join(', ')}` });
    } else {
      fd.set('codes', manual);
      const r = await addManualCodes(null, fd);
      if (r?.error) throw new Error(r.error);
      const all = [...(r.added || []), ...(r.exists || [])];
      setCodes(all);
      setMsg({ message: `Terdaftar baru: ${r.added.length ? r.added.join(', ') : '-'}. Sudah ada sebelumnya: ${r.exists.length ? r.exists.join(', ') : '-'}.` });
    }
  });

  const ready = name.trim().length > 0;

  return (
    <div className="studio">
      <style>{`@font-face{font-family:Poppins;font-weight:400;src:url(/fonts/poppins-400.woff2) format('woff2')}
@font-face{font-family:Poppins;font-weight:500;src:url(/fonts/poppins-500.woff2) format('woff2')}
@font-face{font-family:Poppins;font-weight:600;src:url(/fonts/poppins-600.woff2) format('woff2')}
@media print{@page{size:106mm 106mm;margin:0}}`}</style>

      <div className="studio-screen">
        <section className="studio-form card">
          <h2>1. Isi desain</h2>
          <div className="field">
            <label htmlFor="d-name">Nama bisnis</label>
            <input id="d-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Kopi Senja" maxLength={60} />
          </div>

          <div className="field">
            <span className="label">Logo</span>
            <div className="studio-logo">
              <button type="button" className="secondary" onClick={() => logoInput.current?.click()}>{logo ? 'Ganti logo' : 'Pilih logo'}</button>
              {logo && <button type="button" className="link-btn" onClick={() => setLogo(null)}>Hapus</button>}
              <input ref={logoInput} type="file" accept="image/*" hidden onChange={(e) => onLogo(e.target.files?.[0])} />
            </div>
            <p className="hint">
              Atau copy gambar logo lalu tekan Ctrl+V di halaman ini.
              {instagram && <> Logo biasanya ada di foto profil <a href={`https://www.instagram.com/${instagram.replace(/^@/, '')}/`} target="_blank" rel="noreferrer">{instagram}</a>.</>}
            </p>
          </div>
          {!logo && (
            <div className="field">
              <label htmlFor="d-word">Tulisan di lingkaran <span className="opt">(kalau tidak ada logo)</span></label>
              <input id="d-word" value={word} onChange={(e) => setWord(e.target.value)} placeholder={name || 'Nama bisnis'} maxLength={30} />
            </div>
          )}

          <div className="field">
            <label htmlFor="d-acc">Warna aksen</label>
            <div className="studio-color">
              <input id="d-acc" type="color" value={isHex(acc) ? acc : '#B8916A'} onChange={(e) => { setAcc(e.target.value); setAutoAcc(false); }} />
              <input value={acc} onChange={(e) => { setAcc(e.target.value); setAutoAcc(false); }} maxLength={7} aria-label="Kode warna" />
            </div>
            <p className="hint">{autoAcc ? 'Diambil otomatis dari logo.' : <>Diatur manual. <button type="button" className="link-btn" onClick={() => setAutoAcc(true)}>Ikut logo lagi</button></>}</p>
          </div>

          <div className="field">
            <span className="label">Jenis papan</span>
            <div className="chips">
              {Object.entries(HEADINGS).map(([k, h]) => (
                <button type="button" key={k} className={`chip${type === k ? ' on' : ''}`} aria-pressed={type === k} onClick={() => pickType(k)}>{h.label}</button>
              ))}
            </div>
          </div>
          {type !== 'review' && (
            <div className="studio-lines">
              <div className="field"><label htmlFor="d-l1">Baris 1</label><input id="d-l1" value={l1} onChange={(e) => setL1(e.target.value)} maxLength={22} /></div>
              <div className="field"><label htmlFor="d-l2">Baris 2 <span className="opt">(warna)</span></label><input id="d-l2" value={l2} onChange={(e) => setL2(e.target.value)} maxLength={22} /></div>
            </div>
          )}

          <div className="field">
            <span className="label">Foto tempat <span className="opt">(latar mockup, opsional)</span></span>
            <div className="studio-logo">
              <label className="btn btn-soft studio-file">{photo ? 'Ganti foto' : 'Pilih foto'}<input type="file" accept="image/*" hidden onChange={(e) => onPhoto(e.target.files?.[0])} /></label>
              {photo && <button type="button" className="link-btn" onClick={() => setPhoto(null)}>Hapus</button>}
            </div>
            <p className="hint">Foto dari Google Maps tempatnya bikin mockup terasa "di tempat mereka".</p>
          </div>
        </section>

        <section className="studio-preview">
          <h2>2. Mockup buat prospek</h2>
          <div className="studio-scene" dangerouslySetInnerHTML={{ __html: scene }} />
          <div className="studio-actions">
            <button type="button" disabled={!ready || busy === 'png'} onClick={() => run('png', async () => download(await mockupPng(), `Mockup-${slug(name)}.png`))}>Unduh mockup (PNG)</button>
            <button type="button" className="secondary" disabled={!ready || busy === 'copy'} onClick={() => run('copy', async () => {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': mockupPng() })]);
              setMsg({ message: 'Mockup tersalin. Tempel di chat WA.' });
            })}>Salin mockup</button>
          </div>

          <h2>3. File cetak (pesanan)</h2>
          <div className="studio-codes card">
            <div className="chips">
              <button type="button" className={`chip${codeMode === 'new' ? ' on' : ''}`} aria-pressed={codeMode === 'new'} onClick={() => setCodeMode('new')}>Kode baru otomatis</button>
              <button type="button" className={`chip${codeMode === 'manual' ? ' on' : ''}`} aria-pressed={codeMode === 'manual'} onClick={() => setCodeMode('manual')}>Kode sendiri</button>
            </div>
            {codeMode === 'new' ? (
              <div className="field">
                <label htmlFor="d-count">Jumlah papan</label>
                <input id="d-count" type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value, 10) || 1)))} />
              </div>
            ) : (
              <div className="field">
                <label htmlFor="d-codes">Kode <span className="opt">(pisahkan dengan spasi/koma)</span></label>
                <textarea id="d-codes" rows={2} value={manual} onChange={(e) => setManual(e.target.value)} placeholder="ABC123, XYZ789" />
              </div>
            )}
            <p className="hint">Kode langsung didaftarkan di database sebagai {KIND_OF[type] === 'menu' ? 'papan menu' : KIND_OF[type] === 'wifi' ? 'papan info tamu' : 'papan'}, jadi tidak perlu daftar manual lagi.</p>
            <button type="button" disabled={!ready || busy === 'codes'} onClick={makeCodes}>{busy === 'codes' ? 'Mendaftarkan...' : 'Daftarkan kode & buat file'}</button>
          </div>

          {msg && <p className={msg.error ? 'err' : 'ok'} role={msg.error ? 'alert' : 'status'}>{msg.error || msg.message}</p>}

          {qrs.length > 0 && (
            <>
              <div className="studio-boards">
                {qrs.map(({ code, qr }) => (
                  <figure key={code}>
                    <div dangerouslySetInnerHTML={{ __html: boardSvg({ ...design, qr }) }} />
                    <figcaption>
                      <strong>{code}</strong> · {baseUrl.replace(/^https?:\/\//, '')}/c/{code}
                      <button type="button" className="link-btn" onClick={() => run('svg', async () => download(new Blob([boardSvg({ ...design, qr }, await fontCss())], { type: 'image/svg+xml' }), `${slug(name)}-${code}.svg`))}>Unduh SVG</button>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <button type="button" onClick={() => window.print()}>Cetak / simpan PDF</button>
              <p className="hint">Di jendela cetak pilih &quot;Save as PDF&quot;. Ukuran halaman 10,6 × 10,6 cm (10 cm + bleed 3 mm), satu papan per halaman. Jangan lupa isi chip NFC tiap papan dengan link yang sama dengan QR-nya.</p>
            </>
          )}
        </section>
      </div>

      <div className="studio-print" aria-hidden="true">
        {qrs.map(({ code, qr }) => (
          <div key={code} className="studio-page" dangerouslySetInnerHTML={{ __html: boardSvg({ ...design, qr }) }} />
        ))}
      </div>
    </div>
  );
}
