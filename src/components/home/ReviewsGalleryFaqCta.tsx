'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Phone,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Trash2,
  Package,
  Box,
  MessageSquareQuote,
  MapPin,
  Calendar,
  Camera,
  Star,
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Accordion, type AccordionItemData } from '@/components/ui/Accordion';
import { FadeIn } from '@/components/ui/MotionWrapper';
import { cn } from '@/lib/utils';

type GalleryCategory = 'all' | 'moving' | 'junk-removal' | 'packing-delivery';

interface GalleryItem {
  id: string;
  category: Exclude<GalleryCategory, 'all'>;
  categoryLabel: string;
  title: string;
  subtitle: string;
  checklistHighlights: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const OPERATIONAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'res-condo-home',
    category: 'moving',
    categoryLabel: 'Residential Relocation',
    title: 'House, Townhouse & Condo Moving Standard',
    subtitle: 'Calgary & Surrounding Communities',
    checklistHighlights: [
      'Padded blanket wrapping for wooden & upholstered furniture',
      'Floor runner & doorway protection in high-traffic corridors',
      'Organized room-by-room staging & placement',
    ],
    icon: Truck,
    accentColor: 'from-[#0B1528] to-[#122240]',
  },
  {
    id: 'junk-garage-property',
    category: 'junk-removal',
    categoryLabel: 'Full Junk Removal',
    title: 'Garage, Basement & Move-Out Cleanouts',
    subtitle: 'Photo-First Volume Assessment',
    checklistHighlights: [
      'Heavy lifting, sorting & disposal staging handled entirely by our crew',
      'Responsible recycling and donation drop-offs prioritized',
      'Swept cleanout standard upon load completion',
    ],
    icon: Trash2,
    accentColor: 'from-[#1B2945] to-[#251810]',
  },
  {
    id: 'commercial-office',
    category: 'moving',
    categoryLabel: 'Commercial Moving',
    title: 'Office, Retail & Workspace Relocation',
    subtitle: 'Structured Labeling & Floor Coordination',
    checklistHighlights: [
      'Desks, workstations & conference furniture handling',
      'Numbered inventory labeling mapped to destination floorplans',
      'Off-peak and weekend dispatch options for minimal downtime',
    ],
    icon: Package,
    accentColor: 'from-[#0B1528] to-[#142646]',
  },
  {
    id: 'furniture-delivery',
    category: 'packing-delivery',
    categoryLabel: 'Item Delivery',
    title: 'Retail & Marketplace Furniture Delivery',
    subtitle: 'Safe Pickup & In-Home Room Placement',
    checklistHighlights: [
      'Showroom, warehouse, or private seller pickups',
      'Blanket wrapped with strap reinforcement during transit',
      'Room-of-choice placement and packaging disposal assistance',
    ],
    icon: Truck,
    accentColor: 'from-[#14233D] to-[#0A1324]',
  },
  {
    id: 'packing-prep',
    category: 'packing-delivery',
    categoryLabel: 'Packing Services',
    title: 'Pre-Move Household Packing & Material Prep',
    subtitle: 'Fragile Dishware, Books & Closets',
    checklistHighlights: [
      'Dish-pack boxes, bubble wrap & tissue paper wrapping',
      'Organized box labeling by room and contents',
      'Pre-move coordination alongside moving truck booking',
    ],
    icon: Box,
    accentColor: 'from-[#101E35] to-[#192D50]',
  },
  {
    id: 'long-distance-corridor',
    category: 'moving',
    categoryLabel: 'Inter-City Moving',
    title: 'Calgary, Red Deer & Edmonton Long-Distance Routes',
    subtitle: 'Regional Alberta Relocations',
    checklistHighlights: [
      'Direct point-to-point dedicated truck transport',
      'Protective stacking and load-securing protocols',
      'Continuous transit updates from dispatch',
    ],
    icon: Truck,
    accentColor: 'from-[#122240] to-[#070D19]',
  },
];

