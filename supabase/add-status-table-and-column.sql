-- Add status table and status_id column to users table
-- This provides flexible status management for users

-- Create status table first
CREATE TABLE IF NOT EXISTS public.status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6B7280', -- Tailwind gray-500 as default
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default status values
INSERT INTO public.status (name, display_name, description, color, sort_order) VALUES
('active', 'Actif', 'Utilisateur actif avec accès complet', '#10B981', 1), -- green-500
('inactive', 'Inactif', 'Utilisateur inactif sans accès', '#6B7280', 2), -- gray-500
('suspended', 'Suspendu', 'Utilisateur temporairement suspendu', '#F59E0B', 3), -- amber-500
('pending', 'En attente', 'Utilisateur en attente d''approbation', '#3B82F6', 4), -- blue-500
('blocked', 'Bloqué', 'Utilisateur bloqué définitivement', '#EF4444', 5) -- red-500
ON CONFLICT (name) DO NOTHING;

-- Add status_id column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS status_id UUID REFERENCES public.status(id) DEFAULT (SELECT id FROM public.status WHERE name = 'active' LIMIT 1);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_status_id ON public.users(status_id);
CREATE INDEX IF NOT EXISTS idx_status_name ON public.status(name);
CREATE INDEX IF NOT EXISTS idx_status_active ON public.status(is_active);

-- Add trigger to update updated_at timestamp for status table
CREATE OR REPLACE FUNCTION update_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_status_updated_at
    BEFORE UPDATE ON public.status
    FOR EACH ROW
    EXECUTE FUNCTION update_status_updated_at();

-- Enable RLS (Row Level Security) on status table
ALTER TABLE public.status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for status table
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

-- Disable RLS for development (enable for production)
ALTER TABLE public.status DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON public.status TO authenticated;
GRANT ALL ON public.status TO service_role;

-- Update existing users to have active status if they don't have a status_id
UPDATE public.users 
SET status_id = (SELECT id FROM public.status WHERE name = 'active' LIMIT 1)
WHERE status_id IS NULL;
