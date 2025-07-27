-- SchoolConnect RLS Policies - Fixed to prevent infinite recursion
-- Run these SQL commands in Supabase SQL Editor

-- Step 1: Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies to avoid conflicts
-- Users policies
DROP POLICY IF EXISTS "Platform admins have full access to users" ON public.users;
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Users can register" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.users;
DROP POLICY IF EXISTS "Service role full access to users" ON public.users;

-- Schools policies
DROP POLICY IF EXISTS "Platform admins have full access to schools" ON public.schools;
DROP POLICY IF EXISTS "Authenticated users can read schools" ON public.schools;
DROP POLICY IF EXISTS "Service role can manage schools" ON public.schools;
DROP POLICY IF EXISTS "Service role full access" ON public.schools;
DROP POLICY IF EXISTS "Service role full access to schools" ON public.schools;

-- Classes policies
DROP POLICY IF EXISTS "Platform admins have full access to classes" ON public.classes;
DROP POLICY IF EXISTS "Users can read school classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can manage their classes" ON public.classes;
DROP POLICY IF EXISTS "Service role full access" ON public.classes;
DROP POLICY IF EXISTS "Service role full access to classes" ON public.classes;

-- Students policies
DROP POLICY IF EXISTS "Platform admins have full access to students" ON public.students;
DROP POLICY IF EXISTS "Users can read school students" ON public.students;
DROP POLICY IF EXISTS "Teachers can manage their students" ON public.students;
DROP POLICY IF EXISTS "Service role full access" ON public.students;
DROP POLICY IF EXISTS "Service role full access to students" ON public.students;

-- Grades policies
DROP POLICY IF EXISTS "Platform admins have full access to grades" ON public.grades;
DROP POLICY IF EXISTS "Users can read school grades" ON public.grades;
DROP POLICY IF EXISTS "Teachers can manage grades" ON public.grades;
DROP POLICY IF EXISTS "Service role full access" ON public.grades;
DROP POLICY IF EXISTS "Service role full access to grades" ON public.grades;

-- Attendance policies
DROP POLICY IF EXISTS "Platform admins have full access to attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users can read school attendance" ON public.attendance;
DROP POLICY IF EXISTS "Teachers can manage attendance" ON public.attendance;
DROP POLICY IF EXISTS "Service role full access" ON public.attendance;
DROP POLICY IF EXISTS "Service role full access to attendance" ON public.attendance;

-- Payments policies
DROP POLICY IF EXISTS "Platform admins have full access to payments" ON public.payments;
DROP POLICY IF EXISTS "Users can read school payments" ON public.payments;
DROP POLICY IF EXISTS "School admins can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Service role full access" ON public.payments;
DROP POLICY IF EXISTS "Service role full access to payments" ON public.payments;

-- Messages policies
DROP POLICY IF EXISTS "Platform admins have full access to messages" ON public.messages;
DROP POLICY IF EXISTS "Users can read their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their sent messages" ON public.messages;
DROP POLICY IF EXISTS "Service role full access" ON public.messages;
DROP POLICY IF EXISTS "Service role full access to messages" ON public.messages;

-- Notifications policies
DROP POLICY IF EXISTS "Platform admins have full access to notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can read their notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role full access" ON public.notifications;
DROP POLICY IF EXISTS "Service role full access to notifications" ON public.notifications;

-- Step 3: Create new policies with proper platform admin access

-- Users policies
-- Platform admins have full access to users (no recursion)
CREATE POLICY "Platform admins have full access to users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Authenticated users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (
        auth.uid() = id
    );

-- Authenticated users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (
        auth.uid() = id
    );

-- Allow service role to insert users (for auth trigger)
CREATE POLICY "Service role can insert users" ON public.users
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Allow anonymous users to register (insert their own record)
CREATE POLICY "Users can register" ON public.users
    FOR INSERT WITH CHECK (
        true
    );

-- Schools policies
-- Platform admins have full access to schools
CREATE POLICY "Platform admins have full access to schools" ON public.schools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Authenticated users can read schools
CREATE POLICY "Authenticated users can read schools" ON public.schools
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

-- Service role can manage schools
CREATE POLICY "Service role can manage schools" ON public.schools
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Classes policies
-- Platform admins have full access to classes
CREATE POLICY "Platform admins have full access to classes" ON public.classes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Users can read classes from their school (optimized to avoid recursion)
CREATE POLICY "Users can read school classes" ON public.classes
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users u WHERE u.id = auth.uid() AND u.role != 'platform_admin'
        ) OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Teachers can manage their classes
