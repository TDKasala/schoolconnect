-- Initial Clean Supabase Schema for SchoolConnect
-- Step 1: Core tables only (users, schools, roles, platform_settings)
-- This is a clean foundation for the school management system

BEGIN;

-- 1. SCHOOLS TABLE
-- Central table for school entities
CREATE TABLE IF NOT EXISTS public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL, -- unique school identifier
  address text,
  phone text,
  email text,
  logo_url text,
  timezone text DEFAULT 'Africa/Kinshasa',
  academic_year text DEFAULT '2024-2025',
  currency text DEFAULT 'CDF',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. ROLES TABLE
-- Define available roles in the system
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  permissions jsonb DEFAULT '[]'::jsonb,
  is_system_role boolean DEFAULT false, -- system roles cannot be deleted
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. USERS TABLE
-- Core user profiles with school association
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  phone text,
  role text NOT NULL DEFAULT 'school_admin',
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  approved boolean DEFAULT false,
  last_login timestamptz,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_role CHECK (role IN ('platform_admin', 'school_admin', 'teacher', 'parent'))
);

-- 4. PLATFORM_SETTINGS TABLE
-- Global platform configuration
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id text PRIMARY KEY DEFAULT 'platform',
  platform_name text NOT NULL DEFAULT 'SchoolConnect',
  contact_email text NOT NULL DEFAULT 'contact@schoolconnect.cd',
  primary_color text DEFAULT '#2563eb',
  secondary_color text DEFAULT '#10b981',
  accent_color text DEFAULT '#f59e0b',
  logo_url text,
  favicon_url text,
  support_url text DEFAULT 'https://schoolconnect.cd/support',
  terms_url text DEFAULT '/terms',
  privacy_url text DEFAULT '/privacy',
  feature_flags jsonb DEFAULT '{
    "ai_enabled": false,
    "mobile_app": false,
    "parent_portal": false,
    "advanced_reports": true,
    "multi_language": true
  }'::jsonb,
  maintenance_mode boolean DEFAULT false,
  maintenance_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default system roles
INSERT INTO public.roles (name, display_name, description, is_system_role, permissions) VALUES
  ('platform_admin', 'Platform Administrator', 'Full system access across all schools', true, '["*"]'::jsonb),
  ('school_admin', 'School Administrator', 'Full access within assigned school', true, '["school:*"]'::jsonb),
  ('teacher', 'Teacher', 'Access to assigned classes and students', true, '["class:read", "class:write", "student:read", "grade:write"]'::jsonb),
  ('parent', 'Parent', 'Access to own children information only', true, '["student:read_own", "grade:read_own"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Insert default platform settings
INSERT INTO public.platform_settings (id, platform_name, contact_email, primary_color, secondary_color, accent_color)
VALUES ('platform', 'SchoolConnect', 'contact@schoolconnect.cd', '#2563eb', '#10b981', '#f59e0b')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_school_id ON public.users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_approved ON public.users(approved);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_schools_code ON public.schools(code);
CREATE INDEX IF NOT EXISTS idx_schools_status ON public.schools(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER handle_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

COMMIT;
