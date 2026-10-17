-- KR Solutions: nomor HP pemilik kartu, untuk fitur "Lupa kode kartu".
-- Aman dijalankan berulang kali. Jalankan di Supabase SQL Editor SEBELUM deploy kode baru.

-- Nomor disimpan dalam format 62xxxxxxxxxx (sama seperti nomor WhatsApp di kartu).
-- Tidak pernah tampil di halaman publik; hanya dipakai server untuk mencari kode kartu.
alter table cards add column if not exists owner_phone text;
create index if not exists cards_owner_phone_idx on cards (owner_phone) where owner_phone is not null;

-- Admin: tampilkan nomor pemilik dan bisa dicari pakai nomor HP.
-- Tipe hasil berubah, jadi fungsi lama dihapus dulu.
drop function if exists admin_cards(text);
create function admin_cards(p_q text)
returns table (code text, status text, business_name text, target_type text, target_url text,
               scans int, last_30 int, last_scan_at timestamptz, locked_until timestamptz,
               activated_at timestamptz, created_at timestamptz, owner_phone text)
language sql stable as $$
  select c.code, c.status, c.business_name, coalesce(c.target_type, case when c.google_url is not null then 'review' end),
         coalesce(c.target_url, c.google_url), c.scans,
         (select count(*)::int from card_scans s where s.code = c.code and s.at > now() - interval '30 days'),
         c.last_scan_at, c.locked_until, c.activated_at, c.created_at, c.owner_phone
    from cards c
   where coalesce(p_q, '') = ''
      or c.code ilike '%' || p_q || '%'
      or c.business_name ilike '%' || p_q || '%'
      -- Nomor HP: 0812... dan +62 812... sama-sama ketemu.
      or (length(regexp_replace(p_q, '\D', '', 'g')) >= 6
          and c.owner_phone like '%' || regexp_replace(regexp_replace(p_q, '\D', '', 'g'), '^(0|62)', '') || '%')
   order by c.activated_at desc nulls last, c.created_at desc
   limit 500;
$$;

revoke all on function admin_cards(text) from public, anon, authenticated;
grant execute on function admin_cards(text) to service_role;
