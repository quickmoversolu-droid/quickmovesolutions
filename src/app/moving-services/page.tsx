import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Truck,
  Trash2,
  Package,
  Box,
  ArrowRight,
  Phone,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  OFFICIAL_SERVICES,
  SERVICE_AREAS,
} from '@/lib/constants/business';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconBox } from '@/components/ui/IconBox';

export const metadata: Metadata = {
  title: 'Moving, Delivery & Junk Removal Services in Calgary & Alberta',
  description:
    'Explore all QuickMove Solutions services: Residential Moving, Commercial Moving, Local Moving, Long-Distance Moving, Packing & Unpacking, Delivery Services, and Full Junk Removal.',
  alternates: {
    canonical: '/moving-services',
  },
};

export default function MovingServicesOverviewPage() {
  return (
    <div>
      {/* Hero */}
      <Section variant="navy-mesh" spacing="lg">
        <div className="max-w-3xl space-y-6">
          <Badge variant="orange-solid">Complete Relocation &amp; Space-Clearing Lineup</Badge>
          <h1 className="font-heading text-display-xl text-white">
            Moving, Delivery &amp; Full Junk Removal{' '}
            <span className="text-brand-orange">Built Around Your Needs.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-brand-navy-100 leading-relaxed">
            Whether you are moving an apartment or family home, relocating a commercial workspace,
            scheduling a furniture delivery, or clearing out unwanted belongings, QuickMove
            Solutions provides organized crews and itemized written quotations.
          </p>
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button
              href="/get-a-quote"
              variant="primary"
              size="xl"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Start Visual Moving Quote
            </Button>
            <Button
              href="/get-a-quote?service=junk-removal"
              variant="white"
              size="xl"
              leftIcon={<Camera className="h-5 w-5 text-brand-orange" />}
            >
              Photo Junk Removal Estimate
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

      {/* All 7 Official Services Grid */}
      <Section variant="white" spacing="lg">
        <SectionHeader
          eyebrow="Our Seven Core Service Lines"
          title="Select a Service to Explore Our Operational Standards"
          description="Every service below connects directly to our visual moving or photo-first junk removal quote experiences."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFICIAL_SERVICES.map((service) => {
            const isJunk = service.id === 'junk-removal';
            return (
              <Card
                key={service.id}
                variant="interactive"
                padding="md"
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <IconBox variant={isJunk ? 'orange' : 'soft-navy'} size="md">
                      {isJunk ? (
                        <Trash2 className="h-5 w-5" />
                      ) : service.id === 'delivery-services' ? (
                        <Package className="h-5 w-5" />
                      ) : service.id === 'packing-unpacking' ? (
                        <Box className="h-5 w-5" />
                      ) : (
                        <Truck className="h-5 w-5" />
                      )}
                    </IconBox>
                    <Badge variant={isJunk ? 'orange' : 'light'}>{service.shortName}</Badge>
                  </div>

                  <CardTitle className="text-white font-extrabold">{service.name}</CardTitle>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-200 font-medium">
                    {service.highlights.map((hl) => (
                      <li key={hl} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <span className="text-slate-200">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <CardFooter>
                  <Button
                    href={service.href}
                    variant="ghost"
                    size="sm"
                    className="px-0 hover:bg-transparent text-slate-300 hover:text-brand-orange"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    View {service.shortName} Page
                  </Button>
                  <Button href={service.quoteHref} variant="primary" size="sm">
                    Get Quote
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Service Area Coverage */}
      <Section variant="grey" spacing="md">
        <div className="rounded-3xl bg-brand-navy p-8 sm:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="orange-solid">Alberta Service Coverage</Badge>
            <h2 className="font-heading text-heading-2 text-white">
              Serving Calgary, Airdrie, Strathmore, Red Deer &amp; Edmonton
            </h2>
            <p className="text-sm sm:text-base text-brand-navy-100">
              Explore our city-specific pages to learn how we coordinate local and inter-city
              relocations across Alberta.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {SERVICE_AREAS.map((area) => (
              <Link
                key={area.id}
                href={area.href}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-heading font-bold text-white hover:border-brand-orange hover:bg-brand-orange transition-colors"
              >
                {area.city}, {area.province}
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

