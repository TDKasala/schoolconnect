import React, { useEffect, useMemo, useState } from 'react';
import { useAuth, UserWithProfile } from '../../contexts/AuthContext';
import FinanceService from '../../services/financeService';
import { classesService, type SchoolClass } from '../../services/classesService';
import { studentsService, type Student } from '../../services/studentsService';
import { useToast } from '../../contexts/ToastContext';

interface FormState {
  student_id: string;
  amount: string;
  currency: 'CDF' | 'USD';
  payment_method: 'cash' | 'bank_transfer' | 'mobile_money' | 'card' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  due_date: string;
  payment_date: string;
  description: string;
}

const defaultForm: FormState = {
  student_id: '',
  amount: '',
  currency: 'CDF',
  payment_method: 'cash',
  status: 'completed',
  due_date: '',
  payment_date: '',
  description: '',
};

const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const schoolId = useMemo(() => typedUser?.profile?.school_id as string | undefined, [typedUser]);
  const userId = typedUser?.id as string | undefined;
  const toast = useToast();

  const [service, setService] = useState<FinanceService | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);

  // Init service
  useEffect(() => {
    if (userId && schoolId) setService(new FinanceService(userId, schoolId));
  }, [userId, schoolId]);

  // Load classes
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!schoolId) return;
      try {
        const { data } = await classesService.listClasses({ schoolId, limit: 200, offset: 0 });
        if (mounted) setClasses(data);
      } catch (e) {
        console.error('Failed to load classes', e);
      }
    })();
    return () => { mounted = false; };
  }, [schoolId]);

  // Load students for class
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!schoolId || !selectedClassId) { setStudents([]); return; }
      try {
        const list = await studentsService.listByClass({ schoolId, classId: selectedClassId });
        if (mounted) setStudents(list);
      } catch (e) {
        console.error('Failed to load students', e);
      }
    })();
    return () => { mounted = false; };
  }, [schoolId, selectedClassId]);

  const loadPayments = async () => {
    if (!service) return;
    setLoading(true);
    setError(null);
    try {
      const data = await service.getPayments(200);
      setPayments(data);
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du chargement des paiements');
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPayments(); /* eslint-disable-next-line */ }, [service]);

  const openCreate = () => {
    setForm(defaultForm);
    setShowCreate(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      student_id: p.studentId,
      amount: String(p.amount ?? ''),
      currency: (p.currency || 'CDF'),
      payment_method: p.paymentMethod || 'cash',
      status: p.status || 'completed',
      due_date: p.dueDate ? new Date(p.dueDate).toISOString().slice(0,10) : '',
      payment_date: p.paymentDate ? new Date(p.paymentDate).toISOString().slice(0,10) : '',
      description: p.description || '',
    });
    setShowEdit(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setLoading(true);
    setError(null);
    try {
      await service.createPayment({
        studentId: form.student_id,
        amount: Number(form.amount),
        currency: form.currency,
        paymentMethod: form.payment_method,
        status: form.status,
        dueDate: form.due_date ? new Date(form.due_date) : undefined,
        paymentDate: form.payment_date ? new Date(form.payment_date) : undefined,
        description: form.description,
        receiptUrl: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: '' as any,
      });
      setShowCreate(false);
      await loadPayments();
      toast.success('Paiement créé');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la création');
      toast.error('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !editing) return;
    setLoading(true);
    setError(null);
    try {
      await service.updatePayment(editing.id, {
        amount: Number(form.amount),
        paymentMethod: form.payment_method,
        status: form.status,
        dueDate: form.due_date ? new Date(form.due_date) : undefined,
        paymentDate: form.payment_date ? new Date(form.payment_date) : undefined,
        description: form.description,
      } as any);
      setShowEdit(false);
      setEditing(null);
      await loadPayments();
      toast.success('Paiement mis à jour');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la mise à jour');
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (p: any) => {
    if (!service) return;
    if (!confirm('Supprimer ce paiement ?')) return;
    setLoading(true);
    setError(null);
    try {
      await service.deletePayment(p.id);
      await loadPayments();
      toast.success('Paiement supprimé');
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la suppression');
      toast.error('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
          <div className="flex gap-3">
            <select
              className="border rounded-lg px-3 py-2"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Toutes les classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}{c.level ? ` - ${c.level}` : ''}</option>
              ))}
            </select>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700" onClick={openCreate}>
              Nouveau paiement
            </button>
          </div>
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Élève</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Échéance</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payé le</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td className="px-4 py-3" colSpan={7}>Chargement...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td className="px-4 py-3" colSpan={7}>Aucun paiement</td></tr>
              ) : (
                payments
                  .filter(p => !selectedClassId || students.some(s => s.id === p.studentId && s.class_id === selectedClassId))
                  .map(p => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {p.studentId}
                    </td>
                    <td className="px-4 py-3">{p.amount} {p.currency}</td>
                    <td className="px-4 py-3">{p.paymentMethod}</td>
                    <td className="px-4 py-3">{p.status}</td>
                    <td className="px-4 py-3">{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => openEdit(p)}>Modifier</button>
                      <button className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200" onClick={() => handleDelete(p)}>Supprimer</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
              <h2 className="text-lg font-semibold mb-4">Nouveau paiement</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Classe</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={selectedClassId} onChange={(e)=>setSelectedClassId(e.target.value)}>
                      <option value="">Sélectionner</option>
                      {classes.map(c => (<option key={c.id} value={c.id}>{c.name}{c.level ? ` - ${c.level}` : ''}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Élève</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.student_id} onChange={(e)=>setForm({...form, student_id: e.target.value})}>
                      <option value="">Sélectionner</option>
                      {students.map(s => (<option key={s.id} value={s.id}>{s.last_name} {s.first_name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Montant</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.amount} onChange={(e)=>setForm({...form, amount: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Devise</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.currency} onChange={(e)=>setForm({...form, currency: e.target.value as any})}>
                      <option value="CDF">CDF</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Méthode</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.payment_method} onChange={(e)=>setForm({...form, payment_method: e.target.value as any})}>
                      <option value="cash">cash</option>
                      <option value="bank_transfer">virement</option>
                      <option value="mobile_money">mobile money</option>
                      <option value="card">carte</option>
                      <option value="other">autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.status} onChange={(e)=>setForm({...form, status: e.target.value as any})}>
                      <option value="completed">complété</option>
                      <option value="pending">en attente</option>
                      <option value="failed">échoué</option>
                      <option value="refunded">remboursé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Échéance</label>
                    <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.due_date} onChange={(e)=>setForm({...form, due_date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Payé le</label>
                    <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.payment_date} onChange={(e)=>setForm({...form, payment_date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="w-full border rounded-lg px-3 py-2" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200" onClick={()=>setShowCreate(false)}>Annuler</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEdit && editing && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
              <h2 className="text-lg font-semibold mb-4">Modifier le paiement</h2>
              <form onSubmit={handleEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Montant</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.amount} onChange={(e)=>setForm({...form, amount: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Méthode</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.payment_method} onChange={(e)=>setForm({...form, payment_method: e.target.value as any})}>
                      <option value="cash">cash</option>
                      <option value="bank_transfer">virement</option>
                      <option value="mobile_money">mobile money</option>
                      <option value="card">carte</option>
                      <option value="other">autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={form.status} onChange={(e)=>setForm({...form, status: e.target.value as any})}>
                      <option value="completed">complété</option>
                      <option value="pending">en attente</option>
                      <option value="failed">échoué</option>
                      <option value="refunded">remboursé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Échéance</label>
                    <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.due_date} onChange={(e)=>setForm({...form, due_date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Payé le</label>
                    <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.payment_date} onChange={(e)=>setForm({...form, payment_date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="w-full border rounded-lg px-3 py-2" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200" onClick={()=>setShowEdit(false)}>Annuler</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">Mettre à jour</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