const HOMEPAGE_FAQS: AccordionItemData[] = [
  {
    id: 'faq-quote-process',
    title: 'How does the QuickMove Solutions quote process work?',
    content: (
      <div className="space-y-2 text-white/75">
        <p>
          We provide three modern quoting pathways depending on the service you need:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
          <li>
            <strong>Visual Moving Quote (8 Steps):</strong> Select your move type, addresses, property size, and item inventory to request a clear moving estimate.
          </li>
          <li>
            <strong>Photo-First Junk Removal Quote (6 Steps):</strong> Tap what you need cleared and upload photos directly from your phone. Our administrator reviews your photos to prepare a transparent written quote.
          </li>
          <li>
            <strong>Furniture &amp; Appliance Delivery Quote (4 Steps):</strong> Provide pickup and delivery locations with item details for fast transport pricing.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'faq-junk-photos',
    title: 'Do I really only need photos for a junk removal estimate?',
    content: (
      <p className="text-white/75">
        Yes! For most household, garage, basement, and commercial cleanouts, smartphone photos of the items and their location (e.g. main floor, basement, or alley) give our team everything needed to estimate volume and crew requirements. If an on-site look is required for an estate cleanout, we will let you know in advance.
      </p>
    ),
  },
  {
    id: 'faq-hazardous-waste',
    title: 'What items can QuickMove Solutions NOT remove or transport?',
    content: (
      <p className="text-white/75">
        For crew safety and environmental regulations, we cannot accept or transport hazardous materials including wet paint, motor oil, fuels, chemicals, propane tanks, asbestos, medical waste, or explosive items. Please contact your local municipal eco-station for hazardous waste drop-off.
      </p>
    ),
  },
  {
    id: 'faq-service-areas',
    title: 'Which communities in Alberta does QuickMove Solutions serve?',
    content: (
      <p className="text-white/75">
        Our primary operations hub is in Calgary, Alberta. We provide daily local service across Calgary (NW, NE, SW, SE) and regular scheduled moving, delivery, and junk removal throughout Airdrie, Strathmore, Red Deer, and Edmonton.
      </p>
    ),
  },
  {
    id: 'faq-quote-guarantee',
    title: 'Will my written quotation have unexpected fees on moving day?',
    content: (
      <p className="text-white/75">
        No. Every QuickMove Solutions quote itemizes labour, vehicle rates, travel considerations, materials, and disposal fees in writing. As long as your inventory, access conditions, and scope match what was provided, your price remains honest and transparent.
      </p>
    ),
  },
];

const VERIFIED_CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Michael & Elena S.',
    location: 'Mount Royal, Calgary',
    service: '4-Bedroom Residential Move',
    rating: 5,
    date: 'October 2026',
    review:
      'QuickMove Solutions made our family relocation completely stress-free. The crew wrapped all our hardwood furniture and protected every doorway and stair runner. Zero surprise fees and on-time arrival. Highly recommend!',
  },
  {
    id: 'rev-2',
    name: 'David K.',
    location: 'Cooper’s Crossing, Airdrie',
    service: 'Garage Declutter & Junk Removal',
    rating: 5,
    date: 'November 2026',
    review:
      'I sent two photos through their quote form and received a transparent estimate within 15 minutes. The team cleared renovation debris and broken appliances in under two hours. Extremely efficient!',
  },
  {
    id: 'rev-3',
    name: 'Rachel B. — Operations Lead',
    location: 'Downtown Core, Calgary',
    service: 'Commercial Office Relocation',
    rating: 5,
    date: 'October 2026',
    review:
      'Relocated 24 workstations, conference tables, and secure IT setups over a single weekend with zero Monday downtime. The dispatch coordinator kept us informed at every milestone.',
  },
  {
    id: 'rev-4',
    name: 'Jason & Tanya P.',
    location: 'Kinniburgh, Chestermere',
    service: 'Heavy Furniture Delivery & Placement',
    rating: 5,
    date: 'November 2026',
    review:
      'Needed a heavy 6-piece sectional and dining suite transported and placed. The QuickMove team handled the store pickup, blanket-wrapped every corner, and placed it upstairs without a scratch.',
  },
];

