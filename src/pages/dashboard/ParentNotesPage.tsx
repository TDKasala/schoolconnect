import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { useParent } from '../../hooks/useParent';

const ParentNotesPage: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const parentId = typedUser?.id ?? '';
  const { children, getChildGrades, loading, error } = useParent(parentId);

  const [childId, setChildId] = useState('');
  const [grades, setGrades] = useState<Array<{ subjectId: string; score: number; date: Date }>>([]);

  useEffect(() => {
    if (!childId && children.length > 0) setChildId(children[0].id);
  }, [children, childId]);

  useEffect(() => {
    const run = async () => {
      if (!childId) return;
      try {
        const res = await getChildGrades(childId);
        setGrades(res.map((g: any) => ({ subjectId: g.subjectId, score: g.score, date: new Date(g.date) })));
      } catch {
        setGrades([]);
      }
    };
    run();
  }, [childId, getChildGrades]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-600">Consultez les notes de votre enfant</p>
        </div>
        <BookOpen className="h-6 w-6 text-primary-600" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Enfant</label>
          <select value={childId} onChange={(e) => setChildId(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md">
            {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="text-sm text-gray-600">Chargement…</p>}
        {!loading && grades.length === 0 && (
          <p className="text-sm text-gray-600">Aucune note</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {grades.map((g, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900">{g.subjectId}</p>
              <p className="mt-1 text-xl font-semibold text-primary-600">{g.score}/20</p>
              <p className="text-xs mt-1 text-gray-600">{g.date instanceof Date ? g.date.toLocaleDateString('fr-FR') : new Date(g.date).toLocaleDateString('fr-FR')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentNotesPage;
