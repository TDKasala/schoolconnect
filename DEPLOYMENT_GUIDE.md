# Supabase Schema Deployment Guide

## Overview
This guide explains how to deploy the clean initial schema for SchoolConnect to your production Supabase instance.

## Prerequisites
- Supabase project created at [supabase.com](https://supabase.com)
- Supabase CLI installed: `npm install -g supabase`
- Project linked to your Supabase instance

## Schema Files
The initial clean schema consists of 3 migration files:

1. **`2025-08-23_initial_clean_schema.sql`** - Core tables and structure
2. **`2025-08-23_enable_rls_clean.sql`** - Row Level Security policies  
3. **`2025-08-23_create_platform_admin_function.sql`** - Helper functions

## Deployment Steps

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Execute each migration file in order:
   - Copy and paste the content of `2025-08-23_initial_clean_schema.sql`
   - Click **Run** and verify success
   - Repeat for the other two files in order

### Option 2: Using Supabase CLI
```bash
# Link your project (if not already done)
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations to remote
supabase db push
```

## Post-Deployment Setup

### 1. Create First Platform Admin
After deployment, create your first platform admin user:

```sql
-- Replace with your actual admin email
SELECT public.create_platform_admin('admin@yourschool.cd', 'Admin Name');
```

### 2. Create Test School (Optional)
```sql
-- Create a test school with admin
SELECT public.create_school_with_admin(
  'Test School',           -- school_name
  'TEST001',              -- school_code
  'schooladmin@test.cd',  -- admin_email (must exist in auth.users)
  'School Administrator', -- admin_full_name
  '123 School Street',    -- school_address
  '+243123456789',        -- school_phone
  'contact@testschool.cd' -- school_email
);
```

## Schema Structure

### Core Tables
- **schools**: School entities with basic info and settings
- **users**: User profiles linked to schools with roles
- **roles**: System roles with permissions (platform_admin, school_admin, teacher, parent)
- **platform_settings**: Global configuration and feature flags

### Key Relationships
- `users.school_id` → `schools.id` (users belong to schools)
- `users.role` → `roles.name` (users have roles)

### Security (RLS)
- Users can only see/update their own profile
- School admins can manage users in their school
- Platform admins can manage all data
- All tables have RLS enabled with safe defaults

## Environment Variables
Ensure your frontend has these environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Verification
After deployment, verify the schema:

1. Check tables exist in **Database > Tables**
2. Verify RLS policies in **Authentication > Policies**
3. Test user registration and role assignment
4. Confirm helper functions work in **SQL Editor**

## Next Steps
This is Step 1 of the phased rebuild. Future phases will add:
- Student and teacher entities
- Classes and academic structures
- Attendance and grading systems
- Financial management
- Parent portal features

## Troubleshooting

### Common Issues
- **Foreign key errors**: Ensure auth.users table exists (automatic in Supabase)
- **Permission errors**: Check RLS policies are correctly applied
- **Function errors**: Verify functions have proper SECURITY DEFINER

### Rollback
If needed, you can drop all tables and start over:
```sql
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.schools CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.platform_settings CASCADE;
```

## Support
For issues with this schema deployment, check:
1. Supabase logs in your dashboard
2. PostgreSQL error messages
3. RLS policy conflicts
