-- 0002 — Group line items by receipt.
-- Receipts represent a single scanned/uploaded receipt that may contain
-- many purchased items. Each `purchases` row optionally points back to a
-- receipt so you can drill into "what did I buy at Walmart on the 3rd?"

create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  merchant text,
  order_date date not null,
  total_cents integer not null default 0 check (total_cents >= 0),
  currency text not null default 'USD',
  receipt_path text,
  created_at timestamptz not null default now()
);

create index if not exists receipts_user_order_date_idx
  on receipts (user_id, order_date desc);
create index if not exists receipts_user_merchant_idx
  on receipts (user_id, merchant);

alter table receipts enable row level security;
drop policy if exists "own receipts" on receipts;
create policy "own receipts" on receipts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table purchases
  add column if not exists receipt_id uuid references receipts(id) on delete set null,
  add column if not exists quantity integer not null default 1 check (quantity >= 1);

create index if not exists purchases_receipt_idx
  on purchases (receipt_id) where receipt_id is not null;
create index if not exists purchases_user_merchant_idx
  on purchases (user_id, merchant);
