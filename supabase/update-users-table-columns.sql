-- Update users table to use user_status_id and role_id columns
-- This provides full foreign key relationships for roles and status

-- First, ensure status and roles tables exist
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

-- Insert default status values if they don't exist
INSERT INTO public.status (name, display_name, description, color, sort_order) VALUES
('active', 'Actif', 'Utilisateur actif avec accès complet', '#10B981', 1),
('inactive', 'Inactif', 'Utilisateur inactif sans accès', '#6B7280', 2),
('suspended', 'Suspendu', 'Utilisateur temporairement suspendu', '#F59E0B', 3),
('pending', 'En attente', 'Utilisateur en attente d''approbation', '#3B82F6', 4),
('blocked', 'Bloqué', 'Utilisateur bloqué définitivement', '#EF4444', 5)
ON CONFLICT (name) DO NOTHING;

-- Insert default roles if they don't exist
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

-- Add user_status_id column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS user_status_id UUID REFERENCES public.status(id) DEFAULT (SELECT id FROM public.status WHERE name = 'active' LIMIT 1);

-- Add role_id column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles(id) DEFAULT (SELECT id FROM public.roles WHERE name = 'teacher' LIMIT 1);

-- Update existing users to have proper status and role IDs based on current values
UPDATE public.users 
SET user_status_id = (
  CASE 
    WHEN is_active = true THEN (SELECT id FROM public.status WHERE name = 'active' LIMIT 1)
    ELSE (SELECT id FROM public.status WHERE name = 'inactive' LIMIT 1)
  END
)
WHERE user_status_id IS NULL;

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_user_status_id ON public.users(user_status_id);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users(role_id);
CREATE INDEX IF NOT EXISTS idx_status_name ON public.status(name);
CREATE INDEX IF NOT EXISTS idx_status_active ON public.status(is_active);
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_level ON public.roles(level);

-- Add triggers to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_status_updated_at 
    BEFORE UPDATE ON public.status 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at 
    BEFORE UPDATE ON public.roles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on status and roles tables
ALTER TABLE public.status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Status are viewable by authenticated users" ON public.status
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only platform admins can modify status" ON public.status
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'platform_admin'
        )
    );

CREATE POLICY "Roles are viewable by authenticated users" ON public.roles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only platform admins can modify roles" ON public.roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'platform_admin'
        )
    );

-- Disable RLS for development (enable for production)
ALTER TABLE public.status DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON public.status TO authenticated;
GRANT ALL ON public.status TO service_role;
GRANT SELECT ON public.roles TO authenticated;
GRANT ALL ON public.roles TO service_role;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('user_status_id', 'role_id', 'role', 'is_active')
ORDER BY column_name;
