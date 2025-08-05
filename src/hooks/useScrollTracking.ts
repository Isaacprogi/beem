import { useEffect, useRef } from 'react';
import { analytics } from '@/utils/analytics';

export const useScrollTracking = (pageName: string) => {
  const trackedDepths = useRef<Set<number>>(new Set());
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Track at 25%, 50%, 75%, and 100% scroll depths
      const depths = [25, 50, 75, 100];
      depths.forEach(depth => {
        if (scrollPercent >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          analytics.trackScrollDepth(depth, pageName);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track time on page when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      if (timeSpent > 10) { // Only track if user spent more than 10 seconds
        analytics.trackTimeOnPage(timeSpent, pageName);
      }
    };
  }, [pageName]);
};