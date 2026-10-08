import 'server-only';

// Robot preview link (WhatsApp, Instagram, Telegram, dll), crawler, dan alat baris perintah.
// Mereka tetap diarahkan ke tujuan, tapi tidak dihitung sebagai tap/scan.
const BOT_RE = /bot\b|bot\/|crawl|spider|slurp|preview|facebookexternalhit|facebookcatalog|meta-externalagent|whatsapp|telegram|discord|slack|skype|embedly|vkshare|pinterest|headlesschrome|lighthouse|curl\/|wget\/|python-requests|python-urllib|go-http-client|node-fetch|axios\//i;

export function isBotRequest(h) {
  const ua = h.get('user-agent') || '';
  if (!ua || BOT_RE.test(ua)) return true;
  // Prefetch browser (link dibuka di background sebelum diklik).
  const purpose = `${h.get('purpose') || ''} ${h.get('sec-purpose') || ''} ${h.get('x-purpose') || ''} ${h.get('x-moz') || ''}`;
  return /prefetch|preview/i.test(purpose) || h.has('next-router-prefetch');
}
