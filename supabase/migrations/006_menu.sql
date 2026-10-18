-- KR Solutions: menu digital (tujuan kartu 'menu', halaman /m/KODE).
-- Aman dijalankan berulang kali. Jalankan di Supabase SQL Editor SEBELUM deploy kode baru.

-- Isi menu: nama tempat, jam buka, nama Wi-Fi, kategori, item (nama, keterangan, harga, label, foto).
-- Disimpan terpisah dari profile supaya kartu nama dan menu tidak saling menimpa.
-- Foto menu disimpan di bucket 'avatars' yang sudah ada (folder KODE/menu/).
alter table cards add column if not exists menu jsonb;

-- Contoh membuat kode papan menu baru:
--   insert into cards (code, kind) values ('ABC123', 'menu');
