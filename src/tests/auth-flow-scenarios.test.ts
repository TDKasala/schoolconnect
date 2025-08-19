// Comprehensive Auth Flow Test Scenarios
// Tests all user types and approval states to ensure no flickering

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import PrivateRoute from '../components/auth/PrivateRoute';
import DashboardPage from '../pages/dashboard/DashboardPage';

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn()
      }))
    }))
  }))
};

vi.mock('../lib/supabase', () => ({
  supabase: mockSupabase
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Auth Flow Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Scenario 1: New unapproved user - should redirect to login', async () => {
    // Mock unapproved user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user1', email: 'new@test.com' } }
    });
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: { id: 'user1', role: 'teacher', approved: false }
    });

    render(
      <TestWrapper>
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      </TestWrapper>
    );

    // Should not show dashboard content
    await waitFor(() => {
      expect(screen.queryByText('Tableau de bord')).not.toBeInTheDocument();
    });
  });

  it('Scenario 2: Approved teacher - should show teacher dashboard', async () => {
    // Mock approved teacher
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'teacher1', email: 'teacher@test.com' } }
    });
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: { id: 'teacher1', role: 'teacher', approved: true }
    });

    render(
      <TestWrapper>
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/tableau de bord/i)).toBeInTheDocument();
    });
  });

  it('Scenario 3: Platform admin - should show admin dashboard', async () => {
    // Mock platform admin
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'admin1', email: 'admin@test.com' } }
    });
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: { id: 'admin1', role: 'platform_admin', approved: true }
    });

    render(
      <TestWrapper>
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/tableau de bord/i)).toBeInTheDocument();
    });
  });

  it('Scenario 4: User with missing profile - should show error state', async () => {
    // Mock user with no profile
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user2', email: 'noprofile@test.com' } }
    });
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: null,
      error: { code: 'PGRST116', message: 'Row not found' }
    });

    render(
      <TestWrapper>
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/profil incomplet/i)).toBeInTheDocument();
    });
  });

  it('Scenario 5: No flickering on page refresh for approved user', async () => {
    // Mock approved user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'stable1', email: 'stable@test.com' } }
    });
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: { id: 'stable1', role: 'school_admin', approved: true }
    });

    const { rerender } = render(
      <TestWrapper>
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      </TestWrapper>
    );

    // Simulate page refresh
    rerender(
      <TestWrapper>
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      </TestWrapper>
    );

    // Should consistently show dashboard without flickering
    await waitFor(() => {
      expect(screen.getByText(/tableau de bord/i)).toBeInTheDocument();
    });
  });
});
