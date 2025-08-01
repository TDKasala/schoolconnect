import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck, 
  Download,
  AlertCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOverview } from '../../hooks/useOverview';
import { PlatformAdminService } from '../../services/platformAdminService';
import type { User } from '../../types/auth';

// TypeScript interfaces for the dashboard data
interface School {
  id: string;
  name: string;
  city: string;
  country: string;
  studentCount: number;
  teacherCount: number;
  is_active: boolean;
  subscription_type: 'forfait' | 'flex';
}

interface DashboardUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  schoolName?: string;
  is_active: boolean;
}

interface ActivityLog {
  id: string;
  action: string;
  userName: string;
  description: string;
  timestamp: string;
}

const PlatformAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as User | null;
  
  // Use the overview hook for basic stats and activity logs
  const {
    stats,
    recentActivities,
    financialSummary,
    loading,
    error,
    fetchOverviewData
  } = useOverview(typedUser?.id || '', 'platform_admin');

  // Initialize the platform admin service
  const platformAdminService = new PlatformAdminService();

  // State for dashboard-specific data
  const [activeTab, setActiveTab] = useState('overview');
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      setDashboardError(null);
      try {
        const [schoolsData, usersData] = await Promise.all([
          platformAdminService.getSchoolsWithStats(),
          platformAdminService.getUsersWithSchool()
        ]);
        setSchools(schoolsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setDashboardError('Erreur lors du chargement des données du tableau de bord');
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Quick action handlers
  const handleAddSchool = async () => {
    console.log('Add school functionality');
  };

  const handleApproveUsers = async () => {
    try {
      const pendingUsers = await platformAdminService.getPendingUsers();
      console.log('Pending users:', pendingUsers);
    } catch (error) {
      console.error('Failed to get pending users:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await platformAdminService.exportData('schools');
      console.log('Export data:', data);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

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
            <AlertCircle className="h-5 w-5 text-red-400" />
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
          <button 
            onClick={handleAddSchool}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Ajouter École</span>
          </button>
          <button 
            onClick={handleApproveUsers}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <UserCheck className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Approuver Utilisateurs</span>
          </button>
          <button 
            onClick={handleExportData}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Download className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Exporter Données</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : recentActivities && recentActivities.length > 0 ? (
            recentActivities.slice(0, 5).map((activity: ActivityLog, index: number) => (
              <div key={index} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-0">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  activity.action === 'create' ? 'bg-green-500' :
                  activity.action === 'update' ? 'bg-blue-500' :
                  activity.action === 'delete' ? 'bg-red-500' :
                  'bg-gray-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.userName}</span> {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Écoles</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter École
        </button>
      </div>

      {dashboardLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">École</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élèves</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enseignants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.length > 0 ? schools.map((school) => (
                <tr key={school.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{school.name}</div>
                      <div className="text-sm text-gray-500">{school.city}, {school.country}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.studentCount || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.teacherCount || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      school.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {school.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.subscription_type === 'forfait' ? 'Forfait' : 'Flex'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Aucune école trouvée. Ajoutez votre première école pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
            <UserCheck className="h-4 w-4 mr-2" />
            Approuver En Attente
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Utilisateur
          </button>
        </div>
      </div>

      {dashboardLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
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
              {users.length > 0 ? users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.full_name || user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'platform_admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'school_admin' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'platform_admin' ? 'Admin Plateforme' :
                       user.role === 'school_admin' ? 'Admin École' :
                       user.role === 'teacher' ? 'Enseignant' : user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.schoolName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-green-600 hover:text-green-900 mr-3"
                      onClick={async () => {
                        try {
                          await platformAdminService.updateUserStatus(user.id, user.is_active ? 'suspended' : 'active');
                          // Refresh data
                          const usersData = await platformAdminService.getUsersWithSchool();
                          setUsers(usersData);
                        } catch (error) {
                          console.error('Failed to update user status:', error);
                        }
                      }}
                    >
                      <UserCheck className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytiques de la Plateforme</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Croissance des Utilisateurs</h3>
          <div className="text-center py-8 text-gray-500">
            Graphique de croissance des utilisateurs
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus par École</h3>
          <div className="text-center py-8 text-gray-500">
            Graphique des revenus par école
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance du Système</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats?.totalSchools || 0}</div>
            <div className="text-sm text-gray-500">Écoles Actives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats?.totalStudents || 0}</div>
            <div className="text-sm text-gray-500">Élèves Inscrits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats?.totalTeachers || 0}</div>
            <div className="text-sm text-gray-500">Enseignants</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Paramètres de la Plateforme</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Générale</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de la Plateforme</label>
            <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" defaultValue="SchoolConnect" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email de Contact</label>
            <input type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" defaultValue="contact@schoolconnect.cd" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Système</h3>
        <div className="space-y-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Sauvegarder la Base de Données
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Vérifier la Sécurité
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord - Administration Plateforme</h1>
          <p className="mt-2 text-gray-600">Gérez toutes les écoles et utilisateurs de la plateforme SchoolConnect</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'schools' && renderSchools()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
