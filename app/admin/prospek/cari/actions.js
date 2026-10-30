'use server';

import { db } from '@/lib/db';
import { isAdmin } from '@/lib/session';
import { waNumber } from '@/lib/prospects';
import { FIELD_MASK, MAX_QUERIES, PAGES_PER_QUERY, filterPlaces } from '@/lib/leads';

// Tes lokal mengarahkan ini ke server tiruan (tools/local-test).
const BASE = () => (process.env.PLACES_API_BASE || 'https://places.googleapis.com/v1').replace(/\/$/, '');
const KEY = () => process.env.GOOGLE_PLACES_API_KEY || '';
const list = (v) => [...new Set(String(v || '').split(/[,\n]/).map((x) => x.trim().replace(/\s+/g, ' ')).filter(Boolean))].map((x) => x.slice(0, 40));

async function searchText(textQuery, pageToken) {
  const res = await fetch(`${BASE()}/places:searchText`, {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
    headers: { 'content-type': 'application/json', 'X-Goog-Api-Key': KEY(), 'X-Goog-FieldMask': FIELD_MASK },
    body: JSON.stringify({ textQuery, languageCode: 'id', regionCode: 'ID', pageSize: 20, ...(pageToken ? { pageToken } : {}) }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    console.error('[leads]', res.status, JSON.stringify(data?.error || data).slice(0, 400));
    throw new Error(data?.error?.status || `HTTP_${res.status}`);
  }
  return data || {};
}

async function known() {
  const keys = new Set();
  const names = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db().from('prospects').select('key,name').order('id').range(from, from + 999);
    if (error) throw error;
    data.forEach((r) => { keys.add(r.key); names.push(String(r.name || '').toLowerCase().replace(/[^a-z0-9]/g, '')); });
    if (data.length < 1000) break;
  }
  return { keys, names };
}

export async function findLeads(prev, fd) {
  if (!(await isAdmin())) return { error: 'Sesi admin habis. Login lagi.' };
  if (!KEY()) return { error: 'GOOGLE_PLACES_API_KEY belum diisi di Vercel.' };
  const kinds = list(fd.get('kinds'));
  const areas = list(fd.get('areas'));
  const city = String(fd.get('city') || 'Jakarta').trim().slice(0, 40) || 'Jakarta';
  if (!kinds.length || !areas.length) return { error: 'Isi jenis usaha dan area.' };
  const queries = kinds.flatMap((k) => areas.map((a) => `${k} ${a} ${city}`));
  if (queries.length > MAX_QUERIES) {
    return { error: `${queries.length} pencarian kebanyakan. Maksimal ${MAX_QUERIES} sekali cari (jenis × area), biar kuota gratis Google awet.` };
  }

  let calls = 0;
  let failed = null;
  const places = [];
  await Promise.all(queries.map(async (q) => {
    let token;
    for (let page = 0; page < PAGES_PER_QUERY; page++) {
      try {
        calls++;
        const data = await searchText(q, token);
        places.push(...(data.places || []));
        token = data.nextPageToken;
        if (!token) break;
      } catch (e) {
        failed = e.message;
        break;
      }
    }
  }));
  if (!places.length && failed) {
    return { error: `Google menolak pencarian (${failed}). Cek di Google Cloud: Places API (New) aktif dan kuota belum habis.` };
  }

  let k;
  try { k = await known(); } catch { return { error: 'Gagal membaca daftar prospek.' }; }
  const { leads, skip, total } = filterPlaces(places, city, k);
  return { success: true, leads, skip, total, calls, queries: queries.length, warn: failed ? `Sebagian pencarian gagal (${failed}).` : null };
}

const num = (v, lo, hi) => (typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi ? v : null);
const str = (v, n) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, n) : null);

// Simpan leads yang dicentang ke tabel prospects. Data dari browser dicek ulang di sini.
export async function addLeads(items, batch) {
  if (!(await isAdmin())) return { error: 'Sesi admin habis. Login lagi.' };
  if (!Array.isArray(items) || !items.length) return { error: 'Belum ada yang dipilih.' };
  if (items.length > 400) return { error: 'Terlalu banyak sekali simpan.' };
  let k;
  try { k = await known(); } catch { return { error: 'Gagal membaca daftar prospek.' }; }
  const tag = str(batch, 40);
  const rows = [];
  for (const it of items) {
    const phone = waNumber(it?.phone);
    const name = str(it?.name, 120);
    if (!phone || !name || k.keys.has(phone)) continue;
    k.keys.add(phone);
    const ig = str(it.instagram, 40);
    const maps = str(it.maps_url, 300);
    rows.push({
      key: phone, name, phone, status: 'baru', batch: tag,
      area: str(it.area, 80), city: str(it.city, 60), category: str(it.category, 60), address: str(it.address, 240),
      instagram: ig && /^@[\w.]+$/.test(ig) ? ig : null,
      maps_url: maps && maps.startsWith('https://') ? maps : null,
      rating: num(it.rating, 0, 5), reviews: num(it.reviews, 0, 10000000),
      lat: num(it.lat, -90, 90), lng: num(it.lng, -180, 180),
    });
  }
  if (!rows.length) return { error: 'Semua yang dipilih sudah ada di Prospek.' };
  const { error } = await db().from('prospects').insert(rows);
  if (error) return { error: 'Gagal menyimpan ke Prospek.' };
  return { success: true, message: `${rows.length} leads masuk ke Prospek${tag ? ` (batch ${tag})` : ''}.` };
}
