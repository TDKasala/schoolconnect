import React, { useState, useEffect } from 'react';
import { 
  Building, Users, TrendingUp, Plus, Settings, Shield, 
  BarChart3, UserCheck, AlertTriangle, DollarSign,
  Search, Filter, Download, Edit, Trash2, Eye, Mail
} from 'lucide-react';
import { useAuth, UserWithProfile } from '../../contexts/AuthContext';
import { useOverview } from '../../hooks/useOverview';

const PlatformAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  
  const {
    stats,
    recentActivities,
    upcomingEvents,
    recentMessages,
    financialSummary,
    classPerformance,
    loading,
    error,
    fetchOverviewData
  } = useOverview(typedUser?.id || '', 'platform_admin');

  useEffect(() => {
    if (typedUser?.id) {
      fetchOverviewData();
    }
  }, [typedUser?.id, fetchOverviewData]);

  const [activeTab, setActiveTab] = useState('overview');
  const [schools] = useState([
    { 
      id: '1', 
      name: 'École Primaire Saint-Joseph', 
      students: 247, 
      teachers: 18, 
      status: 'active',
      location: 'Kinshasa',
      plan: 'Premium',
      revenue: 15000,
      lastActive: '2024-01-20'
    },
    { 
      id: '2', 
      name: 'Institut Technique de Lubumbashi', 
      students: 412, 
      teachers: 28, 
      status: 'active',
      location: 'Lubumbashi',
      plan: 'Standard',
      revenue: 12000,
      lastActive: '2024-01-19'
    },
    { 
      id: '3', 
      name: 'Collège Moderne de Goma', 
      students: 189, 
      teachers: 15, 
      status: 'inactive',
      location: 'Goma',
      plan: 'Basic',
      revenue: 8000,
      lastActive: '2024-01-15'
    }
  ]);

  const [users] = useState([
    { id: '1', name: 'Jean Mukendi', email: 'jean@school1.cd', role: 'school_admin', school: 'École Primaire Saint-Joseph', status: 'active' },
    { id: '2', name: 'Marie Kabila', email: 'marie@school2.cd', role: 'teacher', school: 'Institut Technique', status: 'pending' },
    { id: '3', name: 'Pierre Tshisekedi', email: 'pierre@school3.cd', role: 'school_admin', school: 'Collège Moderne', status: 'suspended' }
  ]);

  const statsData = [
    { name: 'Total Écoles', value: stats?.totalSchools.toString() || '0', icon: Building, color: 'bg-blue-500', change: '+2' },
    { name: 'Total Élèves', value: stats?.totalStudents.toString() || '0', icon: Users, color: 'bg-green-500', change: '+45' },
    { name: 'Total Enseignants', value: stats?.totalTeachers.toString() || '0', icon: Users, color: 'bg-purple-500', change: '+8' },
    { name: 'Revenus Mensuels', value: financialSummary ? `$${financialSummary.totalRevenue.toLocaleString()}` : '$0', icon: DollarSign, color: 'bg-yellow-500', change: '+12%' }
  ];

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'schools', name: 'Écoles', icon: Building },
    { id: 'users', name: 'Utilisateurs', icon: Users },
    { id: 'analytics', name: 'Analytiques', icon: TrendingUp },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchOverviewData}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Plus className="h-5 w-5 text-blue-600 mr-3" />
            <span className="font-medium">Ajouter une école</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <UserCheck className="h-5 w-5 text-green-600 mr-3" />
            <span className="font-medium">Approuver utilisateurs</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="h-5 w-5 text-purple-600 mr-3" />
            <span className="font-medium">Exporter données</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
        <div className="space-y-3">
          {recentActivities && recentActivities.length > 0 ? (
            recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">{activity.action}: {activity.target}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              Aucune activité récente
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSchools = () => (
    <div className="space-y-6">
      {/* Schools Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion des Écoles</h3>
          <p className="text-sm text-gray-600">Gérez toutes les écoles de la plateforme</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </button>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </button>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter École
          </button>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">École</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élèves</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{school.name}</div>
                    <div className="text-sm text-gray-500">{school.teachers} enseignants</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    school.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                    school.plan === 'Standard' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {school.plan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.students}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${school.revenue.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {school.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Users Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion des Utilisateurs</h3>
          <p className="text-sm text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            <UserCheck className="h-4 w-4 mr-2" />
            Approuver en masse
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">École</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'school_admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'school_admin' ? 'Admin École' : 
                     user.role === 'teacher' ? 'Enseignant' : user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.school}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Actif' :
                     user.status === 'pending' ? 'En attente' : 'Suspendu'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <UserCheck className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Shield className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Événements à Venir</h3>
          <div className="space-y-3">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 5).map((event, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.startDate).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })} à {new Date(event.startDate).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {event.eventType}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Aucun événement à venir
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages Récents</h3>
          <div className="space-y-3">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.slice(0, 5).map((message, index) => (
                <div key={index} className="flex items-start py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{message.senderName}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleDateString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{message.content}</p>
                  </div>
                  {!message.isRead && (
                    <span className="ml-2 inline-flex items-center justify-center h-2 w-2 rounded-full bg-blue-500"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Aucun message récent
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Croissance des Écoles</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Graphique de croissance</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des Classes</h3>
          <div className="space-y-4">
            {classPerformance && classPerformance.length > 0 ? (
              classPerformance.slice(0, 5).map((performance, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{performance.className}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 mr-4">
                        {performance.studentCount} élèves
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Moyenne: {performance.averageGrade.toFixed(1)}%</span>
                          <span>Présence: {performance.attendanceRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="flex flex-col justify-center rounded-full overflow-hidden bg-green-500 text-xs text-white text-center whitespace-nowrap transition duration-500" 
                            style={{ width: `${performance.averageGrade}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Aucune donnée de performance disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres Système</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
              <p className="text-sm text-gray-500">Activer le mode maintenance</p>
            </div>
            <button className="bg-gray-200 rounded-full w-12 h-6 flex items-center">
              <div className="bg-white w-5 h-5 rounded-full shadow transform transition-transform"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notifications Email</h4>
              <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
            </div>
            <button className="bg-blue-600 rounded-full w-12 h-6 flex items-center justify-end">
              <div className="bg-white w-5 h-5 rounded-full shadow transform transition-transform"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Administration Plateforme</h1>
        <p className="mt-2 text-gray-600">Contrôle total de la plateforme SchoolConnect</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'schools' && renderSchools()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default PlatformAdminDashboard;
