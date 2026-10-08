# KR Solutions: website + Review Card

Landing page krsolutions.tech dan aplikasi kartu NFC/QR. Setiap kartu punya kode unik.
Scan pertama membuka halaman aktivasi; scan berikutnya langsung membuka tujuan kartu
(review Google, Instagram, TikTok, WhatsApp, atau link menu). Pemilik kartu bisa mengganti
tujuan dan melihat statistik scan di `/c/<kode>/edit` dengan PIN. Admin mengelola semua kartu di `/admin`.

## Setup (sekali saja)

1. Supabase: buat project. Di SQL Editor jalankan berurutan `supabase/schema.sql`,
   `supabase/migrations/002_upgrade.sql`, lalu `supabase/seed.sql`.
2. Ambil `Project URL` dan `service_role key` (Project Settings > API).
   service_role key itu rahasia: jangan dipakai di frontend dan jangan di-commit.
3. Vercel: import repo, isi Environment Variables, lalu Deploy:

| Variable | Wajib | Isi |
|---|---|---|
| `SUPABASE_URL` | ya | Project URL Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ya | service_role key |
| `ADMIN_PASSWORD` | untuk `/admin` | Password admin, minimal 16 karakter acak |
| `GOOGLE_PLACES_API_KEY` | opsional | Cari bisnis dengan nama (Places API (New)) |
| `PUBLIC_BASE_URL` | opsional | Domain untuk QR dan metadata, mis. `https://krsolutions.tech` |
| `SESSION_SECRET` | opsional | Kunci cookie sesi. Kalau kosong, diturunkan dari service role key |

## Upgrade database yang sudah berjalan

Jalankan `supabase/migrations/002_upgrade.sql` di SQL Editor **sebelum** deploy kode baru.
File itu aman dijalankan berulang kali dan memindahkan kartu lama (review Google) ke format baru.

## Kartu baru

- Dari dashboard: `/admin` > Kartu baru > Buat kode, lalu klik **QR** di tabel untuk download QR (SVG).
- Atau dengan script, dari dalam folder `tools/`:
  `python3 generate_qr_and_seed.py https://krsolutions.tech/c --new 20`, lalu jalankan `seed.sql` yang baru di Supabase.

Per kartu: tulis `https://krsolutions.tech/c/<kode>` ke stiker NFC (NFC Tools) lalu lock read-only,
pasang QR yang sama di akrilik, cetak kode kecil di belakang, dan tes tap + scan sebelum diserahkan.

## Pencarian bisnis (tujuan review)

- Tempel link Google Maps (termasuk `maps.app.goo.gl/...`): tidak butuh API key.
- Cari dengan nama: butuh `GOOGLE_PLACES_API_KEY`. Batasi key ke Places API (New) dan pasang
  budget alert + quota harian di Google Cloud.
- Pencarian hanya boleh untuk kartu yang belum aktif atau yang sudah dibuka dengan PIN,
  dan dibatasi 60 pencarian per 10 menit per IP, supaya kuota tidak dihabiskan orang lain.

## Keamanan

- PIN disimpan sebagai hash scrypt. Pemilik harus mengetik PIN dua kali saat aktivasi.
- Batas percobaan PIN atomik di database (`claim_pin_attempt`): jatah percobaan diambil sebelum
  PIN dicek, jadi permintaan paralel tidak bisa melewati batas. 5 kali salah = kunci 15 menit,
  berlipat dua setiap terkunci lagi (maks ±16 jam). Admin bisa membuka kunci dan reset PIN.
- Setelah PIN benar, sesi edit disimpan di cookie HttpOnly bertanda tangan selama 20 menit.
- Throttle per IP untuk percobaan PIN, aktivasi, pencarian bisnis, dan login admin.
- URL tujuan selalu dibentuk server dari input terstruktur (Place ID, username, nomor WA, atau
  link https yang divalidasi). Skema berbahaya seperti `javascript:` ditolak.
- Server hanya mengikuti link pengalih Google (maps.app.goo.gl, goo.gl, g.page, g.co), dan setiap
  redirect dicek ulang ke domain Google (mencegah SSRF).
- Semua tabel memakai RLS tanpa policy, dan fungsi database hanya bisa dipanggil `service_role`.
- Form dikirim sebagai POST walaupun JavaScript belum dimuat, jadi PIN tidak pernah masuk URL.
