import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugUserInfo: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
        <strong>Debug:</strong> User not authenticated
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50 max-w-md">
      <strong>Debug User Info:</strong>
      <pre className="text-xs mt-2 whitespace-pre-wrap">
        {JSON.stringify({
          id: user?.id,
          email: user?.email,
          name: user?.name,
          full_name: user?.full_name,
          role: user?.role,
          loading: loading,
          isAuthenticated: isAuthenticated
        }, null, 2)}
      </pre>
    </div>
  );
};

export default DebugUserInfo;
