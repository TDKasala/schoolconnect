-- Check existing users and update platform admin
-- Run these commands step by step in your Supabase SQL Editor

-- Step 1: Check what users currently exist
SELECT id, email, role, status FROM users WHERE email IN ('testadmin@schoolconnect.com', 'landrykasala17@gmail.com');
SELECT id, email, created_at FROM auth.users WHERE email IN ('testadmin@schoolconnect.com', 'landrykasala17@gmail.com');

-- Step 2: Check if landrykasala17@gmail.com exists and what role it has
SELECT u.id, u.email, u.role, u.status, au.email as auth_email
FROM users u
FULL OUTER JOIN auth.users au ON u.id = au.id
WHERE u.email = 'landrykasala17@gmail.com' OR au.email = 'landrykasala17@gmail.com';

-- Step 3A: If landrykasala17@gmail.com exists but is NOT platform_admin, update it to platform_admin
UPDATE users 
SET role = 'platform_admin', 
    status = 'active',
    updated_at = now()
WHERE email = 'landrykasala17@gmail.com';

-- Step 3B: Update the password for landrykasala17@gmail.com in auth.users
UPDATE auth.users 
SET encrypted_password = crypt('Raysunkasala2016', gen_salt('bf')),
    updated_at = now()
WHERE email = 'landrykasala17@gmail.com';

-- Step 4: Remove the old testadmin user (if it exists and is different)
DELETE FROM users WHERE email = 'testadmin@schoolconnect.com';
DELETE FROM auth.users WHERE email = 'testadmin@schoolconnect.com';

-- Step 5: Verify the final result
SELECT id, email, role, status FROM users WHERE email = 'landrykasala17@gmail.com';
SELECT id, email, created_at FROM auth.users WHERE email = 'landrykasala17@gmail.com';
