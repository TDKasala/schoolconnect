import { supabase } from '../lib/supabase';
import { School, Student } from '../types';
import logger from '../utils/logger';

export interface SchoolStats {
  totalStudents: number;
  activeTeachers: number;
  monthlyRevenue: number;
  attendanceRate: number;
  monthlyGrowth: {
    students: number;
    teachers: number;
    revenue: number;
    attendance: number;
  };
}

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'parent';
  requestDate: string;
  schoolId: string;
}

export interface RecentActivity {
  id: string;
  type: 'user_registered' | 'payment_received' | 'grade_updated' | 'parent_message';
  message: string;
  time: string;
  timestamp: Date;
}

export interface TeacherWithStats {
  id: string;
  email: string;
  name: string;
  role: 'teacher';
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  studentCount: number;
  classCount: number;
  lastActive: string;
}

export interface StudentWithClass extends Student {
  className: string;
  teacherName: string;
  lastGradeDate: string;
}

export class SchoolAdminService {
  private schoolId: string;

  constructor(schoolId: string) {
    this.schoolId = schoolId;
  }

  /**
   * Get school statistics
   */
  async getSchoolStats(): Promise<SchoolStats> {
    try {
      // Get total students for this school
      const { count: totalStudents } = await supabase
        .from('students')
        .select('id', { count: 'exact', head: true })
        .eq('school_id', this.schoolId);

      // Get active teachers for this school
      const { count: activeTeachers } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('school_id', this.schoolId)
        .eq('role', 'teacher');

      // Calculate monthly revenue (mock calculation)
      const monthlyRevenue = (totalStudents || 0) * 20; // $20 per student

      // Get attendance rate (mock data)
      const attendanceRate = 94.5;

      // Mock growth data
      const monthlyGrowth = {
        students: 12,
        teachers: 2,
        revenue: 8.2,
        attendance: 2.1
      };

      return {
        totalStudents: totalStudents || 0,
        activeTeachers: activeTeachers || 0,
        monthlyRevenue,
        attendanceRate,
        monthlyGrowth
      };
    } catch (error) {
      logger.error('Error fetching school stats:', error);
      throw new Error('Failed to fetch school statistics');
    }
  }

