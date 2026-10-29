'use client';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { markChatted } from '@/app/admin/prospek/actions';
import { STATUSES, STATUS_LABEL, WA_TEXT, waNumber } from '@/lib/prospects';

// Warna titik per status (sama urutan dengan STATUSES).
export const STATUS_COLOR = {
  baru: '#7E87FE', chat: '#2C21C4', balas: '#E8A317', follow: '#D9661F',
  tertarik: '#C2185B', beli: '#1B8A4A', tolak: '#9A98B5', diam: '#B9B7CF',
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Peta prospek (OpenStreetMap). Hanya prospek yang punya koordinat yang tampil.
export default function ProspectMap({ prospects }) {
  const box = useRef(null);
  const router = useRouter();
  const withPos = useMemo(() => prospects.filter((p) => p.lat != null && p.lng != null), [prospects]);

  useEffect(() => {
    let map;
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !box.current) return;
      map = L.map(box.current, { zoomControl: true, preferCanvas: true });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const pts = [];
      // Yang belum di-chat digambar terakhir supaya tidak tertutup.
      const order = [...withPos].sort((a, b) => (a.status === 'baru') - (b.status === 'baru'));
      for (const p of order) {
        const num = waNumber(p.phone);
        const ig = p.instagram ? p.instagram.replace(/^@/, '') : '';
        const html = `<div class="pm-pop"><strong>${esc(p.name)}</strong>`
          + `<span>${esc([p.area, p.category].filter(Boolean).join(' · '))}</span>`
          + `<span class="pm-st" style="--c:${STATUS_COLOR[p.status] || '#999'}">${esc(STATUS_LABEL[p.status] || p.status)}</span>`
          + (p.note ? `<em>${esc(p.note)}</em>` : '')
          + '<div class="pm-act">'
          + (num ? `<a class="mini mini-wa" data-wa="${p.id}" href="https://wa.me/${num}?text=${encodeURIComponent(WA_TEXT)}" target="_blank" rel="noreferrer">Buka WA</a>` : '')
          + `<a class="mini" href="/admin/desain?${esc(new URLSearchParams({ name: p.name, ...(p.instagram ? { ig: p.instagram } : {}) }).toString())}">Desain</a>`
          + (ig ? `<a class="mini" href="https://www.instagram.com/${esc(ig)}/" target="_blank" rel="noreferrer">IG</a>` : '')
          + `<a class="mini" href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noreferrer">Rute</a>`
          + '</div></div>';
        L.circleMarker([p.lat, p.lng], {
          radius: p.status === 'beli' ? 9 : 7,
          color: '#fff', weight: 1.5, fillColor: STATUS_COLOR[p.status] || '#999', fillOpacity: 0.95,
        }).bindPopup(html, { maxWidth: 260 }).addTo(map);
        pts.push([p.lat, p.lng]);
      }
      if (pts.length) map.fitBounds(pts, { padding: [24, 24], maxZoom: 15 });
      else map.setView([-6.2, 106.82], 11);
      // Klik "Buka WA" di popup: prospek yang belum di-chat otomatis jadi "Sudah di-chat".
      map.on('popupopen', (e) => {
        const a = e.popup.getElement()?.querySelector('[data-wa]');
        if (a) a.addEventListener('click', async () => { await markChatted(Number(a.dataset.wa)); router.refresh(); }, { once: true });
      });
    })();
    return () => { cancelled = true; if (map) map.remove(); };
  }, [withPos, router]);

  return (
    <div className="pmap">
      <div ref={box} className="pmap-canvas" role="region" aria-label="Peta prospek" />
      <ul className="pmap-legend">
        {STATUSES.map(([k, label]) => (
          <li key={k}><span style={{ background: STATUS_COLOR[k] }} />{label}</li>
        ))}
      </ul>
      <p className="hint">{withPos.length} dari {prospects.length} prospek punya titik lokasi. Klik titik untuk buka WA, desain, atau rute.</p>
    </div>
  );
}
