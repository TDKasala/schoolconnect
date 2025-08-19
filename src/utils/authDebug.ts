// Authentication Debug Utilities
// Centralized debugging for auth flow issues

export interface AuthDebugInfo {
  user: any;
  profile: any;
  loading: boolean;
  approved: boolean | undefined;
  role: string | undefined;
  timestamp: string;
}

export const logAuthFlow = (context: string, data: AuthDebugInfo) => {
  if (!import.meta.env.DEV) return;
  
  console.group(`[AUTH DEBUG] ${context} - ${data.timestamp}`);
  console.log('User:', data.user?.id || 'null');
  console.log('Profile:', data.profile ? 'loaded' : 'null/undefined');
  console.log('Loading:', data.loading);
  console.log('Approved:', data.approved);
  console.log('Role:', data.role);
  console.log('Full Profile:', data.profile);
  console.groupEnd();
};

export const createAuthDebugInfo = (user: any, loading: boolean): AuthDebugInfo => {
  const profile = user?.profile;
  return {
    user,
    profile,
    loading,
    approved: profile?.approved,
    role: profile?.role,
    timestamp: new Date().toISOString()
  };
};

export const validateAuthState = (user: any, context: string): boolean => {
  const debugInfo = createAuthDebugInfo(user, false);
  logAuthFlow(`VALIDATION - ${context}`, debugInfo);
  
  // Check for common auth issues
  if (user && !user.profile) {
    console.warn(`[AUTH WARNING] ${context}: User exists but profile is missing`);
    return false;
  }
  
  if (user?.profile && typeof user.profile.approved !== 'boolean') {
    console.warn(`[AUTH WARNING] ${context}: Profile exists but approval status is not boolean`);
    return false;
  }
  
  return true;
};
