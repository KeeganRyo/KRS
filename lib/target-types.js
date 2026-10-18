// Aman dipakai di browser (tanpa import server).
export const TARGET_TYPES = ['review', 'link', 'menu', 'instagram', 'whatsapp', 'tiktok', 'profile'];

export const TARGET_LABELS = {
  review: 'Review Google',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  tiktok: 'TikTok',
  menu: 'Menu digital',
  link: 'Link menu / lain',
  profile: 'Kartu nama',
};

// Teks singkat untuk menampilkan tujuan saat ini.
export function describeTarget(type, value, name) {
  switch (type) {
    case 'review': return name ? `Review Google: ${name}` : 'Review Google';
    case 'instagram': return `Instagram @${value}`;
    case 'tiktok': return `TikTok @${value}`;
    case 'whatsapp': return `WhatsApp +${value}`;
    case 'menu': return name ? `Menu digital: ${name}` : 'Menu digital';
    case 'link': return value;
    case 'profile': return name ? `Kartu nama: ${name}` : 'Kartu nama digital';
    default: return 'Belum diatur';
  }
}
