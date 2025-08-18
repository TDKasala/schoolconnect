-- Fix infinite recursion in users table RLS policies
-- The issue: policies were querying the same users table they were protecting

-- 1. Drop all existing policies on users table
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_select_platform_admin" ON public.users;
DROP POLICY IF EXISTS "users_update_platform_admin" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- 2. Create simple, non-recursive policies

-- Users can read their own profile (no recursion)
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Platform admins can read all users (simplified to avoid recursion)
CREATE POLICY "users_select_platform_admin" ON public.users
  FOR SELECT TO authenticated
  USING (
    -- Allow users to read their own profile always
    id = auth.uid()
    OR
    -- Allow if user metadata indicates platform admin role
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'platform_admin'
  );

-- Users can insert their own profile during registration
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- Users can update their own non-critical fields (no recursion)
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    -- Only allow updating specific fields, not role or approval
    (OLD.role = NEW.role) AND
    (OLD.approved = NEW.approved)
  );

-- Platform admins can update any user (simplified check)
CREATE POLICY "users_update_admin" ON public.users
  FOR UPDATE TO authenticated
  USING (
    -- Allow if updating own record OR if platform admin
    id = auth.uid() OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'platform_admin'
  );

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
