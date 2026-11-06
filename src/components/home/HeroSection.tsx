'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Phone,
  ArrowRight,
  Calculator,
  Sparkles,
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { QuickMoveTruckTwilightVisual } from '@/components/ui/QuickMoveBrandVisuals';
import { QuoteAcquisitionHub } from '@/components/quote-wizards/QuoteAcquisitionHub';

export function HeroSection() {
  const [heroImage, setHeroImage] = React.useState<string>('/images/quickmove-truck-hero.jpg');

  React.useEffect(() => {
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.homepageHeroImageUrl) {
          setHeroImage(data.homepageHeroImageUrl);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#05080D] text-white pt-6 pb-16 sm:pt-8 sm:pb-20 border-b border-white/10">
      {/* =====================================================================
          1. WIDE SCENIC HERO BACKGROUND: TRUCK & ILLUMINATED HOME FADING UNDER TEXT
         ===================================================================== */}
      <div className="pointer-events-none absolute right-0 top-0 h-[390px] sm:h-[440px] lg:h-[470px] w-full md:w-[68%] lg:w-[58%] xl:w-[53%] overflow-hidden z-0">
        {/* High-Resolution Hero Image */}
        <img
          src={heroImage}
          alt="QuickMove Solutions commercial moving truck outside illuminated luxury home at dusk"
          className="h-full w-full object-cover object-right sm:object-center opacity-95"
          loading="eager"
        />

        {/* Smooth Horizontal Gradient Fade: Extends softly UNDER the headline and paragraph */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[60%] lg:w-[48%] bg-gradient-to-r from-[#05080D] via-[#05080D]/90 35% via-[#05080D]/40 70% to-transparent" />

        {/* Bottom Fade: Seamlessly dissolves into the quote wizard cards below */}
        <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-[#05080D] via-[#05080D]/80 to-transparent" />

        {/* Top Fade: Softly blends into navigation bar */}
        <div className="absolute inset-x-0 top-0 h-14 sm:h-16 bg-gradient-to-b from-[#05080D]/90 to-transparent" />

        {/* QuickMove Signature Orange Chevron Blade in Top-Right Corner */}
        <div
          aria-hidden="true"
          className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-brand-orange to-[#ff8c4a] opacity-85 rotate-45 transform translate-x-10 -translate-y-6 shadow-[0_0_40px_rgba(244,119,50,0.5)]"
        />
      </div>

      <div className="container mx-auto relative z-10 space-y-10 sm:space-y-12">
        {/* =====================================================================
            2. HERO HEADLINE & ACTIONS LAYERED OVER THE FADED ATMOSPHERE
           ===================================================================== */}
        <div className="max-w-2xl lg:max-w-xl space-y-5 pt-2 sm:pt-4">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.05] text-white drop-shadow-md">
            Moving Made Easy.
            <span className="block text-brand-orange mt-1">
              Get Your Free Quote.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/85 leading-relaxed drop-shadow">
            From residential and commercial relocations to furniture delivery and full junk
            removal, QuickMove Solutions is here to help.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <a
              href="#quote-experience"
              className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-heading text-sm sm:text-base font-extrabold text-white transition-all hover:scale-[1.02] hover:shadow-cta-hover"
            >
              <Calculator className="h-4 w-4" />
              <span>Get a Free Quote</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={BUSINESS_INFO.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-md px-7 py-3.5 font-heading text-sm sm:text-base font-bold text-white transition-all hover:border-brand-orange hover:bg-white/15"
            >
              <Phone className="h-4 w-4 text-brand-orange" />
              <span>Call {BUSINESS_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>

        {/* =====================================================================
            3. INTERACTIVE QUOTE EXPERIENCE HUB (3 CARDS + 5-STEP WIZARD + NEED HELP)
           ===================================================================== */}
        <div id="quote-experience" className="pt-2">
          <QuoteAcquisitionHub defaultTab="junk-removal" />
        </div>
      </div>
    </section>
  );
}
