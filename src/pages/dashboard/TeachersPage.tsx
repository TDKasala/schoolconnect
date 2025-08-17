import React, { useEffect, useMemo, useState } from 'react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Search, UserPlus, Mail, UserCheck, Loader2 } from 'lucide-react';

interface Teacher {
  id: string;
  full_name: string | null;
  email: string;
  phone?: string | null;
  created_at?: string;
}

const TeachersPage: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const schoolId = typedUser?.profile?.school_id as string | undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter(t =>
      (t.full_name || '').toLowerCase().includes(q) ||
      (t.email || '').toLowerCase().includes(q) ||
      (t.phone || '').toLowerCase().includes(q)
    );
  }, [teachers, query]);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!schoolId) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from('users')
          .select('id, email, full_name, phone, created_at')
          .eq('role', 'teacher')
          .eq('school_id', schoolId)
          .order('created_at', { ascending: false });
        if (err) throw err;
        setTeachers((data as any[]) as Teacher[]);
      } catch (e: any) {
        setError(e.message || 'Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [schoolId]);

  const handleInvite = async () => {
    // Placeholder: in a real flow, we'd open a modal to collect email and send an invite
    alert("Invitation flow coming soon. Use Supabase auth to invite teachers by email.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#212121' }}>Enseignants</h1>
          <p className="mt-1 text-sm" style={{ color: '#616161' }}>Gérez les enseignants de votre établissement</p>
        </div>
        <button
          onClick={handleInvite}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: '#1E88E5' }}
        >
          <UserPlus className="h-4 w-4" />
          Inviter un enseignant
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom, email, téléphone"
              className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="p-8 flex items-center justify-center text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{t.full_name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" /> {t.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{t.phone || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm text-gray-700 hover:bg-gray-50">
                        <UserCheck className="h-4 w-4" /> Assigner
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">Aucun enseignant trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersPage;
