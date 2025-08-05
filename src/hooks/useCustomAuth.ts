
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCustomAuth = () => {
  const auth = useAuth();

  const signUpWithCustomEmail = async (email: string, password: string, displayName?: string) => {
    try {
      // First, sign up the user
      const { data, error } = await auth.signUp(email, password, displayName);
      
      if (error) return { error };
      
      // Send custom confirmation email with redirect to checkout
      if (data?.user && !data.user.email_confirmed_at) {
        await supabase.functions.invoke('send-auth-email', {
          body: {
            type: 'signup',
            user: { email },
            data: {
              confirmationUrl: 'https://buy.stripe.com/aFa28k6qfdqf7EX0KFcMM00'
            }
          }
        });
      }
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const resetPasswordWithCustomEmail = async (email: string) => {
    try {
      // Generate password reset
      const { error } = await auth.resetPassword(email);
      
      if (error) return { error };
      
      // Send custom reset email
      await supabase.functions.invoke('send-auth-email', {
        body: {
          type: 'recovery',
          user: { email },
          data: {
            resetUrl: `${window.location.origin}/reset-password`
          }
        }
      });
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return {
    ...auth,
    signUpWithCustomEmail,
    resetPasswordWithCustomEmail,
  };
};
