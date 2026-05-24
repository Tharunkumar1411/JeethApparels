-- Migration 002: add owner_name column.
-- Safe to re-run. Paste into the Supabase SQL editor.

alter table public.merchants
  add column if not exists owner_name text not null default '';
