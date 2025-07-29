import React from 'react';
import { useAuth, UserWithProfile } from '../../contexts/AuthContext';
import AdminPospView from '../../components/dashboard/AdminPospView';
import TeacherPospView from '../../components/dashboard/TeacherPospView';

const PospSection: React.FC = () => {
  const { user } = useAuth();
  const typedUser = user as UserWithProfile | null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Module Pédagogie</h1>
        <p className="mt-2 text-gray-600">
          Gestion des classes, notes et évaluations
        </p>
      </div>

      {typedUser?.profile?.role === 'school_admin' ? (
        <AdminPospView />
      ) : typedUser?.profile?.role === 'teacher' ? (
        <TeacherPospView />
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">
            Accès non autorisé à ce module pour votre rôle.
          </p>
        </div>
      )}
    </div>
  );
};



export default PospSection;
