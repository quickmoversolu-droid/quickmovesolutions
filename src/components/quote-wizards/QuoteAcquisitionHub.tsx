'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Image as ImageIcon,
  Package,
  Phone,
  Mail,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { VisualMovingQuoteWizard } from './VisualMovingQuoteWizard';
import { PhotoJunkQuoteWizard } from './PhotoJunkQuoteWizard';
import { DeliveryQuoteWizard } from './DeliveryQuoteWizard';
import { BUSINESS_CONSTANTS } from '@/lib/constants/business';
import { CalgarySkylineFooterGraphic } from '@/components/ui/QuickMoveBrandVisuals';
import { cn } from '@/lib/utils';

export type AcquisitionTab = 'moving' | 'junk-removal' | 'delivery';

interface QuoteAcquisitionHubProps {
  defaultTab?: AcquisitionTab;
}

function QuoteAcquisitionHubContent({ defaultTab = 'junk-removal' }: QuoteAcquisitionHubProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<AcquisitionTab>(defaultTab);
  const [selectedCity, setSelectedCity] = useState<string>('Calgary');

  useEffect(() => {
    const serviceParam = searchParams.get('service') || searchParams.get('flow');
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSelectedCity(cityParam);
    }
    if (serviceParam) {
      const normalized = serviceParam.toLowerCase();
      if (normalized.includes('junk')) {
        setActiveTab('junk-removal');
      } else if (normalized.includes('delivery')) {
        setActiveTab('delivery');
      } else {
        setActiveTab('moving');
      }
    }
  }, [searchParams]);

  const TABS: {
    id: AcquisitionTab;
    title: string;
    subtitle: string;
    stepsLabel: string;
    popularBadge?: string;
    icon: React.ComponentType<{ className?: string }>;
    dedicatedHref: string;
  }[] = [
    {
      id: 'moving',
      title: 'Visual Moving Quote',
      subtitle: 'Get a fast, simple moving quote in just 8 easy steps.',
      stepsLabel: '8 Steps',
      icon: Home,
      dedicatedHref: '/get-a-quote/moving',
    },
    {
      id: 'junk-removal',
      title: 'Photo-First Junk Removal Quote',
      subtitle: 'Upload photos and get an estimate in just 6 steps.',
      stepsLabel: '6 Steps',
      popularBadge: 'Most Popular',
      icon: ImageIcon,
      dedicatedHref: '/get-a-quote/junk-removal',
    },
    {
      id: 'delivery',
      title: 'Furniture & Appliance Delivery',
      subtitle: 'Schedule delivery for your large items in 4 easy steps.',
      stepsLabel: '4 Steps',
      icon: Package,
      dedicatedHref: '/get-a-quote/delivery',
    },
  ];

  return (
    <div id="quote-wizard-anchor" className="space-y-6">
      {/* 3 Interactive Service Selector Cards — Matches Reference Image 2 */}
      <div className="grid gap-5 md:grid-cols-3 pt-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab(tab.id);
                }
              }}
              className={cn(
                'group relative flex items-center justify-between gap-4 rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 cursor-pointer select-none',
                isActive
                  ? 'qm-orange-border-glow bg-gradient-to-b from-[#162747] to-[#0B1426]'
                  : 'qm-dark-panel hover:border-brand-orange/50'
              )}
            >
              {tab.popularBadge && (
                <span className="qm-orange-pill absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-0.5 text-[11px] font-heading font-extrabold uppercase tracking-wider text-white shadow-md">
                  {tab.popularBadge}
                </span>
              )}

              <div className="flex items-start gap-4 min-w-0">
                <div
                  className={cn(
                    'flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border transition-colors',
                    isActive
                      ? 'border-brand-orange/60 bg-brand-orange/20 text-brand-orange'
                      : 'border-white/10 bg-white/5 text-brand-orange group-hover:border-brand-orange/40'
                  )}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-heading text-base sm:text-lg font-extrabold text-white group-hover:text-brand-orange transition-colors">
                    {tab.title}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-white/65 leading-snug">
                    {tab.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between shrink-0 gap-3">
                <span className="font-heading text-xs sm:text-sm font-extrabold text-brand-orange whitespace-nowrap">
                  {tab.stepsLabel}
                </span>
                <Link
                  href={tab.dedicatedHref}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }}
                  aria-label={`Select ${tab.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange text-white shadow-md transition-transform group-hover:translate-x-0.5"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Active Wizard + Right "Need Help?" Support Card (Matches Reference Image 2) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9">
          {activeTab === 'moving' && <VisualMovingQuoteWizard initialCity={selectedCity} />}
          {activeTab === 'junk-removal' && <PhotoJunkQuoteWizard initialCity={selectedCity} />}
          {activeTab === 'delivery' && <DeliveryQuoteWizard initialCity={selectedCity} />}
        </div>

        {/* Sticky Right "Need Help?" Support Card with Calgary Skyline */}
        <aside className="lg:col-span-3 lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B1322]/95 text-white shadow-[0_24px_60px_rgba(0,0,0,0.65)] flex flex-col justify-between">
            <div className="p-6 sm:p-7 text-center flex flex-col items-center">
              {/* Glowing Orange Headset Icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/15 border border-brand-orange/35 text-brand-orange shadow-orange-glow">
                <Headphones className="h-8 w-8" />
              </div>

              <h3 className="font-heading text-xl font-extrabold text-white">Need Help?</h3>
              <p className="mt-1 text-xs sm:text-sm text-white/65">
                Our team is here to assist you.
              </p>

              {/* Phone Pill Button */}
              <a
                href={BUSINESS_CONSTANTS.phoneHref}
                className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-brand-orange/80 bg-[#0E192D] px-4 py-3 font-heading text-sm font-extrabold text-white shadow-[0_0_20px_rgba(244,119,50,0.25)] transition-all hover:bg-brand-orange hover:text-white"
              >
                <Phone className="h-4 w-4 text-brand-orange group-hover:text-white shrink-0" />
                <span>{BUSINESS_CONSTANTS.phoneDisplay}</span>
              </a>

              <span className="my-3 text-xs font-medium text-white/45">or</span>

              {/* Email Pill Button */}
              <a
                href={BUSINESS_CONSTANTS.emailHref}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-[#0E192D] px-3.5 py-3 text-xs font-semibold text-white/90 transition-all hover:border-brand-orange/60 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                <span className="truncate">{BUSINESS_CONSTANTS.email}</span>
              </a>
            </div>

            {/* Bottom Calgary Skyline & Orange Wave Artwork */}
            <div className="mt-2">
              <CalgarySkylineFooterGraphic />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function QuoteAcquisitionHub(props: QuoteAcquisitionHubProps) {
  return (
    <React.Suspense
      fallback={
        <div className="w-full rounded-3xl border border-white/10 bg-[#0A1324]/80 p-8 text-center text-white/70 backdrop-blur-md">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
          <p className="mt-3 text-xs uppercase tracking-wider text-slate-400">Loading Quote Wizard...</p>
        </div>
      }
    >
      <QuoteAcquisitionHubContent {...props} />
    </React.Suspense>
  );
}
