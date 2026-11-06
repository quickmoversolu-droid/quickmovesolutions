import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Phone, Calculator, ArrowRight } from 'lucide-react';
import { QuoteAcquisitionHub } from '@/components/quote-wizards/QuoteAcquisitionHub';
import { QuickMoveTruckTwilightVisual } from '@/components/ui/QuickMoveBrandVisuals';
import { BUSINESS_INFO } from '@/lib/constants/business';

export const metadata: Metadata = {
  title: 'Furniture, Appliance & Commercial Delivery Quote | QuickMove Solutions',
  description:
    'Request store-to-home furniture delivery, private marketplace pickup, appliance transport, or commercial B2B delivery across Calgary and Alberta.',
  alternates: { canonical: '/get-a-quote/delivery' },
};

export default function DeliveryQuoteWizardPage() {
  return (
    <div className="min-h-screen bg-[#05080D] text-white pb-20">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,rgba(24,45,82,0.55)_0%,rgba(9,16,30,0.9)_55%,#05080D_100%)] pt-8 pb-10 sm:pt-10 sm:pb-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight leading-[1.06] text-white">
                Moving Made Easy.
                <span className="block text-brand-orange mt-1">
                  Get Your Free Quote.
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-xl">
                Schedule store-to-home furniture delivery, private seller pickups, heavy appliance
                transport, or optional old-item haul-away across Calgary and Alberta.
              </p>
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <a
                  href="#quote-wizard-anchor"
                  className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-heading text-sm sm:text-base font-extrabold text-white"
                >
                  <Calculator className="h-4 w-4" />
                  <span>Start 4-Step Delivery Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-6 py-3.5 font-heading text-sm sm:text-base font-bold text-white hover:border-brand-orange"
                >
                  <Phone className="h-4 w-4 text-brand-orange" />
                  <span>Call {BUSINESS_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#091222] shadow-2xl">
                <QuickMoveTruckTwilightVisual className="h-[240px] sm:h-[280px] w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto pt-8">
        <Suspense fallback={<div className="p-8 text-center text-white">Loading Delivery Quote Wizard...</div>}>
          <QuoteAcquisitionHub defaultTab="delivery" />
        </Suspense>
      </section>
    </div>
  );
}
