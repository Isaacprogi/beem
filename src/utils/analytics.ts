declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export const analytics = {
  // Page tracking
  trackPage: (pageName: string, path: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        page_path: path,
      });
    }
  },

  // Job interaction events
  trackJobView: (jobId: string, jobTitle: string, company: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        item_id: jobId,
        item_name: jobTitle,
        item_category: 'job',
        item_brand: company,
      });
    }
  },

  trackJobClick: (jobId: string, jobTitle: string, company: string, location: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_item', {
        item_id: jobId,
        item_name: jobTitle,
        item_category: 'job',
        item_brand: company,
        custom_location: location,
      });
    }
  },

  trackJobApply: (jobId: string, jobTitle: string, company: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: 1,
        item_id: jobId,
        item_name: jobTitle,
        item_category: 'job_application',
        item_brand: company,
      });
    }
  },

  // Search and filter events
  trackJobSearch: (searchTerm: string, resultsCount: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        custom_results_count: resultsCount,
      });
    }
  },

  trackFilterUse: (filterType: string, filterValue: string, resultsCount: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'filter_jobs', {
        filter_type: filterType,
        filter_value: filterValue,
        custom_results_count: resultsCount,
      });
    }
  },

  // Navigation events
  trackNavigation: (linkName: string, destination: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'navigation',
        event_label: linkName,
        custom_destination: destination,
      });
    }
  },

  // Conversion events
  trackSignUpStart: (source: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'sign_up', {
        method: 'email',
        custom_source: source,
      });
    }
  },

  trackGetStarted: (location: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'get_started_click', {
        event_category: 'engagement',
        event_label: location,
      });
    }
  },

  trackPricingView: (plan: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_promotion', {
        promotion_id: plan,
        promotion_name: `${plan} Plan`,
        creative_name: 'pricing_card',
        creative_slot: 'pricing_page',
      });
    }
  },

  trackTrialStart: (plan: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `trial_${Date.now()}`,
        value: 0,
        currency: 'USD',
        item_id: plan,
        item_name: `${plan} Trial`,
        item_category: 'subscription',
      });
    }
  },

  // Form events
  trackFormSubmit: (formName: string, success: boolean) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', success ? 'form_submit_success' : 'form_submit_error', {
        event_category: 'form',
        event_label: formName,
      });
    }
  },

  // Engagement events
  trackScrollDepth: (depth: number, page: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'scroll', {
        event_category: 'engagement',
        event_label: `${depth}% - ${page}`,
        value: depth,
      });
    }
  },

  trackTimeOnPage: (timeSpent: number, page: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: 'page_read_time',
        value: timeSpent,
        event_category: 'engagement',
        event_label: page,
      });
    }
  },

  // Contact events
  trackContactClick: (contactMethod: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_click', {
        event_category: 'contact',
        event_label: contactMethod,
      });
    }
  },
};