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

interface UserWithProfile extends User {
  profile: any;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (authUser: User | null): Promise<UserWithProfile | null> => {
    if (!authUser) {
      console.log('AuthProvider: fetchUserProfile called with null user');
      return null;
    }
    
    try {
      console.log('AuthProvider: fetching user profile for', authUser.id);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        console.error('Profile fetch error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        console.log('AuthProvider: returning auth user only due to error');
        return authUser as UserWithProfile;
      }

      console.log('AuthProvider: profile data fetched', data);
      const userWithProfile: UserWithProfile = {
        ...authUser,
        profile: data
      };
      console.log('AuthProvider: returning merged user profile', userWithProfile);
      return userWithProfile;
    } catch (error) {
      console.error('Profile fetch exception:', error);
      console.error('Profile fetch exception details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      console.log('AuthProvider: returning auth user only due to exception');
      return authUser as UserWithProfile;
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
          console.log('AuthProvider: session user found, fetching profile');
          const userWithProfile = await fetchUserProfile(session.user);
          console.log('AuthProvider: profile fetch complete, setting user');
          if (isMounted) {
            setUser(userWithProfile);
          }
        } else if (isMounted) {
          console.log('AuthProvider: no session user found, setting user to null');
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        console.error('Session check error details:', {
          name: (error as Error).name,
          message: (error as Error).message,
          stack: (error as Error).stack
        });
        console.log('AuthProvider: error in session check, setting user to null');
        if (isMounted) {
          setUser(null);
        }
      } finally {
        console.log('AuthProvider: finally block, setting loading to false');
        if (isMounted) {
          console.log('AuthProvider: component is mounted, setting loading to false');
          setLoading(false);
        } else {
          console.log('AuthProvider: component is unmounted, not setting loading');
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthProvider: onAuthStateChange triggered', _event, session);
      if (isMounted) {
        if (session?.user) {
          console.log('AuthProvider: onAuthStateChange user found, fetching profile');
          const userWithProfile = await fetchUserProfile(session.user);
          console.log('AuthProvider: onAuthStateChange profile fetch complete, setting user');
          setUser(userWithProfile);
          localStorage.setItem('user', JSON.stringify(userWithProfile));
        } else {
          console.log('AuthProvider: onAuthStateChange no user, setting user to null');
          setUser(null);
          localStorage.removeItem('user');
        }
        // Ensure loading is set to false when auth state changes
        if (loading) {
          console.log('AuthProvider: onAuthStateChange setting loading to false');
          setLoading(false);
        }
      } else {
        console.log('AuthProvider: onAuthStateChange component is unmounted');
      }
    });

    return () => {
      console.log('AuthProvider: cleanup function called');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: attempting login for', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login auth error:', error);
        throw error;
      }
      
      console.log('AuthProvider: login successful, fetching profile');
      // Fetch user profile to get role information
      const userWithProfile = await fetchUserProfile(data.user);
      console.log('AuthProvider: profile fetch complete, setting user');
      setUser(userWithProfile);
      localStorage.setItem('user', JSON.stringify(userWithProfile));
      console.log('AuthProvider: user set and stored in localStorage');
    } catch (error) {
      console.error('Login error:', error);
      console.error('Login error details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string, role: string, schoolId?: string) => {
    try {
      console.log('AuthProvider: attempting registration for', email);
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

      if (authError) {
        console.error('Registration auth error:', authError);
        throw authError;
      }

      console.log('AuthProvider: registration successful, user data:', authData.user);
      // The user record in public.users will be created automatically by the trigger
      // No need to manually insert the user profile

      // Fetch user profile to get role information
      console.log('AuthProvider: fetching profile for newly registered user');
      const userWithProfile = await fetchUserProfile(authData.user);
      console.log('AuthProvider: profile fetch complete, setting user');
      setUser(userWithProfile);
      localStorage.setItem('user', JSON.stringify(userWithProfile));
      console.log('AuthProvider: user set and stored in localStorage');
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Registration error details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack
      });
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
