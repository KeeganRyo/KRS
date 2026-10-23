'use client';
import { useId, useState } from 'react';

// Isian WiFi tamu (lihat lib/wifi.js). Terkontrol supaya tidak hilang saat server mengembalikan error.
export default function WifiFields({ initial }) {
  const id = useId();
  const [v, setV] = useState(() => ({
    name: initial?.name || '',
    ssid: initial?.ssid || '',
    pass: initial?.pass || '',
    open: !!initial?.open,
    wa: initial?.wa ? `+${initial.wa}` : '',
    review: initial?.review || '',
    info: (initial?.info || []).join('\n'),
  }));
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="field">
        <label htmlFor={`${id}-n`}>Nama tempat</label>
        <input id={`${id}-n`} name="w_name" value={v.name} onChange={set('name')} maxLength={60} placeholder="Contoh: Hotel Senja" required />
      </div>
      <div className="field">
        <label htmlFor={`${id}-s`}>Nama WiFi (SSID)</label>
        <input id={`${id}-s`} name="w_ssid" value={v.ssid} onChange={set('ssid')} maxLength={32} placeholder="HotelSenja_Tamu"
          autoComplete="off" autoCapitalize="off" spellCheck={false} required />
        <p className="hint">Tulis persis seperti yang muncul di daftar WiFi HP, termasuk huruf besar kecilnya.</p>
      </div>
      <label className="check">
        <input type="checkbox" name="w_open" value="1" checked={v.open} onChange={set('open')} />
        WiFi tanpa password
      </label>
      {!v.open && (
        <div className="field">
          <label htmlFor={`${id}-p`}>Password WiFi</label>
          <input id={`${id}-p`} name="w_pass" value={v.pass} onChange={set('pass')} minLength={8} maxLength={63}
            autoComplete="off" autoCapitalize="off" spellCheck={false} required />
          <p className="hint">Password ini tampil di halaman WiFi untuk siapa pun yang tap atau scan papan. Pakai WiFi khusus tamu, jangan WiFi kantor.</p>
        </div>
      )}
      <div className="field">
        <label htmlFor={`${id}-w`}>WhatsApp resepsionis <span className="opt">(opsional)</span></label>
        <input id={`${id}-w`} name="w_wa" type="tel" inputMode="tel" value={v.wa} onChange={set('wa')} maxLength={30} placeholder="0812 3456 7890" />
      </div>
      <div className="field">
        <label htmlFor={`${id}-i`}>Info tambahan <span className="opt">(opsional, maksimal 4 baris)</span></label>
        <textarea id={`${id}-i`} name="w_info" value={v.info} onChange={set('info')} rows={4} maxLength={400}
          placeholder={'Sarapan: 06.30–10.00, Lantai 1\nCheck-out: 12.00'} />
        <p className="hint">Satu info per baris. Pakai titik dua untuk judul, misalnya "Kolam renang: 07.00–21.00".</p>
      </div>
      <div className="field">
        <label htmlFor={`${id}-r`}>Link review Google <span className="opt">(opsional)</span></label>
        <input id={`${id}-r`} name="w_review" type="text" inputMode="url" value={v.review} onChange={set('review')} maxLength={500}
          placeholder="https://g.page/r/..." autoComplete="off" autoCapitalize="off" spellCheck={false} />
      </div>
    </div>
  );
}
