-- Fix authentication issue for landrykasala17@gmail.com
-- Run these commands step by step after running the debug script

-- Step 1: Delete any existing problematic user entries
DELETE FROM users WHERE email = 'landrykasala17@gmail.com';
DELETE FROM auth.users WHERE email = 'landrykasala17@gmail.com';

-- Step 2: Create a fresh, properly configured auth user
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    aud,
    role,
    confirmed_at
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'landrykasala17@gmail.com',
    crypt('Raysunkasala2016', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    '',
    'authenticated',
    'authenticated',
    now()
);

-- Step 3: Create the corresponding user profile
INSERT INTO users (
    id,
    email,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT 
    id,
    'landrykasala17@gmail.com',
    'Platform Admin',
    'platform_admin',
    true,
    now(),
    now()
FROM auth.users 
WHERE email = 'landrykasala17@gmail.com';

-- Step 4: Verify the user was created correctly
SELECT 
    au.id,
    au.email,
    au.email_confirmed_at,
    au.confirmed_at,
    au.role as auth_role,
    u.role as user_role,
    u.is_active,
    u.full_name
FROM auth.users au
JOIN users u ON au.id = u.id
WHERE au.email = 'landrykasala17@gmail.com';

-- Step 5: If you're still having issues, try this alternative password update
-- (Only run this if the above doesn't work)
/*
UPDATE auth.users 
SET 
    encrypted_password = crypt('Raysunkasala2016', gen_salt('bf')),
    email_confirmed_at = now(),
    confirmed_at = now(),
    updated_at = now()
WHERE email = 'landrykasala17@gmail.com';
*/
