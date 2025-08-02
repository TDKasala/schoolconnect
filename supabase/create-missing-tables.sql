-- Create Missing Tables for SchoolConnect Dashboard
-- This script creates the activity_logs and events tables that are required by the dashboard

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Activity Logs table
-- Tracks all user activities across the platform for audit and dashboard display
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- e.g., 'user_created', 'school_updated', 'payment_received', etc.
    target TEXT NOT NULL, -- Description of what was affected
    details JSONB, -- Additional structured data about the activity
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
-- Stores calendar events, meetings, exams, and other scheduled activities
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    event_type TEXT CHECK (event_type IN ('meeting', 'exam', 'activity', 'training', 'holiday', 'other')) DEFAULT 'other',
    is_all_day BOOLEAN DEFAULT FALSE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT, -- RRULE for recurring events
    attendees UUID[], -- Array of user IDs who should attend
    status TEXT CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')) DEFAULT 'scheduled',
    visibility TEXT CHECK (visibility IN ('public', 'school', 'class', 'private')) DEFAULT 'school',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_school_id ON public.activity_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);

CREATE INDEX IF NOT EXISTS idx_events_school_id ON public.events(school_id);
CREATE INDEX IF NOT EXISTS idx_events_class_id ON public.events(class_id);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON public.events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Activity Logs RLS Policies
CREATE POLICY "Platform admins can view all activity logs" ON public.activity_logs
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM public.users WHERE role = 'platform_admin')
    );

CREATE POLICY "School admins can view school activity logs" ON public.activity_logs
    FOR SELECT USING (
        school_id = (SELECT school_id FROM public.users WHERE id = auth.uid()) AND
        auth.uid() IN (SELECT id FROM public.users WHERE role IN ('school_admin', 'platform_admin'))
    );

CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK (TRUE);

-- Events RLS Policies
CREATE POLICY "Platform admins can manage all events" ON public.events
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM public.users WHERE role = 'platform_admin')
    );

CREATE POLICY "School members can view school events" ON public.events
    FOR SELECT USING (
        school_id = (SELECT school_id FROM public.users WHERE id = auth.uid()) OR
        visibility = 'public' OR
        auth.uid() = ANY(attendees)
    );

CREATE POLICY "School admins can manage school events" ON public.events
    FOR ALL USING (
        school_id = (SELECT school_id FROM public.users WHERE id = auth.uid()) AND
        auth.uid() IN (SELECT id FROM public.users WHERE role IN ('school_admin', 'platform_admin'))
    );

CREATE POLICY "Teachers can manage class events" ON public.events
    FOR ALL USING (
        class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid()) OR
        created_by = auth.uid()
    );

-- Add missing school_id column to messages table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'messages' AND column_name = 'school_id') THEN
        ALTER TABLE public.messages ADD COLUMN school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_messages_school_id ON public.messages(school_id);
    END IF;
END $$;

-- Add missing columns to payments table if they don't exist
DO $$ 
BEGIN
    -- Add payment_method column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'payments' AND column_name = 'payment_method') THEN
        ALTER TABLE public.payments ADD COLUMN payment_method TEXT CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'card', 'other')) DEFAULT 'cash';
    END IF;
    
    -- Add payment_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'payments' AND column_name = 'payment_date') THEN
        ALTER TABLE public.payments ADD COLUMN payment_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create function to automatically log activities
CREATE OR REPLACE FUNCTION log_activity(
    p_user_id UUID,
    p_school_id UUID,
    p_action TEXT,
    p_target TEXT,
    p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO public.activity_logs (user_id, school_id, action, target, details)
    VALUES (p_user_id, p_school_id, p_action, p_target, p_details)
    RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to events table
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.activity_logs TO authenticated;
GRANT ALL ON public.events TO authenticated;
GRANT EXECUTE ON FUNCTION log_activity TO authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at_column TO authenticated;

-- Insert some sample data for testing (optional - remove if not needed)
-- This will help populate the dashboard with some initial data

-- Sample activity logs
INSERT INTO public.activity_logs (user_id, school_id, action, target, details) 
SELECT 
    u.id,
    u.school_id,
    'user_login',
    'Connexion utilisateur: ' || u.full_name,
    jsonb_build_object('ip_address', '127.0.0.1', 'user_agent', 'Dashboard')
FROM public.users u
WHERE u.role = 'platform_admin'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Sample events
INSERT INTO public.events (school_id, created_by, title, description, start_date, end_date, location, event_type, status)
SELECT 
    s.id,
    u.id,
    'Réunion de rentrée',
    'Réunion de préparation pour la nouvelle année scolaire',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '2 hours',
    'Salle de conférence',
    'meeting',
    'scheduled'
FROM public.schools s
CROSS JOIN public.users u
WHERE u.role = 'platform_admin'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.events (school_id, created_by, title, description, start_date, end_date, location, event_type, status)
SELECT 
    s.id,
    u.id,
    'Examens du premier trimestre',
    'Période d''examens pour toutes les classes',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '21 days',
    'Toutes les salles de classe',
    'exam',
    'scheduled'
FROM public.schools s
CROSS JOIN public.users u
WHERE u.role = 'platform_admin'
LIMIT 1
ON CONFLICT DO NOTHING;

COMMIT;
