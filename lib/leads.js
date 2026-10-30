// Cari leads dari Google Places API (New) di /admin/prospek/cari. Saringan sama dengan skrip
// "Cari Leads" di laptop (tools gmaps-scraper/leads.py): buang yang tutup, tanpa nomor HP,
// di luar kota, franchise/cabang, review < 5, dan yang sudah ada di Prospek.
import { waNumber } from './prospects';

export const MAX_QUERIES = 10; // per sekali cari; tiap pencarian = 1-2 panggilan API
export const PAGES_PER_QUERY = 2; // 20 tempat per halaman

// Field yang diminta. Nomor telepon membuat panggilan masuk SKU "Enterprise" (1.000 gratis/bulan).
export const FIELD_MASK = [
  'places.id', 'places.displayName', 'places.formattedAddress', 'places.addressComponents', 'places.location',
  'places.nationalPhoneNumber', 'places.rating', 'places.userRatingCount', 'places.businessStatus',
  'places.websiteUri', 'places.googleMapsUri', 'places.primaryTypeDisplayName', 'nextPageToken',
].join(',');

// Brand berantai/franchise: bukan target (mereka punya tim marketing sendiri).
const CHAINS = new RegExp('\\b(' + [
  'janji jiwa', 'kopi kenangan', 'tomoro', 'fore coffee', 'starbucks', 'point coffee', 'kopi calf', 'tanamera', 'titik temu',
  'cotti', 'matcha times', 'bagi kopi', 'first crack', 'excelso', 'j\\.?co', 'chatime', 'mixue', 'kopi soe', 'kopi nako',
  'kopi kulo', 'haus!?', 'es teh indonesia', 'mcdonald', 'kfc', 'burger king', 'richeese', 'hokben', 'solaria', 'pizza hut',
  'domino', 'gacoan', 'wizzmie', 'kopi lain hati', 'kopi dari pada', 'flash coffee', 'maxx coffee', 'kopi tuku', 'lawson',
  'indomaret', 'alfamart', 'family ?mart', 'circle k', 'dunkin', 'breadtalk', 'roti o', 'holland bakery', 'the harvest',
  'chagee', 'tealive', 'gong cha', 'xing fu tang', 'sour sally', 'yoshinoya', 'marugame', 'upnormal', 'bakmi gm',
  "d'?crepes", 'baba rafi', 'sushi tei', 'genki sushi', 'ichiban sushi', 'captain barbershop',
].join('|') + ')', 'i');

export const SKIP_LABELS = {
  tutup: 'tutup', no_hp: 'tanpa nomor HP', luar: 'di luar kota', franchise: 'franchise/cabang',
  review: 'review < 5', ada: 'sudah ada di Prospek', dobel: 'muncul dobel',
};

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const brand = (t) => norm(String(t || '').toLowerCase().split(/ - | \| |, /)[0]);
const comp = (p, type) => (p.addressComponents || []).find((c) => (c.types || []).includes(type))?.longText || '';

// "Kota Administrasi Jakarta Selatan" -> "Jakarta Selatan"
export const cityOf = (p) => comp(p, 'administrative_area_level_2').replace(/^(Kota|Kabupaten)\s+(Administrasi\s+)?/i, '').trim();
const areaOf = (p) => comp(p, 'administrative_area_level_3').replace(/^Kecamatan\s+/i, '').trim()
  || (String(p.formattedAddress || '').match(/Kec(?:\.|amatan) ([^,]+)/) || [])[1] || '';

// places = hasil gabungan semua pencarian. city = teks kota yang diminta ("Jakarta" = semua Jakarta).
// known = { keys: Set(kunci prospek), names: [nama prospek dinormalisasi] }.
export function filterPlaces(places, city, known) {
  const want = String(city || 'Jakarta').trim().toLowerCase();
  const seenIds = new Set();
  const unique = places.filter((p) => p?.id && !seenIds.has(p.id) && seenIds.add(p.id));
  const branches = {};
  unique.forEach((p) => { const b = brand(p.displayName?.text); (branches[b] ||= new Set()).add(p.id); });

  const skip = Object.fromEntries(Object.keys(SKIP_LABELS).map((k) => [k, 0]));
  const phones = new Set();
  const leads = [];
  for (const p of unique) {
    const name = String(p.displayName?.text || '').trim();
    const c = cityOf(p);
    const phone = waNumber(p.nationalPhoneNumber);
    const b = brand(name);
    if (p.businessStatus && p.businessStatus !== 'OPERATIONAL') { skip.tutup++; continue; }
    if (!phone) { skip.no_hp++; continue; }
    if (!c.toLowerCase().includes(want) && !String(p.formattedAddress || '').toLowerCase().includes(want)) { skip.luar++; continue; }
    if (CHAINS.test(name) || (b.length >= 4 && branches[b].size >= 2)) { skip.franchise++; continue; }
    if ((p.userRatingCount || 0) < 5) { skip.review++; continue; }
    const n = norm(name);
    if (known.keys.has(phone) || known.names.some((k) => k.length >= 5 && (k === n || (n.length >= 8 && (k.includes(n) || n.includes(k)))))) { skip.ada++; continue; }
    if (phones.has(phone)) { skip.dobel++; continue; }
    phones.add(phone);
    const ig = String(p.websiteUri || '').match(/instagram\.com\/([A-Za-z0-9_.]+)/);
    leads.push({
      id: p.id,
      name: name.replace(/\s*\(.*?\)\s*/g, ' ').split(' | ')[0].trim().slice(0, 120),
      area: areaOf(p).slice(0, 80) || null,
      city: c.slice(0, 60) || null,
      category: String(p.primaryTypeDisplayName?.text || '').slice(0, 60) || null,
      address: String(p.formattedAddress || '').slice(0, 240) || null,
      phone,
      instagram: ig ? `@${ig[1]}` : null,
      rating: typeof p.rating === 'number' ? p.rating : null,
      reviews: p.userRatingCount || 0,
      maps_url: String(p.googleMapsUri || '').startsWith('https://') ? p.googleMapsUri.slice(0, 300) : null,
      lat: p.location?.latitude ?? null,
      lng: p.location?.longitude ?? null,
    });
  }
  leads.sort((a, b) => b.reviews - a.reviews);
  return { leads, skip, total: unique.length };
}
