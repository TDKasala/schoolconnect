import { supabase } from '../lib/supabase';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type Attendance = {
  id: string;
  student_id: string;
  class_id: string;
  date: string; // ISO date (YYYY-MM-DD)
  status: AttendanceStatus;
  teacher_id?: string | null;
  notes?: string | null;
  created_at?: string;
};

export const attendanceService = {
  async listByClassAndDate(params: { classId: string; date: string }): Promise<Attendance[]> {
    const { classId, date } = params;
    const { data, error } = await supabase
      .from('attendance')
      .select('id, student_id, class_id, date, status, teacher_id, notes, created_at')
      .eq('class_id', classId)
      .eq('date', date)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data as Attendance[]) || [];
  },

  async replaceForClassAndDate(params: { classId: string; date: string; entries: Array<Omit<Attendance, 'id' | 'created_at'>> }): Promise<Attendance[]> {
    const { classId, date, entries } = params;
    // Remove existing rows for the class/date, then insert the provided set
    const { error: delErr } = await supabase
      .from('attendance')
      .delete()
      .eq('class_id', classId)
      .eq('date', date);
    if (delErr) throw delErr;

    if (!entries.length) return [];
    const { data, error } = await supabase
      .from('attendance')
      .insert(entries as any)
      .select('id, student_id, class_id, date, status, teacher_id, notes, created_at');
    if (error) throw error;
    return (data as Attendance[]) || [];
  },
};
