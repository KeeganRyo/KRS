// Ikon garis 24px, satu ketebalan. Warna mengikuti currentColor.
const base = {
  width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: 'false',
};

export function IconCheck({ size = 24, className }) {
  return <svg {...base} width={size} height={size} className={className} strokeWidth={2.4}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
}

export function IconPlus({ size = 24, className }) {
  return <svg {...base} width={size} height={size} className={className} strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>;
}

export function IconStar(p) {
  return <svg {...base} {...p}><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" /></svg>;
}

export function IconMenu(p) {
  return <svg {...base} {...p}><path d="M6 3.5h12a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5z" /><path d="M8.5 8h7M8.5 12h7M8.5 16h4" /></svg>;
}

export function IconCamera(p) {
  return <svg {...base} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></svg>;
}

export function IconChat(p) {
  return <svg {...base} {...p}><path d="M20 11.6a8 8 0 0 1-11.8 7l-4.2 1.1 1.1-4A8 8 0 1 1 20 11.6z" /><path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.6" /></svg>;
}

export function IconAt(p) {
  return <svg {...base} {...p}><circle cx="12" cy="12" r="3.6" /><path d="M15.6 12v1.3a2.6 2.6 0 0 0 5.2 0V12a8.8 8.8 0 1 0-3.4 6.9" /></svg>;
}

export function IconLink(p) {
  return <svg {...base} {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.1 1.1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.1-1.1" /></svg>;
}

export function IconPlay({ size = 24, className }) {
  return <svg {...base} width={size} height={size} className={className} fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z" /></svg>;
}

export function IconPhone(p) {
  return <svg {...base} {...p}><path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" /></svg>;
}

export function IconMail(p) {
  return <svg {...base} {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4.5 7l7.5 6 7.5-6" /></svg>;
}

export function IconMusic(p) {
  return <svg {...base} {...p}><path d="M13.5 4v10.5a3.5 3.5 0 1 1-3-3.46" /><path d="M13.5 4c.4 2.4 2.2 4.2 4.5 4.5" /></svg>;
}

export function IconBriefcase(p) {
  return <svg {...base} {...p}><rect x="3.5" y="7.5" width="17" height="12" rx="2.5" /><path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3.5 12.5h17" /></svg>;
}

export function IconGlobe(p) {
  return <svg {...base} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5z" /></svg>;
}

export function IconDownload(p) {
  return <svg {...base} {...p}><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" /></svg>;
}

export function IconShare(p) {
  return <svg {...base} {...p}><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" /><path d="M8 11.5H6.5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H16" /></svg>;
}
