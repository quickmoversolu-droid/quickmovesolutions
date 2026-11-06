import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Phone, Calculator, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { QuoteAcquisitionHub } from '@/components/quote-wizards/QuoteAcquisitionHub';
import { QuickMoveTruckTwilightVisual } from '@/components/ui/QuickMoveBrandVisuals';

export const metadata: Metadata = {
  title: 'Get a Free Moving, Delivery or Photo Junk Removal Quote | QuickMove Solutions',
  description:
    'Request a free 8-step visual moving quote, a 6-step photo-first junk removal quote, or furniture delivery quote in Calgary, Airdrie, Strathmore, Red Deer, and Edmonton.',
  alternates: { canonical: '/get-a-quote' },
};

export default function GetAQuoteEntryPage() {
  return (
    <div className="min-h-screen bg-[#05080D] text-white pb-20">
      {/* Quote Hero Section — Matches Visual Reference 2 */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,rgba(24,45,82,0.55)_0%,rgba(9,16,30,0.9)_55%,#05080D_100%)] pt-8 pb-10 sm:pt-10 sm:pb-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy & Action Pills */}
            <div className="lg:col-span-6 space-y-5">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight leading-[1.06] text-white">
                Moving Made Easy.
                <span className="block text-brand-orange mt-1">
                  Get Your Free Quote.
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-xl">
                From residential and commercial relocations to furniture delivery and full junk
                removal, QuickMove Solutions is here to help.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <a
                  href="#quote-wizard-anchor"
                  className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-heading text-sm sm:text-base font-extrabold text-white transition-all hover:scale-[1.02]"
                >
                  <Calculator className="h-4 w-4" />
                  <span>Get a Free Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-6 py-3.5 font-heading text-sm sm:text-base font-bold text-white transition-all hover:border-brand-orange hover:bg-white/10"
                >
                  <Phone className="h-4 w-4 text-brand-orange" />
                  <span>Call {BUSINESS_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>

            {/* Right Illuminated Branded Truck & Luxury Home Twilight Scene */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#091222] shadow-[0_20px_50px_rgba(0,0,0,0.75)]">
                <QuickMoveTruckTwilightVisual className="h-[240px] sm:h-[280px] w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quote Hub (3 Service Cards + Active Wizard + Need Help Sidebar) */}
      <section className="container mx-auto pt-8">
        <Suspense
          fallback={
            <div className="rounded-3xl border border-white/10 bg-[#0B1322] p-10 text-center text-sm font-bold text-white">
              Loading QuickMove Interactive Quote Experience...
            </div>
          }
        >
          <QuoteAcquisitionHub defaultTab="junk-removal" />
        </Suspense>
      </section>
    </div>
  );
}
