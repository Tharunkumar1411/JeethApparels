-- Merchant Management MVP — Supabase schema
-- Paste into the Supabase SQL editor and run.

-- 1. Extensions ---------------------------------------------------------------
create extension if not exists "pgcrypto";

-- 2. Table --------------------------------------------------------------------
create table if not exists public.merchants (
  id              uuid        primary key default gen_random_uuid(),
  store_name      text        not null,
  mobile          text        not null,
  city            text        not null,
  state           text        not null,
  email           text,
  description     text,
  referral_code   text        not null,
  status          boolean     not null default true,
  created_at      timestamptz not null default now(),

  constraint merchants_referral_code_key unique (referral_code)
);

-- Helpful index for status filters on the admin list view
create index if not exists merchants_status_idx      on public.merchants (status);
create index if not exists merchants_created_at_idx  on public.merchants (created_at desc);

-- 3. Row Level Security -------------------------------------------------------
alter table public.merchants enable row level security;

-- 4. Policies -----------------------------------------------------------------
-- MVP rule: any authenticated user (treated as an admin) has full access.
-- Tighten this later by checking a role claim or an `admins` table.

drop policy if exists "Admins can read merchants"   on public.merchants;
drop policy if exists "Admins can insert merchants" on public.merchants;
drop policy if exists "Admins can update merchants" on public.merchants;
drop policy if exists "Admins can delete merchants" on public.merchants;

create policy "Admins can read merchants"
  on public.merchants
  for select
  to authenticated
  using (true);

create policy "Admins can insert merchants"
  on public.merchants
  for insert
  to authenticated
  with check (true);

create policy "Admins can update merchants"
  on public.merchants
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Admins can delete merchants"
  on public.merchants
  for delete
  to authenticated
  using (true);
