import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  ArrowRight,
  Phone,
  CheckCircle2,
  Camera,
  ShieldCheck,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  SERVICE_AREAS,
  OFFICIAL_SERVICES,
} from '@/lib/constants/business';
import { LOCATION_PAGES_DATA } from '@/lib/data/location-pages-data';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconBox } from '@/components/ui/IconBox';

export const metadata: Metadata = {
  title: 'Alberta Service Areas (Calgary, Airdrie, Strathmore, Red Deer, Edmonton)',
  description:
    'QuickMove Solutions is based in Calgary, AB and serves Airdrie, Strathmore, Red Deer, and Edmonton for residential moving, commercial moving, delivery, and junk removal.',
  alternates: { canonical: '/service-areas' },
};

export default function ServiceAreasPage() {
  return (
    <div>
      {/* Hero */}
      <Section variant="navy-mesh" spacing="lg">
        <div className="max-w-3xl space-y-6">
          <Badge variant="orange-solid" icon={<MapPin className="h-3.5 w-3.5" />}>
            Calgary Headquarters &amp; Regional Alberta Coverage
          </Badge>
          <h1 className="font-heading text-display-xl text-white">
            Moving, Delivery &amp; Junk Removal{' '}
            <span className="text-brand-orange">Across Calgary &amp; Alberta.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-brand-navy-100 leading-relaxed">
            Our primary market is Calgary, Alberta, with active service area coverage across
            Airdrie, Strathmore, Red Deer, and Edmonton. Select your city below to view local
            corridor details and request a quotation.
          </p>
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button
              href="/get-a-quote"
              variant="primary"
              size="xl"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Get a Free Quote
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

      {/* All 5 Alberta Service Areas */}
      <Section variant="white" spacing="lg">
        <SectionHeader
          eyebrow="Official Service Areas"
          title="Select Your Community to View Local Moving & Cleanout Details"
          description="We represent our regional coverage transparently—Calgary is our primary operations hub, and Airdrie, Strathmore, Red Deer, and Edmonton are served as dedicated regional service areas."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_AREAS.map((area) => {
            const detail = LOCATION_PAGES_DATA[area.slug];
            return (
              <Card
                key={area.id}
                variant={area.isPrimaryMarket ? 'navy' : 'interactive'}
                padding="lg"
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <IconBox
                      variant={area.isPrimaryMarket ? 'orange' : 'soft-navy'}
                      size="md"
                    >
                      <MapPin className="h-5 w-5" />
                    </IconBox>
                    <Badge variant={area.isPrimaryMarket ? 'orange-solid' : 'light'}>
                      {area.isPrimaryMarket ? 'Primary Market' : 'Service Area'}
                    </Badge>
                  </div>

                  <CardTitle className="text-white font-extrabold">
                    {area.city}, {area.province}
                  </CardTitle>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {area.summary}
                  </p>

                  {detail && (
                    <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-200 font-medium">
                      {detail.localLogisticsCards.map((c) => (
                        <li key={c.title} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                          <span className="text-slate-200">{c.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <CardFooter className="border-white/15">
                  <Button
                    href={area.href}
                    variant="outline-light"
                    size="sm"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    {area.city} Page
                  </Button>
                  <Button
                    href={`/get-a-quote?city=${encodeURIComponent(area.city)}`}
                    variant="primary"
                    size="sm"
                  >
                    Get Quote
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Services Available Across Our Corridors */}
      <Section variant="grey" spacing="md">
        <div className="rounded-3xl border border-brand-surface-border bg-white p-8 sm:p-10 shadow-card">
          <div className="flex items-center gap-2 text-brand-orange font-heading font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Full Service Availability</span>
          </div>
          <h2 className="font-heading text-heading-2 text-brand-navy">
            All 7 Services Available Across Our Alberta Service Areas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {OFFICIAL_SERVICES.map((srv) => (
              <Link
                key={srv.id}
                href={srv.href}
                className="rounded-xl border border-brand-surface-border bg-brand-surface-grey p-4 hover:border-brand-orange hover:bg-white transition-all"
              >
                <span className="font-heading text-sm font-bold text-brand-navy block">
                  {srv.name}
                </span>
                <span className="text-xs text-brand-charcoal-muted mt-1 block">
                  {srv.tagline}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

