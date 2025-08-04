# User Status Table Setup and Usage

## Overview
The `user_status` table provides comprehensive status management for users in the SchoolConnect platform. This dedicated table allows for flexible user lifecycle management with rich status information including colors, descriptions, and sorting.

## Table Structure

### User Status Table (`public.user_status`)
```sql
CREATE TABLE public.user_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status_name TEXT UNIQUE NOT NULL,
    status_display_name TEXT NOT NULL,
    status_description TEXT,
    status_color TEXT DEFAULT '#6B7280',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Users Table Integration
The `users` table includes:
- `user_status_id UUID REFERENCES public.user_status(id)` - Foreign key to user_status table
- `is_active BOOLEAN` - Kept for backward compatibility

## Default Status Values

| Status Name | Display Name | Description | Color | Sort Order | Use Case |
|-------------|--------------|-------------|-------|------------|----------|
| `active` | Actif | Utilisateur actif avec accès complet | #10B981 (green) | 1 | Normal active users |
| `inactive` | Inactif | Utilisateur inactif temporairement | #6B7280 (gray) | 2 | Temporarily disabled |
| `suspended` | Suspendu | Utilisateur suspendu par admin | #F59E0B (amber) | 3 | Under review/punishment |
| `pending` | En attente | En attente d'approbation | #3B82F6 (blue) | 4 | New registrations |
| `blocked` | Bloqué | Utilisateur bloqué définitivement | #EF4444 (red) | 5 | Permanently banned |
| `archived` | Archivé | Utilisateur archivé (historique) | #9CA3AF (gray) | 6 | Old users kept for records |

## Setup Instructions

### 1. Run the SQL Script
Execute the SQL script in Supabase SQL Editor:
```bash
# In Supabase Dashboard > SQL Editor
# Copy and paste the contents of create-user-status-table.sql
```

### 2. Verify Installation
```sql
-- Check if user_status table was created
SELECT * FROM public.user_status ORDER BY sort_order;

-- Check if user_status_id column was added to users
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'user_status_id';

