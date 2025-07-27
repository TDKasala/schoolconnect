-- Check if platform admin user exists in both tables

-- Check auth.users
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'deniskasala17@gmail.com';

-- Check public.users
SELECT 
    id,
    email,
    full_name,
    role,
    is_active,
    created_at
FROM public.users 
WHERE email = 'deniskasala17@gmail.com';

-- Check if user can read their own profile (RLS test)
SELECT 
    id,
    email,
    full_name,
    role
FROM public.users 
WHERE id = (
    SELECT id FROM auth.users WHERE email = 'deniskasala17@gmail.com'
);
