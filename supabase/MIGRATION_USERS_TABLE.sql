-- COMPREHENSIVE MIGRATION: Update users table to use user_status_id and role_id
-- This migration script safely updates the users table structure
-- Run this in Supabase SQL Editor

-- Step 1: Create status table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6B7280',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    level INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Insert default status values
INSERT INTO public.status (name, display_name, description, color, sort_order) VALUES
('active', 'Actif', 'Utilisateur actif avec accès complet', '#10B981', 1),
('inactive', 'Inactif', 'Utilisateur inactif sans accès', '#6B7280', 2),
('suspended', 'Suspendu', 'Utilisateur temporairement suspendu', '#F59E0B', 3),
('pending', 'En attente', 'Utilisateur en attente d''approbation', '#3B82F6', 4),
('blocked', 'Bloqué', 'Utilisateur bloqué définitivement', '#EF4444', 5)
ON CONFLICT (name) DO NOTHING;

-- Step 4: Insert default roles
INSERT INTO public.roles (name, display_name, description, permissions, level) VALUES
('teacher', 'Enseignant', 'Enseignant avec accès aux classes et élèves assignés', 
 '{"classes": ["read", "update"], "students": ["read", "update"], "grades": ["create", "read", "update"], "attendance": ["create", "read", "update"]}', 1),
('parent', 'Parent', 'Parent avec accès aux informations de ses enfants', 
 '{"students": ["read"], "grades": ["read"], "attendance": ["read"], "payments": ["read"]}', 1),
('school_admin', 'Administrateur École', 'Administrateur avec accès complet à une école', 
 '{"school": ["read", "update"], "classes": ["create", "read", "update", "delete"], "students": ["create", "read", "update", "delete"], "teachers": ["create", "read", "update", "delete"], "grades": ["create", "read", "update", "delete"], "attendance": ["create", "read", "update", "delete"], "payments": ["create", "read", "update", "delete"], "messages": ["create", "read", "update", "delete"]}', 3),
('platform_admin', 'Administrateur Plateforme', 'Administrateur avec accès complet à toutes les écoles', 
 '{"schools": ["create", "read", "update", "delete"], "users": ["create", "read", "update", "delete"], "roles": ["create", "read", "update", "delete"], "system": ["read", "update"]}', 4)
ON CONFLICT (name) DO NOTHING;

-- Step 5: Add new columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS user_status_id UUID REFERENCES public.status(id);

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles(id);

-- Step 6: Migrate existing data
-- Update user_status_id based on is_active field
UPDATE public.users 
SET user_status_id = (
  CASE 
    WHEN is_active = true THEN (SELECT id FROM public.status WHERE name = 'active' LIMIT 1)
    ELSE (SELECT id FROM public.status WHERE name = 'inactive' LIMIT 1)
  END
)
WHERE user_status_id IS NULL;

-- Update role_id based on role field
UPDATE public.users 
SET role_id = (
  CASE 
    WHEN role = 'platform_admin' THEN (SELECT id FROM public.roles WHERE name = 'platform_admin' LIMIT 1)
    WHEN role = 'school_admin' THEN (SELECT id FROM public.roles WHERE name = 'school_admin' LIMIT 1)
    WHEN role = 'teacher' THEN (SELECT id FROM public.roles WHERE name = 'teacher' LIMIT 1)
    WHEN role = 'parent' THEN (SELECT id FROM public.roles WHERE name = 'parent' LIMIT 1)
    ELSE (SELECT id FROM public.roles WHERE name = 'teacher' LIMIT 1)
  END
)
WHERE role_id IS NULL;

-- Step 7: Set default values for new users
ALTER TABLE public.users 
ALTER COLUMN user_status_id SET DEFAULT (SELECT id FROM public.status WHERE name = 'active' LIMIT 1);

ALTER TABLE public.users 
ALTER COLUMN role_id SET DEFAULT (SELECT id FROM public.roles WHERE name = 'teacher' LIMIT 1);

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_user_status_id ON public.users(user_status_id);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users(role_id);
CREATE INDEX IF NOT EXISTS idx_status_name ON public.status(name);
CREATE INDEX IF NOT EXISTS idx_status_active ON public.status(is_active);
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_level ON public.roles(level);

-- Step 9: Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to new tables
CREATE TRIGGER update_status_updated_at 
    BEFORE UPDATE ON public.status 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at 
    BEFORE UPDATE ON public.roles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 10: Set up RLS policies (disabled for development)
ALTER TABLE public.status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Status viewable by authenticated users" ON public.status
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Roles viewable by authenticated users" ON public.roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Disable for development
ALTER TABLE public.status DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;

-- Step 11: Grant permissions
GRANT SELECT ON public.status TO authenticated;
GRANT ALL ON public.status TO service_role;
GRANT SELECT ON public.roles TO authenticated;
GRANT ALL ON public.roles TO service_role;

-- Step 12: Verification queries
-- Check if migration was successful
SELECT 'Migration Status Check' as check_type;

SELECT 
    'Column Check' as check_type,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('user_status_id', 'role_id', 'role', 'is_active')
ORDER BY column_name;

SELECT 
    'Data Migration Check' as check_type,
    COUNT(*) as total_users,
    COUNT(user_status_id) as users_with_status,
    COUNT(role_id) as users_with_role
FROM public.users;

SELECT 
    'Status Distribution' as check_type,
    s.display_name,
    COUNT(u.id) as user_count
FROM public.status s
LEFT JOIN public.users u ON s.id = u.user_status_id
GROUP BY s.id, s.display_name, s.sort_order
ORDER BY s.sort_order;

SELECT 
    'Role Distribution' as check_type,
    r.display_name,
    COUNT(u.id) as user_count
FROM public.roles r
LEFT JOIN public.users u ON r.id = u.role_id
GROUP BY r.id, r.display_name, r.level
ORDER BY r.level DESC;
