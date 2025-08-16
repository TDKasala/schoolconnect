import { supabase } from '../lib/supabase';

export type EvaluationType = 'devoir' | 'interrogation' | 'composition' | 'examen';

export type GradeRow = {
  id: string;
  student_id: string;
  class_id: string;
  subject: string;
  grade: number | null;
  evaluation_type: EvaluationType | null;
  teacher_id: string;
  date: string; // YYYY-MM-DD
  comment?: string | null;
  created_at?: string;
  updated_at?: string;
};

export const gradesService = {
  async listByClass(params: { classId: string; subject?: string; fromDate?: string; toDate?: string }): Promise<GradeRow[]> {
    const { classId, subject, fromDate, toDate } = params;
    let query = supabase
      .from('grades')
      .select('id, student_id, class_id, subject, grade, evaluation_type, teacher_id, date, comment, created_at, updated_at')
      .eq('class_id', classId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (subject && subject.trim()) query = query.eq('subject', subject.trim());
    if (fromDate) query = query.gte('date', fromDate);
    if (toDate) query = query.lte('date', toDate);

    const { data, error } = await query;
    if (error) throw error;
    return (data as GradeRow[]) || [];
  },

  async replaceForClassSubjectDate(params: { classId: string; subject: string; date: string; entries: Array<Omit<GradeRow, 'id' | 'created_at' | 'updated_at'>> }): Promise<GradeRow[]> {
    const { classId, subject, date, entries } = params;
    // Delete previous items for same class/subject/date, then insert the set
    const { error: delErr } = await supabase
      .from('grades')
      .delete()
      .eq('class_id', classId)
      .eq('subject', subject)
      .eq('date', date);
    if (delErr) throw delErr;

    if (!entries.length) return [];
    const { data, error } = await supabase
      .from('grades')
      .insert(entries as any)
      .select('id, student_id, class_id, subject, grade, evaluation_type, teacher_id, date, comment, created_at, updated_at');
    if (error) throw error;
    return (data as GradeRow[]) || [];
  },

  async update(id: string, patch: Partial<Omit<GradeRow, 'id' | 'created_at' | 'updated_at'>>): Promise<GradeRow> {
    const { data, error } = await supabase
      .from('grades')
      .update(patch)
      .eq('id', id)
      .select('id, student_id, class_id, subject, grade, evaluation_type, teacher_id, date, comment, created_at, updated_at')
      .single();
    if (error) throw error;
    return data as GradeRow;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('grades')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
