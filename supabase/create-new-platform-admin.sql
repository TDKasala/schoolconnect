-- Create new platform admin user: landrykasala17@gmail.com
-- Run these commands step by step in your Supabase SQL Editor

-- Step 1: Check current users (using correct column names)
SELECT id, email, role, is_active, created_at FROM users WHERE email IN ('testadmin@schoolconnect.com', 'landrykasala17@gmail.com');

-- Step 2: Create new user in auth.users table
INSERT INTO auth.users (
    id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    created_at, 
    updated_at, 
    role, 
    aud,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
)
VALUES (
    gen_random_uuid(), 
    'landrykasala17@gmail.com', 
    crypt('Raysunkasala2016', gen_salt('bf')), 
    now(), 
    now(), 
    now(), 
    'authenticated', 
    'authenticated',
    '',
    '',
    '',
    ''
);

-- Step 3: Create corresponding profile in users table
INSERT INTO users (id, email, full_name, role, is_active, created_at, updated_at)
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

-- Step 4: Remove old testadmin user (if it exists)
DELETE FROM users WHERE email = 'testadmin@schoolconnect.com';
DELETE FROM auth.users WHERE email = 'testadmin@schoolconnect.com';

-- Step 5: Verify the new platform admin user
SELECT id, email, full_name, role, is_active, created_at FROM users WHERE email = 'landrykasala17@gmail.com';
SELECT id, email, created_at FROM auth.users WHERE email = 'landrykasala17@gmail.com';
