'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsAndUtmTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');

      if (utmSource) sessionStorage.setItem('qm_utm_source', utmSource);
      if (utmMedium) sessionStorage.setItem('qm_utm_medium', utmMedium);
      if (utmCampaign) sessionStorage.setItem('qm_utm_campaign', utmCampaign);
    } catch {
      // Ignore storage access errors in private browsing
    }
  }, [pathname, searchParams]);

  return null;
}

