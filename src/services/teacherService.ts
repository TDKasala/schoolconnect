import { supabase } from '../lib/supabase';
import { Class, Student, User } from '../types';
import logger from '../utils/logger';

export interface TeacherStats {
  classCount: number;
  totalStudents: number;
  pendingGrades: number;
  weeklyClasses: number;
}

export interface ClassWithStats extends Class {
  studentCount: number;
  nextClass: string;
  attendanceRate: number;
  averageGrade: number;
}

export interface RecentActivity {
  id: string;
  type: 'grade' | 'attendance' | 'message' | 'homework';
  message: string;
  time: string;
  timestamp: Date;
  icon: string;
  color: string;
}

export interface UpcomingTask {
  id: string;
  task: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  class: string;
}

// Local Homework type matching the fields used in this service
export interface Homework {
  id: string;
  class_id: string;
  title: string;
  description?: string;
  due_date: string;
  subject?: string;
  teacher_id: string;
  created_at: string;
  updated_at: string;
}

export interface StudentWithGrades extends Student {
  latestGrade?: number;
  attendanceRate: number;
  lastActivity: string;
}

export class TeacherService {
  private teacherId: string;

  constructor(teacherId: string) {
    this.teacherId = teacherId;
  }

  /**
   * Get teacher statistics
   */
  async getTeacherStats(): Promise<TeacherStats> {
    try {
      // Get classes count for this teacher
      const { count: classCount } = await supabase
        .from('classes')
        .select('id', { count: 'exact', head: true })
        .eq('teacher_id', this.teacherId);

      // Get total students across all classes
      const { data: classes } = await supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', this.teacherId);

      let totalStudents = 0;
      if (classes) {
        for (const cls of classes) {
          const { count: studentCount } = await supabase
            .from('students')
            .select('id', { count: 'exact', head: true })
            .eq('class_id', cls.id);
          totalStudents += studentCount || 0;
        }
      }

      // Get pending grades (homework that needs grading)
      const { count: pendingGrades } = await supabase
        .from('homework')
        .select('id', { count: 'exact', head: true })
        .eq('teacher_id', this.teacherId)
        .eq('status', 'submitted');

      // Get weekly classes (mock data)
      const weeklyClasses = 18;

      return {
        classCount: classCount || 0,
        totalStudents,
        pendingGrades: pendingGrades || 0,
        weeklyClasses
      };
    } catch (error) {
      logger.error('Error fetching teacher stats:', error);
      throw new Error('Failed to fetch teacher statistics');
    }
  }

