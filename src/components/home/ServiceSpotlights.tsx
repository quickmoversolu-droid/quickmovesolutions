'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Home,
  Building2,
  Trash2,
  Camera,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sofa,
  Monitor,
  Boxes,
  Clock,
} from 'lucide-react';
import { JUNK_REMOVAL_DISCLAIMER } from '@/lib/constants/business';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { FadeIn } from '@/components/ui/MotionWrapper';
import { cn } from '@/lib/utils';

const JUNK_CATEGORIES = [
  'Furniture & Couches',
  'Sofas & Sectionals',
  'Mattresses & Box Springs',
  'Household Appliances',
  'Garage Cleanouts',
  'Basement Cleanouts',
  'Storage Unit Cleanouts',
  'Office Furniture & Junk',
  'Move-Out Cleanouts',
  'Property Turnover Cleanouts',
];

export function ServiceSpotlights() {
  const [movingTab, setMovingTab] = React.useState<'residential' | 'commercial'>('residential');

  return (
    <>
      {/* HOMEPAGE SECTION 6: RESIDENTIAL AND COMMERCIAL MOVING */}
      <Section variant="dark-card" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <FadeIn className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/15 px-3.5 py-1 text-xs font-bold text-brand-orange">
              Residential &amp; Commercial Moving
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Tailored Moving Plans for Households and Business Workspaces
            </h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Every property has unique access, inventory, and timing requirements. Switch between
              our residential and commercial moving workflows below to see how we prepare for your
              relocation.
            </p>

            {/* Interactive Switcher */}
            <div className="inline-flex rounded-2xl bg-[#060B16] p-1.5 border border-white/10 shadow-sm">
              <button
                type="button"
                onClick={() => setMovingTab('residential')}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-heading font-bold transition-all',
                  movingTab === 'residential'
                    ? 'bg-gradient-to-r from-[#F47732] to-[#ff8c4a] text-white shadow-orange-glow'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <Home className="h-4 w-4" />
                <span>Residential Moving</span>
              </button>
              <button
                type="button"
                onClick={() => setMovingTab('commercial')}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-heading font-bold transition-all',
                  movingTab === 'commercial'
                    ? 'bg-gradient-to-r from-[#F47732] to-[#ff8c4a] text-white shadow-orange-glow'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <Building2 className="h-4 w-4" />
                <span>Commercial Moving</span>
              </button>
            </div>

            {movingTab === 'residential' ? (
              <div className="space-y-4 pt-1">
                <h3 className="font-heading text-xl font-extrabold text-white">
                  Apartments, Condos, Townhouses &amp; Family Homes
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  Whether you are navigating a downtown Calgary condo elevator booking window or
                  relocating a four-bedroom family house, our crew protects doorways, stairs, and
                  furniture at every step.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
                  {[
                    'Studio, 1–5+ bedroom household moves',
                    'Elevator & loading dock time-window coordination',
                    'Blanket wrapping & mattress/sofa protection',
                    'Optional packing & unpacking assistance',
                    'Local Calgary & Alberta long-distance options',
                    'Combine with pre-move junk removal cleanout',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    href="/get-a-quote?service=residential-moving"
                    className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold text-white shadow-orange-glow"
                  >
                    <span>Start Residential Moving Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/residential-moving"
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/80 hover:border-brand-orange hover:text-white"
                  >
                    Residential Moving Guide
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <h3 className="font-heading text-xl font-extrabold text-white">
                  Offices, Retail Spaces, Workstations &amp; Equipment
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  We help small and mid-sized businesses relocate offices, commercial furniture, and
                  workspace equipment with structured room labeling and coordinated scheduling.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
                  {[
                    'Commercial office & retail workspace relocations',
                    'Desk, cubicle & file-cabinet moving',
                    'Dedicated project coordination & labeled placement',
                    'Evening & weekend moves to minimize downtime',
                    'Direct delivery between commercial facilities',
                    'Decommissioning & office junk removal cleanouts',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    href="/get-a-quote?service=commercial-moving"
                    className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold text-white shadow-orange-glow"
                  >
                    <span>Start Commercial Moving Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/commercial-moving"
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/80 hover:border-brand-orange hover:text-white"
                  >
                    Commercial Moving Overview
                  </Link>
                </div>
              </div>
            )}
          </FadeIn>

          {/* Right Column: Visual Checklist Cards */}
          <FadeIn delay={0.1} className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div
              className={`rounded-2xl p-6 transition-all duration-300 border ${
                movingTab === 'residential'
                  ? 'border-brand-orange bg-[#0D1B36] shadow-orange-glow'
                  : 'border-white/10 bg-[#0A1324]/90 text-white/80'
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30 mb-4">
                <Home className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">
                Household Moving Checklist
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/65">
                Full-service protection for your belongings, furniture padding, floor runners, and
                elevator-coordinated timing.
              </p>
              <div className="pt-4 space-y-2 text-xs text-white/80">
                <div className="rounded-lg bg-black/30 px-3 py-2 flex items-center justify-between border border-white/5">
                  <span>Property Size Selection</span>
                  <span className="font-bold text-brand-orange">Studio → 5+ Bed</span>
                </div>
                <div className="rounded-lg bg-black/30 px-3 py-2 flex items-center justify-between border border-white/5">
                  <span>Packing &amp; Unpacking</span>
                  <span className="font-bold text-brand-orange">Available</span>
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl p-6 transition-all duration-300 border ${
                movingTab === 'commercial'
                  ? 'border-brand-orange bg-[#0D1B36] shadow-orange-glow'
                  : 'border-white/10 bg-[#0A1324]/90 text-white/80'
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30 mb-4">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">
                Commercial Relocation Checklist
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/65">
                Organized zone-by-zone moving for offices, workstations, commercial equipment, and
                workspace transitions.
              </p>
              <div className="pt-4 space-y-2 text-xs text-white/80">
                <div className="rounded-lg bg-black/30 px-3 py-2 flex items-center justify-between border border-white/5">
                  <span>Written Itemized Quote</span>
                  <span className="font-bold text-brand-orange">Included</span>
                </div>
                <div className="rounded-lg bg-black/30 px-3 py-2 flex items-center justify-between border border-white/5">
                  <span>Office Cleanout Add-On</span>
                  <span className="font-bold text-brand-orange">Supported</span>
                </div>
              </div>
            </div>

            {/* Bottom Span Card: Local & Long-Distance Corridors */}
            <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-dark-card">
              <div className="space-y-1">
                <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-orange">
                  Local &amp; Long-Distance Routes
                </span>
                <h4 className="font-heading text-base font-bold text-white">
                  Moving within Calgary or between Airdrie, Strathmore, Red Deer &amp; Edmonton?
                </h4>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/local-moving"
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:border-brand-orange"
                >
                  Local Moves
                </Link>
                <Link
                  href="/long-distance-moving"
                  className="rounded-full bg-brand-orange/20 border border-brand-orange/40 px-4 py-2 text-xs font-bold text-brand-orange hover:bg-brand-orange hover:text-white"
                >
                  Long-Distance
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* HOMEPAGE SECTION 7: DEDICATED JUNK REMOVAL FEATURE */}
      <Section variant="obsidian" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <FadeIn className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-1 text-xs font-bold text-white shadow-orange-glow">
                <Camera className="h-3.5 w-3.5" />
                Photo-First Junk Removal Experience
              </span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                Standalone Full-Service Line
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Need Space Cleared Fast?{' '}
              <span className="text-brand-orange">Send Photos for a Junk Removal Estimate.</span>
            </h2>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Junk removal at QuickMove Solutions is a complete service line—not just an afterthought.
              Whether you are clearing out an old sectional sofa, replacing appliances, reclaiming a
              packed garage, or handling a full move-out property cleanout, you don&apos;t need to
              type out a complicated inventory list.
            </p>

            {/* Approved Junk Removal Categories Pills */}
            <div>
              <p className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-orange mb-3">
                Common Junk Removal &amp; Cleanout Jobs We Handle:
              </p>
              <div className="flex flex-wrap gap-2">
                {JUNK_CATEGORIES.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0A1324] px-3 py-1.5 text-xs font-medium text-white/85"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange" />
                    <span>{category}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/get-a-quote?service=junk-removal"
                className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-heading text-sm sm:text-base font-extrabold text-white shadow-orange-glow"
              >
                <Camera className="h-4 w-4" />
                <span>Start Photo Junk Removal Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/junk-removal"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/80 hover:border-brand-orange hover:text-white"
              >
                View Junk Removal Service
              </Link>
            </div>

            {/* Hazardous Waste Compliance Notice */}
            <div className="rounded-2xl border border-white/10 bg-[#060D1A] p-4 flex items-start gap-3 text-xs text-white/65">
              <ShieldAlert className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
              <p className="leading-relaxed">{JUNK_REMOVAL_DISCLAIMER}</p>
            </div>
          </FadeIn>

          {/* Right Column: 3-Step Photo Estimate Visual Card */}
          <FadeIn delay={0.1} className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-[#0A1324]/95 p-7 shadow-dark-card space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-orange">
                    Mobile-Friendly Flow
                  </span>
                  <h3 className="font-heading text-xl font-extrabold text-white mt-0.5">
                    How Photo Junk Quotes Work
                  </h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange text-white shadow-orange-glow">
                  <Trash2 className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    step: '01',
                    title: 'Select Item Categories',
                    desc: 'Tap furniture, mattresses, appliances, garage clutter, or full property cleanout.',
                  },
                  {
                    step: '02',
                    title: 'Snap or Upload Photos',
                    desc: 'Take photos right from your phone so our team can see item types and approximate volume.',
                  },
                  {
                    step: '03',
                    title: 'Share Access & Receive Your Quote',
                    desc: 'Tell us whether items are indoors, outdoors, or down stairs, and receive an itemized quotation.',
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="flex items-start gap-3.5 rounded-xl bg-[#060D1A] p-4 border border-white/5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange/20 font-mono text-xs font-bold text-brand-orange border border-brand-orange/30">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-white">{s.title}</h4>
                      <p className="mt-1 text-xs text-white/60 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/get-a-quote?service=junk-removal"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F47732] to-[#ff8c4a] px-5 py-3.5 text-sm font-bold text-white shadow-orange-glow"
              >
                <span>Try the Photo-First Junk Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* HOMEPAGE SECTION 8: DELIVERY SERVICES */}
      <Section variant="dark-card" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <FadeIn className="lg:col-span-5 space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/15 px-3.5 py-1 text-xs font-bold text-brand-orange">
              Furniture &amp; Large-Item Delivery
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Bought Something Heavy? We Handle the Pickup &amp; Delivery.
            </h2>
            <p className="text-base text-white/70 leading-relaxed">
              Not every job is a full household move. QuickMove Solutions provides dedicated pickup
              and drop-off delivery services for large furniture, appliances, retail purchases, and
              commercial deliveries across Calgary and nearby communities.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/get-a-quote?service=delivery-services"
                className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold text-white shadow-orange-glow"
              >
                <span>Request a Delivery Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/delivery-services"
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/80 hover:border-brand-orange hover:text-white"
              >
                Delivery Service Details
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: Sofa,
                title: 'Store & Marketplace Furniture',
                desc: 'Purchased a sofa, dining table, or bedroom set from a showroom or private seller? We pick it up and bring it inside.',
              },
              {
                icon: Boxes,
                title: 'Appliances & Heavy Household Items',
                desc: 'Safe transport with proper dollies, straps, and protective blankets for large household items.',
              },
              {
                icon: Monitor,
                title: 'Business & Commercial Deliveries',
                desc: 'Scheduled B2B equipment, office furniture, and commercial supply pickups and drop-offs.',
              },
              {
                icon: Clock,
                title: 'Coordinated Pickup & Drop-Off Windows',
                desc: 'Clear communication with both pickup and destination contacts so your delivery arrives smoothly.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-[#0A1324]/90 p-6 space-y-3 shadow-dark-card transition-all hover:border-brand-orange/40 hover:bg-[#0D1A30]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-base font-extrabold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
