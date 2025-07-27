import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: string, schoolId?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: useEffect triggered');
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        console.log('AuthProvider: checking session');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthProvider: session check result', session);
        if (isMounted) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (isMounted) {
          console.log('AuthProvider: setting loading to false');
          setLoading(false);
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: onAuthStateChange triggered', _event, session);
      if (isMounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          localStorage.setItem('user', JSON.stringify(session.user));
        } else {
          localStorage.removeItem('user');
        }
        // Ensure loading is set to false when auth state changes
        if (loading) {
          console.log('AuthProvider: setting loading to false in onAuthStateChange');
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loading]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string, role: string, schoolId?: string) => {
    try {
      // Pass user metadata through the auth.signup function
      // The trigger will automatically create the user record in public.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            school_id: schoolId
          }
        }
      });

      if (authError) throw authError;

      // The user record in public.users will be created automatically by the trigger
      // No need to manually insert the user profile

      setUser(authData.user);
      localStorage.setItem('user', JSON.stringify(authData.user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
