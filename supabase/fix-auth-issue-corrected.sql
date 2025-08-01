-- Fixed authentication issue script for landrykasala17@gmail.com
-- This version excludes the generated columns that caused the error

-- Step 1: Delete any existing problematic user entries
DELETE FROM users WHERE email = 'landrykasala17@gmail.com';
DELETE FROM auth.users WHERE email = 'landrykasala17@gmail.com';

-- Step 2: Create a fresh, properly configured auth user (without generated columns)
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
    role
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
    'authenticated'
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
    au.role as auth_role,
    u.role as user_role,
    u.is_active,
    u.full_name
FROM auth.users au
JOIN users u ON au.id = u.id
WHERE au.email = 'landrykasala17@gmail.com';

-- Step 5: Alternative simple approach if the above still has issues
-- Just update the existing user if it was partially created
/*
-- First check what exists:
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'landrykasala17@gmail.com';

-- Then update password and confirm email:
UPDATE auth.users 
SET 
    encrypted_password = crypt('Raysunkasala2016', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
WHERE email = 'landrykasala17@gmail.com';

-- Update user profile:
UPDATE users 
SET 
    role = 'platform_admin',
    full_name = 'Platform Admin',
    is_active = true,
    updated_at = now()
WHERE email = 'landrykasala17@gmail.com';
*/
