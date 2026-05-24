-- Migration 001: add address/pincode, document columns, and storage bucket.
-- Safe to re-run. Paste into the Supabase SQL editor.

-- 1. New columns on merchants -------------------------------------------------
alter table public.merchants
  add column if not exists address       text not null default '',
  add column if not exists pincode       text not null default '',
  add column if not exists store_image_1 text,
  add column if not exists store_image_2 text,
  add column if not exists pan_doc       text,
  add column if not exists aadhaar_doc   text,
  add column if not exists gst_doc       text;

-- 2. Private storage bucket for merchant documents ---------------------------
insert into storage.buckets (id, name, public)
values ('merchant-docs', 'merchant-docs', false)
on conflict (id) do nothing;

drop policy if exists "Admins can read merchant docs"   on storage.objects;
drop policy if exists "Admins can upload merchant docs" on storage.objects;
drop policy if exists "Admins can update merchant docs" on storage.objects;
drop policy if exists "Admins can delete merchant docs" on storage.objects;

create policy "Admins can read merchant docs"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'merchant-docs');

create policy "Admins can upload merchant docs"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'merchant-docs');

create policy "Admins can update merchant docs"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'merchant-docs');

create policy "Admins can delete merchant docs"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'merchant-docs');
