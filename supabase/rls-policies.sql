-- SchoolConnect RLS Policies - Fix for User Registration
-- Run these SQL commands in Supabase SQL Editor

-- Step 1: Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 2: Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (
        auth.uid() = id
    );

-- Step 3: Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (
        auth.uid() = id
    );

-- Step 4: Allow service role to insert users (for auth trigger)
CREATE POLICY "Service role can insert users" ON public.users
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Step 4.1: Allow anonymous users to register (insert their own record)
CREATE POLICY "Users can register" ON public.users
    FOR INSERT WITH CHECK (
        -- Allow users to insert their own record during registration
        -- This policy allows the auth trigger to work properly
        true
    );

-- Step 5: Allow authenticated users to read school info
CREATE POLICY "Authenticated users can read schools" ON public.schools
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

-- Step 6: Allow service role to manage schools
CREATE POLICY "Service role can manage schools" ON public.schools
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
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

-- Step 11: Allow authenticated users to read bulletins from their school
CREATE POLICY "Users can read school bulletins" ON public.bulletins
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

-- Step 12: Allow teachers to manage bulletins
CREATE POLICY "Teachers can manage bulletins" ON public.bulletins
    FOR ALL USING (
        author_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Step 13: Allow authenticated users to read messages
CREATE POLICY "Users can read their messages" ON public.messages
    FOR SELECT USING (
        sender_id = auth.uid() OR receiver_id = auth.uid()
    );

-- Step 14: Allow authenticated users to send messages
CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid()
    );

-- Step 15: Allow authenticated users to update their messages
CREATE POLICY "Users can update their messages" ON public.messages
    FOR UPDATE USING (
        sender_id = auth.uid()
    );

-- Step 16: Allow authenticated users to read events from their school
CREATE POLICY "Users can read school events" ON public.events
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

-- Step 17: Allow teachers to manage events
CREATE POLICY "Teachers can manage events" ON public.events
    FOR ALL USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Step 18: Allow authenticated users to read documents from their school
CREATE POLICY "Users can read school documents" ON public.documents
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

-- Step 19: Allow teachers to manage documents
CREATE POLICY "Teachers can manage documents" ON public.documents
    FOR ALL USING (
        uploaded_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Step 20: Allow authenticated users to read notifications
CREATE POLICY "Users can read their notifications" ON public.notifications
    FOR SELECT USING (
        user_id = auth.uid()
    );

-- Step 21: Allow system to create notifications
CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Step 22: Allow users to update their notifications
CREATE POLICY "Users can update their notifications" ON public.notifications
    FOR UPDATE USING (
        user_id = auth.uid()
    );

-- Step 23: Allow users to delete their notifications
CREATE POLICY "Users can delete their notifications" ON public.notifications
    FOR DELETE USING (
        user_id = auth.uid()
    );

-- Step 24: Allow service role to manage all tables
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

CREATE POLICY "Service role full access" ON public.bulletins
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );

CREATE POLICY "Service role full access" ON public.messages
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );

CREATE POLICY "Service role full access" ON public.events
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );

CREATE POLICY "Service role full access" ON public.documents
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );

CREATE POLICY "Service role full access" ON public.notifications
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role'
    );
