-- KR Solutions: daftar prospek (usaha yang mau/sudah dihubungi lewat WA), dikelola dari /admin/prospek.
-- Aman dijalankan berulang kali. Jalankan di Supabase SQL Editor SEBELUM deploy kode baru.
-- Tidak mengubah tabel cards.

create table if not exists prospects (
  id bigint generated always as identity primary key,
  -- Kunci anti-dobel: nomor HP (hanya angka, format 62...) atau nama huruf kecil kalau tidak ada nomor.
  key text not null unique,
  name text not null,
  area text,
  city text,
  category text,
  address text,
  phone text,
  instagram text,
  rating numeric,
  reviews integer,
  maps_url text,
  lat double precision,
  lng double precision,
  -- baru | chat | balas | follow | tertarik | beli | tolak | diam
  status text not null default 'baru',
  note text,
  batch text,
  contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prospects_status_idx on prospects (status);

-- Hanya server (service role) yang boleh baca/tulis; tidak ada akses publik.
alter table prospects enable row level security;
