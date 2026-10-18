// Menu digital (tujuan kartu 'menu'). Browser mengirim isi menu sebagai JSON di satu input
// tersembunyi; server membersihkan setiap teks dan membatasi jumlahnya sebelum disimpan.
export const MENU_LIMITS = { categories: 12, items: 80, perCategory: 40 };

const text = (v, max) => String(v || '').replace(/\s+/g, ' ').trim().slice(0, max);
const ID_RE = /^[a-z0-9]{1,12}$/;

// Foto menu hanya boleh file yang diunggah server untuk kartu ini (lihat uploadMenuPhoto).
export const menuPhotoRe = (code) => new RegExp(`^${code}/menu/[0-9a-f-]{36}\\.jpg$`);

// Kembalikan { menu } atau { error }.
export function buildMenu(formData, code) {
  let raw;
  try {
    raw = JSON.parse(String(formData.get('m_data') || '{}'));
  } catch {
    return { error: 'Isi menu tidak terbaca. Muat ulang halaman lalu coba lagi.' };
  }
  const m = {};
  m.name = text(raw.name, 60);
  if (!m.name) return { error: 'Isi nama tempat dulu (misalnya Kopi Senja).' };
  const hours = text(raw.hours, 60);
  const wifi = text(raw.wifi, 40);
  const note = text(raw.note, 160);
  if (hours) m.hours = hours;
  if (wifi) m.wifi = wifi;
  if (note) m.note = note;

  const photoOk = menuPhotoRe(code);
  const cats = Array.isArray(raw.categories) ? raw.categories.slice(0, MENU_LIMITS.categories + 1) : [];
  if (cats.length > MENU_LIMITS.categories) return { error: `Maksimal ${MENU_LIMITS.categories} kategori.` };
  let total = 0;
  m.categories = [];
  for (let i = 0; i < cats.length; i++) {
    const c = cats[i] || {};
    const name = text(c.name, 30);
    const items = Array.isArray(c.items) ? c.items : [];
    if (!name && !items.length) continue;
    if (!name) return { error: `Kategori ke-${i + 1} belum diberi nama.` };
    if (items.length > MENU_LIMITS.perCategory) return { error: `Kategori "${name}" maksimal ${MENU_LIMITS.perCategory} item.` };
    const out = [];
    for (const it of items) {
      const iname = text(it?.name, 60);
      if (!iname) continue;
      const item = { id: ID_RE.test(String(it.id)) ? String(it.id) : `i${total}`, name: iname };
      const desc = text(it.desc, 120);
      const price = text(it.price, 20);
      const tag = text(it.tag, 16);
      if (desc) item.desc = desc;
      if (price) item.price = price;
      if (tag) item.tag = tag;
      if (it.photo && photoOk.test(String(it.photo))) item.photo = String(it.photo);
      out.push(item);
      total++;
    }
    m.categories.push({ id: ID_RE.test(String(c.id)) ? String(c.id) : `c${i}`, name, items: out });
  }
  if (total > MENU_LIMITS.items) return { error: `Maksimal ${MENU_LIMITS.items} item menu.` };
  if (!total) return { error: 'Tambahkan minimal satu item menu.' };
  return { menu: m };
}

// Semua foto yang dipakai sebuah menu (untuk menghapus foto lama yang sudah tidak dipakai).
export const menuPhotos = (menu) =>
  (menu?.categories || []).flatMap((c) => (c.items || []).map((i) => i.photo).filter(Boolean));
