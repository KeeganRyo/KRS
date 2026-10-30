'use client';

import { useEffect, useMemo, useState } from 'react';
import { HOLIDAYS, THEMES, artOf, holidayDate, slugOf } from '@/lib/holidays';
import { ART_LABELS } from '@/lib/poster-art';
import { posterSvg, POSTER_W, POSTER_H } from '@/lib/poster';
import { download, fontCss, serifCss, svgToPngBlob } from '@/lib/svg-export';

// Font untuk pratinjau di halaman (SVG inline memakai font halaman).
const FACES = `@font-face{font-family:Poppins;font-weight:400;src:url(/fonts/poppins-400.woff2) format('woff2')}
@font-face{font-family:Poppins;font-weight:600;src:url(/fonts/poppins-600.woff2) format('woff2')}
@font-face{font-family:'Instrument Serif';src:url(/fonts/instrument-serif-400.woff2) format('woff2')}`;

const fromHoliday = (h) => {
  const [acc, acc2] = THEMES[h.theme] || THEMES.merahputih;
  return { tag: h.tag, title: h.title, date: holidayDate(h), msg: h.msg, acc, acc2, caption: h.caption, file: slugOf(h), art: artOf(h) };
};
const SHORT = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const daysUntil = (date, today) => Math.round((Date.parse(date) - Date.parse(today)) / 86400000);

export default function PosterStudio({ today }) {
  // Hari ini dan seterusnya (libur beberapa hari tetap tampil sampai hari terakhirnya).
  const upcoming = useMemo(() => HOLIDAYS.filter((h) => (h.end || h.date) >= today), [today]);
  const [pick, setPick] = useState(upcoming[0]?.date || '');
  const [p, setP] = useState(() => (upcoming[0] ? fromHoliday(upcoming[0]) : null));
  const [measure, setMeasure] = useState(null);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState(null);

  // Ukur lebar judul pakai font asli supaya judul panjang mengecil dan tidak terpotong.
  useEffect(() => {
    let off = false;
    const serif = new FontFace('KRPosterSerif', 'url(/fonts/instrument-serif-400.woff2)');
    const sans = new FontFace('KRPosterSans', 'url(/fonts/poppins-600.woff2)', { weight: '600' });
    Promise.all([serif.load(), sans.load()]).then(([a, b]) => {
      if (off) return;
      document.fonts.add(a);
      document.fonts.add(b);
      const ctx = document.createElement('canvas').getContext('2d');
      setMeasure(() => (text, size, family) => {
        ctx.font = family === 'serif' ? `${size}px KRPosterSerif` : `600 ${size}px KRPosterSans`;
        return ctx.measureText(text).width;
      });
    }).catch(() => {});
    return () => { off = true; };
  }, []);

  const svg = useMemo(() => (p ? posterSvg(p, '', measure || undefined) : ''), [p, measure]);
  if (!p) return <div className="card"><p>Belum ada hari besar berikutnya di daftar. Tambahkan tanggalnya di lib/holidays.js.</p></div>;

  const set = (k) => (e) => setP({ ...p, [k]: e.target.value });
  const choose = (h) => { setPick(h.date); setP(fromHoliday(h)); setMsg(null); };
  const png = async () => {
    const css = (await fontCss()) + (await serifCss());
    return svgToPngBlob(posterSvg(p, css, measure || undefined), POSTER_W, POSTER_H);
  };
  const run = async (key, fn) => {
    setBusy(key);
    setMsg(null);
    try { await fn(); } catch { setMsg({ error: 'Gagal. Coba lagi, atau pakai tombol Unduh.' }); }
    setBusy('');
  };

  return (
    <div className="inv-screen poster-screen">
      <div className="card inv-form">
        <h2>Hari besar berikutnya</h2>
        <ul className="poster-days">
          {upcoming.map((h) => {
            const n = daysUntil(h.date, today);
            return (
              <li key={h.date}>
                <button type="button" className={pick === h.date ? 'on' : undefined} aria-pressed={pick === h.date} onClick={() => choose(h)}>
                  <strong>{h.tag}</strong>
                  <span>{SHORT.format(new Date(h.date))} · {n <= 0 ? 'hari ini' : n === 1 ? 'besok' : `${n} hari lagi`}{h.merah ? '' : ' · hari nasional'}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="hint">Tanggal libur 2027 dari SKB 3 Menteri. Idul Fitri dan Idul Adha bisa bergeser kalau hasil sidang isbat beda.</p>

        <h2 className="poster-h">Isi poster</h2>
        <label className="field"><span className="label">Label kecil</span><input value={p.tag} onChange={set('tag')} maxLength={40} /></label>
        <label className="field"><span className="label">Judul</span><input value={p.title} onChange={set('title')} maxLength={60} /></label>
        <label className="field"><span className="label">Tanggal</span><input value={p.date} onChange={set('date')} maxLength={40} /></label>
        <label className="field"><span className="label">Pesan</span><input value={p.msg} onChange={set('msg')} maxLength={120} /></label>
        <p className="hint">Tanda | artinya ganti baris.</p>
        <label className="field"><span className="label">Ilustrasi</span>
          <select className="inv-select" value={p.art} onChange={set('art')}>
            {Object.entries(ART_LABELS).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
            <option value="">Tanpa ilustrasi (lingkaran polos)</option>
          </select>
        </label>
        <div className="inv-two">
          <label className="field"><span className="label">Warna utama</span><input type="color" value={p.acc} onChange={set('acc')} /></label>
          <label className="field"><span className="label">Warna kedua</span><input type="color" value={p.acc2} onChange={set('acc2')} /></label>
        </div>

        <div className="inv-actions">
          <button type="button" disabled={busy === 'png'} onClick={() => run('png', async () => download(await png(), `${p.file}.png`))}>Unduh poster (PNG)</button>
          <button type="button" className="secondary" disabled={busy === 'copy'} onClick={() => run('copy', async () => {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': png() })]);
            setMsg({ message: 'Poster tersalin. Tempel di WA atau Instagram.' });
          })}>Salin poster</button>
        </div>

        <label className="field"><span className="label">Usulan caption</span><textarea rows={3} value={p.caption} onChange={set('caption')} /></label>
        <button type="button" className="link-btn" onClick={() => run('cap', async () => {
          await navigator.clipboard.writeText(p.caption);
          setMsg({ message: 'Caption tersalin.' });
        })}>Salin caption</button>
        {msg && <p className={msg.error ? 'err' : 'ok'} role="status">{msg.error || msg.message}</p>}
      </div>
      <div className="inv-preview">
        <style>{FACES}</style>
        <div className="inv-sheet poster-sheet" role="img" aria-label={`Poster ${p.tag}`} dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    </div>
  );
}
