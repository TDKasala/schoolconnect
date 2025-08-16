import { supabase } from '../lib/supabase';
import logger from '../utils/logger';

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
  description?: string;
  targetType?: string;
  targetId?: string;
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
      logger.error('Error fetching overview data:', error);
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
          .select('id', { count: 'exact', head: true });

        if (studentsError) throw studentsError;
        totalStudents = studentsCount || 0;

        const { count: teachersCount, error: teachersError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'teacher');

        if (teachersError) throw teachersError;
        totalTeachers = teachersCount || 0;

        const { count: classesCount, error: classesError } = await supabase
          .from('classes')
          .select('id', { count: 'exact', head: true });

        if (classesError) throw classesError;
        totalClasses = classesCount || 0;

        const { count: schoolsCount, error: schoolsError } = await supabase
          .from('schools')
          .select('id', { count: 'exact', head: true });

        if (schoolsError) throw schoolsError;
        totalSchools = schoolsCount || 0;

        const { count: allUsersCount, error: allUsersError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true });

        if (allUsersError) throw allUsersError;
        activeUsers = allUsersCount || 0;
        pendingUsers = 0; // No status column available, set to 0
      } else if (this.userRole === 'school_admin' && this.schoolId) {
        // School admin sees stats for their school
        const { count: studentsCount, error: studentsError } = await supabase
          .from('students')
          .select('id', { count: 'exact', head: true })
          .eq('school_id', this.schoolId);

        if (studentsError) throw studentsError;
        totalStudents = studentsCount || 0;

        const { count: teachersCount, error: teachersError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'teacher')
          .eq('school_id', this.schoolId);

        if (teachersError) throw teachersError;
        totalTeachers = teachersCount || 0;

        const { count: classesCount, error: classesError } = await supabase
          .from('classes')
          .select('id', { count: 'exact', head: true })
          .eq('school_id', this.schoolId);

        if (classesError) throw classesError;
        totalClasses = classesCount || 0;

        totalSchools = 1;

        const { count: activeUsersCount, error: activeUsersError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active')
          .eq('school_id', this.schoolId);

        if (activeUsersError) throw activeUsersError;
        activeUsers = activeUsersCount || 0;

        const { count: pendingUsersCount, error: pendingUsersError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending')
          .eq('school_id', this.schoolId);

        if (pendingUsersError) throw pendingUsersError;
        pendingUsers = pendingUsersCount || 0;
      } else if (this.userRole === 'teacher' && this.schoolId) {
        // Teacher sees stats for their classes
        const { count: studentsCount, error: studentsError } = await supabase
          .from('students')
          .select('id', { count: 'exact', head: true })
          .eq('school_id', this.schoolId);

        if (studentsError) throw studentsError;
        totalStudents = studentsCount || 0;

        totalTeachers = 1;
        totalSchools = 1;

        const { count: classesCount, error: classesError } = await supabase
          .from('classes')
          .select('id', { count: 'exact', head: true })
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
      logger.error('Error fetching stats:', error);
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
          id, user_id, action, target, target_type, target_id, description, created_at, school_id,
          users!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (this.schoolId && this.userRole !== 'platform_admin') {
        query = query.eq('school_id', this.schoolId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(activity => {
        const userJoin = activity.users as any;
        const userFullName = Array.isArray(userJoin)
          ? userJoin[0]?.full_name
          : userJoin?.full_name;
        return {
        id: activity.id,
        userId: activity.user_id,
        userName: userFullName || 'Unknown User',
        action: activity.action,
        // Prefer explicit target if present; fall back to target_type string
        target: activity.target || activity.target_type || '',
        // Include rich fields if present on the row
        description: activity.description || undefined,
        targetType: activity.target_type || undefined,
        targetId: activity.target_id || undefined,
        timestamp: new Date(activity.created_at)
        };
      }) || [];
    } catch (error) {
      logger.error('Error fetching recent activities:', error);
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
        .select('id, title, start_date, end_date, location, event_type')
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
      logger.error('Error fetching upcoming events:', error);
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
        .select('id, sender_id, content, created_at, is_read')
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
        senderName: 'User', // Simplified for now
        content: message.content,
        timestamp: new Date(message.created_at),
        isRead: message.is_read || false
      })) || [];
    } catch (error) {
      logger.error('Error fetching recent messages:', error);
      throw new Error('Failed to fetch recent messages');
    }
  }

  /**
   * Get financial summary
   */
  async getFinancialSummary(): Promise<FinancialSummary> {
    try {
      // Build base filters by role for re-use
      const baseFilter = (q: any) => {
        if (this.schoolId && this.userRole !== 'platform_admin') {
          return q.eq('school_id', this.schoolId);
        }
        return q;
      };

      // Count pending and completed without fetching rows
      const [pendingRes, completedRes] = await Promise.all([
        baseFilter(
          supabase.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'pending')
        ),
        baseFilter(
          supabase.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'completed')
        )
      ]);

      if (pendingRes.error) throw pendingRes.error;
      if (completedRes.error) throw completedRes.error;

      const pendingPayments = pendingRes.count || 0;
      const completedPayments = completedRes.count || 0;

      // Fetch only completed payment amounts to compute revenue client-side
      const completedAmountsQuery = baseFilter(
        supabase.from('payments').select('amount').eq('status', 'completed')
      );
      const { data: completedAmounts, error: completedAmountsError } = await completedAmountsQuery;
      if (completedAmountsError) throw completedAmountsError;

      const totalRevenue = (completedAmounts || []).reduce((sum: number, p: { amount?: number }) => sum + (p.amount || 0), 0);

      // Overdue calculation: placeholder until due dates are modeled
      const overduePayments = pendingPayments; // TODO: replace with due-date based logic

      return { totalRevenue, pendingPayments, completedPayments, overduePayments };
    } catch (error) {
      logger.error('Error fetching financial summary:', error);
      throw new Error('Failed to fetch financial summary');
    }
  }

  /**
   * Get class performance metrics
   */
  async getClassPerformance(limit: number = 5): Promise<ClassPerformance[]> {
    try {
      // 1) Fetch classes (scoped by school where applicable)
      let classesQuery = supabase
        .from('classes')
        .select(`
          id,
          name,
          students:students(count)
        `)
        .order('name', { ascending: true })
        .limit(limit);

      if (this.schoolId && this.userRole !== 'platform_admin') {
        classesQuery = classesQuery.eq('school_id', this.schoolId);
      }

      const { data: classes, error: classesError } = await classesQuery as any;
      if (classesError) throw classesError;

      if (!classes || classes.length === 0) return [];

      // 2) Fetch students for these classes
      const classIds = classes.map((c: any) => c.id);
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, class_id')
        .in('class_id', classIds);

      if (studentsError) throw studentsError;

      const studentIds = (students || []).map(s => s.id);

      // 3) Fetch all grades for these students
      // Build student->class map for quick lookup
      const studentToClass = new Map<string, string>();
      (students || []).forEach(s => studentToClass.set(s.id, s.class_id));

      // 3) Fetch grades only for relevant students
      const sumByClass = new Map<string, number>();
      const gradeCountByClass = new Map<string, number>();

      if (studentIds.length > 0) {
        const { data: grades, error: gradesError } = await supabase
          .from('grades')
          .select('student_id, grade')
          .in('student_id', studentIds);

        if (gradesError) throw gradesError;

        (grades || []).forEach(g => {
          const clsId = studentToClass.get(g.student_id);
          if (!clsId) return;
          sumByClass.set(clsId, (sumByClass.get(clsId) || 0) + g.grade);
          gradeCountByClass.set(clsId, (gradeCountByClass.get(clsId) || 0) + 1);
        });
      }

      // 4) Compute per-class average
      const avgByClass = new Map<string, number>();
      Array.from(sumByClass.entries()).forEach(([clsId, sum]) => {
        const cnt = gradeCountByClass.get(clsId) || 0;
        if (cnt > 0) avgByClass.set(clsId, Math.round((sum / cnt) * 10) / 10);
      });

      // 5) Build result list
      const result: ClassPerformance[] = classes.map((cls: any) => ({
        classId: cls.id,
        className: cls.name,
        averageGrade: avgByClass.get(cls.id) || 0,
        attendanceRate: 0, // TODO: compute when attendance table is available
        studentCount: cls.students?.[0]?.count || 0
      }));

      return result;
    } catch (error) {
      logger.error('Error fetching class performance:', error);
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
