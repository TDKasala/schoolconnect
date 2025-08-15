import React from 'react';
import { 
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { useOverview } from '../../hooks/useOverview';

const SchoolAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const schoolId = typedUser?.profile?.school_id as string | undefined;
  const userId = typedUser?.id ?? '';
  const role = typedUser?.profile?.role ?? 'school_admin';

  const { stats, recentActivities, loading, error } = useOverview(userId, role, schoolId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord - Administration</h1>
        <p className="mt-2 text-gray-600">
          Vue d'ensemble de votre établissement scolaire
        </p>
      </div>

      {/* Stats Grid (live) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-primary-500 rounded-lg p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Élèves</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : stats?.totalStudents ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-secondary-500 rounded-lg p-3">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enseignants Actifs</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : stats?.totalTeachers ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-secondary-600 rounded-lg p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : stats?.totalClasses ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-primary-600 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : stats?.activeUsers ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities (live) */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {loading && (
                <p className="text-sm text-gray-500">Chargement…</p>
              )}
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              {!loading && recentActivities.length === 0 && (
                <p className="text-sm text-gray-500">Aucune activité récente</p>
              )}
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description || `${activity.userName} a effectué: ${activity.action}${activity.target ? ` sur ${activity.target}` : ''}`}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Note: Team management and pending approvals removed until backed by real APIs */}
    </div>
  );
};

export default SchoolAdminDashboard;
