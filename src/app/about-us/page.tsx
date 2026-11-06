import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  Trash2,
  Package,
  ClipboardCheck,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  OFFICIAL_SERVICES,
  SERVICE_AREAS,
} from '@/lib/constants/business';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconBox } from '@/components/ui/IconBox';

export const metadata: Metadata = {
  title: 'About QuickMove Solutions | Calgary Moving, Delivery & Junk Removal',
  description:
    'Learn how QuickMove Solutions helps individuals, families, property owners, and businesses in Calgary and across Alberta relocate, transport items, and clear unwanted belongings.',
  alternates: { canonical: '/about-us' },
};

const CORE_VALUES = [
  {
    icon: ClipboardCheck,
    title: 'Structured Operational Checklists',
    description:
      'Every moving, delivery, and junk removal job follows a step-by-step checklist covering access confirmation, furniture protection, crew assignment, and final walkthrough.',
  },
  {
    icon: ShieldCheck,
    title: 'Honest, Written Itemized Quotations',
    description:
      'We never rely on vague verbal guesses. Our administrators prepare clear written quotations detailing labour, vehicle, packing, or removal line items before you commit.',
  },
  {
    icon: Camera,
    title: 'Customer-Focused Digital Convenience',
    description:
      'Our Visual Moving Quote and Photo-First Junk Removal Quote experiences make requesting an estimate simple, guided, and fast from any smartphone or computer.',
  },
  {
    icon: Truck,
    title: 'One Partner for Moving & Space Clearing',
    description:
      'Instead of coordinating separate movers, delivery drivers, and junk haulers, QuickMove Solutions handles residential moves, commercial relocations, deliveries, and full cleanouts under one roof.',
  },
];

export default function AboutUsPage() {
  return (
    <div>
      {/* Hero */}
      <Section variant="navy-mesh" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="orange-solid">About {BUSINESS_INFO.name}</Badge>
            <h1 className="font-heading text-display-xl text-white">
              Moving Made Easy.{' '}
              <span className="text-brand-orange">Space Made Clear.</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-brand-navy-100 leading-relaxed">
              QuickMove Solutions helps individuals, families, property owners, and businesses
              relocate, transport items, prepare for moves, and clear unwanted belongings across
              Calgary and Alberta.
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

          <div className="lg:col-span-5">
            <Card variant="default" padding="lg" className="border-t-4 border-t-brand-orange space-y-4 bg-[#0B162C]/95 border-white/15 shadow-2xl">
              <Badge variant="orange">Official Company Profile</Badge>
              <h2 className="font-heading text-xl font-bold text-white">
                At a Glance
              </h2>
              <div className="space-y-3 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-heading font-bold text-white block">
                      Primary Location
                    </span>
                    <span className="text-slate-300">
                      {BUSINESS_INFO.primaryLocation}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-heading font-bold text-white block">
                      Service Areas
                    </span>
                    <span className="text-slate-300">
                      Calgary (Primary), Airdrie, Strathmore, Red Deer &amp; Edmonton
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-heading font-bold text-white block">
                      Direct Phone
                    </span>
                    <a
                      href={BUSINESS_INFO.phoneHref}
                      className="font-bold text-brand-orange hover:underline"
                    >
                      {BUSINESS_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="font-heading font-bold text-white block">
                      Official Email
                    </span>
                    <a
                      href={BUSINESS_INFO.emailHref}
                      className="text-slate-300 hover:text-brand-orange"
                    >
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Mission & Story */}
      <Section variant="white" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-5">
            <Badge variant="orange">Our Mission</Badge>
            <h2 className="font-heading text-heading-1 text-brand-navy">
              Simplifying Every Stage of Moving, Delivery &amp; Property Cleanouts
            </h2>
            <p className="text-base text-brand-charcoal-muted leading-relaxed">
              Moving and clearing space often happen at the exact same moment in life—when buying
              or selling a home, transitioning between apartments, expanding an office, or managing
              a rental turnover. Yet customers are frequently forced to juggle separate moving
              crews, furniture delivery drivers, and junk removal services.
            </p>
            <p className="text-base text-brand-charcoal-muted leading-relaxed">
              QuickMove Solutions brings these essential services together with a clear, reliable,
              and customer-focused approach. Whether you need a full household relocation, a few
              heavy furniture pieces delivered, packing support, or a complete garage, basement, or
              property cleanout, our team treats your property and schedule with respect.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CORE_VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <Card key={val.title} variant="grey" padding="md" className="space-y-3">
                  <IconBox variant="navy" size="sm">
                    <Icon className="h-5 w-5 text-brand-orange" />
                  </IconBox>
                  <CardTitle className="text-white font-bold">{val.title}</CardTitle>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {val.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Service Lines & Regional Coverage */}
      <Section variant="grey" spacing="lg">
        <SectionHeader
          eyebrow="Complete Service Capabilities"
          title="What QuickMove Solutions Delivers"
          description="Explore our seven core service lines and five Alberta service areas."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFICIAL_SERVICES.map((service) => (
            <Card key={service.id} variant="default" padding="md" className="flex flex-col justify-between">
              <div>
                <Badge variant={service.id === 'junk-removal' ? 'orange' : 'light'}>
                  {service.shortName}
                </Badge>
                <h3 className="mt-3 font-heading text-lg font-bold text-white">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-heading font-bold">
                <Link href={service.href} className="text-slate-300 hover:text-white">
                  Learn More
                </Link>
                <Link href={service.quoteHref} className="text-brand-orange hover:underline">
                  Get a Quote →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

