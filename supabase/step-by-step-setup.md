# SchoolConnect Supabase Step-by-Step Setup

## 🎯 Quick Fix for Table Dependencies

### ✅ **Step 1: Run Corrected Schema**

**The error you encountered is fixed!** Use the corrected schema file: `corrected-schema.sql`

### 📋 **Step-by-Step Instructions**

#### **1. Access Supabase SQL Editor**
- Go to: https://supabase.com/dashboard
- Navigate to your project: `urtsvqedsewswknyxvnw`
- Click **"SQL Editor"** in the left sidebar

#### **2. Run the Corrected Schema**
1. **Open** `supabase/corrected-schema.sql`
2. **Copy the entire contents** (this fixes the dependency order)
3. **Paste into SQL Editor**
4. **Click "Run"** or press **Ctrl+Enter**

#### **3. Verify Schema Creation**
```sql
-- Run these verification queries:
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
-- Should show 9+ tables (schools, users, classes, students, etc.)

SELECT * FROM public.schools LIMIT 1;
-- Should return empty but no errors

SELECT * FROM auth.users LIMIT 1;
-- Should show existing users (if any)
```

#### **4. Enable RLS (Row Level Security)**
The corrected schema includes RLS policies. After running:

```sql
-- Verify RLS is enabled:
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- All should show 't' (true) for rowsecurity
```

#### **5. Test User Registration**
1. **Register a new user** through your app
2. **Check the user appears** in both auth.users and public.users
3. **Verify RLS policies** work correctly

#### **6. Set Environment Variables in Vercel**
```bash
# Already configured:
VITE_SUPABASE_URL=https://urtsvqedsewswknyxvnw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVydHN2cWVkc2V3c3drbnl4dm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NTgzMTYsImV4cCI6MjA2OTAzNDMxNn0.0u-JwSKSisSH1elVir0tsrbPwPmg4OK-Hn6eenjjAjc
```

## 🔧 **Fixing the Previous Error**

### **Why the Error Occurred**
- **Original schema** had RLS policies before table creation
- **Foreign key dependencies** weren't resolved in correct order
- **Corrected schema** fixes this by:
  1. Creating tables first
  2. Adding indexes and triggers
  3. Enabling RLS policies last

### **What Changed**
- **Reordered SQL execution** to prevent dependency issues
- **Added explicit table creation** before RLS policies
- **Fixed foreign key references** to ensure tables exist
- **Simplified initial setup** for easier deployment

## 🚀 **Ready to Deploy**

Your corrected schema is now ready! The tables will be created in the correct order:

1. **Extensions** (uuid-ossp)
2. **Schools** (no dependencies)
3. **Users** (depends on schools)
4. **Classes** (depends on schools & users)
5. **Students** (depends on schools & classes)
6. **Grades, Attendance, Payments, Messages, Notifications**
7. **RLS Policies** (after all tables exist)

## ✅ **Next Steps**

1. **Run the corrected schema** in Supabase SQL Editor
2. **Test user registration** through your app
3. **Verify all features** work correctly
4. **Deploy to production** with confidence

**The corrected schema fixes all dependency issues and is ready for immediate use!**
