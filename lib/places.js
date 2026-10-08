// Konversi input pemilik bisnis (link Maps / nama bisnis) menjadi Place ID,
// lalu bentuk link review resmi Google dari Place ID itu.
import 'server-only';
import { looksLikeUrl } from './maps';

const PLACE_ID_RE = /^[A-Za-z0-9_-]{20,200}$/;
export const isPlaceId = (v) => PLACE_ID_RE.test(String(v || ''));

export const writeReviewUrl = (placeId) =>
  `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;

const KEY = () => process.env.GOOGLE_PLACES_API_KEY || '';
export const hasPlacesKey = () => Boolean(KEY());

// Host yang boleh di-fetch oleh server (cegah SSRF). Hanya pengalih link Google.
const REDIRECTORS = new Set(['maps.app.goo.gl', 'goo.gl', 'g.page', 'g.co']);
// Host Google yang boleh muncul sebagai hasil redirect.
const GOOGLE_HOSTS = [
  'google.com', 'google.co.id', 'goo.gl', 'g.page', 'g.co',
];
const isGoogleHost = (h) => GOOGLE_HOSTS.some((d) => h === d || h.endsWith('.' + d));

// "Feature ID" di URL Maps (0x...:0x...) adalah isi dari Place ID bentuk ChIJ...
export function fidToPlaceId(h1, h2) {
  const buf = Buffer.alloc(20);
  buf[0] = 0x0a; buf[1] = 0x12; buf[2] = 0x09;
  buf.writeBigUInt64LE(BigInt('0x' + h1), 3);
  buf[11] = 0x11;
  buf.writeBigUInt64LE(BigInt('0x' + h2), 12);
  return buf.toString('base64url');
}

// Ambil Place ID / nama / koordinat dari satu URL (tanpa network).
export function extractFromUrl(urlStr) {
  let u;
  try { u = new URL(urlStr); } catch { return {}; }
  const out = {};

  const direct = u.searchParams.get('placeid') || u.searchParams.get('query_place_id')
    || u.searchParams.get('place_id');
  if (direct && isPlaceId(direct)) out.placeId = direct;

  const full = decodeURIComponent(u.pathname + u.search);
  if (!out.placeId) {
    const pid = full.match(/place_id:([A-Za-z0-9_-]{20,200})/);
    if (pid) out.placeId = pid[1];
  }
  if (!out.placeId) {
    const fid = full.match(/0x([0-9a-f]{1,16}):0x([0-9a-f]{1,16})/i);
    if (fid && BigInt('0x' + fid[1]) !== 0n) out.placeId = fidToPlaceId(fid[1], fid[2]);
  }

  const name = u.pathname.match(/\/maps\/place\/([^/@]+)/);
  if (name) out.name = decodeURIComponent(name[1].replace(/\+/g, ' ')).trim();
  const ll = u.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (ll) { out.lat = Number(ll[1]); out.lng = Number(ll[2]); }
  return out;
}

// Ikuti redirect link pendek Google, satu hop per satu, dengan allowlist host.
export async function followShortLink(startUrl) {
  let url = startUrl;
  for (let hop = 0; hop < 6; hop++) {
    const u = new URL(url);
    if (u.protocol !== 'https:' || !isGoogleHost(u.hostname.toLowerCase())) return null;
    if (u.hostname === 'consent.google.com') {
      const cont = u.searchParams.get('continue');
      if (!cont) return null;
      url = cont;
      continue;
    }
    if (!REDIRECTORS.has(u.hostname.toLowerCase())) return url; // sudah halaman akhir
    if (extractFromUrl(url).placeId) return url;
    const res = await fetch(url, {
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(6000),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; ReviewCard/1.0)', 'accept-language': 'id,en;q=0.8' },
    });
    const loc = res.headers.get('location');
    if (!loc) return url;
    url = new URL(loc, url).toString();
  }
  return url;
}

// Panggilan ke Places API (New). Error Google dicatat di log Vercel, dan kodenya dikembalikan.
async function placesCall(path, init, fieldMask) {
  try {
    const headers = { 'content-type': 'application/json', 'X-Goog-Api-Key': KEY() };
    if (fieldMask) headers['X-Goog-FieldMask'] = fieldMask;
    const res = await fetch(`https://places.googleapis.com/v1/${path}`, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
      headers,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error('[places]', path.split('?')[0], res.status, JSON.stringify(data?.error || data).slice(0, 600));
      return { data: null, errCode: data?.error?.status || `HTTP_${res.status}` };
    }
    return { data, errCode: null };
  } catch (e) {
    console.error('[places] network', e?.message);
    return { data: null, errCode: 'NETWORK' };
  }
}

const apiError = (code) => ({
  error: `Pencarian Google sedang bermasalah (${code}). Coba lagi, atau tempel link Maps.`,
});

