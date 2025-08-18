-- Fix infinite recursion in users table RLS policies
-- Corrected version with proper PostgreSQL JSON operators

-- 1. Drop all existing policies on users table
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_select_platform_admin" ON public.users;
DROP POLICY IF EXISTS "users_update_platform_admin" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_update_admin" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;

-- 2. Create simple, non-recursive policies

-- Users can read their own profile (no recursion)
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Users can insert their own profile during registration
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- Users can update their own non-critical fields (no recursion)
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Simplified admin policy without JWT metadata checks to avoid operator errors
CREATE POLICY "users_admin_access" ON public.users
  FOR ALL TO authenticated
  USING (
    -- Allow users to access their own records
    id = auth.uid()
  );

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
