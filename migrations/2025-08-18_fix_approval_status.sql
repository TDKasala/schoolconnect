-- Fix approval status for existing users and ensure data consistency
-- This migration addresses the redirect-to-waiting-page bug by ensuring all users have proper approval status

BEGIN;

-- 1. Update any NULL approved values to false (pending approval)
UPDATE public.users 
SET approved = false 
WHERE approved IS NULL;

-- 2. Ensure platform admins are always approved
UPDATE public.users 
SET approved = true 
WHERE role = 'platform_admin' AND approved != true;

-- 3. Add constraint to prevent NULL values in future
ALTER TABLE public.users 
ALTER COLUMN approved SET NOT NULL;

-- 4. Add index for better performance on approval queries
CREATE INDEX IF NOT EXISTS idx_users_role_approved ON public.users(role, approved);

-- 5. Create function to auto-approve platform admins on insert/update
CREATE OR REPLACE FUNCTION auto_approve_platform_admins()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-approve platform admins
  IF NEW.role = 'platform_admin' THEN
    NEW.approved = true;
  END IF;
  
  -- Ensure approved is never NULL
  IF NEW.approved IS NULL THEN
    NEW.approved = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to auto-approve platform admins
DROP TRIGGER IF EXISTS trigger_auto_approve_platform_admins ON public.users;
CREATE TRIGGER trigger_auto_approve_platform_admins
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_approve_platform_admins();

COMMIT;
