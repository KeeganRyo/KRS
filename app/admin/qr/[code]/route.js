import QRCode from 'qrcode';
import { isAdmin } from '@/lib/session';
import { isCode, normCode } from '@/lib/validate';

export const dynamic = 'force-dynamic';

// QR SVG untuk satu kartu (khusus admin). Domain diambil dari PUBLIC_BASE_URL, atau domain saat ini.
export async function GET(req, { params }) {
  if (!(await isAdmin())) return new Response('Unauthorized', { status: 401 });
  const code = normCode((await params).code);
  if (!isCode(code)) return new Response('Bad code', { status: 400 });

  const base = (process.env.PUBLIC_BASE_URL || new URL(req.url).origin).replace(/\/$/, '');
  const svg = await QRCode.toString(`${base}/c/${code}`, { type: 'svg', errorCorrectionLevel: 'M', margin: 2 });
  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml',
      'content-disposition': `attachment; filename="qr_${code}.svg"`,
      'cache-control': 'no-store',
    },
  });
}
