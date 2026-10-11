-- KR Solutions: foto profil kartu nama.
-- Aman dijalankan berulang kali. Jalankan di Supabase SQL Editor SEBELUM deploy kode baru.

-- Bucket publik: foto bisa dibuka lewat URL (halaman kartu nama memang publik), tapi daftar
-- isi bucket tidak bisa dilihat karena tidak ada policy SELECT di storage.objects.
-- Upload dan hapus hanya lewat server (service_role), yang memang melewati RLS.
-- Server hanya menerima JPEG hingga 400 KB; batas di bawah ini lapisan pengaman kedua.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 512000, array['image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
