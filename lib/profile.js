// Kartu nama digital. Server membersihkan setiap isian dan membentuk link sendiri,
// sama seperti tujuan kartu biasa (lihat targets.js), jadi tidak ada URL mentah dari pengguna.
import { normalizeLink, normalizeWhatsapp, stripHandle } from './targets';
import { DEFAULT_COLOR, DEFAULT_LAYOUT, normColor, normLayout } from './theme';

const text = (v, max) => String(v || '').replace(/\s+/g, ' ').trim().slice(0, max);

// Bio boleh beberapa baris, tapi tidak lebih dari 4.
const multiline = (v, max) =>
  String(v || '').replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean).slice(0, 4).join('\n').slice(0, max);

const EMAIL_RE = /^[^\s@<>"']{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/;

// Kembalikan { profile } atau { error }. Isian kosong dilewati; nama wajib.
export function buildProfile(formData) {
  const get = (k) => formData.get(`p_${k}`);
  const p = {};

  p.name = text(get('name'), 60);
  if (!p.name) return { error: 'Isi nama kamu dulu.' };
  const title = text(get('title'), 60);
  const company = text(get('company'), 80);
  const bio = multiline(get('bio'), 200);
  if (title) p.title = title;
  if (company) p.company = company;
  if (bio) p.bio = bio;

  const wa = text(get('whatsapp'), 30);
  if (wa) {
    const n = normalizeWhatsapp(wa);
    if (!n) return { error: 'Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890.' };
    p.whatsapp = n;
  }

  const email = text(get('email'), 120);
  if (email) {
    if (!EMAIL_RE.test(email)) return { error: 'Alamat email tidak valid.' };
    p.email = email.toLowerCase();
  }

  const ig = text(get('instagram'), 120);
  if (ig) {
    const u = stripHandle(ig, /instagram\.com\/([^/?#]+)/i);
    if (!/^[A-Za-z0-9._]{1,30}$/.test(u)) return { error: 'Username Instagram tidak valid.' };
    p.instagram = u;
  }

  const tt = text(get('tiktok'), 120);
  if (tt) {
    const u = stripHandle(tt, /tiktok\.com\/@?([^/?#]+)/i);
    if (!/^[A-Za-z0-9._]{2,24}$/.test(u)) return { error: 'Username TikTok tidak valid.' };
    p.tiktok = u;
  }

  const li = text(get('linkedin'), 200);
  if (li) {
    const u = stripHandle(li, /linkedin\.com\/in\/([^/?#]+)/i);
    if (!/^[A-Za-z0-9-]{3,100}$/.test(u)) return { error: 'Link LinkedIn tidak valid. Contoh: linkedin.com/in/namakamu' };
    p.linkedin = u;
  }

  const web = text(get('website'), 500);
  if (web) {
    const url = normalizeLink(web);
    if (!url) return { error: 'Link website tidak valid. Contoh: https://bisniskamu.com' };
    p.website = url;
  }

  const color = normColor(get('color'));
  if (color && color !== DEFAULT_COLOR) p.color = color;

  const layout = normLayout(get('layout'));
  if (layout && layout !== DEFAULT_LAYOUT) p.layout = layout;

  // Link tambahan: judul + URL. id dibuat browser supaya urutan tetap benar saat link dihapus.
  const titles = formData.getAll('p_link_title');
  const urls = formData.getAll('p_link_url');
  const ids = formData.getAll('p_link_id');
  const links = [];
  for (let i = 0; i < Math.min(urls.length, 20); i++) {
    const t = text(titles[i], 40);
    const raw = text(urls[i], 500);
    if (!t && !raw) continue;
    if (!raw) return { error: `Isi link untuk "${t}".` };
    const url = normalizeLink(raw);
    if (!url) return { error: `Link "${t || raw}" tidak valid. Contoh: https://katalog.bisniskamu.com` };
    let id = String(ids[i] || '');
    if (!LINK_ID_RE.test(id) || links.some((l) => l.id === id)) id = `l${i}`;
    links.push({ id, title: t || url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''), url });
  }
  if (links.length > MAX_LINKS) return { error: `Maksimal ${MAX_LINKS} link tambahan.` };
  if (links.length) p.links = links;

  // Urutan tombol: hanya kunci yang memang ada di kartu ini.
  const known = new Set(profileLinks({ ...p, order: undefined }).map((l) => l.key));
  const order = String(get('order') || '').split(',').filter((k) => known.has(k));
  if (order.length) p.order = [...new Set(order)];

  return { profile: p };
}

export const MAX_LINKS = 8;
const LINK_ID_RE = /^[a-z0-9]{1,12}$/;

// +62 812-3456-7890 (nomor Indonesia); nomor lain cukup diberi +.
const prettyPhone = (n) => {
  const m = n.match(/^62(\d{3})(\d{3,4})(\d{3,5})$/);
  return m ? `+62 ${m[1]}-${m[2]}-${m[3]}` : `+${n}`;
};

// Daftar tombol di halaman kartu nama, urut dari yang paling sering dipakai.
export function profileLinks(p) {
  const out = [];
  if (p.whatsapp) out.push({ key: 'whatsapp', label: 'WhatsApp', sub: prettyPhone(p.whatsapp), href: `https://wa.me/${p.whatsapp}` });
  if (p.whatsapp) out.push({ key: 'phone', label: 'Telepon', sub: prettyPhone(p.whatsapp), href: `tel:+${p.whatsapp}` });
  if (p.email) out.push({ key: 'email', label: 'Email', sub: p.email, href: `mailto:${p.email}` });
  if (p.instagram) out.push({ key: 'instagram', label: 'Instagram', sub: `@${p.instagram}`, href: `https://www.instagram.com/${p.instagram}/` });
  if (p.tiktok) out.push({ key: 'tiktok', label: 'TikTok', sub: `@${p.tiktok}`, href: `https://www.tiktok.com/@${p.tiktok}` });
  if (p.linkedin) out.push({ key: 'linkedin', label: 'LinkedIn', sub: `in/${p.linkedin}`, href: `https://www.linkedin.com/in/${p.linkedin}` });
  if (p.website) out.push({ key: 'website', label: 'Website', sub: shortUrl(p.website), href: p.website });
  for (const l of p.links || []) out.push({ key: `x${l.id}`, label: l.title, sub: shortUrl(l.url), href: l.url, custom: true });
  if (!p.order?.length) return out;
  // Urutan pilihan pemilik; tombol yang belum masuk urutan (baru diisi) ditaruh di bawah.
  const rank = new Map(p.order.map((k, i) => [k, i]));
  return out
    .map((l, i) => ({ l, r: rank.has(l.key) ? rank.get(l.key) : 1000 + i }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.l);
}

const shortUrl = (u) => u.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');

// vCard 3.0 untuk tombol "Simpan kontak". Nilai di-escape sesuai RFC 2426.
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([;,])/g, '\\$1');

// Baris vCard maksimal 75 karakter; sisanya dilanjutkan di baris baru yang diawali spasi.
const fold = (line) => {
  if (line.length <= 75) return line;
  const out = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) out.push(' ' + line.slice(i, i + 74));
  return out.join('\r\n');
};

export function toVcard(p, pageUrl, photoB64 = null) {
  const parts = p.name.split(' ');
  const last = parts.length > 1 ? parts.pop() : '';
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(last)};${esc(parts.join(' '))};;;`,
    `FN:${esc(p.name)}`,
  ];
  if (p.company) lines.push(`ORG:${esc(p.company)}`);
  if (p.title) lines.push(`TITLE:${esc(p.title)}`);
  if (p.whatsapp) lines.push(`TEL;TYPE=CELL:+${p.whatsapp}`);
  if (p.email) lines.push(`EMAIL;TYPE=INTERNET:${esc(p.email)}`);
  if (p.website) lines.push(`URL:${esc(p.website)}`);
  if (p.instagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/${p.instagram}/`);
  if (p.tiktok) lines.push(`X-SOCIALPROFILE;TYPE=tiktok:https://www.tiktok.com/@${p.tiktok}`);
  if (p.linkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/${p.linkedin}`);
  for (const l of p.links || []) lines.push(`URL:${esc(l.url)}`);
  const note = [p.bio, pageUrl].filter(Boolean).join('\n');
  if (note) lines.push(`NOTE:${esc(note)}`);
  if (photoB64) lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoB64}`);
  lines.push('END:VCARD');
  return lines.map(fold).join('\r\n') + '\r\n';
}
