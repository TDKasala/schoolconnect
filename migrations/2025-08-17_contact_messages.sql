-- Migration: contact_messages table
-- Enables required extension
create extension if not exists "pgcrypto";

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','read','responded')),
  created_at timestamptz not null default now()
);

-- Indexes for efficient filtering/searching
create index if not exists idx_contact_messages_status on public.contact_messages(status);
create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);

-- RLS setup
alter table public.contact_messages enable row level security;

-- Allow anyone (including anon) to submit messages
create policy if not exists "Allow insert for anon" on public.contact_messages
  for insert
  to anon
  with check (true);

create policy if not exists "Allow insert for authenticated" on public.contact_messages
  for insert
  to authenticated
  with check (true);

-- Allow authenticated users to read messages (can be tightened later to platform_admin only)
create policy if not exists "Allow select for authenticated" on public.contact_messages
  for select
  to authenticated
  using (true);

-- Allow authenticated users to update status (can be tightened later to platform_admin only)
create policy if not exists "Allow update status for authenticated" on public.contact_messages
  for update
  to authenticated
  using (true)
  with check (true);
