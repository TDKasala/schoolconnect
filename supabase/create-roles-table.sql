-- Roles table for SchoolConnect
-- This table defines all available roles in the system with their permissions and descriptions

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    level INTEGER NOT NULL DEFAULT 1, -- Role hierarchy level (1=lowest, 4=highest)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles based on existing schema
INSERT INTO public.roles (name, display_name, description, permissions, level) VALUES
('teacher', 'Enseignant', 'Enseignant avec accès aux classes et élèves assignés', 
 '{"classes": ["read", "update"], "students": ["read", "update"], "grades": ["create", "read", "update"], "attendance": ["create", "read", "update"]}', 1),
 
('parent', 'Parent', 'Parent avec accès aux informations de ses enfants', 
 '{"students": ["read"], "grades": ["read"], "attendance": ["read"], "payments": ["read"]}', 1),
 
('school_admin', 'Administrateur École', 'Administrateur avec accès complet à une école', 
 '{"school": ["read", "update"], "classes": ["create", "read", "update", "delete"], "students": ["create", "read", "update", "delete"], "teachers": ["create", "read", "update", "delete"], "grades": ["create", "read", "update", "delete"], "attendance": ["create", "read", "update", "delete"], "payments": ["create", "read", "update", "delete"], "messages": ["create", "read", "update", "delete"]}', 3),
 
('platform_admin', 'Administrateur Plateforme', 'Administrateur avec accès complet à toutes les écoles', 
 '{"schools": ["create", "read", "update", "delete"], "users": ["create", "read", "update", "delete"], "roles": ["create", "read", "update", "delete"], "system": ["read", "update"]}', 4);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_level ON public.roles(level);
CREATE INDEX IF NOT EXISTS idx_roles_active ON public.roles(is_active);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_roles_updated_at
    BEFORE UPDATE ON public.roles
    FOR EACH ROW
    EXECUTE FUNCTION update_roles_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Grant permissions
GRANT SELECT ON public.roles TO authenticated;
GRANT ALL ON public.roles TO service_role;