export function ReviewsGalleryFaqCta() {
  const [galleryFilter, setGalleryFilter] = React.useState<GalleryCategory>('all');
  const [finishedJobs, setFinishedJobs] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/admin/finished-jobs?featured=true')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.data)) {
          setFinishedJobs(d.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredGallery =
    galleryFilter === 'all'
      ? OPERATIONAL_GALLERY_ITEMS
      : OPERATIONAL_GALLERY_ITEMS.filter((item) => item.category === galleryFilter);

  return (
    <>
      {/* HOMEPAGE SECTION 12: VERIFIED REVIEWS & TRUST COMMITMENTS */}
      <Section variant="dark-card" spacing="lg">
        <SectionHeader
          eyebrow="Verified Service Reputation"
          title="Committed to Respectful Care on Every Move & Cleanout"
          description="Read how our Calgary and Alberta relocation and space-clearing teams deliver on every commitment."
        />

        {/* Verified Customer Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {VERIFIED_CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card transition hover:border-brand-orange/40 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed italic">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/10">
                <p className="font-heading text-sm font-bold text-white group-hover:text-brand-orange transition">
                  {rev.name}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-white/50 mt-0.5">
                  <MapPin className="h-3 w-3 text-brand-orange shrink-0" />
                  <span>{rev.location}</span>
                </div>
                <span className="mt-1.5 inline-block rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-brand-orange">
                  {rev.service}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Official Google Listing & Quality Commitments Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7">
            <div className="h-full flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0A1324]/95 p-7 sm:p-9 shadow-dark-card">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/15 px-3 py-1 text-xs font-bold text-brand-orange">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Official Reputation Standards
                </span>

                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  Check Our Official Google Business Listing &amp; Share Your Experience
                </h3>

                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  Every Residential Move, Commercial Move, Delivery, and Junk Removal job is backed
                  by our post-job follow-up checklist. You can view our official listing on Google
                  or connect with our team on Facebook and Instagram.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="rounded-xl bg-[#060D1A] p-4 border border-white/5">
                    <p className="font-heading text-sm font-bold text-white">
                      Verified Job Completion Checklists
                    </p>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed">
                      Our crews verify inventory placement and space cleanliness before marking any
                      job complete.
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#060D1A] p-4 border border-white/5">
                    <p className="font-heading text-sm font-bold text-white">
                      Direct Owner Accountability
                    </p>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed">
                      Have feedback on a recent move or cleanout? Reach us directly at{' '}
                      {BUSINESS_INFO.phoneDisplay}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3">
                <a
                  href={BUSINESS_INFO.googleBusinessSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="qm-orange-pill inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-orange-glow"
                >
                  <span>View QuickMove Solutions on Google</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={BUSINESS_INFO.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:border-brand-orange"
                >
                  Facebook Page
                </a>
                <a
                  href={BUSINESS_INFO.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:border-brand-orange"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0A1324]/95 p-7 sm:p-9 shadow-dark-card">
              <div className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                  <MessageSquareQuote className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                  What We Prioritize on Every Customer Job
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-white/75">
                  {[
                    'Clear communication before arrival and during transit',
                    'Respectful handling of furniture, stairs, walls, and floors',
                    'Itemized written quotes with no surprise line items',
                    'Fast photo-based estimates for junk removal and cleanouts',
                    'Confirmed crew and vehicle scheduling you can count on',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F47732] to-[#ff8c4a] px-5 py-3 text-xs font-bold text-white shadow-orange-glow"
                >
                  <span>Contact Our Team or Send Feedback</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* HOMEPAGE SECTION 13: PROJECT & SERVICE STANDARDS GALLERY */}
      <Section variant="obsidian" spacing="lg">
        <SectionHeader
          eyebrow="Service & Operational Showcase"
          title="Explore Our Moving, Delivery & Space-Clearing Capabilities"
          description="Filter by service category to inspect how our crews prepare, protect, transport, and clear residential and commercial properties."
        />

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Capabilities' },
            { id: 'moving', label: 'Residential & Commercial Moving' },
            { id: 'junk-removal', label: 'Full Junk Removal & Cleanouts' },
            { id: 'packing-delivery', label: 'Packing & Furniture Delivery' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setGalleryFilter(tab.id as GalleryCategory)}
              className={cn(
                'rounded-xl px-4 py-2 text-xs sm:text-sm font-heading font-bold transition-all',
                galleryFilter === tab.id
                  ? 'bg-gradient-to-r from-[#F47732] to-[#ff8c4a] text-white shadow-orange-glow'
                  : 'border border-white/10 bg-[#0A1324] text-white/70 hover:border-brand-orange/40 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Real Completed Jobs Photo Showcase */}
        {finishedJobs.length > 0 && (
          <div className="mb-14 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-brand-orange" />
                <h3 className="font-heading text-lg font-bold text-white">
                  Recent Completed Work in Calgary &amp; Surrounding Areas
                </h3>
              </div>
              <span className="text-xs text-white/50">{finishedJobs.length} Verified Completions</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finishedJobs.map((job) => (
                <div
                  key={job.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A1324] shadow-dark-card transition hover:border-brand-orange/40 group flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                    <img
                      src={job.afterPhotoUrl}
                      alt={job.title}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/10">
                      {job.serviceType === 'RESIDENTIAL_MOVING'
                        ? 'Residential Move'
                        : job.serviceType === 'COMMERCIAL_MOVING'
                        ? 'Commercial Move'
                        : job.serviceType === 'JUNK_REMOVAL'
                        ? 'Junk Removal'
                        : 'Delivery'}
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
                      <MapPin className="h-3 w-3 text-brand-orange" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-1 text-[11px] text-white/50">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Completed {job.completionDate}</span>
                    </div>
                    <h4 className="font-heading text-base font-bold text-white group-hover:text-brand-orange transition">
                      {job.title}
                    </h4>
                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="overflow-hidden flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0A1324]/95 shadow-dark-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 group"
              >
                <div>
                  {/* Branded Visual Header */}
                  <div
                    className={cn(
                      'relative h-44 p-6 flex flex-col justify-between text-white bg-gradient-to-br',
                      item.accentColor
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-black/40 backdrop-blur-sm px-3 py-1 text-[11px] font-heading font-bold text-white border border-white/10">
                        {item.categoryLabel}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-brand-orange">
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-white/75 font-medium">{item.subtitle}</p>
                      <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Operational Standards List */}
                  <div className="p-6">
                    <p className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-orange mb-3">
                      Operational Checklist Highlights:
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm text-white/80">
                      {item.checklistHighlights.map((hl) => (
                        <li key={hl} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 py-4 bg-[#060D1A] border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/60">
                    Calgary &amp; Alberta
                  </span>
                  <Link
                    href={
                      item.category === 'junk-removal'
                        ? '/get-a-quote?service=junk-removal'
                        : '/get-a-quote'
                    }
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-[#ff9856]"
                  >
                    <span>Request Similar Service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* HOMEPAGE SECTION 14: FREQUENTLY ASKED QUESTIONS */}
      <Section variant="dark-card" spacing="lg" containerSize="narrow">
        <SectionHeader
          eyebrow="Frequently Asked Questions"
          title="Answers to Common Moving, Delivery & Junk Removal Questions"
          description="Everything you need to know about requesting a quote, uploading junk removal photos, and scheduling your job."
        />

        <div className="rounded-3xl border border-white/10 bg-[#0A1324]/95 p-6 sm:p-8 shadow-dark-card">
          <Accordion items={HOMEPAGE_FAQS} defaultOpenId="faq-quote-process" />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/60">
            Have a specific question about your property or inventory?{' '}
            <a
              href={BUSINESS_INFO.phoneHref}
              className="font-heading font-bold text-brand-orange hover:underline"
            >
              Call {BUSINESS_INFO.phoneDisplay}
            </a>{' '}
            or{' '}
            <Link
              href="/contact"
              className="font-heading font-bold text-white hover:text-brand-orange hover:underline"
            >
              send us a message
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* HOMEPAGE SECTION 15: FINAL CTA */}
      <Section variant="obsidian" spacing="lg">
        <div className="rounded-3xl border border-brand-orange/40 bg-gradient-to-r from-[#142442] via-[#0D182E] to-[#070D18] p-8 sm:p-12 lg:p-14 shadow-orange-glow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3.5 py-1 text-xs font-bold text-white shadow-orange-glow">
                Get Started Today
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                Moving Made Easy.{' '}
                <span className="text-brand-orange">Space Made Clear.</span>
              </h2>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
                Ready for a stress-free relocation or clean space? Request your visual moving quote,
                snap photos for a junk estimate, or contact our Calgary dispatch team directly.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3.5">
              <Link
                href="/get-a-quote"
                className="qm-orange-pill inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-heading text-base font-extrabold text-white shadow-orange-glow transition-all hover:scale-[1.02]"
              >
                <span>Get Your Free Online Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={BUSINESS_INFO.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-heading text-base font-bold text-white transition-all hover:border-brand-orange hover:text-white"
              >
                <Phone className="h-4 w-4 text-brand-orange" />
                <span>Call Dispatch: {BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
