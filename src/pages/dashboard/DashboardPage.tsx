import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SchoolAdminDashboard from '../../components/dashboard/SchoolAdminDashboard';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
import PlatformAdminDashboard from '../../components/dashboard/PlatformAdminDashboard';
import ParentDashboard from '../../components/dashboard/ParentDashboard';
import PendingAccountMessage from '../../components/dashboard/PendingAccountMessage';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Show pending message for users awaiting activation
  if (user.role === 'pending') {
    return <PendingAccountMessage />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'platform_admin':
        return <PlatformAdminDashboard />;
      case 'school_admin':
        return <SchoolAdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tableau de bord en développement
              </h2>
              <p className="text-gray-600">
                Votre tableau de bord pour le rôle {user?.role} sera bientôt disponible.
              </p>
            </div>
          </div>
        );
    }
  };

  return renderDashboard();
};

export default DashboardPage;
