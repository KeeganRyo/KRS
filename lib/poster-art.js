// Ilustrasi vektor per hari besar untuk poster (/admin/poster). Tiap gambar digambar di kotak 520×520,
// warnanya ikut warna aksen poster (a = utama, b = kedua). Gaya: flat, bentuk sederhana, tanpa garis luar.

const K = '#111113';
const W = '#FFFFFF';

const star = (cx, cy, R, fill, r = R * 0.45, rot = -90) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const rad = ((rot + i * 36) * Math.PI) / 180;
    const d = i % 2 ? r : R;
    pts.push(`${(cx + d * Math.cos(rad)).toFixed(1)},${(cy + d * Math.sin(rad)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
};
const sparkle = (cx, cy, s, fill) => `<path d="M${cx} ${cy - s} Q${cx} ${cy} ${cx + s} ${cy} Q${cx} ${cy} ${cx} ${cy + s} Q${cx} ${cy} ${cx - s} ${cy} Q${cx} ${cy} ${cx} ${cy - s}Z" fill="${fill}"/>`;
// Bulan sabit sebagai mask (bukan lingkaran ditimpa warna latar), jadi rapi di latar apa pun.
const crescent = (cx, cy, r, fill) => {
  const id = `cr${Math.round(cx)}x${Math.round(cy)}`;
  return `<mask id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/><circle cx="${cx + r * 0.42}" cy="${cy - r * 0.22}" r="${r * 0.86}" fill="#000"/></mask><circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" mask="url(#${id})"/>`;
};
const burst = (cx, cy, r, color, n = 12) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const x1 = cx + Math.cos(t) * r * 0.32, y1 = cy + Math.sin(t) * r * 0.32;
    const x2 = cx + Math.cos(t) * r, y2 = cy + Math.sin(t) * r;
    s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="9" stroke-linecap="round"/>`;
    s += `<circle cx="${(cx + Math.cos(t) * (r + 18)).toFixed(1)}" cy="${(cy + Math.sin(t) * (r + 18)).toFixed(1)}" r="6" fill="${color}"/>`;
  }
  return s;
};
const gear = (cx, cy, r, fill, hole) => {
  let s = '';
  for (let i = 0; i < 8; i++) s += `<rect x="${cx - r * 0.2}" y="${cy - r * 1.22}" width="${r * 0.4}" height="${r * 0.5}" rx="6" fill="${fill}" transform="rotate(${i * 45} ${cx} ${cy})"/>`;
  return `${s}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="${hole}"/>`;
};
// Masjid: kubah, badan, dua menara, pintu lengkung. (cx, alas)
const mosque = (cx, base, fill, door) => `
<rect x="${cx - 112}" y="${base - 96}" width="224" height="96" rx="6" fill="${fill}"/>
<path d="M${cx - 84} ${base - 94} C${cx - 84} ${base - 186} ${cx - 16} ${base - 196} ${cx} ${base - 232} C${cx + 16} ${base - 196} ${cx + 84} ${base - 186} ${cx + 84} ${base - 94}Z" fill="${fill}"/>
<circle cx="${cx}" cy="${base - 242}" r="7" fill="${fill}"/>
<rect x="${cx - 162}" y="${base - 214}" width="30" height="214" rx="4" fill="${fill}"/><path d="M${cx - 166} ${base - 214} L${cx - 147} ${base - 252} L${cx - 128} ${base - 214}Z" fill="${fill}"/>
<rect x="${cx + 132}" y="${base - 214}" width="30" height="214" rx="4" fill="${fill}"/><path d="M${cx + 128} ${base - 214} L${cx + 147} ${base - 252} L${cx + 166} ${base - 214}Z" fill="${fill}"/>
<path d="M${cx - 26} ${base} L${cx - 26} ${base - 46} Q${cx} ${base - 78} ${cx + 26} ${base - 46} L${cx + 26} ${base}Z" fill="${door}"/>
<path d="M${cx - 80} ${base - 30} L${cx - 80} ${base - 56} Q${cx - 66} ${base - 74} ${cx - 52} ${base - 56} L${cx - 52} ${base - 30}Z" fill="${door}"/>
<path d="M${cx + 52} ${base - 30} L${cx + 52} ${base - 56} Q${cx + 66} ${base - 74} ${cx + 80} ${base - 56} L${cx + 80} ${base - 30}Z" fill="${door}"/>`;
// Lentera Timur Tengah (fanous) yang tergantung.
const fanous = (cx, top, len, s, body, glow) => `
<line x1="${cx}" y1="${top}" x2="${cx}" y2="${top + len}" stroke="${body}" stroke-width="4"/>
<g transform="translate(${cx} ${top + len}) scale(${s})">
<circle cx="0" cy="4" r="9" fill="none" stroke="${body}" stroke-width="5"/>
<path d="M-26 40 Q0 0 26 40Z" fill="${body}"/>
<path d="M-34 44 L34 44 L28 120 L-28 120Z" fill="${body}"/>
<path d="M-20 54 L20 54 L16 110 L-16 110Z" fill="${glow}"/>
<path d="M-30 124 L30 124 L0 160Z" fill="${body}"/>
</g>`;
// Lampion Imlek.
const lampion = (cx, top, len, s, red, gold) => `
<line x1="${cx}" y1="${top}" x2="${cx}" y2="${top + len}" stroke="${gold}" stroke-width="4"/>
<g transform="translate(${cx} ${top + len}) scale(${s})">
<rect x="-30" y="0" width="60" height="16" rx="4" fill="${gold}"/>
<ellipse cx="0" cy="78" rx="78" ry="66" fill="${red}"/>
<path d="M0 12 C-40 30 -40 126 0 144 M0 12 C40 30 40 126 0 144" stroke="${gold}" stroke-width="5" fill="none" opacity=".75"/>
<rect x="-30" y="140" width="60" height="16" rx="4" fill="${gold}"/>
<path d="M-14 156 L-18 214 M0 156 L0 220 M14 156 L18 214" stroke="${gold}" stroke-width="6" stroke-linecap="round"/>
</g>`;
const cloud = (x, y, s, fill) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><circle cx="0" cy="0" r="38"/><circle cx="44" cy="-18" r="48"/><circle cx="92" cy="0" r="38"/><rect x="0" y="0" width="92" height="38"/></g>`;

export const ART = {
  pahlawan: (a, b) => `
<circle cx="290" cy="260" r="220" fill="${b}" opacity=".22"/>
<g transform="rotate(-14 330 470)"><rect x="318" y="150" width="24" height="330" rx="6" fill="#B08A3E"/><path d="M318 152 L330 92 L342 152Z" fill="#B08A3E"/>
<rect x="318" y="250" width="24" height="6" fill="#8A6A2B"/><rect x="318" y="360" width="24" height="6" fill="#8A6A2B"/></g>
<rect x="150" y="96" width="26" height="390" rx="6" fill="#C9A24E"/><path d="M150 98 L163 40 L176 98Z" fill="#C9A24E"/>
<rect x="150" y="200" width="26" height="7" fill="#9C7A33"/><rect x="150" y="310" width="26" height="7" fill="#9C7A33"/><rect x="150" y="420" width="26" height="7" fill="#9C7A33"/>
<path d="M176 108 C250 82 320 138 420 104 L420 174 C320 208 250 152 176 178Z" fill="${a}"/>
<path d="M176 178 C250 152 320 208 420 174 L420 244 C320 278 250 222 176 248Z" fill="${W}" stroke="#E2E2E8" stroke-width="3"/>
${sparkle(440, 330, 18, b)}${sparkle(90, 160, 12, a)}`,

  guru: (a, b) => `
<circle cx="270" cy="250" r="210" fill="${b}" opacity=".2"/>
<rect x="70" y="80" width="380" height="250" rx="20" fill="${b}"/>
<rect x="88" y="98" width="344" height="214" rx="10" fill="#1F3D35"/>
<text x="120" y="190" font-family="Georgia,serif" font-size="64" fill="${W}" opacity=".92">a + b</text>
<path d="M120 240 Q190 214 260 240 T400 236" stroke="${W}" stroke-width="5" fill="none" opacity=".7" stroke-linecap="round"/>
<rect x="130" y="330" width="16" height="120" fill="${K}"/><rect x="374" y="330" width="16" height="120" fill="${K}"/>
<rect x="250" y="402" width="200" height="34" rx="6" fill="${a}"/><rect x="262" y="370" width="176" height="34" rx="6" fill="${K}"/><rect x="244" y="338" width="190" height="34" rx="6" fill="${b}"/>
<circle cx="200" cy="404" r="40" fill="${a}"/><path d="M200 366 Q206 350 222 346" stroke="${K}" stroke-width="5" fill="none"/><ellipse cx="216" cy="356" rx="14" ry="7" fill="#2E8B57" transform="rotate(-25 216 356)"/>`,

  ibu: (a, b) => `
<circle cx="270" cy="270" r="215" fill="${b}" opacity=".35"/>
<path d="M120 470 C120 330 190 280 250 280 C320 280 370 340 370 470Z" fill="${a}"/>
<circle cx="250" cy="200" r="62" fill="${K}"/><circle cx="196" cy="160" r="30" fill="${K}"/>
<path d="M250 470 C250 400 290 370 330 370 C380 370 410 410 410 470Z" fill="${b}"/>
<circle cx="332" cy="318" r="42" fill="${K}"/>
<path d="M392 120 C392 96 424 88 436 112 C448 88 480 96 480 120 C480 150 436 172 436 172 C436 172 392 150 392 120Z" fill="${a}"/>
${sparkle(110, 120, 16, a)}${sparkle(470, 250, 12, a)}`,

  natal: (a, b) => `
<circle cx="260" cy="270" r="215" fill="${a}" opacity=".12"/>
<path d="M260 60 L380 210 L140 210Z" fill="${b}"/>
<path d="M260 130 L410 310 L110 310Z" fill="${b}"/>
<path d="M260 210 L440 420 L80 420Z" fill="${b}"/>
<rect x="236" y="420" width="48" height="50" fill="#7A4A2A"/>
${star(260, 60, 40, '#E8B43C')}
<circle cx="220" cy="200" r="13" fill="${a}"/><circle cx="300" cy="260" r="13" fill="#E8B43C"/><circle cx="196" cy="300" r="13" fill="#E8B43C"/>
<circle cx="320" cy="360" r="13" fill="${a}"/><circle cx="170" cy="390" r="13" fill="${a}"/><circle cx="262" cy="350" r="13" fill="${W}"/>
<rect x="360" y="410" width="90" height="70" rx="6" fill="${a}"/><rect x="398" y="410" width="14" height="70" fill="#E8B43C"/><rect x="352" y="398" width="106" height="20" rx="4" fill="${a}"/>
${sparkle(90, 120, 14, '#E8B43C')}${sparkle(440, 120, 18, '#E8B43C')}`,

  tahunbaru: (a, b) => `
<circle cx="270" cy="260" r="225" fill="#14123A"/>
${burst(200, 200, 86, b)}${burst(360, 300, 64, a === '#2C21C4' ? '#8E87FF' : a)}${burst(330, 140, 40, W, 10)}
<circle cx="200" cy="200" r="14" fill="${W}"/><circle cx="360" cy="300" r="10" fill="${W}"/>
<path d="M200 480 Q206 380 200 300" stroke="${b}" stroke-width="5" fill="none" stroke-dasharray="4 12" stroke-linecap="round"/>
${sparkle(120, 330, 14, W)}${sparkle(430, 170, 12, b)}${sparkle(150, 100, 9, W)}${sparkle(420, 410, 10, W)}`,

  isra: (a, b) => `
<circle cx="270" cy="250" r="225" fill="#123326"/>
${crescent(380, 140, 62, b)}
${star(170, 110, 16, b)}${star(250, 70, 10, W)}${star(110, 220, 9, W)}${star(450, 260, 9, W)}
<path d="M70 320 Q200 220 330 170" stroke="${b}" stroke-width="4" fill="none" stroke-dasharray="2 14" stroke-linecap="round" opacity=".8"/>
${mosque(270, 470, a === '#1F7A4D' ? '#2FA36B' : a, '#123326')}`,

  imlek: (a, b) => `
<circle cx="270" cy="250" r="215" fill="${b}" opacity=".25"/>
<path d="M40 40 Q270 110 500 40" stroke="${K}" stroke-width="5" fill="none"/>
${lampion(170, 60, 70, 1.05, a, b)}${lampion(360, 66, 150, 0.8, a, b)}
<g fill="#F2A7B8"><circle cx="70" cy="300" r="14"/><circle cx="92" cy="286" r="14"/><circle cx="92" cy="312" r="14"/><circle cx="58" cy="322" r="14"/></g><circle cx="78" cy="304" r="7" fill="${b}"/>
<g fill="#F2A7B8"><circle cx="460" cy="400" r="12"/><circle cx="478" cy="388" r="12"/><circle cx="478" cy="412" r="12"/></g><circle cx="470" cy="400" r="6" fill="${b}"/>
<path d="M30 340 Q90 330 130 360 M420 430 Q460 400 510 410" stroke="#6B3A2A" stroke-width="6" fill="none" stroke-linecap="round"/>`,

  nyepi: (a, b) => `
<circle cx="270" cy="250" r="225" fill="#1C1C22"/>
<circle cx="270" cy="150" r="70" fill="${b}"/>
${star(110, 120, 8, W)}${star(430, 100, 10, W)}${star(160, 230, 6, W)}${star(420, 230, 7, W)}
<g fill="${a === '#2F2F2F' ? '#3E3E46' : a}">
<path d="M90 470 L90 330 L104 330 L104 300 L118 300 L118 260 L134 260 L134 220 L150 220 L150 180 L170 160 L190 180 L190 220 L206 220 L206 260 L222 260 L222 300 L236 300 L236 470Z"/>
<path d="M450 470 L450 330 L436 330 L436 300 L422 300 L422 260 L406 260 L406 220 L390 220 L390 180 L370 160 L350 180 L350 220 L334 220 L334 260 L318 260 L318 300 L304 300 L304 470Z"/>
</g>
<rect x="60" y="466" width="420" height="16" rx="4" fill="${b}" opacity=".6"/>
<rect x="250" y="400" width="40" height="66" rx="4" fill="${b}" opacity=".35"/>`,

  idulfitri: (a, b) => `
<circle cx="270" cy="260" r="220" fill="${b}" opacity=".22"/>
${crescent(400, 110, 48, b)}
${mosque(230, 470, a, '#F6EDD7')}
<line x1="420" y1="170" x2="420" y2="250" stroke="${K}" stroke-width="4"/>
<g transform="translate(420 310) rotate(45)"><rect x="-56" y="-56" width="112" height="112" rx="10" fill="${a}"/>
<path d="M-56 -18 L56 -18 M-56 18 L56 18 M-18 -56 L-18 56 M18 -56 L18 56" stroke="${b}" stroke-width="12"/></g>
<path d="M405 386 L398 430 M435 386 L442 430" stroke="${a}" stroke-width="7" stroke-linecap="round"/>
${sparkle(90, 120, 16, b)}${sparkle(470, 440, 12, b)}`,

  jumatagung: (a, b) => `
<circle cx="270" cy="250" r="220" fill="${b}" opacity=".3"/>
<circle cx="270" cy="330" r="120" fill="${b}"/>
<path d="M40 470 Q270 300 500 470Z" fill="${a}"/>
<rect x="256" y="110" width="28" height="270" rx="4" fill="${K}"/><rect x="196" y="170" width="148" height="26" rx="4" fill="${K}"/>
<rect x="130" y="250" width="16" height="130" rx="3" fill="${K}" opacity=".55"/><rect x="104" y="284" width="68" height="14" rx="3" fill="${K}" opacity=".55"/>
<rect x="394" y="250" width="16" height="130" rx="3" fill="${K}" opacity=".55"/><rect x="368" y="284" width="68" height="14" rx="3" fill="${K}" opacity=".55"/>`,

  paskah: (a, b) => {
    let rays = '';
    for (let i = 0; i < 9; i++) rays += `<rect x="264" y="60" width="12" height="150" rx="6" fill="${b}" transform="rotate(${-80 + i * 20} 270 300)"/>`;
    return `
<circle cx="270" cy="260" r="220" fill="${b}" opacity=".18"/>
${rays}<circle cx="270" cy="300" r="96" fill="${b}"/>
<path d="M40 470 Q270 340 500 470Z" fill="${a}"/>
<rect x="258" y="170" width="24" height="200" rx="4" fill="${W}"/><rect x="214" y="214" width="112" height="22" rx="4" fill="${W}"/>
<g transform="translate(110 400)"><path d="M0 0 C-30 -40 -20 -80 0 -96 C20 -80 30 -40 0 0Z" fill="${W}"/><path d="M0 0 C-50 -20 -64 -50 -60 -70 C-30 -60 -10 -30 0 0Z" fill="${W}" opacity=".85"/><path d="M0 0 C50 -20 64 -50 60 -70 C30 -60 10 -30 0 0Z" fill="${W}" opacity=".85"/><rect x="-3" y="0" width="6" height="70" fill="#3E7B4F"/></g>
<g transform="translate(430 410) scale(.8)"><path d="M0 0 C-30 -40 -20 -80 0 -96 C20 -80 30 -40 0 0Z" fill="${W}"/><path d="M0 0 C-50 -20 -64 -50 -60 -70 C-30 -60 -10 -30 0 0Z" fill="${W}" opacity=".85"/><path d="M0 0 C50 -20 64 -50 60 -70 C30 -60 10 -30 0 0Z" fill="${W}" opacity=".85"/><rect x="-3" y="0" width="6" height="70" fill="#3E7B4F"/></g>`;
  },

  kartini: (a, b) => {
    let rays = '';
    for (let i = 0; i < 7; i++) rays += `<rect x="264" y="40" width="12" height="110" rx="6" fill="${b}" transform="rotate(${-60 + i * 20} 270 270)"/>`;
    return `
<circle cx="270" cy="260" r="220" fill="${b}" opacity=".3"/>
${rays}<circle cx="270" cy="270" r="80" fill="${b}"/>
<path d="M270 330 C220 300 140 300 90 320 L90 460 C140 440 220 440 270 470Z" fill="${W}"/>
<path d="M270 330 C320 300 400 300 450 320 L450 460 C400 440 320 440 270 470Z" fill="#F7F4FA"/>
<path d="M90 460 C140 440 220 440 270 470 C320 440 400 440 450 460 L450 476 C400 456 320 456 270 486 C220 456 140 456 90 476Z" fill="${a}"/>
<path d="M120 360 L240 368 M120 392 L240 400 M120 424 L220 430 M300 368 L420 360 M300 400 L420 392 M300 430 L400 424" stroke="#D9D3E2" stroke-width="6" stroke-linecap="round"/>
<path d="M410 250 L300 400" stroke="${K}" stroke-width="8" stroke-linecap="round"/><path d="M410 250 C440 200 480 190 500 170 C490 220 460 250 410 250Z" fill="${a}"/>
<g fill="${a}"><circle cx="100" cy="140" r="12"/><circle cx="118" cy="128" r="12"/><circle cx="118" cy="152" r="12"/><circle cx="88" cy="160" r="12"/><circle cx="84" cy="134" r="12"/></g><circle cx="102" cy="144" r="7" fill="${b}"/>`;
  },

  buruh: (a, b) => `
<circle cx="270" cy="260" r="215" fill="${a}" opacity=".12"/>
${gear(330, 300, 110, K, '#F4F1EE')}${gear(170, 200, 62, a, '#F4F1EE')}
<g transform="rotate(-35 200 380)"><rect x="186" y="300" width="28" height="190" rx="10" fill="#B07A45"/><rect x="140" y="262" width="120" height="52" rx="10" fill="${b === '#2B2B2B' ? '#5E5E66' : b}"/></g>
<path d="M110 120 C110 60 230 40 260 100 L262 120Z" fill="#F2B705"/><rect x="96" y="116" width="180" height="20" rx="8" fill="#F2B705"/><rect x="180" y="60" width="16" height="58" rx="6" fill="#D99E00"/>`,

  pendidikan: (a, b) => `
<circle cx="270" cy="260" r="215" fill="${b}" opacity=".22"/>
<path d="M270 90 L470 170 L270 250 L70 170Z" fill="${K}"/>
<path d="M160 210 L160 300 C200 340 340 340 380 300 L380 210 L270 252Z" fill="#2B2B33"/>
<path d="M470 170 L470 270" stroke="${b}" stroke-width="6"/><circle cx="470" cy="282" r="14" fill="${b}"/>
<rect x="110" y="400" width="320" height="36" rx="6" fill="${a}"/><rect x="130" y="364" width="290" height="36" rx="6" fill="${b}"/><rect x="100" y="436" width="340" height="36" rx="6" fill="${K}"/>
<rect x="400" y="364" width="6" height="36" fill="${W}" opacity=".5"/><rect x="140" y="436" width="6" height="36" fill="${W}" opacity=".4"/>
${sparkle(90, 110, 16, a)}${sparkle(470, 380, 12, a)}`,

  kenaikan: (a, b) => {
    let rays = '';
    for (let i = 0; i < 9; i++) rays += `<path d="M270 40 L${150 + i * 30} 470 L${165 + i * 30} 470Z" fill="${b}" opacity=".35"/>`;
    return `
<circle cx="270" cy="260" r="220" fill="${a}" opacity=".3"/>
${rays}<circle cx="270" cy="110" r="64" fill="${b}"/>
${cloud(90, 380, 1.2, W)}${cloud(300, 400, 1.05, W)}${cloud(200, 300, 0.75, '#F3F0FA')}
<path d="M262 80 L278 80 L278 98 L296 98 L296 114 L278 114 L278 150 L262 150 L262 114 L244 114 L244 98 L262 98Z" fill="${W}"/>
<g transform="translate(400 200)"><path d="M0 0 C20 -30 50 -30 60 -20 C40 -16 30 -6 24 6 C40 4 56 10 64 22 C40 24 16 16 0 0Z" fill="${W}"/><circle cx="-6" cy="-2" r="12" fill="${W}"/></g>`;
  },

  iduladha: (a, b) => `
<circle cx="270" cy="270" r="215" fill="${b}" opacity=".22"/>
${crescent(110, 110, 40, b)}
${mosque(352, 330, a, '#F6EDD7')}
<g transform="translate(180 360)">
<g fill="#F4F1EA"><circle cx="-60" cy="0" r="40"/><circle cx="-20" cy="-20" r="44"/><circle cx="30" cy="-16" r="44"/><circle cx="70" cy="4" r="38"/><circle cx="10" cy="20" r="46"/><circle cx="-40" cy="26" r="40"/></g>
<rect x="-50" y="50" width="16" height="64" rx="6" fill="${K}"/><rect x="-10" y="56" width="16" height="60" rx="6" fill="${K}"/><rect x="30" y="56" width="16" height="60" rx="6" fill="${K}"/><rect x="62" y="48" width="16" height="64" rx="6" fill="${K}"/>
<ellipse cx="112" cy="-14" rx="36" ry="44" fill="${K}"/><ellipse cx="84" cy="-40" rx="22" ry="10" fill="${K}" transform="rotate(-25 84 -40)"/>
<path d="M116 -54 C150 -80 160 -40 134 -36" stroke="#C9A24E" stroke-width="10" fill="none" stroke-linecap="round"/>
<circle cx="124" cy="-20" r="5" fill="${W}"/></g>
<rect x="40" y="470" width="460" height="12" rx="6" fill="${a}" opacity=".5"/>`,

  waisak: (a, b) => `
<circle cx="270" cy="250" r="225" fill="#2A1E3D"/>
<g fill="#4A3A63"><path d="M190 300 C190 230 350 230 350 300Z"/><rect x="262" y="190" width="16" height="50"/><path d="M250 196 L270 150 L290 196Z"/><rect x="150" y="300" width="240" height="22" rx="4"/><rect x="120" y="322" width="300" height="22" rx="4"/></g>
<g><ellipse cx="110" cy="150" rx="26" ry="30" fill="${b}"/><ellipse cx="110" cy="150" rx="14" ry="18" fill="#FFF3C4"/></g>
<g><ellipse cx="420" cy="110" rx="22" ry="26" fill="${b}"/><ellipse cx="420" cy="110" rx="12" ry="15" fill="#FFF3C4"/></g>
<g><ellipse cx="350" cy="70" rx="16" ry="19" fill="${b}"/><ellipse cx="350" cy="70" rx="8" ry="10" fill="#FFF3C4"/></g>
<g><ellipse cx="190" cy="80" rx="14" ry="17" fill="${b}"/><ellipse cx="190" cy="80" rx="7" ry="9" fill="#FFF3C4"/></g>
<g transform="translate(270 440)">
<path d="M0 0 C-30 -40 -24 -100 0 -130 C24 -100 30 -40 0 0Z" fill="${a}"/>
<path d="M0 0 C-60 -20 -86 -70 -80 -110 C-40 -90 -14 -50 0 0Z" fill="${a}" opacity=".85"/>
<path d="M0 0 C60 -20 86 -70 80 -110 C40 -90 14 -50 0 0Z" fill="${a}" opacity=".85"/>
<path d="M0 0 C-80 0 -130 -30 -140 -60 C-90 -60 -40 -40 0 0Z" fill="${b}"/>
<path d="M0 0 C80 0 130 -30 140 -60 C90 -60 40 -40 0 0Z" fill="${b}"/>
<ellipse cx="0" cy="8" rx="150" ry="14" fill="#3E7B4F"/></g>`,

  pancasila: (a, b) => {
    let rays = '';
    for (let i = 0; i < 12; i++) rays += `<rect x="264" y="40" width="12" height="70" rx="6" fill="${b}" transform="rotate(${i * 30} 270 250)"/>`;
    return `
<circle cx="270" cy="250" r="220" fill="${a}" opacity=".1"/>
${rays}<circle cx="270" cy="250" r="140" fill="${K}"/>
${star(270, 254, 100, b)}
<path d="M60 440 C160 400 200 470 270 440 C340 410 380 470 480 430 L480 470 C380 510 340 450 270 480 C200 510 160 440 60 480Z" fill="${a}"/>
<path d="M60 480 C160 440 200 510 270 480 C340 450 380 510 480 470 L480 500 C380 540 340 480 270 510 C200 540 160 470 60 510Z" fill="${W}" stroke="#E2E2E8" stroke-width="3"/>`;
  },

  tahunbaruislam: (a, b) => `
<circle cx="270" cy="250" r="225" fill="#123326"/>
${crescent(270, 210, 120, b)}
${star(330, 190, 30, b)}${star(130, 110, 10, W)}${star(430, 300, 9, W)}${star(110, 330, 7, W)}${star(420, 110, 7, W)}
${fanous(120, 30, 300, 0.75, a === '#1F7A4D' ? '#2FA36B' : a, '#FFE7A3')}
${fanous(430, 30, 330, 0.6, a === '#1F7A4D' ? '#2FA36B' : a, '#FFE7A3')}`,

  maulid: (a, b) => `
<circle cx="270" cy="260" r="220" fill="${b}" opacity=".22"/>
${fanous(140, 0, 80, 1, a, '#FFE7A3')}${fanous(270, 0, 40, 1.15, b, '#FFF3C4')}${fanous(400, 0, 110, 0.9, a, '#FFE7A3')}
<path d="M30 20 Q270 70 510 20" stroke="${K}" stroke-width="4" fill="none"/>
<g fill="${a}" opacity=".9"><path d="M70 470 L70 400 Q120 340 170 400 L170 470Z"/><path d="M220 470 L220 380 Q270 310 320 380 L320 470Z"/><path d="M370 470 L370 400 Q420 340 470 400 L470 470Z"/></g>
<rect x="40" y="466" width="460" height="16" rx="4" fill="${a}"/>
${sparkle(60, 230, 14, b)}${sparkle(480, 260, 12, b)}`,

  hutri: (a) => {
    let flags = '';
    for (let i = 0; i < 9; i++) {
      const x = 30 + i * 56;
      const y = 40 + Math.sin((i / 8) * Math.PI) * 50;
      flags += `<path d="M${x} ${y} L${x + 48} ${y + 4} L${x + 22} ${y + 54}Z" fill="${i % 2 ? W : a}" ${i % 2 ? 'stroke="#E2E2E8" stroke-width="2"' : ''}/>`;
    }
    return `
<circle cx="280" cy="290" r="200" fill="#F2B705" opacity=".2"/>
<path d="M20 40 Q270 140 520 40" stroke="${K}" stroke-width="3" fill="none"/>${flags}
<rect x="170" y="150" width="14" height="330" rx="5" fill="${K}"/><circle cx="177" cy="146" r="10" fill="#F2B705"/>
<path d="M184 164 C260 140 330 196 430 164 L430 238 C330 270 260 214 184 238Z" fill="${a}"/>
<path d="M184 238 C260 214 330 270 430 238 L430 312 C330 344 260 288 184 312Z" fill="${W}" stroke="#E2E2E8" stroke-width="3"/>
<rect x="120" y="470" width="120" height="16" rx="6" fill="${K}"/>
<text x="330" y="440" font-family="Georgia,serif" font-size="110" fill="${a}" text-anchor="middle">17</text>
${sparkle(470, 380, 18, '#F2B705')}`;
  },

  batik: (a, b) => {
    let tiles = '';
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const x = 70 + c * 76, y = 40 + r * 76;
        tiles += `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="-20" rx="14" ry="22" fill="${a}"/><ellipse cx="0" cy="20" rx="14" ry="22" fill="${a}"/><ellipse cx="-20" cy="0" rx="22" ry="14" fill="${a}"/><ellipse cx="20" cy="0" rx="22" ry="14" fill="${a}"/><circle cx="0" cy="0" r="6" fill="${b}"/><ellipse cx="0" cy="-20" rx="5" ry="10" fill="${b}"/><ellipse cx="0" cy="20" rx="5" ry="10" fill="${b}"/><ellipse cx="-20" cy="0" rx="10" ry="5" fill="${b}"/><ellipse cx="20" cy="0" rx="10" ry="5" fill="${b}"/></g>`;
      }
    }
    return `
<defs><clipPath id="batik-clip"><circle cx="270" cy="250" r="210"/></clipPath></defs>
<circle cx="270" cy="250" r="210" fill="#F6E7CF"/>
<g clip-path="url(#batik-clip)">${tiles}</g>
<circle cx="270" cy="250" r="210" fill="none" stroke="${a}" stroke-width="14"/>`;
  },

  sumpahpemuda: (a, b) => {
    const p = (x, body, head) => `<circle cx="${x}" cy="250" r="38" fill="${head}"/><path d="M${x - 58} 470 L${x - 58} 360 C${x - 58} 310 ${x + 58} 310 ${x + 58} 360 L${x + 58} 470Z" fill="${body}"/>`;
    return `
<circle cx="270" cy="260" r="215" fill="${b}" opacity=".22"/>
<rect x="262" y="40" width="12" height="160" rx="4" fill="${K}"/>
<path d="M274 50 C320 36 360 70 420 50 L420 96 C360 116 320 82 274 96Z" fill="${a}"/>
<path d="M274 96 C320 82 360 116 420 96 L420 142 C360 162 320 128 274 142Z" fill="${W}" stroke="#E2E2E8" stroke-width="3"/>
${p(140, a, K)}${p(270, K, K)}${p(400, b, K)}
<path d="M140 330 L60 250" stroke="${a}" stroke-width="30" stroke-linecap="round"/>
<path d="M400 330 L480 250" stroke="${b}" stroke-width="30" stroke-linecap="round"/>`;
  },
};

