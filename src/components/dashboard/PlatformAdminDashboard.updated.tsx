import React, { useState } from 'react';
import { 
  Building, Users, TrendingUp, Plus, Settings, Shield, Database, 
  BarChart3, UserCheck, AlertTriangle, DollarSign, Calendar,
  Search, Filter, Download, Edit, Trash2, Eye, Mail, Phone, FileText
} from 'lucide-react';
import usePlatformAdmin from '../../hooks/usePlatformAdmin';

const PlatformAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    stats,
    schools,
    users,
    pendingUsers,
    activityLogs,
    loading,
    error,
    actions
  } = usePlatformAdmin();

  // Stats data from API
  const statsData = stats ? [
    { name: 'Total Écoles', value: stats.totalSchools.toString(), icon: Building, color: 'bg-blue-500', change: `+${stats.monthlyGrowth.schools}` },
    { name: 'Total Élèves', value: stats.totalStudents.toString(), icon: Users, color: 'bg-green-500', change: `+${stats.monthlyGrowth.students}` },
    { name: 'Total Enseignants', value: stats.totalTeachers.toString(), icon: Users, color: 'bg-purple-500', change: `+${stats.monthlyGrowth.teachers}` },
    { name: 'Revenus Mensuels', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-yellow-500', change: `+${stats.monthlyGrowth.revenue}%` }
  ] : [];

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'schools', name: 'Écoles', icon: Building },
    { id: 'users', name: 'Utilisateurs', icon: Users },
    { id: 'analytics', name: 'Analytiques', icon: TrendingUp },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setActiveTab('schools')}
          >
            <Plus className="h-5 w-5 text-blue-600 mr-3" />
            <span className="font-medium">Ajouter une école</span>
          </button>
          <button 
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setActiveTab('users')}
          >
            <UserCheck className="h-5 w-5 text-green-600 mr-3" />
            <span className="font-medium">Approuver utilisateurs</span>
          </button>
          <button 
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => actions.exportData('analytics')}
          >
            <Download className="h-5 w-5 text-purple-600 mr-3" />
            <span className="font-medium">Exporter données</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
        <div className="space-y-3">
          {activityLogs.map((log, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  log.type === 'school' ? 'bg-green-500' : 
                  log.type === 'user' ? 'bg-blue-500' : 
                  log.type === 'financial' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-sm">{log.description}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleDateString('fr-FR')}
              </span>
            </div>
          ))}
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
          <button 
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => actions.exportData('schools')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            onClick={() => {
              // This would open a modal in a real implementation
              console.log('Add school clicked');
            }}
          >
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
                    <div className="text-sm text-gray-500">{school.teacherCount} enseignants</div>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.studentCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${school.revenue.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {school.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => actions.deleteSchool(school.id)}
                    >
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
          <button 
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => actions.exportData('users')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Pending Users Section */}
      {pendingUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Utilisateurs en attente d\'approbation</h4>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">{user.schoolName}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {user.role}
                  </span>
                  <button 
                    className="text-green-600 hover:text-green-900"
                    onClick={() => actions.updateUserStatus(user.id, 'active')}
                  >
                    Approuver
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => actions.updateUserStatus(user.id, 'suspended')}
                  >
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
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
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.schoolName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytiques de la Plateforme</h3>
        <p className="text-gray-600">Graphiques et données analytiques de la plateforme</p>
        {/* In a real implementation, this would include charts */}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de la Plateforme</h3>
        <p className="text-gray-600">Configuration générale de la plateforme</p>
        {/* In a real implementation, this would include platform settings */}
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
          </div>
          <p className="mt-2 text-red-700">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'schools':
        return renderSchools();
      case 'users':
        return renderUsers();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
          <p className="text-gray-600">Gestion de la plateforme SchoolConnect</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
