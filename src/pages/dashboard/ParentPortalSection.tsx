import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Mail,
  Phone,
  Eye,
  Clock,
  Bell
} from 'lucide-react';

const ParentPortalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const parents = [
    {
      id: 1,
      name: 'Marie Tshala',
      email: 'marie.tshala@email.com',
      phone: '+243 81 234 5678',
      children: ['Jean Tshala - 6ème A', 'Sarah Tshala - 4ème B'],
      lastContact: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jean Kabila',
      email: 'jean.kabila@email.com',
      phone: '+243 82 345 6789',
      children: ['Paul Kabila - 5ème C'],
      lastContact: '2024-01-14',
      status: 'active'
    },
    {
      id: 3,
      name: 'Sarah Mukendi',
      email: 'sarah.mukendi@email.com',
      phone: '+243 83 456 7890',
      children: ['Claire Mukendi - 3ème A'],
      lastContact: '2024-01-13',
      status: 'pending'
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Réunion Parents-Professeurs',
      message: 'Réunion prévue le 20 janvier à 14h00',
      date: '2024-01-15',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Bulletins disponibles',
      message: 'Les bulletins du premier trimestre sont disponibles',
      date: '2024-01-14',
      type: 'grades'
    },
    {
      id: 3,
      title: 'Absence signalée',
      message: 'Jean Tshala était absent le 13 janvier',
      date: '2024-01-13',
      type: 'absence'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portail Parents</h1>
        <p className="mt-2 text-gray-600">Communication et suivi avec les parents d'élèves</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Parents Actifs</p>
              <p className="text-2xl font-semibold text-gray-900">156</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-green-500 rounded-lg p-3">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Messages Envoyés</p>
            <p className="text-2xl font-semibold text-gray-900">89</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-yellow-500 rounded-lg p-3">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Réunions Planifiées</p>
            <p className="text-2xl font-semibold text-gray-900">12</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {['overview', 'parents', 'communications', 'notifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' ? 'Aperçu' : tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Derniers Messages</h3>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{notification.date}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Parents Récemment Actifs</h3>
                <div className="space-y-3">
                  {parents.slice(0, 3).map((parent) => (
                    <div key={parent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{parent.name}</p>
                        <p className="text-sm text-gray-600">{parent.children.join(', ')}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(parent.status)}`}>
                        {parent.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'parents' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Liste des Parents</h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Parent
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enfants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parents.map((parent) => (
                      <tr key={parent.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{parent.name}</div>
                          <div className="text-sm text-gray-500">{parent.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {parent.children.join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{parent.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(parent.status)}`}>
                            {parent.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Mail className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Phone className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'communications' && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Communications</h3>
              <p className="text-gray-500">Envoyez des messages aux parents</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Message
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications</h3>
              <p className="text-gray-500">Gérez les notifications pour les parents</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Notification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentPortalSection;
