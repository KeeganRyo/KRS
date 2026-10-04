# Review Card

Kartu NFC/QR dengan kode unik. Scan pertama membuka halaman aktivasi, scan berikutnya
diarahkan ke halaman review Google bisnis. Edit/reset lewat `/c/<kode>/edit` dengan PIN.

## Setup (sekali saja)

1. Supabase: buat project baru (gratis). Buka SQL Editor, jalankan `supabase/schema.sql`,
   lalu `supabase/seed.sql`.
2. Ambil `Project URL` dan `service_role key` dari Supabase (Project Settings > API).
   service_role key itu rahasia: jangan dipakai di frontend dan jangan di-commit ke GitHub.
3. Upload folder ini ke repo GitHub (private).
4. Vercel: New Project, import repo itu. Di Environment Variables isi
   `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`, lalu Deploy.
5. Pasang domain sendiri di Vercel (Settings > Domains).
6. Di folder `tools/`, jalankan (dengan domain asli):
   `python3 generate_qr_and_seed.py https://domainlu.com/c`
   Hasilnya QR PNG per kartu. Kode di `cards.csv` tidak berubah, jadi cocok dengan seed.sql.

## Pencarian bisnis (aktivasi dan edit)

Pemilik bisnis cukup menempel link Google Maps (termasuk link pendek `maps.app.goo.gl/...`),
atau mengetik nama bisnis, lalu memilih hasilnya. Server mengubahnya jadi link review otomatis.

- Tempel link Maps: tidak butuh API key.
- Cari dengan nama bisnis: butuh `GOOGLE_PLACES_API_KEY` (Google Cloud, aktifkan **Places API (New)**).
  Di Vercel isi di Environment Variables lalu Redeploy. Batasi key hanya ke Places API (New)
  dan pasang budget alert + quota harian di Google Cloud supaya biaya tidak melonjak.
- Tanpa key, fitur cari nama otomatis menampilkan pesan untuk menempel link Maps.

## Kartu baru

`python3 generate_qr_and_seed.py https://domainlu.com/c --new 20`
menambah 20 kode baru. Jalankan `seed.sql` yang baru di Supabase (kode lama di-skip).

## Per kartu

- Tulis `https://domainlu.com/c/<kode>` ke stiker NFC (NFC Tools), lalu lock read-only.
- Pasang QR dengan kode yang sama di akrilik. Cetak kode kecil di belakang akrilik.
- Tes tap NFC dan scan QR sebelum diserahkan.


## Keamanan

- PIN disimpan sebagai hash (scrypt), bukan teks asli.
- 5 kali salah PIN akan dikunci 15 menit.
- Tabel `cards` memakai RLS tanpa policy, jadi hanya server (service role) yang bisa akses.
- Link tujuan tidak lagi diketik manual. Server membuat sendiri link
  `https://search.google.com/local/writereview?placeid=<PlaceID>` dari Place ID yang valid,
  jadi pemilik bisnis tidak bisa mengisi URL sembarangan.
- Server hanya mau membuka link pengalih milik Google (maps.app.goo.gl, goo.gl, g.page, g.co),
  dan setiap redirect dicek ulang ke domain Google (mencegah SSRF).
