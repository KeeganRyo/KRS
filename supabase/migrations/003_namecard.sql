-- KR Solutions: kartu nama digital.
-- Aman dijalankan berulang kali. Jalankan di Supabase SQL Editor SEBELUM deploy kode baru.

-- Jenis fisik kartu, diisi saat kode dibuat: 'board' (papan review) atau 'namecard' (kartu nama).
-- Hanya menentukan pilihan awal di halaman aktivasi; kosong = papan.
alter table cards add column if not exists kind text;

-- Isi kartu nama (nama, jabatan, kontak, sosmed). Dipakai kalau target_type = 'profile'.
-- Disimpan terpisah dari target_value supaya tidak hilang kalau tujuan sempat diganti.
alter table cards add column if not exists profile jsonb;

-- Contoh membuat kode kartu nama baru:
--   insert into cards (code, kind) values ('NC0001', 'namecard');
