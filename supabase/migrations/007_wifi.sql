-- KR Solutions: WiFi tamu (tujuan kartu 'wifi', halaman /w/KODE).
-- Aman dijalankan berulang kali. Jalankan di Supabase SQL Editor SEBELUM deploy kode baru.

-- Isi halaman WiFi: nama tempat, nama WiFi (SSID), password, dan info tambahan opsional
-- (WA resepsionis, link review, beberapa baris info seperti jam sarapan).
-- Disimpan terpisah dari profile dan menu supaya tidak saling menimpa.
alter table cards add column if not exists wifi jsonb;

-- Contoh membuat kode papan WiFi baru (satu kode bisa dipakai untuk semua kamar):
--   insert into cards (code, kind) values ('ABC123', 'wifi');
