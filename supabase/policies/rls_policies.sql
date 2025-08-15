-- SchoolConnect RLS Policies
-- This script enables and defines row-level security for key tables.
-- Apply in Supabase SQL editor or via CLI.

-- Helper functions to access current user's role and school_id from public.users
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

create or replace function public.current_user_school_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_id from public.users where id = auth.uid();
$$;

-- Ensure RLS is enabled
alter table if exists public.users enable row level security;
alter table if exists public.students enable row level security;
alter table if exists public.classes enable row level security;

-- USERS POLICIES -----------------------------------------------------------------
-- Read policies
drop policy if exists users_read_self on public.users;
create policy users_read_self on public.users
for select
using ( id = auth.uid() );

drop policy if exists users_read_by_school_admin on public.users;
create policy users_read_by_school_admin on public.users
for select
using (
  (select current_user_role()) in ('school_admin','platform_admin')
  and school_id = (select current_user_school_id())
);

-- Update policies (self can update limited profile fields; admin can update all in school)
-- NOTE: Column-level restrictions should be enforced via DB constraints/triggers as needed.
drop policy if exists users_update_self on public.users;
create policy users_update_self on public.users
for update
using ( id = auth.uid() )
with check ( id = auth.uid() );

drop policy if exists users_update_by_school_admin on public.users;
create policy users_update_by_school_admin on public.users
for update
using (
  (select current_user_role()) in ('school_admin','platform_admin')
  and school_id = (select current_user_school_id())
)
with check (
  school_id = (select current_user_school_id())
);

-- Delete restricted to school/platform admin within same school (platform admin bypasses school)
drop policy if exists users_delete_by_admin on public.users;
create policy users_delete_by_admin on public.users
for delete
using (
  (select current_user_role()) = 'platform_admin'
  or (
    (select current_user_role()) = 'school_admin'
    and school_id = (select current_user_school_id())
  )
);

-- Optionally, disallow inserts from client entirely (prefer server/admin routes)
-- Otherwise, restrict inserts to admins of same school.
drop policy if exists users_insert_by_admin on public.users;
create policy users_insert_by_admin on public.users
for insert
with check (
  (select current_user_role()) = 'platform_admin'
  or (
    (select current_user_role()) = 'school_admin'
    and school_id = (select current_user_school_id())
  )
);

-- STUDENTS POLICIES --------------------------------------------------------------
-- Read: school_admin/platform_admin can read all in school; teachers only students in their classes
-- Teachers linkage assumed via students.class_id -> classes.id with classes.teacher_id = users.id

drop policy if exists students_read_by_admin on public.students;
create policy students_read_by_admin on public.students
for select
using (
  (
    (select current_user_role()) in ('school_admin','platform_admin')
    and school_id = (select current_user_school_id())
  )
);

drop policy if exists students_read_by_teacher on public.students;
create policy students_read_by_teacher on public.students
for select
using (
  (select current_user_role()) = 'teacher'
  and school_id = (select current_user_school_id())
  and exists (
    select 1 from public.classes c
    where c.id = public.students.class_id
      and c.school_id = public.students.school_id
      and c.teacher_id = auth.uid()
  )
);

-- Write: only school_admin (and platform admin) within school

drop policy if exists students_write_by_admin on public.students;
create policy students_write_by_admin on public.students
for all
using (
  (
    (select current_user_role()) = 'platform_admin'
  ) or (
    (select current_user_role()) = 'school_admin'
    and school_id = (select current_user_school_id())
  )
)
with check (
  school_id = (select current_user_school_id())
);

-- CLASSES POLICIES ---------------------------------------------------------------
-- Read: school_admin/platform_admin all in school; teachers only their assigned classes

drop policy if exists classes_read_by_admin on public.classes;
create policy classes_read_by_admin on public.classes
for select
using (
  (
    (select current_user_role()) in ('school_admin','platform_admin')
    and school_id = (select current_user_school_id())
  )
);

drop policy if exists classes_read_by_teacher on public.classes;
create policy classes_read_by_teacher on public.classes
for select
using (
  (select current_user_role()) = 'teacher'
  and school_id = (select current_user_school_id())
  and teacher_id = auth.uid()
);

-- Write: only school_admin/platform_admin within school

drop policy if exists classes_write_by_admin on public.classes;
create policy classes_write_by_admin on public.classes
for all
using (
  (
    (select current_user_role()) = 'platform_admin'
  ) or (
    (select current_user_role()) = 'school_admin'
    and school_id = (select current_user_school_id())
  )
)
with check (
  school_id = (select current_user_school_id())
);
