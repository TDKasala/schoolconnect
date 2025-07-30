import { useState, useEffect, useCallback } from 'react';
import OverviewService, { 
  OverviewData, 
  OverviewStats, 
  Activity, 
  Event, 
  Message, 
  FinancialSummary, 
  ClassPerformance 
} from '../services/overviewService';

export interface UseOverviewReturn {
  overviewData: OverviewData | null;
  stats: OverviewStats | null;
  recentActivities: Activity[];
  upcomingEvents: Event[];
  recentMessages: Message[];
  financialSummary: FinancialSummary | null;
  classPerformance: ClassPerformance[];
  loading: boolean;
  error: string | null;
  fetchOverviewData: () => Promise<void>;
  fetchStats: () => Promise<OverviewStats>;
  fetchRecentActivities: (limit?: number) => Promise<Activity[]>;
  fetchUpcomingEvents: (limit?: number) => Promise<Event[]>;
  fetchRecentMessages: (limit?: number) => Promise<Message[]>;
  fetchFinancialSummary: () => Promise<FinancialSummary>;
  fetchClassPerformance: (limit?: number) => Promise<ClassPerformance[]>;
  refreshOverviewData: () => Promise<OverviewData>;
}

/**
 * Hook for overview functionality
 */
export const useOverview = (userId: string, userRole: string, schoolId?: string): UseOverviewReturn => {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [classPerformance, setClassPerformance] = useState<ClassPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const overviewService = new OverviewService(userId, userRole, schoolId);

  const fetchOverviewData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await overviewService.getOverviewData();
      setOverviewData(data);
      setStats(data.stats);
      setRecentActivities(data.recentActivities);
      setUpcomingEvents(data.upcomingEvents);
      setRecentMessages(data.recentMessages);
      setFinancialSummary(data.financialSummary);
      setClassPerformance(data.classPerformance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch overview data');
    } finally {
      setLoading(false);
    }
  }, [userId, userRole, schoolId]);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const data = await overviewService.getStats();
      setStats(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      throw err;
    }
  }, [userId, userRole, schoolId]);

  const fetchRecentActivities = useCallback(async (limit: number = 10) => {
    try {
      setError(null);
      const data = await overviewService.getRecentActivities(limit);
      setRecentActivities(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent activities');
      throw err;
    }
  }, [userId, userRole, schoolId]);

  const fetchUpcomingEvents = useCallback(async (limit: number = 5) => {
    try {
      setError(null);
      const data = await overviewService.getUpcomingEvents(limit);
      setUpcomingEvents(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming events');
      throw err;
    }
  }, [userId, userRole, schoolId]);

  const fetchRecentMessages = useCallback(async (limit: number = 5) => {
    try {
      setError(null);
      const data = await overviewService.getRecentMessages(limit);
      setRecentMessages(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent messages');
      throw err;
    }
  }, [userId, userRole, schoolId]);

  const fetchFinancialSummary = useCallback(async () => {
    try {
      setError(null);
      const data = await overviewService.getFinancialSummary();
      setFinancialSummary(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial summary');
      throw err;
    }
  }, [userId, userRole, schoolId]);

  const fetchClassPerformance = useCallback(async (limit: number = 5) => {
    try {
      setError(null);
      const data = await overviewService.getClassPerformance(limit);
      setClassPerformance(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class performance');
      throw err;
    }
  }, [userId, userRole, schoolId]);

  const refreshOverviewData = useCallback(async () => {
    try {
      setError(null);
      const data = await overviewService.refreshOverviewData();
      setOverviewData(data);
      setStats(data.stats);
      setRecentActivities(data.recentActivities);
      setUpcomingEvents(data.upcomingEvents);
      setRecentMessages(data.recentMessages);
      setFinancialSummary(data.financialSummary);
      setClassPerformance(data.classPerformance);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh overview data');
      throw err;
    }
  }, [userId, userRole, schoolId]);

  // Fetch initial data
  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  return {
    overviewData,
    stats,
    recentActivities,
    upcomingEvents,
    recentMessages,
    financialSummary,
    classPerformance,
    loading,
    error,
    fetchOverviewData,
    fetchStats,
    fetchRecentActivities,
    fetchUpcomingEvents,
    fetchRecentMessages,
    fetchFinancialSummary,
    fetchClassPerformance,
    refreshOverviewData
  };
};

/**
 * Hook for overview statistics
 */
export const useOverviewStats = (userId: string, userRole: string, schoolId?: string) => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const overviewService = new OverviewService(userId, userRole, schoolId);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await overviewService.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [userId, userRole, schoolId]);

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
 * Hook for recent activities
 */
export const useRecentActivities = (userId: string, userRole: string, schoolId?: string) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overviewService = new OverviewService(userId, userRole, schoolId);

  const fetchActivities = useCallback(async (limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const data = await overviewService.getRecentActivities(limit);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }, [userId, userRole, schoolId]);

  return {
    activities,
    loading,
    error,
    fetchActivities
  };
};

/**
 * Hook for upcoming events
 */
export const useUpcomingEvents = (userId: string, userRole: string, schoolId?: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overviewService = new OverviewService(userId, userRole, schoolId);

  const fetchEvents = useCallback(async (limit: number = 5) => {
    try {
      setLoading(true);
      setError(null);
      const data = await overviewService.getUpcomingEvents(limit);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [userId, userRole, schoolId]);

  return {
    events,
    loading,
    error,
    fetchEvents
  };
};

/**
 * Hook for recent messages
 */
export const useRecentMessages = (userId: string, userRole: string, schoolId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overviewService = new OverviewService(userId, userRole, schoolId);

  const fetchMessages = useCallback(async (limit: number = 5) => {
    try {
      setLoading(true);
      setError(null);
      const data = await overviewService.getRecentMessages(limit);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [userId, userRole, schoolId]);

  return {
    messages,
    loading,
    error,
    fetchMessages
  };
};

/**
 * Hook for financial overview
 */
export const useFinancialOverview = (userId: string, userRole: string, schoolId?: string) => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const overviewService = new OverviewService(userId, userRole, schoolId);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await overviewService.getFinancialSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial summary');
    } finally {
      setLoading(false);
    }
  }, [userId, userRole, schoolId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary
  };
};

/**
 * Hook for class performance overview
 */
export const useClassPerformanceOverview = (userId: string, userRole: string, schoolId?: string) => {
  const [performance, setPerformance] = useState<ClassPerformance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overviewService = new OverviewService(userId, userRole, schoolId);

  const fetchPerformance = useCallback(async (limit: number = 5) => {
    try {
      setLoading(true);
      setError(null);
      const data = await overviewService.getClassPerformance(limit);
      setPerformance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class performance');
    } finally {
      setLoading(false);
    }
  }, [userId, userRole, schoolId]);

  return {
    performance,
    loading,
    error,
    fetchPerformance
  };
};

export default useOverview;
