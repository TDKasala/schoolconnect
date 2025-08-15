import React, { useState, useEffect, useCallback } from 'react';
import AddSchoolModal, { SchoolForm } from './AddSchoolModal';
import EditSchoolModal from './EditSchoolModal';
import AddUserModal, { UserForm as AddUserForm } from './AddUserModal';
import EditUserModal from './EditUserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DeleteSuccessModal from './DeleteSuccessModal';
import SchoolDetailsModal from './SchoolDetailsModal';
import SchoolDeleteSuccessModal from './SchoolDeleteSuccessModal';
import PendingUsersModal from './PendingUsersModal';
import AnalyticsCharts from './AnalyticsCharts';
import { useSettings } from '../../hooks/useSettings';
import RecentActivities from './RecentActivities';
import {
  Users,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Download,
  TrendingUp,
  DollarSign,
  Building2,
  AlertCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PlatformAdminService, type SchoolWithStats, type UserWithSchool } from '../../services/platformAdminService';
import { useOverview } from '../../hooks/useOverview';

const PlatformAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { settings, setSettings, loading: settingsLoading, saving: settingsSaving, error: settingsError, updateSettings, runSecurityChecks } = useSettings();
  const [securityReport, setSecurityReport] = useState<{ checks: Array<{ name: string; status: 'ok' | 'warn' | 'fail'; details?: string }>; passed: boolean } | null>(null);
  const [exportType, setExportType] = useState<'schools' | 'users' | 'analytics'>('analytics');
  
  // Helper: map activity action to type for `RecentActivities`
  const getActivityType = (action: string): 'user' | 'school' | 'system' | 'payment' | 'auth' => {
    const a = (action || '').toLowerCase();
    if (a.includes('user')) return 'user';
    if (a.includes('school')) return 'school';
    if (a.includes('login') || a.includes('logout') || a.includes('auth')) return 'auth';
    if (a.includes('payment') || a.includes('subscription') || a.includes('invoice')) return 'payment';
    return 'system';
  };
  
  // Use the overview hook for basic stats and activity logs
  const {
    stats,
    recentActivities,
    financialSummary,
    loading,
    error,
    fetchOverviewData
  } = useOverview(user?.id || '', 'platform_admin');

  // State for dashboard-specific data
  const [activeTab, setActiveTab] = useState('overview');
  const [schools, setSchools] = useState<SchoolWithStats[]>([]);
  const [users, setUsers] = useState<UserWithSchool[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  // Modal state for add school
  const [addSchoolOpen, setAddSchoolOpen] = useState(false);
  const [addSchoolLoading, setAddSchoolLoading] = useState(false);
  const [addSchoolError, setAddSchoolError] = useState('');
  // Modal state for edit school
  const [editSchoolOpen, setEditSchoolOpen] = useState(false);
  const [editSchoolLoading, setEditSchoolLoading] = useState(false);
  const [editSchoolError, setEditSchoolError] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  // Modal state for add user
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithSchool | null>(null);
  const [userToDelete, setUserToDelete] = useState<{id: string, name: string} | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState('');
  
  // State for delete success modal
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const [deletedUserName, setDeletedUserName] = useState('');
  
  // State for school modals
  const [schoolDetailsOpen, setSchoolDetailsOpen] = useState(false);
  const [selectedSchoolDetails, setSelectedSchoolDetails] = useState<any>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<{ id: string; name: string } | null>(null);
  const [schoolDeleteModalOpen, setSchoolDeleteModalOpen] = useState(false);
  const [schoolDeleteSuccessOpen, setSchoolDeleteSuccessOpen] = useState(false);
  const [deletedSchoolName, setDeletedSchoolName] = useState('');
  
  // Pending users modal state
  const [pendingUsersModalOpen, setPendingUsersModalOpen] = useState(false);

  useEffect(() => {
    if (dashboardError) {
      // Log error to console for debugging
      console.error('Dashboard error:', dashboardError);
    }
  }, [dashboardError]);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      setDashboardError(null);
      try {
        const [schoolsData, usersData] = await Promise.all([
          PlatformAdminService.getSchoolsWithStats(),
          PlatformAdminService.getUsersWithSchool()
        ]);
        console.log('Fetched schools data:', schoolsData);
        console.log('Fetched users data:', usersData);
        setSchools(schoolsData);
        setUsers(usersData);
        if (!schoolsData || schoolsData.length === 0) {
          setDashboardError('Aucune école trouvée. Vérifiez que vos données existent dans Supabase et que les permissions sont correctes.');
        }
        if (!usersData || usersData.length === 0) {
          setDashboardError('Aucun utilisateur trouvé. Vérifiez que vos données existent dans Supabase et que les permissions sont correctes.');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setDashboardError('Erreur lors du chargement des données du tableau de bord: ' + (error instanceof Error ? error.message : String(error)));
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Add school handlers with useCallback for stability
  const openAddSchoolModal = useCallback(() => {
    console.log('Opening add school modal');
    setAddSchoolError('');
    setAddSchoolOpen(true);
  }, []);

  const closeAddSchoolModal = useCallback(() => {
    setAddSchoolOpen(false);
    setAddSchoolError('');
  }, []);

  const handleAddSchoolSubmit = useCallback(async (form: SchoolForm) => {
    setAddSchoolLoading(true);
    setAddSchoolError('');
    try {
      const newSchool = await PlatformAdminService.createSchool(form);
      console.log('École créée avec succès:', newSchool);
      const updatedSchools = await PlatformAdminService.getSchoolsWithStats();
      setSchools(updatedSchools);
      closeAddSchoolModal();
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'école:', error);
      setAddSchoolError(error.message || 'Erreur lors de la création de l\'école. Veuillez réessayer.');
    } finally {
      setAddSchoolLoading(false);
    }
  }, [closeAddSchoolModal]);

  // Edit school handlers with useCallback for stability
  const openEditSchoolModal = useCallback((school: any) => {
    console.log('Opening edit modal for school:', school);
    setSelectedSchool(school);
    setEditSchoolError('');
    setEditSchoolOpen(true);
  }, []);

  const closeEditSchoolModal = useCallback(() => {
    setEditSchoolOpen(false);
    setEditSchoolError('');
    setSelectedSchool(null);
  }, []);

  const handleEditSchoolSubmit = async (form: SchoolForm) => {
    if (!selectedSchool) return;
    setEditSchoolLoading(true);
    setEditSchoolError('');
    try {
      await PlatformAdminService.updateSchool(selectedSchool.id, form);
      console.log('École modifiée avec succès');
      const updatedSchools = await PlatformAdminService.getSchoolsWithStats();
      setSchools(updatedSchools);
      closeEditSchoolModal();
    } catch (error: any) {
      console.error('Erreur lors de la modification de l\'école:', error);
      setEditSchoolError(error.message || 'Erreur lors de la modification de l\'école. Veuillez réessayer.');
    } finally {
      setEditSchoolLoading(false);
    }
  };

  // View school details handler
  const handleViewSchoolDetails = useCallback((school: any) => {
    setSelectedSchoolDetails(school);
    setSchoolDetailsOpen(true);
  }, []);

  // Close school details modal
  const closeSchoolDetailsModal = useCallback(() => {
    setSchoolDetailsOpen(false);
    setSelectedSchoolDetails(null);
  }, []);

  // Handle school delete click
  const handleDeleteSchoolClick = useCallback((school: any) => {
    setSchoolToDelete({ id: school.id, name: school.name });
    setSchoolDeleteModalOpen(true);
  }, []);

  // Close school delete success modal
  const closeSchoolDeleteSuccessModal = useCallback(() => {
    setSchoolDeleteSuccessOpen(false);
    setDeletedSchoolName('');
  }, []);

  // Delete school handler with modal confirmation
  const handleDeleteSchool = useCallback(async () => {
    if (!schoolToDelete) return;
    
    try {
      await PlatformAdminService.deleteSchool(schoolToDelete.id);
      console.log('École supprimée avec succès');
      
      // Refresh schools list
      const updatedSchools = await PlatformAdminService.getSchoolsWithStats();
      setSchools(updatedSchools);
      
      // Show success modal
      setDeletedSchoolName(schoolToDelete.name);
      setSchoolDeleteSuccessOpen(true);
      
      // Close confirmation modal
      setSchoolDeleteModalOpen(false);
      setSchoolToDelete(null);
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'école:', error);
      // The error will be shown in the confirmation modal
      alert('Erreur lors de la suppression de l\'école. Veuillez réessayer.');
    }
  }, [schoolToDelete]);

  // Add user handlers with useCallback for stability
  const openAddUserModal = useCallback(() => {
    console.log('Opening add user modal');
    setAddUserError('');
    setSelectedUser(null);
    setAddUserOpen(true);
  }, []);

  const openEditUserModal = useCallback((user: UserWithSchool) => {
    console.log('Opening edit user modal for user:', user);
    setEditUserError('');
    setSelectedUser(user);
    setEditUserOpen(true);
  }, []);

  const closeEditUserModal = useCallback(() => {
    setEditUserOpen(false);
    setEditUserError('');
    setSelectedUser(null);
  }, []);

  const closeAddUserModal = useCallback(() => {
    setAddUserOpen(false);
    setAddUserError('');
  }, []);

  type EditUserForm = { name: string; email: string; role: string; schoolId: string };

  const handleAddUserSubmit = async (form: AddUserForm) => {
    setAddUserLoading(true);
    setAddUserError('');
    try {
      const newUser = await PlatformAdminService.createUser(form);
      console.log('Utilisateur créé avec succès:', newUser);
      const updatedUsers = await PlatformAdminService.getUsersWithSchool();
      setUsers(updatedUsers);
      closeAddUserModal();
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      setAddUserError(error.message || 'Erreur lors de la création de l\'utilisateur. Veuillez réessayer.');
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleEditUserSubmit = async (form: EditUserForm) => {
    if (!selectedUser) return;
    
    setEditUserLoading(true);
    setEditUserError('');
    
    try {
      // Ensure required fields are included
      const allowedRoles = ['platform_admin', 'school_admin', 'teacher', 'parent'] as const;
      const role = allowedRoles.includes(form.role as any) ? form.role as typeof allowedRoles[number] : 'teacher';
      const userData: {
        email?: string;
        name?: string;
        role?: 'platform_admin' | 'school_admin' | 'teacher' | 'parent';
        schoolId?: string;
      } = {
        email: form.email,
        name: form.name,
        role,
        schoolId: form.schoolId || undefined,
      };
      
      await PlatformAdminService.updateUser(selectedUser.id, userData);
      const updatedUsers = await PlatformAdminService.getUsersWithSchool();
      setUsers(updatedUsers);
      setEditUserOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setEditUserError('Failed to update user. Please try again.');
    } finally {
      setEditUserLoading(false);
    }
  };

  const handleDeleteClick = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteModalOpen(true);
  };

  const closeDeleteSuccessModal = () => {
    setDeleteSuccessOpen(false);
    setDeletedUserName('');
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setDeleteLoading(true);
    setEditUserError('');
    
    try {
      console.log(`Attempting to delete user with ID: ${userToDelete.id}`);
      await PlatformAdminService.deleteUser(userToDelete.id);
      
      console.log('User deleted successfully, refreshing user list...');
      const updatedUsers = await PlatformAdminService.getUsersWithSchool();
      setUsers(updatedUsers);
      
      // Show success modal instead of alert popup
      setDeletedUserName(userToDelete.name);
      setDeleteSuccessOpen(true);
      
      // Close the confirmation modal and reset state
      setDeleteModalOpen(false);
      setUserToDelete(null);
      
    } catch (error: any) {
      console.error('Error in handleDeleteUser:', error);
      
      // More specific error handling
      let errorMessage = 'Une erreur est survenue lors de la suppression de l\'utilisateur.';
      
      if (error.message.includes('Auth deletion failed')) {
        errorMessage = 'Erreur lors de la suppression du compte utilisateur. ';
        if (error.message.includes('insufficient permissions')) {
          errorMessage += 'Permissions insuffisantes pour effectuer cette action.';
        } else {
          errorMessage += 'Veuillez vérifier vos droits d\'administration.';
        }
      } else if (error.message.includes('Database deletion failed')) {
        errorMessage = 'Erreur lors de la suppression des données utilisateur. ';
        errorMessage += 'Veuillez contacter le support technique.';
      } else if (error.message.includes('Failed to fetch user data')) {
        errorMessage = 'Impossible de trouver l\'utilisateur à supprimer. ';
        errorMessage += 'L\'utilisateur a peut-être déjà été supprimé.';
      }
      
      // Show error message to user
      setEditUserError(errorMessage);
      
      // Keep the modal open to show the error message
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await PlatformAdminService.updateUserStatus(userId, newStatus);
      const updatedUsers = await PlatformAdminService.getUsersWithSchool();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'utilisateur:', error);
      alert('Erreur lors de la mise à jour du statut de l\'utilisateur. Veuillez réessayer.');
    }
  };

  const handleApproveUsers = async () => {
    try {
      const pendingUsers = await PlatformAdminService.getPendingUsers();
      console.log('Pending users:', pendingUsers);
    } catch (error) {
      console.error('Failed to get pending users:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await PlatformAdminService.exportData('schools');
      console.log('Export data:', data);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const statsData = [
    { name: 'Total Écoles', value: stats?.totalSchools?.toString() || '0', icon: Building2, color: 'bg-blue-500', change: '' },
    { name: 'Total Élèves', value: stats?.totalStudents?.toString() || '0', icon: Users, color: 'bg-green-500', change: '' },
    { name: 'Total Enseignants', value: stats?.totalTeachers?.toString() || '0', icon: Users, color: 'bg-purple-500', change: '' },
    { name: 'Revenus Mensuels', value: financialSummary ? `$${financialSummary.totalRevenue?.toLocaleString()}` : '$0', icon: DollarSign, color: 'bg-yellow-500', change: '' }
  ];

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'schools', name: 'Écoles', icon: Building2 },
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
      {/* Error State (Overview) */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur de chargement des statistiques</h3>
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
      {/* Error State (Dashboard) */}
      {dashboardError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur du tableau de bord</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{dashboardError}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Recharger la page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Stats Grid */}
      {!loading && !error && !dashboardError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <div className={`${stat.color} rounded-lg p-2 sm:p-3 flex-shrink-0`}>
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-green-600 font-medium ml-2 flex-shrink-0">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button 
            onClick={openAddSchoolModal}
            className="flex items-center justify-center p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mr-2" />
            <span className="text-sm sm:text-base text-gray-600">Ajouter École</span>
          </button>
          <AddSchoolModal
            isOpen={addSchoolOpen}
            onClose={closeAddSchoolModal}
            onSubmit={handleAddSchoolSubmit}
            loading={addSchoolLoading}
            error={addSchoolError}
          />
          <EditSchoolModal
            isOpen={editSchoolOpen}
            onClose={closeEditSchoolModal}
            onSubmit={handleEditSchoolSubmit}
            loading={editSchoolLoading}
            error={editSchoolError}
            school={selectedSchool}
          />
          <button 
            onClick={handleApproveUsers}
            className="flex items-center justify-center p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mr-2" />
            <span className="text-sm sm:text-base text-gray-600">Approuver Utilisateurs</span>
          </button>
          <button 
            onClick={handleExportData}
            className="flex items-center justify-center p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors sm:col-span-2 lg:col-span-1"
          >
            <Download className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mr-2" />
            <span className="text-sm sm:text-base text-gray-600">Exporter Données</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <RecentActivities 
          activities={(recentActivities || []).map((activity) => ({
            ...activity,
            description: activity.description || `${activity.userName || 'Un utilisateur'} a effectué l'action: ${activity.action}${activity.target ? ` sur ${activity.target}` : ''}`,
            type: getActivityType(activity.action),
            timestamp: new Date((activity as any).timestamp)
          }))}
          loading={loading}
        />
      </div>
    </div>
  );

  const renderSchools = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Écoles</h2>
        <button 
          onClick={openAddSchoolModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center sm:justify-start"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter École
        </button>
      </div>

      {dashboardLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="sm:hidden space-y-4">
            {schools.length > 0 ? schools.map((school) => (
              <div key={school.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{school.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{school.location}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                    school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {school.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center mb-3">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{school.studentCount || 0}</p>
                    <p className="text-xs text-gray-500">Élèves</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{school.teacherCount || 0}</p>
                    <p className="text-xs text-gray-500">Enseignants</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{school.plan}</p>
                    <p className="text-xs text-gray-500">Plan</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => handleViewSchoolDetails(school)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => openEditSchoolModal(school)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteSchoolClick(school)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Aucune école trouvée. Ajoutez votre première école pour commencer.</p>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
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
                          <div className="text-sm text-gray-500">{school.location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.studentCount || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.teacherCount || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {school.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {school.plan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewSchoolDetails(school)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openEditSchoolModal(school)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSchoolClick(school)}
                          className="text-red-600 hover:text-red-900"
                        >
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
          </div>
        </>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => setPendingUsersModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Approuver En Attente
          </button>
          <button 
            onClick={openAddUserModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
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
        <>
          {/* Mobile Card Layout */}
          <div className="sm:hidden space-y-4">
            {users.length > 0 ? users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Rôle</p>
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
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">École</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user.schoolName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => openEditUserModal(user)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-green-600 hover:text-green-900"
                    onClick={() => openEditUserModal(user)}
                    title="Modifier l'utilisateur"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className={`${user.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                    onClick={() => handleToggleUserStatus(user.id, user.status)}
                    title={user.status === 'active' ? 'Suspendre l\'utilisateur' : 'Activer l\'utilisateur'}
                  >
                    {user.status === 'active' ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteClick(user.id, user.name || user.email)}
                    title="Supprimer l'utilisateur"
                    disabled={deleteLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Aucun utilisateur trouvé.</p>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
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
                        <div className="text-sm font-medium text-gray-900">{user.name || user.email}</div>
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
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => openEditUserModal(user)}
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900 mr-3"
                          onClick={() => openEditUserModal(user)}
                          title="Modifier l'utilisateur"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className={`${user.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'} mr-3`}
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                          title={user.status === 'active' ? 'Suspendre l\'utilisateur' : 'Activer l\'utilisateur'}
                        >
                          {user.status === 'active' ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteClick(user.id, user.name || user.email)}
                          title="Supprimer l'utilisateur"
                          disabled={deleteLoading}
                        >
                          <Trash2 className="h-4 w-4" />
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
          </div>
        </>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytiques de la Plateforme</h2>
      
      <AnalyticsCharts 
        stats={{
          totalSchools: stats?.totalSchools || 0,
          totalStudents: stats?.totalStudents || 0,
          totalTeachers: stats?.totalTeachers || 0,
          totalUsers: (stats?.activeUsers || 0) + (stats?.pendingUsers || 0)
        }}
      />
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Paramètres de la Plateforme</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Générale</h3>
        {settingsError && <div className="text-red-600 text-sm mb-3">{settingsError}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de la Plateforme</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              value={settings?.platform_name || ''}
              onChange={(e) => setSettings(s => (s ? { ...s, platform_name: e.target.value } : s))}
              disabled={settingsLoading || settingsSaving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email de Contact</label>
            <input
              type="email"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              value={settings?.contact_email || ''}
              onChange={(e) => setSettings(s => (s ? { ...s, contact_email: e.target.value } : s))}
              disabled={settingsLoading || settingsSaving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Couleur Principale</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="color"
                className="h-10 w-14 p-0 border-gray-300 rounded-md shadow-sm"
                value={settings?.primary_color || '#2563eb'}
                onChange={(e) => setSettings(s => (s ? { ...s, primary_color: e.target.value } : s))}
                disabled={settingsLoading || settingsSaving}
              />
              <input
                type="text"
                className="flex-1 border-gray-300 rounded-md shadow-sm"
                value={settings?.primary_color || ''}
                onChange={(e) => setSettings(s => (s ? { ...s, primary_color: e.target.value } : s))}
                placeholder="#2563eb"
                disabled={settingsLoading || settingsSaving}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL de Support</label>
            <input
              type="url"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              value={settings?.support_url || ''}
              onChange={(e) => setSettings(s => (s ? { ...s, support_url: e.target.value } : s))}
              placeholder="https://schoolconnect.cd/support"
              disabled={settingsLoading || settingsSaving}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={async () => { if (settings) await updateSettings({ platform_name: settings.platform_name, contact_email: settings.contact_email, primary_color: settings.primary_color, support_url: settings.support_url }); }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={settingsLoading || settingsSaving}
            >
              {settingsSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Système</h3>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Type d'Export</label>
            <select
              className="border-gray-300 rounded-md shadow-sm"
              value={exportType}
              onChange={(e) => setExportType(e.target.value as any)}
            >
              <option value="analytics">Analytics</option>
              <option value="schools">Écoles</option>
              <option value="users">Utilisateurs</option>
            </select>
          </div>
          <button
            onClick={async () => {
              try {
                const blob = await PlatformAdminService.exportData(exportType);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup-${exportType}-${new Date().toISOString()}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (e) {
                alert('Échec de la sauvegarde.');
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Sauvegarder la Base de Données
          </button>
          <button
            onClick={async () => {
              const report = await runSecurityChecks();
              setSecurityReport(report);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
          >
            <Shield className="h-4 w-4 mr-2" />
            Vérifier la Sécurité
          </button>
        </div>
        {securityReport && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-md font-semibold mb-2">Rapport de Sécurité</h4>
            <ul className="space-y-2">
              {securityReport.checks.map((c, idx) => (
                <li key={idx} className="text-sm flex items-start">
                  <span className={`mr-2 mt-0.5 inline-block h-2 w-2 rounded-full ${c.status === 'ok' ? 'bg-green-500' : c.status === 'warn' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-700">
                    <strong>{c.name}:</strong> {c.status}
                    {c.details ? ` – ${c.details}` : ''}
                  </span>
                </li>
              ))}
            </ul>
            <div className={`mt-2 text-sm ${securityReport.passed ? 'text-green-600' : 'text-yellow-600'}`}>{securityReport.passed ? 'Tous les contrôles critiques sont OK.' : 'Certaines vérifications nécessitent votre attention.'}</div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fonctionnalités (Feature Toggles)</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Messaging</div>
              <div className="text-xs text-gray-500">Activer la messagerie en temps réel</div>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={Boolean(settings?.feature_flags?.messaging)}
                onChange={(e) => setSettings(s => (s ? { ...s, feature_flags: { ...(s.feature_flags || {}), messaging: e.target.checked } } : s))}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">UBank</div>
              <div className="text-xs text-gray-500">Paiements et gestion financière</div>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={Boolean(settings?.feature_flags?.ubank)}
                onChange={(e) => setSettings(s => (s ? { ...s, feature_flags: { ...(s.feature_flags || {}), ubank: e.target.checked } } : s))}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">POSP</div>
              <div className="text-xs text-gray-500">Gestion pédagogique</div>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={Boolean(settings?.feature_flags?.posp)}
                onChange={(e) => setSettings(s => (s ? { ...s, feature_flags: { ...(s.feature_flags || {}), posp: e.target.checked } } : s))}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              onClick={async () => {
                if (settings) {
                  await updateSettings({ feature_flags: settings.feature_flags || { messaging: false, ubank: false, posp: false } });
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={settingsLoading || settingsSaving}
            >
              {settingsSaving ? 'Enregistrement...' : 'Enregistrer les fonctionnalités'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Administration Plateforme SchoolConnect</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            {/* Mobile Tab Navigation - Dropdown */}
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full px-3 py-2 border-0 border-b border-gray-200 focus:ring-0 focus:border-blue-500 text-sm font-medium"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Desktop Tab Navigation */}
            <nav className="hidden sm:flex -mb-px space-x-4 lg:space-x-8 px-4 sm:px-6">
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
                  <tab.icon className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                  <span className="hidden lg:inline">{tab.name}</span>
                  <span className="lg:hidden">{tab.name.split(' ')[0]}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'schools' && renderSchools()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
        
        {/* Modals - Always rendered to maintain state across tab switches */}
        <AddSchoolModal
          isOpen={addSchoolOpen}
          onClose={closeAddSchoolModal}
          onSubmit={handleAddSchoolSubmit}
          loading={addSchoolLoading}
          error={addSchoolError}
        />
        
        <EditSchoolModal
          isOpen={editSchoolOpen}
          onClose={closeEditSchoolModal}
          onSubmit={handleEditSchoolSubmit}
          loading={editSchoolLoading}
          error={editSchoolError}
          school={selectedSchool}
        />
        
        <AddUserModal
          isOpen={addUserOpen}
          onClose={closeAddUserModal}
          onSubmit={handleAddUserSubmit}
          loading={addUserLoading}
          error={addUserError}
          schools={schools.map(school => ({ id: school.id, name: school.name }))}
        />
        
{selectedUser && (
          <EditUserModal
            isOpen={editUserOpen}
            onClose={closeEditUserModal}
            onSubmit={(form) => { void handleEditUserSubmit(form as any); }}
            loading={editUserLoading}
            error={editUserError}
            user={selectedUser}
            schools={schools.map(school => ({ id: school.id, name: school.name }))}
          />
        )}
        
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteUser}
          title="Supprimer l'utilisateur"
          description={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete?.name || ''} ? Cette action est irréversible.`}
          confirmText={deleteLoading ? 'Suppression en cours...' : 'Supprimer'}
          cancelText="Annuler"
          error={editUserError}
        />
        
        {/* School Modals */}
        {selectedSchoolDetails && (
          <SchoolDetailsModal
            isOpen={schoolDetailsOpen}
            onClose={closeSchoolDetailsModal}
            school={selectedSchoolDetails}
          />
        )}
        
        <DeleteConfirmationModal
          isOpen={schoolDeleteModalOpen}
          onClose={() => setSchoolDeleteModalOpen(false)}
          onConfirm={handleDeleteSchool}
          title="Supprimer l'école"
          description={`Êtes-vous sûr de vouloir supprimer l'école "${schoolToDelete?.name || ''}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
        
        {deletedSchoolName && (
          <SchoolDeleteSuccessModal
            isOpen={schoolDeleteSuccessOpen}
            onClose={closeSchoolDeleteSuccessModal}
            schoolName={deletedSchoolName}
          />
        )}
        
        {/* Pending Users Modal */}
        <PendingUsersModal
          isOpen={pendingUsersModalOpen}
          onClose={() => setPendingUsersModalOpen(false)}
          onUserApproved={() => {
            // Refresh users list when a user is approved
            PlatformAdminService.getUsersWithSchool().then(setUsers).catch(console.error);
          }}
        />
        
        <DeleteSuccessModal
          isOpen={deleteSuccessOpen}
          onClose={closeDeleteSuccessModal}
          userName={deletedUserName}
        />
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
