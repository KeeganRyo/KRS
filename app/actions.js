'use server';

import { db } from '@/lib/db';
import { hashPin, verifyPin } from '@/lib/pin';
import { isGoogleUrl, isPin, normCode } from '@/lib/validate';

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function activateCard(prev, formData) {
  const code = normCode(formData.get('code'));
  const googleUrl = String(formData.get('google_url') || '').trim();
  const businessName = String(formData.get('business_name') || '').trim();
  const pin = String(formData.get('pin') || '');

  if (!isGoogleUrl(googleUrl)) {
    return { error: 'Link harus link Google Maps / review yang valid (https).' };
  }
  if (!isPin(pin)) return { error: 'PIN harus 4 digit angka.' };

  const { data, error } = await db()
    .from('cards')
    .update({
      google_url: googleUrl,
      business_name: businessName || null,
      pin_hash: hashPin(pin),
      status: 'active',
      activated_at: new Date().toISOString(),
    })
    .eq('code', code)
    .eq('status', 'unactivated')
    .select('code');

  if (error) return { error: 'Terjadi kesalahan server. Coba lagi.' };
  if (!data || data.length === 0) return { error: 'Kartu ini sudah aktif atau kodenya tidak valid.' };
  return { success: true, code };
}

export async function editCard(prev, formData) {
  const code = normCode(formData.get('code'));
  const pin = String(formData.get('pin') || '');
  const newUrl = String(formData.get('google_url') || '').trim();
  const newName = String(formData.get('business_name') || '').trim();
  const newPin = String(formData.get('new_pin') || '');

  const { data: card } = await db()
    .from('cards')
    .select('code,pin_hash,failed_attempts,locked_until,status')
    .eq('code', code)
    .maybeSingle();

  if (!card || card.status !== 'active') return { error: 'Kartu belum aktif atau tidak ditemukan.' };

  if (card.locked_until && new Date(card.locked_until) > new Date()) {
    return { error: `Terlalu banyak salah PIN. Coba lagi dalam ${LOCK_MINUTES} menit.` };
  }

  if (!isPin(pin) || !verifyPin(pin, card.pin_hash)) {
    const attempts = (card.failed_attempts || 0) + 1;
    const patch = { failed_attempts: attempts };
    if (attempts >= MAX_ATTEMPTS) {
      patch.failed_attempts = 0;
      patch.locked_until = new Date(Date.now() + LOCK_MINUTES * 60000).toISOString();
    }
    await db().from('cards').update(patch).eq('code', code);
    return { error: 'PIN salah.' };
  }

  const patch = { failed_attempts: 0, locked_until: null };
  if (newUrl) {
    if (!isGoogleUrl(newUrl)) return { error: 'Link Google tidak valid.' };
    patch.google_url = newUrl;
  }
  if (newName) patch.business_name = newName;
  if (newPin) {
    if (!isPin(newPin)) return { error: 'PIN baru harus 4 digit angka.' };
    patch.pin_hash = hashPin(newPin);
  }

  const { error } = await db().from('cards').update(patch).eq('code', code);
  if (error) return { error: 'Gagal menyimpan. Coba lagi.' };
  return { success: true };
}
