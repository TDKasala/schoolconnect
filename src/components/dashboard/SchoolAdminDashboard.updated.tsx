import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  UserPlus, 
  Mail,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useSchoolAdmin } from '../../hooks/useSchoolAdmin';

// This would typically come from auth context or props
const SCHOOL_ID = 'school-123';

const SchoolAdminDashboard: React.FC = () => {
  const {
    stats,
    pendingUsers,
    activities,
    loading,
    error,
    handleUserRequest,
    sendInvitation
  } = useSchoolAdmin(SCHOOL_ID);

  const [invitationEmail, setInvitationEmail] = useState('');
  const [invitationRole, setInvitationRole] = useState<'teacher' | 'parent'>('teacher');

  const handleSendInvitation = async () => {
    if (!invitationEmail) return;
    
    try {
      await sendInvitation(invitationEmail, invitationRole);
      setInvitationEmail('');
      // Show success message
      alert('Invitation sent successfully!');
    } catch (err) {
      // Show error message
      alert('Failed to send invitation');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statsData = stats ? [
    {
      name: 'Total Élèves',
      value: stats.totalStudents.toString(),
      change: `+${stats.monthlyGrowth.students}`,
      changeType: 'increase',
      icon: Users,
      color: 'bg-primary-500'
    },
    {
      name: 'Enseignants Actifs',
      value: stats.activeTeachers.toString(),
      change: `+${stats.monthlyGrowth.teachers}`,
      changeType: 'increase',
      icon: BookOpen,
      color: 'bg-secondary-500'
    },
    {
      name: 'Recettes ce mois',
      value: `$${stats.monthlyRevenue.toLocaleString()} USD`,
      change: `+${stats.monthlyGrowth.revenue}%`,
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-secondary-600'
    },
    {
      name: 'Taux de présence',
      value: `${stats.attendanceRate}%`,
      change: `+${stats.monthlyGrowth.attendance}%`,
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-primary-600'
    }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord - Administration</h1>
        <p className="mt-2 text-gray-600">
          Vue d'ensemble de votre établissement scolaire
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending User Approvals */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Demandes d'accès en attente
              </h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pendingUsers.length}
              </span>
            </div>
          </div>
          <div className="p-6">
            {pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">Aucune demande en attente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {user.role === 'teacher' ? 'Enseignant' : 'Parent'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(user.requestDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUserRequest(user.id, 'approve')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        title="Approuver"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleUserRequest(user.id, 'reject')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Rejeter"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Management Section */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Gestion du personnel</h2>
            <button
              onClick={handleSendInvitation}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Inviter un membre
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4 flex space-x-4">
            <input
              type="email"
              value={invitationEmail}
              onChange={(e) => setInvitationEmail(e.target.value)}
              placeholder="Email de l'utilisateur"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <select
              value={invitationRole}
              onChange={(e) => setInvitationRole(e.target.value as 'teacher' | 'parent')}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="teacher">Enseignant</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
              <Mail className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">Inviter par email</h3>
              <p className="text-xs text-gray-500">Envoyez une invitation directement par email</p>
            </div>
            
            <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">Import en lot</h3>
              <p className="text-xs text-gray-500">Importez plusieurs utilisateurs via Excel</p>
            </div>
            
            <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">Guide d'utilisation</h3>
              <p className="text-xs text-gray-500">Apprenez à gérer votre équipe efficacement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
