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

function GoogleGIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

const AUTHENTIC_GOOGLE_REVIEWS = [
  {
    id: 'g-rev-1',
    name: 'Mauren Eriwu Omere',
    initial: 'M',
    location: 'Calgary, AB',
    timeAgo: '19 weeks ago',
    rating: 5,
    review:
      'Honestly this movers are the best team, have work with , as hard as the job , they were smiling all the way .quick mover are the best in town and they are very careful with your stuffs',
    ownerReply:
      'Thank you so much for the wonderful review, Mauren! We are thrilled to hear that our team made your moving day easier...',
  },
  {
    id: 'g-rev-2',
    name: 'Karly Marshall',
    initial: 'K',
    location: 'Calgary, AB',
    timeAgo: '24 weeks ago',
    rating: 5,
    review:
      'Mark and AJ were great during my move! They were flexible with timing, fast, efficient and super friendly. Even the heavy pieces were handled with ease!',
    ownerReply:
      'Wow, thank you for such an incredible review! We’re so glad we are able to make your move easy and enjoyable.',
  },
  {
    id: 'g-rev-3',
    name: 'Double Kay',
    initial: 'D',
    location: 'Calgary, AB',
    timeAgo: '32 weeks ago',
    rating: 5,
    review:
      'Beautiful work with them, came right on time and worked exceptionally. Would recommend',
    ownerReply: 'Kay thank you nice working with you',
  },
  {
    id: 'g-rev-4',
    name: 'Automo Calgary',
    initial: 'A',
    location: 'Calgary, AB',
    timeAgo: '33 weeks ago',
    rating: 5,
    review:
      'Really nice guys, a pleasure to work with! Thank you! I\'d definitely recommend him!! :)',
    ownerReply: 'Thank you was nice working with you',
  },
  {
    id: 'g-rev-5',
    name: 'amma Ammathat',
    badge: 'Local Guide',
    initial: 'A',
    location: 'Calgary, AB',
    timeAgo: 'Oct 2025',
    rating: 5,
    review:
      'I am really grateful for this company. I was stuck with moving my stuff to new place . They showed up as they promised. Handled everything with care and peace of mind.',
    ownerReply:
      'Thank you so much, amma Ammathat, for your kind words and for choosing QuickMove Solutions!',
  },
  {
    id: 'g-rev-6',
    name: 'Tanko Kayode',
    initial: 'T',
    location: 'Calgary, AB',
    timeAgo: 'Oct 2025',
    rating: 5,
    review:
      'Very sharp and efficient movers, they delivered excellent services',
    ownerReply:
      'Thank you, Tanko Kayode, for your kind words and for recognizing our sharp and efficient team.',
  },
  {
    id: 'g-rev-7',
    name: 'Jeff Schuett',
    initial: 'J',
    location: 'Calgary, AB',
    timeAgo: 'Jul 2025',
    rating: 5,
    review:
      'Excellent Service - The team at Quickmove solutions were fantastic. They delivered a professional service while being courteous and careful with our belongings.',
    ownerReply:
      'Thank you so much, Jeff, for your kind words and for choosing QuickMove Solutions!',
  },
  {
    id: 'g-rev-8',
    name: 'Gerardo Ortiz Jr',
    initial: 'G',
    location: 'Calgary, AB',
    timeAgo: 'Jul 2025',
    rating: 5,
    review:
      'Really reliable moving company. Took care of everything with care',
    ownerReply:
      'Thank you so much for your kind words, Gerardo Ortiz Jr. We\'re delighted to hear from you!',
  },
  {
    id: 'g-rev-9',
    name: 'simran sandhu',
    badge: 'Local Guide',
    initial: 'S',
    location: 'Calgary, AB',
    timeAgo: 'Feb 2025',
    rating: 5,
    review:
      'It was awesome experience to work with Quick move solutions’s team. The service was amazing and will definitely recommend to everyone!',
    ownerReply:
      'Thank you so much, Simran, for your kind words and for sharing your awesome experience!',
  },
  {
    id: 'g-rev-10',
    name: 'Reggie Prasad',
    initial: 'R',
    location: 'Calgary, AB',
    timeAgo: 'Feb 2025',
    rating: 5,
    review:
      'Such amazing service super helpful quick and reliable definitely will be using them for all my moving needs',
    ownerReply:
      'Thank you so much, Reggie, for your kind words! We\'re thrilled to hear you found our service super helpful.',
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

        {/* Google Trust & 5.0 Rating Banner */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0A1324]/90 p-4 sm:p-5 shadow-dark-card">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/10 shadow-sm">
              <GoogleGIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl font-extrabold text-white">5.0</span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                  100% 5-Star Reviews
                </span>
              </div>
              <p className="mt-0.5 text-xs text-white/65">
                Official Google Business Reviews for QuickMove Solutions • Calgary &amp; Surrounding Areas
              </p>
            </div>
          </div>

          <a
            href={BUSINESS_INFO.googleBusinessSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:border-brand-orange hover:bg-brand-orange/10"
          >
            <span>Review Us on Google</span>
            <ExternalLink className="h-3.5 w-3.5 text-brand-orange" />
          </a>
        </div>

        {/* Auto-Scrolling Infinite Marquee Carousel */}
        <div className="relative mb-12 overflow-hidden py-3 group">
          {/* Fallback inline keyframes guarantee animation runs across all environments */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes qm-marquee-scroll {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .qm-marquee-track {
              display: flex !important;
              width: max-content !important;
              animation: qm-marquee-scroll 38s linear infinite !important;
              will-change: transform;
            }
            .qm-marquee-track:hover {
              animation-play-state: paused !important;
            }
          `}} />

          {/* Subtle gradient side fades */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 sm:w-24 bg-gradient-to-r from-[#05080D] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 sm:w-24 bg-gradient-to-l from-[#05080D] to-transparent" />

          {/* Continuous scrolling track */}
          <div 
            className="qm-marquee-track flex gap-5"
            style={{ animation: 'qm-marquee-scroll 38s linear infinite' }}
          >
            {[...AUTHENTIC_GOOGLE_REVIEWS, ...AUTHENTIC_GOOGLE_REVIEWS].map((rev, idx) => (
              <div
                key={`${rev.id}-${idx}`}
                className="w-[300px] sm:w-[350px] flex-shrink-0 flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 sm:p-6 shadow-dark-card transition-all duration-300 hover:border-brand-orange/50 hover:bg-[#0C172B]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <GoogleGIcon className="h-4 w-4" />
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-white/40">
                      {rev.timeAgo}
                    </span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-white/85 leading-relaxed">
                    &ldquo;{rev.review}&rdquo;
                  </p>

                  {rev.ownerReply && (
                    <div className="rounded-xl border border-white/5 bg-[#060D1A] p-2.5 text-[11px] text-white/60">
                      <p className="font-bold text-brand-orange text-[10px] uppercase tracking-wider mb-0.5">
                        Response from QuickMove:
                      </p>
                      <p className="italic line-clamp-2">&ldquo;{rev.ownerReply}&rdquo;</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F47732] to-[#B0430E] font-heading text-xs font-bold text-white shadow-sm">
                      {rev.initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-heading text-xs font-bold text-white">
                          {rev.name}
                        </p>
                        {rev.badge && (
                          <span className="rounded bg-brand-orange/20 px-1.5 py-0.5 text-[9px] font-bold text-brand-orange">
                            {rev.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/50">{rev.location}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                    Google Review
                  </span>
                </div>
              </div>
            ))}
          </div>
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
