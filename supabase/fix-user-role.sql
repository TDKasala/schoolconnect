-- Fix user role for landrykasala17@gmail.com to be platform_admin
-- Run these commands in your Supabase SQL Editor

-- Step 1: Check current user role
SELECT id, email, full_name, role, is_active, created_at 
FROM users 
WHERE email = 'landrykasala17@gmail.com';

-- Step 2: Update user role to platform_admin
UPDATE users 
SET role = 'platform_admin',
    full_name = 'Platform Admin',
    updated_at = now()
WHERE email = 'landrykasala17@gmail.com';

-- Step 3: Verify the role was updated correctly
SELECT id, email, full_name, role, is_active, created_at 
FROM users 
WHERE email = 'landrykasala17@gmail.com';

-- Step 4: Check if there are any other platform_admin users (should only be this one)
SELECT id, email, full_name, role, is_active 
FROM users 
WHERE role = 'platform_admin';
