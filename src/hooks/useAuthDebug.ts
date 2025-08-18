import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Debug hook to monitor auth state changes and detect loading issues
 */
export const useAuthDebug = (componentName: string) => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    const debugInfo = {
      component: componentName,
      timestamp: new Date().toISOString(),
      loading,
      hasUser: !!user,
      hasProfile: !!(user as any)?.profile,
      profileApproved: (user as any)?.profile?.approved,
      userRole: (user as any)?.profile?.role,
    };
    
    console.log(`[AUTH DEBUG] ${componentName}:`, debugInfo);
    
    // Detect potential infinite loading scenarios
    if (loading) {
      const timeoutId = setTimeout(() => {
        console.warn(`[AUTH DEBUG] ${componentName}: Loading state persisted for >10s, potential infinite loading`, debugInfo);
      }, 10000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [componentName, user, loading]);
  
  // Return debug utilities
  return {
    logAuthState: () => {
      console.log(`[AUTH DEBUG] ${componentName} - Current State:`, {
        loading,
        hasUser: !!user,
        hasProfile: !!(user as any)?.profile,
        profileData: (user as any)?.profile,
      });
    }
  };
};

export default useAuthDebug;
