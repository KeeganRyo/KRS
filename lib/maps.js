// Aman dipakai di browser dan server (tanpa import server).

// Teks yang terlihat seperti link (tanpa spasi, ada domain).
export const looksLikeUrl = (q) =>
  !/\s/.test(String(q)) && /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/|\?|$)/i.test(String(q).trim());

// Untuk pemilik bisnis mengecek apakah bisnisnya benar.
export const mapsViewUrl = (placeId) =>
  `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(placeId)}`;
