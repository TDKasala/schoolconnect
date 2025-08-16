import { supabase } from '../lib/supabase';
import { Student, Class, Grade, Attendance } from '../types';
import logger from '../utils/logger';

export interface PedagogyStudent extends Student {
  id: string;
  firstName: string;
  lastName: string;
  classId: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  parentId?: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'graduated';
  createdAt: Date;
  updatedAt: Date;
}

export interface PedagogyClass extends Class {
  id: string;
  name: string;
  teacherId: string;
  schoolId: string;
  gradeLevel: string;
  academicYear: string;
  capacity: number;
  studentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PedagogyGrade extends Grade {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  score: number;
  maxScore: number;
  gradeType: 'exam' | 'quiz' | 'assignment' | 'project' | 'other';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PedagogyAttendance extends Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassPerformance {
  classId: string;
  className: string;
  averageGrade: number;
  attendanceRate: number;
  studentCount: number;
  topStudents: PedagogyStudent[];
}

export interface StudentPerformance {
  studentId: string;
  firstName: string;
  lastName: string;
  averageGrade: number;
  attendanceRate: number;
  recentGrades: PedagogyGrade[];
  recentAttendance: PedagogyAttendance[];
}

export class PedagogyService {
  private userId: string;
  private schoolId: string;

  constructor(userId: string, schoolId: string) {
    this.userId = userId;
    this.schoolId = schoolId;
  }

  /**
   * Get all classes for the school
   */
  async getClasses(): Promise<PedagogyClass[]> {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          students:students(class_id,count)
        `)
        .eq('school_id', this.schoolId)
        .order('name', { ascending: true });

      if (error) throw error;

      return data?.map(cls => ({
        id: cls.id,
        name: cls.name,
        teacherId: cls.teacher_id,
        schoolId: cls.school_id,
        gradeLevel: cls.grade_level,
        academicYear: cls.academic_year,
        capacity: cls.capacity,
        studentCount: cls.students?.[0]?.count || 0,
        createdAt: new Date(cls.created_at),
        updatedAt: new Date(cls.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching classes:', error);
      throw new Error('Failed to fetch classes');
    }
  }

  /**
   * Get students in a class
   */
  async getClassStudents(classId: string): Promise<PedagogyStudent[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId)
        .eq('school_id', this.schoolId)
        .order('last_name', { ascending: true });

      if (error) throw error;

      return data?.map(student => ({
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        classId: student.class_id,
        dateOfBirth: student.date_of_birth ? new Date(student.date_of_birth) : undefined,
        gender: student.gender,
        parentId: student.parent_id,
        enrollmentDate: new Date(student.enrollment_date),
        status: student.status,
        createdAt: new Date(student.created_at),
        updatedAt: new Date(student.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching class students:', error);
      throw new Error('Failed to fetch class students');
    }
  }

  /**
   * Get grades for a class
   */
  async getClassGrades(classId: string): Promise<PedagogyGrade[]> {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          student:students!grades_student_id_fkey(first_name, last_name)
        `)
        .eq('class_id', classId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(grade => ({
        id: grade.id,
        studentId: grade.student_id,
        classId: grade.class_id,
        subject: grade.subject,
        score: grade.score,
        maxScore: grade.max_score,
        gradeType: grade.grade_type,
        description: grade.description,
        createdAt: new Date(grade.created_at),
        updatedAt: new Date(grade.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching class grades:', error);
      throw new Error('Failed to fetch class grades');
    }
  }

  /**
   * Get attendance records for a class
   */
  async getClassAttendance(classId: string, date?: Date): Promise<PedagogyAttendance[]> {
    try {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          student:students!attendance_student_id_fkey(first_name, last_name)
        `)
        .eq('class_id', classId);

      if (date) {
        query = query.eq('date', date.toISOString().split('T')[0]);
      }

      query = query.order('date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(attendance => ({
        id: attendance.id,
        studentId: attendance.student_id,
        classId: attendance.class_id,
        date: new Date(attendance.date),
        status: attendance.status,
        notes: attendance.notes,
        createdAt: new Date(attendance.created_at),
        updatedAt: new Date(attendance.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching class attendance:', error);
      throw new Error('Failed to fetch class attendance');
    }
  }

  /**
   * Get grades for a student
   */
  async getStudentGrades(studentId: string): Promise<PedagogyGrade[]> {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(grade => ({
        id: grade.id,
        studentId: grade.student_id,
        classId: grade.class_id,
        subject: grade.subject,
        score: grade.score,
        maxScore: grade.max_score,
        gradeType: grade.grade_type,
        description: grade.description,
        createdAt: new Date(grade.created_at),
        updatedAt: new Date(grade.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching student grades:', error);
      throw new Error('Failed to fetch student grades');
    }
  }

  /**
   * Get attendance records for a student
   */
  async getStudentAttendance(studentId: string): Promise<PedagogyAttendance[]> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false });

      if (error) throw error;

      return data?.map(attendance => ({
        id: attendance.id,
        studentId: attendance.student_id,
        classId: attendance.class_id,
        date: new Date(attendance.date),
        status: attendance.status,
        notes: attendance.notes,
        createdAt: new Date(attendance.created_at),
        updatedAt: new Date(attendance.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching student attendance:', error);
      throw new Error('Failed to fetch student attendance');
    }
  }

  /**
   * Add a grade for a student
   */
  async addGrade(gradeData: Omit<PedagogyGrade, 'id' | 'createdAt' | 'updatedAt'>): Promise<PedagogyGrade> {
    try {
      const { data, error } = await supabase
        .from('grades')
        .insert({
          student_id: gradeData.studentId,
          class_id: gradeData.classId,
          subject: gradeData.subject,
          score: gradeData.score,
          max_score: gradeData.maxScore,
          grade_type: gradeData.gradeType,
          description: gradeData.description
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        studentId: data.student_id,
        classId: data.class_id,
        subject: data.subject,
        score: data.score,
        maxScore: data.max_score,
        gradeType: data.grade_type,
        description: data.description,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error adding grade:', error);
      throw new Error('Failed to add grade');
    }
  }

  /**
   * Update a grade
   */
  async updateGrade(gradeId: string, gradeData: Partial<PedagogyGrade>): Promise<PedagogyGrade> {
    try {
      const { data, error } = await supabase
        .from('grades')
        .update({
          score: gradeData.score,
          max_score: gradeData.maxScore,
          grade_type: gradeData.gradeType,
          description: gradeData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', gradeId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        studentId: data.student_id,
        classId: data.class_id,
        subject: data.subject,
        score: data.score,
        maxScore: data.max_score,
        gradeType: data.grade_type,
        description: data.description,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error updating grade:', error);
      throw new Error('Failed to update grade');
    }
  }

  /**
   * Record attendance for a student
   */
  async recordAttendance(attendanceData: Omit<PedagogyAttendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<PedagogyAttendance> {
    try {
      // Check if attendance record already exists for this student on this date
      const { data: existingData, error: fetchError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', attendanceData.studentId)
        .eq('class_id', attendanceData.classId)
        .eq('date', attendanceData.date.toISOString().split('T')[0]);

      if (fetchError) throw fetchError;

      if (existingData && existingData.length > 0) {
        // Update existing record
        const { data, error } = await supabase
          .from('attendance')
          .update({
            status: attendanceData.status,
            notes: attendanceData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData[0].id)
          .select()
          .single();

        if (error) throw error;

        return {
          id: data.id,
          studentId: data.student_id,
          classId: data.class_id,
          date: new Date(data.date),
          status: data.status,
          notes: data.notes,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('attendance')
          .insert({
            student_id: attendanceData.studentId,
            class_id: attendanceData.classId,
            date: attendanceData.date.toISOString().split('T')[0],
            status: attendanceData.status,
            notes: attendanceData.notes
          })
          .select()
          .single();

        if (error) throw error;

        return {
          id: data.id,
          studentId: data.student_id,
          classId: data.class_id,
          date: new Date(data.date),
          status: data.status,
          notes: data.notes,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
      }
    } catch (error) {
      logger.error('Error recording attendance:', error);
      throw new Error('Failed to record attendance');
    }
  }

  /**
   * Get class performance metrics
   */
  async getClassPerformance(classId: string): Promise<ClassPerformance> {
    try {
      // Get class info
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, name')
        .eq('id', classId)
        .single();

      if (classError) throw classError;

      // Get students in class
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, first_name, last_name')
        .eq('class_id', classId);

      if (studentsError) throw studentsError;

      // Get average grades for class
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select('student_id, score, max_score')
        .eq('class_id', classId);

      if (gradesError) throw gradesError;

      // Calculate average grade
      let totalScore = 0;
      let totalMaxScore = 0;
      gradesData?.forEach(grade => {
        totalScore += grade.score;
        totalMaxScore += grade.max_score;
      });

      const averageGrade = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

      // Get attendance data
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('class_id', classId);

      if (attendanceError) throw attendanceError;

      // Calculate attendance rate
      const totalAttendanceRecords = attendanceData?.length || 0;
      const presentRecords = attendanceData?.filter(a => a.status === 'present').length || 0;
      const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

      // Get top students (simplified implementation)
      const topStudents = studentsData?.slice(0, 5) || [];
      const topStudentsWithDetails = topStudents.map(student => ({
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        classId: classId,
        enrollmentDate: new Date(),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      return {
        classId: classData.id,
        className: classData.name,
        averageGrade,
        attendanceRate,
        studentCount: studentsData?.length || 0,
        topStudents: topStudentsWithDetails
      };
    } catch (error) {
      logger.error('Error fetching class performance:', error);
      throw new Error('Failed to fetch class performance');
    }
  }

  /**
   * Get student performance metrics
   */
  async getStudentPerformance(studentId: string): Promise<StudentPerformance> {
    try {
      // Get student info
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id, first_name, last_name')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;

      // Get recent grades
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (gradesError) throw gradesError;

      const recentGrades = gradesData?.map(grade => ({
        id: grade.id,
        studentId: grade.student_id,
        classId: grade.class_id,
        subject: grade.subject,
        score: grade.score,
        maxScore: grade.max_score,
        gradeType: grade.grade_type,
        description: grade.description,
        createdAt: new Date(grade.created_at),
        updatedAt: new Date(grade.updated_at)
      })) || [];

      // Calculate average grade
      let totalScore = 0;
      let totalMaxScore = 0;
      gradesData?.forEach(grade => {
        totalScore += grade.score;
        totalMaxScore += grade.max_score;
      });

      const averageGrade = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

      // Get recent attendance
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false })
        .limit(10);

      if (attendanceError) throw attendanceError;

      const recentAttendance = attendanceData?.map(attendance => ({
        id: attendance.id,
        studentId: attendance.student_id,
        classId: attendance.class_id,
        date: new Date(attendance.date),
        status: attendance.status,
        notes: attendance.notes,
        createdAt: new Date(attendance.created_at),
        updatedAt: new Date(attendance.updated_at)
      })) || [];

      // Calculate attendance rate
      const totalAttendanceRecords = attendanceData?.length || 0;
      const presentRecords = attendanceData?.filter(a => a.status === 'present').length || 0;
      const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

      return {
        studentId: studentData.id,
        firstName: studentData.first_name,
        lastName: studentData.last_name,
        averageGrade,
        attendanceRate,
        recentGrades,
        recentAttendance
      };
    } catch (error) {
      logger.error('Error fetching student performance:', error);
      throw new Error('Failed to fetch student performance');
    }
  }

  /**
   * Get all students for the school
   */
  async getStudents(): Promise<PedagogyStudent[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', this.schoolId)
        .order('last_name', { ascending: true });

      if (error) throw error;

      return data?.map(student => ({
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        classId: student.class_id,
        dateOfBirth: student.date_of_birth ? new Date(student.date_of_birth) : undefined,
        gender: student.gender,
        parentId: student.parent_id,
        enrollmentDate: new Date(student.enrollment_date),
        status: student.status,
        createdAt: new Date(student.created_at),
        updatedAt: new Date(student.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching students:', error);
      throw new Error('Failed to fetch students');
    }
  }

  /**
   * Get a specific student
   */
  async getStudent(studentId: string): Promise<PedagogyStudent> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        classId: data.class_id,
        dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
        gender: data.gender,
        parentId: data.parent_id,
        enrollmentDate: new Date(data.enrollment_date),
        status: data.status,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error fetching student:', error);
      throw new Error('Failed to fetch student');
    }
  }
}

export default PedagogyService;
