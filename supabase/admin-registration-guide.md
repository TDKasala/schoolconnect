# Platform Admin Registration Guide

## 🎯 Setting Up deniskasala17@gmail.com as Platform Admin

### 📋 **Method 1: Registration via App (Recommended)**

**Step 1: Register Through Your App**
1. **Go to your deployed app** (https://schoolconnect.vercel.app)
2. **Click "Register"** or go to `/register`
3. **Fill in the registration form:**
   - **Email:** deniskasala17@gmail.com
   - **Password:** @Raysunkasala2016
   - **Full Name:** Denis Kasala
   - **Role:** Select "Platform Admin"

**Step 2: Update Database Manually**
After registration, run this SQL in Supabase SQL Editor:

```sql
-- Update the registered user to platform admin
UPDATE public.users 
SET role = 'platform_admin', 
    school_id = NULL,
    updated_at = NOW()
WHERE email = 'deniskasala17@gmail.com';

-- Verify the update
SELECT id, email, full_name, role, school_id 
FROM public.users 
WHERE email = 'deniskasala17@gmail.com';
```

### 📋 **Method 2: Direct Database Insert (Alternative)**

**Step 1: Create Admin via SQL**
```sql
-- Insert platform admin directly
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    school_id,
    is_active,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'deniskasala17@gmail.com',
    'Denis Kasala',
    'platform_admin',
    NULL,
    TRUE,
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'platform_admin',
    updated_at = NOW();
```

### 📋 **Method 3: Using Supabase Auth + Manual Update**

**Step 1: Register via Supabase Auth**
```bash
# You can use Supabase CLI or API
curl -X POST 'https://urtsvqedsewswknyxvnw.supabase.co/auth/v1/signup' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "deniskasala17@gmail.com",
    "password": "@Raysunkasala2016",
    "data": {
      "full_name": "Denis Kasala",
      "role": "platform_admin"
    }
  }'
```

**Step 2: Update Role in Database**
```sql
UPDATE public.users 
SET role = 'platform_admin' 
WHERE email = 'deniskasala17@gmail.com';
```

### 🔐 **Platform Admin Privileges**

**As platform admin, you have:**
- ✅ **Full access** to all schools
- ✅ **User management** for all accounts
- ✅ **Database oversight** across entire platform
- ✅ **Configuration control** for system settings
- ✅ **Analytics and reporting** access

### 📊 **Verification Steps**

**After setup, verify:**
1. **Login works** with your credentials
2. **Platform admin dashboard** displays correctly
3. **All schools visible** in admin interface
4. **User management** accessible
5. **System settings** available

### 🚀 **Quick Setup Commands**

**Run this SQL in Supabase SQL Editor:**

```sql
-- Create sample data for testing
INSERT INTO public.schools (id, name, address, city, province, phone, email, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'École de Démonstration', '123 Avenue', 'Kinshasa', 'Kinshasa', '+243800123456', 'demo@schoolconnect.com', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Create platform admin user
INSERT INTO public.users (id, email, full_name, role, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'deniskasala17@gmail.com', 'Denis Kasala', 'platform_admin', TRUE)
ON CONFLICT (id) DO UPDATE SET role = 'platform_admin';

-- Verify setup
SELECT email, full_name, role FROM public.users WHERE email = 'deniskasala17@gmail.com';
```

### 🎯 **Next Steps**

1. **Choose your preferred method** from above
2. **Register/login** to test the platform admin access
3. **Create additional schools** and users
4. **Test all platform admin features**

**Your platform admin account is ready to be set up!** 🎉
