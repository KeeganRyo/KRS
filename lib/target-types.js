// Aman dipakai di browser (tanpa import server).
export const TARGET_TYPES = ['review', 'instagram', 'whatsapp', 'tiktok', 'link', 'profile'];

export const TARGET_LABELS = {
  review: 'Review Google',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  tiktok: 'TikTok',
  link: 'Menu / link lain',
  profile: 'Kartu nama',
};

// Teks singkat untuk menampilkan tujuan saat ini.
export function describeTarget(type, value, name) {
  switch (type) {
    case 'review': return name ? `Review Google: ${name}` : 'Review Google';
    case 'instagram': return `Instagram @${value}`;
    case 'tiktok': return `TikTok @${value}`;
    case 'whatsapp': return `WhatsApp +${value}`;
    case 'link': return value;
    case 'profile': return name ? `Kartu nama: ${name}` : 'Kartu nama digital';
    default: return 'Belum diatur';
  }
}
