-- KR Solutions: invoice (tagihan dan lunas), dikelola dari /admin/invoice.
-- Aman dijalankan berulang kali. Jalankan di Supabase SQL Editor SEBELUM deploy kode baru.
-- Tidak mengubah tabel lain.

create table if not exists invoices (
  id bigint generated always as identity primary key,
  -- INV-KRS-YYYYMMDD-NNN (NNN urut terus, tidak reset per hari).
  number text not null unique,
  issued_on date not null,
  buyer text not null,
  buyer_phone text,
  -- [{ "name": "...", "detail": "...", "qty": 2, "amount": 120000 }], amount = jumlah per baris.
  items jsonb not null default '[]'::jsonb,
  discount integer not null default 0,
  discount_note text,
  note text,
  -- unpaid | paid | void
  status text not null default 'unpaid',
  paid_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invoices_issued_idx on invoices (issued_on desc);

-- Hanya server (service role) yang boleh baca/tulis; tidak ada akses publik.
alter table invoices enable row level security;

-- Riwayat invoice yang sudah dibuat manual sebelum halaman ini ada.
insert into invoices (number, issued_on, buyer, items, discount, discount_note, status, paid_on) values
  ('INV-KRS-20261020-001', '2026-10-20', 'The Clean Bar',
    '[{"name":"Papan Review Google NFC + QR","detail":"Paket 2 pcs · akrilik cetak UV, desain custom","qty":2,"amount":100000}]', 0, null, 'paid', '2026-10-20'),
  ('INV-KRS-20261022-002', '2026-10-22', 'Podjok Kopi',
    '[{"name":"Papan Review Google NFC + QR","detail":"Paket 2 pcs · akrilik cetak UV, desain custom","qty":2,"amount":100000}]', 0, null, 'paid', '2026-10-22'),
  ('INV-KRS-20261023-003', '2026-10-23', 'Bakso Pak Diran',
    '[{"name":"Papan Review Google NFC + QR","detail":"1 pcs · akrilik cetak UV, desain custom","qty":1,"amount":65000}]', 0, null, 'unpaid', null),
  ('INV-KRS-20261029-004', '2026-10-29', '3SEEDS Eatery Dessert Coffee',
    '[{"name":"Papan Review Google NFC + QR","detail":"Paket 2 pcs · akrilik cetak UV, desain custom","qty":2,"amount":120000},{"name":"Papan Review Google NFC + QR","detail":"1 pcs · akrilik cetak UV, desain custom","qty":1,"amount":70000}]',
    40000, 'Post IG story + tag @krsolutions.id', 'paid', '2026-10-29')
on conflict (number) do nothing;