  /**
   * Get pending user requests for this school
   */
  async getPendingUsers(): Promise<PendingUser[]> {
    try {
      // Pending = explicitly not approved yet
      const { data: users, error } = await supabase
        .from('users')
        .select('id, full_name, email, role, school_id, created_at, approved')
        .eq('school_id', this.schoolId)
        .eq('approved', false);

      if (error) throw error;

      return users?.map(user => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role as 'teacher' | 'parent',
        requestDate: user.created_at,
        schoolId: user.school_id
      })) || [];
    } catch (error) {
      logger.error('Error fetching pending users:', error);
      throw new Error('Failed to fetch pending users');
    }
  }

  /**
   * Approve or reject a pending user
   */
  async handleUserRequest(userId: string, action: 'approve' | 'reject'): Promise<void> {
    try {
      if (action === 'approve') {
        // Approve user: set approved=true and update timestamp
        const { error } = await supabase
          .from('users')
          .update({ 
            approved: true,
            updated_at: new Date().toISOString() 
          })
          .eq('id', userId)
          .eq('school_id', this.schoolId);

        if (error) throw error;
      } else {
        // Reject user request (delete user)
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId)
          .eq('school_id', this.schoolId);

        if (error) throw error;
      }

      // Log the activity
      await this.logActivity({
        type: 'user_registered',
        message: `User request ${action}d: ${userId}`,
        time: 'just now'
      });
    } catch (error) {
      logger.error(`Error ${action}ing user:`, error);
      throw new Error(`Failed to ${action} user`);
    }
  }

  /**
   * Get recent activities for this school
   */
  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    try {
      // Mock recent activities - replace with actual activity logging system
      const mockActivities: RecentActivity[] = [
        { 
          id: '1', 
          type: 'user_registered', 
          message: 'Nouvel enseignant inscrit: Marie Kabongo', 
          time: '2 heures', 
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) 
        },
        { 
          id: '2', 
          type: 'payment_received', 
          message: 'Paiement reçu: $50 USD - Classe 6ème A', 
          time: '4 heures', 
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) 
        },
        { 
          id: '3', 
          type: 'grade_updated', 
          message: '15 nouvelles notes ajoutées en Mathématiques', 
          time: '6 heures', 
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) 
        },
        { 
          id: '4', 
          type: 'parent_message', 
          message: '3 nouveaux messages de parents', 
          time: '1 jour', 
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) 
        }
      ];

      return mockActivities.slice(0, limit);
    } catch (error) {
      logger.error('Error fetching recent activities:', error);
      throw new Error('Failed to fetch recent activities');
    }
  }

  /**
   * Log an activity
   */
  async logActivity(activity: {
    type: 'user_registered' | 'payment_received' | 'grade_updated' | 'parent_message';
    message: string;
    time: string;
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
   * Send invitation to a new user
   */
  async sendInvitation(email: string, role: 'teacher' | 'parent'): Promise<void> {
    try {
      // In a real implementation, you would send an email invitation
      logger.log(`Invitation sent to ${email} as ${role}`);
      
      // For now, we'll just log to console
      // TODO: Implement actual email invitation system
      
      // Log the activity
      await this.logActivity({
        type: 'user_registered',
        message: `Invitation sent to: ${email}`,
        time: 'just now'
      });
    } catch (error) {
      logger.error('Error sending invitation:', error);
      throw new Error('Failed to send invitation');
    }
  }

  /**
   * Get all teachers for this school
   */
  async getTeachers(): Promise<TeacherWithStats[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, school_id, created_at, updated_at')
        .eq('school_id', this.schoolId)
        .eq('role', 'teacher');

      if (error) throw error;

      // Convert users to teachers with stats
      const teachersWithStats = await Promise.all(
        users?.map(async (user) => {
          // Get student count for this teacher
          const { count: studentCount } = await supabase
            .from('students')
            .select('id', { count: 'exact', head: true })
            .eq('class_id', user.id); // Assuming teacher_id is stored in class_id

          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            role: user.role as 'teacher',
            schoolId: user.school_id,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at),
            studentCount: studentCount || 0,
            classCount: 1, // Mock data
            lastActive: '2024-01-20' // Mock data
          } as TeacherWithStats;
        }) || []
      );

      return teachersWithStats;
    } catch (error) {
      logger.error('Error fetching teachers:', error);
      throw new Error('Failed to fetch teachers');
    }
  }

  /**
   * Get all students for this school
   */
  async getStudents(): Promise<StudentWithClass[]> {
    try {
      const { data: students, error } = await supabase
        .from('students')
        .select(`
          id, first_name, last_name, date_of_birth, school_id, class_id, created_at, updated_at,
          classes(name),
          users(full_name)
        `)
        .eq('school_id', this.schoolId);

      if (error) throw error;

      return students?.map((student: any) => {
        const className = Array.isArray(student.classes)
          ? student.classes[0]?.name
          : student.classes?.name;
        const teacherName = Array.isArray(student.users)
          ? student.users[0]?.full_name
          : student.users?.full_name;

        return {
          id: student.id,
          firstName: student.first_name,
          lastName: student.last_name,
          dateOfBirth: new Date(student.date_of_birth),
          schoolId: student.school_id,
          className: className || 'N/A',
          teacherName: teacherName || 'N/A',
          lastGradeDate: '2024-01-15' // Mock data
        } as StudentWithClass;
      }) || [];
    } catch (error) {
      logger.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }
  }

  /**
   * Get school information
   */
  async getSchoolInfo(): Promise<School> {
    try {
      const { data: school, error } = await supabase
        .from('schools')
        .select('id, name, address, phone, email, created_at, updated_at')
        .eq('id', this.schoolId)
        .single();

      if (error) throw error;

      return {
        id: school.id,
        name: school.name,
        address: school.address,
        phone: school.phone,
        email: school.email,
        createdAt: new Date(school.created_at),
        updatedAt: new Date(school.updated_at)
      };
    } catch (error) {
      logger.error('Error fetching school info:', error);
      throw new Error('Failed to fetch school information');
    }
  }
}

export default SchoolAdminService;
