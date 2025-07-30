import { useState, useEffect, useCallback } from 'react';
import ParentService, {
  ParentStats,
  ChildInfo,
  TeacherMessage,
  PaymentInfo,
  AttendanceRecord,
  Grade
} from '../services/parentService';

export interface UseParentReturn {
  stats: ParentStats | null;
  children: ChildInfo[];
  messages: TeacherMessage[];
  payments: PaymentInfo[];
  loading: boolean;
  error: string | null;
  refetchAll: () => Promise<void>;
  getChildAttendance: (childId: string) => Promise<AttendanceRecord[]>;
  getChildGrades: (childId: string) => Promise<Grade[]>;
  sendMessage: (teacherId: string, content: string) => Promise<void>;
}

/**
 * Hook for parent functionality
 */
export const useParent = (parentId: string): UseParentReturn => {
  const [stats, setStats] = useState<ParentStats | null>(null);
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [messages, setMessages] = useState<TeacherMessage[]>([]);
  const [payments, setPayments] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parentService = new ParentService(parentId);

  const fetchStats = useCallback(async () => {
    try {
      const data = await parentService.getParentStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, [parentId]);

  const fetchChildren = useCallback(async () => {
    try {
      const data = await parentService.getChildren();
      setChildren(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch children');
    }
  }, [parentId]);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await parentService.getTeacherMessages();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    }
  }, [parentId]);

  const fetchPayments = useCallback(async () => {
    try {
      const data = await parentService.getPaymentInfo();
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    }
  }, [parentId]);

  const getChildAttendance = useCallback(async (childId: string) => {
    try {
      setError(null);
      return await parentService.getChildAttendance(childId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance');
      throw err;
    }
  }, [parentId]);

  const getChildGrades = useCallback(async (childId: string) => {
    try {
      setError(null);
      return await parentService.getChildGrades(childId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch grades');
      throw err;
    }
  }, [parentId]);

  const sendMessage = useCallback(async (teacherId: string, content: string) => {
    try {
      setError(null);
      await parentService.sendMessage(teacherId, content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [parentId]);

  const refetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchStats(),
        fetchChildren(),
        fetchMessages(),
        fetchPayments()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchChildren, fetchMessages, fetchPayments]);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  return {
    stats,
    children,
    messages,
    payments,
    loading,
    error,
    refetchAll,
    getChildAttendance,
    getChildGrades,
    sendMessage
  };
};

/**
 * Hook for parent statistics
 */
export const useParentStats = (parentId: string) => {
  const [stats, setStats] = useState<ParentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parentService = new ParentService(parentId);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await parentService.getParentStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [parentId]);

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
 * Hook for parent's children
 */
export const useParentChildren = (parentId: string) => {
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parentService = new ParentService(parentId);

  const fetchChildren = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await parentService.getChildren();
      setChildren(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch children');
    } finally {
      setLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return {
    children,
    loading,
    error,
    refetch: fetchChildren
  };
};

/**
 * Hook for teacher messages
 */
export const useTeacherMessages = (parentId: string) => {
  const [messages, setMessages] = useState<TeacherMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parentService = new ParentService(parentId);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await parentService.getTeacherMessages();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages
  };
};

/**
 * Hook for payment information
 */
export const usePaymentInfo = (parentId: string) => {
  const [payments, setPayments] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parentService = new ParentService(parentId);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await parentService.getPaymentInfo();
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments
  };
};

export default useParent;
