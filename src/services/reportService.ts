import { supabase } from '../lib/supabase';
import type { UserWithProfile } from '../contexts/AuthContext';

export interface StudentReportData {
  student: {
    id: string;
    first_name: string;
    last_name: string;
    class_id: string | null;
    school_id: string | null;
    created_at: string;
    updated_at: string;
    class?: { id: string; name: string; level?: string | null; teacher_id?: string | null } | null;
  } | null;
  grades: Array<{ id: string; subject: string | null; grade: number | null; max_grade: number | null; created_at: string }>;
  attendance: Array<{ id: string; status: string; created_at: string }>;
  homework: Array<{ id: string; title: string; due_date: string; subject?: string | null }>; // upcoming for class
}

export type Role = 'platform_admin' | 'school_admin' | 'teacher' | 'parent' | 'student';

export class ReportService {
  private requester: UserWithProfile;

  constructor(requester: UserWithProfile) {
    this.requester = requester;
  }

  private get role(): Role {
    return (this.requester.profile?.role as Role) || 'teacher';
  }

  private async assertAccessToStudent(studentId: string): Promise<void> {
    // Platform and school admins: allowed; teachers: must teach the student's class; parents: must be parent of the student
    const role = this.role;

    if (role === 'platform_admin') return;

    const { data: student, error } = await supabase
      .from('students')
      .select('id, class_id, school_id, parent_id, classes(id, teacher_id, school_id)')
      .eq('id', studentId)
      .single();

    if (error) throw error;
    if (!student) throw new Error('Élève introuvable');

    if (role === 'school_admin') {
      if (student.school_id !== this.requester.profile?.school_id) {
        throw new Error("Accès refusé: l'élève n'appartient pas à votre école");
      }
      return;
    }

    if (role === 'teacher') {
      const teaches = student.classes?.teacher_id === this.requester.id;
      if (!teaches) throw new Error("Accès refusé: élève hors de vos classes");
      return;
    }

    if (role === 'parent') {
      if (student.parent_id !== this.requester.id) {
        throw new Error("Accès refusé: élève non associé à votre compte parent");
      }
      return;
    }

    // Default: deny
    throw new Error('Accès refusé');
  }

  async getStudentReportData(studentId: string): Promise<StudentReportData> {
    await this.assertAccessToStudent(studentId);

    // Fetch student + class
    const { data: student, error: studentErr } = await supabase
      .from('students')
      .select('id, first_name, last_name, class_id, school_id, created_at, updated_at, classes(id, name, level, teacher_id)')
      .eq('id', studentId)
      .single();
    if (studentErr) throw studentErr;

    // Parallel fetch grades, attendance, and upcoming homework for class
    const [gradesRes, attendanceRes, homeworkRes] = await Promise.all([
      supabase
        .from('grades')
        .select('id, student_id, subject, grade, max_grade, score, max_score, created_at, date')
        .eq('student_id', studentId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false }),
      supabase
        .from('attendance')
        .select('id, student_id, status, created_at, date')
        .eq('student_id', studentId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false }),
      student?.class_id
        ? supabase
            .from('homework')
            .select('id, class_id, title, due_date, subject')
            .eq('class_id', student.class_id)
            .gte('due_date', new Date().toISOString())
            .order('due_date', { ascending: true })
            .limit(10)
        : Promise.resolve({ data: [], error: null } as any),
    ]);

    if (gradesRes.error) throw gradesRes.error;
    if (attendanceRes.error) throw attendanceRes.error;
    if (homeworkRes && (homeworkRes as any).error) throw (homeworkRes as any).error;

    return {
      student: student
        ? {
            id: student.id,
            first_name: student.first_name,
            last_name: student.last_name,
            class_id: student.class_id,
            school_id: student.school_id,
            created_at: student.created_at,
            updated_at: student.updated_at,
            class: student.classes
              ? {
                  id: student.classes.id,
                  name: student.classes.name,
                  level: student.classes.level,
                  teacher_id: student.classes.teacher_id,
                }
              : null,
          }
        : null,
      grades: (gradesRes.data || []).map((g: any) => ({
        id: g.id,
        subject: g.subject,
        grade: (g.grade ?? g.score ?? null),
        max_grade: (g.max_grade ?? g.max_score ?? null),
        created_at: (g.created_at ?? g.date ?? new Date().toISOString()),
      })),
      attendance: (attendanceRes.data || []).map((a: any) => ({
        id: a.id,
        status: a.status,
        created_at: (a.created_at ?? a.date ?? new Date().toISOString()),
      })),
      homework: (homeworkRes?.data || []).map((h: any) => ({
        id: h.id,
        title: h.title,
        due_date: h.due_date,
        subject: h.subject,
      })),
    };
  }
}

export default ReportService;
