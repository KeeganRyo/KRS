import { cache } from 'react';
import QRCode from 'qrcode';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { isCode, normCode } from '@/lib/validate';
import { profileLinks } from '@/lib/profile';
import { photoUrl } from '@/lib/avatar';
import { DEFAULT_LAYOUT, normLayout, themeVars } from '@/lib/theme';
import KMark from '@/components/KMark';
import CardShell from '@/components/CardShell';
import ShareButton from '@/components/ShareButton';
import { IconBriefcase, IconCamera, IconChat, IconDownload, IconGlobe, IconLink, IconMail, IconMusic, IconPhone } from '@/components/Icons';

export const dynamic = 'force-dynamic';

// Halaman kartu nama digital (tujuan kartu jenis 'profile'). Tap kartu lewat /c/KODE mencatat
// scan lalu diarahkan ke sini; link yang dibagikan langsung ke sini tidak menambah hitungan tap.
const getProfile = cache(async (raw) => {
  const code = normCode(raw);
  if (!isCode(code)) return null;
  const { data } = await db().from('cards').select('code,status,target_type,profile').eq('code', code).maybeSingle();
  if (!data || data.status !== 'active' || data.target_type !== 'profile' || !data.profile?.name) return null;
  return { code, p: data.profile };
});

export async function generateMetadata({ params }) {
  const r = await getProfile((await params).code);
  if (!r) return { title: 'Kartu tidak ditemukan' };
  if (r.p.hidden) return { title: 'Kartu dinonaktifkan' };
  const role = [r.p.title, r.p.company].filter(Boolean).join(' · ');
  return { title: { absolute: r.p.name }, description: role || 'Kartu nama digital' };
}

const ICONS = {
  whatsapp: IconChat, phone: IconPhone, email: IconMail, instagram: IconCamera,
  tiktok: IconMusic, linkedin: IconBriefcase, website: IconGlobe,
};

const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

// Tombol bulat di bawah nama (tampilan Cover): kontak langsung, sisanya tetap di daftar.
const QUICK = ['whatsapp', 'phone', 'email'];
const QUICK_LABEL = { whatsapp: 'Chat', phone: 'Telepon', email: 'Email' };

const ext = (href) => (href.startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {});
const iconOf = (l) => (l.custom ? IconLink : ICONS[l.key]);
const icoClass = (l) => `pf-ico ${l.custom ? 'pf-ico-link' : `pf-ico-${l.key}`}`;

// Elemen muncul berurutan saat halaman dibuka.
const step = (i) => ({ style: { '--i': i } });

function Avatar({ p }) {
  return p.photo ? (
    <img className="pf-avatar pf-photo" src={photoUrl(p.photo)} alt={`Foto ${p.name}`} width={76} height={76} />
  ) : (
    <div className="pf-avatar" aria-hidden="true">{initials(p.name)}</div>
  );
}

function Role({ p }) {
  if (!p.title && !p.company) return null;
  return (
    <p className="pf-role">
      {p.title}
      {p.title && p.company && <span aria-hidden="true"> · </span>}
      {p.company && <span className="pf-company">{p.company}</span>}
    </p>
  );
}

function Save({ code, i }) {
  return (
    <a className="pf-save pf-in" href={`/p/${code}/vcard`} {...step(i)}>
      <IconDownload size={20} /> Simpan kontak
    </a>
  );
}

