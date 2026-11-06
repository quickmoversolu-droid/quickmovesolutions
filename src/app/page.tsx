import * as React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ServiceHighlightsAndTrust } from '@/components/home/ServiceHighlightsAndTrust';
import { ServiceSpotlights } from '@/components/home/ServiceSpotlights';
import { ProcessAndWhyChooseUs } from '@/components/home/ProcessAndWhyChooseUs';
import { ReviewsGalleryFaqCta } from '@/components/home/ReviewsGalleryFaqCta';

/**
 * QUICKMOVE SOLUTIONS — PREMIUM HOMEPAGE (PHASE 2)
 * Implements all 16 sections in exact order per Section 6.2 & Phase 2 of KNOWLEDGE.md:
 * 1. Navigation (Rendered in RootLayout Header)
 * 2. Hero + 3D Relocation & Space-Clearing Experience
 * 3. Service Highlights
 * 4. Trust Indicators (Verified Business Commitments)
 * 5. Main Services (All 7 Service Lines)
 * 6. Residential and Commercial Moving
 * 7. Junk Removal Feature (Photo-First Estimate)
 * 8. Delivery Services
 * 9. How It Works
 * 10. Why Choose QuickMove Solutions
 * 11. Service Areas (Calgary, Airdrie, Strathmore, Red Deer, Edmonton)
 * 12. Verified Customer Reviews
 * 13. Project & Operational Capabilities Gallery
 * 14. Frequently Asked Questions
 * 15. Final CTA
 * 16. Footer (Rendered in RootLayout Footer)
 */
export default function HomePage() {
  return (
    <React.Suspense fallback={null}>
      <HeroSection />
      <ServiceHighlightsAndTrust />
      <ServiceSpotlights />
      <ProcessAndWhyChooseUs />
      <ReviewsGalleryFaqCta />
    </React.Suspense>
  );
}
