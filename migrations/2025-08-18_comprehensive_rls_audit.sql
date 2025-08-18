-- Comprehensive RLS Policy Audit and Fix
-- This migration addresses RLS policy conflicts and ensures proper data access

BEGIN;

-- 1. USERS TABLE - Fix existing policies and add missing ones
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can select their own profile" ON public.users;
DROP POLICY IF EXISTS "Platform admins can select all users" ON public.users;
DROP POLICY IF EXISTS "Platform admins can update users" ON public.users;

-- Users can read their own profile
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Platform admins can read all users
CREATE POLICY "users_select_platform_admin" ON public.users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

-- Platform admins can update users (including approval status)
CREATE POLICY "users_update_platform_admin" ON public.users
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

-- Users can update their own non-critical fields
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    -- Prevent users from changing their own role or approval status
    role = (SELECT role FROM public.users WHERE id = auth.uid()) AND
    approved = (SELECT approved FROM public.users WHERE id = auth.uid())
  );

-- 2. SCHOOLS TABLE - Add proper RLS policies
ALTER TABLE IF EXISTS public.schools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "schools_select_all" ON public.schools;
DROP POLICY IF EXISTS "schools_manage_platform_admin" ON public.schools;

-- Everyone can read schools (for registration purposes)
CREATE POLICY "schools_select_all" ON public.schools
  FOR SELECT TO authenticated
  USING (true);

-- Platform admins can manage all schools
CREATE POLICY "schools_manage_platform_admin" ON public.schools
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

-- 3. STUDENTS TABLE - School-scoped access
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students_school_access" ON public.students;
DROP POLICY IF EXISTS "students_platform_admin" ON public.students;

-- School admins and teachers can access students in their school
CREATE POLICY "students_school_access" ON public.students
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.school_id = students.school_id
      AND u.role IN ('school_admin', 'teacher')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.school_id = students.school_id
      AND u.role IN ('school_admin', 'teacher')
    )
  );

-- Platform admins can access all students
CREATE POLICY "students_platform_admin" ON public.students
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

-- Parents can view their own children (when parent_id column exists)
-- CREATE POLICY "students_parent_access" ON public.students
--   FOR SELECT TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.users u
--       WHERE u.id = auth.uid() 
--       AND u.role = 'parent'
--       AND students.parent_id = u.id
--     )
--   );

-- 4. CLASSES TABLE - School-scoped access
ALTER TABLE IF EXISTS public.classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "classes_school_access" ON public.classes;
DROP POLICY IF EXISTS "classes_platform_admin" ON public.classes;

-- School users can access classes in their school
CREATE POLICY "classes_school_access" ON public.classes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.school_id = classes.school_id
      AND u.role IN ('school_admin', 'teacher')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.school_id = classes.school_id
      AND u.role IN ('school_admin', 'teacher')
    )
  );

-- Platform admins can access all classes
CREATE POLICY "classes_platform_admin" ON public.classes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

-- 5. GRADES TABLE - Restricted access
ALTER TABLE IF EXISTS public.grades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "grades_teacher_access" ON public.grades;
DROP POLICY IF EXISTS "grades_school_admin_access" ON public.grades;
DROP POLICY IF EXISTS "grades_platform_admin" ON public.grades;

-- Teachers can manage grades for their classes
CREATE POLICY "grades_teacher_access" ON public.grades
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.classes c ON c.teacher_id = u.id
      JOIN public.students s ON s.class_id = c.id
      WHERE u.id = auth.uid() 
      AND u.role = 'teacher'
      AND s.id = grades.student_id
    )
  );

-- School admins can view all grades in their school
CREATE POLICY "grades_school_admin_access" ON public.grades
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.students s ON s.school_id = u.school_id
      WHERE u.id = auth.uid() 
      AND u.role = 'school_admin'
      AND s.id = grades.student_id
    )
  );

-- Platform admins can access all grades
CREATE POLICY "grades_platform_admin" ON public.grades
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

