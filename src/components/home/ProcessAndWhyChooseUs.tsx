'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  FileCheck2,
  CalendarCheck2,
  Truck,
  Camera,
  Trash2,
  ShieldCheck,
  Users,
  MapPin,
  Clock,
  Sparkles,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SERVICE_AREAS, BUSINESS_INFO } from '@/lib/constants/business';
import { Section, SectionHeader } from '@/components/ui/Section';
import { FadeIn } from '@/components/ui/MotionWrapper';
import { cn } from '@/lib/utils';

const MOVING_STEPS = [
  {
    step: 'Step 1',
    icon: ClipboardList,
    title: 'Request Your Visual Moving Quote',
    description:
      'Select your move type, pickup & destination addresses, property size, and inventory details in our guided step-by-step experience.',
  },
  {
    step: 'Step 2',
    icon: FileCheck2,
    title: 'Review Your Itemized Quotation',
    description:
      'Our team reviews your job details and prepares a clear, written quotation with transparent line items and terms.',
  },
  {
    step: 'Step 3',
    icon: CalendarCheck2,
    title: 'Confirm Booking & Crew Assignment',
    description:
      'Once you accept your quotation, dispatch confirms your date and assigns the appropriate moving crew and truck.',
  },
  {
    step: 'Step 4',
    icon: Truck,
    title: 'Careful Relocation & Completion',
    description:
      'Our team arrives within your scheduled window, protects your furniture and property, and completes your move with care.',
  },
];

const JUNK_STEPS = [
  {
    step: 'Step 1',
    icon: Camera,
    title: 'Select Categories & Upload Photos',
    description:
      'Choose what needs clearing and upload photos directly from your smartphone—no need to list every single box or item.',
  },
  {
    step: 'Step 2',
    icon: FileCheck2,
    title: 'Administrator Photo Assessment & Quote',
    description:
      'We inspect your photos, access conditions, and approximate volume to prepare a clear written estimate.',
  },
  {
    step: 'Step 3',
    icon: CalendarCheck2,
    title: 'Schedule Your Pickup Window',
    description:
      'Approve your quotation and lock in a confirmed collection date and time window with our dispatch team.',
  },
  {
    step: 'Step 4',
    icon: Trash2,
    title: 'Heavy Lifting & Space Cleared',
    description:
      'Our team loads and removes your approved items from indoors or outdoors, leaving your space clean and ready.',
  },
];

const WHY_CHOOSE_PILLARS = [
  {
    icon: Sparkles,
    title: 'Moving + Junk Removal in One Platform',
    description:
      'Coordinate your household or office move alongside pre-move decluttering, furniture delivery, and packing without hiring multiple contractors.',
  },
  {
    icon: FileCheck2,
    title: 'Itemized, Transparent Estimates',
    description:
      'No surprise fees on completion day. Every quote includes detailed line items, access details, and valid terms in writing.',
  },
  {
    icon: ShieldCheck,
    title: 'Dedicated Protective Equipment',
    description:
      'Heavy-duty moving blankets, professional floor runners, neoprene banister guards, and specialized appliance dollies on every truck.',
  },
  {
    icon: Camera,
    title: 'Photo-First Junk Assessment',
    description:
      'Snap photos on your phone and skip manual typing. Our team prepares volume estimates from your actual images.',
  },
  {
    icon: Users,
    title: 'Trained, Respectful Alberta Crews',
    description:
      'Experienced moving leads, careful drivers, and helpful junk removal specialists who treat your property with genuine respect.',
  },
  {
    icon: Clock,
    title: 'Reliable Scheduled Windows',
    description:
      'Real-time coordination and proactive communication so you always know when your crew is arriving.',
  },
];

const CITY_DETAILS: Record<
  string,
  {
    corridorTag: string;
    neighbourhoodNote: string;
    popularServices: string[];
  }
> = {
  calgary: {
    corridorTag: 'Primary Service Market (NW, NE, SW, SE)',
    neighbourhoodNote:
      'Full local crew coverage across Downtown, Beltline, inner-city communities, and suburban Calgary neighbourhoods.',
    popularServices: [
      'Condo, apartment & house residential moves',
      'Downtown & suburban office relocations',
      'Same-week photo-first junk removal & cleanouts',
      'Retail & marketplace furniture delivery',
    ],
  },
  airdrie: {
    corridorTag: 'North QEII Corridor Service Area',
    neighbourhoodNote:
      'Seamless local moves within Airdrie and commuter relocations between Airdrie and Calgary.',
    popularServices: [
      'Family home & townhouse relocations',
      'Calgary ↔ Airdrie commuter moves',
      'Garage, basement & move-out junk cleanouts',
      'Large furniture & appliance delivery',
    ],
  },
  strathmore: {
    corridorTag: 'East Trans-Canada (Hwy 1) Service Area',
    neighbourhoodNote:
      'Reliable residential moving, property cleanouts, and scheduled deliveries serving Strathmore and area.',
    popularServices: [
      'Residential house & acreage moves',
      'Calgary ↔ Strathmore relocations',
      'Property, shed & garage junk removal',
      'Scheduled furniture & equipment transport',
    ],
  },
  'red-deer': {
    corridorTag: 'Central Alberta QEII Corridor',
    neighbourhoodNote:
      'Coordinated inter-city moving and commercial transport connecting Calgary, Red Deer, and Central Alberta.',
    popularServices: [
      'Long-distance residential relocations',
      'Commercial & business equipment moves',
      'Pre-move packing & furniture protection',
      'Move-out property cleanout support',
    ],
  },
  edmonton: {
    corridorTag: 'Calgary ↔ Edmonton Inter-City Corridor',
    neighbourhoodNote:
      'Dedicated long-distance moving and relocation coordination between Calgary and Edmonton.',
    popularServices: [
      'Calgary to Edmonton household relocations',
      'Edmonton to Calgary residential moves',
      'Commercial office & workspace transfers',
      'Full packing & protective load preparation',
    ],
  },
};

