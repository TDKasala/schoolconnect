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
  profile?: Profile | null;
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
    
    // Prevent concurrent fetches unless forced
    if (profileFetchInProgress && !force) {
      logger.log('AuthProvider: profile fetch already in progress, skipping');
      return user as UserWithProfile;
    }
    
    try {
      setProfileFetchInProgress(true);
      logger.log('AuthProvider: fetching user profile for', authUser.id);
      console.log('[AUTH] Starting profile fetch for user:', authUser.id);
      console.log('[AUTH] Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      
      // Add a timeout to prevent indefinite hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout after 5 seconds')), 5000)
      );
      
      console.log('[AUTH] Making Supabase query to users table...');
      const supabasePromise = supabase
        .from('users')
        .select('id, full_name, role, school_id, created_at, approved')
        .eq('id', authUser.id)
        .single();
      
      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;
      console.log('[AUTH] Query completed. Data:', data, 'Error:', error);

      if (error) {
        logger.error('Profile fetch error:', error);
        console.error('[AUTH] Profile fetch error:', error);
        console.error('[AUTH] Error code:', error.code);
        console.error('[AUTH] Error message:', error.message);
        console.error('[AUTH] Error details:', error.details);
        console.error('[AUTH] Error hint:', error.hint);
        logger.error('Profile fetch error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // For critical errors, return user with empty profile to prevent infinite loading
        if (error.code === 'PGRST116' || error.message?.includes('JWT') || error.message?.includes('Row not found')) {
          logger.log('AuthProvider: critical error, returning user with empty profile');
          console.warn('[AUTH] Critical error detected, returning user with null profile to prevent infinite loading');
          return {
            ...authUser,
            profile: null
          };
        }
        
        logger.log('AuthProvider: returning auth user only due to error');
        return authUser as UserWithProfile;
      }

      if (!data) {
        console.warn('[AUTH] No profile data returned, attempting to create user profile...');
        
        // Try to create a basic profile for the user
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            role: 'teacher', // Default role
            approved: false // Requires admin approval
          })
          .select()
          .single();
        
        if (createError) {
          console.error('[AUTH] Failed to create user profile:', createError);
          logger.log('AuthProvider: could not create profile, returning user with null profile');
          return {
            ...authUser,
            profile: null
          };
        }
        
        console.log('[AUTH] Created new user profile:', newProfile);
        return {
          ...authUser,
          profile: newProfile as Profile
        };
      }

      logger.log('AuthProvider: profile data fetched', data);
      console.log('[AUTH] Profile data successfully fetched:', data);
      const userWithProfile: UserWithProfile = {
        ...authUser,
        profile: data as Profile
      };
      logger.log('AuthProvider: returning user with profile');
      return userWithProfile;
    } catch (error) {
      logger.error('Profile fetch exception:', error);
      console.error('[AUTH] Profile fetch exception:', error);
      logger.error('Profile fetch exception details:', {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
      
      // For timeout or critical errors, return user with null profile
      if ((error as Error).message?.includes('timeout') || (error as Error).message?.includes('JWT')) {
        logger.log('AuthProvider: timeout/critical error, returning user with null profile');
        return {
          ...authUser,
          profile: null
        };
      }
      
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
        supabase.auth.getSession().then(({ data: { session } }) => {
          logger.log('AuthProvider: initial session check', { hasSession: !!session });
          console.log('[AUTH] Initial session check, has session:', !!session);
          if (session?.user) {
            console.log('[AUTH] Initial session user found, fetching profile...');
            fetchUserProfile(session.user).then(userWithProfile => {
              console.log('[AUTH] Initial profile fetch complete:', !!userWithProfile?.profile);
              setUser(userWithProfile);
              setLoading(false);
            });
          } else {
            console.log('[AUTH] No initial session, setting loading to false');
            setLoading(false);
          }
        });
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

    const { data: authSubscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.log('AuthProvider: auth state changed', { event, hasSession: !!session });
      console.log('[AUTH] Auth state changed:', event, 'Session:', !!session);
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
      authSubscription?.subscription.unsubscribe();
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
