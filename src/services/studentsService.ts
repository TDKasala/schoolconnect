import { supabase } from '../lib/supabase';

export type Student = {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  matricule?: string | null;
  gender?: 'M' | 'F' | null;
  birth_date?: string | null; // ISO date string
  class_id?: string | null;
  created_at?: string;
};

export type CreateStudentInput = {
  school_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  matricule?: string | null;
  gender?: 'M' | 'F' | null;
  birth_date?: string | null; // ISO date string
  class_id?: string | null;
};

export const studentsService = {
  async listStudents(params: { schoolId: string; search?: string; limit?: number; offset?: number }): Promise<{ data: Student[]; count: number }>
  {
    const { schoolId, search, limit = 20, offset = 0 } = params;

    let query = supabase
      .from('students')
      .select('*', { count: 'exact' })
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search && search.trim()) {
      // Simple ilike filter on name fields and matricule
      const s = `%${search.trim()}%`;
      query = query.or(`first_name.ilike.${s},last_name.ilike.${s},matricule.ilike.${s}`);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: (data as Student[]) || [], count: count || 0 };
  },

  async createStudent(input: CreateStudentInput): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert([input])
      .select('*')
      .single();

    if (error) throw error;
    return data as Student;
  }
};
