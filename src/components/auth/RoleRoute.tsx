import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserWithProfile } from '../../contexts/AuthContext';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const Spinner: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto animate-pulse">
        <span className="text-white font-bold text-xl">SC</span>
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p className="text-gray-600">Checking access...</p>
    </div>
  </div>
);

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const typedUser = user as UserWithProfile | null;

  if (import.meta.env.DEV) {
    console.log('RoleRoute: checking role access', { loading, userId: typedUser?.id, allowedRoles });
  }

  if (loading) {
    if (import.meta.env.DEV) {
      console.log('RoleRoute: loading, showing spinner');
    }
    return <Spinner />;
  }
  if (!typedUser) {
    if (import.meta.env.DEV) {
      console.log('RoleRoute: no user, redirecting to login');
    }
    return <Navigate to="/connexion" replace />;
  }

  const role = typedUser.profile?.role;
  
  // Handle missing or invalid role
  if (!role) {
    if (import.meta.env.DEV) {
      console.log('RoleRoute: no role found, redirecting to dashboard', { profile: typedUser.profile });
    }
    return <Navigate to="/dashboard" replace state={{ missingRole: true }} />;
  }
  
  if (!allowedRoles.includes(role)) {
    if (import.meta.env.DEV) {
      console.log('RoleRoute: unauthorized role, redirecting to dashboard', { role, allowedRoles });
    }
    return <Navigate to="/dashboard" replace state={{ unauthorized: true, userRole: role }} />;
  }

  if (import.meta.env.DEV) {
    console.log('RoleRoute: access granted');
  }
  return <>{children}</>;
};

export default RoleRoute;
