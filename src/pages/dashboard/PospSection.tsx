import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PospSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Module Pédagogie</h1>
        <p className="mt-2 text-gray-600">
          Gestion des classes, notes et évaluations
        </p>
      </div>

      {user?.role === 'school_admin' ? (
        <AdminPospView />
      ) : user?.role === 'teacher' ? (
        <TeacherPospView />
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">
            Accès non autorisé à ce module pour votre rôle.
          </p>
        </div>
      )}
    </div>
  );
};

const AdminPospView: React.FC = () => {
  const tabs = ['Classes', 'Matières', 'Élèves'];
  const [activeTab, setActiveTab] = React.useState('Classes');

  const classes = [
    { id: '1', name: '6ème A', students: 28, teachers: 3 },
    { id: '2', name: '5ème B', students: 31, teachers: 4 },
    { id: '3', name: '4ème C', students: 26, teachers: 3 }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'Classes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Liste des classes</h3>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                Ajouter une classe
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>{cls.students} élèves</p>
                    <p>{cls.teachers} enseignants</p>
                  </div>
                  <button className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Gérer →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Matières' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Gestion des matières - En développement</p>
          </div>
        )}

        {activeTab === 'Élèves' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Gestion des élèves - En développement</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TeacherPospView: React.FC = () => {
  const classes = [
    { id: '1', name: '6ème A', subject: 'Mathématiques', students: 28 },
    { id: '2', name: '5ème B', subject: 'Mathématiques', students: 31 },
    { id: '3', name: '4ème C', subject: 'Sciences', students: 26 }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Mes Classes</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900">{cls.name}</h3>
              <p className="text-sm text-gray-600">{cls.subject}</p>
              <p className="text-sm text-gray-500 mt-1">{cls.students} élèves</p>
              <div className="mt-4 space-y-2">
                <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-sm">
                  Carnet de notes
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm">
                  Présences
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PospSection;
