import React from 'react';
import { X, Building2, Users, GraduationCap, MapPin, Phone, Mail, Calendar } from 'lucide-react';

type School = {
  id: string;
  name: string;
  location?: string;
  city?: string;
  province?: string;
  phone?: string;
  email?: string;
  status: string;
  plan?: string;
  studentCount?: number;
  teacherCount?: number;
  created_at?: string;
  subscription_type?: string;
};

type SchoolDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  school: School | null;
};

const SchoolDetailsModal: React.FC<SchoolDetailsModalProps> = ({
  isOpen,
  onClose,
  school,
}) => {
  if (!isOpen || !school) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifié';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Building2 className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Détails de l'École
                  </h3>
                  <p className="text-sm text-gray-500">
                    Informations complètes de l'établissement
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900 border-b pb-2">
                  Informations Générales
                </h4>
                
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{school.name}</p>
                    <p className="text-xs text-gray-500">Nom de l'école</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {school.location || `${school.city || ''}, ${school.province || ''}`.trim().replace(/^,|,$/, '') || 'Non spécifié'}
                    </p>
                    <p className="text-xs text-gray-500">Localisation</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{school.phone || 'Non spécifié'}</p>
                    <p className="text-xs text-gray-500">Téléphone</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{school.email || 'Non spécifié'}</p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formatDate(school.created_at)}</p>
                    <p className="text-xs text-gray-500">Date de création</p>
                  </div>
                </div>
              </div>

              {/* Statistics & Status */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900 border-b pb-2">
                  Statistiques & Statut
                </h4>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{school.studentCount || 0}</p>
                    <p className="text-xs text-gray-500">Élèves</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{school.teacherCount || 0}</p>
                    <p className="text-xs text-gray-500">Enseignants</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${
                    school.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {school.status === 'active' ? 'Actif' : 'Inactif'}
                    </p>
                    <p className="text-xs text-gray-500">Statut</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 flex items-center justify-center">
                    <div className="h-3 w-3 bg-blue-400 rounded"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {school.plan || school.subscription_type || 'Non spécifié'}
                    </p>
                    <p className="text-xs text-gray-500">Plan d'abonnement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetailsModal;