function LinkList({ links, from }) {
  if (!links.length) return null;
  return (
    <ul className="pf-links">
      {links.map((l, n) => {
        const Icon = iconOf(l);
        return (
          <li key={l.key} className="pf-in" {...step(from + n)}>
            <a href={l.href} {...ext(l.href)}>
              <span className={icoClass(l)}><Icon size={20} /></span>
              <span className="pf-txt">
                <strong>{l.label}</strong>
                <span>{l.sub}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function Klasik({ p, code, links, share }) {
  return (
    <div className="pf-card">
      <div className="pf-top pf-in" {...step(0)}>
        <Avatar p={p} />
        {share}
      </div>
      <h1 className="pf-name pf-in" {...step(1)}>{p.name}</h1>
      <div className="pf-in" {...step(2)}><Role p={p} /></div>
      {p.bio && <p className="pf-bio pf-in" {...step(3)}>{p.bio}</p>}
      <Save code={code} i={4} />
      <LinkList links={links} from={5} />
    </div>
  );
}

function Cover({ p, code, links, share }) {
  const quick = links.filter((l) => QUICK.includes(l.key));
  const rest = links.filter((l) => !QUICK.includes(l.key));
  return (
    <div className="pf-card">
      <div className="pf-band">{share}</div>
      <div className="pf-head pf-in" {...step(0)}>
        <Avatar p={p} />
        <h1 className="pf-name">{p.name}</h1>
        <Role p={p} />
        {p.bio && <p className="pf-bio">{p.bio}</p>}
      </div>
      {quick.length > 0 && (
        <ul className="pf-quick pf-in" {...step(1)}>
          {quick.map((l) => {
            const Icon = iconOf(l);
            return (
              <li key={l.key}>
                <a href={l.href} {...ext(l.href)}>
                  <span className={icoClass(l)}><Icon size={22} /></span>
                  {QUICK_LABEL[l.key]}
                </a>
              </li>
            );
          })}
        </ul>
      )}
      <Save code={code} i={2} />
      <LinkList links={rest} from={3} />
    </div>
  );
}

function Bento({ p, code, links, share }) {
  return (
    <div className="pf-card">
      <div className="pf-who pf-in" {...step(0)}>
        <Avatar p={p} />
        <div>
          <h1 className="pf-name">{p.name}</h1>
          <Role p={p} />
        </div>
      </div>
      {p.bio && <p className="pf-bio pf-in" {...step(1)}>{p.bio}</p>}
      <Save code={code} i={2} />
      <ul className="pf-bento">
        {links.map((l, n) => {
          const Icon = iconOf(l);
          const big = n === 0 && links.length > 2;
          return (
            <li key={l.key} className={`pf-in${big ? ' pf-tile-big' : ''}${l.custom ? ' pf-tile-wide' : ''}`} {...step(3 + n)}>
              <a className={`pf-tile pf-tile-${l.custom ? 'link' : l.key}`} href={l.href} {...ext(l.href)}>
                <span className={icoClass(l)}><Icon size={big ? 26 : 20} /></span>
                <span className="pf-txt">
                  <strong>{l.label}</strong>
                  <span>{l.sub}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <div className="pf-bento-share pf-in" {...step(3 + links.length)}>{share}</div>
    </div>
  );
}

// Putih = susunan Klasik dengan latar terang; warna pilihan dipakai untuk aksen.
const LAYOUT_VIEWS = { klasik: Klasik, cover: Cover, bento: Bento, putih: Klasik };

export default async function ProfilePage({ params }) {
  const r = await getProfile((await params).code);
  if (!r) notFound();
  const { code, p } = r;
  if (p.hidden) {
    return (
      <CardShell title="Kartu sedang dinonaktifkan">
        <p>Pemilik kartu ini menonaktifkannya sementara. Coba lagi nanti, atau hubungi pemiliknya langsung.</p>
      </CardShell>
    );
  }
  const links = profileLinks(p);
  const layout = normLayout(p.layout) || DEFAULT_LAYOUT;
  const View = LAYOUT_VIEWS[layout];

  const h = await headers();
  const origin = (process.env.PUBLIC_BASE_URL || `https://${h.get('host') || 'krsolutions.tech'}`).replace(/\/$/, '');
  // QR ke link profil (tidak menambah hitungan tap), untuk HP tanpa NFC atau slide presentasi.
  const qr = await QRCode.toString(`${origin}/p/${code}`, { type: 'svg', errorCorrectionLevel: 'M', margin: 1, color: { dark: '#15122E', light: '#ffffff' } });

  return (
    <div className={`pf pf-l-${layout}`} style={themeVars(p.color)}>
      <div className="pf-bg" aria-hidden="true" />
      <View p={p} code={code} links={links} share={<ShareButton url={`${origin}/p/${code}`} title={p.name} />} />
      <details className="pf-qr">
        <summary>Tampilkan QR code</summary>
        <div className="pf-qr-box" role="img" aria-label={`QR code ke kartu nama ${p.name}`} dangerouslySetInnerHTML={{ __html: qr }} />
        <p>Scan pakai kamera HP untuk membuka kartu ini.</p>
      </details>
      <a className="pf-foot" href="/">
        <KMark size={14} /> Kartu nama NFC dari KR Solutions
      </a>
    </div>
  );
}
