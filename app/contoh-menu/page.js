import './menu.css';
import KMark from '@/components/KMark';

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

export default function ContohMenu() {
  return (
    <div className="mn">
      <p className="mn-demo">Contoh menu digital · data fiktif untuk demo</p>
      <header className="mn-head">
        <div className="mn-logo" aria-hidden="true">KS</div>
        <h1>Kopi Senja</h1>
        <p>Buka setiap hari 08.00–22.00</p>
        <div className="mn-wifi">
          <span>Wi-Fi</span>
          <strong>KopiSenja_Guest</strong>
        </div>
      </header>

      <nav className="mn-tabs" aria-label="Kategori menu">
        {MENU.map((c) => <a key={c.name} href={`#${c.name.toLowerCase()}`}>{c.name}</a>)}
      </nav>

      {MENU.map((c) => (
        <section key={c.name} id={c.name.toLowerCase()} className="mn-sec">
          <h2>{c.name}</h2>
          <ul>
            {c.items.map(([img, name, desc, price, tag]) => (
              <li key={name}>
                <img className="mn-img" src={`/contoh-menu/${img}.webp`} alt="" width={72} height={72} loading="lazy" />
                <div className="mn-txt">
                  <strong>{name}{tag && <span className="mn-tag">{tag}</span>}</strong>
                  {desc && <span>{desc}</span>}
                </div>
                <b>{price}</b>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mn-note">Harga sudah termasuk pajak. Pesan langsung di kasir.<br />Foto hanya ilustrasi.</p>

      <a className="mn-foot" href="/">
        <KMark size={14} /> Papan menu NFC dari KR Solutions
      </a>
    </div>
  );
}
