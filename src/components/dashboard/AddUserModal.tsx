import React, { useState, useEffect } from 'react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: UserForm) => Promise<void>;
  loading: boolean;
  error: string;
  schools: Array<{ id: string; name: string }>;
}

export interface UserForm {
  email: string;
  full_name: string;
  password: string;
  role: 'platform_admin' | 'school_admin' | 'teacher' | 'parent';
  school_id?: string;
  phone?: string;
}

const initialForm: UserForm = {
  email: '',
  full_name: '',
  password: '',
  role: 'teacher',
  school_id: '',
  phone: '',
};

const AddUserModal: React.FC<AddUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading, 
  error, 
  schools 
}) => {
  const [form, setForm] = useState<UserForm>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    return (
      form.email.trim() &&
      form.full_name.trim() &&
      form.password.trim() &&
      form.role &&
      (form.role === 'platform_admin' || form.school_id) // Platform admin doesn't need school
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const roleOptions = [
    { value: 'teacher', label: 'Enseignant' },
    { value: 'school_admin', label: 'Administrateur École' },
    { value: 'parent', label: 'Parent' },
    { value: 'platform_admin', label: 'Administrateur Plateforme' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Ajouter un utilisateur</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input 
                name="full_name" 
                value={form.full_name} 
                onChange={handleChange} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                required 
                placeholder="Nom complet de l'utilisateur"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                required 
                placeholder="email@exemple.com"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input 
                name="password" 
                type="password"
                value={form.password} 
                onChange={handleChange} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                required 
                placeholder="Mot de passe temporaire"
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle</label>
              <select 
                name="role" 
                value={form.role} 
                onChange={handleChange} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {form.role !== 'platform_admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">École</label>
                <select 
                  name="school_id" 
                  value={form.school_id} 
                  onChange={handleChange} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required={form.role !== 'platform_admin'}
                >
                  <option value="">Sélectionner une école</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Téléphone (optionnel)</label>
              <input 
                name="phone" 
                type="tel"
                value={form.phone} 
                onChange={handleChange} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="+243 XXX XXX XXX"
              />
            </div>
          </div>
          
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !validate()}
            >
              {loading ? 'Création en cours...' : "Créer l'utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