export const ART_LABELS = {
  pahlawan: 'Bambu runcing + bendera', guru: 'Papan tulis + buku', ibu: 'Ibu dan anak', natal: 'Pohon Natal',
  tahunbaru: 'Kembang api', isra: 'Masjid + bulan bintang', imlek: 'Lampion', nyepi: 'Candi bentar + bulan',
  idulfitri: 'Ketupat + masjid', jumatagung: 'Salib di bukit', paskah: 'Salib + matahari terbit + bunga lili',
  kartini: 'Buku terbuka + pena (Habis Gelap Terbitlah Terang)', buruh: 'Roda gigi + kunci + helm', pendidikan: 'Topi toga + buku',
  kenaikan: 'Awan + cahaya + merpati', iduladha: 'Domba + masjid', waisak: 'Teratai + lentera + stupa', pancasila: 'Bintang + pita merah putih',
  tahunbaruislam: 'Bulan sabit + lentera', maulid: 'Lentera + kubah', hutri: 'Bendera + umbul-umbul', batik: 'Motif kawung', sumpahpemuda: 'Tiga pemuda + bendera',
};

// Ilustrasi 520×520 ditaruh di kanan atas poster.
export function artSvg(key, a, b) {
  const fn = ART[key];
  return fn ? `<g transform="translate(440 40) scale(1.15)">${fn(a, b)}</g>` : '';
}
