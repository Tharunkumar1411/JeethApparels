# Merchant Admin Panel

Internal admin tool for managing merchants and generating referral codes.

**Stack:** React 18 · Vite · Material UI v6 · React Router v6 · React Query v5 · React Hook Form · Supabase

## Quick start

```bash
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

App runs at http://localhost:5173.

## Supabase setup

Create a `merchants` table:

```sql
create table merchants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  business_name text,
  status text not null default 'active',
  referral_code text unique,
  created_at timestamptz not null default now()
);

alter table merchants enable row level security;

-- Allow any authenticated user (admin) full access. Tighten as needed.
create policy "admins full access"
  on merchants for all
  to authenticated
  using (true)
  with check (true);
```

Create at least one admin user from the Supabase dashboard (Authentication → Users → Add user) — that's the login.

## Folder structure

```
src/
  pages/         Route screens (Login, MerchantList, AddMerchant, MerchantDetail)
  components/    Reusable UI (ProtectedLayout, PageHeader, StatusChip)
  services/      Supabase client + data access (supabase, auth, merchants)
  hooks/         React Query hooks + useAuth
  utils/         Helpers + constants (referralCode, ROUTES)
  routes/        AppRoutes + ProtectedRoute
  theme/         MUI theme
```

See `CLAUDE.md` for project conventions.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
