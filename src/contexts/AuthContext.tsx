import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, hasSupabase, supabaseInitError } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import logger from '../utils/logger';

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

export interface UserWithProfile extends User {
  profile?: Profile;
}

// Profile stored in public.users table
export interface Profile {
  id: string;
  full_name: string;
  role: 'platform_admin' | 'school_admin' | 'teacher' | 'parent';
  school_id?: string | null;
  approved?: boolean;
  created_at: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Hydrate from localStorage to prevent blank flashes on initial paint
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [profileFetchInProgress, setProfileFetchInProgress] = useState(false);

  const fetchUserProfile = async (authUser: User | null, force = false): Promise<UserWithProfile | null> => {
    if (!authUser) {
      logger.log('AuthProvider: fetchUserProfile called with null user');
      return null;
    }
    
    // Prevent concurrent profile fetches unless forced
    if (profileFetchInProgress && !force) {
      logger.log('AuthProvider: profile fetch already in progress, skipping');
      return user as UserWithProfile;
    }
    
    try {
      setProfileFetchInProgress(true);
      logger.log('AuthProvider: fetching user profile for', authUser.id);
      
      // Add a timeout to prevent indefinite hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout after 5 seconds')), 5000)
      );
      
      const supabasePromise = supabase
        .from('users')
        .select('id, full_name, role, school_id, created_at, approved')
        .eq('id', authUser.id)
        .single();
      
      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;

      if (error) {
        logger.error('Profile fetch error:', error);
        logger.error('Profile fetch error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        logger.log('AuthProvider: returning auth user only due to error');
        return authUser as UserWithProfile;
      }

      logger.log('AuthProvider: profile data fetched', data);
      const userWithProfile: UserWithProfile = {
        ...authUser,
        profile: data as Profile
      };
      logger.log('AuthProvider: returning merged user profile', userWithProfile);
      return userWithProfile;
    } catch (error) {
      logger.error('Profile fetch exception:', error);
      logger.error('Profile fetch exception details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      logger.log('AuthProvider: returning auth user only due to exception');
      return authUser as UserWithProfile;
    } finally {
      setProfileFetchInProgress(false);
    }
  };

  useEffect(() => {
    logger.log('AuthProvider: useEffect triggered');
    let isMounted = true;
    
    const checkUser = async () => {
      if (!hasSupabase) {
        logger.error('AuthProvider: Supabase not initialized', supabaseInitError);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }
      try {
        logger.log('AuthProvider: checking session');
        const { data: { session } } = await supabase.auth.getSession();
        logger.log('AuthProvider: session check result', session);
        
        if (isMounted && session?.user) {
          logger.log('AuthProvider: session user found, fetching profile');
          const userWithProfile = await fetchUserProfile(session.user);
          logger.log('AuthProvider: profile fetch complete, setting user');
          if (isMounted && userWithProfile) {
            // Avoid redundant state updates if nothing changed
            const prev = user as UserWithProfile | null;
            const profileChanged = !prev || prev.id !== userWithProfile.id ||
              JSON.stringify(prev.profile) !== JSON.stringify(userWithProfile.profile);
            
            if (profileChanged) {
              setUser(userWithProfile);
              localStorage.setItem('user', JSON.stringify(userWithProfile));
              logger.log('AuthProvider: user state updated');
            } else {
              logger.log('AuthProvider: user profile unchanged, skipping update');
            }
          }
        } else if (isMounted) {
          logger.log('AuthProvider: no session user found, setting user to null');
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        logger.error('Session check error:', error);
        logger.error('Session check error details:', {
          name: (error as Error).name,
          message: (error as Error).message,
          stack: (error as Error).stack
        });
        logger.log('AuthProvider: error in session check, setting user to null');
        if (isMounted) {
          setUser(null);
          localStorage.removeItem('user');
        }
      } finally {
        // Ensure loading is always set to false after checkUser completes
        if (isMounted) {
          logger.log('AuthProvider: checkUser complete, setting loading to false');
          setLoading(false);
        }
      }
    };

    // Run async without blocking initial paint which already has hydrated user
    checkUser();

    if (!hasSupabase) {
      return () => {
        logger.log('AuthProvider: cleanup without Supabase');
        isMounted = false;
        if (loading) setLoading(false);
      };
    }

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      logger.log('AuthProvider: onAuthStateChange triggered', _event, session?.user?.id);
      if (isMounted) {
        if (session?.user) {
          // Only fetch profile if user changed or we don't have a profile yet
          const currentUser = user as UserWithProfile | null;
          const userChanged = !currentUser || currentUser.id !== session.user.id;
          const needsProfile = !currentUser?.profile;
          
          if (userChanged || needsProfile) {
            logger.log('AuthProvider: onAuthStateChange user found, fetching profile');
            fetchUserProfile(session.user, userChanged).then((userWithProfile) => {
              if (isMounted && userWithProfile) {
                logger.log('AuthProvider: profile fetch complete in onAuthStateChange, setting user');
                const prev = user as UserWithProfile | null;
                const profileChanged = !prev || prev.id !== userWithProfile.id ||
                  JSON.stringify(prev.profile) !== JSON.stringify(userWithProfile.profile);
                
                if (profileChanged) {
                  setUser(userWithProfile);
                  localStorage.setItem('user', JSON.stringify(userWithProfile));
                  logger.log('AuthProvider: user state updated in onAuthStateChange');
                }
              }
            }).catch((error) => {
              logger.error('AuthProvider: error fetching profile in onAuthStateChange', error);
              if (isMounted) {
                setUser(session.user as UserWithProfile);
              }
            }).finally(() => {
              // Ensure loading is set to false after profile fetch
              if (loading) {
                logger.log('AuthProvider: onAuthStateChange setting loading to false');
                setLoading(false);
              }
            });
          } else {
            logger.log('AuthProvider: onAuthStateChange user unchanged, skipping profile fetch');
            if (loading) {
              setLoading(false);
            }
          }
        } else {
          logger.log('AuthProvider: onAuthStateChange no user, setting user to null');
          setUser(null);
          localStorage.removeItem('user');
          // Ensure loading is set to false when user logs out
          if (loading) {
            logger.log('AuthProvider: onAuthStateChange setting loading to false for logout');
            setLoading(false);
          }
        }
      } else {
        logger.log('AuthProvider: onAuthStateChange component is unmounted');
      }
    });

    return () => {
      logger.log('AuthProvider: cleanup function called');
      isMounted = false;
      authSubscription?.unsubscribe();
      // Ensure loading is set to false when component unmounts
      if (loading) {
        logger.log('AuthProvider: cleanup setting loading to false');
        setLoading(false);
      }
    };
  }, []);

