import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  Edit,
  Eye,
  ClipboardCheck,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { useOverview } from '../../hooks/useOverview';

const TeacherPospView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('classes');
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const schoolId = typedUser?.profile?.school_id as string | undefined;
  const userId = typedUser?.id ?? '';
  const role = typedUser?.profile?.role ?? 'teacher';

  const { stats, classPerformance, events, messages, loading, error } = useOverview(userId, role, schoolId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'attention': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Bien';
      case 'attention': return 'Attention';
      default: return 'Normal';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats (live) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mes Classes</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : stats?.totalClasses ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
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
            <div className="bg-orange-500 rounded-lg p-3">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Messages récents</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : messages.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Événements à venir</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : events.length}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded">{error}</div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Nouveau Devoir</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 hover:bg-secondary-50 transition-colors">
            <ClipboardCheck className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Marquer Présences</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <BarChart3 className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Ajouter Notes</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <Calendar className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Planning</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('classes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'classes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes Classes
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes Élèves
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Devoirs & Évaluations
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Mes Classes</h3>
                <p className="text-sm text-gray-500">Gérez vos classes et suivez les progrès</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && (
                  <div className="col-span-full text-sm text-gray-500">Chargement…</div>
                )}
                {!loading && classPerformance.length === 0 && (
                  <div className="col-span-full text-sm text-gray-500">Aucune classe trouvée</div>
                )}
                {classPerformance.map((cp) => (
                  <div key={cp.classId} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{cp.className}</h4>
                        <p className="text-sm text-gray-500">{cp.subjects?.join(', ') || '—'}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">{cp.studentCount}</div>
                        <div className="text-xs text-gray-500">élèves</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{cp.attendanceRate}%</div>
                        <div className="text-xs text-gray-500">Présence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary-600">{cp.averageGrade}/100</div>
                        <div className="text-xs text-gray-500">Moyenne</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-sm">
                        Gérer la classe
                      </button>
                      <button className="flex-1 bg-secondary-600 text-white py-2 px-4 rounded-md hover:bg-secondary-700 transition-colors text-sm">
                        Voir les notes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Mes Élèves</h3>
                <p className="text-sm text-gray-500">La liste détaillée des élèves sera disponible prochainement.</p>
              </div>
              <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600">
                Section en cours d'intégration aux APIs (liste des élèves et performances).
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Devoirs & Évaluations</h3>
                  <p className="text-sm text-gray-500">Gestion des devoirs prochainement disponible.</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Devoir
                </button>
              </div>
              <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600">
                Section en cours d'intégration aux APIs (création et suivi des devoirs).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPospView;
