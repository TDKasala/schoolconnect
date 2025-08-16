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
      // Resolve parent email first
      const { data: parentUser, error: parentError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', this.parentId)
        .single();

      if (parentError) throw parentError;

      // Get children for this parent by parent_email
      const { data: children, error: childrenError } = await supabase
        .from('students')
        .select('id')
        .eq('parent_email', parentUser.email);

      if (childrenError) throw childrenError;

      const childrenIds = (children || []).map(c => c.id);
      const childrenCount = childrenIds.length;

      // Calculate overall average from grades table
      let overallAverage = 0;
      if (childrenIds.length > 0) {
        const { data: grades, error: gradesError } = await supabase
          .from('grades')
          .select('grade, student_id')
          .in('student_id', childrenIds);

        if (gradesError) throw gradesError;

        const gradesArr = grades || [];
        if (gradesArr.length > 0) {
          overallAverage =
            Math.round((gradesArr.reduce((sum, g) => sum + (g.grade || 0), 0) / gradesArr.length) * 10) /
            10;
        }
      }

      // Payment status derived from payments table
      let paymentStatus: 'À jour' | 'En retard' | 'En souffrance' = 'À jour';
      if (childrenIds.length > 0) {
        const { data: payments, error: payError } = await supabase
          .from('payments')
          .select('status, due_date, student_id')
          .in('student_id', childrenIds);

        if (payError) throw payError;

        const hasOverdue = (payments || []).some(p => p.status === 'overdue');
        const hasPending = (payments || []).some(p => p.status === 'pending');
        if (hasOverdue) paymentStatus = 'En retard';
        else if (hasPending) paymentStatus = 'En souffrance';
      }

      // Attendance table not defined in schema yet; set placeholder 0 and TODO
      const overallAttendance = 0;

      return { childrenCount, overallAverage, paymentStatus, overallAttendance };
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
      // Resolve parent email
      const { data: parentUser, error: parentError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', this.parentId)
        .single();

      if (parentError) throw parentError;

      const { data: children, error: childrenError } = await supabase
        .from('students')
        .select(`
          id, first_name, last_name, class_id, school_id, created_at, updated_at,
          classes(name)
        `)
        .eq('parent_email', parentUser.email);

      if (childrenError) throw childrenError;

      const childIds = (children || []).map(c => c.id);

      // Fetch recent grades for these children
      let recentGradesByStudent = new Map<string, any[]>();
      let averagesByStudent = new Map<string, number>();
      if (childIds.length > 0) {
        const { data: grades, error: gradesError } = await supabase
          .from('grades')
          .select('student_id, subject, grade, created_at')
          .in('student_id', childIds)
          .order('created_at', { ascending: false });

        if (gradesError) throw gradesError;

        (grades || []).forEach(g => {
          const arr = recentGradesByStudent.get(g.student_id) || [];
          if (arr.length < 5) arr.push(g);
          recentGradesByStudent.set(g.student_id, arr);
        });

        // Compute averages per student
        childIds.forEach(id => {
          const arr = (grades || []).filter(g => g.student_id === id);
          const avg = arr.length ? arr.reduce((s, x) => s + x.grade, 0) / arr.length : 0;
          averagesByStudent.set(id, Math.round(avg * 10) / 10);
        });
      }

      const childrenWithInfo: ChildInfo[] = (children || []).map((child: any) => ({
        id: child.id,
        firstName: child.first_name,
        lastName: child.last_name,
        dateOfBirth: new Date(child.created_at), // Unknown, placeholder mapping
        gender: 'M', // Unknown, placeholder
        parentId: undefined,
        classId: child.class_id,
        schoolId: child.school_id,
        enrollmentDate: new Date(child.created_at),
        createdAt: new Date(child.created_at),
        updatedAt: new Date(child.updated_at),
        className: child.classes?.name || 'N/A',
        average: averagesByStudent.get(child.id) || 0,
        attendance: 0,
        recentGrades: (recentGradesByStudent.get(child.id) || []).map(g => ({
          id: 'n/a',
          studentId: child.id,
          subjectId: 'n/a',
          evaluationType: 'note',
          score: g.grade,
          maxScore: 20,
          date: new Date(g.created_at),
          teacherId: 'n/a',
          createdAt: new Date(g.created_at),
          updatedAt: new Date(g.created_at)
        })) as any
      }));

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
      const { data: messages, error } = await supabase
        .from('messages')
        .select('id, content, sender_id, receiver_id, read, created_at, users!messages_sender_id_fkey(full_name)')
        .eq('receiver_id', this.parentId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const mapped: TeacherMessage[] = (messages || []).map((m: any) => ({
        id: m.id,
        content: m.content,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        timestamp: new Date(m.created_at),
        teacherName: m.users?.full_name || 'Enseignant',
        subject: 'Message',
        read: !!m.read,
        isRead: !!m.read,
        isNew: !m.read
      }));

      return mapped;
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
      // Resolve parent email, fetch children ids
      const { data: parentUser, error: parentError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', this.parentId)
        .single();

      if (parentError) throw parentError;

      const { data: children, error: childrenError } = await supabase
        .from('students')
        .select('id')
        .eq('parent_email', parentUser.email);

      if (childrenError) throw childrenError;

      const childIds = (children || []).map(c => c.id);
      if (childIds.length === 0) return [];

      const { data: payments, error } = await supabase
        .from('payments')
        .select('id, amount, due_date, status')
        .in('student_id', childIds)
        .order('due_date', { ascending: true });

      if (error) throw error;

      const mapped: PaymentInfo[] = (payments || []).map(p => ({
        id: p.id,
        amount: p.amount,
        dueDate: p.due_date,
        status: p.status === 'paid' ? 'payé' : p.status === 'overdue' ? 'en retard' : 'à payer',
        description: 'Frais de scolarité'
      }));

      return mapped;
    } catch (error) {
      logger.error('Error fetching payment info:', error);
      throw new Error('Failed to fetch payment information');
    }
  }

  /**
   * Get attendance records for a specific child
   */
  async getChildAttendance(_childId: string): Promise<AttendanceRecord[]> {
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
      const { data: grades, error } = await supabase
        .from('grades')
        .select('id, student_id, subject, grade, evaluation, created_at, teacher_id')
        .eq('student_id', childId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Map DB schema to app Grade interface best-effort
      const mapped: any[] = (grades || []).map(g => ({
        id: g.id,
        studentId: g.student_id,
        subjectId: g.subject, // using subject name as id placeholder
        evaluationType: g.evaluation,
        score: g.grade,
        maxScore: 20,
        date: new Date(g.created_at),
        teacherId: g.teacher_id,
        createdAt: new Date(g.created_at),
        updatedAt: new Date(g.created_at)
      }));

      return mapped as unknown as Grade[];
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
