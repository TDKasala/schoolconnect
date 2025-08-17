import React, { useMemo } from 'react';
import { DollarSign } from 'lucide-react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { useParent } from '../../hooks/useParent';

const ParentPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const parentId = typedUser?.id ?? '';
  const { payments, loading, error } = useParent(parentId);

  const totals = useMemo(() => {
    const due = payments.filter(p => p.status !== 'payé').reduce((s, p) => s + (p.amount || 0), 0);
    const paid = payments.filter(p => p.status === 'payé').reduce((s, p) => s + (p.amount || 0), 0);
    const statusGlobal = payments.some(p => p.status === 'en retard')
      ? 'En retard'
      : payments.some(p => p.status === 'à payer')
        ? 'En souffrance'
        : 'À jour';
    return { due, paid, statusGlobal };
  }, [payments]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Frais & Paiements</h1>
          <p className="text-gray-600">Suivez l'état des frais scolaires</p>
        </div>
        <DollarSign className="h-6 w-6 text-primary-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Statut global</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{totals.statusGlobal}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Montant dû</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{totals.due} CDF</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Montant payé</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{totals.paid} CDF</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historique des paiements et frais</h2>
        </div>
        <div className="p-6">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading && <p className="text-sm text-gray-600">Chargement…</p>}
          {!loading && payments.length === 0 && (
            <p className="text-sm text-gray-600">Aucun élément</p>
          )}
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-600">{p.dueDate ? new Date(p.dueDate).toLocaleDateString('fr-FR') : '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{p.amount ?? 0} CDF</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'payé' ? 'bg-green-100 text-green-800' : p.status === 'en retard' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPaymentsPage;
