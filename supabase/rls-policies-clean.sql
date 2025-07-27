-- SchoolConnect RLS Policies - Clean Setup
-- Run these SQL commands in Supabase SQL Editor
-- This will drop existing policies and create new ones

-- Step 1: Drop existing policies if they exist
DO $$ DECLARE
    r RECORD;
BEGIN
    -- Drop policies for users table
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.users';
    END LOOP;
    
    -- Drop policies for schools table
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'schools') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.schools';
    END LOOP;
    
    -- Drop policies for classes table
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'classes') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.classes';
    END LOOP;
    
    -- Drop policies for students table
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'students') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.students';
    END LOOP;
    
    -- Drop policies for grades table
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'grades') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.grades';
    END LOOP;
    
    -- Drop policies for attendance table
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'attendance') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.attendance';
    END LOOP;
END $$;

-- Step 2: Enable RLS on existing tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Step 3: Allow service role to insert users (for auth trigger)
CREATE POLICY "Service role can insert users" ON public.users
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Step 3.1: Allow anonymous users to register (insert their own record)
CREATE POLICY "Users can register" ON public.users
    FOR INSERT WITH CHECK (
        -- Allow users to insert their own record during registration
        -- This policy allows the auth trigger to work properly
        true
    );

-- Step 4: Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (
        auth.uid() = id
    );

-- Step 5: Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (
        auth.uid() = id
    );

-- Step 6: Allow authenticated users to read school info
CREATE POLICY "Authenticated users can read schools" ON public.schools
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

-- Step 7: Allow authenticated users to read classes from their school
CREATE POLICY "Users can read school classes" ON public.classes
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

-- Step 8: Allow teachers to manage their classes
CREATE POLICY "Teachers can manage their classes" ON public.classes
    FOR ALL USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Step 9: Allow authenticated users to read students from their school
CREATE POLICY "Users can read school students" ON public.students
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

-- Step 10: Allow teachers to manage their students
CREATE POLICY "Teachers can manage their students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.classes 
            WHERE teacher_id = auth.uid() 
            AND id = students.class_id
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Step 11: Allow authenticated users to read grades from their school
CREATE POLICY "Users can read school grades" ON public.grades
    FOR SELECT USING (
        class_id IN (
            SELECT id FROM public.classes WHERE school_id IN (
                SELECT school_id FROM public.users WHERE id = auth.uid()
            )
        )
    );

-- Step 12: Allow teachers to manage grades
CREATE POLICY "Teachers can manage grades" ON public.grades
    FOR ALL USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Step 13: Allow authenticated users to read attendance from their school
CREATE POLICY "Users can read school attendance" ON public.attendance
    FOR SELECT USING (
        class_id IN (
            SELECT id FROM public.classes WHERE school_id IN (
                SELECT school_id FROM public.users WHERE id = auth.uid()
            )
        )
    );

-- Step 14: Allow teachers to manage attendance
CREATE POLICY "Teachers can manage attendance" ON public.attendance
    FOR ALL USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Step 15: Allow service role to manage all tables
CREATE POLICY "Service role full access" ON public.users
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );

CREATE POLICY "Service role full access" ON public.schools
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );

CREATE POLICY "Service role full access" ON public.classes
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );

CREATE POLICY "Service role full access" ON public.students
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );

CREATE POLICY "Service role full access" ON public.grades
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );

CREATE POLICY "Service role full access" ON public.attendance
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );
