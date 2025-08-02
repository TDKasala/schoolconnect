import { supabase } from '../lib/supabase';

export interface OverviewStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSchools: number;
  activeUsers: number;
  pendingUsers: number;
}

export interface OverviewData {
  stats: OverviewStats;
  recentActivities: Activity[];
  upcomingEvents: Event[];
  recentMessages: Message[];
  financialSummary: FinancialSummary;
  classPerformance: ClassPerformance[];
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: Date;
}

export interface Event {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  eventType: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  overduePayments: number;
}

export interface ClassPerformance {
  classId: string;
  className: string;
  averageGrade: number;
  attendanceRate: number;
  studentCount: number;
}

export class OverviewService {
  private userId: string;
  private schoolId?: string;
  private userRole: string;

  constructor(userId: string, userRole: string, schoolId?: string) {
    this.userId = userId;
    this.userRole = userRole;
    this.schoolId = schoolId;
  }

  /**
   * Get overview data based on user role
   */
  async getOverviewData(): Promise<OverviewData> {
    try {
      const stats = await this.getStats();
      const recentActivities = await this.getRecentActivities();
      const upcomingEvents = await this.getUpcomingEvents();
      const recentMessages = await this.getRecentMessages();
      const financialSummary = await this.getFinancialSummary();
      const classPerformance = await this.getClassPerformance();

      return {
        stats,
        recentActivities,
        upcomingEvents,
        recentMessages,
        financialSummary,
        classPerformance
      };
    } catch (error) {
      console.error('Error fetching overview data:', error);
      throw new Error('Failed to fetch overview data');
    }
  }

  /**
   * Get statistics based on user role
   */
  async getStats(): Promise<OverviewStats> {
    try {
      let totalStudents = 0;
      let totalTeachers = 0;
      let totalClasses = 0;
      let totalSchools = 0;
      let activeUsers = 0;
      let pendingUsers = 0;

      if (this.userRole === 'platform_admin') {
        // Platform admin sees all stats
        const { count: studentsCount, error: studentsError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true });

        if (studentsError) throw studentsError;
        totalStudents = studentsCount || 0;

        const { count: teachersCount, error: teachersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'teacher');

        if (teachersError) throw teachersError;
        totalTeachers = teachersCount || 0;

        const { count: classesCount, error: classesError } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true });

        if (classesError) throw classesError;
        totalClasses = classesCount || 0;

        const { count: schoolsCount, error: schoolsError } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true });

        if (schoolsError) throw schoolsError;
        totalSchools = schoolsCount || 0;

        const { count: allUsersCount, error: allUsersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (allUsersError) throw allUsersError;
        activeUsers = allUsersCount || 0;
        pendingUsers = 0; // No status column available, set to 0
      } else if (this.userRole === 'school_admin' && this.schoolId) {
        // School admin sees stats for their school
        const { count: studentsCount, error: studentsError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', this.schoolId);

        if (studentsError) throw studentsError;
        totalStudents = studentsCount || 0;

        const { count: teachersCount, error: teachersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'teacher')
          .eq('school_id', this.schoolId);

        if (teachersError) throw teachersError;
        totalTeachers = teachersCount || 0;

        const { count: classesCount, error: classesError } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', this.schoolId);

        if (classesError) throw classesError;
        totalClasses = classesCount || 0;

        totalSchools = 1;

        const { count: activeUsersCount, error: activeUsersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .eq('school_id', this.schoolId);

        if (activeUsersError) throw activeUsersError;
        activeUsers = activeUsersCount || 0;

        const { count: pendingUsersCount, error: pendingUsersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .eq('school_id', this.schoolId);

        if (pendingUsersError) throw pendingUsersError;
        pendingUsers = pendingUsersCount || 0;
      } else if (this.userRole === 'teacher' && this.schoolId) {
        // Teacher sees stats for their classes
        const { count: studentsCount, error: studentsError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', this.schoolId);

        if (studentsError) throw studentsError;
        totalStudents = studentsCount || 0;

        totalTeachers = 1;
        totalSchools = 1;

        const { count: classesCount, error: classesError } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_id', this.userId);

        if (classesError) throw classesError;
        totalClasses = classesCount || 0;

        activeUsers = 1;
      } else if (this.userRole === 'parent' && this.schoolId) {
        // Parent sees stats for their children
        const { data: childrenData, error: childrenError } = await supabase
          .from('students')
          .select('id')
          .eq('parent_id', this.userId);

        if (childrenError) throw childrenError;
        totalStudents = childrenData?.length || 0;
        totalTeachers = 0;
        totalClasses = 0;
        totalSchools = 1;
        activeUsers = 1;
      }

      return {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSchools,
        activeUsers,
        pendingUsers
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error('Failed to fetch statistics');
    }
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    try {
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          user:users!activity_logs_user_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (this.schoolId && this.userRole !== 'platform_admin') {
        query = query.eq('school_id', this.schoolId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(activity => ({
        id: activity.id,
        userId: activity.user_id,
        userName: activity.user?.full_name || 'Unknown User',
        action: activity.action,
        target: activity.target,
        timestamp: new Date(activity.created_at)
      })) || [];
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw new Error('Failed to fetch recent activities');
    }
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit: number = 5): Promise<Event[]> {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(limit);

      if (this.schoolId && this.userRole !== 'platform_admin') {
        query = query.eq('school_id', this.schoolId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(event => ({
        id: event.id,
        title: event.title,
        startDate: new Date(event.start_date),
        endDate: new Date(event.end_date),
        location: event.location,
        eventType: event.event_type
      })) || [];
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Failed to fetch upcoming events');
    }
  }

  /**
   * Get recent messages
   */
  async getRecentMessages(limit: number = 5): Promise<Message[]> {
    try {
      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (this.schoolId && this.userRole !== 'platform_admin') {
        query = query.eq('school_id', this.schoolId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(message => ({
        id: message.id,
        senderId: message.sender_id,
        senderName: message.sender?.full_name || 'Unknown User',
        content: message.content,
        timestamp: new Date(message.created_at),
        isRead: message.is_read
      })) || [];
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      throw new Error('Failed to fetch recent messages');
    }
  }

  /**
   * Get financial summary
   */
  async getFinancialSummary(): Promise<FinancialSummary> {
    try {
      let query = supabase
        .from('payments')
        .select('amount, status');

      if (this.schoolId && this.userRole !== 'platform_admin') {
        query = query.eq('school_id', this.schoolId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate totals
      let totalRevenue = 0;
      let pendingPayments = 0;
      let completedPayments = 0;
      let overduePayments = 0;

      data?.forEach(payment => {
        if (payment.status === 'completed') {
          totalRevenue += payment.amount;
          completedPayments += 1;
        } else if (payment.status === 'pending') {
          pendingPayments += 1;
          
          // In a real app, you would check due date here
          // For now, we'll just increment overduePayments for demo purposes
          overduePayments += 1;
        }
      });

      return {
        totalRevenue,
        pendingPayments,
        completedPayments,
        overduePayments
      };
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      throw new Error('Failed to fetch financial summary');
    }
  }

  /**
   * Get class performance metrics
   */
  async getClassPerformance(limit: number = 5): Promise<ClassPerformance[]> {
    try {
      let query = supabase
        .from('classes')
        .select(`
          id,
          name,
          students:students(count)
        `)
        .order('name', { ascending: true })
        .limit(limit);

      if (this.schoolId && this.userRole !== 'platform_admin') {
        query = query.eq('school_id', this.schoolId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // This is a simplified implementation
      // In a real app, you would calculate actual performance metrics
      return data?.map(cls => ({
        classId: cls.id,
        className: cls.name,
        averageGrade: Math.floor(Math.random() * 40) + 60, // Random grade between 60-100 for demo
        attendanceRate: Math.floor(Math.random() * 30) + 70, // Random attendance between 70-100% for demo
        studentCount: cls.students?.[0]?.count || 0
      })) || [];
    } catch (error) {
      console.error('Error fetching class performance:', error);
      throw new Error('Failed to fetch class performance');
    }
  }

  /**
   * Refresh all overview data
   */
  async refreshOverviewData(): Promise<OverviewData> {
    return this.getOverviewData();
  }
}

export default OverviewService;