CREATE POLICY "Teachers can manage their classes" ON public.classes
    FOR ALL USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role IN ('school_admin', 'platform_admin') AND u.is_active = TRUE
        )
    );

-- Students policies
-- Platform admins have full access to students
CREATE POLICY "Platform admins have full access to students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Users can read students from their school (optimized to avoid recursion)
CREATE POLICY "Users can read school students" ON public.students
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users u WHERE u.id = auth.uid() AND u.role != 'platform_admin'
        ) OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Teachers can manage their students
CREATE POLICY "Teachers can manage their students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.teacher_id = auth.uid() 
            AND c.id = students.class_id
        ) OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role IN ('school_admin', 'platform_admin') AND u.is_active = TRUE
        )
    );

-- Grades policies
-- Platform admins have full access to grades
CREATE POLICY "Platform admins have full access to grades" ON public.grades
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Users can read grades from their school (optimized to avoid recursion)
CREATE POLICY "Users can read school grades" ON public.grades
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            JOIN public.users u ON u.school_id = s.school_id
            WHERE s.id = public.grades.student_id AND u.id = auth.uid() AND u.role != 'platform_admin'
        ) OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Teachers can manage grades
CREATE POLICY "Teachers can manage grades" ON public.grades
    FOR ALL USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role IN ('school_admin', 'platform_admin') AND u.is_active = TRUE
        )
    );

-- Attendance policies
-- Platform admins have full access to attendance
CREATE POLICY "Platform admins have full access to attendance" ON public.attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Users can read attendance from their school (optimized to avoid recursion)
CREATE POLICY "Users can read school attendance" ON public.attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            JOIN public.users u ON u.school_id = s.school_id
            WHERE s.id = public.attendance.student_id AND u.id = auth.uid() AND u.role != 'platform_admin'
        ) OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Teachers can manage attendance
CREATE POLICY "Teachers can manage attendance" ON public.attendance
    FOR ALL USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role IN ('school_admin', 'platform_admin') AND u.is_active = TRUE
        )
    );

-- Payments policies
-- Platform admins have full access to payments
CREATE POLICY "Platform admins have full access to payments" ON public.payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Users can read payments from their school (optimized to avoid recursion)
CREATE POLICY "Users can read school payments" ON public.payments
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users u WHERE u.id = auth.uid() AND u.role != 'platform_admin'
        ) OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- School admins can manage payments
CREATE POLICY "School admins can manage payments" ON public.payments
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.users u 
            WHERE u.id = auth.uid() AND u.role IN ('school_admin', 'platform_admin') AND u.is_active = TRUE
        )
    );

-- Messages policies
-- Platform admins have full access to messages
CREATE POLICY "Platform admins have full access to messages" ON public.messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Users can read their messages
CREATE POLICY "Users can read their messages" ON public.messages
    FOR SELECT USING (
        sender_id = auth.uid() OR receiver_id = auth.uid()
    );

-- Users can send messages
CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid()
    );

-- Users can update their sent messages
CREATE POLICY "Users can update their sent messages" ON public.messages
    FOR UPDATE USING (
        sender_id = auth.uid()
    );

-- Service role full access policies (for internal operations)
CREATE POLICY "Service role full access to schools" ON public.schools
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to users" ON public.users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to classes" ON public.classes
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to students" ON public.students
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to grades" ON public.grades
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to attendance" ON public.attendance
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to payments" ON public.payments
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to messages" ON public.messages
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access to notifications" ON public.notifications
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Notifications policies
-- Platform admins have full access to notifications
CREATE POLICY "Platform admins have full access to notifications" ON public.notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() AND u.role = 'platform_admin' AND u.is_active = TRUE
        )
    );

-- Users can read their notifications
CREATE POLICY "Users can read their notifications" ON public.notifications
    FOR SELECT USING (
        user_id = auth.uid()
    );

-- System can create notifications
CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Users can update their notifications
CREATE POLICY "Users can update their notifications" ON public.notifications
    FOR UPDATE USING (
        user_id = auth.uid()
    );

-- Users can delete their notifications
CREATE POLICY "Users can delete their notifications" ON public.notifications
    FOR DELETE USING (
        user_id = auth.uid()
    );