  /**
   * Get classes with statistics for this teacher
   */
  async getClassesWithStats(): Promise<ClassWithStats[]> {
    try {
      const { data: classes, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', this.teacherId);

      if (error) throw error;

      // Enhance classes with stats
      const classesWithStats = await Promise.all(
        classes?.map(async (cls) => {
          // Get student count
          const { count: studentCount } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', cls.id);

          // Mock data for other stats
          return {
            ...cls,
            studentCount: studentCount || 0,
            nextClass: '14:00',
            attendanceRate: 92,
            averageGrade: 14.5
          } as ClassWithStats;
        }) || []
      );

      return classesWithStats;
    } catch (error) {
      logger.error('Error fetching classes:', error);
      throw new Error('Failed to fetch classes');
    }
  }

  /**
   * Get recent activities for this teacher
   */
  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    try {
      // Fetch recent grades given by this teacher
      const { data: recentGrades, error: gradesError } = await supabase
        .from('grades')
        .select('id, subject, created_at')
        .eq('teacher_id', this.teacherId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (gradesError) throw gradesError;

      // Fetch recently created homework by this teacher
      const { data: recentHomework, error: hwError } = await supabase
        .from('homework')
        .select('id, title, created_at')
        .eq('teacher_id', this.teacherId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (hwError) throw hwError;

      const activities: RecentActivity[] = [];

      (recentGrades || []).forEach(g => {
        const ts = new Date(g.created_at);
        activities.push({
          id: `grade-${g.id}`,
          type: 'grade',
          message: `Notes ajoutées pour ${g.subject}`,
          time: ts.toLocaleString(),
          timestamp: ts,
          icon: 'BarChart3',
          color: 'text-primary-600'
        });
      });

      (recentHomework || []).forEach(h => {
        const ts = new Date(h.created_at);
        activities.push({
          id: `homework-${h.id}`,
          type: 'homework',
          message: `Devoir créé: ${h.title}`,
          time: ts.toLocaleString(),
          timestamp: ts,
          icon: 'ClipboardCheck',
          color: 'text-purple-600'
        });
      });

      // Sort by timestamp desc and limit
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      return activities.slice(0, limit);
    } catch (error) {
      logger.error('Error fetching recent activities:', error);
      throw new Error('Failed to fetch recent activities');
    }
  }

  /**
   * Get upcoming tasks for this teacher
   */
  async getUpcomingTasks(): Promise<UpcomingTask[]> {
    try {
      const nowIso = new Date().toISOString();
      const { data: homework, error } = await supabase
        .from('homework')
        .select('id, title, due_date, class_id')
        .eq('teacher_id', this.teacherId)
        .gte('due_date', nowIso)
        .order('due_date', { ascending: true })
        .limit(50);

      if (error) throw error;

      const tasks: UpcomingTask[] = (homework || []).map(hw => {
        const due = new Date(hw.due_date);
        const hoursLeft = Math.max(0, Math.round((due.getTime() - Date.now()) / (1000 * 60 * 60)));
        let priority: 'high' | 'medium' | 'low' = 'low';
        if (hoursLeft <= 24) priority = 'high';
        else if (hoursLeft <= 72) priority = 'medium';

        return {
          id: hw.id,
          task: hw.title,
          deadline: due.toLocaleString(),
          priority,
          class: hw.class_id || '—'
        };
      });

      return tasks;
    } catch (error) {
      logger.error('Error fetching upcoming tasks:', error);
      throw new Error('Failed to fetch upcoming tasks');
    }
  }

  /**
   * Get students with grades for a specific class
   */
  async getStudentsWithGrades(classId: string): Promise<StudentWithGrades[]> {
    try {
      const { data: students, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId);

      if (error) throw error;

      const studentIds = (students || []).map(s => s.id);
      if (studentIds.length === 0) return [];

      // Fetch latest grade per student
      const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select('id, student_id, grade, created_at')
        .in('student_id', studentIds)
        .order('created_at', { ascending: false });

      if (gradesError) throw gradesError;

      const latestByStudent = new Map<string, { grade: number; created_at: string }>();
      (grades || []).forEach(g => {
        if (!latestByStudent.has(g.student_id)) {
          latestByStudent.set(g.student_id, { grade: g.grade, created_at: g.created_at });
        }
      });

      const studentsWithGrades: StudentWithGrades[] = (students || []).map(s => {
        const latest = latestByStudent.get(s.id);
        return {
          ...s,
          latestGrade: latest?.grade,
          attendanceRate: 0, // TODO: compute from attendance table when available
          lastActivity: latest ? new Date(latest.created_at).toLocaleDateString() : '—'
        } as StudentWithGrades;
      });

      return studentsWithGrades;
    } catch (error) {
      logger.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }
  }

  /**
   * Create a new homework assignment
   */
  async createHomework(homeworkData: {
    classId: string;
    title: string;
    description: string;
    dueDate: string;
    subject: string;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('homework')
        .insert({
          class_id: homeworkData.classId,
          title: homeworkData.title,
          description: homeworkData.description,
          due_date: homeworkData.dueDate,
          subject: homeworkData.subject,
          teacher_id: this.teacherId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Log activity
      logger.log(`Homework created: ${homeworkData.title}`);
    } catch (error) {
      logger.error('Error creating homework:', error);
      throw new Error('Failed to create homework');
    }
  }

  /**
   * Get homework assignments for a specific class
   */
  async getHomework(classId: string): Promise<Homework[]> {
    try {
      const { data: homework, error } = await supabase
        .from('homework')
        .select('id, class_id, title, description, due_date, subject, teacher_id, created_at, updated_at')
        .eq('class_id', classId)
        .order('due_date', { ascending: true });

      if (error) throw error;

      return homework || [];
    } catch (error) {
      logger.error('Error fetching homework:', error);
      throw new Error('Failed to fetch homework');
    }
  }

  /**
   * Update grades for students
   */
  async updateGrades(grades: {
    studentId: string;
    homeworkId: string;
    score: number;
    maxScore: number;
  }[]): Promise<void> {
    try {
      // In a real implementation, you would update grades in the database
      logger.log('Grades updated:', grades);
      
      // For now, we'll just log to console
      // TODO: Implement actual grade updating to database
    } catch (error) {
      logger.error('Error updating grades:', error);
      throw new Error('Failed to update grades');
    }
  }

  /**
   * Get teacher information
   */
  async getTeacherInfo(): Promise<User> {
    try {
      const { data: teacher, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, school_id, created_at, updated_at')
        .eq('id', this.teacherId)
        .single();

      if (error) throw error;

      return {
        id: teacher.id,
        email: teacher.email,
        name: teacher.full_name,
        role: teacher.role,
        schoolId: teacher.school_id,
        createdAt: new Date(teacher.created_at),
        updatedAt: new Date(teacher.updated_at)
      };
    } catch (error) {
      logger.error('Error fetching teacher info:', error);
      throw new Error('Failed to fetch teacher information');
    }
  }
}

export default TeacherService;
