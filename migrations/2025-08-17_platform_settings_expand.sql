-- Expand or create platform_settings with comprehensive sections
-- Safe to run multiple times

create table if not exists public.platform_settings (
  id text primary key,
  platform_name text not null default 'SchoolConnect',
  contact_email text not null default 'contact@schoolconnect.cd',
  primary_color text default '#2563eb',
  support_url text,
  feature_flags jsonb default '{}'::jsonb,
  branding jsonb default '{}'::jsonb,           -- logo URLs, theme, color scheme
  security jsonb default '{}'::jsonb,           -- auth providers, 2FA, password policies, API keys metadata
  data_privacy jsonb default '{}'::jsonb,       -- GDPR/POPIA, retention, backup config
  access_control jsonb default '{}'::jsonb,     -- global permissions, role configs, RLS presets
  ai jsonb default '{}'::jsonb,                 -- AI toggles and model selections
  billing jsonb default '{}'::jsonb,            -- pricing plans, gateways, invoices config
  communication jsonb default '{}'::jsonb,      -- email templates, notifications, contact form options
  dashboards jsonb default '{}'::jsonb,         -- widget layouts per role
  updated_at timestamptz default now()
);

-- Add columns if table already exists
alter table public.platform_settings
  add column if not exists branding jsonb default '{}'::jsonb,
  add column if not exists security jsonb default '{}'::jsonb,
  add column if not exists data_privacy jsonb default '{}'::jsonb,
  add column if not exists access_control jsonb default '{}'::jsonb,
  add column if not exists ai jsonb default '{}'::jsonb,
  add column if not exists billing jsonb default '{}'::jsonb,
  add column if not exists communication jsonb default '{}'::jsonb,
  add column if not exists dashboards jsonb default '{}'::jsonb,
  add column if not exists updated_at timestamptz default now();

-- Ensure defaults exist on required columns even if table pre-existed without them
alter table public.platform_settings
  alter column platform_name set default 'SchoolConnect',
  alter column contact_email set default 'contact@schoolconnect.cd',
  alter column primary_color set default '#2563eb';

-- Backfill any NULLs for required columns to avoid NOT NULL violations
update public.platform_settings
set
  platform_name = coalesce(platform_name, 'SchoolConnect'),
  contact_email = coalesce(contact_email, 'contact@schoolconnect.cd'),
  primary_color = coalesce(primary_color, '#2563eb')
where id is not null;

-- Ensure singleton row exists (insert with explicit required values to avoid relying on defaults)
insert into public.platform_settings (id, platform_name, contact_email, primary_color, support_url)
values ('platform', 'SchoolConnect', 'contact@schoolconnect.cd', '#2563eb', 'https://schoolconnect.cd/support')
on conflict (id) do nothing;

-- Optional: RLS and policies (assumes an auth-enabled schema with profiles table and role column)
-- Uncomment and adjust according to your schema.
--
-- alter table public.platform_settings enable row level security;
-- drop policy if exists "platform_settings_ro" on public.platform_settings;
-- drop policy if exists "platform_settings_rw" on public.platform_settings;
-- create policy "platform_settings_ro" on public.platform_settings
--   for select using (true); -- everyone can read non-sensitive settings (adjust as needed)
-- create policy "platform_settings_rw" on public.platform_settings
--   for all using (exists (
--     select 1 from public.profiles p
--     where p.id = auth.uid() and p.role = 'platform_admin'
--   ));
