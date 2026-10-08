-- KR Solutions: upgrade kartu (tujuan selain review, statistik scan, PIN atomik, throttle).
-- Aman dijalankan berulang kali. Jalankan di Supabase SQL Editor SEBELUM deploy kode baru.

-- 1. Kolom baru di cards ---------------------------------------------------------------
alter table cards add column if not exists target_type text;   -- review | instagram | whatsapp | tiktok | link
alter table cards add column if not exists target_value text;  -- Place ID / username / nomor / URL
alter table cards add column if not exists target_url text;    -- URL akhir yang dibuka saat tap
alter table cards add column if not exists lockouts int not null default 0;
alter table cards add column if not exists last_scan_at timestamptz;

-- Kartu lama: pindahkan google_url ke kolom tujuan baru.
update cards
   set target_type = 'review',
       target_url = google_url,
       target_value = substring(google_url from 'placeid=([^&]+)')
 where target_url is null and google_url is not null;

-- Masa transisi: kode lama hanya menulis google_url. Trigger ini menyalin perubahan itu ke
-- kolom tujuan baru, supaya aktivasi/edit lewat kode lama tidak hilang setelah kode baru live.
-- Kode baru selalu mengubah target_url sendiri, jadi trigger tidak ikut campur.
create or replace function cards_sync_legacy()
returns trigger language plpgsql as $$
begin
  if new.google_url is not null
     and new.google_url is distinct from old.google_url
     and new.target_url is not distinct from old.target_url then
    new.target_type := 'review';
    new.target_url := new.google_url;
    new.target_value := substring(new.google_url from 'placeid=([^&]+)');
  end if;
  return new;
end $$;
drop trigger if exists cards_sync_legacy on cards;
create trigger cards_sync_legacy before update on cards
  for each row execute function cards_sync_legacy();

-- 2. Riwayat scan (untuk statistik per hari) -------------------------------------------
create table if not exists card_scans (
  id bigserial primary key,
  code text not null references cards(code) on delete cascade,
  at timestamptz not null default now()
);
create index if not exists card_scans_code_at on card_scans (code, at desc);
alter table card_scans enable row level security;

-- 3. Throttle sederhana (per IP / per kunci) -------------------------------------------
create table if not exists throttle (
  key text primary key,
  hits int not null,
  window_start timestamptz not null
);
alter table throttle enable row level security;

-- 4. Fungsi ---------------------------------------------------------------------------

-- Tap kartu: tambah scan secara atomik dan kembalikan URL tujuan (null kalau belum aktif).
create or replace function card_hit(p_code text)
returns text language plpgsql as $$
declare v_url text;
begin
  update cards
     set scans = scans + 1, last_scan_at = now()
   where code = p_code and status = 'active' and coalesce(target_url, google_url) is not null
  returning coalesce(target_url, google_url) into v_url;
  if v_url is not null then
    insert into card_scans (code) values (p_code);
  end if;
  return v_url;
end $$;

-- Ambil "jatah" satu percobaan PIN SEBELUM PIN dicek. Baris dikunci per update, jadi
-- permintaan paralel tidak bisa melewati batas. Setelah p_max percobaan, kartu dikunci
-- p_base_minutes menit, dan durasinya berlipat dua setiap kali terkunci lagi (maks 64x).
-- Tidak mengembalikan baris kalau kartu sedang terkunci atau tidak aktif.
create or replace function claim_pin_attempt(p_code text, p_max int, p_base_minutes int)
returns table (pin_hash text, attempts int) language plpgsql as $$
begin
  return query
  with cur as (
    select c.code,
           case when c.locked_until is not null and c.locked_until <= now() then 1
                else c.failed_attempts + 1 end as n
      from cards c
     where c.code = p_code and c.status = 'active'
       and (c.locked_until is null or c.locked_until <= now())
       for update
  )
  update cards c
     set failed_attempts = cur.n,
         locked_until = case when cur.n >= p_max
                             then now() + make_interval(mins => p_base_minutes * power(2, least(c.lockouts, 6))::int)
                             else null end,
         lockouts = case when cur.n >= p_max then c.lockouts + 1 else c.lockouts end
    from cur
   where c.code = cur.code
  returning c.pin_hash, c.failed_attempts;
