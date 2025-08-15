import React from 'react';
import { User, MessageSquare, Calendar } from 'lucide-react';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { useOverview } from '../../hooks/useOverview';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const schoolId = typedUser?.profile?.school_id as string | undefined;
  const userId = typedUser?.id ?? '';
  const role = typedUser?.profile?.role ?? 'parent';

  const { stats, recentMessages, upcomingEvents, loading, error } = useOverview(userId, role, schoolId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portail Parent</h1>
        <p className="mt-2 text-gray-600">Suivez les progrès de votre enfant</p>
      </div>

      {/* Stats (live, minimal) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-primary-500 rounded-lg p-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enfants</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : stats?.totalStudents ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-secondary-500 rounded-lg p-3">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Messages récents</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : recentMessages.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-primary-600 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Évènements à venir</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : upcomingEvents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Section (live) */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages des Enseignants</h2>
          </div>
        </div>
        <div className="p-6">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading && <p className="text-sm text-gray-500">Chargement…</p>}
          {!loading && recentMessages.length === 0 && (
            <p className="text-sm text-gray-500">Aucun message récent</p>
          )}
          <div className="space-y-4">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="border-l-4 border-secondary-500 bg-secondary-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{msg.senderName || 'Enseignant'}</h3>
                  <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString('fr-FR')}</span>
                </div>
                <p className="text-sm text-gray-700">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events (live) */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Évènements à venir</h2>
        </div>
        <div className="p-6">
          {loading && <p className="text-sm text-gray-500">Chargement…</p>}
          {!loading && upcomingEvents.length === 0 && (
            <p className="text-sm text-gray-500">Aucun évènement trouvé</p>
          )}
          <div className="space-y-3">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{ev.title}</p>
                  <p className="text-xs text-gray-500">{new Date(ev.startDate).toLocaleString('fr-FR')}</p>
                </div>
                <Calendar className="h-5 w-5 text-primary-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