export function ProcessAndWhyChooseUs() {
  const [journeyType, setJourneyType] = React.useState<'moving' | 'junk'>('moving');
  const [selectedCityId, setSelectedCityId] = React.useState<string>('calgary');

  const steps = journeyType === 'moving' ? MOVING_STEPS : JUNK_STEPS;
  const activeArea =
    SERVICE_AREAS.find((a) => a.id === selectedCityId) ?? SERVICE_AREAS[0];
  const activeCityDetail = CITY_DETAILS[activeArea.id] ?? CITY_DETAILS.calgary;

  return (
    <>
      {/* HOMEPAGE SECTION 9: HOW IT WORKS */}
      <Section variant="obsidian" spacing="lg">
        <SectionHeader
          eyebrow="Simple, Structured Process"
          title="How QuickMove Solutions Works"
          description="From your first online quote request to final job completion, every step is tracked clearly."
        />

        {/* Journey Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-2xl bg-[#060B16] p-1.5 border border-white/10 shadow-sm">
            <button
              type="button"
              onClick={() => setJourneyType('moving')}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-heading font-bold transition-all',
                journeyType === 'moving'
                  ? 'bg-gradient-to-r from-[#F47732] to-[#ff8c4a] text-white shadow-orange-glow'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <Truck className="h-4 w-4" />
              <span>Moving &amp; Delivery Process</span>
            </button>
            <button
              type="button"
              onClick={() => setJourneyType('junk')}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-heading font-bold transition-all',
                journeyType === 'junk'
                  ? 'bg-gradient-to-r from-[#F47732] to-[#ff8c4a] text-white shadow-orange-glow'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <Camera className="h-4 w-4" />
              <span>Photo Junk Removal Process</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={idx * 0.06}>
                <div className="h-full flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:bg-[#0D1A30]">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-brand-orange/20 border border-brand-orange/40 px-3 py-1 font-mono text-xs font-bold text-brand-orange">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-white/65 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={
              journeyType === 'moving'
                ? '/get-a-quote?service=residential-moving'
                : '/get-a-quote?service=junk-removal'
            }
            className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-8 py-4 font-heading text-base font-extrabold text-white shadow-orange-glow transition-all hover:scale-[1.02]"
          >
            <span>
              {journeyType === 'moving'
                ? 'Start Your Visual Moving Quote'
                : 'Start Your Photo Junk Removal Quote'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* HOMEPAGE SECTION 10: WHY CHOOSE QUICKMOVE SOLUTIONS */}
      <Section variant="dark-card" spacing="lg">
        <SectionHeader
          eyebrow="Why Choose QuickMove Solutions"
          title="Designed Around Reliability, Care & Customer Convenience"
          description="We combine attentive on-site moving and cleanout crews with a modern quoting and scheduling experience."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <FadeIn key={pillar.title} delay={idx * 0.05}>
                <div className="h-full rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card space-y-3 transition-all hover:border-brand-orange/40 hover:bg-[#0D1A30]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* HOMEPAGE SECTION 11: SERVICE AREAS */}
      <Section variant="obsidian" spacing="lg">
        <SectionHeader
          eyebrow="Service Coverage Across Alberta"
          title="Calgary Headquarters &amp; Four Dedicated Service Corridors"
          description="Based in Calgary with structured scheduling across Airdrie, Strathmore, Red Deer, and Edmonton."
        />

        {/* City Selector Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {SERVICE_AREAS.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => setSelectedCityId(area.id)}
              className={cn(
                'rounded-full px-5 py-2.5 text-xs sm:text-sm font-heading font-bold transition-all',
                selectedCityId === area.id
                  ? 'bg-gradient-to-r from-[#F47732] to-[#ff8c4a] text-white shadow-orange-glow'
                  : 'border border-white/10 bg-[#0A1324] text-white/70 hover:border-brand-orange/40 hover:text-white'
              )}
            >
              {area.city}
            </button>
          ))}
        </div>

        {/* Active City Detail Panel */}
        <div className="rounded-3xl border border-white/10 bg-[#0A1324]/95 p-6 sm:p-10 shadow-dark-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/15 px-3 py-1 text-xs font-bold text-brand-orange">
              <MapPin className="h-3.5 w-3.5" />
              {activeCityDetail.corridorTag}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Moving, Junk Removal &amp; Delivery in {activeArea.city}
            </h3>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              {activeCityDetail.neighbourhoodNote}
            </p>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-orange">
                Popular Services in this Area:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-white/85">
                {activeCityDetail.popularServices.map((svc) => (
                  <div key={svc} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" />
                    <span>{svc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href={`/get-a-quote?city=${activeArea.city}`}
                className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-orange-glow"
              >
                <span>Get a Quote in {activeArea.city}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={activeArea.href}
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs sm:text-sm font-bold text-white/80 hover:border-brand-orange hover:text-white"
              >
                Explore {activeArea.city} Hub
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#060D1A] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-heading font-bold text-white">Coverage Zone</span>
              <span className="font-mono text-xs text-brand-orange">Verified Operations</span>
            </div>
            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-center justify-between">
                <span>Estimated Response Time</span>
                <span className="font-bold text-white">Under 2 Hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Dispatch Availability</span>
                <span className="font-bold text-emerald-400">Monday – Sunday</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Primary Dispatch Hub</span>
                <span className="font-bold text-white">{BUSINESS_INFO.primaryLocation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Direct Phone Line</span>
                <span className="font-bold text-brand-orange">{BUSINESS_INFO.phoneDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
