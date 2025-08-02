import React, { useState } from 'react';

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: SchoolForm) => Promise<void>;
  loading: boolean;
  error: string;
}

export interface SchoolForm {
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  subscription_type: 'flex' | 'forfait';
  max_students: number;
}

const initialForm: SchoolForm = {
  name: '',
  address: '',
  city: '',
  province: '',
  phone: '',
  email: '',
  subscription_type: 'flex',
  max_students: 100,
};

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({ isOpen, onClose, onSubmit, loading, error }) => {
  const [form, setForm] = useState<SchoolForm>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'max_students' ? Number(value) : value }));
  };



  const validate = () => {
    return (
      form.name.trim() &&
      form.address.trim() &&
      form.city.trim() &&
      form.province.trim() &&
      form.phone.trim() &&
      form.email.trim() &&
      (form.subscription_type === 'flex' || form.subscription_type === 'forfait') &&
      form.max_students > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Ajouter une école</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nom de l'école</label>
              <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Adresse</label>
              <input name="address" value={form.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Ville</label>
              <input name="city" value={form.city} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Province</label>
              <input name="province" value={form.province} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Téléphone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Type d'abonnement</label>
              <select name="subscription_type" value={form.subscription_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="flex">Flex</option>
                <option value="forfait">Forfait</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Nombre maximum d'élèves</label>
              <input name="max_students" type="number" min="1" value={form.max_students} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !validate()}
            >
              {loading ? 'Ajout en cours...' : "Ajouter l'école"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchoolModal;
