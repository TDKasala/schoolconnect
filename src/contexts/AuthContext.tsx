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

  const fetchUserProfile = async (authUser: any) => {
    if (!authUser) return null;
    
    try {
      console.log('AuthProvider: fetching user profile for', authUser.id);
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return authUser; // Return auth user if profile fetch fails
      }
      
      console.log('AuthProvider: user profile fetched', profile);
      // Merge auth user with profile data
      return {
        ...authUser,
        ...profile,
        name: profile.full_name || authUser.email,
        role: profile.role
      };
    } catch (error) {
      console.error('Profile fetch error:', error);
      return authUser;
    }
  };

  useEffect(() => {
    console.log('AuthProvider: useEffect triggered');
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        console.log('AuthProvider: checking session');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthProvider: session check result', session);
        
        if (isMounted && session?.user) {
          const userWithProfile = await fetchUserProfile(session.user);
          if (isMounted) {
            setUser(userWithProfile);
          }
        } else if (isMounted) {
          setUser(null);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthProvider: onAuthStateChange triggered', _event, session);
      if (isMounted) {
        if (session?.user) {
          const userWithProfile = await fetchUserProfile(session.user);
          setUser(userWithProfile);
          localStorage.setItem('user', JSON.stringify(userWithProfile));
        } else {
          setUser(null);
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
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Fetch user profile to get role information
      const userWithProfile = await fetchUserProfile(data.user);
      setUser(userWithProfile);
      localStorage.setItem('user', JSON.stringify(userWithProfile));
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

      // Fetch user profile to get role information
      const userWithProfile = await fetchUserProfile(authData.user);
      setUser(userWithProfile);
      localStorage.setItem('user', JSON.stringify(userWithProfile));
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
