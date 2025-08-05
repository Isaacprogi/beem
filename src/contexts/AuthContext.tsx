import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

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
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    subscribed: false,
    subscription_tier: null as string | null,
    subscription_end: null as string | null,
  });
  const [trialInfo, setTrialInfo] = useState<TrialInfo>({
    trialStartedAt: null,
    trialPageViews: 0,
  });

  // Firebase initialization
  const [firebaseApp] = useState(() => initializeApp(firebaseConfig));
  const [firebaseAuth] = useState(() => getAuth(firebaseApp));
  const [firestore] = useState(() => getFirestore(firebaseApp));

  // Trial constants
  const TRIAL_DURATION_HOURS = 24;
  const MAX_TRIAL_PAGES = 3;

  // Computed trial states
  const isTrialActive = !subscriptionStatus.subscribed && trialInfo.trialStartedAt !== null;
  const isTrialExpired = trialInfo.trialStartedAt 
    ? new Date().getTime() - trialInfo.trialStartedAt.getTime() > TRIAL_DURATION_HOURS * 60 * 60 * 1000
    : false;
  const hasViewedMaxTrialPages = trialInfo.trialPageViews >= MAX_TRIAL_PAGES;

  // Firebase initialization
  const initializeFirebase = async () => {
    if (!user) return;

    try {
      // Sign in anonymously to Firebase for trial tracking
      await signInAnonymously(firebaseAuth);
      setAuthReady(true);
      
      // Set up trial info listener
      const trialDocRef = getUserTrialDocRef();
      const unsubscribe = onSnapshot(trialDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setTrialInfo({
            trialStartedAt: data.trialStartedAt?.toDate() || null,
            trialPageViews: data.trialPageViews || 0,
          });
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setAuthReady(true); // Set ready even on error to prevent blocking
    }
  };

  // Helper to get trial document reference
  const getUserTrialDocRef = () => {
    if (!user?.id) throw new Error('User not authenticated');
    return doc(firestore, 'trial_info', user.id);
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
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      
      setSubscriptionStatus({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
      });

      // Clear checkout pending if we now have a subscription
      if (data.subscribed) {
        clearCheckoutPending();
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const startTrial = async () => {
    if (!authReady || !user) return;

    try {
      const trialDocRef = getUserTrialDocRef();
      await setDoc(trialDocRef, {
        trialStartedAt: serverTimestamp(),
        trialPageViews: 0,
      });
      
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
    if (!authReady || !user || !isTrialActive) return;

    try {
      const trialDocRef = getUserTrialDocRef();
      await updateDoc(trialDocRef, {
        trialPageViews: trialInfo.trialPageViews + 1,
      });
    } catch (error) {
      console.error('Error incrementing trial page view:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back to BleemHire!",
            description: "You've been successfully signed in.",
          });
          
          // Check subscription after sign in
          if (session) {
            await checkSubscription();
          }
          
          // Navigate to jobs page
          navigate('/jobs');
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You've been successfully signed out from BleemHire.",
          });
          
          // Reset subscription status on sign out
          setSubscriptionStatus({
            subscribed: false,
            subscription_tier: null,
            subscription_end: null,
          });
          
          // Reset trial info
          setTrialInfo({
            trialStartedAt: null,
            trialPageViews: 0,
          });
          
          setAuthReady(false);
          
          // Navigate to home page
          navigate('/');
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Check subscription if user is already signed in
      if (session) {
        checkSubscription();
        
        // Redirect already signed-in users from public pages
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/sign-in' || currentPath === '/sign-up') {
          navigate('/jobs');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Initialize Firebase when user changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    if (user) {
      initializeFirebase().then((unsub) => {
        unsubscribe = unsub;
      });
    } else {
      setAuthReady(false);
      setTrialInfo({
        trialStartedAt: null,
        trialPageViews: 0,
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return { data, error };
      }

      // Send custom branded confirmation email
      if (data.user && !data.user.email_confirmed_at) {
        try {
          await supabase.functions.invoke('send-auth-email', {
            body: {
              type: 'signup',
              user: { email },
              data: {
                confirmationUrl: `${window.location.origin}/?confirmed=true`
              }
            }
          });
        } catch (emailError) {
          console.warn('Custom email failed, falling back to default:', emailError);
        }
      }

      toast({
        title: "Welcome to BleemHire!",
        description: "Please check your email to verify your account.",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return { data: undefined, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Send custom branded reset email
      try {
        await supabase.functions.invoke('send-auth-email', {
          body: {
            type: 'recovery',
            user: { email },
            data: {
              resetUrl: redirectUrl
            }
          }
        });
      } catch (emailError) {
        console.warn('Custom email failed, falling back to default:', emailError);
      }

      toast({
        title: "Password reset email sent!",
        description: "Please check your email for password reset instructions.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Password updated!",
        description: "Your password has been successfully updated.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
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
      {children}
    </AuthContext.Provider>
  );
};
