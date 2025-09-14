import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';

export default function EmailVerified() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ data, error }) => {
        if (error) {
          console.error('Error verifying email:', error.message);
          return;
        }
        // Email verified, redirect to dashboard
        window.location.href = '/dashboard';
      });
    } else {
      console.error('Missing access_token or refresh_token in URL');
    }
  }, [searchParams]);

  return <div>Verifying your email, please wait...</div>;
}
