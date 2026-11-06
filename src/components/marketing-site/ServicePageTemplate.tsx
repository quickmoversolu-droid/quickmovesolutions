import * as React from 'react';
import Link from 'next/link';
import {
  Phone,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Lightbulb,
  MapPin,
  ShieldAlert,
  Camera,
  ChevronRight,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  SERVICE_AREAS,
  JUNK_REMOVAL_DISCLAIMER,
} from '@/lib/constants/business';
import { ServicePageDetail } from '@/lib/data/service-pages-data';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { IconBox } from '@/components/ui/IconBox';

export interface ServicePageTemplateProps {
  data: ServicePageDetail;
}

export function ServicePageTemplate({ data }: ServicePageTemplateProps) {
  const baseUrl = BUSINESS_INFO.website.replace(/\/$/, '');
  const pageUrl = `${baseUrl}/${data.slug}`;

  const serviceSchema = {
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
            name: 'Services',
            item: `${baseUrl}/moving-services`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: data.title,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'Service',
        name: `${data.title} Services - ${BUSINESS_INFO.name}`,
        serviceType: data.title,
        description: data.metaDescription,
        url: pageUrl,
        provider: {
          '@type': ['MovingCompany', 'LocalBusiness'],
          name: BUSINESS_INFO.name,
          telephone: BUSINESS_INFO.phoneE164,
          url: BUSINESS_INFO.website,
          address: {
            '@type': 'PostalAddress',
            addressLocality: BUSINESS_INFO.primaryCity,
            addressRegion: BUSINESS_INFO.province,
            addressCountry: 'CA',
          },
        },
        areaServed: SERVICE_AREAS.map((a) => ({
          '@type': 'City',
          name: a.city,
        })),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'CAD',
          availability: 'https://schema.org/InStock',
        },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* 1. Service Hero with Breadcrumbs */}
      <Section variant="navy-mesh" spacing="lg">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs text-brand-navy-200"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-brand-orange" />
          <Link href="/moving-services" className="hover:text-white transition-colors">
            Services
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-brand-orange" />
          <span className="font-semibold text-white">{data.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="orange-solid">{data.eyebrow}</Badge>
            <h1 className="font-heading text-display-xl text-white">
              {data.heroHeadline}{' '}
              <span className="text-brand-orange">{data.heroHighlight}</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-brand-navy-100 leading-relaxed max-w-2xl">
              {data.heroDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                href={data.primaryCtaHref}
                variant="primary"
                size="xl"
                leftIcon={data.isJunkRemoval ? <Camera className="h-5 w-5" /> : undefined}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                {data.primaryCtaLabel}
              </Button>
              <Button
                href={BUSINESS_INFO.phoneHref}
                variant="outline-light"
                size="xl"
                leftIcon={<Phone className="h-5 w-5 text-brand-orange" />}
              >
                Call {BUSINESS_INFO.phoneDisplay}
              </Button>
              {data.secondaryCtaHref && data.secondaryCtaLabel && (
                <Button href={data.secondaryCtaHref} variant="ghost" size="lg" className="text-white hover:text-brand-orange hover:bg-white/10">
                  {data.secondaryCtaLabel}
                </Button>
              )}
            </div>
          </div>

          {/* Right Quick Operational Summary Card */}
          <div className="lg:col-span-5">
            <Card variant="default" padding="lg" className="border-t-4 border-t-brand-orange space-y-5 bg-[#0B162C]/95 border-white/15 shadow-2xl">
              <div className="flex items-center justify-between">
                <Badge variant="orange">{data.title} Overview</Badge>
                <span className="text-xs font-semibold text-brand-navy-200">
                  Calgary &amp; Alberta
                </span>
              </div>
              <h2 className="font-heading text-xl font-bold text-white">
                What Is Included With QuickMove Solutions
              </h2>
              <ul className="space-y-2.5 text-sm text-slate-100">
                {data.operationalChecklist.slice(0, 5).map((step) => (
                  <li key={step} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                    <span className="text-slate-100 font-medium leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-white/15 flex flex-col gap-2.5">
                <Button
                  href={data.primaryCtaHref}
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {data.primaryCtaLabel}
                </Button>
                <p className="text-center text-xs text-slate-300">
                  Or call dispatch directly at{' '}
                  <a href={BUSINESS_INFO.phoneHref} className="font-bold text-white hover:text-brand-orange">
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* 2. Deep Service Overview & Scenarios */}
      <Section variant="white" spacing="lg">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <Badge variant="orange">{data.title} in Calgary &amp; Alberta</Badge>
          <h2 className="font-heading text-heading-1 text-white font-extrabold">
            {data.overviewTitle}
          </h2>
          {data.overviewParagraphs.map((p, idx) => (
            <p
              key={idx}
              className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
            >
              {p}
            </p>
          ))}
        </div>

        <h3 className="font-heading text-heading-2 text-white font-extrabold text-center mb-8">
          {data.scenariosTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.scenarios.map((scenario) => (
            <Card key={scenario.title} variant="grey" padding="md" className="flex flex-col justify-between">
              <div className="space-y-3">
                <CardTitle className="text-white font-bold">{scenario.title}</CardTitle>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {scenario.description}
                </p>
                <ul className="pt-2 space-y-2 text-xs sm:text-sm text-slate-200">
                  {scenario.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                      <span className="text-slate-200">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {data.isJunkRemoval && (
          <div className="mt-10 rounded-2xl border-2 border-brand-orange/40 bg-brand-orange/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <ShieldAlert className="h-6 w-6 text-brand-orange shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-heading text-sm font-bold text-white">
                  Important Approved-Item &amp; Hazardous Waste Policy
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {JUNK_REMOVAL_DISCLAIMER}
                </p>
              </div>
            </div>
            <Button href="/junk-removal-policy" variant="secondary" size="sm" className="shrink-0">
              Read Full Policy
            </Button>
          </div>
        )}
      </Section>

      {/* 3. Operational Checklist & Customer Preparation Tips */}
      <Section variant="grey" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Operational Checklist */}
          <Card variant="navy" padding="lg" className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-3">
              <IconBox variant="orange" size="md">
                <ClipboardCheck className="h-5 w-5" />
              </IconBox>
              <div>
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-brand-orange">
                  Quality &amp; Operations Standard
                </span>
                <h2 className="font-heading text-heading-2 text-white">
                  {data.checklistTitle}
                </h2>
              </div>
            </div>

            <p className="text-sm text-brand-navy-100 leading-relaxed">
              {data.checklistSubtitle}
            </p>

            <ol className="space-y-3 text-sm text-white">
              {data.operationalChecklist.map((item, idx) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange font-mono text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </Card>

          {/* Preparation Tips & Service Areas */}
          <div className="lg:col-span-6 space-y-6">
            <Card variant="default" padding="lg" className="space-y-5">
              <div className="flex items-center gap-3">
                <IconBox variant="soft-orange" size="md">
                  <Lightbulb className="h-5 w-5" />
                </IconBox>
                <div>
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-brand-orange">
                    Helpful Customer Advice
                  </span>
                  <h2 className="font-heading text-heading-3 text-white">
                    {data.preparationTipsTitle}
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {data.preparationTips.map((tip) => (
                  <div
                    key={tip.title}
                    className="rounded-xl bg-white/5 p-4 border border-white/10"
                  >
                    <h3 className="font-heading text-sm font-bold text-white">
                      {tip.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {tip.detail}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Service Area Coverage Box */}
            <Card variant="default" padding="md" className="space-y-4">
              <div className="flex items-center gap-2 text-white font-heading font-bold text-base">
                <MapPin className="h-5 w-5 text-brand-orange" />
                <span>Communities We Serve for {data.title}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SERVICE_AREAS.map((area) => (
                  <Link
                    key={area.id}
                    href={area.href}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-heading font-bold text-white hover:border-brand-orange hover:text-brand-orange transition-colors"
                  >
                    <span>
                      {area.city}, {area.province}
                    </span>
                    {area.isPrimaryMarket && (
                      <span className="text-[10px] text-brand-orange">(Primary)</span>
                    )}
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* 4. FAQs & Related Services */}
      <Section variant="white" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeader
              align="left"
              eyebrow={`${data.title} FAQs`}
              title={`Common Questions About ${data.title}`}
              className="mb-4"
            />
            <Accordion items={data.faqs} />
          </div>

          <div className="lg:col-span-5 space-y-5">
            <Badge variant="orange">Complementary Services</Badge>
            <h3 className="font-heading text-heading-2 text-white font-extrabold">
              Combine Services for a Complete Relocation Solution
            </h3>
            <div className="space-y-4">
              {data.relatedServices.map((rel) => (
                <Link
                  key={rel.href}
                  href={rel.href}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-brand-orange hover:bg-white/10 hover:shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-base font-bold text-white">
                      {rel.name}
                    </h4>
                    <ArrowRight className="h-4 w-4 text-brand-orange" />
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
                    {rel.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 5. Final Service Conversion CTA */}
      <Section variant="navy-mesh" spacing="md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="orange-solid">Ready When You Are</Badge>
            <h2 className="font-heading text-heading-1 text-white">
              Request Your {data.title} Quotation Today
            </h2>
            <p className="text-sm sm:text-base text-brand-navy-100">
              Complete our guided online quote request or call {BUSINESS_INFO.phoneDisplay} to
              discuss your schedule.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button
              href={data.primaryCtaHref}
              variant="primary"
              size="xl"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              {data.primaryCtaLabel}
            </Button>
            <Button
              href={BUSINESS_INFO.phoneHref}
              variant="outline-light"
              size="xl"
              leftIcon={<Phone className="h-5 w-5 text-brand-orange" />}
            >
              Call {BUSINESS_INFO.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

