export const IG_HANDLE = '@krsolutions.id';
export const IG_URL = 'https://instagram.com/krsolutions.id';
// Membuka DM Instagram langsung.
export const IG_DM = 'https://ig.me/m/krsolutions.id';
export const EMAIL = 'keegan@krsolutions.tech';
export const GRAB = 'https://lynk.id/krsolutions';
// WhatsApp bisnis (sama dengan bio IG). Pesan awal untuk pemesanan kartu nama NFC.
export const WA_NUMBER = '6287776652015';
// Reset PIN lewat WhatsApp; kode kartu ikut di pesan supaya admin langsung tahu kartunya.
export const waLupaPin = (code) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo KR Solutions, saya lupa PIN kartu ${code || '(kode kartu)'}. Mohon dibantu reset.`)}`;
export const WA_KARTU_NAMA = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo KR Solutions, saya mau pesan kartu nama NFC.')}`;
