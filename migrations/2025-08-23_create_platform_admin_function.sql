-- Helper function to create the first platform admin user
-- This function should be called after user registration to set up the initial admin

BEGIN;

-- Function to promote a user to platform admin (for initial setup)
CREATE OR REPLACE FUNCTION public.create_platform_admin(
  user_email text,
  user_full_name text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  user_exists boolean;
BEGIN
  -- Check if user exists in auth.users
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found in auth.users', user_email;
  END IF;
  
  -- Check if user already exists in public.users
  SELECT EXISTS(SELECT 1 FROM public.users WHERE id = user_id) INTO user_exists;
  
  IF user_exists THEN
    -- Update existing user to platform admin
    UPDATE public.users 
    SET 
      role = 'platform_admin',
      approved = true,
      full_name = COALESCE(user_full_name, full_name),
      updated_at = now()
    WHERE id = user_id;
    
    RAISE NOTICE 'Updated existing user % to platform admin', user_email;
  ELSE
    -- Insert new user as platform admin
    INSERT INTO public.users (
      id,
      email,
      full_name,
      role,
      approved,
      school_id
    ) VALUES (
      user_id,
      user_email,
      COALESCE(user_full_name, user_email),
      'platform_admin',
      true,
      NULL -- Platform admins are not tied to a specific school
    );
    
    RAISE NOTICE 'Created new platform admin user %', user_email;
  END IF;
  
  RETURN user_id;
END;
$$;

-- Function to create a school and its admin user
CREATE OR REPLACE FUNCTION public.create_school_with_admin(
  school_name text,
  school_code text,
  admin_email text,
  admin_full_name text,
  school_address text DEFAULT NULL,
  school_phone text DEFAULT NULL,
  school_email text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  school_id uuid;
  admin_user_id uuid;
  result jsonb;
BEGIN
  -- Check if user exists in auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email;
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Admin user with email % not found in auth.users. User must register first.', admin_email;
  END IF;
  
  -- Create the school
  INSERT INTO public.schools (
    name,
    code,
    address,
    phone,
    email,
    status
  ) VALUES (
    school_name,
    school_code,
    school_address,
    school_phone,
    COALESCE(school_email, admin_email),
    'active'
  )
  RETURNING id INTO school_id;
  
  -- Create or update the admin user
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    school_id,
    approved
  ) VALUES (
    admin_user_id,
    admin_email,
    admin_full_name,
    'school_admin',
    school_id,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'school_admin',
    school_id = EXCLUDED.school_id,
    approved = true,
    full_name = EXCLUDED.full_name,
    updated_at = now();
  
  -- Return result
  SELECT jsonb_build_object(
    'school_id', school_id,
    'school_name', school_name,
    'school_code', school_code,
    'admin_user_id', admin_user_id,
    'admin_email', admin_email
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_platform_admin(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_school_with_admin(text, text, text, text, text, text, text) TO authenticated;

COMMIT;
