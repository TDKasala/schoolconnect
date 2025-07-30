import { useState, useEffect, useCallback } from 'react';
import FinanceService, { FinancialPayment, FinancialSummary, FinancialReport } from '../services/financeService';

export interface UseFinanceReturn {
  payments: FinancialPayment[];
  summary: FinancialSummary | null;
  report: FinancialReport | null;
  loading: boolean;
  error: string | null;
  fetchPayments: (limit?: number) => Promise<void>;
  fetchPaymentsByStatus: (status: 'pending' | 'completed' | 'failed' | 'refunded') => Promise<void>;
  fetchOverduePayments: () => Promise<void>;
  fetchStudentPayments: (studentId: string) => Promise<void>;
  createPayment: (paymentData: Omit<FinancialPayment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FinancialPayment>;
  updatePayment: (paymentId: string, paymentData: Partial<FinancialPayment>) => Promise<FinancialPayment>;
  deletePayment: (paymentId: string) => Promise<void>;
  fetchFinancialSummary: () => Promise<void>;
  fetchFinancialReport: (period: 'monthly' | 'quarterly' | 'yearly') => Promise<void>;
  processPayment: (paymentId: string) => Promise<FinancialPayment>;
}

/**
 * Hook for finance functionality
 */
export const useFinance = (userId: string, schoolId: string): UseFinanceReturn => {
  const [payments, setPayments] = useState<FinancialPayment[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const financeService = new FinanceService(userId, schoolId);

  const fetchPayments = useCallback(async (limit: number = 100) => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getPayments(limit);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchPaymentsByStatus = useCallback(async (status: 'pending' | 'completed' | 'failed' | 'refunded') => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getPaymentsByStatus(status);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${status} payments`);
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchOverduePayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getOverduePayments();
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch overdue payments');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchStudentPayments = useCallback(async (studentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getStudentPayments(studentId);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student payments');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const createPayment = useCallback(async (paymentData: Omit<FinancialPayment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newPayment = await financeService.createPayment(paymentData);
      setPayments(prev => [newPayment, ...prev]);
      return newPayment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
      throw err;
    }
  }, [userId, schoolId]);

  const updatePayment = useCallback(async (paymentId: string, paymentData: Partial<FinancialPayment>) => {
    try {
      setError(null);
      const updatedPayment = await financeService.updatePayment(paymentId, paymentData);
      setPayments(prev => prev.map(payment => payment.id === paymentId ? updatedPayment : payment));
      return updatedPayment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment');
      throw err;
    }
  }, [userId, schoolId]);

  const deletePayment = useCallback(async (paymentId: string) => {
    try {
      setError(null);
      await financeService.deletePayment(paymentId);
      setPayments(prev => prev.filter(payment => payment.id !== paymentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete payment');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchFinancialSummary = useCallback(async () => {
    try {
      setError(null);
      const data = await financeService.getFinancialSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial summary');
    }
  }, [userId, schoolId]);

  const fetchFinancialReport = useCallback(async (period: 'monthly' | 'quarterly' | 'yearly') => {
    try {
      setError(null);
      const data = await financeService.getFinancialReport(period);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial report');
    }
  }, [userId, schoolId]);

  const processPayment = useCallback(async (paymentId: string) => {
    try {
      setError(null);
      const updatedPayment = await financeService.processPayment(paymentId);
      setPayments(prev => prev.map(payment => payment.id === paymentId ? updatedPayment : payment));
      return updatedPayment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      throw err;
    }
  }, [userId, schoolId]);

  // Fetch initial data
  useEffect(() => {
    fetchPayments();
    fetchFinancialSummary();
  }, [fetchPayments, fetchFinancialSummary]);

  return {
    payments,
    summary,
    report,
    loading,
    error,
    fetchPayments,
    fetchPaymentsByStatus,
    fetchOverduePayments,
    fetchStudentPayments,
    createPayment,
    updatePayment,
    deletePayment,
    fetchFinancialSummary,
    fetchFinancialReport,
    processPayment
  };
};

/**
 * Hook for financial payments
 */
export const useFinancialPayments = (userId: string, schoolId: string) => {
  const [payments, setPayments] = useState<FinancialPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const financeService = new FinanceService(userId, schoolId);

  const fetchPayments = useCallback(async (limit: number = 100) => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getPayments(limit);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchPaymentsByStatus = useCallback(async (status: 'pending' | 'completed' | 'failed' | 'refunded') => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getPaymentsByStatus(status);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${status} payments`);
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchOverduePayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getOverduePayments();
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch overdue payments');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchStudentPayments = useCallback(async (studentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getStudentPayments(studentId);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student payments');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const createPayment = useCallback(async (paymentData: Omit<FinancialPayment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newPayment = await financeService.createPayment(paymentData);
      setPayments(prev => [newPayment, ...prev]);
      return newPayment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
      throw err;
    }
  }, [userId, schoolId]);

  const updatePayment = useCallback(async (paymentId: string, paymentData: Partial<FinancialPayment>) => {
    try {
      setError(null);
      const updatedPayment = await financeService.updatePayment(paymentId, paymentData);
      setPayments(prev => prev.map(payment => payment.id === paymentId ? updatedPayment : payment));
      return updatedPayment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment');
      throw err;
    }
  }, [userId, schoolId]);

  const deletePayment = useCallback(async (paymentId: string) => {
    try {
      setError(null);
      await financeService.deletePayment(paymentId);
      setPayments(prev => prev.filter(payment => payment.id !== paymentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete payment');
      throw err;
    }
  }, [userId, schoolId]);

  const processPayment = useCallback(async (paymentId: string) => {
    try {
      setError(null);
      const updatedPayment = await financeService.processPayment(paymentId);
      setPayments(prev => prev.map(payment => payment.id === paymentId ? updatedPayment : payment));
      return updatedPayment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      throw err;
    }
  }, [userId, schoolId]);

  return {
    payments,
    loading,
    error,
    fetchPayments,
    fetchPaymentsByStatus,
    fetchOverduePayments,
    fetchStudentPayments,
    createPayment,
    updatePayment,
    deletePayment,
    processPayment
  };
};

/**
 * Hook for financial summary
 */
export const useFinancialSummary = (userId: string, schoolId: string) => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const financeService = new FinanceService(userId, schoolId);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getFinancialSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

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
 * Hook for financial reports
 */
export const useFinancialReport = (userId: string, schoolId: string) => {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const financeService = new FinanceService(userId, schoolId);

  const fetchReport = useCallback(async (period: 'monthly' | 'quarterly' | 'yearly') => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getFinancialReport(period);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  return {
    report,
    loading,
    error,
    fetchReport
  };
};

export default useFinance;
