# SchoolConnect Supabase Setup Guide

## 🎯 Quick Setup Instructions

### 1. Access Supabase Dashboard
- Go to: https://supabase.com/dashboard
- Navigate to your project: `urtsvqedsewswknyxvnw`

### 2. Run Database Schema
- Copy the contents of `schema.sql`
- Go to SQL Editor in Supabase dashboard
- Paste and run the entire SQL script

### 3. Enable Authentication
- Go to Authentication → Providers
- Ensure Email provider is enabled
- Configure email templates if needed

### 4. Set Environment Variables in Vercel
```bash
VITE_SUPABASE_URL=https://urtsvqedsewswknyxvnw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVydHN2cWVkc2V3c3drbnl4dm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NTgzMTYsImV4cCI6MjA2OTAzNDMxNn0.0u-JwSKSisSH1elVir0tsrbPwPmg4OK-Hn6eenjjAjc
```

## 🗄️ Database Schema Overview

### Core Tables
- **users** - Extended user profiles with roles
- **schools** - School information and subscription details
- **classes** - Class/grade management
- **students** - Student records and enrollment
- **teachers** - Teacher information and assignments
- **grades** - Academic performance tracking
- **attendance** - Daily attendance records
- **payments** - Fee and payment management
- **messages** - Communication system
- **notifications** - User notifications

### User Roles
- **platform_admin** - System administrators
- **school_admin** - School administrators
- **teacher** - Teaching staff
- **parent** - Parent/guardian accounts

### Security Features
- **Row Level Security (RLS)** - Data isolation per school
- **Role-based access control** - Granular permissions
- **Authentication policies** - Secure user management
- **Data integrity** - Foreign key constraints

## 🔐 RLS Policies Summary

### Access Control Matrix
| Resource | Platform Admin | School Admin | Teacher | Parent |
|----------|----------------|--------------|---------|--------|
| Users | All | School only | School only | Own only |
| Schools | All | Own only | Own only | Own only |
| Classes | All | School only | School only | Read only |
| Students | All | School only | School only | Own children |
| Grades | All | School only | Own classes | Own children |
| Attendance | All | School only | Own classes | Own children |
| Payments | All | School only | School only | Own children |
| Messages | All | School only | School only | Own messages |

## 📋 Setup Checklist

- [ ] Run SQL schema in Supabase SQL Editor
- [ ] Enable Row Level Security on all tables
- [ ] Configure authentication providers
- [ ] Set environment variables in Vercel
- [ ] Test user registration flow
- [ ] Verify RLS policies are working
- [ ] Test role-based access

## 🚀 Next Steps

1. **Create initial admin user** via registration
2. **Set up first school** via admin dashboard
3. **Add teachers and classes**
4. **Enroll students**
5. **Test all features** with real data

## 📊 Testing Queries

### Verify RLS is working:
```sql
SELECT * FROM auth.users; -- Should return only authenticated users
SELECT * FROM public.schools; -- Should return only accessible schools
```

### Test user creation:
```sql
INSERT INTO public.users (id, email, full_name, role, school_id) 
VALUES (auth.uid(), 'admin@schoolconnect.com', 'Admin User', 'platform_admin', NULL);
```

## 🔧 Troubleshooting

### Common Issues:
- **RLS not working**: Check policies are enabled
- **Permission denied**: Verify user roles and school associations
- **Foreign key errors**: Ensure referenced records exist
- **Authentication issues**: Check auth.users table and policies

### Support:
- Check Supabase logs for detailed error messages
- Use SQL Editor to test queries directly
- Verify environment variables are set correctly
