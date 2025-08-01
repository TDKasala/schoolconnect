-- SQL commands to update platform admin user to landrykasala17@gmail.com
-- Run these commands in your Supabase SQL Editor

-- Method 1: Update existing testadmin user (RECOMMENDED)
-- Step 1: Update the existing testadmin user email and password in auth.users
UPDATE auth.users 
SET email = 'landrykasala17@gmail.com', 
    encrypted_password = crypt('Raysunkasala2016', gen_salt('bf')),
    updated_at = now()
WHERE email = 'testadmin@schoolconnect.com';

-- Step 2: Update the user profile in the users table
UPDATE users 
SET email = 'landrykasala17@gmail.com',
    updated_at = now()
WHERE email = 'testadmin@schoolconnect.com';

-- Verify the changes
SELECT id, email, role, status FROM users WHERE email = 'landrykasala17@gmail.com';
SELECT id, email, created_at FROM auth.users WHERE email = 'landrykasala17@gmail.com';

/*
-- Alternative Method 2: Create new user and delete old one (if preferred)
-- Step 1: Insert new user into auth.users
INSERT INTO auth.users (
    id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    created_at, 
    updated_at, 
    role, 
    aud
)
VALUES (
    gen_random_uuid(), 
    'landrykasala17@gmail.com', 
    crypt('Raysunkasala2016', gen_salt('bf')), 
    now(), 
    now(), 
    now(), 
    'authenticated', 
    'authenticated'
);

-- Step 2: Insert corresponding profile in users table
INSERT INTO users (id, email, role, status, created_at, updated_at)
SELECT id, 'landrykasala17@gmail.com', 'platform_admin', 'active', now(), now()
FROM auth.users WHERE email = 'landrykasala17@gmail.com';

-- Step 3: Remove old testadmin user
DELETE FROM users WHERE email = 'testadmin@schoolconnect.com';
DELETE FROM auth.users WHERE email = 'testadmin@schoolconnect.com';
*/
