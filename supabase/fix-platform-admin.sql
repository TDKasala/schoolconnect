-- Fix platform admin user after duplicate key error
-- Run these commands step by step in your Supabase SQL Editor

-- Step 1: Check what currently exists for landrykasala17@gmail.com
SELECT id, email, full_name, role, is_active, created_at FROM users WHERE email = 'landrykasala17@gmail.com';
SELECT id, email, created_at FROM auth.users WHERE email = 'landrykasala17@gmail.com';

-- Step 2: If the user exists in users table but doesn't have the right role, update it
UPDATE users 
SET role = 'platform_admin', 
    full_name = 'Platform Admin',
    is_active = true,
    updated_at = now()
WHERE email = 'landrykasala17@gmail.com';

-- Step 3: Make sure the password is correct in auth.users
UPDATE auth.users 
SET encrypted_password = crypt('Raysunkasala2016', gen_salt('bf')),
    updated_at = now()
WHERE email = 'landrykasala17@gmail.com';

-- Step 4: Remove old testadmin user (if it still exists)
DELETE FROM users WHERE email = 'testadmin@schoolconnect.com';
DELETE FROM auth.users WHERE email = 'testadmin@schoolconnect.com';

-- Step 5: Final verification
SELECT id, email, full_name, role, is_active, created_at FROM users WHERE email = 'landrykasala17@gmail.com';

-- Step 6: Check if there are any other platform_admin users
SELECT id, email, full_name, role, is_active FROM users WHERE role = 'platform_admin';
