-- Create Platform Admin Account: deniskasala17@gmail.com
-- Run this SQL in Supabase SQL Editor to set up the platform admin

-- Step 1: Create the admin user in auth.users (this will be done via registration)
-- Step 2: Update the user profile to platform_admin role

-- Insert platform admin directly into users table
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    school_id,
    is_active,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Fixed UUID for admin
    'deniskasala17@gmail.com',
    'Denis Kasala',
    'platform_admin',
    NULL, -- Platform admin has no school association
    TRUE,
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'platform_admin',
    updated_at = NOW();

-- Create a sample school for testing
INSERT INTO public.schools (
    id,
    name,
    address,
    city,
    province,
    phone,
    email,
    is_active
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Ecole de Demonstration',
    '123 Avenue de Education',
    'Kinshasa',
    'Kinshasa',
    '+243 800 123 456',
    'demo@schoolconnect.com',
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- Create sample classes
INSERT INTO public.classes (id, school_id, name, level, capacity) VALUES
    ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '6eme A', '6eme', 30),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '5eme A', '5eme', 30)
ON CONFLICT (id) DO NOTHING;

-- Create sample students
INSERT INTO public.students (id, school_id, class_id, first_name, last_name, student_id, is_active) VALUES
    ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Jean', 'Kasongo', 'STU001', TRUE),
    ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Marie', 'Mukendi', 'STU002', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Grant full access to platform admin by updating RLS policies
-- The existing RLS policies already handle platform_admin access
-- Platform admin can see all data across all schools

-- Verification queries
SELECT 
    u.email,
    u.full_name,
    u.role,
    s.name as school_name
FROM public.users u
LEFT JOIN public.schools s ON u.school_id = s.id
WHERE u.email = 'deniskasala17@gmail.com';

-- Test RLS policies for platform admin
SELECT COUNT(*) FROM public.schools; -- Should return all schools
SELECT COUNT(*) FROM public.users; -- Should return all users
SELECT COUNT(*) FROM public.classes; -- Should return all classes
SELECT COUNT(*) FROM public.students; -- Should return all students;
