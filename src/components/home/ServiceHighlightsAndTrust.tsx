'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Truck,
  Trash2,
  Package,
  Box,
  Building2,
  MapPin,
  Route,
  ArrowRight,
  ShieldCheck,
  FileText,
  Camera,
  CalendarCheck,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { BUSINESS_INFO, OFFICIAL_SERVICES } from '@/lib/constants/business';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/ui/MotionWrapper';

const SERVICE_HIGHLIGHTS = [
  {
    title: 'Residential & Commercial Moving',
    subtitle: 'Homes, Condos, Apartments & Offices',
    description:
      'Organized local and inter-city moving with protective wrapping, floor runners, and structured scheduling.',
    href: '/moving-services',
    quoteHref: '/get-a-quote?service=residential-moving',
    ctaLabel: 'Start Moving Quote',
    icon: Truck,
  },
  {
    title: 'Full Junk Removal',
    subtitle: 'Photo-First Estimate Experience',
    description:
      'Clear furniture, mattresses, appliances, garages, basements, and full properties. Just snap photos for an estimate.',
    href: '/junk-removal',
    quoteHref: '/get-a-quote?service=junk-removal',
    ctaLabel: 'Upload Junk Photos',
    icon: Trash2,
    featured: true,
  },
  {
    title: 'Furniture & Item Delivery',
    subtitle: 'Store-to-Home & Business Transport',
    description:
      'Reliable pickup, blanket-wrapped transport, and room-of-choice placement for heavy furniture and large orders.',
    href: '/delivery-services',
    quoteHref: '/get-a-quote?service=delivery-services',
    ctaLabel: 'Request Delivery',
    icon: Package,
  },
  {
    title: 'Packing & Unpacking',
    subtitle: 'Careful Household Preparation',
    description:
      'Save days of stress before moving day with partial or full-home packing assistance and furniture protection.',
    href: '/packing-unpacking',
    quoteHref: '/get-a-quote?service=packing-unpacking',
    ctaLabel: 'Add Packing Help',
    icon: Box,
  },
];

const VERIFIED_TRUST_PILLARS = [
  {
    icon: MapPin,
    title: 'Calgary Primary Hub + 4 Corridors',
    description:
      'Based in Calgary, Alberta and actively serving Airdrie, Strathmore, Red Deer, and Edmonton.',
  },
  {
    icon: FileText,
    title: 'Clear Itemized Written Quotations',
    description:
      'Every quotation clearly details labour, vehicle, materials, or removal scope before you commit.',
  },
  {
    icon: Camera,
    title: 'Photo-First Junk Removal Estimates',
    description:
      'Skip typing out long item lists — upload smartphone photos for administrator review and clear pricing.',
  },
  {
    icon: CalendarCheck,
    title: 'Authorized Crew & Fleet Scheduling',
    description:
      'Bookings are confirmed against real team and truck availability so your scheduled window is protected.',
  },
];

function getServiceIcon(slug: string) {
  switch (slug) {
    case 'residential-moving':
      return <Truck className="h-5 w-5" />;
    case 'commercial-moving':
      return <Building2 className="h-5 w-5" />;
    case 'local-moving':
      return <MapPin className="h-5 w-5" />;
    case 'long-distance-moving':
      return <Route className="h-5 w-5" />;
    case 'packing-unpacking':
      return <Box className="h-5 w-5" />;
    case 'delivery-services':
      return <Package className="h-5 w-5" />;
    case 'junk-removal':
      return <Trash2 className="h-5 w-5" />;
    default:
      return <Truck className="h-5 w-5" />;
  }
}

