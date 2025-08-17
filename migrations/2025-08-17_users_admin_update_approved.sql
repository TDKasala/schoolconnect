-- Allow platform admins to update users (needed to set users.approved)
-- Idempotent: drop+create policy

begin;

-- Ensure RLS is enabled (no-op if already enabled)
alter table if exists public.users enable row level security;

-- Policy: platform admins can update users
-- This allows platform admins (determined by their row in public.users) to perform updates.
-- Note: This grants ability to update any columns. If you want to restrict to only `approved`,
-- implement a BEFORE UPDATE trigger that rejects changes to other columns.
drop policy if exists "Platform admins can update users" on public.users;
create policy "Platform admins can update users"
  on public.users for update
  to authenticated
  using (exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'platform_admin'
  ))
  with check (exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'platform_admin'
  ));

commit;
