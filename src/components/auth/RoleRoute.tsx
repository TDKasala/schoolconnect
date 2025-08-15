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

  if (loading) return <Spinner />;
  if (!typedUser) return <Navigate to="/connexion" replace />;

  const role = typedUser.profile?.role;
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace state={{ unauthorized: true }} />;
  }

  return <>{children}</>;
};

export default RoleRoute;