  // Subscribe to realtime user profile changes (e.g., approved flag updates)
  useEffect(() => {
    if (!hasSupabase) return;
    const current = user as UserWithProfile | null;
    if (!current?.id) return;

    const channel = supabase
      .channel(`user-profile-${current.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users', filter: `id=eq.${current.id}` },
        async (_payload) => {
          try {
            const refreshed = await fetchUserProfile(current as unknown as User, true);
            if (refreshed) {
              const profileChanged = JSON.stringify(current.profile) !== JSON.stringify(refreshed.profile);
              if (profileChanged) {
                setUser(refreshed);
                localStorage.setItem('user', JSON.stringify(refreshed));
                logger.log('AuthProvider: user profile refreshed from realtime change');
              }
            }
          } catch (err) {
            logger.error('AuthProvider: error refreshing profile from realtime', err);
          }
        }
      )
      .subscribe((status) => {
        logger.log('AuthProvider: realtime subscription status', status);
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      logger.log('AuthProvider: attempting login for', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        logger.error('Login auth error:', error);
        throw error;
      }
      
      logger.log('AuthProvider: login successful, user data:', data.user);
      logger.log('AuthProvider: fetching profile for logged in user');
      // Fetch user profile to get role information
      const userWithProfile = await fetchUserProfile(data.user);
      logger.log('AuthProvider: profile fetch complete, setting user', userWithProfile);
      setUser(userWithProfile);
      localStorage.setItem('user', JSON.stringify(userWithProfile));
      logger.log('AuthProvider: user set and stored in localStorage');
    } catch (error) {
      logger.error('Login error:', error);
      logger.error('Login error details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      throw error;
    } finally {
      // Ensure loading is set to false after login attempt
      if (loading) {
        logger.log('AuthProvider: login setting loading to false');
        setLoading(false);
      }
    }
  };

  const register = async (email: string, password: string, fullName: string, role: string, schoolId?: string) => {
    try {
      logger.log('AuthProvider: attempting registration for', email);
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
        logger.error('Registration auth error:', authError);
        throw authError;
      }

      logger.log('AuthProvider: registration successful, user data:', authData.user);
      // The user record in public.users will be created automatically by the trigger
      // No need to manually insert the user profile

      // Fetch user profile to get role information
      logger.log('AuthProvider: fetching profile for newly registered user');
      const userWithProfile = await fetchUserProfile(authData.user);
      logger.log('AuthProvider: profile fetch complete, setting user');
      setUser(userWithProfile);
      localStorage.setItem('user', JSON.stringify(userWithProfile));
      logger.log('AuthProvider: user set and stored in localStorage');
    } catch (error) {
      logger.error('Registration error:', error);
      logger.error('Registration error details:', {
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
      logger.error('Logout error:', error);
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
