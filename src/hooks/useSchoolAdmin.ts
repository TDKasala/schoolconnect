import { useState, useEffect, useCallback } from 'react';
import SchoolAdminService, {
  SchoolStats,
  PendingUser,
  RecentActivity
} from '../services/schoolAdminService';

export interface UseSchoolAdminReturn {
  stats: SchoolStats | null;
  pendingUsers: PendingUser[];
  activities: RecentActivity[];
  loading: boolean;
  error: string | null;
  refetchAll: () => Promise<void>;
  handleUserRequest: (userId: string, action: 'approve' | 'reject') => Promise<void>;
  sendInvitation: (email: string, role: 'teacher' | 'parent') => Promise<void>;
}

/**
 * Hook for school admin functionality
 */
export const useSchoolAdmin = (schoolId: string): UseSchoolAdminReturn => {
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const schoolAdminService = new SchoolAdminService(schoolId);

  const fetchStats = useCallback(async () => {
    try {
      const data = await schoolAdminService.getSchoolStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, [schoolId]);

  const fetchPendingUsers = useCallback(async () => {
    try {
      const data = await schoolAdminService.getPendingUsers();
      setPendingUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pending users');
    }
  }, [schoolId]);

  const fetchActivities = useCallback(async () => {
    try {
      const data = await schoolAdminService.getRecentActivities();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    }
  }, [schoolId]);

  const handleUserRequest = useCallback(async (userId: string, action: 'approve' | 'reject') => {
    try {
      setError(null);
      await schoolAdminService.handleUserRequest(userId, action);
      await fetchPendingUsers(); // Refresh pending users
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} user`);
      throw err;
    }
  }, [schoolId, fetchPendingUsers]);

  const sendInvitation = useCallback(async (email: string, role: 'teacher' | 'parent') => {
    try {
      setError(null);
      await schoolAdminService.sendInvitation(email, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
      throw err;
    }
  }, [schoolId]);

  const refetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchStats(),
        fetchPendingUsers(),
        fetchActivities()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchPendingUsers, fetchActivities]);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  return {
    stats,
    pendingUsers,
    activities,
    loading,
    error,
    refetchAll,
    handleUserRequest,
    sendInvitation
  };
};

/**
 * Hook for school statistics
 */
export const useSchoolStats = (schoolId: string) => {
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const schoolAdminService = new SchoolAdminService(schoolId);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schoolAdminService.getSchoolStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

/**
 * Hook for pending users
 */
export const usePendingUsers = (schoolId: string) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const schoolAdminService = new SchoolAdminService(schoolId);

  const fetchPendingUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schoolAdminService.getPendingUsers();
      setPendingUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  const handleUserRequest = useCallback(async (userId: string, action: 'approve' | 'reject') => {
    try {
      setError(null);
      await schoolAdminService.handleUserRequest(userId, action);
      await fetchPendingUsers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} user`);
      throw err;
    }
  }, [schoolId, fetchPendingUsers]);

  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  return {
    pendingUsers,
    loading,
    error,
    refetch: fetchPendingUsers,
    handleUserRequest
  };
};

/**
 * Hook for recent activities
 */
export const useRecentActivities = (schoolId: string, limit: number = 10) => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const schoolAdminService = new SchoolAdminService(schoolId);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schoolAdminService.getRecentActivities(limit);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }, [schoolId, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
};

export default useSchoolAdmin;
