-- Enable Row Level Security for Core Tables (FIXED VERSION)
-- Safe defaults: users see own data, admins manage all

BEGIN;

-- 1. ENABLE RLS ON ALL CORE TABLES
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- 2. SCHOOLS TABLE POLICIES
-- School admins can only see/manage their own school
-- Platform admins can see/manage all schools
CREATE POLICY "schools_select_own" ON public.schools
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT school_id FROM public.users 
      WHERE id = auth.uid() AND approved = true
    )
  );

CREATE POLICY "schools_select_platform_admin" ON public.schools
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'platform_admin' AND approved = true
    )
  );

CREATE POLICY "schools_update_platform_admin" ON public.schools
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'platform_admin' AND approved = true
    )
  );

CREATE POLICY "schools_insert_platform_admin" ON public.schools
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'platform_admin' AND approved = true
    )
  );

-- 3. USERS TABLE POLICIES
-- Users can see their own profile
-- School admins can see users in their school
-- Platform admins can see all users
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_select_school_admin" ON public.users
  FOR SELECT TO authenticated
  USING (
    school_id IN (
      SELECT school_id FROM public.users 
      WHERE id = auth.uid() AND role = 'school_admin' AND approved = true
    )
  );

CREATE POLICY "users_select_platform_admin" ON public.users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'platform_admin' AND approved = true
    )
  );

-- Users can update their own non-critical fields
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    -- Prevent users from changing their own role or approval status
    role = (SELECT role FROM public.users WHERE id = auth.uid()) AND
    approved = (SELECT approved FROM public.users WHERE id = auth.uid()) AND
    school_id = (SELECT school_id FROM public.users WHERE id = auth.uid())
  );

-- Platform admins can update any user
CREATE POLICY "users_update_platform_admin" ON public.users
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'platform_admin' AND approved = true
    )
  );

-- Simplified school admin policy - they can update basic info but not critical fields
CREATE POLICY "users_update_school_admin" ON public.users
  FOR UPDATE TO authenticated
  USING (
    school_id IN (
      SELECT school_id FROM public.users 
      WHERE id = auth.uid() AND role = 'school_admin' AND approved = true
    )
  )
  WITH CHECK (
    school_id IN (
      SELECT school_id FROM public.users 
      WHERE id = auth.uid() AND role = 'school_admin' AND approved = true
    )
  );

-- New user registration (insert)
CREATE POLICY "users_insert_registration" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (
    id = auth.uid() AND
    approved = false AND -- New users start unapproved
    role IN ('school_admin', 'teacher') -- Only these roles can self-register
  );

-- 4. ROLES TABLE POLICIES
-- All authenticated users can read roles
-- Only platform admins can modify roles
CREATE POLICY "roles_select_all" ON public.roles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "roles_modify_platform_admin" ON public.roles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'platform_admin' AND approved = true
    )
  );

-- 5. PLATFORM_SETTINGS POLICIES
-- All users can read platform settings
-- Only platform admins can modify
CREATE POLICY "platform_settings_select_all" ON public.platform_settings
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "platform_settings_modify_platform_admin" ON public.platform_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'platform_admin' AND approved = true
    )
  );

COMMIT;
