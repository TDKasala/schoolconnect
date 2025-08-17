import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const Spinner: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto animate-pulse">
        <span className="text-white font-bold text-xl">SC</span>
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p className="text-gray-600">Vérification de votre session...</p>
    </div>
  </div>
);

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (import.meta.env.DEV) {
    console.log('PrivateRoute: checking auth state', { user, loading });
  }

  if (loading) {
    if (import.meta.env.DEV) {
      console.log('PrivateRoute: showing spinner');
    }
    return <Spinner />;
  }

  if (!user) {
    if (import.meta.env.DEV) {
      console.log('PrivateRoute: redirecting to login');
    }
    return <Navigate to="/connexion" replace />;
  }

  // Gate: if user profile exists and is not approved, redirect to Pending Approval
  const approved = (user as any)?.profile?.approved;
  const onPendingPage = location.pathname === '/en-attente-approbation';
  if (approved === false && !onPendingPage) {
    return <Navigate to="/en-attente-approbation" replace />;
  }

  if (import.meta.env.DEV) {
    console.log('PrivateRoute: allowing access');
  }
  return <>{children}</>;
};

export default PrivateRoute;
