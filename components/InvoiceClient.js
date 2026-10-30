'use client';
import { useActionState, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveInvoice, setInvoiceStatus } from '@/app/admin/invoice/actions';
import { PRESETS, STATUSES, fileName, invoiceSvg, rp, subtotal, todayJakarta, total, waMessage } from '@/lib/invoice';
import { waNumber } from '@/lib/prospects';
import { download, fontCss, svgToPngBlob } from '@/lib/svg-export';
import SubmitButton from './SubmitButton';
import { FormMessage } from './Fields';

const POPPINS = [400, 500, 600].map((w) => `@font-face{font-family:Poppins;font-weight:${w};src:url(/fonts/poppins-${w}.woff2) format('woff2')}`).join('\n');

// Pratinjau invoice (SVG yang sama dengan PNG yang diunduh).
export function InvoiceImage({ inv }) {
  const { svg } = useMemo(() => invoiceSvg(inv), [inv]);
  return (
    <>
      <style>{POPPINS}</style>
      <div className="inv-sheet" role="img" aria-label={`Invoice ${inv.number || 'baru'} untuk ${inv.buyer || '-'}`} dangerouslySetInnerHTML={{ __html: svg }} />
    </>
  );
}

async function invoicePng(inv) {
  const { svg, w, h } = invoiceSvg(inv, await fontCss());
  // Lebar 1200 px supaya tajam di WhatsApp.
  return svgToPngBlob(svg.replace(`width="${w}" height="${h}"`, `width="${w * 2}" height="${h * 2}"`), w * 2, h * 2);
}

// Tombol unduh/salin PNG, kirim WA, dan ganti status di halaman detail.
export function InvoiceActions({ inv }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState(null);
  const num = waNumber(inv.buyer_phone);

  const run = (fn, ok) => start(async () => {
    try {
      const r = await fn();
      setMsg(r?.error ? { error: r.error } : ok ? { ok } : null);
      if (r?.success) router.refresh();
    } catch {
      setMsg({ error: 'Gagal. Coba lagi.' });
    }
  });

  return (
    <div className="inv-actions">
      <button type="button" onClick={() => run(async () => download(await invoicePng(inv), fileName(inv)))} disabled={pending}>Unduh PNG</button>
      <button type="button" className="secondary" disabled={pending} onClick={() => run(async () => {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': invoicePng(inv) })]);
      }, 'PNG tersalin. Tempel di chat WhatsApp.')}>Salin PNG</button>
      {num && <a className="btn btn-soft" href={`https://wa.me/${num}?text=${encodeURIComponent(waMessage(inv))}`} target="_blank" rel="noreferrer">Buka WA pembeli</a>}
      {inv.status !== 'paid' && <button type="button" className="inv-paid" disabled={pending} onClick={() => run(() => setInvoiceStatus(inv.id, 'paid'), 'Ditandai lunas.')}>Tandai lunas</button>}
      {inv.status === 'paid' && <button type="button" className="secondary" disabled={pending} onClick={() => run(() => setInvoiceStatus(inv.id, 'unpaid'))}>Kembalikan ke belum dibayar</button>}
      <div className="inv-links">
        <a href={`/admin/invoice/${inv.id}?edit=1`}>Ubah invoice</a>
        {inv.status !== 'void' && <button type="button" className="link-btn" disabled={pending} onClick={() => run(() => setInvoiceStatus(inv.id, 'void'), 'Invoice dibatalkan.')}>Batalkan invoice</button>}
        {inv.status === 'void' && <button type="button" className="link-btn" disabled={pending} onClick={() => run(() => setInvoiceStatus(inv.id, 'unpaid'))}>Aktifkan lagi</button>}
      </div>
      {msg?.error && <p className="err" role="alert">{msg.error}</p>}
      {msg?.ok && <p className="ok" role="status">{msg.ok}</p>}
    </div>
  );
}

// Status di tabel riwayat.
export function InvoiceStatusSelect({ id, status: initial, label }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState(initial);
  const [err, setErr] = useState(null);
  return (
    <>
      <label className="sr-only" htmlFor={`inv-st-${id}`}>Status {label}</label>
      <select id={`inv-st-${id}`} className={`status-select inv-st-${status}`} value={status} disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          setStatus(v);
          start(async () => { const r = await setInvoiceStatus(id, v); setErr(r?.error || null); router.refresh(); });
        }}>
        {STATUSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
      </select>
      {err && <span className="err sub" role="alert">{err}</span>}
    </>
  );
}

const blankItem = () => ({ ...PRESETS[0] });

