import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Truck,
  Camera,
  ExternalLink,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  SERVICE_AREAS,
} from '@/lib/constants/business';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconBox } from '@/components/ui/IconBox';
import { ContactInquiryForm } from '@/components/marketing-site/ContactInquiryForm';

export const metadata: Metadata = {
  title: 'Contact QuickMove Solutions | (587) 999-9565 | Calgary & Alberta',
  description:
    'Contact QuickMove Solutions in Calgary, AB at (587) 999-9565 or quickmoversolu@gmail.com for residential moving, commercial moving, delivery, and junk removal.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <Section variant="navy-mesh" spacing="md">
        <div className="max-w-3xl space-y-4">
          <Badge variant="orange-solid">Contact {BUSINESS_INFO.name}</Badge>
          <h1 className="font-heading text-display-xl text-white">
            Speak With Our Calgary Dispatch Team{' '}
            <span className="text-brand-orange">Today.</span>
          </h1>
          <p className="text-base sm:text-lg text-brand-navy-100 leading-relaxed">
            Reach us directly by phone or email, send a message below, or launch our interactive
            Visual Moving Quote or Photo-First Junk Removal Quote experience.
          </p>
        </div>
      </Section>

      {/* Main Contact Grid */}
      <Section variant="grey" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Official Contact Details & Quick Wizards */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="default" padding="lg" className="space-y-6">
              <div>
                <Badge variant="navy">Official Contact Details</Badge>
                <h2 className="mt-2 font-heading text-heading-2 text-brand-navy">
                  {BUSINESS_INFO.name}
                </h2>
                <p className="mt-1 text-sm text-brand-charcoal-muted">
                  {BUSINESS_INFO.tagline}
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-brand-surface-border">
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="flex items-center gap-4 rounded-xl bg-brand-surface-grey p-4 hover:bg-brand-orange/10 transition-colors group"
                >
                  <IconBox variant="orange" size="md">
                    <Phone className="h-5 w-5" />
                  </IconBox>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal-subtle block">
                      Official Phone
                    </span>
                    <span className="font-heading text-lg font-extrabold text-brand-navy group-hover:text-brand-orange">
                      {BUSINESS_INFO.phoneDisplay}
                    </span>
                  </div>
                </a>

                <a
                  href={BUSINESS_INFO.emailHref}
                  className="flex items-center gap-4 rounded-xl bg-brand-surface-grey p-4 hover:bg-brand-orange/10 transition-colors group"
                >
                  <IconBox variant="navy" size="md">
                    <Mail className="h-5 w-5 text-brand-orange" />
                  </IconBox>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal-subtle block">
                      Official Email
                    </span>
                    <span className="font-heading text-sm sm:text-base font-bold text-brand-navy group-hover:text-brand-orange break-all">
                      {BUSINESS_INFO.email}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-4 rounded-xl bg-brand-surface-grey p-4">
                  <IconBox variant="soft-navy" size="md">
                    <MapPin className="h-5 w-5" />
                  </IconBox>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal-subtle block">
                      Primary Location &amp; Service Areas
                    </span>
                    <span className="font-heading text-sm font-bold text-brand-navy block mt-0.5">
                      {BUSINESS_INFO.primaryLocation} (Primary Market)
                    </span>
                    <span className="text-xs text-brand-charcoal-muted mt-1 block">
                      Also serving Airdrie, Strathmore, Red Deer &amp; Edmonton.
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Social Channels */}
              <div className="pt-4 border-t border-brand-surface-border">
                <p className="text-xs font-heading font-bold uppercase tracking-wider text-brand-charcoal-subtle mb-3">
                  Connect on Social Media
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    href={BUSINESS_INFO.socials.facebook}
                    external
                    variant="outline"
                    size="sm"
                    rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                  >
                    Facebook Page
                  </Button>
                  <Button
                    href={BUSINESS_INFO.socials.instagram}
                    external
                    variant="outline"
                    size="sm"
                    rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                  >
                    Instagram
                  </Button>
                </div>
              </div>
            </Card>

            {/* Fast Quote Wizard Launcher Card */}
            <Card variant="navy" padding="lg" className="space-y-4">
              <Badge variant="orange-solid">Faster Online Estimates</Badge>
              <h3 className="font-heading text-xl font-bold text-white">
                Want an Itemized Moving or Junk Removal Quotation?
              </h3>
              <p className="text-xs sm:text-sm text-brand-navy-100 leading-relaxed">
                Our guided quote experiences collect your exact property size, access details, or
                junk photos so our administrator can prepare your quotation right away.
              </p>
              <div className="space-y-2.5 pt-1">
                <Button
                  href="/get-a-quote?service=residential-moving"
                  variant="primary"
                  size="md"
                  fullWidth
                  leftIcon={<Truck className="h-4 w-4" />}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Launch Visual Moving Quote
                </Button>
                <Button
                  href="/get-a-quote?service=junk-removal"
                  variant="outline-light"
                  size="md"
                  fullWidth
                  leftIcon={<Camera className="h-4 w-4 text-brand-orange" />}
                >
                  Launch Photo Junk Removal Quote
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <ContactInquiryForm />
          </div>
        </div>
      </Section>
    </div>
  );
}

