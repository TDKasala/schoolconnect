import { supabase } from '../lib/supabase';

export type AppUser = {
  id: string;
  email: string;
  full_name: string;
  role: 'platform_admin' | 'school_admin' | 'teacher' | 'parent';
  school_id: string | null;
};

export const usersService = {
  async listPeers(params: {
    schoolId?: string | null;
    excludeUserId?: string;
    search?: string;
    limit?: number;
  } = {}): Promise<AppUser[]> {
    const { schoolId, excludeUserId, search, limit = 50 } = params;

    let query = supabase
      .from('users')
      .select('id, email, full_name, role, school_id')
      .order('full_name', { ascending: true })
      .limit(limit);

    if (schoolId) query = query.eq('school_id', schoolId);
    if (search && search.trim()) {
      // Basic ilike on name or email
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    let out = (data as AppUser[]) || [];
    if (excludeUserId) out = out.filter((u) => u.id !== excludeUserId);
    return out;
  },
};
