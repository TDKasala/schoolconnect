-- Add approved flag to public.users
-- Safe to run multiple times due to IF NOT EXISTS guards where applicable

begin;

-- 1) Add column if not exists
alter table if exists public.users
  add column if not exists approved boolean not null default false;

-- 2) Create index for faster lookups
create index if not exists idx_users_approved on public.users(approved);

-- 3) Ensure platform admins are approved
update public.users set approved = true where role = 'platform_admin' and approved is distinct from true;

commit;