// Form buat/ubah invoice dengan pratinjau langsung.
export function InvoiceForm({ initial }) {
  const router = useRouter();
  const [state, action] = useActionState(saveInvoice, null);
  const [buyer, setBuyer] = useState(initial?.buyer || '');
  const [phone, setPhone] = useState(initial?.buyer_phone || '');
  const [issued, setIssued] = useState(String(initial?.issued_on || todayJakarta()).slice(0, 10));
  const [items, setItems] = useState(initial?.items?.length ? initial.items : [blankItem()]);
  const [discount, setDiscount] = useState(initial?.discount ? String(initial.discount) : '');
  const [discountNote, setDiscountNote] = useState(initial?.discount_note || '');
  const [note, setNote] = useState(initial?.note || '');
  const [status, setStatus] = useState(initial?.status || 'unpaid');
  const [paidOn, setPaidOn] = useState(String(initial?.paid_on || todayJakarta()).slice(0, 10));

  useEffect(() => { if (state?.success) router.push(`/admin/invoice/${state.id}`); }, [state, router]);

  const setItem = (i, patch) => setItems((list) => list.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const inv = {
    number: initial?.number, buyer, buyer_phone: phone, issued_on: issued, items: items.filter((it) => it.name),
    discount: Number(discount) || 0, discount_note: discountNote, note, status, paid_on: paidOn,
  };

  return (
    <div className="inv-screen">
      <form action={action} className="card inv-form">
        {initial?.id && <input type="hidden" name="id" value={initial.id} />}
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        <h2>{initial?.id ? `Ubah ${initial.number}` : 'Invoice baru'}</h2>
        <p className="hint">{initial?.id ? 'Nomor invoice tidak berubah.' : 'Nomor dibuat otomatis saat disimpan.'}</p>

        <div className="field">
          <label htmlFor="inv-buyer">Ditagihkan kepada</label>
          <input id="inv-buyer" name="buyer" value={buyer} onChange={(e) => setBuyer(e.target.value)} maxLength={120} required placeholder="Nama usaha" />
        </div>
        <div className="inv-two">
          <div className="field">
            <label htmlFor="inv-phone">Nomor WA <span className="opt">(opsional)</span></label>
            <input id="inv-phone" name="buyer_phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} placeholder="0812 3456 7890" />
          </div>
          <div className="field">
            <label htmlFor="inv-date">Tanggal</label>
            <input id="inv-date" name="issued_on" type="date" value={issued} onChange={(e) => setIssued(e.target.value)} required />
          </div>
        </div>

        <fieldset className="inv-items">
          <legend>Produk</legend>
          {items.map((it, i) => (
            <div className="inv-item" key={i}>
              <div className="field">
                <label htmlFor={`inv-name-${i}`}>Nama produk</label>
                <input id={`inv-name-${i}`} value={it.name} onChange={(e) => setItem(i, { name: e.target.value })} maxLength={80} />
              </div>
              <div className="field">
                <label htmlFor={`inv-detail-${i}`}>Keterangan <span className="opt">(opsional)</span></label>
                <input id={`inv-detail-${i}`} value={it.detail} onChange={(e) => setItem(i, { detail: e.target.value })} maxLength={120} />
              </div>
              <div className="inv-two">
                <div className="field">
                  <label htmlFor={`inv-qty-${i}`}>Qty</label>
                  <input id={`inv-qty-${i}`} type="number" inputMode="numeric" min={1} max={999} value={it.qty} onChange={(e) => setItem(i, { qty: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor={`inv-amt-${i}`}>Jumlah (Rp)</label>
                  <input id={`inv-amt-${i}`} type="number" inputMode="numeric" min={0} step={1000} value={it.amount} onChange={(e) => setItem(i, { amount: e.target.value })} />
                </div>
              </div>
              <div className="inv-item-tools">
                {PRESETS.map((p) => (
                  <button key={p.detail} type="button" className="mini" onClick={() => setItem(i, p)}>{p.qty} pcs {rp(p.amount)}</button>
                ))}
                {items.length > 1 && <button type="button" className="link-btn" onClick={() => setItems((l) => l.filter((_, j) => j !== i))}>Hapus baris</button>}
              </div>
            </div>
          ))}
          <button type="button" className="secondary btn-auto" onClick={() => setItems((l) => [...l, blankItem()])}>+ Tambah produk</button>
        </fieldset>

        <div className="inv-two">
          <div className="field">
            <label htmlFor="inv-disc">Potongan (Rp) <span className="opt">(opsional)</span></label>
            <input id="inv-disc" name="discount" type="number" inputMode="numeric" min={0} step={1000} value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" />
          </div>
          <div className="field">
            <label htmlFor="inv-disc-note">Alasan potongan</label>
            <input id="inv-disc-note" name="discount_note" value={discountNote} onChange={(e) => setDiscountNote(e.target.value)} maxLength={120} placeholder="Post IG story + tag @krsolutions.id" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="inv-note">Catatan di invoice <span className="opt">(opsional)</span></label>
          <input id="inv-note" name="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} />
        </div>

        <div className="inv-two">
          <div className="field">
            <label htmlFor="inv-status">Status</label>
            <select id="inv-status" name="status" className="status-select inv-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </div>
          {status === 'paid' && (
            <div className="field">
              <label htmlFor="inv-paid">Tanggal bayar</label>
              <input id="inv-paid" name="paid_on" type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} />
            </div>
          )}
        </div>

        <p className="inv-sum">Subtotal {rp(subtotal(inv))}{inv.discount ? ` − ${rp(inv.discount)}` : ''} · <strong>Total {rp(total(inv))}</strong></p>
        <SubmitButton>{initial?.id ? 'Simpan perubahan' : 'Simpan invoice'}</SubmitButton>
        <FormMessage state={state} />
        {initial?.id && <a className="hint center inv-cancel" href={`/admin/invoice/${initial.id}`}>Batal ubah</a>}
      </form>
      <div className="inv-preview">
        <InvoiceImage inv={inv} />
      </div>
    </div>
  );
}