const shape = (p) => ({
  placeId: p.id,
  name: p.displayName?.text || '',
  address: p.formattedAddress || '',
});

export async function searchByText(query, lat, lng) {
  if (!hasPlacesKey()) return { places: [], errCode: null };
  const body = { textQuery: query, languageCode: 'id', regionCode: 'ID', pageSize: 5 };
  if (lat != null && lng != null) {
    body.locationBias = { circle: { center: { latitude: lat, longitude: lng }, radius: 300 } };
  }
  const { data, errCode } = await placesCall('places:searchText', { method: 'POST', body: JSON.stringify(body) },
    'places.id,places.displayName,places.formattedAddress');
  const places = (data?.places || []).map(shape).filter((p) => isPlaceId(p.placeId));
  return { places, errCode };
}

export async function getDetails(placeId) {
  if (!hasPlacesKey()) return { place: null, errCode: null };
  const { data, errCode } = await placesCall(`places/${encodeURIComponent(placeId)}?languageCode=id`,
    { method: 'GET' }, 'id,displayName,formattedAddress');
  return { place: data && isPlaceId(data.id) ? shape(data) : null, errCode };
}

// Saran otomatis saat mengetik (Autocomplete New).
export async function autocomplete(input) {
  if (!hasPlacesKey()) return { places: [], errCode: null };
  const { data, errCode } = await placesCall('places:autocomplete', {
    method: 'POST',
    body: JSON.stringify({ input, languageCode: 'id', regionCode: 'ID' }),
  });
  const places = (data?.suggestions || [])
    .map((s) => s.placePrediction)
    .filter((p) => p && isPlaceId(p.placeId))
    .slice(0, 5)
    .map((p) => ({
      placeId: p.placeId,
      name: p.structuredFormat?.mainText?.text || p.text?.text || '',
      address: p.structuredFormat?.secondaryText?.text || '',
    }));
  return { places, errCode };
}

// Titik masuk: terima teks bebas (nama bisnis) atau link dari pemilik bisnis.
export async function lookup(input) {
  const q = String(input || '').trim().slice(0, 300);
  if (q.length < 3) return { error: 'Ketik nama bisnis atau tempel link Google Maps.' };

  let u = null;
  if (looksLikeUrl(q)) {
    try { u = new URL(/^https?:\/\//i.test(q) ? q : `https://${q}`); } catch { u = null; }
  }

  if (u) {
    if (!isGoogleHost(u.hostname.toLowerCase())) {
      return { error: 'Link harus dari Google Maps. Atau ketik nama bisnisnya.' };
    }
    let finalUrl;
    try { finalUrl = await followShortLink(u.toString()); } catch { finalUrl = null; }
    if (!finalUrl) return { error: 'Link tidak bisa dibuka. Coba salin ulang dari Google Maps.' };

    const info = extractFromUrl(finalUrl);
    if (info.placeId) {
      const { place, errCode } = await getDetails(info.placeId); // validasi + ambil nama/alamat
      if (place) return { results: [place] };
      const idUnknown = errCode === 'NOT_FOUND' || errCode === 'INVALID_ARGUMENT';
      if (!idUnknown) {
        // Tanpa key, atau Google bermasalah: tetap pakai ID dari link (tanpa validasi tambahan).
        return { results: [{ placeId: info.placeId, name: info.name || 'Bisnis dari link Maps', address: '' }] };
      }
      if (info.name) {
        const { places } = await searchByText(info.name, info.lat, info.lng);
        if (places.length) return { results: places };
      }
      return { error: 'Bisnis tidak ditemukan dari link itu. Coba ketik nama bisnisnya.' };
    }
    if (info.name && hasPlacesKey()) {
      const { places } = await searchByText(info.name, info.lat, info.lng);
      if (places.length) return { results: places };
    }
    return { error: 'Link itu tidak berisi data bisnis. Buka bisnisnya di Google Maps lalu pilih Bagikan.' };
  }

  if (!hasPlacesKey()) {
    return { error: 'Pencarian nama belum aktif. Tempel link bisnis dari Google Maps (tombol Bagikan).' };
  }
  const { places, errCode } = await searchByText(q);
  if (errCode) return apiError(errCode);
  if (!places.length) return { error: 'Bisnis tidak ditemukan. Coba tambah nama kota, atau tempel link Maps.' };
  return { results: places };
}

// Dipakai saran otomatis. Link Maps tidak lewat sini.
export async function suggest(input) {
  const q = String(input || '').trim().slice(0, 100);
  if (q.length < 3 || looksLikeUrl(q)) return { results: [] };
  if (!hasPlacesKey()) return { results: [] };
  const { places, errCode } = await autocomplete(q);
  if (errCode) return apiError(errCode);
  return { results: places };
}
