# Roles Table Setup for SchoolConnect

## Overview
The roles table provides a flexible, permission-based role management system for SchoolConnect. It replaces the simple CHECK constraint approach with a more robust system that supports permissions and role hierarchy.

## Table Structure

### Roles Table
```sql
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    level INTEGER NOT NULL DEFAULT 1, -- Role hierarchy level (1=lowest, 4=highest)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Default Roles
The system includes 4 default roles:

1. **Teacher** (Level 1)
   - Access to assigned classes and students
   - Can manage grades and attendance
   - Permissions: classes, students, grades, attendance

2. **Parent** (Level 1)
   - Access to their children's information only
   - Read-only access to grades, attendance, payments
   - Permissions: students (read), grades (read), attendance (read), payments (read)

3. **School Admin** (Level 3)
   - Full access to their school's data
   - Can manage teachers, students, classes, payments
   - Permissions: school, classes, students, teachers, grades, attendance, payments, messages

4. **Platform Admin** (Level 4)
   - Full system access across all schools
   - Can manage schools, users, roles, system settings
   - Permissions: schools, users, roles, system

## Setup Instructions

### Option 1: Create Roles Table Only
If you want to add the roles table to your existing schema:
```sql
-- Run this in Supabase SQL Editor
\i create-roles-table.sql
```

### Option 2: Complete Schema with Roles
If you want to recreate the entire schema with roles integration:
```sql
-- Run this in Supabase SQL Editor
\i schema-with-roles.sql
```

## Usage in Application

### Checking User Permissions
```typescript
// Example service method to check permissions
async checkUserPermission(userId: string, resource: string, action: string): Promise<boolean> {
  const { data: user } = await supabase
    .from('users')
    .select(`
      role_id,
      roles (
        permissions
      )
    `)
    .eq('id', userId)
    .single();

  if (!user?.roles?.permissions) return false;
  
  const permissions = user.roles.permissions;
  return permissions[resource]?.includes(action) || false;
}
```

### Getting User Role Information
```typescript
// Get user with role details
const { data: userWithRole } = await supabase
  .from('users')
  .select(`
    *,
    roles (
      name,
      display_name,
      description,
      permissions,
      level
    )
  `)
  .eq('id', userId)
  .single();
```

## Migration from Current System

The new schema maintains backward compatibility:
- The `role` TEXT field is kept in the users table
- A new `role_id` UUID field references the roles table
- Both can be used during transition period

### Migration Steps
1. Run the roles table creation script
2. Update application code to use role_id where possible
3. Gradually phase out the TEXT role field
4. Remove the TEXT role field in a future update

## Benefits

1. **Flexible Permissions**: JSON-based permissions allow fine-grained control
2. **Role Hierarchy**: Level system enables role-based access control
3. **Extensible**: Easy to add new roles and permissions
4. **Audit Trail**: Track role changes with timestamps
5. **Performance**: Indexed for fast queries

## Security Considerations

- RLS (Row Level Security) is enabled on the roles table
- Only platform admins can modify roles
- All authenticated users can view roles (for UI purposes)
- Permissions are stored as JSONB for flexibility and performance

## Future Enhancements

- Role inheritance (roles can inherit from parent roles)
- Time-based role assignments
- Role-specific UI customization
- Advanced permission scoping (per-school, per-class, etc.)
