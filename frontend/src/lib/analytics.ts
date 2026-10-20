export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Declare global gtag interface on window
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'consent',
      targetIdOrAction: string | Date | Record<string, any>,
      options?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Log pageviews to Google Analytics 4
 */
export const pageview = (url: string) => {
  if (typeof window === 'undefined') return;

  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  } else if (process.env.NODE_ENV === 'development') {
    console.debug(`[GA4 Debug] Pageview: ${url}`);
  }
};

/**
 * Generic event tracker for Google Analytics 4
 */
export const trackEvent = (
  eventName: string,
  eventParams: Record<string, any> = {}
) => {
  if (typeof window === 'undefined') return;

  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else if (process.env.NODE_ENV === 'development') {
    console.debug(`[GA4 Debug] Event "${eventName}":`, eventParams);
  }
};

/**
 * High-intent Real Estate conversion triggers
 */
export const trackWhatsAppClick = (placement: string, label?: string) => {
  trackEvent('whatsapp_click', {
    placement,
    label: label || 'Asesor VIP WhatsApp',
    timestamp: new Date().toISOString(),
  });
};

export const trackLeadSubmit = (projectName?: string) => {
  trackEvent('lead_form_submitted', {
    project_interest: projectName || 'General / Website Contact',
    form_id: 'contact_form_main',
  });
};

export const trackBrochureDownload = (projectSlug: string, projectName?: string) => {
  trackEvent('brochure_download', {
    project_slug: projectSlug,
    project_name: projectName || projectSlug,
    file_type: 'pdf',
  });
};

export const trackLotSelect = (lotNumber: string, areaM2?: number, price?: number) => {
  trackEvent('lot_selected', {
    lot_number: lotNumber,
    area_m2: areaM2,
    price_cop: price,
  });
};

export const trackCatalogFilter = (category: string) => {
  trackEvent('filter_projects', {
    category,
  });
};
