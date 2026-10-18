import { cache } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { isCode, normCode } from '@/lib/validate';
import { photoUrl } from '@/lib/avatar';
import MenuView from '@/components/MenuView';

export const dynamic = 'force-dynamic';

// Halaman menu digital (tujuan kartu jenis 'menu'). Tap lewat /c/KODE mencatat scan lalu
// diarahkan ke sini; link yang dibagikan langsung ke sini tidak menambah hitungan tap.
const getMenu = cache(async (raw) => {
  const code = normCode(raw);
  if (!isCode(code)) return null;
  const { data } = await db().from('cards').select('code,status,target_type,menu').eq('code', code).maybeSingle();
  if (!data || data.status !== 'active' || data.target_type !== 'menu' || !data.menu?.name) return null;
  return data.menu;
});

export async function generateMetadata({ params }) {
  const m = await getMenu((await params).code);
  if (!m) return { title: 'Menu tidak ditemukan' };
  return { title: { absolute: `Menu · ${m.name}` }, description: m.hours || 'Menu digital' };
}

export default async function MenuPage({ params }) {
  const m = await getMenu((await params).code);
  if (!m) notFound();
  const menu = {
    ...m,
    categories: (m.categories || []).map((c) => ({
      ...c,
      items: (c.items || []).map((it) => ({ ...it, photoUrl: photoUrl(it.photo) })),
    })),
  };
  return <MenuView menu={menu} />;
}
