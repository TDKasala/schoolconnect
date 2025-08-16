import { supabase } from '../lib/supabase';

export type SchoolClass = {
  id: string;
  school_id: string;
  name: string;
  level?: string | null; // e.g., 6ème, 5ème, etc.
  teacher_id?: string | null;
  created_at?: string;
};

export type CreateClassInput = {
  school_id: string;
  name: string;
  level?: string | null;
  teacher_id?: string | null;
};

export type Teacher = {
  id: string;
  full_name: string;
};

export const classesService = {
  async listClasses(params: { schoolId: string; search?: string; limit?: number; offset?: number }): Promise<{ data: SchoolClass[]; count: number }>
  {
    const { schoolId, search, limit = 20, offset = 0 } = params;

    let query = supabase
      .from('classes')
      .select('id, school_id, name, level, teacher_id, created_at', { count: 'exact' })
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      query = query.or(`name.ilike.${s},level.ilike.${s}`);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: (data as SchoolClass[]) || [], count: count || 0 };
  },

  async createClass(input: CreateClassInput): Promise<SchoolClass> {
    const { data, error } = await supabase
      .from('classes')
      .insert([input])
      .select('id, school_id, name, level, teacher_id, created_at')
      .single();

    if (error) throw error;
    return data as SchoolClass;
  },

  async listTeachers(schoolId: string): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('school_id', schoolId)
      .eq('role', 'teacher')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return (data as Teacher[]) || [];
  },

  async updateClass(id: string, patch: Partial<Omit<SchoolClass, 'id' | 'created_at' | 'school_id'>>): Promise<SchoolClass> {
    const { data, error } = await supabase
      .from('classes')
      .update(patch)
      .eq('id', id)
      .select('id, school_id, name, level, teacher_id, created_at')
      .single();
    if (error) throw error;
    return data as SchoolClass;
  },

  async deleteClass(id: string): Promise<void> {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
