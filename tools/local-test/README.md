# Tes lokal tanpa Supabase asli

Postgres dijalankan di dalam Node (PGlite), jadi database produksi tidak tersentuh.

```
cd tools/local-test
npm install
npm run sql        # tes semua fungsi SQL di supabase/migrations
npm run db         # database tiruan + API mirip Supabase di http://127.0.0.1:54321
```

Lalu, di terminal lain dari folder root repo, jalankan app ke database tiruan itu
(PowerShell):

```
$env:SUPABASE_URL='http://127.0.0.1:54321'
$env:SUPABASE_SERVICE_ROLE_KEY='local-test-key-not-real'
$env:ADMIN_PASSWORD='local-admin-test-pass-2026'
npx next dev -p 3100
```

Kartu tes yang tersedia: `TEST01`, `TEST02`, `TEST03` (belum aktif) plus kode dari `supabase/seed.sql`.
Data hilang setiap `npm run db` dijalankan ulang. Pencarian bisnis Google tidak bisa dites di sini
(butuh `GOOGLE_PLACES_API_KEY`); pakai tujuan Instagram/WhatsApp/link untuk tes alur.
`fake-postgrest.mjs` hanya meniru bagian API Supabase yang dipakai app ini.
