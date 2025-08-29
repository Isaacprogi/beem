import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface TrialInfo {
  trialStartedAt: Date | null;
  trialPageViews: number;
}

interface AuthContextType {
  user: User | null;
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
  isTrialActive: boolean;
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
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
  const isTrialActive = !subscriptionStatus.subscribed && trialInfo.trialStartedAt !== null;
  const isTrialExpired = trialInfo.trialStartedAt
    ? new Date().getTime() - trialInfo.trialStartedAt.getTime() > TRIAL_DURATION_HOURS * 60 * 60 * 1000
    : false;
  const hasViewedMaxTrialPages = trialInfo.trialPageViews >= MAX_TRIAL_PAGES;

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
      if (error && error.code !== 'PGRST116') { // Ignore 'single row not found' errors
        console.error('Error fetching trial info:', error);
      }
    } catch (error) {
      console.error('Error in fetchTrialInfo:', error);
    }
  };

  // Checkout pending state management
  const setCheckoutPending = (pending: boolean) => {
    setCheckoutPendingState(pending);
    if (pending) {
      sessionStorage.setItem('checkout_pending', 'true');
    } else {
      sessionStorage.removeItem('checkout_pending');
    }
  };

  const clearCheckoutPending = () => {
    setCheckoutPending(false);
  };

  // Initialize checkout pending state from session storage
  useEffect(() => {
    const storedPending = sessionStorage.getItem('checkout_pending');
    if (storedPending === 'true') {
      setCheckoutPendingState(true);
    }
  }, []);

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

      if (data.subscribed) {
        clearCheckoutPending();
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const startTrial = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('trial_info')
        .upsert({ user_id: user.id, trial_started_at: new Date().toISOString(), trial_page_views: 0 }, { onConflict: 'user_id' });

      if (error) throw error;

      await fetchTrialInfo(user.id);
      
      toast({
        title: "Free trial started!",
        description: "You have 24 hours to browse 3 job pages.",
      });
    } catch (error) {
      console.error('Error starting trial:', error);
      toast({
        title: "Error",
        description: "Failed to start trial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const incrementTrialPageView = async () => {
    if (!user || !isTrialActive) return;

    try {
        const newPageViewCount = trialInfo.trialPageViews + 1;
        const { error } = await supabase
            .from('trial_info')
            .update({ trial_page_views: newPageViewCount })
            .eq('user_id', user.id);

        if (error) throw error;

        setTrialInfo(prev => ({ ...prev, trialPageViews: newPageViewCount }));

    } catch (error) {
      console.error('Error incrementing trial page view:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          setLoading(true);
          await Promise.all([
            checkSubscription(),
            fetchTrialInfo(session!.user.id)
          ]);
          setLoading(false);
          setAuthReady(true);
          toast({
            title: "Welcome back to BleemHire!",
            description: "You've been successfully signed in.",
          });
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith('/jobs') && !checkoutPending) {
            navigate('/jobs');
          }
        } else if (event === 'SIGNED_OUT') {
          setSubscriptionStatus({ subscribed: false, subscription_tier: null, subscription_end: null });
          setTrialInfo({ trialStartedAt: null, trialPageViews: 0 });
          setAuthReady(false);
          toast({
            title: "Signed out",
            description: "You've been successfully signed out from BleemHire.",
          });
          navigate('/');
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        setLoading(true);
        await Promise.all([
            checkSubscription(),
            fetchTrialInfo(session.user.id)
        ]);
        setAuthReady(true);
        setLoading(false);
        const currentPath = window.location.pathname;
        const publicPaths = ['/', '/sign-in', '/sign-up', '/pricing'];
        const storedPending = sessionStorage.getItem('checkout_pending') === 'true';
        
        if (publicPaths.includes(currentPath) && !storedPending) {
          navigate('/jobs');
        }
      } else {
        setAuthReady(true);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);


  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) throw error;
      toast({
        title: "Welcome to BleemHire!",
        description: "Please check your email to verify your account.",
      });
      return { data, error: null };
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { data: null, error };
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
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
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
        title: "Password reset email sent!",
        description: "Please check your email for password reset instructions.",
      });
      return { error: null };
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({
        title: "Password updated!",
        description: "Your password has been successfully updated.",
      });
      return { error: null };
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    authReady,
    checkoutPending,
    subscriptionLoading,
    subscriptionStatus,
    trialInfo,
    isTrialActive,
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && authReady ? children : "hello"}
    </AuthContext.Provider>
  );
};
