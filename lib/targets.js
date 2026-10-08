// Tujuan kartu. Server selalu membentuk URL akhir sendiri dari input terstruktur,
// jadi pemilik kartu tidak bisa menyimpan skema URL berbahaya (javascript:, data:, dll).
import { isPlaceId, writeReviewUrl } from './places';

export { TARGET_TYPES, TARGET_LABELS, describeTarget } from './target-types';

const stripHandle = (raw, hostRe) => {
  let v = String(raw || '').trim();
  const m = v.match(hostRe);
  if (m) v = m[1];
  return v.replace(/^@/, '').replace(/[/?#].*$/, '');
};

function normalizeWhatsapp(raw) {
  const s = String(raw || '');
  const m = s.match(/wa\.me\/\+?(\d+)/i);
  let d = m ? m[1] : s.replace(/[^\d+]/g, '').replace(/^\+/, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  if (d.startsWith('8')) d = '62' + d;
  return /^\d{9,15}$/.test(d) ? d : null;
}

function normalizeLink(raw) {
  const s = String(raw || '').trim().slice(0, 500);
  let u;
  try { u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  if (u.username || u.password) return null;
  const h = u.hostname.toLowerCase();
  if (!h.includes('.') || h === 'localhost' || /^[\d.]+$/.test(h) || h.includes(':')) return null;
  u.protocol = 'https:';
  return u.toString();
}

// Kembalikan { type, value, url } atau { error }.
export function buildTarget(type, raw) {
  switch (type) {
    case 'review': {
      const id = String(raw || '').trim();
      if (!isPlaceId(id)) return { error: 'Cari dan pilih bisnisnya dulu.' };
      return { type, value: id, url: writeReviewUrl(id) };
    }
    case 'instagram': {
      const u = stripHandle(raw, /instagram\.com\/([^/?#]+)/i);
      if (!/^[A-Za-z0-9._]{1,30}$/.test(u)) return { error: 'Username Instagram tidak valid.' };
      return { type, value: u, url: `https://www.instagram.com/${u}/` };
    }
    case 'tiktok': {
      const u = stripHandle(raw, /tiktok\.com\/@?([^/?#]+)/i);
      if (!/^[A-Za-z0-9._]{2,24}$/.test(u)) return { error: 'Username TikTok tidak valid.' };
      return { type, value: u, url: `https://www.tiktok.com/@${u}` };
    }
    case 'whatsapp': {
      const n = normalizeWhatsapp(raw);
      if (!n) return { error: 'Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890.' };
      return { type, value: n, url: `https://wa.me/${n}` };
    }
    case 'link': {
      const url = normalizeLink(raw);
      if (!url) return { error: 'Link tidak valid. Contoh: https://menu.bisniskamu.com' };
      return { type, value: url, url };
    }
    default:
      return { error: 'Pilih tujuan kartu.' };
  }
}
