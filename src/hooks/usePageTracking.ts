import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const getPageName = (pathname: string) => {
      switch (pathname) {
        case '/':
          return 'Home';
        case '/jobs':
          return 'Browse Jobs';
        case '/pricing':
          return 'Pricing';
        case '/post-job':
          return 'Post Job';
        case '/signup':
          return 'Sign Up';
        case '/privacy-policy':
          return 'Privacy Policy';
        default:
          return 'Unknown Page';
      }
    };

    const pageName = getPageName(location.pathname);
    analytics.trackPage(pageName, location.pathname);
  }, [location]);
};