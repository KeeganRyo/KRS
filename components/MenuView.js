import './MenuView.css';
import KMark from './KMark';
import CopyButton from './CopyButton';
import MenuTabs from './MenuTabs';

const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

// Tampilan menu digital (dipakai halaman /m/KODE dan contoh /contoh-menu).
// `menu.categories[].items[].photoUrl` sudah berupa URL lengkap; foto boleh kosong.
export default function MenuView({ menu, demo = false }) {
  const cats = (menu.categories || []).filter((c) => c.items?.length);
  return (
    <div className="mn">
      {demo && <p className="mn-demo">Contoh menu digital · data fiktif untuk demo</p>}
      <header className="mn-head">
        <div className="mn-logo" aria-hidden="true">{initials(menu.name)}</div>
        <h1>{menu.name}</h1>
        {menu.hours && <p>{menu.hours}</p>}
        {menu.wifi && (
          <div className="mn-wifi">
            <span>Wi-Fi</span>
            <strong>{menu.wifi}</strong>
            {menu.wifiPass && (
              <>
                <span className="mn-pass-k">Password</span>
                <strong>{menu.wifiPass}</strong>
                <CopyButton text={menu.wifiPass} className="mn-copy" />
              </>
            )}
          </div>
        )}
      </header>

      {cats.length > 1 && (
        <MenuTabs cats={cats.map((c) => ({ id: c.id, name: c.name }))} />
      )}

      {cats.map((c) => (
        <section key={c.id} id={`k-${c.id}`} className="mn-sec">
          <h2>{c.name}</h2>
          <ul>
            {c.items.map((it) => (
              <li key={it.id}>
                {it.photoUrl && <img className="mn-img" src={it.photoUrl} alt="" width={72} height={72} loading="lazy" />}
                <div className="mn-txt">
                  <strong>{it.name}{it.tag && <span className="mn-tag">{it.tag}</span>}</strong>
                  {it.desc && <span>{it.desc}</span>}
                </div>
                {it.price && <b>{it.price}</b>}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {menu.note && <p className="mn-note">{menu.note}</p>}

      <a className="mn-foot" href="/">
        <KMark size={14} /> Menu digital NFC dari KR Solutions
      </a>
    </div>
  );
}
