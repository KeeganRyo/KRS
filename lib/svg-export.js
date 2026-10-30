// Ubah SVG jadi PNG / unduh file, di browser. Dipakai /admin/desain dan /admin/invoice.

// Font Poppins disisipkan ke SVG yang diunduh/diubah jadi PNG (SVG sebagai gambar tidak bisa
// memakai font halaman). Diambil sekali dari /public/fonts.
let fontCssPromise;
export function fontCss() {
  if (!fontCssPromise) {
    const b64 = async (w) => {
      const buf = await (await fetch(`/fonts/poppins-${w}.woff2`)).arrayBuffer();
      let s = '';
      new Uint8Array(buf).forEach((c) => { s += String.fromCharCode(c); });
      return `@font-face{font-family:Poppins;font-weight:${w};src:url(data:font/woff2;base64,${btoa(s)}) format('woff2')}`;
    };
    fontCssPromise = Promise.all([400, 500, 600].map(b64)).then((x) => x.join(''));
  }
  return fontCssPromise;
}

export async function svgToPngBlob(svg, w, h) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    return await new Promise((r) => c.toBlob(r, 'image/png'));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function download(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
