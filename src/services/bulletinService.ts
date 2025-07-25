import { supabase } from '../lib/supabase';

export interface GradeData {
  id: string;
  student_id: string;
  student_name: string;
  subject: string;
  grade: number;
  max_grade: number;
  coefficient: number;
  date: string;
  teacher_id: string;
  class_id: string;
}

export interface BulletinReport {
  student_id: string;
  student_name: string;
  class_name: string;
  semester: string;
  year: string;
  subjects: SubjectReport[];
  overall_average: number;
  rank: number;
  total_students: number;
  attendance_rate: number;
  conduct_grade: string;
  teacher_comments: string;
  generated_at: string;
}

export interface SubjectReport {
  subject: string;
  average: number;
  grades: GradeData[];
  coefficient: number;
  teacher: string;
  comments: string;
}

export class BulletinService {
  /**
   * Generate AI-powered bulletin report for a student
   */
  static async generateBulletin(studentId: string, semester: string, year: string): Promise<BulletinReport> {
    try {
      // Fetch student data
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*, classes(name)')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;

      // Fetch all grades for the student
      const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select(`
          *,
          classes(name),
          users!grades_teacher_id_fkey(full_name)
        `)
        .eq('student_id', studentId)
        .eq('semester', semester)
        .eq('year', year);

      if (gradesError) throw gradesError;

      // Fetch attendance data
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .eq('semester', semester)
        .eq('year', year);

      if (attendanceError) throw attendanceError;

      // Calculate statistics
      const bulletin = this.calculateBulletin(grades, attendance, student);
      
      // Add AI-generated comments
      bulletin.teacher_comments = this.generateAIComments(bulletin);
      bulletin.generated_at = new Date().toISOString();

      return bulletin;
    } catch (error) {
      console.error('Error generating bulletin:', error);
      throw error;
    }
  }

  /**
   * Calculate bulletin statistics
   */
  private static calculateBulletin(grades: any[], attendance: any[], student: any): BulletinReport {
    const subjects = this.groupGradesBySubject(grades);
    const overallAverage = this.calculateOverallAverage(subjects);
    const attendanceRate = this.calculateAttendanceRate(attendance);
    
    return {
      student_id: student.id,
      student_name: student.full_name,
      class_name: student.classes.name,
      semester: '', // Will be filled by caller
      year: '', // Will be filled by caller
      subjects,
      overall_average: overallAverage,
      rank: 0, // Will be calculated later
      total_students: 0, // Will be calculated later
      attendance_rate: attendanceRate,
      conduct_grade: this.determineConductGrade(overallAverage, attendanceRate),
      teacher_comments: '',
      generated_at: ''
    };
  }

  /**
   * Group grades by subject
   */
  private static groupGradesBySubject(grades: any[]): SubjectReport[] {
    const subjectMap = new Map<string, GradeData[]>();
    
    grades.forEach(grade => {
      const subject = grade.subject;
      if (!subjectMap.has(subject)) {
        subjectMap.set(subject, []);
      }
      subjectMap.get(subject)!.push({
        id: grade.id,
        student_id: grade.student_id,
        student_name: '', // Will be filled later
        subject: grade.subject,
        grade: grade.grade,
        max_grade: grade.max_grade,
        coefficient: grade.coefficient || 1,
        date: grade.date,
        teacher_id: grade.teacher_id,
        class_id: grade.class_id
      });
    });

    return Array.from(subjectMap.entries()).map(([subject, grades]) => ({
      subject,
      average: grades.reduce((sum, g) => sum + g.grade, 0) / grades.length,
      grades,
      coefficient: grades[0]?.coefficient || 1,
      teacher: '',
      comments: this.generateSubjectComments(grades)
    }));
  }

  /**
   * Calculate overall average
   */
  private static calculateOverallAverage(subjects: SubjectReport[]): number {
    let totalWeighted = 0;
    let totalCoefficients = 0;
    
    subjects.forEach(subject => {
      totalWeighted += subject.average * subject.coefficient;
      totalCoefficients += subject.coefficient;
    });
    
    return totalCoefficients > 0 ? totalWeighted / totalCoefficients : 0;
  }

  /**
   * Calculate attendance rate
   */
  private static calculateAttendanceRate(attendance: any[]): number {
    if (attendance.length === 0) return 100;
    
    const present = attendance.filter(a => a.status === 'present').length;
    return (present / attendance.length) * 100;
  }

  /**
   * Determine conduct grade
   */
  private static determineConductGrade(average: number, attendance: number): string {
    if (average >= 16 && attendance >= 95) return 'Excellent';
    if (average >= 14 && attendance >= 90) return 'Très Bien';
    if (average >= 12 && attendance >= 85) return 'Bien';
    if (average >= 10 && attendance >= 80) return 'Assez Bien';
    if (average >= 8 && attendance >= 75) return 'Passable';
    return 'Insuffisant';
  }

  /**
   * Generate AI-powered comments
   */
  private static generateAIComments(bulletin: BulletinReport): string {
    const { overall_average, attendance_rate, subjects } = bulletin;
    
    let comments = '';
    
    if (overall_average >= 16) {
      comments = 'Excellent travail! L\'élève fait preuve d\'un grand sérieux et d\'une excellente compréhension des matières.';
    } else if (overall_average >= 14) {
      comments = 'Très bon travail. L\'élève est appliqué et montre une bonne compréhension des concepts.';
    } else if (overall_average >= 12) {
      comments = 'Bon travail global. L\'élève fait des efforts satisfaisants dans la majorité des matières.';
    } else if (overall_average >= 10) {
      comments = 'Travail correct mais des efforts supplémentaires sont nécessaires dans certaines matières.';
    } else {
      comments = 'Des efforts importants sont nécessaires. L\'élève doit consacrer plus de temps à ses études.';
    }

    // Add attendance comment
    if (attendance_rate < 90) {
      comments += ` Attention à l'assiduité (${attendance_rate.toFixed(1)}%).`;
    }

    return comments;
  }

  /**
   * Generate subject-specific comments
   */
  private static generateSubjectComments(grades: GradeData[]): string {
    const average = grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
    
    if (average >= 16) return 'Excellent niveau';
    if (average >= 14) return 'Très bon niveau';
    if (average >= 12) return 'Bon niveau';
    if (average >= 10) return 'Niveau satisfaisant';
    return 'Niveau à améliorer';
  }

  /**
   * Generate bulletin for all students in a class
   */
  static async generateClassBulletins(classId: string, semester: string, year: string): Promise<BulletinReport[]> {
    try {
      // Fetch all students in the class
      const { data: students, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId);

      if (error) throw error;

      const bulletins: BulletinReport[] = [];
      
      if (students) {
        for (const student of students) {
          const bulletin = await this.generateBulletin(student.id, semester, year);
          bulletins.push(bulletin);
        }

        // Calculate ranks
        bulletins.sort((a, b) => b.overall_average - a.overall_average);
        bulletins.forEach((bulletin, index) => {
          bulletin.rank = index + 1;
          bulletin.total_students = bulletins.length;
        });
      }

      return bulletins;
    } catch (error) {
      console.error('Error generating class bulletins:', error);
      throw error;
    }
  }
}

export default BulletinService;
