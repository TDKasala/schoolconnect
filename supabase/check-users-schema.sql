-- Check the actual schema of the users table
-- Run these commands to understand the table structure

-- Step 1: Check the structure of the users table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Check what users currently exist (without status column)
SELECT id, email, role, created_at, updated_at FROM users WHERE email IN ('testadmin@schoolconnect.com', 'landrykasala17@gmail.com');

-- Step 3: Check auth.users table
SELECT id, email, created_at FROM auth.users WHERE email IN ('testadmin@schoolconnect.com', 'landrykasala17@gmail.com');

-- Step 4: Show all columns in users table with sample data
SELECT * FROM users LIMIT 3;
