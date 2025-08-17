import React, { useEffect, useMemo, useState } from 'react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { classesService } from '../../services/classesService';
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

  // Invite modal state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  // Assign modal state
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignTeacher, setAssignTeacher] = useState<Teacher | null>(null);
  const [classes, setClasses] = useState<{ id: string; name: string; level?: string | null }[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');

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
    fetchTeachers();
  }, [schoolId]);

  const openInvite = () => {
    setInviteEmail('');
    setInviteName('');
    setInviteOpen(true);
  };

  const submitInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    setInviteLoading(true);
    try {
      // 1) Send magic link sign-in to email (works with anon client)
      await supabase.auth.signInWithOtp({
        email: inviteEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      // 2) Upsert into users table to mark as teacher of this school
      const { error: upsertErr } = await supabase
        .from('users')
        .upsert(
          { email: inviteEmail, full_name: inviteName, role: 'teacher', school_id: schoolId },
          { onConflict: 'email' }
        );
      if (upsertErr) throw upsertErr;

      // 3) Refresh list
      await fetchTeachers();
      setInviteOpen(false);
    } catch (err: any) {
      alert(err?.message || 'Invitation échouée');
    } finally {
      setInviteLoading(false);
    }
  };

  const openAssign = async (teacher: Teacher) => {
    if (!schoolId) return;
    setAssignTeacher(teacher);
    setSelectedClassId('');
    setAssignOpen(true);
    setClassesLoading(true);
    try {
      const { data } = await classesService.listClasses({ schoolId, limit: 200, offset: 0 });
      setClasses(data);
    } catch (err: any) {
      alert(err?.message || 'Chargement des classes échoué');
    } finally {
      setClassesLoading(false);
    }
  };

  const submitAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTeacher || !selectedClassId) return;
    setAssignLoading(true);
    try {
      await classesService.updateClass(selectedClassId, { teacher_id: assignTeacher.id });
      setAssignOpen(false);
      // Optionally: feedback
      alert('Enseignant assigné à la classe');
    } catch (err: any) {
      alert(err?.message || "Échec de l'assignation");
    } finally {
      setAssignLoading(false);
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#212121' }}>Enseignants</h1>
          <p className="mt-1 text-sm" style={{ color: '#616161' }}>Gérez les enseignants de votre établissement</p>
        </div>
        <button
          onClick={openInvite}
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
                      <button onClick={() => openAssign(t)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm text-gray-700 hover:bg-gray-50">
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
    {/* Invite Modal */}
    {inviteOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 className="text-lg font-semibold mb-1">Inviter un enseignant</h2>
          <p className="text-sm text-gray-600 mb-4">Un lien magique sera envoyé par email.</p>
          <form onSubmit={submitInvite} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nom complet</label>
              <input value={inviteName} onChange={e => setInviteName(e.target.value)} required className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setInviteOpen(false)} className="px-3 py-2 text-sm rounded-md border">Annuler</button>
              <button type="submit" disabled={inviteLoading} className="px-3 py-2 text-sm rounded-md text-white" style={{ backgroundColor: '#1E88E5', opacity: inviteLoading ? 0.7 : 1 }}>
                {inviteLoading ? 'Envoi…' : 'Envoyer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Assign Modal */}
    {assignOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 className="text-lg font-semibold mb-1">Assigner à une classe</h2>
          <p className="text-sm text-gray-600 mb-4">Sélectionnez la classe pour {assignTeacher?.full_name || assignTeacher?.email}</p>
          <form onSubmit={submitAssign} className="space-y-3">
            <div>
              {classesLoading ? (
                <div className="text-sm text-gray-500 flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Chargement des classes…</div>
              ) : (
                <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} required className="w-full border rounded-md px-3 py-2 text-sm">
                  <option value="" disabled>Sélectionner une classe</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}{c.level ? ` — ${c.level}` : ''}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setAssignOpen(false)} className="px-3 py-2 text-sm rounded-md border">Annuler</button>
              <button type="submit" disabled={assignLoading || classesLoading || !selectedClassId} className="px-3 py-2 text-sm rounded-md text-white" style={{ backgroundColor: '#1E88E5', opacity: assignLoading ? 0.7 : 1 }}>
                {assignLoading ? 'Assignation…' : 'Assigner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
};

export default TeachersPage;
