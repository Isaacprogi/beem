import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AuthLoadingScreen } from '@/components/AuthLoadingScreen';

interface TrialInfo {
  trialStartedAt: Date | null;
  trialPageViews: number;
}

interface UserProfile {
  id: string;
  display_name?: string;
  role?: string; // add other fields as needed
}


interface AuthContextType {
  user: User | null;
  profile: UserProfile | null; // <-- new
  session: Session | null;
  loading: boolean;
  authReady: boolean;
  checkoutPending: boolean;
  subscriptionLoading: boolean;
  subscriptionStatus: {
    subscribed: boolean;
    subscription_tier: string | null;
    subscription_end: string | null;
  };
  trialInfo: TrialInfo;
  trailDurationHours: number;
  canStartTrial: boolean;
  isTrialRunning: boolean;
  isTrialExpired: boolean;
  hasViewedMaxTrialPages: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ data?: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  checkSubscription: () => Promise<void>;
  startTrial: () => Promise<void>;
  incrementTrialPageView: () => Promise<void>;
  setCheckoutPending: (pending: boolean) => void;
  clearCheckoutPending: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [checkoutPending, setCheckoutPendingState] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    subscribed: false,
    subscription_tier: null as string | null,
    subscription_end: null as string | null,
  });
  const [trialInfo, setTrialInfo] = useState<TrialInfo>({
    trialStartedAt: null,
    trialPageViews: 0,
  });

  // Trial constants
  const TRIAL_DURATION_HOURS = 24;
  const MAX_TRIAL_PAGES = 3;

  // Computed trial states
  const isTrialExpired = trialInfo.trialStartedAt
    ? new Date().getTime() - trialInfo.trialStartedAt.getTime() > TRIAL_DURATION_HOURS * 60 * 60 * 1000
    : false;

  const canStartTrial = !subscriptionStatus.subscribed && !trialInfo.trialStartedAt;
  const isTrialRunning = !subscriptionStatus.subscribed && trialInfo.trialStartedAt !== null && !isTrialExpired;
  const hasViewedMaxTrialPages = trialInfo.trialPageViews >= MAX_TRIAL_PAGES;

  // Checkout pending state management
  const setCheckoutPending = (pending: boolean) => {
    setCheckoutPendingState(pending);
    if (pending) sessionStorage.setItem('checkout_pending', 'true');
    else sessionStorage.removeItem('checkout_pending');
  };
  const clearCheckoutPending = () => setCheckoutPending(false);

  useEffect(() => {
    const storedPending = sessionStorage.getItem('checkout_pending');
    if (storedPending === 'true') setCheckoutPendingState(true);
  }, []);

  // Fetch trial info from Supabase
  const fetchTrialInfo = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('trial_info')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setTrialInfo({
          trialStartedAt: data.trial_started_at ? new Date(data.trial_started_at) : null,
          trialPageViews: data.trial_page_views || 0,
        });
      }

      if (error && error.code !== 'PGRST116') console.error('Error fetching trial info:', error);
    } catch (err) {
      console.error('Error in fetchTrialInfo:', err);
    }
  };

  // Check subscription status
  const checkSubscription = async () => {
    if (!session) return;
    setSubscriptionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;

      setSubscriptionStatus({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
      });

      if (data.subscribed) clearCheckoutPending();
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Start trial
  const startTrial = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('trial_info')
        .upsert(
          { user_id: user.id, trial_started_at: new Date().toISOString(), trial_page_views: 0 },
          { onConflict: 'user_id' }
        );

      if (error) throw error;

      await fetchTrialInfo(user.id);

      toast({
        title: 'Free trial started!',
        description: `You have ${TRIAL_DURATION_HOURS} hours to browse ${MAX_TRIAL_PAGES} job pages.`,
      });
    } catch (err) {
      console.error('Error starting trial:', err);
      toast({
        title: 'Error',
        description: 'Failed to start trial. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Increment trial page view
  const incrementTrialPageView = async () => {
  if (!user || !isTrialRunning || hasViewedMaxTrialPages) return;

  try {
    // Cap at MAX_TRIAL_PAGES
    const newPageViews = Math.min(trialInfo.trialPageViews + 1, MAX_TRIAL_PAGES);

    const { error } = await supabase
      .from('trial_info')
      .update({ trial_page_views: newPageViews })
      .eq('user_id', user.id);

    if (error) throw error;

    setTrialInfo(prev => ({ ...prev, trialPageViews: newPageViews }));
  } catch (err) {
    console.error('Error incrementing trial page view:', err);
  }
};


const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

      console.log(data,"profile")

    if (error && error.code !== 'PGRST116') throw error;

    setProfile(data || null);
  } catch (err) {
    console.error('Error fetching profile:', err);
  }
};



  // Fetch subscription & trial info when session is ready
  useEffect(() => {
  if (!session?.user) return;
  const fetchData = async () => {
    await Promise.all([
      checkSubscription(),
      fetchTrialInfo(session.user.id),
      fetchUserProfile(session.user.id), // <-- fetch profile here
    ]);
  };
  fetchData();
}, [session]);


  // Initialize auth
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setAuthReady(true);
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth actions
  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${import.meta.env.VITE_APP_URL}/email-verified`, data: { display_name: displayName } },
      });
      if (error) throw error;

      toast({
        title: 'Welcome!',
        description: 'Please check your email to verify your account.',
      });

      return { data, error: null };
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/sign-in')
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to sign out.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;

      toast({
        title: 'Password reset email sent!',
        description: 'Check your email for instructions.',
      });
      return { error: null };
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast({ title: 'Password updated!', description: 'Your password has been successfully updated.' });
      return { error: null };
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

 const value: AuthContextType = {
  user,
  profile, // <-- added
  session,
  loading,
  authReady,
  checkoutPending,
  subscriptionLoading,
  subscriptionStatus,
  trialInfo,
  canStartTrial,
  isTrialRunning,
  isTrialExpired,
  hasViewedMaxTrialPages,
  signUp,
  signIn,
  signOut,
  resetPassword,
  updatePassword,
  checkSubscription,
  startTrial,
  incrementTrialPageView,
  setCheckoutPending,
  clearCheckoutPending,
  trailDurationHours: TRIAL_DURATION_HOURS,
};


  return (
    <AuthContext.Provider value={value}>
      {!loading && authReady ? children : <AuthLoadingScreen />}
    </AuthContext.Provider>
  );
};
