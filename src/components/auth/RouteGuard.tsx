import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserWithProfile } from '../../contexts/AuthContext';
import Spinner from '../Spinner';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireApproval?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requireAuth = true,
  requireApproval = true,
  allowedRoles = [],
  redirectTo
}) => {
  const { user, loading } = useAuth();
  const typedUser = user as UserWithProfile | null;

  if (import.meta.env.DEV) {
    console.log('RouteGuard: checking access', {
      requireAuth,
      requireApproval,
      allowedRoles,
      user: typedUser?.id,
      loading,
      pathname: 'current route'
    });
  }

  // Show loading spinner while auth is being determined
  if (loading) {
    return <Spinner />;
  }

  // Check authentication requirement
  if (requireAuth && !typedUser) {
    if (import.meta.env.DEV) {
      console.log('RouteGuard: authentication required, redirecting to login');
    }
    return <Navigate to="/connexion" replace />;
  }

  // If user exists but profile not loaded yet, show spinner
  if (requireAuth && typedUser && !typedUser.profile) {
    if (import.meta.env.DEV) {
      console.log('RouteGuard: profile not loaded, showing spinner');
    }
    return <Spinner />;
  }

  // Check approval requirement - only if profile is fully loaded
  if (requireApproval && typedUser?.profile) {
    const approved = typedUser.profile.approved;
    
    // Redirect unapproved users to login with error message
    if (approved !== true) {
      if (import.meta.env.DEV) {
        console.log('RouteGuard: user not approved, redirecting to login', { approved });
      }
      return <Navigate to="/connexion?error=not_approved" replace />;
    }
  }

  // Check role-based access
  if (allowedRoles.length > 0 && typedUser?.profile) {
    const userRole = typedUser.profile.role;
    
    if (!userRole) {
      if (import.meta.env.DEV) {
        console.log('RouteGuard: no role found, redirecting to dashboard');
      }
      return <Navigate to="/dashboard" replace state={{ missingRole: true }} />;
    }
    
    if (!allowedRoles.includes(userRole)) {
      if (import.meta.env.DEV) {
        console.log('RouteGuard: unauthorized role, redirecting', { userRole, allowedRoles });
      }
      return <Navigate to={redirectTo || '/dashboard'} replace state={{ unauthorized: true, userRole }} />;
    }
  }

  if (import.meta.env.DEV) {
    console.log('RouteGuard: access granted');
  }

  return <>{children}</>;
};

export default RouteGuard;
