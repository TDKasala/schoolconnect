-- Align schools schema with application expectations and fix RLS policies
-- Adds missing columns used by the code and replaces recursive policies with JWT-based checks

BEGIN;

-- 1) SCHEMA: Extend schools table
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS province text,
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'République Démocratique du Congo',
  ADD COLUMN IF NOT EXISTS max_students integer,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS admin_id uuid;

-- Ensure foreign key from schools.admin_id -> users.id exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'schools'
      AND constraint_name = 'schools_admin_id_fkey'
  ) THEN
    ALTER TABLE public.schools
      ADD CONSTRAINT schools_admin_id_fkey
      FOREIGN KEY (admin_id)
      REFERENCES public.users(id)
      ON DELETE SET NULL;
  END IF;
END$$;

-- Ensure code has a safe default so inserts can omit it
-- Example: SCH-1a2b3c4d
ALTER TABLE public.schools
  ALTER COLUMN code SET DEFAULT ('SCH-' || substr((gen_random_uuid())::text, 1, 8));

-- 2) RLS: Replace recursive users policies with JWT-based checks
-- Drop potentially recursive or restrictive policies
DROP POLICY IF EXISTS "users_select_platform_admin" ON public.users;
DROP POLICY IF EXISTS "users_update_platform_admin" ON public.users;
DROP POLICY IF EXISTS "users_update_school_admin" ON public.users;
DROP POLICY IF EXISTS "users_select_school_admin" ON public.users;
DROP POLICY IF EXISTS "users_insert_registration" ON public.users;

-- Keep/ensure own-profile select is available
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_select_own'
  ) THEN
    CREATE POLICY "users_select_own" ON public.users
      FOR SELECT TO authenticated
      USING (id = auth.uid());
  END IF;
END$$;

  -- Platform admin: full read/update/insert rights on users via JWT claim
  CREATE POLICY "users_select_platform_admin_v2" ON public.users
    FOR SELECT TO authenticated
    USING (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'user_metadata' ->> 'role')::text = 'platform_admin'));
  
  CREATE POLICY "users_update_platform_admin_v2" ON public.users
    FOR UPDATE TO authenticated
    USING (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'user_metadata' ->> 'role')::text = 'platform_admin'))
    WITH CHECK (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'user_metadata' ->> 'role')::text = 'platform_admin'));
  
  CREATE POLICY "users_insert_platform_admin" ON public.users
    FOR INSERT TO authenticated
    WITH CHECK (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'user_metadata' ->> 'role')::text = 'platform_admin'));

-- Optional: allow self-registration profile insert for the current user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='users_insert_self'
  ) THEN
    CREATE POLICY "users_insert_self" ON public.users
      FOR INSERT TO authenticated
      WITH CHECK (id = auth.uid());
  END IF;
END$$;

-- 3) RLS: Schools policies - prefer JWT for platform admin
DROP POLICY IF EXISTS "schools_select_platform_admin" ON public.schools;
DROP POLICY IF EXISTS "schools_update_platform_admin" ON public.schools;
DROP POLICY IF EXISTS "schools_insert_platform_admin" ON public.schools;

  CREATE POLICY "schools_select_platform_admin_v2" ON public.schools
    FOR SELECT TO authenticated
    USING (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'user_metadata' ->> 'role')::text = 'platform_admin'));
  
  CREATE POLICY "schools_update_platform_admin_v2" ON public.schools
    FOR UPDATE TO authenticated
    USING (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'user_metadata' ->> 'role')::text = 'platform_admin'))
    WITH CHECK (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'user_metadata' ->> 'role')::text = 'platform_admin'));
  
  CREATE POLICY "schools_insert_platform_admin_v2" ON public.schools
    FOR INSERT TO authenticated
    WITH CHECK (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'user_metadata' ->> 'role')::text = 'platform_admin'));

COMMIT;
