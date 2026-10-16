import { cache } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { isCode, normCode } from '@/lib/validate';
import { profileLinks } from '@/lib/profile';
import { photoUrl } from '@/lib/avatar';
import { themeVars } from '@/lib/theme';
import KMark from '@/components/KMark';
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
  const role = [r.p.title, r.p.company].filter(Boolean).join(' · ');
  return { title: { absolute: r.p.name }, description: role || 'Kartu nama digital' };
}

const ICONS = {
  whatsapp: IconChat, phone: IconPhone, email: IconMail, instagram: IconCamera,
  tiktok: IconMusic, linkedin: IconBriefcase, website: IconGlobe,
};

const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default async function ProfilePage({ params }) {
  const r = await getProfile((await params).code);
  if (!r) notFound();
  const { code, p } = r;
  const links = profileLinks(p);
  const role = [p.title, p.company].filter(Boolean);

  const h = await headers();
  const origin = (process.env.PUBLIC_BASE_URL || `https://${h.get('host') || 'krsolutions.tech'}`).replace(/\/$/, '');

  return (
    <div className="pf" style={themeVars(p.color)}>
      <div className="pf-bg" aria-hidden="true" />
      <div className="pf-card">
        <div className="pf-top">
          {p.photo ? (
            <img className="pf-avatar pf-photo" src={photoUrl(p.photo)} alt={`Foto ${p.name}`} width={76} height={76} />
          ) : (
            <div className="pf-avatar" aria-hidden="true">{initials(p.name)}</div>
          )}
          <ShareButton url={`${origin}/p/${code}`} title={p.name} />
        </div>

        <h1 className="pf-name">{p.name}</h1>
        {role.length > 0 && (
          <p className="pf-role">
            {p.title}
            {p.title && p.company && <span aria-hidden="true"> · </span>}
            {p.company && <span className="pf-company">{p.company}</span>}
          </p>
        )}
        {p.bio && <p className="pf-bio">{p.bio}</p>}

        <a className="pf-save" href={`/p/${code}/vcard`}>
          <IconDownload size={20} /> Simpan kontak
        </a>

        {links.length > 0 && (
          <ul className="pf-links">
            {links.map((l) => {
              const Icon = l.custom ? IconLink : ICONS[l.key];
              const external = l.href.startsWith('https:');
              return (
                <li key={l.key}>
                  <a href={l.href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                    <span className={`pf-ico ${l.custom ? 'pf-ico-link' : `pf-ico-${l.key}`}`}><Icon size={20} /></span>
                    <span className="pf-txt">
                      <strong>{l.label}</strong>
                      <span>{l.sub}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <a className="pf-foot" href="/">
        <KMark size={14} /> Kartu nama NFC dari KR Solutions
      </a>
    </div>
  );
}
