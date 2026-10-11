import { db } from '@/lib/db';
import { isCode, normCode } from '@/lib/validate';
import { toVcard } from '@/lib/profile';

export const dynamic = 'force-dynamic';

// File kontak (.vcf) untuk tombol "Simpan kontak" di halaman kartu nama.
export async function GET(req, { params }) {
  const code = normCode((await params).code);
  if (!isCode(code)) return new Response('Not found', { status: 404 });
  const { data } = await db().from('cards').select('status,target_type,profile').eq('code', code).maybeSingle();
  const p = data?.status === 'active' && data.target_type === 'profile' ? data.profile : null;
  if (!p?.name) return new Response('Not found', { status: 404 });

  const base = (process.env.PUBLIC_BASE_URL || new URL(req.url).origin).replace(/\/$/, '');
  const file = (p.name.replace(/[^A-Za-z0-9 ]+/g, '').trim().replace(/\s+/g, '-') || 'kontak').slice(0, 60);
  return new Response(toVcard(p, `${base}/p/${code}`), {
    headers: {
      'content-type': 'text/vcard; charset=utf-8',
      'content-disposition': `attachment; filename="${file}.vcf"`,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
