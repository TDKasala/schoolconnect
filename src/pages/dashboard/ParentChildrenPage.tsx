import React from 'react';
import { Users } from 'lucide-react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { useParent } from '../../hooks/useParent';

const ParentChildrenPage: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const parentId = typedUser?.id ?? '';
  const { children, loading, error } = useParent(parentId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Enfants</h1>
          <p className="text-gray-600">Aperçu des informations de vos enfants</p>
        </div>
        <Users className="h-6 w-6 text-primary-600" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="text-sm text-gray-600">Chargement…</p>}
        {!loading && children.length === 0 && (
          <p className="text-sm text-gray-600">Aucun enfant enregistré.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((c) => (
            <div key={c.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">{c.firstName} {c.lastName}</h3>
              <p className="text-sm text-gray-600">{c.className}</p>
              <div className="mt-3 text-sm text-gray-700">
                <div>
                  <span className="text-gray-500">Moyenne:</span> <span className="font-medium">{c.average}/20</span>
                </div>
                <div>
                  <span className="text-gray-500">Présence:</span> <span className="font-medium">{c.attendance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentChildrenPage;
