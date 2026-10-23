import MenuView from '@/components/MenuView';

// Contoh menu digital untuk demo papan menu NFC. Kafe, harga, dan Wi-Fi di sini fiktif.
// Foto: Unsplash (lisensi Unsplash), hanya ilustrasi; disimpan di public/contoh-menu.
export const metadata = { title: 'Contoh menu · Kopi Senja', description: 'Contoh menu digital untuk papan menu NFC KR Solutions.' };

const MENU = [
  {
    name: 'Kopi',
    items: [
      ['es-kopi', 'Es Kopi Senja', 'Espresso, susu segar, gula aren', '28K', 'Favorit'],
      ['americano', 'Americano', 'Panas atau dingin', '24K'],
      ['latte', 'Caffè Latte', 'Espresso dan susu', '30K'],
      ['cappuccino', 'Cappuccino', 'Foam tebal, taburan cokelat', '30K'],
      ['tubruk', 'Kopi Tubruk', 'Robusta Temanggung', '18K'],
    ],
  },
  {
    name: 'Non-kopi',
    items: [
      ['matcha', 'Matcha Latte', 'Matcha dan susu segar', '32K', 'Baru'],
      ['cokelat', 'Cokelat', 'Panas atau dingin', '28K'],
      ['teh-leci', 'Teh Leci', 'Teh melati, buah leci', '24K'],
      ['air', 'Air Mineral', '', '10K'],
    ],
  },
  {
    name: 'Makanan',
    items: [
      ['croissant', 'Croissant Butter', '', '25K'],
      ['roti-bakar', 'Roti Bakar Srikaya', '', '22K'],
      ['nasi-goreng', 'Nasi Goreng Senja', 'Telur mata sapi, kerupuk', '38K'],
      ['kentang', 'Kentang Goreng', 'Saus sambal dan mayones', '25K'],
    ],
  },
];

// Bentuk data sama dengan menu yang disimpan pemilik kartu (lib/menu.js).
const DEMO = {
  name: 'Kopi Senja',
  hours: 'Buka setiap hari 08.00–22.00',
  wifi: 'KopiSenja_Guest',
  wifiPass: 'ngopidulu123',
  note: 'Harga sudah termasuk pajak. Foto hanya ilustrasi.',
  categories: MENU.map((c, ci) => ({
    id: `c${ci}`,
    name: c.name,
    items: c.items.map(([img, name, desc, price, tag], i) => ({ id: `${ci}-${i}`, name, desc, price, tag, photoUrl: `/contoh-menu/${img}.webp` })),
  })),
};

export default function ContohMenu() {
  return <MenuView menu={DEMO} demo />;
}
