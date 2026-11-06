'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsAndUtmTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source');
      const utmMedium = params.get('utm_medium');
      const utmCampaign = params.get('utm_campaign');

      if (utmSource) sessionStorage.setItem('qm_utm_source', utmSource);
      if (utmMedium) sessionStorage.setItem('qm_utm_medium', utmMedium);
      if (utmCampaign) sessionStorage.setItem('qm_utm_campaign', utmCampaign);
    } catch {
      // Ignore storage access errors in private browsing
    }
  }, [pathname]);

  return null;
}

