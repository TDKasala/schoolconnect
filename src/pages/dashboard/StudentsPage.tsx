import React, { useEffect, useMemo, useState } from 'react';
import { useAuth, UserWithProfile } from '../../contexts/AuthContext';
import { studentsService, type Student } from '../../services/studentsService';
import { classesService, type SchoolClass } from '../../services/classesService';

const StudentsPage: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const schoolId = useMemo(() => typedUser?.profile?.school_id as string | undefined, [typedUser]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);
  const [classMap, setClassMap] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    matricule: '',
    gender: '' as '' | 'M' | 'F',
    birth_date: ''
  });

  const fetchStudents = async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, count } = await studentsService.listStudents({
        schoolId,
        search,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      setStudents(data);
      setCount(count);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du chargement des élèves');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (s: Student) => {
    setSelected(s);
    setForm({
      first_name: s.first_name || '',
      last_name: s.last_name || '',
      matricule: s.matricule || '',
      gender: (s.gender as 'M' | 'F' | '') || '',
      birth_date: s.birth_date ? s.birth_date.substring(0,10) : ''
    });
    setShowEdit(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      await studentsService.updateStudent(selected.id, {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        matricule: form.matricule?.trim() || null,
        gender: form.gender || null,
        birth_date: form.birth_date || null,
      });
      setShowEdit(false);
      setSelected(null);
      await fetchStudents();
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (s: Student) => {
    if (!confirm('Supprimer cet élève ?')) return;
    setLoading(true);
    setError(null);
    try {
      await studentsService.deleteStudent(s.id);
      await fetchStudents();
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId, search, page]);

  // Fetch classes list once for mapping class_id -> name
  useEffect(() => {
    const run = async () => {
      if (!schoolId) return;
      try {
        const { data } = await classesService.listClasses({ schoolId, limit: 1000, offset: 0 });
        const map: Record<string, string> = {};
        (data as SchoolClass[]).forEach((c) => { if (c.id) map[c.id] = c.name; });
        setClassMap(map);
      } catch {}
    };
    run();
  }, [schoolId]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      await studentsService.createStudent({
        school_id: schoolId,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        matricule: form.matricule?.trim() || null,
        gender: form.gender || null,
        birth_date: form.birth_date || null,
      });
      setShowCreate(false);
      setForm({ first_name: '', last_name: '', matricule: '', gender: '', birth_date: '' });
      setPage(1);
      await fetchStudents();
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Élèves</h1>
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="Rechercher par nom ou matricule..."
              className="w-full sm:w-80 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={() => setShowCreate(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Nouvel élève
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de naissance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">Chargement...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">Aucun élève trouvé</td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{s.matricule || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{s.class_id ? (classMap[s.class_id] || '-') : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{s.last_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{s.first_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{s.gender || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{s.birth_date ? new Date(s.birth_date).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      <div className="inline-flex gap-2">
                        <button onClick={() => openEdit(s)} className="px-2 py-1 text-blue-600 hover:text-blue-800">Modifier</button>
                        <button onClick={() => handleDelete(s)} className="px-2 py-1 text-red-600 hover:text-red-800">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">{count} élèves</p>
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
                <h2 className="text-lg font-semibold">Ajouter un élève</h2>
                <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Nom</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Prénom</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Matricule</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={form.matricule}
                      onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Sexe</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value as 'M' | 'F' | '' })}
                    >
                      <option value="">Non spécifié</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={form.birth_date}
                    onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                  />
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

        {/* Edit Modal */}
        {showEdit && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Modifier l'élève</h2>
                <button onClick={() => { setShowEdit(false); setSelected(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <form onSubmit={handleEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Nom</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Prénom</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Matricule</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={form.matricule}
                      onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Sexe</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value as 'M' | 'F' | '' })}
                    >
                      <option value="">Non spécifié</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={form.birth_date}
                    onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => { setShowEdit(false); setSelected(null); }} className="px-4 py-2 border rounded-md">Annuler</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md disabled:opacity-50" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Sauvegarder'}
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

export default StudentsPage;
