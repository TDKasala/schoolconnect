-- Setup Platform Admin User
-- This script creates the platform admin user deniskasala17@gmail.com

-- Step 1: Create the auth user (this would normally be done through Supabase Auth UI or API)
-- Note: You'll need to create this user through the Supabase Dashboard Auth section or use the API
-- Email: deniskasala17@gmail.com
-- Password: @Raysunkasala2016
-- After creating the auth user, get the UUID and use it below

-- Step 2: Update the existing user to platform_admin role
-- The user already exists (created by trigger), so we just need to update the role
UPDATE public.users 
SET 
    role = 'platform_admin',
    full_name = 'Denis Kasala',
    is_active = TRUE,
    updated_at = NOW()
WHERE email = 'deniskasala17@gmail.com';

-- Alternative: If you want to ensure the ID matches as well
-- UPDATE public.users 
-- SET 
--     role = 'platform_admin',
--     full_name = 'Denis Kasala',
--     is_active = TRUE,
--     updated_at = NOW()
-- WHERE id = '6353072c-eea2-4c6c-8b0d-b882a91f224c'::UUID;

-- Step 3: Verify the platform admin user
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.is_active,
    u.created_at
FROM public.users u
WHERE u.email = 'deniskasala17@gmail.com';

-- Step 4: Create a function to check if user is platform admin (helper function)
CREATE OR REPLACE FUNCTION public.is_platform_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.users 
        WHERE id = user_id 
        AND role = 'platform_admin' 
        AND is_active = TRUE
    );
END;
$$;

-- Step 5: Create a function to get all platform admin privileges
CREATE OR REPLACE FUNCTION public.get_platform_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
BEGIN
    -- Only platform admins can access this
    IF NOT public.is_platform_admin() THEN
        RAISE EXCEPTION 'Access denied. Platform admin privileges required.';
    END IF;
    
    SELECT json_build_object(
        'total_schools', (SELECT COUNT(*) FROM public.schools),
        'total_users', (SELECT COUNT(*) FROM public.users),
        'total_students', (SELECT COUNT(*) FROM public.students),
        'total_classes', (SELECT COUNT(*) FROM public.classes),
        'active_schools', (SELECT COUNT(*) FROM public.schools WHERE is_active = TRUE),
        'active_users', (SELECT COUNT(*) FROM public.users WHERE is_active = TRUE)
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Instructions:
-- 1. First, create the auth user in Supabase Dashboard:
--    - Go to Authentication > Users in your Supabase dashboard
--    - Click "Add user"
--    - Email: deniskasala17@gmail.com
--    - Password: @Raysunkasala2016
--    - Copy the generated UUID
-- 
-- 2. Replace 'YOUR_AUTH_USER_UUID_HERE' above with the actual UUID
-- 
-- 3. Run this script in the Supabase SQL Editor
-- 
-- 4. The user will now have platform_admin role and full access to all features
