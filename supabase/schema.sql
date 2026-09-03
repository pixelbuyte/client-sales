-- HVAC lead-recovery schema
-- Apply in Supabase SQL editor. Requires pgcrypto for gen_random_uuid()/gen_random_bytes().
create extension if not exists pgcrypto;

-- Drop the previous product's tables (Purchase Ping). Confirmed no real user
-- data exists in this project, so this is a clean cutover rather than a
-- migration.
drop table if exists reminders cascade;
drop table if exists purchases cascade;
drop table if exists receipts cascade;
drop table if exists categories cascade;
drop table if exists billing_events cascade;
drop table if exists profiles cascade;
drop function if exists public.handle_new_user cascade;
drop function if exists public.sync_reminders cascade;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- 1. Shops ---------------------------------------------------------------
-- One row per HVAC shop prospect/customer, tracking the funnel:
-- prospect -> demo_booked -> attended -> payment_link_sent -> paid -> live -> subscription_active
create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  service_area text,
  source text,

  stage text not null default 'prospect' check (
    stage in ('prospect','demo_booked','attended','payment_link_sent','paid','live','subscription_active')
  ),

  -- Opaque token for the public /pay/[token] URL so it never exposes the
  -- internal uuid.
  pay_token text unique not null default encode(gen_random_bytes(16), 'hex'),

  stripe_customer_id text,
  stripe_setup_checkout_session_id text,
  stripe_setup_payment_intent_id text,
  stripe_subscription_id text,

  -- Kept separate from `stage` so billing churn/failure states don't have
  -- to violate the locked funnel enum above.
  subscription_status text check (subscription_status in ('active','past_due','canceled')),

  refunded boolean not null default false,
  refunded_at timestamptz,

  setup_paid_at timestamptz,
  live_at timestamptz,
  subscription_started_at timestamptz,

  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shops_stage_idx on shops (stage);
create index if not exists shops_stripe_customer_idx on shops (stripe_customer_id) where stripe_customer_id is not null;
-- Looked up by the Stripe webhook to attribute a Payment Link payment (one
-- with no shop_id metadata) to an existing shop by email. Emails are stored
-- lowercased by every insert path, so a plain btree index is enough.
create index if not exists shops_contact_email_idx on shops (contact_email) where contact_email is not null;

drop trigger if exists shops_touch on shops;
create trigger shops_touch
  before update on shops
  for each row execute function public.touch_updated_at();

-- 2. Payment events --------------------------------------------------------
-- Raw Stripe webhook event log, keyed for idempotency.
create table if not exists payment_events (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete set null,
  stripe_event_id text unique not null,
  type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists payment_events_shop_idx on payment_events (shop_id);

-- 3. Row Level Security ------------------------------------------------------
-- This is a single-admin internal tool, not multi-tenant: all reads/writes
-- go through server actions using the service-role client
-- (lib/supabase/admin.ts), which bypasses RLS. RLS is enabled with no
-- policies on both tables so the anon/authenticated roles (used by the
-- browser client) can never read or write shop or payment data directly.
alter table shops enable row level security;
alter table payment_events enable row level security;
