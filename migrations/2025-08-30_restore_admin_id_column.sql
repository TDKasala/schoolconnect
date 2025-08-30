-- Restore admin_id column to schools table for frontend compatibility
-- This allows the frontend to use admin:users!admin_id relationship queries

BEGIN;

-- Add admin_id column back to schools table
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS admin_id uuid;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'schools'
      AND constraint_name = 'fk_schools_admin_id'
  ) THEN
    ALTER TABLE public.schools 
    ADD CONSTRAINT fk_schools_admin_id 
    FOREIGN KEY (admin_id) REFERENCES public.users(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Populate admin_id for existing schools by finding their school_admin users
UPDATE public.schools 
SET admin_id = (
  SELECT users.id 
  FROM public.users 
  WHERE users.school_id = schools.id 
    AND users.role = 'school_admin' 
  LIMIT 1
)
WHERE admin_id IS NULL;

-- Create function to automatically set admin_id when a school_admin is assigned
CREATE OR REPLACE FUNCTION public.sync_school_admin_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When a user becomes school_admin, update the school's admin_id
  IF NEW.role = 'school_admin' AND NEW.school_id IS NOT NULL THEN
    UPDATE public.schools 
    SET admin_id = NEW.id 
    WHERE id = NEW.school_id;
  END IF;
  
  -- When a school_admin's school_id changes, update both schools
  IF OLD.role = 'school_admin' AND OLD.school_id IS DISTINCT FROM NEW.school_id THEN
    -- Clear old school's admin_id
    IF OLD.school_id IS NOT NULL THEN
      UPDATE public.schools 
      SET admin_id = NULL 
      WHERE id = OLD.school_id AND admin_id = OLD.id;
    END IF;
    
    -- Set new school's admin_id
    IF NEW.school_id IS NOT NULL AND NEW.role = 'school_admin' THEN
      UPDATE public.schools 
      SET admin_id = NEW.id 
      WHERE id = NEW.school_id;
    END IF;
  END IF;
  
  RETURN NEW;
END$$;

-- Create trigger to keep admin_id in sync
DROP TRIGGER IF EXISTS trigger_sync_school_admin_id ON public.users;
CREATE TRIGGER trigger_sync_school_admin_id
  AFTER INSERT OR UPDATE OF role, school_id ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_school_admin_id();

COMMIT;
