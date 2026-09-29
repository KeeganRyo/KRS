const ALLOWED = ['google.com', 'google.co.id', 'goo.gl', 'g.page', 'g.co'];

export function isGoogleUrl(value) {
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:') return false;
    const h = u.hostname.toLowerCase();
    return ALLOWED.some((d) => h === d || h.endsWith('.' + d));
  } catch {
    return false;
  }
}

export const isPin = (v) => /^\d{4}$/.test(v || '');
export const normCode = (v) => String(v || '').trim().toUpperCase();
