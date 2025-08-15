import { supabase } from '../lib/supabase';

export type Student = {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  student_id: string;
  gender?: 'M' | 'F' | null;
  date_of_birth?: string | null; // ISO date string
  class_id?: string | null;
  created_at?: string;
};

export type CreateStudentInput = {
  school_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  student_id: string; // required by schema
  gender?: 'M' | 'F' | null;
  date_of_birth?: string | null; // ISO date string
  class_id: string; // required by UI/DB
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
      query = query.or(`first_name.ilike.${s},last_name.ilike.${s},student_id.ilike.${s}`);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: (data as Student[]) || [], count: count || 0 };
  },

  async listByClass(params: { schoolId: string; classId: string }): Promise<Student[]> {
    const { schoolId, classId } = params;
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', schoolId)
      .eq('class_id', classId)
      .order('last_name', { ascending: true })
      .order('first_name', { ascending: true });
    if (error) throw error;
    return (data as Student[]) || [];
  },

  async createStudent(input: CreateStudentInput): Promise<Student> {
    const payload = { ...input } as any;
    const { data, error } = await supabase
      .from('students')
      .insert([payload])
      .select('*')
      .single();

    if (error) throw error;
    return data as Student;
  },

  async updateStudent(id: string, patch: Partial<Omit<Student, 'id' | 'created_at'>>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data as Student;
  },

  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