-- Check if existing users have status assigned
SELECT COUNT(*) as users_with_status 
FROM public.users 
WHERE user_status_id IS NOT NULL;
```

## Usage Examples

### Frontend TypeScript Types
```typescript
export interface UserStatus {
  id: string;
  status_name: string;
  status_display_name: string;
  status_description?: string;
  status_color: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithStatus {
  id: string;
  email: string;
  full_name: string;
  role: string;
  user_status_id: string;
  userStatus?: UserStatus; // Joined status data
  // ... other user fields
}
```

### API Service Examples
```typescript
// Get user with status information
const getUserWithStatus = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      userStatus:user_status_id (
        id,
        status_name,
        status_display_name,
        status_color
      )
    `)
    .eq('id', userId)
    .single();
  
  return data;
};

// Update user status
const updateUserStatus = async (userId: string, statusName: string) => {
  const { data: status } = await supabase
    .from('user_status')
    .select('id')
    .eq('status_name', statusName)
    .single();
    
  const { error } = await supabase
    .from('users')
    .update({ user_status_id: status.id })
    .eq('id', userId);
    
  return !error;
};

// Get all available statuses
const getAllUserStatuses = async () => {
  const { data, error } = await supabase
    .from('user_status')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
    
  return data;
};
```

### Common Queries
```sql
-- Get all active users
SELECT u.*, us.status_display_name, us.status_color
FROM users u
JOIN user_status us ON u.user_status_id = us.id
WHERE us.status_name = 'active';

-- Get users by status
SELECT u.full_name, u.email, us.status_display_name
FROM users u
JOIN user_status us ON u.user_status_id = us.id
WHERE us.status_name IN ('pending', 'suspended');

-- Count users by status
SELECT 
    us.status_display_name,
    us.status_color,
    COUNT(u.id) as user_count
FROM user_status us
LEFT JOIN users u ON us.id = u.user_status_id
GROUP BY us.id, us.status_display_name, us.status_color, us.sort_order
ORDER BY us.sort_order;

-- Get users needing attention (pending, suspended, blocked)
SELECT u.*, us.status_display_name, us.status_color
FROM users u
JOIN user_status us ON u.user_status_id = us.id
WHERE us.status_name IN ('pending', 'suspended', 'blocked')
ORDER BY u.created_at DESC;
```

## UI/UX Integration

### Status Badge Component
```tsx
const UserStatusBadge = ({ userStatus }: { userStatus: UserStatus }) => (
  <span 
    className="px-2 py-1 rounded-full text-xs font-medium"
    style={{ 
      backgroundColor: userStatus.status_color + '20', 
      color: userStatus.status_color 
    }}
  >
    {userStatus.status_display_name}
  </span>
);
```

### Status Filter Component
```tsx
const UserStatusFilter = ({ statuses, onFilter }: Props) => (
  <select onChange={(e) => onFilter(e.target.value)}>
    <option value="">Tous les statuts</option>
    {statuses.map(status => (
      <option key={status.id} value={status.status_name}>
        {status.status_display_name}
      </option>
    ))}
  </select>
);
```

### Status Change Modal
```tsx
const ChangeUserStatusModal = ({ user, statuses, onUpdate }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  
  return (
    <div className="modal">
      <h3>Changer le statut de {user.full_name}</h3>
      <select 
        value={selectedStatus} 
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        {statuses.map(status => (
          <option key={status.id} value={status.status_name}>
            {status.status_display_name}
          </option>
        ))}
      </select>
      <button onClick={() => onUpdate(user.id, selectedStatus)}>
        Mettre à jour
      </button>
    </div>
  );
};
```

## Admin Dashboard Integration

### Status Management Section
```tsx
const UserStatusManagement = () => {
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  
  const updateUserStatus = async (userId: string, statusName: string) => {
    // Update user status via API
    await updateUserStatus(userId, statusName);
    // Refresh users list
    fetchUsers();
  };
  
  return (
    <div>
      <h2>Gestion des Statuts Utilisateurs</h2>
      {users.map(user => (
        <div key={user.id} className="user-row">
          <span>{user.full_name}</span>
          <UserStatusBadge userStatus={user.userStatus} />
          <select onChange={(e) => updateUserStatus(user.id, e.target.value)}>
            {statuses.map(status => (
              <option key={status.id} value={status.status_name}>
                {status.status_display_name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
```

## Security Considerations

### Row Level Security (RLS)
- User status table is viewable by all authenticated users
- Only platform admins can modify user status records
- User status changes should be logged in activity_logs

### Permissions
```sql
-- View permissions for all authenticated users
GRANT SELECT ON public.user_status TO authenticated;

-- Full permissions for service role
GRANT ALL ON public.user_status TO service_role;
```

## Benefits

1. **Flexibility**: Easy to add new status types without schema changes
2. **Rich Information**: Colors, descriptions, and sorting for better UX
3. **Consistency**: Standardized status management across the platform
4. **Audit Trail**: Better tracking of user lifecycle changes
5. **Admin Control**: Centralized status management for administrators
6. **Reporting**: Enhanced analytics and user status reporting
7. **Scalability**: Supports complex user workflows and approval processes

## Migration from Existing Systems

### From Boolean is_active
```sql
-- Migrate existing is_active values to user_status_id
UPDATE users 
SET user_status_id = (
  CASE 
    WHEN is_active = true THEN (SELECT id FROM user_status WHERE status_name = 'active')
    ELSE (SELECT id FROM user_status WHERE status_name = 'inactive')
  END
)
WHERE user_status_id IS NULL;
```

### Backward Compatibility
Keep the `is_active` boolean field during transition period and sync both fields:
```sql
-- Trigger to keep is_active in sync with user_status_id
CREATE OR REPLACE FUNCTION sync_user_active_status()
RETURNS TRIGGER AS $$
BEGIN
    NEW.is_active = (
        SELECT status_name = 'active' 
        FROM user_status 
        WHERE id = NEW.user_status_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Next Steps

1. Update TypeScript types to include UserStatus interface
2. Modify API services to use user_status relationships
3. Update UI components to display status information
4. Implement status change workflows in admin dashboard
5. Add status filtering and sorting capabilities
6. Create status change audit logging
7. Add status-based permissions and access control
