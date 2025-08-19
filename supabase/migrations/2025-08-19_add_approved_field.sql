-- Add missing 'approved' field to users table
-- This field is critical for the approval flow but missing from the schema

BEGIN;

-- Add approved column if it doesn't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

-- Update existing users to be approved by default (to avoid breaking existing accounts)
UPDATE public.users 
SET approved = TRUE 
WHERE approved IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_approved ON public.users(approved);

-- Update RLS policies to include approval checks
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- Users can read their own profile regardless of approval status
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Users can insert their own profile during registration (will be unapproved by default)
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- Users can update their own non-critical profile fields
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    -- Prevent users from changing their own approval status or role
    (OLD.approved = NEW.approved) AND
    (OLD.role = NEW.role)
  );

-- Platform admins can update any user (including approval status)
CREATE POLICY "users_update_platform_admin" ON public.users
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.approved = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.approved = true
    )
  );

-- Platform admins can read all users
CREATE POLICY "users_select_platform_admin" ON public.users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.approved = true
    )
  );

COMMIT;
