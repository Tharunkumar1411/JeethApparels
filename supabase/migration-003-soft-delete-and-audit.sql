-- Migration 003: add updated_at + trigger, voter_id_doc column,
-- partial unique index on mobile for active stores only.
-- Safe to re-run. Paste into the Supabase SQL editor.

-- 1. New columns -------------------------------------------------------------
alter table public.merchants
  add column if not exists updated_at   timestamptz not null default now(),
  add column if not exists voter_id_doc text;

-- 2. updated_at trigger ------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists merchants_set_updated_at on public.merchants;

create trigger merchants_set_updated_at
  before update on public.merchants
  for each row execute function public.set_updated_at();

-- 3. Partial unique index: mobile must be unique among ACTIVE stores ---------
-- An inactive store with a given mobile does not block a new active store
-- with the same mobile (re-onboarding scenario).
create unique index if not exists merchants_mobile_active_unique
  on public.merchants (mobile)
  where status = true;