end $$;

-- Throttle: true kalau masih di bawah batas dalam jendela waktu.
create or replace function throttle_hit(p_key text, p_max int, p_window_seconds int)
returns boolean language plpgsql as $$
declare v_hits int;
begin
  insert into throttle as t (key, hits, window_start) values (p_key, 1, now())
  on conflict (key) do update
     set hits = case when t.window_start < now() - make_interval(secs => p_window_seconds) then 1 else t.hits + 1 end,
         window_start = case when t.window_start < now() - make_interval(secs => p_window_seconds) then now() else t.window_start end
  returning hits into v_hits;
  if random() < 0.01 then
    delete from throttle where window_start < now() - interval '1 day';
  end if;
  return v_hits <= p_max;
end $$;

-- Statistik satu kartu.
create or replace function card_stats(p_code text)
returns table (total int, last_7 int, last_30 int, last_at timestamptz) language sql stable as $$
  select c.scans,
         (select count(*)::int from card_scans s where s.code = p_code and s.at > now() - interval '7 days'),
         (select count(*)::int from card_scans s where s.code = p_code and s.at > now() - interval '30 days'),
         c.last_scan_at
    from cards c where c.code = p_code;
$$;

-- Jumlah scan per hari (zona waktu Jakarta), termasuk hari dengan 0 scan.
create or replace function card_daily(p_code text, p_days int)
returns table (day date, n int) language sql stable as $$
  with days as (
    select generate_series((now() at time zone 'Asia/Jakarta')::date - (p_days - 1),
                           (now() at time zone 'Asia/Jakarta')::date, interval '1 day')::date as day
  )
  select d.day, count(s.id)::int
    from days d
    left join card_scans s on s.code = p_code and (s.at at time zone 'Asia/Jakarta')::date = d.day
   group by d.day order by d.day;
$$;

-- Daftar kartu untuk dashboard admin.
create or replace function admin_cards(p_q text)
returns table (code text, status text, business_name text, target_type text, target_url text,
               scans int, last_30 int, last_scan_at timestamptz, locked_until timestamptz,
               activated_at timestamptz, created_at timestamptz)
language sql stable as $$
  select c.code, c.status, c.business_name, coalesce(c.target_type, case when c.google_url is not null then 'review' end),
         coalesce(c.target_url, c.google_url), c.scans,
         (select count(*)::int from card_scans s where s.code = c.code and s.at > now() - interval '30 days'),
         c.last_scan_at, c.locked_until, c.activated_at, c.created_at
    from cards c
   where coalesce(p_q, '') = ''
      or c.code ilike '%' || p_q || '%'
      or c.business_name ilike '%' || p_q || '%'
   order by c.activated_at desc nulls last, c.created_at desc
   limit 500;
$$;

-- 5. Hak akses: fungsi hanya untuk server (service_role), tidak lewat anon key. -------
revoke all on function card_hit(text) from public, anon, authenticated;
revoke all on function claim_pin_attempt(text, int, int) from public, anon, authenticated;
revoke all on function throttle_hit(text, int, int) from public, anon, authenticated;
revoke all on function card_stats(text) from public, anon, authenticated;
revoke all on function card_daily(text, int) from public, anon, authenticated;
revoke all on function admin_cards(text) from public, anon, authenticated;
grant execute on function card_hit(text) to service_role;
grant execute on function claim_pin_attempt(text, int, int) to service_role;
grant execute on function throttle_hit(text, int, int) to service_role;
grant execute on function card_stats(text) to service_role;
grant execute on function card_daily(text, int) to service_role;
grant execute on function admin_cards(text) to service_role;
