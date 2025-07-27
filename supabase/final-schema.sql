-- SchoolConnect Database Schema - Final Corrected Version
-- Run this SQL in Supabase SQL Editor

-- Step 1: Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create schools table first (no dependencies)
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    country TEXT DEFAULT 'RDC',
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    subscription_type TEXT CHECK (subscription_type IN ('flex', 'forfait')) DEFAULT 'flex',
    max_students INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('platform_admin', 'school_admin', 'teacher', 'parent')) NOT NULL DEFAULT 'teacher',
    school_id UUID REFERENCES public.schools(id),
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3.1: Drop existing triggers and functions if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;
DROP TRIGGER IF EXISTS update_schools_updated_at ON public.schools;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_classes_updated_at ON public.classes;
DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
DROP TRIGGER IF EXISTS update_grades_updated_at ON public.grades;
DROP TRIGGER IF EXISTS update_attendance_updated_at ON public.attendance;
DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
DROP FUNCTION IF EXISTS update_updated_at_column;

-- Step 3.2: Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SET search_path = ''
AS $$
BEGIN
    -- Insert user record with proper error handling
    INSERT INTO public.users (id, email, full_name, role, school_id)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', COALESCE(new.raw_user_meta_data->>'name', 'Utilisateur')),
        COALESCE(new.raw_user_meta_data->>'role', 'teacher'),
        CASE 
            WHEN new.raw_user_meta_data->>'school_id' IS NOT NULL AND new.raw_user_meta_data->>'school_id' != '' 
            THEN (new.raw_user_meta_data->>'school_id')::UUID 
            ELSE NULL 
        END
    );
    RETURN new;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error and still return new to not break auth
        RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
        RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3.3: Create trigger to automatically create user record
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    section TEXT,
    capacity INTEGER DEFAULT 30,
    teacher_id UUID REFERENCES public.users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create students table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('M', 'F')),
    parent_email TEXT,
    parent_phone TEXT,
    address TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    student_id TEXT UNIQUE NOT NULL,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create grades table
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    grade DECIMAL(4,2) CHECK (grade >= 0 AND grade <= 20),
    evaluation_type TEXT CHECK (evaluation_type IN ('devoir', 'interrogation', 'composition', 'examen')),
    teacher_id UUID REFERENCES public.users(id) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')) NOT NULL,
    teacher_id UUID REFERENCES public.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date, class_id)
);

-- Step 8: Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('school_fee', 'registration', 'other')) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
    due_date DATE NOT NULL,
    paid_date DATE,
    description TEXT,
    reference_number TEXT UNIQUE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 9: Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('direct', 'group', 'announcement')) DEFAULT 'direct',
    subject TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 10: Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('grade_update', 'attendance', 'payment', 'message', 'announcement')) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_id UUID,
    related_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 11: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_school_id ON public.users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON public.students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON public.classes(school_id);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON public.grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_class_id ON public.grades(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_payments_school_id ON public.payments(school_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Step 12: Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON public.attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 13: Enable Row Level Security (RLS)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 14: Drop existing RLS policies if they exist
-- Platform admin policies
DROP POLICY IF EXISTS "Platform admins have full access to schools" ON public.schools;
DROP POLICY IF EXISTS "Platform admins have full access to users" ON public.users;
DROP POLICY IF EXISTS "Platform admins have full access to classes" ON public.classes;
DROP POLICY IF EXISTS "Platform admins have full access to students" ON public.students;
DROP POLICY IF EXISTS "Platform admins have full access to grades" ON public.grades;
DROP POLICY IF EXISTS "Platform admins have full access to attendance" ON public.attendance;
DROP POLICY IF EXISTS "Platform admins have full access to payments" ON public.payments;
DROP POLICY IF EXISTS "Platform admins have full access to messages" ON public.messages;
DROP POLICY IF EXISTS "Platform admins have full access to notifications" ON public.notifications;
-- Regular policies
DROP POLICY IF EXISTS "Schools are viewable by authenticated users" ON public.schools;
DROP POLICY IF EXISTS "School admins can update their school" ON public.schools;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "School members can view school users" ON public.users;
DROP POLICY IF EXISTS "Users can register" ON public.users;
DROP POLICY IF EXISTS "School members can view school classes" ON public.classes;
DROP POLICY IF EXISTS "School admins can manage classes" ON public.classes;
DROP POLICY IF EXISTS "School members can view school students" ON public.students;
DROP POLICY IF EXISTS "School admins can manage students" ON public.students;
DROP POLICY IF EXISTS "School members can view grades" ON public.grades;
DROP POLICY IF EXISTS "Teachers can manage grades" ON public.grades;
DROP POLICY IF EXISTS "School members can view attendance" ON public.attendance;
DROP POLICY IF EXISTS "Teachers can manage attendance" ON public.attendance;
DROP POLICY IF EXISTS "School members can view payments" ON public.payments;
DROP POLICY IF EXISTS "School admins can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their sent messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;

-- Step 15: Create RLS Policies (simplified and working)

-- Schools policies
CREATE POLICY "Platform admins have full access to schools" ON public.schools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

CREATE POLICY "Schools are viewable by authenticated users" ON public.schools
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "School admins can update their school" ON public.schools
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'school_admin' 
            AND school_id = public.schools.id
        )
    );

-- Users policies
CREATE POLICY "Platform admins have full access to users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

CREATE POLICY "Users can register" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "School members can view school users" ON public.users
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

-- Classes policies
CREATE POLICY "Platform admins have full access to classes" ON public.classes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

CREATE POLICY "School members can view school classes" ON public.classes
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

CREATE POLICY "School admins can manage classes" ON public.classes
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.users 
            WHERE id = auth.uid() AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Students policies
CREATE POLICY "Platform admins have full access to students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

CREATE POLICY "School members can view school students" ON public.students
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

CREATE POLICY "School admins can manage students" ON public.students
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.users 
            WHERE id = auth.uid() AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Grades policies
CREATE POLICY "Platform admins have full access to grades" ON public.grades
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

CREATE POLICY "School members can view grades" ON public.grades
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            JOIN public.users u ON u.school_id = s.school_id
            WHERE s.id = public.grades.student_id AND u.id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage grades" ON public.grades
    FOR ALL USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Attendance policies
CREATE POLICY "Platform admins have full access to attendance" ON public.attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

CREATE POLICY "School members can view attendance" ON public.attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students s
            JOIN public.users u ON u.school_id = s.school_id
            WHERE s.id = public.attendance.student_id AND u.id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage attendance" ON public.attendance
    FOR ALL USING (
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Payments policies
CREATE POLICY "Platform admins have full access to payments" ON public.payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

CREATE POLICY "School members can view payments" ON public.payments
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.users WHERE id = auth.uid()
        )
    );

CREATE POLICY "School admins can manage payments" ON public.payments
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.users 
            WHERE id = auth.uid() AND role IN ('school_admin', 'platform_admin')
        )
    );

-- Messages policies
CREATE POLICY "Platform admins have full access to messages" ON public.messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

CREATE POLICY "Users can view their messages" ON public.messages
    FOR SELECT USING (
        sender_id = auth.uid() OR receiver_id = auth.uid()
    );

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their sent messages" ON public.messages
    FOR UPDATE USING (sender_id = auth.uid());

-- Notifications policies
CREATE POLICY "Platform admins have full access to notifications" ON public.notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'platform_admin'
        )
    );

CREATE POLICY "Users can view their notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Note: User creation function and trigger are already created in Step 3.2-3.3 above
