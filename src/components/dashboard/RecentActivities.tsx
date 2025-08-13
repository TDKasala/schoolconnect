import React from 'react';
import { 
  User, 
  School, 
  UserPlus, 
  UserMinus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  Activity as ActivityIcon
} from 'lucide-react';
import { Activity } from '../../services/overviewService';

interface ActivityLog extends Omit<Activity, 'timestamp'> {
  description: string;
  type: 'user' | 'school' | 'system' | 'payment' | 'auth';
  metadata?: Record<string, any>;
  timestamp: Date;
}

interface RecentActivitiesProps {
  activities: ActivityLog[];
  loading?: boolean;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, loading }) => {
  const getActivityIcon = (activity: ActivityLog) => {
    const iconClass = "h-4 w-4";
    
    switch (activity.action.toLowerCase()) {
      case 'user created':
        return <UserPlus className={`${iconClass} text-green-600`} />;
      case 'user deleted':
        return <UserMinus className={`${iconClass} text-red-600`} />;
      case 'user updated':
        return <Edit className={`${iconClass} text-blue-600`} />;
      case 'school created':
        return <School className={`${iconClass} text-green-600`} />;
      case 'school updated':
        return <Edit className={`${iconClass} text-blue-600`} />;
      case 'school deleted':
        return <Trash2 className={`${iconClass} text-red-600`} />;
      case 'user approved':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'user rejected':
        return <XCircle className={`${iconClass} text-red-600`} />;
      case 'login':
        return <User className={`${iconClass} text-blue-600`} />;
      case 'logout':
        return <User className={`${iconClass} text-gray-600`} />;
      default:
        return <ActivityIcon className={`${iconClass} text-gray-600`} />;
    }
  };

  const getActivityColor = (activity: ActivityLog) => {
    switch (activity.action.toLowerCase()) {
      case 'user created':
      case 'school created':
      case 'user approved':
        return 'border-l-green-500 bg-green-50';
      case 'user deleted':
      case 'school deleted':
      case 'user rejected':
        return 'border-l-red-500 bg-red-50';
      case 'user updated':
      case 'school updated':
      case 'login':
        return 'border-l-blue-500 bg-blue-50';
      case 'logout':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    
    return timestamp.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: timestamp.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getActionLabel = (action: string) => {
    const actionMap: Record<string, string> = {
      'user created': 'Utilisateur créé',
      'user deleted': 'Utilisateur supprimé',
      'user updated': 'Utilisateur modifié',
      'user approved': 'Utilisateur approuvé',
      'user rejected': 'Utilisateur rejeté',
      'school created': 'École créée',
      'school updated': 'École modifiée',
      'school deleted': 'École supprimée',
      'login': 'Connexion',
      'logout': 'Déconnexion',
    };
    
    return actionMap[action.toLowerCase()] || action;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-l-4 border-l-gray-300">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12">
        <ActivityIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Aucune activité récente</p>
        <p className="text-gray-400 text-sm mt-2">Les activités apparaîtront ici une fois que les utilisateurs commenceront à utiliser la plateforme</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-gray-600" />
          Activités Récentes
        </h3>
        <span className="text-sm text-gray-500">
          {activities.length} activité{activities.length > 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start space-x-3 p-4 rounded-lg border-l-4 transition-all hover:shadow-sm ${getActivityColor(activity)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                {getActivityIcon(activity)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {getActionLabel(activity.action)}
                </p>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              
              {activity.userName && (
                <p className="text-xs text-gray-500 mt-1">
                  Par: {activity.userName}
                </p>
              )}
              
              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <span key={key} className="inline-block mr-3">
                      <strong>{key}:</strong> {String(value)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {activities.length > 10 && (
        <div className="text-center pt-4">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Voir toutes les activités
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
