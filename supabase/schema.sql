create table if not exists cards (
  code text primary key,
  status text not null default 'unactivated',
  business_name text,
  google_url text,
  pin_hash text,
  scans int not null default 0,
  failed_attempts int not null default 0,
  locked_until timestamptz,
  activated_at timestamptz,
  created_at timestamptz not null default now()
);

alter table cards enable row level security;
