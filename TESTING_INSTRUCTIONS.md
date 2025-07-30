# SchoolConnect - Testing Instructions

## Overview
This document provides instructions for testing the Platform Admin Dashboard with the newly integrated Overview API and other features.

## Platform Admin User Setup

### Option 1: Using the Setup Script (Recommended)
1. Run the setup script to get detailed instructions:
   ```bash
   npm run setup:admin
   ```

2. Follow the on-screen instructions to register a platform admin user through the app.

### Option 2: Direct Database Insert
If you prefer to create the user directly in the database:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL script:

```sql
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

## Testing the Platform Admin Dashboard

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to http://localhost:3000

3. Log in with your platform admin credentials

4. Navigate to the Platform Admin Dashboard

5. Verify that all dashboard sections are working correctly:
   - Overview/Vue d'ensemble tab with dynamic data
   - Schools management
   - Users management
   - Analytics
   - Settings

## API Services Implemented

The following API services and hooks have been implemented and integrated:

- Calendar API (`src/services/calendarService.ts` with `src/hooks/useCalendar.ts`)
- Finance API (`src/services/financeService.ts` with `src/hooks/useFinance.ts`)
- Messaging API (`src/services/messagingService.ts` with `src/hooks/useMessaging.ts`)
- Overview API (`src/services/overviewService.ts` with `src/hooks/useOverview.ts`)
- Pedagogy API (`src/services/pedagogyService.ts` with `src/hooks/usePedagogy.ts`)

## Scripts Included

- `scripts/setup-platform-admin.js` - Provides instructions for setting up a platform admin user
- `scripts/create-test-admin.mjs` - Programmatically creates a test platform admin user

## Additional Notes

- All changes have been pushed to the GitHub repository
- The PlatformAdminDashboard component now uses dynamic data from the Overview API instead of static data
- Proper loading and error handling has been implemented
- The dashboard is fully functional with real-time data from the Supabase backend
