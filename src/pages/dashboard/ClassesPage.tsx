import React, { useEffect, useMemo, useState } from 'react';
import { useAuth, UserWithProfile } from '../../contexts/AuthContext';
import { classesService, type SchoolClass, type Teacher } from '../../services/classesService';

const ClassesPage: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const schoolId = useMemo(() => typedUser?.profile?.school_id as string | undefined, [typedUser]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '',
    level: '',
    teacher_id: ''
  });

  const fetchClasses = async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, count } = await classesService.listClasses({
        schoolId,
        search,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      setClasses(data);
      setCount(count);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du chargement des classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    if (!schoolId) return;
    try {
      const data = await classesService.listTeachers(schoolId);
      setTeachers(data);
    } catch (e) {
      // non-blocking
    }
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId, search, page]);

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      await classesService.createClass({
        school_id: schoolId,
        name: form.name.trim(),
        level: form.level?.trim() || null,
        teacher_id: form.teacher_id || null,
      });
      setShowCreate(false);
      setForm({ name: '', level: '', teacher_id: '' });
      setPage(1);
      await fetchClasses();
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la création de la classe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Rechercher une classe..."
              className="w-full sm:w-80 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={() => setShowCreate(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Nouvelle classe
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titulaire</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">Chargement...</td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">Aucune classe trouvée</td>
                </tr>
              ) : (
                classes.map((c) => {
                  const teacher = teachers.find(t => t.id === c.teacher_id);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{c.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{c.level || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{teacher?.full_name || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">{count} classes</p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Précédent
            </button>
            <span className="text-sm text-gray-700">{page} / {totalPages}</span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Suivant
            </button>
          </div>
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Créer une classe</h2>
                <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nom de la classe</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Niveau</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Titulaire (enseignant)</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={form.teacher_id}
                    onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
                  >
                    <option value="">Non assigné</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded-md">Annuler</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md disabled:opacity-50" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