export function ServiceHighlightsAndTrust() {
  return (
    <>
      {/* HOMEPAGE SECTION 3: SERVICE HIGHLIGHTS */}
      <Section variant="obsidian" spacing="md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={idx * 0.06}>
                <div
                  className={`h-full flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                    item.featured
                      ? 'bg-gradient-to-b from-[#142442] to-[#0A1324] border-2 border-brand-orange shadow-orange-glow'
                      : 'bg-[#0A1324]/95 border border-white/10 shadow-dark-card hover:border-brand-orange/50 hover:bg-[#0E1A30]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-brand-orange">
                        {item.subtitle}
                      </span>
                    </div>
                    <h2 className="font-heading text-lg font-extrabold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <Link
                      href={item.quoteHref}
                      className="inline-flex items-center gap-1.5 font-heading text-xs sm:text-sm font-bold text-brand-orange hover:text-[#ff9856]"
                    >
                      <span>{item.ctaLabel}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={item.href}
                      className="text-xs font-semibold text-white/50 hover:text-white"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* HOMEPAGE SECTION 4: TRUST INDICATORS USING VERIFIED INFORMATION */}
      <Section variant="dark-card" spacing="md">
        <div className="rounded-3xl border border-white/10 bg-[#0A1324]/95 p-6 sm:p-10 shadow-dark-card">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/15 px-3.5 py-1 text-xs font-bold text-brand-orange">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Service Commitments
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Built on Clear Planning, Honest Quotations &amp; Reliable Execution
              </h2>
              <p className="text-sm sm:text-base text-white/70">
                Every move, delivery, and junk removal job in {BUSINESS_INFO.primaryLocation} and
                surrounding Alberta communities follows a structured operational checklist.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={BUSINESS_INFO.phoneHref}
                className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-6 py-3 font-heading text-sm font-bold text-white shadow-orange-glow"
              >
                <Phone className="h-4 w-4" />
                <span>Speak With Dispatch: {BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {VERIFIED_TRUST_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/65">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* HOMEPAGE SECTION 5: MAIN SERVICES */}
      <Section variant="obsidian" spacing="lg">
        <SectionHeader
          eyebrow="Complete Relocation & Space-Clearing Platform"
          title="Seven Specialized Services Under One Roof"
          description="Whether you are moving a family home, relocating a commercial workspace, having new furniture delivered, or clearing out years of clutter, QuickMove Solutions handles it."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFICIAL_SERVICES.map((service, index) => {
            const isJunkRemoval = service.id === 'junk-removal';
            return (
              <FadeIn
                key={service.id}
                delay={index * 0.05}
                className={isJunkRemoval ? 'md:col-span-2 lg:col-span-3' : ''}
              >
                {isJunkRemoval ? (
                  /* Featured Full-Width Card for Complete Junk Removal Line */
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 rounded-3xl border-2 border-brand-orange bg-gradient-to-r from-[#142442] via-[#0D182E] to-[#070D18] p-7 sm:p-9 shadow-orange-glow">
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand-orange px-3.5 py-0.5 text-xs font-heading font-extrabold text-white">
                          Complete Standalone Service Line
                        </span>
                        <span className="rounded-full border border-white/20 bg-white/5 px-3 py-0.5 text-xs font-semibold text-white/80">
                          Photo-First Estimate
                        </span>
                      </div>
                      <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                        {service.name}: Space Made Clear Without the Heavy Lifting
                      </h3>
                      <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs sm:text-sm text-white/90">
                        {service.highlights.map((hl) => (
                          <div key={hl} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                      <Link
                        href={service.quoteHref}
                        className="qm-orange-pill inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold text-white shadow-orange-glow transition-all hover:scale-[1.02]"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Upload Photos for Junk Estimate</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href={service.href}
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/90 transition-all hover:border-brand-orange hover:text-white"
                      >
                        Explore Junk Removal Service
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50 hover:bg-[#0E1A30]">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                          {getServiceIcon(service.slug)}
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-white/70">
                          {service.shortName}
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-extrabold text-white">
                        {service.name}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
                        {service.description}
                      </p>

                      <ul className="mt-4 space-y-2 text-xs sm:text-sm text-white/80">
                        {service.highlights.map((hl) => (
                          <li key={hl} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                      <Link
                        href={service.href}
                        className="inline-flex items-center gap-1 text-xs font-bold text-white/60 hover:text-brand-orange transition-colors"
                      >
                        <span>Service Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={service.quoteHref}
                        className="rounded-full bg-brand-orange/20 border border-brand-orange/40 px-3.5 py-1 text-xs font-bold text-brand-orange hover:bg-brand-orange hover:text-white transition-all"
                      >
                        Get Quote
                      </Link>
                    </div>
                  </div>
                )}
              </FadeIn>
            );
          })}
        </div>
      </Section>
    </>
  );
}
