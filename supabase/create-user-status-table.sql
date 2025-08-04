-- Create user_status table for Supabase
-- This table manages user status states in the SchoolConnect platform

-- Create user_status table
CREATE TABLE IF NOT EXISTS public.user_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status_name TEXT UNIQUE NOT NULL,
    status_display_name TEXT NOT NULL,
    status_description TEXT,
    status_color TEXT DEFAULT '#6B7280', -- Default gray color
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default user status values
INSERT INTO public.user_status (status_name, status_display_name, status_description, status_color, sort_order) VALUES
('active', 'Actif', 'Utilisateur actif avec accès complet au système', '#10B981', 1), -- green-500
('inactive', 'Inactif', 'Utilisateur inactif temporairement sans accès', '#6B7280', 2), -- gray-500
('suspended', 'Suspendu', 'Utilisateur suspendu temporairement par un administrateur', '#F59E0B', 3), -- amber-500
('pending', 'En attente', 'Utilisateur en attente d''approbation ou de validation', '#3B82F6', 4), -- blue-500
('blocked', 'Bloqué', 'Utilisateur bloqué définitivement pour violation des règles', '#EF4444', 5), -- red-500
('archived', 'Archivé', 'Utilisateur archivé (ancien utilisateur conservé pour historique)', '#9CA3AF', 6) -- gray-400
ON CONFLICT (status_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_status_name ON public.user_status(status_name);
CREATE INDEX IF NOT EXISTS idx_user_status_active ON public.user_status(is_active);
CREATE INDEX IF NOT EXISTS idx_user_status_sort_order ON public.user_status(sort_order);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_status_updated_at
    BEFORE UPDATE ON public.user_status
    FOR EACH ROW
    EXECUTE FUNCTION update_user_status_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "User status viewable by authenticated users" ON public.user_status
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only platform admins can modify user status" ON public.user_status
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'platform_admin'
        )
    );

-- Disable RLS for development (enable for production)
ALTER TABLE public.user_status DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON public.user_status TO authenticated;
GRANT ALL ON public.user_status TO service_role;

-- Add user_status_id column to users table if it doesn't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS user_status_id UUID REFERENCES public.user_status(id) DEFAULT (SELECT id FROM public.user_status WHERE status_name = 'active' LIMIT 1);

-- Update existing users to have active status if they don't have a status
UPDATE public.users 
SET user_status_id = (SELECT id FROM public.user_status WHERE status_name = 'active' LIMIT 1)
WHERE user_status_id IS NULL;

-- Create index on users.user_status_id for performance
CREATE INDEX IF NOT EXISTS idx_users_user_status_id ON public.users(user_status_id);

-- Verification queries
SELECT 'User Status Table Created' as message;

SELECT 
    'User Status Records' as check_type,
    status_name,
    status_display_name,
    status_color,
    sort_order
FROM public.user_status 
ORDER BY sort_order;

SELECT 
    'Users Table Column Check' as check_type,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'user_status_id';

SELECT 
    'User Status Distribution' as check_type,
    us.status_display_name,
    COUNT(u.id) as user_count
FROM public.user_status us
LEFT JOIN public.users u ON us.id = u.user_status_id
GROUP BY us.id, us.status_display_name, us.sort_order
ORDER BY us.sort_order;
