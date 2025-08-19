import React, { Suspense } from 'react';
import { useAuth, UserWithProfile } from '../../contexts/AuthContext';
import SchoolAdminDashboard from '../../components/dashboard/SchoolAdminDashboard';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
import PlatformAdminDashboard from '../../components/dashboard/PlatformAdminDashboard';
import ParentDashboard from '../../components/dashboard/ParentDashboard';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { AlertTriangle } from 'lucide-react';
import useAuthDebug from '../../hooks/useAuthDebug';

const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const { logAuthState } = useAuthDebug('DashboardPage');

  // Show loading skeleton while auth is loading
  if (loading) {
    console.log('DashboardPage: Auth loading, showing skeleton');
    logAuthState();
    return <DashboardSkeleton variant="admin" />;
  }

  // If no user after loading completes, show error state
  if (!typedUser) {
    console.log('DashboardPage: No user found after auth loading completed');
    logAuthState();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">Erreur d'authentification</h2>
          <p className="text-gray-600 max-w-md">
            Impossible de charger vos informations utilisateur. Veuillez vous reconnecter.
          </p>
          <button
            onClick={() => window.location.href = '/connexion'}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Se reconnecter
          </button>
        </div>
      </div>
    );
  }

  // If user exists but no profile, show error state
  if (!typedUser.profile) {
    console.log('DashboardPage: User found but no profile loaded');
    logAuthState();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Profil incomplet</h2>
          <p className="text-gray-600 max-w-md">
            Votre profil utilisateur n'a pas pu être chargé. Contactez l'administrateur.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }

  // APPROVAL CHECK COMPLETELY REMOVED - PrivateRoute is single source of truth
  // This eliminates the flickering caused by double-checking approval status

  const renderDashboardContent = () => {
    const role = typedUser?.profile?.role;
    
    // Wrap each dashboard component in Suspense to prevent flicker
    switch (role) {
      case 'platform_admin':
        return (
          <Suspense fallback={<DashboardSkeleton variant="admin" />}>
            <PlatformAdminDashboard />
          </Suspense>
        );
      case 'school_admin':
        return (
          <Suspense fallback={<DashboardSkeleton variant="admin" />}>
            <SchoolAdminDashboard />
          </Suspense>
        );
      case 'teacher':
        return (
          <Suspense fallback={<DashboardSkeleton variant="teacher" />}>
            <TeacherDashboard />
          </Suspense>
        );
      case 'parent':
        return (
          <Suspense fallback={<DashboardSkeleton variant="parent" />}>
            <ParentDashboard />
          </Suspense>
        );
      default:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tableau de bord en développement
              </h2>
              <p className="text-gray-600">
                Votre tableau de bord pour le rôle {role || 'inconnu'} sera bientôt disponible.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default DashboardPage;
