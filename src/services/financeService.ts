import { supabase } from '../lib/supabase';
import { Payment } from '../types';
import logger from '../utils/logger';

export interface FinancialPayment extends Payment {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile_money' | 'card' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  dueDate?: Date;
  paymentDate?: Date;
  description?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  overduePayments: number;
  monthlyRevenue: number;
}

export interface FinancialReport {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  paymentsByMethod: Record<string, number>;
  paymentsByStatus: Record<string, number>;
}

export class FinanceService {
  private userId: string;
  private schoolId: string;

  constructor(userId: string, schoolId: string) {
    this.userId = userId;
    this.schoolId = schoolId;
  }

  /**
   * Get all payments for the school
   */
  async getPayments(limit: number = 100): Promise<FinancialPayment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students!payments_student_id_fkey(
            id,
            first_name,
            last_name,
            class_id
          )
        `)
        .eq('school_id', this.schoolId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(payment => ({
        id: payment.id,
        studentId: payment.student_id,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.payment_method,
        status: payment.status,
        dueDate: payment.due_date ? new Date(payment.due_date) : undefined,
        paymentDate: payment.payment_date ? new Date(payment.payment_date) : undefined,
        description: payment.description,
        receiptUrl: payment.receipt_url,
        createdAt: new Date(payment.created_at),
        updatedAt: new Date(payment.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching payments:', error);
      throw new Error('Failed to fetch payments');
    }
  }

  /**
   * Get payments by status
   */
  async getPaymentsByStatus(status: 'pending' | 'completed' | 'failed' | 'refunded'): Promise<FinancialPayment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students!payments_student_id_fkey(
            id,
            first_name,
            last_name,
            class_id
          )
        `)
        .eq('school_id', this.schoolId)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(payment => ({
        id: payment.id,
        studentId: payment.student_id,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.payment_method,
        status: payment.status,
        dueDate: payment.due_date ? new Date(payment.due_date) : undefined,
        paymentDate: payment.payment_date ? new Date(payment.payment_date) : undefined,
        description: payment.description,
        receiptUrl: payment.receipt_url,
        createdAt: new Date(payment.created_at),
        updatedAt: new Date(payment.updated_at)
      })) || [];
    } catch (error) {
      logger.error(`Error fetching ${status} payments:`, error);
      throw new Error(`Failed to fetch ${status} payments`);
    }
  }

  /**
   * Get overdue payments
   */
  async getOverduePayments(): Promise<FinancialPayment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students!payments_student_id_fkey(
            id,
            first_name,
            last_name,
            class_id
          )
        `)
        .eq('school_id', this.schoolId)
        .eq('status', 'pending')
        .lt('due_date', new Date().toISOString())
        .order('due_date', { ascending: true });

      if (error) throw error;

      return data?.map(payment => ({
        id: payment.id,
        studentId: payment.student_id,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.payment_method,
        status: payment.status,
        dueDate: payment.due_date ? new Date(payment.due_date) : undefined,
        paymentDate: payment.payment_date ? new Date(payment.payment_date) : undefined,
        description: payment.description,
        receiptUrl: payment.receipt_url,
        createdAt: new Date(payment.created_at),
        updatedAt: new Date(payment.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching overdue payments:', error);
      throw new Error('Failed to fetch overdue payments');
    }
  }

  /**
   * Get payments for a specific student
   */
  async getStudentPayments(studentId: string): Promise<FinancialPayment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', studentId)
        .eq('school_id', this.schoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(payment => ({
        id: payment.id,
        studentId: payment.student_id,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.payment_method,
        status: payment.status,
        dueDate: payment.due_date ? new Date(payment.due_date) : undefined,
        paymentDate: payment.payment_date ? new Date(payment.payment_date) : undefined,
        description: payment.description,
        receiptUrl: payment.receipt_url,
        createdAt: new Date(payment.created_at),
        updatedAt: new Date(payment.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching student payments:', error);
      throw new Error('Failed to fetch student payments');
    }
  }

  /**
   * Create a new payment
   */
  async createPayment(paymentData: Omit<FinancialPayment, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancialPayment> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          student_id: paymentData.studentId,
          school_id: this.schoolId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'CDF',
          payment_method: paymentData.paymentMethod,
          status: paymentData.status,
          due_date: paymentData.dueDate?.toISOString(),
          payment_date: paymentData.paymentDate?.toISOString(),
          description: paymentData.description,
          receipt_url: paymentData.receiptUrl
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        studentId: data.student_id,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.payment_method,
        status: data.status,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        paymentDate: data.payment_date ? new Date(data.payment_date) : undefined,
        description: data.description,
        receiptUrl: data.receipt_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
    }
  }

  /**
   * Update a payment
   */
  async updatePayment(paymentId: string, paymentData: Partial<FinancialPayment>): Promise<FinancialPayment> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          amount: paymentData.amount,
          payment_method: paymentData.paymentMethod,
          status: paymentData.status,
          due_date: paymentData.dueDate?.toISOString(),
          payment_date: paymentData.paymentDate?.toISOString(),
          description: paymentData.description,
          receipt_url: paymentData.receiptUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .eq('school_id', this.schoolId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        studentId: data.student_id,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.payment_method,
        status: data.status,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        paymentDate: data.payment_date ? new Date(data.payment_date) : undefined,
        description: data.description,
        receiptUrl: data.receipt_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error updating payment:', error);
      throw new Error('Failed to update payment');
    }
  }

  /**
   * Delete a payment
   */
  async deletePayment(paymentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId)
        .eq('school_id', this.schoolId);

      if (error) throw error;
    } catch (error) {
      logger.error('Error deleting payment:', error);
      throw new Error('Failed to delete payment');
    }
  }

  /**
   * Get financial summary
   */
  async getFinancialSummary(): Promise<FinancialSummary> {
    try {
      // Get all payments for the school
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, status, due_date')
        .eq('school_id', this.schoolId);

      if (paymentsError) throw paymentsError;

      // Calculate totals
      let totalRevenue = 0;
      let pendingPayments = 0;
      let completedPayments = 0;
      let overduePayments = 0;
      let monthlyRevenue = 0;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      payments?.forEach(payment => {
        if (payment.status === 'completed') {
          totalRevenue += payment.amount;
          completedPayments += 1;
          
          // Check if payment was made this month
          if (payment.due_date && new Date(payment.due_date) >= startOfMonth) {
            monthlyRevenue += payment.amount;
          }
        } else if (payment.status === 'pending') {
          pendingPayments += 1;
          
          // Check if payment is overdue
          if (payment.due_date && new Date(payment.due_date) < now) {
            overduePayments += 1;
          }
        }
      });

      return {
        totalRevenue,
        pendingPayments,
        completedPayments,
        overduePayments,
        monthlyRevenue
      };
    } catch (error) {
      logger.error('Error fetching financial summary:', error);
      throw new Error('Failed to fetch financial summary');
    }
  }

  /**
   * Get financial report
   */
  async getFinancialReport(period: 'monthly' | 'quarterly' | 'yearly'): Promise<FinancialReport> {
    try {
      // This is a simplified implementation
      // In a real app, you would have expense tracking as well
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, status, payment_method, created_at')
        .eq('school_id', this.schoolId)
        .eq('status', 'completed');

      if (paymentsError) throw paymentsError;

      // Calculate date range based on period
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case 'monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarterly':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'yearly':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Filter payments by date range
      const filteredPayments = payments?.filter(payment => 
        new Date(payment.created_at) >= startDate
      ) || [];

      // Calculate totals
      const totalIncome = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      // For this simplified version, we'll assume no expenses
      const totalExpenses = 0;
      const netProfit = totalIncome - totalExpenses;

      // Group payments by method and status
      const paymentsByMethod: Record<string, number> = {};
      const paymentsByStatus: Record<string, number> = {};

      filteredPayments.forEach(payment => {
        paymentsByMethod[payment.payment_method] = 
          (paymentsByMethod[payment.payment_method] || 0) + payment.amount;
        paymentsByStatus[payment.status] = 
          (paymentsByStatus[payment.status] || 0) + 1;
      });

      return {
        period,
        totalIncome,
        totalExpenses,
        netProfit,
        paymentsByMethod,
        paymentsByStatus
      };
    } catch (error) {
      logger.error('Error fetching financial report:', error);
      throw new Error('Failed to fetch financial report');
    }
  }

  /**
   * Process a payment
   */
  async processPayment(paymentId: string): Promise<FinancialPayment> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .eq('school_id', this.schoolId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        studentId: data.student_id,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.payment_method,
        status: data.status,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        paymentDate: data.payment_date ? new Date(data.payment_date) : undefined,
        description: data.description,
        receiptUrl: data.receipt_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error processing payment:', error);
      throw new Error('Failed to process payment');
    }
  }
}

export default FinanceService;
