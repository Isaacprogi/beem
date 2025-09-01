import { supabase } from '@/integrations/supabase/client';

const trackEvent = async (eventName: string, metadata: Record<string, unknown> = {}) => {
  try {
    // We don't want to block the user experience, so we won't wait for this to complete.
    // We also don't want to clutter the console with errors if the user is offline.
    if (typeof window === 'undefined' || !navigator.onLine) {
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const eventData = {
      event_name: eventName,
      path: window.location.pathname,
      user_id: user?.id || null,
      metadata: {
        ...metadata,
        // Add any other useful info here
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      },
    };

    // We use .then() instead of await here because we don't want to block
    // the main thread while the event is being sent.
    supabase.from('tracking_events').insert([eventData]).then(({ error }) => {
      if (error) {
        // Silently log the error to the console for debugging, but don't bother the user.
        console.error('Error logging tracking event:', error.message);
      }
    });
  } catch (error) {
    // Silently log any unexpected errors.
    if (error instanceof Error) {
        console.error('Error in trackEvent:', error.message);
    } else {
        console.error('An unknown error occurred in trackEvent.');
    }
  }
};

export const analytics = {
  // Page tracking
  trackPage: (pageName: string, path: string) => {
    trackEvent('page_view', { page_title: pageName, page_path: path });
  },

  // Job interaction events
  trackJobView: (jobId: string, jobTitle: string, company: string) => {
    trackEvent('view_item', { item_id: jobId, item_name: jobTitle, item_category: 'job', item_brand: company });
  },

  trackJobClick: (jobId: string, jobTitle: string, company: string, location: string) => {
    trackEvent('select_item', { item_id: jobId, item_name: jobTitle, item_category: 'job', item_brand: company, custom_location: location });
  },

  trackJobApply: (jobId: string, jobTitle: string, company: string) => {
    trackEvent('begin_checkout', { item_id: jobId, item_name: jobTitle, item_category: 'job_application', item_brand: company });
  },

  // Search and filter events
  trackJobSearch: (searchTerm: string, resultsCount: number) => {
    trackEvent('search', { search_term: searchTerm, custom_results_count: resultsCount });
  },

  trackFilterUse: (filterType: string, filterValue: string, resultsCount: number) => {
    trackEvent('filter_jobs', { filter_type: filterType, filter_value: filterValue, custom_results_count: resultsCount });
  },

  // Navigation events
  trackNavigation: (linkName: string, destination: string) => {
    trackEvent('click', { event_category: 'navigation', event_label: linkName, custom_destination: destination });
  },

  // Conversion events
  trackSignUpStart: (source: string) => {
    trackEvent('sign_up_start', { method: 'email', custom_source: source });
  },

  trackGetStarted: (location: string) => {
    trackEvent('get_started_click', { event_category: 'engagement', event_label: location });
  },

  trackPricingView: (plan: string) => {
    trackEvent('view_promotion', { promotion_id: plan, promotion_name: `${plan} Plan` });
  },

  trackTrialStart: (plan: string) => {
    trackEvent('purchase', { item_id: plan, item_name: `${plan} Trial`, item_category: 'subscription' });
  },

  // Form events
  trackFormSubmit: (formName: string, success: boolean) => {
    trackEvent(success ? 'form_submit_success' : 'form_submit_error', { event_category: 'form', event_label: formName });
  },

  // Engagement events
  trackScrollDepth: (depth: number, page: string) => {
    trackEvent('scroll', { event_category: 'engagement', event_label: `${depth}% - ${page}`, value: depth });
  },

  trackTimeOnPage: (timeSpent: number, page: string) => {
    trackEvent('timing_complete', { name: 'page_read_time', value: timeSpent, event_category: 'engagement', event_label: page });
  },

  // Contact events
  trackContactClick: (contactMethod: string) => {
    trackEvent('contact_click', { event_category: 'contact', event_label: contactMethod });
  },

  // Authentication events
  trackSignUp: (email: string) => {
    trackEvent('sign_up', { method: 'email', custom_email: email });
  },

  trackSignInAttempt: () => {
    trackEvent('login_attempt', { method: 'email' });
  },

  trackSignInSuccess: () => {
    trackEvent('login', { method: 'email' });
  },

  // Job posting events
  trackJobPost: (company: string, role: string) => {
    trackEvent('job_post', { event_category: 'job', event_label: `${company} - ${role}`, custom_company: company, custom_role: role });
  },
};