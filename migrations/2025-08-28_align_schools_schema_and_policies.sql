-- Align schools schema with application expectations and fix RLS policies
-- Adds missing columns used by the code and replaces recursive policies with JWT-based checks

BEGIN;

-- 1) SCHEMA: Extend schools table (remove admin_id to avoid relationship conflicts)
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS province text,
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'République Démocratique du Congo',
  ADD COLUMN IF NOT EXISTS max_students integer,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

  -- Remove admin_id column and its foreign key to avoid multiple relationships
  -- School admins are identified by users.role = 'school_admin' AND users.school_id = school.id
  -- Drop legacy trigger/function that managed schools.admin_id (column has been removed)
  DROP TRIGGER IF EXISTS trigger_update_school_admin_reference ON public.users;
  DROP FUNCTION IF EXISTS public.update_school_admin_reference();
  DO $$
  BEGIN
    -- Drop foreign key constraint if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_schema = 'public'
        AND table_name = 'schools'
        AND constraint_name = 'schools_admin_id_fkey'
    ) THEN
      ALTER TABLE public.schools DROP CONSTRAINT schools_admin_id_fkey;
    END IF;
    
    -- Drop admin_id column if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'schools'
        AND column_name = 'admin_id'
    ) THEN
      ALTER TABLE public.schools DROP COLUMN admin_id;
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
  DROP POLICY IF EXISTS "users_select_platform_admin_v2" ON public.users;
  DROP POLICY IF EXISTS "users_update_platform_admin_v2" ON public.users;
  DROP POLICY IF EXISTS "users_insert_platform_admin" ON public.users;
  CREATE POLICY "users_select_platform_admin_v2" ON public.users
    FOR SELECT TO authenticated
    USING (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'app_metadata' ->> 'role')::text = 'platform_admin'));
  
  CREATE POLICY "users_update_platform_admin_v2" ON public.users
    FOR UPDATE TO authenticated
    USING (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'app_metadata' ->> 'role')::text = 'platform_admin'))
    WITH CHECK (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'app_metadata' ->> 'role')::text = 'platform_admin'));
  
  CREATE POLICY "users_insert_platform_admin" ON public.users
    FOR INSERT TO authenticated
    WITH CHECK (((auth.jwt() ->> 'role')::text = 'platform_admin') OR ((auth.jwt() -> 'app_metadata' ->> 'role')::text = 'platform_admin'));

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

-- 3) RLS: Schools policies - use function to check platform admin role
DROP POLICY IF EXISTS "schools_select_platform_admin" ON public.schools;
DROP POLICY IF EXISTS "schools_update_platform_admin" ON public.schools;
DROP POLICY IF EXISTS "schools_insert_platform_admin" ON public.schools;
DROP POLICY IF EXISTS "schools_select_platform_admin_v2" ON public.schools;
DROP POLICY IF EXISTS "schools_update_platform_admin_v2" ON public.schools;
DROP POLICY IF EXISTS "schools_insert_platform_admin_v2" ON public.schools;

-- Create helper function to check if current user is platform admin
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'platform_admin'
  );
$$;

-- Schools policies using the helper function
DROP POLICY IF EXISTS "schools_select_all" ON public.schools;
DROP POLICY IF EXISTS "schools_insert_platform_admin" ON public.schools;
DROP POLICY IF EXISTS "schools_update_platform_admin" ON public.schools;
DROP POLICY IF EXISTS "schools_delete_platform_admin" ON public.schools;

CREATE POLICY "schools_select_all" ON public.schools
  FOR SELECT TO authenticated
  USING (public.is_platform_admin());

CREATE POLICY "schools_insert_platform_admin" ON public.schools
  FOR INSERT TO authenticated
  WITH CHECK (public.is_platform_admin());

CREATE POLICY "schools_update_platform_admin" ON public.schools
  FOR UPDATE TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

CREATE POLICY "schools_delete_platform_admin" ON public.schools
  FOR DELETE TO authenticated
  USING (public.is_platform_admin());

COMMIT;
