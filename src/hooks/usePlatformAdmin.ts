import { useState, useEffect, useCallback } from 'react';
import PlatformAdminService, {
  PlatformStats,
  SchoolWithStats,
  UserWithSchool,
  ActivityLog,
  SystemAnalytics
} from '../services/platformAdminService';

export interface UsePlatformStatsReturn {
  stats: PlatformStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseSchoolsReturn {
  schools: SchoolWithStats[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchSchools: (query: string) => Promise<void>;
  createSchool: (schoolData: any) => Promise<void>;
  updateSchool: (schoolId: string, updates: any) => Promise<void>;
  deleteSchool: (schoolId: string) => Promise<void>;
}

export interface UseUsersReturn {
  users: UserWithSchool[];
  pendingUsers: UserWithSchool[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => Promise<void>;
}

export interface UseActivityLogsReturn {
  logs: ActivityLog[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseAnalyticsReturn {
  analytics: SystemAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  exportData: (dataType: 'schools' | 'users' | 'analytics') => Promise<void>;
}

/**
 * Hook for managing platform statistics
 */
export const usePlatformStats = (): UsePlatformStatsReturn => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PlatformAdminService.getPlatformStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

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
 * Hook for managing schools
 */
export const useSchools = (): UseSchoolsReturn => {
  const [schools, setSchools] = useState<SchoolWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PlatformAdminService.getSchoolsWithStats();
      setSchools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchSchools = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await PlatformAdminService.searchSchools(query);
      setSchools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search schools');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSchool = useCallback(async (schoolData: any) => {
    try {
      setError(null);
      await PlatformAdminService.createSchool(schoolData);
      await fetchSchools(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create school');
      throw err;
    }
  }, [fetchSchools]);

  const updateSchool = useCallback(async (schoolId: string, updates: any) => {
    try {
      setError(null);
      await PlatformAdminService.updateSchool(schoolId, updates);
      await fetchSchools(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update school');
      throw err;
    }
  }, [fetchSchools]);

  const deleteSchool = useCallback(async (schoolId: string) => {
    try {
      setError(null);
      await PlatformAdminService.deleteSchool(schoolId);
      await fetchSchools(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete school');
      throw err;
    }
  }, [fetchSchools]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  return {
    schools,
    loading,
    error,
    refetch: fetchSchools,
    searchSchools,
    createSchool,
    updateSchool,
    deleteSchool
  };
};

/**
 * Hook for managing users
 */
export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<UserWithSchool[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserWithSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [allUsers, pending] = await Promise.all([
        PlatformAdminService.getUsersWithSchool(),
        PlatformAdminService.getPendingUsers()
      ]);
      setUsers(allUsers);
      setPendingUsers(pending);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: 'active' | 'suspended') => {
    try {
      setError(null);
      await PlatformAdminService.updateUserStatus(userId, status);
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      throw err;
    }
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    pendingUsers,
    loading,
    error,
    refetch: fetchUsers,
    updateUserStatus
  };
};

/**
 * Hook for managing activity logs
 */
export const useActivityLogs = (limit: number = 20): UseActivityLogsReturn => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PlatformAdminService.getActivityLogs(limit);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs
  };
};

/**
 * Hook for managing analytics
 */
export const useAnalytics = (): UseAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PlatformAdminService.getSystemAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportData = useCallback(async (dataType: 'schools' | 'users' | 'analytics') => {
    try {
      setError(null);
      const blob = await PlatformAdminService.exportData(dataType);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${dataType}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
    exportData
  };
};

/**
 * Combined hook for all platform admin functionality
 */
export const usePlatformAdmin = () => {
  const stats = usePlatformStats();
  const schools = useSchools();
  const users = useUsers();
  const activityLogs = useActivityLogs();
  const analytics = useAnalytics();

  const isLoading = stats.loading || schools.loading || users.loading || activityLogs.loading || analytics.loading;
  const hasError = stats.error || schools.error || users.error || activityLogs.error || analytics.error;

  const refetchAll = useCallback(async () => {
    await Promise.all([
      stats.refetch(),
      schools.refetch(),
      users.refetch(),
      activityLogs.refetch(),
      analytics.refetch()
    ]);
  }, [stats.refetch, schools.refetch, users.refetch, activityLogs.refetch, analytics.refetch]);

  return {
    stats: stats.stats,
    schools: schools.schools,
    users: users.users,
    pendingUsers: users.pendingUsers,
    activityLogs: activityLogs.logs,
    analytics: analytics.analytics,
    loading: isLoading,
    error: hasError,
    actions: {
      refetchAll,
      // School actions
      searchSchools: schools.searchSchools,
      createSchool: schools.createSchool,
      updateSchool: schools.updateSchool,
      deleteSchool: schools.deleteSchool,
      // User actions
      updateUserStatus: users.updateUserStatus,
      // Analytics actions
      exportData: analytics.exportData
    }
  };
};

export default usePlatformAdmin;
