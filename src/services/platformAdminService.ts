import { supabase } from '../lib/supabase';
import { User, School, UserRole } from '../types';
import logger from '../utils/logger';

export interface PlatformStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
  monthlyGrowth: {
    schools: number;
    students: number;
    teachers: number;
    revenue: number;
  };
}

export interface SchoolWithStats extends School {
  studentCount: number;
  teacherCount: number;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'Basic' | 'Standard' | 'Premium';
  revenue: number;
  lastActive: string;
  location: string;
}

export interface UserWithSchool extends User {
  schoolName?: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
  type: 'school' | 'user' | 'system' | 'financial';
}

export interface SystemAnalytics {
  userRegistrations: {
    date: string;
    count: number;
  }[];
  schoolGrowth: {
    date: string;
    count: number;
  }[];
  revenueData: {
    date: string;
    amount: number;
  }[];
  usersByRole: {
    role: UserRole;
    count: number;
  }[];
}

export class PlatformAdminService {
  /**
   * Get platform-wide statistics
   */
  static async getPlatformStats(): Promise<PlatformStats> {
    try {
      // Get total schools
      const { count: totalSchools } = await supabase
        .from('schools')
        .select('id', { count: 'exact', head: true });

      // Get total students
      const { count: totalStudents } = await supabase
        .from('students')
        .select('id', { count: 'exact', head: true });

      // Get total teachers
      const { count: totalTeachers } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'teacher');

      // Calculate revenue (mock calculation - replace with actual revenue logic)
      const { data: schools } = await supabase
        .from('schools')
        .select('subscription_type, max_students');

      let totalRevenue = 0;
      schools?.forEach(school => {
        // Basic pricing logic - adjust based on actual pricing model
        const basePrice = school.subscription_type === 'forfait' ? 50 : 30;
        const studentMultiplier = Math.min(school.max_students / 100, 5);
        totalRevenue += basePrice * (1 + studentMultiplier);
      });

      // Mock growth data - replace with actual historical data queries
      const monthlyGrowth = {
        schools: 2,
        students: 45,
        teachers: 8,
        revenue: 12
      };

      return {
        totalSchools: totalSchools || 0,
        totalStudents: totalStudents || 0,
        totalTeachers: totalTeachers || 0,
        totalRevenue,
        monthlyGrowth
      };
    } catch (error) {
      logger.error('Error fetching platform stats:', error);
      throw new Error('Failed to fetch platform statistics');
    }
  }

  /**
   * Get all schools with detailed statistics
   */
  static async getSchoolsWithStats(): Promise<SchoolWithStats[]> {
    try {
      const { data: schools, error } = await supabase
        .from('schools')
        .select(`
          id, name, address, city, province, phone, email, subscription_type, max_students, created_at, updated_at
        `);

      if (error) throw error;

      const schoolsWithStats: SchoolWithStats[] = await Promise.all(
        schools?.map(async (school) => {
          // Get student count
          const { count: studentCount } = await supabase
            .from('students')
            .select('id', { count: 'exact', head: true })
            .eq('school_id', school.id);

          // Get teacher count
          const { count: teacherCount } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
            .eq('school_id', school.id)
            .eq('role', 'teacher');

          // Calculate revenue based on subscription
          const basePrice = school.subscription_type === 'forfait' ? 50 : 30;
          const revenue = basePrice * Math.max(1, Math.floor((studentCount || 0) / 50));

          // Determine plan based on max_students
          let plan: 'Basic' | 'Standard' | 'Premium' = 'Basic';
          if (school.max_students > 500) plan = 'Premium';
          else if (school.max_students > 200) plan = 'Standard';

          // Mock status and location - replace with actual data
          const status = studentCount && studentCount > 0 ? 'active' : 'inactive';
          const location = school.address || 'Unknown';

          return {
            ...school,
            studentCount: studentCount || 0,
            teacherCount: teacherCount || 0,
            status,
            plan,
            revenue,
            lastActive: new Date().toISOString().split('T')[0],
            location
          };
        }) || []
      );

      return schoolsWithStats;
    } catch (error) {
      logger.error('Error fetching schools with stats:', error);
      throw new Error('Failed to fetch schools data');
    }
  }

  /**
   * Get all users with school information
   */
  static async getUsersWithSchool(): Promise<UserWithSchool[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          id, email, full_name, role, school_id, is_active, approved, created_at, updated_at,
          schools(name)
        `);

      if (error) throw error;

      return users?.map(user => ({
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
        schoolId: user.school_id,
        schoolName: user.schools?.name,
        status: user.approved === false ? 'pending' : (user.is_active ? 'active' : 'suspended'),
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching users with school:', error);
      throw new Error('Failed to fetch users data');
    }
  }

  /**
   * Create a new school
   */
  static async createSchool(schoolData: {
    name: string;
    address: string;
    city: string;
    province: string;
    phone: string;
    email: string;
    subscription_type: 'flex' | 'forfait';
    max_students: number;
  }): Promise<School> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .insert([schoolData])
        .select('id, name, address, phone, email, created_at, updated_at')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error creating school:', error);
      throw new Error('Failed to create school');
    }
  }

  /**
   * Update school information
   */
  static async updateSchool(schoolId: string, updates: Partial<{
    name: string;
    address: string;
    phone: string;
    email: string;
    subscription_type: 'flex' | 'forfait';
    max_students: number;
  }>): Promise<School> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .update(updates)
        .eq('id', schoolId)
        .select('id, name, address, phone, email, created_at, updated_at')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error updating school:', error);
      throw new Error('Failed to update school');
    }
  }

  /**
   * Delete a school
   */
  static async deleteSchool(schoolId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', schoolId);

      if (error) throw error;
    } catch (error) {
      logger.error('Error deleting school:', error);
      throw new Error('Failed to delete school');
    }
  }

  /**
   * Update user status (active/suspended)
   * @param userId The ID of the user to update
   * @param status The new status ('active' or 'suspended')
   */
  static async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<void> {
    try {
      // Convert status to boolean for is_active field
      const isActive = status === 'active';
      
      // Update the user's is_active status
      const { error } = await supabase
        .from('users')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) throw error;

      // Log the activity
      await this.logActivity({
        action: `User ${status}`,
        description: `User status changed to ${status}`,
        userId: userId,
        type: 'user'
      });
    } catch (error) {
      logger.error('Error updating user status:', error);
      throw new Error('Failed to update user status');
    }
  }

  /**
   * Get recent activity logs
   */
  static async getActivityLogs(limit: number = 20): Promise<ActivityLog[]> {
    try {
      // Mock activity logs - replace with actual activity logging system
      const mockLogs: ActivityLog[] = [
        {
          id: '1',
          action: 'School Created',
          description: 'Nouvelle école ajoutée: Institut Moderne',
          userId: 'admin-1',
          userName: 'Platform Admin',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          type: 'school'
        },
        {
          id: '2',
          action: 'Users Approved',
          description: '15 nouveaux utilisateurs approuvés',
          userId: 'admin-1',
          userName: 'Platform Admin',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          type: 'user'
        },
        {
          id: '3',
          action: 'System Update',
          description: 'Mise à jour système déployée',
          userId: 'system',
          userName: 'System',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          type: 'system'
        }
      ];

      return mockLogs.slice(0, limit);
    } catch (error) {
      logger.error('Error fetching activity logs:', error);
      throw new Error('Failed to fetch activity logs');
    }
  }

  /**
   * Log an activity
   */
  static async logActivity(activity: {
    action: string;
    description: string;
    userId: string;
    type: 'school' | 'user' | 'system' | 'financial';
  }): Promise<void> {
    try {
      // In a real implementation, you would save this to an activity_logs table
      logger.log('Activity logged:', activity);
      
      // For now, we'll just log to console
      // TODO: Implement actual activity logging to database
    } catch (error) {
      logger.error('Error logging activity:', error);
    }
  }

  /**
   * Get system analytics data
   */
  static async getSystemAnalytics(): Promise<SystemAnalytics> {
    try {
      // Mock analytics data - replace with actual analytics queries
      const userRegistrations = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10) + 1
      })).reverse();

      const schoolGrowth = Array.from({ length: 12 }, (_, i) => ({
        date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5) + 1
      })).reverse();

      const revenueData = Array.from({ length: 12 }, (_, i) => ({
        date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 10000) + 5000
      })).reverse();

      // Get actual user counts by role
      const { data: usersByRole } = await supabase
        .from('users')
        .select('role')
        .not('role', 'is', null);

      // Initialize with all possible roles set to 0
      const roleCounts: Record<string, number> = {
        platform_admin: 0,
        school_admin: 0,
        teacher: 0,
        parent: 0,
        student: 0
      };

      // Count users by role
      usersByRole?.forEach(user => {
        if (user.role && roleCounts.hasOwnProperty(user.role)) {
          roleCounts[user.role]++;
        }
      });

      // Convert to array of { role, count } objects
      const usersByRoleArray = Object.entries(roleCounts).map(([role, count]) => ({
        role: role as UserRole,
        count: count as number
      }));

      return {
        userRegistrations,
        schoolGrowth,
        revenueData,
        usersByRole: usersByRoleArray
      };
    } catch (error) {
      logger.error('Error fetching system analytics:', error);
      throw new Error('Failed to fetch system analytics');
    }
  }

  /**
   * Export platform data
   */
  static async exportData(dataType: 'schools' | 'users' | 'analytics'): Promise<Blob> {
    try {
      let data: any;

      switch (dataType) {
        case 'schools':
          data = await this.getSchoolsWithStats();
          break;
        case 'users':
          data = await this.getUsersWithSchool();
          break;
        case 'analytics':
          data = await this.getSystemAnalytics();
          break;
        default:
          throw new Error('Invalid data type for export');
      }

      const jsonData = JSON.stringify(data, null, 2);
      return new Blob([jsonData], { type: 'application/json' });
    } catch (error) {
      logger.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  /**
   * Search schools by name or location
   */
  static async searchSchools(query: string): Promise<SchoolWithStats[]> {
    try {
      const { data: schools, error } = await supabase
        .from('schools')
        .select('id, name, address, city, province, phone, email, subscription_type, max_students, created_at, updated_at')
        .or(`name.ilike.%${query}%,address.ilike.%${query}%`);

      if (error) throw error;

      // Convert to SchoolWithStats format
      const schoolsWithStats = await Promise.all(
        schools?.map(async (school) => {
          const { count: studentCount } = await supabase
            .from('students')
            .select('id', { count: 'exact', head: true })
            .eq('school_id', school.id);

          const { count: teacherCount } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
            .eq('school_id', school.id)
            .eq('role', 'teacher');

          return {
            ...school,
            studentCount: studentCount || 0,
            teacherCount: teacherCount || 0,
            status: 'active' as const,
            plan: 'Standard' as const,
            revenue: 10000,
            lastActive: new Date().toISOString().split('T')[0],
            location: school.address
          };
        }) || []
      );

      return schoolsWithStats;
    } catch (error) {
      logger.error('Error searching schools:', error);
      throw new Error('Failed to search schools');
    }
  }

  /**
   * Get pending user approvals
   */
  static async getPendingUsers(): Promise<UserWithSchool[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          id, email, full_name, role, school_id, is_active, approved, created_at, updated_at,
          schools(name)
        `)
        .eq('approved', false);

      if (error) throw error;

      return users?.map(user => ({
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
        schoolId: user.school_id,
        schoolName: user.schools?.name,
        status: 'pending',
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching pending users:', error);
      throw new Error('Failed to fetch pending users');
    }
  }

  /**
   * Create a new user with role assignment
   */
  static async createUser(userData: {
    email: string;
    full_name: string;
    password: string;
    role: 'platform_admin' | 'school_admin' | 'teacher' | 'parent';
    school_id?: string;
    phone?: string;
  }): Promise<UserWithSchool> {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            school_id: userData.school_id,
            phone: userData.phone
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // The user profile will be created automatically by the trigger
      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch the created user with school, status, and role information
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          id, email, full_name, role, school_id, is_active, created_at, updated_at,
          schools(name),
          status:user_status_id(id, name, display_name, color),
          roleData:role_id(id, name, display_name, level)
        `)
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      // Log the activity
      await this.logActivity({
        action: 'User Created',
        description: `New user created: ${userData.full_name} (${userData.role})`,
        userId: authData.user.id,
        type: 'user'
      });

      return {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
        schoolId: user.school_id,
        schoolName: user.schools?.name,
        status: user.status?.name || 'active',
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      };
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new Error('Failed to create user: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  /**
   * Update user information
   */
  static async updateUser(
    userId: string, 
    updates: {
      email?: string;
      name?: string;
      role?: 'platform_admin' | 'school_admin' | 'teacher' | 'parent';
      schoolId?: string;
      approved?: boolean;
    }
  ): Promise<UserWithSchool> {
    try {
      // Update user in auth if email is being changed
      if (updates.email) {
        const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
          email: updates.email,
        });
        if (authError) throw authError;
      }

      // Update user profile in database
      const { data: user, error: userError } = await supabase
        .from('users')
        .update({
          email: updates.email,
          full_name: updates.name,
          role: updates.role,
          school_id: updates.schoolId,
          approved: updates.approved,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select('id, email, full_name, role, school_id, is_active, approved, created_at, updated_at, schools(name)')
        .single();

      if (userError) throw userError;

      // Log the activity
      await this.logActivity({
        action: 'User Updated',
        description: `User ${user.full_name} (${user.email}) was updated`,
        userId: userId,
        type: 'user' as const,
      });

      return {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
        schoolId: user.school_id,
        schoolName: user.schools?.name,
        status: user.approved === false ? 'pending' : (user.is_active ? 'active' : 'suspended'),
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      };
    } catch (error) {
      logger.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Delete a user using Edge Function with service role permissions
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      logger.log(`Starting deletion of user with ID: ${userId}`);
      
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session. Please log in again.');
      }

      // Call the Edge Function for secure user deletion
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        logger.error('Error calling delete-user function:', error);
        throw new Error(`Failed to delete user: ${error.message}`);
      }

      if (!data.success) {
        logger.error('Delete user function returned error:', data.error);
        throw new Error(data.error || 'Failed to delete user');
      }

      logger.log('User deleted successfully:', data.message);
      
    } catch (error: any) {
      logger.error('Error in deleteUser:', error);
      
      // Provide more specific error messages based on the error
      if (error.message.includes('Insufficient permissions')) {
        throw new Error('Permissions insuffisantes pour effectuer cette action.');
      } else if (error.message.includes('User not found')) {
        throw new Error('Utilisateur introuvable. Il a peut-être déjà été supprimé.');
      } else if (error.message.includes('No active session')) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      } else {
        throw new Error(error.message || 'Erreur lors de la suppression de l\'utilisateur.');
      }
    }
  }
}

export default PlatformAdminService;
