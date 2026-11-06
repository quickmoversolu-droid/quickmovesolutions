import * as React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  Camera,
  Truck,
  Trash2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  OFFICIAL_SERVICES,
  SERVICE_AREAS,
} from '@/lib/constants/business';
import { LocationPageDetail } from '@/lib/data/location-pages-data';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { IconBox } from '@/components/ui/IconBox';

export interface LocationPageTemplateProps {
  data: LocationPageDetail;
}

export function LocationPageTemplate({ data }: LocationPageTemplateProps) {
  const baseUrl = BUSINESS_INFO.website.replace(/\/$/, '');
  const pageUrl = `${baseUrl}/${data.slug}`;

  const localSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Service Areas',
            item: `${baseUrl}/service-areas`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${data.city} Movers & Junk Removal`,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': ['MovingCompany', 'LocalBusiness'],
        name: `${BUSINESS_INFO.name} - ${data.city}`,
        url: pageUrl,
        telephone: BUSINESS_INFO.phoneE164,
        email: BUSINESS_INFO.email,
        priceRange: '$$',
        areaServed: {
          '@type': 'City',
          name: data.city,
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: 'Alberta, Canada',
          },
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: data.city,
          addressRegion: data.province,
          addressCountry: 'CA',
        },
        description: data.metaDescription,
      },
      ...(data.faqs && data.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: data.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: typeof faq.answer === 'string' ? faq.answer : '',
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />
      {/* 1. Location Hero */}
      <Section variant="navy-mesh" spacing="lg">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs text-brand-navy-200"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-brand-orange" />
          <Link href="/service-areas" className="hover:text-white transition-colors">
            Service Areas
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-brand-orange" />
          <span className="font-semibold text-white">
            {data.city}, {data.province}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge
                variant="orange-solid"
                icon={<MapPin className="h-3.5 w-3.5" />}
              >
                {data.eyebrow}
              </Badge>
              <Badge variant="outline" className="border-white/25 text-white">
                {data.corridorBadge}
              </Badge>
            </div>

            <h1 className="font-heading text-display-xl text-white">
              {data.heroHeadline}{' '}
              <span className="text-brand-orange">{data.heroHighlight}</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-brand-navy-100 leading-relaxed max-w-2xl">
              {data.heroDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                href={`/get-a-quote?city=${encodeURIComponent(data.city)}`}
                variant="primary"
                size="xl"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Get a {data.city} Moving Quote
              </Button>
              <Button
                href={`/get-a-quote?service=junk-removal&city=${encodeURIComponent(data.city)}`}
                variant="white"
                size="xl"
                leftIcon={<Camera className="h-5 w-5 text-brand-orange" />}
              >
                Photo Junk Removal Quote
              </Button>
              <Button
                href={BUSINESS_INFO.phoneHref}
                variant="outline-light"
                size="xl"
                leftIcon={<Phone className="h-5 w-5 text-brand-orange" />}
              >
                {BUSINESS_INFO.phoneDisplay}
              </Button>
            </div>
          </div>

          {/* Right Column: Honest Service Area Representation Card */}
          <div className="lg:col-span-5">
            <Card variant="default" padding="lg" className="border-t-4 border-t-brand-orange space-y-5 bg-[#0B162C]/95 border-white/15 shadow-2xl">
              <div className="flex items-center justify-between">
                <Badge variant={data.isPrimaryMarket ? 'orange-solid' : 'orange'}>
                  {data.isPrimaryMarket ? 'Primary Headquarters Market' : 'Verified Regional Service Area'}
                </Badge>
                <ShieldCheck className="h-5 w-5 text-brand-orange" />
              </div>

              <h2 className="font-heading text-xl font-bold text-white">
                QuickMove Solutions in {data.city}, {data.province}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {data.corridorNotes}
              </p>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Dispatch Phone:</span>
                  <a
                    href={BUSINESS_INFO.phoneHref}
                    className="font-heading font-bold text-brand-orange hover:underline"
                  >
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Official Email:</span>
                  <a
                    href={BUSINESS_INFO.emailHref}
                    className="text-white hover:text-brand-orange"
                  >
                    {BUSINESS_INFO.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Primary Operations Hub:</span>
                  <span className="text-slate-300">{BUSINESS_INFO.primaryLocation}</span>
                </div>
              </div>

              <Button
                href={`/get-a-quote?city=${encodeURIComponent(data.city)}`}
                variant="secondary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Start Your {data.city} Quote Request
              </Button>
            </Card>
          </div>
        </div>
      </Section>

      {/* 2. Unique City Overview & Local Logistics Cards */}
      <Section variant="white" spacing="lg">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <Badge variant="orange">Local &amp; Regional Expertise</Badge>
          <h2 className="font-heading text-heading-1 text-white font-extrabold">
            {data.overviewTitle}
          </h2>
          {data.overviewParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <h3 className="font-heading text-heading-2 text-white font-extrabold text-center mb-8">
          {data.localLogisticsTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.localLogisticsCards.map((card) => (
            <Card key={card.title} variant="grey" padding="md" className="space-y-3">
              <IconBox variant="navy" size="sm">
                <Truck className="h-4 w-4 text-brand-orange" />
              </IconBox>
              <CardTitle className="text-white font-bold">{card.title}</CardTitle>
              <p className="text-sm text-slate-300 leading-relaxed">
                {card.description}
              </p>
              <ul className="pt-2 space-y-2 text-xs sm:text-sm text-slate-200">
                {card.highlights.map((hl) => (
                  <li key={hl} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* 3. Dedicated City Junk Removal Spotlight */}
      <Section variant="navy" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <Badge variant="orange-solid" icon={<Camera className="h-3.5 w-3.5" />}>
              Photo-First Junk Removal in {data.city}
            </Badge>
            <h2 className="font-heading text-heading-1 text-white">
              {data.junkRemovalSpotlight.title}
            </h2>
            <p className="text-base text-brand-navy-100 leading-relaxed">
              {data.junkRemovalSpotlight.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {data.junkRemovalSpotlight.commonRequests.map((req) => (
                <div
                  key={req}
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 p-3 text-xs sm:text-sm text-white"
                >
                  <Trash2 className="h-4 w-4 text-brand-orange shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <Card variant="default" padding="lg" className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-white">
                Request a {data.city} Junk Removal Estimate
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Upload photos from your phone, pick an approximate volume range, and receive an
                administrator-reviewed quotation.
              </p>
              <Button
                href={`/get-a-quote?service=junk-removal&city=${encodeURIComponent(data.city)}`}
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<Camera className="h-4 w-4" />}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Upload Photos for {data.city} Estimate
              </Button>
              <Button href="/junk-removal" variant="outline" size="md" fullWidth>
                Learn More About Junk Removal
              </Button>
            </Card>
          </div>
        </div>
      </Section>

      {/* 4. All Services Available in This City */}
      <Section variant="grey" spacing="lg">
        <SectionHeader
          eyebrow={`Full Service Lineup in ${data.city}`}
          title={`All QuickMove Solutions Services Supporting ${data.city}`}
          description="Explore our individual service pages or jump directly to our visual quote experience."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {OFFICIAL_SERVICES.map((srv) => (
            <Card key={srv.id} variant="default" padding="md" className="flex flex-col justify-between">
              <div>
                <Badge variant={srv.id === 'junk-removal' ? 'orange' : 'light'}>
                  {srv.shortName}
                </Badge>
                <h3 className="mt-3 font-heading text-base font-bold text-white">
                  {srv.name}
                </h3>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  {srv.tagline}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-heading font-bold">
                <Link href={srv.href} className="text-slate-300 hover:text-white">
                  Service Page
                </Link>
                <Link
                  href={`${srv.quoteHref}&city=${encodeURIComponent(data.city)}`}
                  className="text-brand-orange hover:underline"
                >
                  Get Quote →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* 5. City-Specific FAQs & Other Alberta Corridors */}
      <Section variant="white" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-5">
            <SectionHeader
              align="left"
              eyebrow={`${data.city} Moving & Cleanout FAQs`}
              title={`Frequently Asked Questions for ${data.city}, AB`}
              className="mb-4"
            />
            <Accordion items={data.faqs} />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <Badge variant="orange">Connected Alberta Corridors</Badge>
            <h3 className="font-heading text-heading-2 text-white font-extrabold">
              Other Service Areas We Cover
            </h3>
            <p className="text-sm text-slate-300">
              Moving between {data.city} and another Alberta community? Explore our other regional
              service area pages:
            </p>
            <div className="space-y-3 pt-1">
              {SERVICE_AREAS.filter((a) => a.slug !== data.slug).map((area) => (
                <Link
                  key={area.id}
                  href={area.href}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 hover:border-brand-orange hover:bg-white/10 transition-all"
                >
                  <div>
                    <span className="font-heading text-sm font-bold text-white">
                      {area.city}, {area.province}
                    </span>
                    <span className="block text-xs text-slate-400 mt-0.5">
                      {area.isPrimaryMarket ? 'Primary Headquarters Market' : 'Active Service Area'}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-brand-orange" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

