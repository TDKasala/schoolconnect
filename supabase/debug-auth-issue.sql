-- Debug authentication issue for landrykasala17@gmail.com
-- Run these commands step by step to diagnose the problem

-- Step 1: Check if user exists in auth.users table
SELECT id, email, created_at, email_confirmed_at, confirmed_at, last_sign_in_at, role, aud 
FROM auth.users 
WHERE email = 'landrykasala17@gmail.com';

-- Step 2: Check if user exists in public.users table
SELECT id, email, full_name, role, is_active, created_at 
FROM users 
WHERE email = 'landrykasala17@gmail.com';

-- Step 3: Check if the IDs match between auth.users and public.users
SELECT 
    au.id as auth_id, 
    au.email as auth_email,
    u.id as user_id, 
    u.email as user_email,
    u.role,
    u.is_active
FROM auth.users au
FULL OUTER JOIN users u ON au.id = u.id
WHERE au.email = 'landrykasala17@gmail.com' OR u.email = 'landrykasala17@gmail.com';

-- Step 4: Check if email is confirmed (this is often the issue)
SELECT email, email_confirmed_at, confirmed_at, email_confirm_status 
FROM auth.users 
WHERE email = 'landrykasala17@gmail.com';

-- Step 5: Check for any duplicate users
SELECT email, COUNT(*) as count 
FROM auth.users 
WHERE email = 'landrykasala17@gmail.com'
GROUP BY email;

SELECT email, COUNT(*) as count 
FROM users 
WHERE email = 'landrykasala17@gmail.com'
GROUP BY email;
