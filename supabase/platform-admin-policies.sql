-- Platform Admin Full Access Policies
-- This script adds comprehensive platform admin policies to all tables

-- Drop existing platform admin policies if they exist
DROP POLICY IF EXISTS "Platform admins have full access to schools" ON public.schools;
DROP POLICY IF EXISTS "Platform admins have full access to users" ON public.users;
DROP POLICY IF EXISTS "Platform admins have full access to classes" ON public.classes;
DROP POLICY IF EXISTS "Platform admins have full access to students" ON public.students;
DROP POLICY IF EXISTS "Platform admins have full access to grades" ON public.grades;
DROP POLICY IF EXISTS "Platform admins have full access to attendance" ON public.attendance;
DROP POLICY IF EXISTS "Platform admins have full access to payments" ON public.payments;
DROP POLICY IF EXISTS "Platform admins have full access to messages" ON public.messages;
DROP POLICY IF EXISTS "Platform admins have full access to notifications" ON public.notifications;

-- Create platform admin policies for all tables
-- Schools
CREATE POLICY "Platform admins have full access to schools" ON public.schools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

-- Users
CREATE POLICY "Platform admins have full access to users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

-- Classes
CREATE POLICY "Platform admins have full access to classes" ON public.classes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

-- Students
CREATE POLICY "Platform admins have full access to students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

-- Grades
CREATE POLICY "Platform admins have full access to grades" ON public.grades
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

-- Attendance
CREATE POLICY "Platform admins have full access to attendance" ON public.attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

-- Payments
CREATE POLICY "Platform admins have full access to payments" ON public.payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

-- Messages
CREATE POLICY "Platform admins have full access to messages" ON public.messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

-- Notifications
CREATE POLICY "Platform admins have full access to notifications" ON public.notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

-- Verify platform admin policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE policyname LIKE '%Platform admins%'
ORDER BY tablename, policyname;
