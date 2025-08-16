import { supabase } from '../lib/supabase';
import { Class, Student, Grade, Homework, User } from '../types';
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
        .select('*', { count: 'exact', head: true })
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
            .select('*', { count: 'exact', head: true })
            .eq('class_id', cls.id);
          totalStudents += studentCount || 0;
        }
      }

      // Get pending grades (homework that needs grading)
      const { count: pendingGrades } = await supabase
        .from('homework')
        .select('*', { count: 'exact', head: true })
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
      // Mock recent activities - replace with actual activity logging system
      const mockActivities: RecentActivity[] = [
        { 
          id: '1', 
          type: 'grade', 
          message: 'Notes ajoutées pour le contrôle de Mathématiques - 6ème A', 
          time: '2h', 
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: 'BarChart3',
          color: 'text-primary-600'
        },
        { 
          id: '2', 
          type: 'attendance', 
          message: 'Présences marquées pour 5ème B', 
          time: '4h', 
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          icon: 'CheckCircle',
          color: 'text-green-600'
        },
        { 
          id: '3', 
          type: 'message', 
          message: 'Nouveau message de parent - Marie Kabongo', 
          time: '6h', 
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          icon: 'MessageSquare',
          color: 'text-secondary-600'
        },
        { 
          id: '4', 
          type: 'homework', 
          message: 'Devoir créé: Exercices de géométrie', 
          time: '1j', 
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          icon: 'ClipboardCheck',
          color: 'text-purple-600'
        }
      ];

      return mockActivities.slice(0, limit);
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
      // Mock upcoming tasks
      const mockTasks: UpcomingTask[] = [
        { 
          id: '1', 
          task: 'Corriger contrôle de Mathématiques', 
          deadline: 'Demain 16:00', 
          priority: 'high', 
          class: '6ème A' 
        },
        { 
          id: '2', 
          task: 'Préparer cours sur les fractions', 
          deadline: 'Vendredi 08:00', 
          priority: 'medium', 
          class: '5ème B' 
        },
        { 
          id: '3', 
          task: 'Générer bulletins trimestriels', 
          deadline: 'Vendredi 17:00', 
          priority: 'high', 
          class: 'Toutes classes' 
        }
      ];

      return mockTasks;
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

      // Enhance students with grades and stats
      const studentsWithGrades = students?.map(student => ({
        ...student,
        latestGrade: 15, // Mock data
        attendanceRate: 92, // Mock data
        lastActivity: '2 jours' // Mock data
      } as StudentWithGrades)) || [];

      return studentsWithGrades;
    } catch (error) {
      console.error('Error fetching students:', error);
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
        .select('*')
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
        .select('*')
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
