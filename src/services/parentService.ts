import { supabase } from '../lib/supabase';
import { Student, Grade, Message, User } from '../types';
import logger from '../utils/logger';

export interface ParentStats {
  childrenCount: number;
  overallAverage: number;
  paymentStatus: 'À jour' | 'En retard' | 'En souffrance';
  overallAttendance: number;
}

export interface ChildInfo extends Student {
  className: string;
  average: number;
  attendance: number;
  recentGrades: Grade[];
}

export interface TeacherMessage extends Message {
  teacherName: string;
  subject: string;
  isRead: boolean;
  isNew: boolean;
}

export interface PaymentInfo {
  id: string;
  amount: number;
  dueDate: string;
  status: 'payé' | 'en retard' | 'à payer';
  description: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
  reason?: string;
}

export class ParentService {
  private parentId: string;

  constructor(parentId: string) {
    this.parentId = parentId;
  }

  /**
   * Get parent statistics
   */
  async getParentStats(): Promise<ParentStats> {
    try {
      // Get children for this parent
      const { data: children, error: childrenError } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', this.parentId);

      if (childrenError) throw childrenError;

      const childrenCount = children?.length || 0;

      // Calculate overall average (mock data)
      const overallAverage = 15.2;

      // Mock payment status
      const paymentStatus: 'À jour' | 'En retard' | 'En souffrance' = 'À jour';

      // Mock overall attendance
      const overallAttendance = 95;

      return {
        childrenCount,
        overallAverage,
        paymentStatus,
        overallAttendance
      };
    } catch (error) {
      logger.error('Error fetching parent stats:', error);
      throw new Error('Failed to fetch parent statistics');
    }
  }

  /**
   * Get children information for this parent
   */
  async getChildren(): Promise<ChildInfo[]> {
    try {
      const { data: children, error: childrenError } = await supabase
        .from('students')
        .select(`
          *,
          classes(name)
        `)
        .eq('parent_id', this.parentId);

      if (childrenError) throw childrenError;

      // Enhance children with additional info
      const childrenWithInfo = children?.map(child => ({
        ...child,
        className: child.classes?.name || 'N/A',
        average: 15.2, // Mock data
        attendance: 95, // Mock data
        recentGrades: [] // Mock data
      } as ChildInfo)) || [];

      return childrenWithInfo;
    } catch (error) {
      logger.error('Error fetching children:', error);
      throw new Error('Failed to fetch children information');
    }
  }

  /**
   * Get messages from teachers for this parent's children
   */
  async getTeacherMessages(): Promise<TeacherMessage[]> {
    try {
      // Mock teacher messages
      const mockMessages: TeacherMessage[] = [
        { 
          id: '1',
          content: 'Félicitations pour les excellents résultats de Marie en mathématiques ce trimestre!',
          senderId: 'teacher-1',
          receiverId: this.parentId,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          teacherName: 'Mme. Lucie',
          subject: 'Mathématiques',
          isRead: false,
          isNew: true
        },
        { 
          id: '2',
          content: 'Rappel: Projet de sciences à rendre vendredi prochain.',
          senderId: 'teacher-2',
          receiverId: this.parentId,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          teacherName: 'M. Pierre',
          subject: 'Sciences',
          isRead: true,
          isNew: false
        }
      ];

      return mockMessages;
    } catch (error) {
      logger.error('Error fetching teacher messages:', error);
      throw new Error('Failed to fetch teacher messages');
    }
  }

  /**
   * Get payment information for this parent
   */
  async getPaymentInfo(): Promise<PaymentInfo[]> {
    try {
      // Mock payment information
      const mockPayments: PaymentInfo[] = [
        { 
          id: '1',
          amount: 50000,
          dueDate: '2024-02-01',
          status: 'payé',
          description: 'Frais de scolarité - Trimestre 1'
        },
        { 
          id: '2',
          amount: 50000,
          dueDate: '2024-05-01',
          status: 'à payer',
          description: 'Frais de scolarité - Trimestre 2'
        }
      ];

      return mockPayments;
    } catch (error) {
      logger.error('Error fetching payment info:', error);
      throw new Error('Failed to fetch payment information');
    }
  }

  /**
   * Get attendance records for a specific child
   */
  async getChildAttendance(childId: string): Promise<AttendanceRecord[]> {
    try {
      // Mock attendance records
      const mockAttendance: AttendanceRecord[] = [
        { date: '2024-01-20', status: 'present' },
        { date: '2024-01-19', status: 'present' },
        { date: '2024-01-18', status: 'late', reason: 'Retard de 15 minutes' },
        { date: '2024-01-17', status: 'present' },
        { date: '2024-01-16', status: 'absent', reason: 'Maladie' }
      ];

      return mockAttendance;
    } catch (error) {
      logger.error('Error fetching attendance records:', error);
      throw new Error('Failed to fetch attendance records');
    }
  }

  /**
   * Get grades for a specific child
   */
  async getChildGrades(childId: string): Promise<Grade[]> {
    try {
      // Mock grades
      const mockGrades: Grade[] = [
        { 
          id: '1',
          studentId: childId,
          subject: 'Mathématiques',
          score: 16,
          maxScore: 20,
          date: '2024-01-15',
          description: 'Contrôle sur les fractions'
        },
        { 
          id: '2',
          studentId: childId,
          subject: 'Français',
          score: 14,
          maxScore: 20,
          date: '2024-01-10',
          description: 'Dictée'
        },
        { 
          id: '3',
          studentId: childId,
          subject: 'Histoire',
          score: 17,
          maxScore: 20,
          date: '2024-01-05',
          description: 'Examen sur la Révolution française'
        }
      ];

      return mockGrades;
    } catch (error) {
      logger.error('Error fetching child grades:', error);
      throw new Error('Failed to fetch child grades');
    }
  }

  /**
   * Send a message to a teacher
   */
  async sendMessage(teacherId: string, content: string): Promise<void> {
    try {
      // In a real implementation, you would save this to a messages table
      logger.log(`Message sent to teacher ${teacherId}: ${content}`);
      
      // For now, we'll just log to console
      // TODO: Implement actual message sending to database
    } catch (error) {
      logger.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  /**
   * Get parent information
   */
  async getParentInfo(): Promise<User> {
    try {
      const { data: parent, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', this.parentId)
        .single();

      if (error) throw error;

      return {
        id: parent.id,
        email: parent.email,
        name: parent.full_name,
        role: parent.role,
        schoolId: parent.school_id,
        createdAt: new Date(parent.created_at),
        updatedAt: new Date(parent.updated_at)
      };
    } catch (error) {
      logger.error('Error fetching parent info:', error);
      throw new Error('Failed to fetch parent information');
    }
  }
}

export default ParentService;
