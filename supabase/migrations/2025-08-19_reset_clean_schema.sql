-- COMPLETE RESET AND REBUILD - Clean Schema
-- This migration drops everything and rebuilds with minimal, clean structure

BEGIN;

-- 1. DROP ALL EXISTING TABLES AND POLICIES
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.grades CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.schools CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;

-- Drop all functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- 2. CREATE CORE TABLES ONLY

-- Contact messages table (for public contact form)
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('new', 'read', 'replied')) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (core user data)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('platform_admin', 'school_admin', 'teacher', 'parent')) NOT NULL DEFAULT 'teacher',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schools table (minimal for now)
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. CREATE TRIGGERS
CREATE TRIGGER update_contact_messages_updated_at 
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at 
    BEFORE UPDATE ON public.schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. CREATE PROFILE CREATION FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, is_approved)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'teacher'),
        FALSE -- Always start as unapproved
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't break auth
        RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. CREATE AUTH TRIGGER
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. ENABLE RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- 8. CREATE MINIMAL RLS POLICIES

-- Contact messages: Only platform admins can read
CREATE POLICY "Platform admins can manage contact messages" ON public.contact_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() 
            AND role = 'platform_admin' 
            AND is_approved = true
        )
    );

-- Anyone can insert contact messages (public form)
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Profiles: Users can read their own, platform admins can read all
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Platform admins can read all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() 
            AND role = 'platform_admin' 
            AND is_approved = true
        )
    );

-- Users can insert their own profile (handled by trigger)
CREATE POLICY "Users can create own profile" ON public.profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- Users can update their own non-critical fields
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() 
        AND OLD.role = NEW.role  -- Can't change role
        AND OLD.is_approved = NEW.is_approved  -- Can't change approval
    );

-- Platform admins can update any profile (including approval)
CREATE POLICY "Platform admins can update any profile" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() 
            AND role = 'platform_admin' 
            AND is_approved = true
        )
    );

-- Schools: Platform admins can manage
CREATE POLICY "Platform admins can manage schools" ON public.schools
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() 
            AND role = 'platform_admin' 
            AND is_approved = true
        )
    );

-- 9. CREATE INDEXES
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_approved ON public.profiles(is_approved);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);

-- 10. INSERT DEFAULT PLATFORM ADMIN (if needed)
-- This will be handled separately or manually

COMMIT;