-- 6. ATTENDANCE TABLE - Similar to grades
ALTER TABLE IF EXISTS public.attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attendance_teacher_access" ON public.attendance;
DROP POLICY IF EXISTS "attendance_school_admin_access" ON public.attendance;
DROP POLICY IF EXISTS "attendance_platform_admin" ON public.attendance;

-- Teachers can manage attendance for their classes
CREATE POLICY "attendance_teacher_access" ON public.attendance
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.classes c ON c.teacher_id = u.id
      JOIN public.students s ON s.class_id = c.id
      WHERE u.id = auth.uid() 
      AND u.role = 'teacher'
      AND s.id = attendance.student_id
    )
  );

-- School admins can view all attendance in their school
CREATE POLICY "attendance_school_admin_access" ON public.attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.students s ON s.school_id = u.school_id
      WHERE u.id = auth.uid() 
      AND u.role = 'school_admin'
      AND s.id = attendance.student_id
    )
  );

-- Platform admins can access all attendance
CREATE POLICY "attendance_platform_admin" ON public.attendance
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

-- 7. MESSAGES TABLE - Communication access
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_participants" ON public.messages;
DROP POLICY IF EXISTS "messages_school_admin" ON public.messages;
DROP POLICY IF EXISTS "messages_platform_admin" ON public.messages;

-- Users can access messages they sent or received
CREATE POLICY "messages_participants" ON public.messages
  FOR ALL TO authenticated
  USING (
    sender_id = auth.uid() OR 
    receiver_id = auth.uid() OR
    -- For group messages, check if user is in the same school
    EXISTS (
      SELECT 1 FROM public.users u1, public.users u2
      WHERE u1.id = auth.uid() 
      AND u2.id = messages.sender_id
      AND u1.school_id = u2.school_id
      AND u1.school_id IS NOT NULL
    )
  );

-- School admins can view messages in their school
CREATE POLICY "messages_school_admin" ON public.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.role = 'school_admin'
      AND (
        EXISTS (SELECT 1 FROM public.users s WHERE s.id = messages.sender_id AND s.school_id = u.school_id) OR
        EXISTS (SELECT 1 FROM public.users r WHERE r.id = messages.receiver_id AND r.school_id = u.school_id)
      )
    )
  );

-- Platform admins can access all messages
CREATE POLICY "messages_platform_admin" ON public.messages
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

-- 8. PAYMENTS TABLE - Financial data access
-- Keep existing RLS enabled, add proper policies

DROP POLICY IF EXISTS "payments_school_access" ON public.payments;
DROP POLICY IF EXISTS "payments_platform_admin" ON public.payments;

-- School admins can manage payments for their school
CREATE POLICY "payments_school_access" ON public.payments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.school_id = payments.school_id
      AND u.role = 'school_admin'
    )
  );

-- Platform admins can access all payments
CREATE POLICY "payments_platform_admin" ON public.payments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

-- 9. ACTIVITY_LOGS TABLE - Audit trail access
-- Keep existing RLS enabled, add proper policies

DROP POLICY IF EXISTS "activity_logs_school_access" ON public.activity_logs;
DROP POLICY IF EXISTS "activity_logs_platform_admin" ON public.activity_logs;

-- School admins can view activity logs for their school
CREATE POLICY "activity_logs_school_access" ON public.activity_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.school_id = activity_logs.school_id
      AND u.role = 'school_admin'
    )
  );

-- Platform admins can access all activity logs
CREATE POLICY "activity_logs_platform_admin" ON public.activity_logs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

-- 10. EVENTS TABLE - Calendar access
-- Keep existing RLS enabled, add proper policies

DROP POLICY IF EXISTS "events_school_access" ON public.events;
DROP POLICY IF EXISTS "events_platform_admin" ON public.events;

-- School users can access events for their school
CREATE POLICY "events_school_access" ON public.events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.school_id = events.school_id
      AND u.role IN ('school_admin', 'teacher', 'parent')
    )
  );

-- Platform admins can access all events
CREATE POLICY "events_platform_admin" ON public.events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'platform_admin'
    )
  );

COMMIT;
