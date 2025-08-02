# Database Setup Guide

This guide explains how to set up the required database tables for the SchoolConnect Platform Admin Dashboard.

## Overview

The dashboard requires several database tables that may not exist in your initial Supabase setup:

- **`activity_logs`** - Tracks user activities for audit and dashboard display
- **`events`** - Stores calendar events, meetings, exams, and scheduled activities
- **`messages`** - Messaging system (may need additional columns)
- **`payments`** - Payment tracking (may need additional columns)

## Quick Setup

### Option 1: Automated Script (Recommended)

Run the automated setup script:

```bash
npm run setup:database
```

This script will:
1. Test your Supabase connection
2. Create missing tables with proper structure
3. Add sample data for testing
4. Set up proper indexes and security policies

### Option 2: Manual Setup

If the automated script doesn't work, follow these manual steps:

1. **Open Supabase Dashboard**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Navigate to your project
   - Open the SQL Editor

2. **Execute Table Creation Script**
   - Copy the contents of `supabase/create-missing-tables.sql`
   - Paste and execute in the SQL Editor

3. **Populate Sample Data**
   - Copy the contents of `supabase/populate-sample-data.sql`
   - Paste and execute in the SQL Editor

## Files Created

### SQL Scripts

- **`supabase/create-missing-tables.sql`**
  - Creates `activity_logs` and `events` tables
  - Adds missing columns to existing tables
  - Sets up indexes for performance
  - Configures Row Level Security (RLS) policies
  - Creates helper functions

- **`supabase/populate-sample-data.sql`**
  - Adds sample activity logs
  - Creates sample events
  - Populates sample messages and payments
  - Provides realistic test data for dashboard

### Scripts

- **`scripts/setup-database-tables.js`**
  - Node.js script for automated setup
  - Tests Supabase connection
  - Executes SQL files programmatically
  - Provides troubleshooting guidance

## Table Structures

### activity_logs
```sql
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### events
```sql
CREATE TABLE public.events (
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
    recurrence_rule TEXT,
    attendees UUID[],
    status TEXT CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')) DEFAULT 'scheduled',
    visibility TEXT CHECK (visibility IN ('public', 'school', 'class', 'private')) DEFAULT 'school',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security & Permissions

The scripts automatically set up Row Level Security (RLS) policies:

- **Platform Admins**: Can view and manage all data
- **School Admins**: Can view and manage data for their school
- **Teachers**: Can manage events for their classes
- **Users**: Can view their own activity logs

## Sample Data

After running the setup, your dashboard will display:

### Recent Activities
- User creation and approval activities
- School updates and system backups
- Payment notifications
- Login activities

### Upcoming Events
- Teacher meetings
- Exams and assessments
- School activities and open days
- Training sessions
- Parent assemblies

### Messages
- Communication between users
- Announcements and notifications
- Direct messages between staff

### Payments
- School fee payments
- Registration fees
- Overdue payment notifications
- Payment method tracking

## Troubleshooting

### Connection Issues
- Verify `VITE_SUPABASE_URL` in your `.env` file
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (or use `VITE_SUPABASE_ANON_KEY`)
- Check your Supabase project is active

### Permission Errors
- Ensure your Supabase user has necessary permissions
- Check RLS policies are not blocking your queries
- Verify your user role is set correctly

### Missing Data
- Run the populate script: `supabase/populate-sample-data.sql`
- Ensure you have at least one platform admin user
- Verify you have at least one school in your database

## Adding Real Data

Once the tables are set up, you can:

1. **Activity Logs**: Automatically created when users perform actions
2. **Events**: Add through the calendar interface or directly in database
3. **Messages**: Use the messaging system in the dashboard
4. **Payments**: Add through the financial management interface

## Helper Functions

The setup creates a helper function for logging activities:

```sql
SELECT log_activity(
    user_id := 'your-user-id',
    school_id := 'your-school-id', 
    action := 'custom_action',
    target := 'Description of what happened',
    details := '{"key": "value"}'::jsonb
);
```

## Next Steps

After running the setup:

1. **Test the Dashboard**: Login and verify all sections show data
2. **Add Real Data**: Start adding actual schools, users, and events
3. **Customize**: Modify the sample data or add more realistic content
4. **Monitor**: Check the activity logs to see user actions being tracked

For more information, see the main [README.md](./README.md) and [TESTING_INSTRUCTIONS.md](./TESTING_INSTRUCTIONS.md).
