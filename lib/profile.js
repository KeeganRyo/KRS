// Kartu nama digital. Server membersihkan setiap isian dan membentuk link sendiri,
// sama seperti tujuan kartu biasa (lihat targets.js), jadi tidak ada URL mentah dari pengguna.
import { normalizeLink, normalizeWhatsapp, stripHandle } from './targets';

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

  return { profile: p };
}

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
  if (p.website) out.push({ key: 'website', label: 'Website', sub: p.website.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''), href: p.website });
  return out;
}

// vCard 3.0 untuk tombol "Simpan kontak". Nilai di-escape sesuai RFC 2426.
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([;,])/g, '\\$1');

export function toVcard(p, pageUrl) {
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
  const note = [p.bio, pageUrl].filter(Boolean).join('\n');
  if (note) lines.push(`NOTE:${esc(note)}`);
  lines.push('END:VCARD');
  return lines.join('\r\n') + '\r\n';
}
