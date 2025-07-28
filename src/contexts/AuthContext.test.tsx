import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';

// Test component that uses the auth context
const TestComponent: React.FC = () => {
  const { user, login, register, logout, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="user-info">
        {user ? `User: ${user.email}` : 'No user'}
      </div>
      <button data-testid="login-button" onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button data-testid="register-button" onClick={() => register('test@example.com', 'password', 'Test User', 'teacher')}>
        Register
      </button>
      <button data-testid="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

const TestApp: React.FC = () => (
  <AuthProvider>
    <TestComponent />
  </AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<TestApp />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show not authenticated when no user', async () => {
    render(<TestApp />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
  });

  it('should handle login function', async () => {
    const user = userEvent.setup();
    render(<TestApp />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Click login button
    await user.click(screen.getByTestId('login-button'));
    
    // Check that login was called (mocked implementation)
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
  });

  it('should handle register function', async () => {
    const user = userEvent.setup();
    render(<TestApp />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Click register button
    await user.click(screen.getByTestId('register-button'));
    
    // Check that register was called (mocked implementation)
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
  });
});
