-- Enable RLS where policies already exist, and add minimal policies required by the app
-- Safe and idempotent as ENABLE is harmless if already enabled and IF NOT EXISTS used for policies

begin;

-- 1) public.users: enable RLS and allow users to select their own row (needed for Pending Approval)
alter table if exists public.users enable row level security;

-- Policy: users can select their own profile (idempotent)
drop policy if exists "Users can select their own profile" on public.users;
create policy "Users can select their own profile"
  on public.users for select
  to authenticated
  using (id = auth.uid());

-- Optional: platform admins can select all users (idempotent)
drop policy if exists "Platform admins can select all users" on public.users;
create policy "Platform admins can select all users"
  on public.users for select
  to authenticated
  using (exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'platform_admin'
  ));

-- 2) Tables with existing policies but RLS reported disabled: enable RLS only
alter table if exists public.activity_logs enable row level security;
alter table if exists public.classes enable row level security;
alter table if exists public.events enable row level security;
alter table if exists public.payments enable row level security;

-- NOTE: Other public tables were flagged as RLS disabled, but enabling without reviewing policies
-- can block the application. We'll address them in a follow-up migration after a policy audit:
--   schools, teachers, roles, students, user_status

commit;
