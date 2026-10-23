import { cache } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { isCode, normCode } from '@/lib/validate';
import WifiView from '@/components/WifiView';

export const dynamic = 'force-dynamic';

// Halaman WiFi tamu (tujuan kartu jenis 'wifi'). Tap lewat /c/KODE mencatat scan lalu
// diarahkan ke sini; membuka link ini langsung tidak menambah hitungan tap.
const getWifi = cache(async (raw) => {
  const code = normCode(raw);
  if (!isCode(code)) return null;
  const { data } = await db().from('cards').select('code,status,target_type,wifi').eq('code', code).maybeSingle();
  if (!data || data.status !== 'active' || data.target_type !== 'wifi' || !data.wifi?.ssid) return null;
  return data.wifi;
});

export async function generateMetadata({ params }) {
  const w = await getWifi((await params).code);
  if (!w) return { title: 'Halaman tidak ditemukan' };
  // Password WiFi tidak boleh muncul di mesin pencari.
  return { title: { absolute: `WiFi · ${w.name}` }, robots: { index: false, follow: false } };
}

export default async function WifiPage({ params }) {
  const w = await getWifi((await params).code);
  if (!w) notFound();
  return <WifiView wifi={w} />;
}
