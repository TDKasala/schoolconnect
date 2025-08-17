import React, { useEffect, useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { useParent } from '../../hooks/useParent';

const ParentAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const parentId = typedUser?.id ?? '';
  const { children, getChildAttendance, loading, error } = useParent(parentId);

  const [childId, setChildId] = useState('');
  const [records, setRecords] = useState<{ date: string; status: string }[]>([]);

  useEffect(() => {
    if (!childId && children.length > 0) setChildId(children[0].id);
  }, [children, childId]);

  useEffect(() => {
    const run = async () => {
      if (!childId) return;
      try {
        const res = await getChildAttendance(childId);
        setRecords(res.map(r => ({ date: r.date, status: r.status })));
      } catch {
        setRecords([]);
      }
    };
    run();
  }, [childId, getChildAttendance]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Présence</h1>
          <p className="text-gray-600">Historique de présence par enfant</p>
        </div>
        <CheckSquare className="h-6 w-6 text-primary-600" />
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
        {!loading && records.length === 0 && (
          <p className="text-sm text-gray-600">Aucun enregistrement</p>
        )}

        <div className="divide-y divide-gray-200">
          {records.map((r, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="text-sm text-gray-800">{new Date(r.date).toLocaleDateString('fr-FR')}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'present' ? 'bg-green-100 text-green-800' : r.status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentAttendancePage;
