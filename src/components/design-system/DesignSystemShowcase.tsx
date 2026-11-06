'use client';

import * as React from 'react';
import {
  Truck,
  Trash2,
  Package,
  Building2,
  Home,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Camera,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  Calendar,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  BRAND_COLORS,
  OFFICIAL_SERVICES,
  SERVICE_AREAS,
} from '@/lib/constants/business';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import {
  FormField,
  Input,
  Select,
  Textarea,
  SelectionCard,
} from '@/components/ui/FormControls';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Accordion } from '@/components/ui/Accordion';
import { IconBox } from '@/components/ui/IconBox';
import { FadeIn } from '@/components/ui/MotionWrapper';

export function DesignSystemShowcase() {
  const [selectedPropertySize, setSelectedPropertySize] = React.useState('two-bedroom');
  const [selectedJunkCategories, setSelectedJunkCategories] = React.useState<string[]>([
    'furniture',
    'appliances',
  ]);
  const [copiedHex, setCopiedHex] = React.useState<string | null>(null);

  const copyHex = (hex: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1800);
    }
  };

  const toggleJunkCategory = (id: string) => {
    setSelectedJunkCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div>
      {/* 1. Brand Foundation Hero Banner */}
      <Section variant="navy-mesh" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <FadeIn className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="orange-solid" icon={<Sparkles className="h-3.5 w-3.5" />}>
                Phase 1 — Brand &amp; Design System Foundation
              </Badge>
              <Badge variant="outline" className="border-white/25 text-white">
                Calgary, Alberta Primary Market
              </Badge>
            </div>

            <h1 className="font-heading text-display-xl text-white">
              Moving Made Easy.{' '}
              <span className="text-brand-orange">Space Made Clear.</span>
            </h1>

            <p className="text-lg sm:text-xl text-brand-navy-100 leading-relaxed max-w-2xl">
              From residential and commercial relocations to furniture delivery and full junk
              removal, {BUSINESS_INFO.name} helps make your next move simpler.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs sm:text-sm text-brand-navy-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" />
                <span>Residential &amp; Commercial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" />
                <span>Full Junk Removal Line</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" />
                <span>Delivery &amp; Packing</span>
              </div>
            </div>
          </FadeIn>

          {/* Brand System Status Card */}
          <FadeIn delay={0.1} className="lg:col-span-5">
            <Card variant="default" padding="lg" className="border-t-4 border-t-brand-orange">
              <div className="flex items-center justify-between gap-2 mb-4">
                <Badge variant="navy">Official Brand Identity</Badge>
                <span className="text-xs font-mono text-brand-charcoal-subtle">v1.0 Foundation</span>
              </div>
              <h2 className="font-heading text-heading-2 text-brand-navy">
                QuickMove Design System
              </h2>
              <p className="mt-2 text-sm text-brand-charcoal-muted leading-relaxed">
                Engineered for trust, clarity, mobile-first conversion, and seamless connection
                between the public website, visual quote wizards, and SaaS admin platform.
              </p>

              <div className="mt-6 space-y-3 rounded-xl bg-brand-surface-grey p-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-navy">Official Phone:</span>
                  <a
                    href={BUSINESS_INFO.phoneHref}
                    className="font-heading font-bold text-brand-orange hover:underline"
                  >
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-navy">Official Email:</span>
                  <a
                    href={BUSINESS_INFO.emailHref}
                    className="font-medium text-brand-charcoal hover:text-brand-orange"
                  >
                    {BUSINESS_INFO.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-navy">Primary Hub:</span>
                  <span className="text-brand-charcoal">{BUSINESS_INFO.primaryLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-navy">Service Corridors:</span>
                  <span className="text-brand-charcoal">
                    Calgary, Airdrie, Strathmore, Red Deer, Edmonton
                  </span>
                </div>
              </div>
            </Card>
          </FadeIn>
        </div>
      </Section>

      {/* 2. Official Brand Colour Palette */}
      <Section variant="white" spacing="lg">
        <SectionHeader
          eyebrow="01. Colour Tokens"
          title="Official Brand Colour System"
          description="Strict adherence to Part 3.2 of KNOWLEDGE.md. Brand Navy (#101D35) establishes institutional trust and authority, while Action Orange (#F47732) drives conversion focus."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {Object.entries(BRAND_COLORS).map(([key, color]) => (
            <Card key={key} variant="outlined" padding="none" className="overflow-hidden flex flex-col">
              <div
                className="h-32 w-full border-b border-brand-surface-border flex items-end justify-between p-4"
                style={{ backgroundColor: color.hex }}
              >
                <button
                  type="button"
                  onClick={() => copyHex(color.hex)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-black/35 backdrop-blur-sm px-2.5 py-1 text-xs font-mono font-semibold text-white hover:bg-black/55 transition-colors"
                >
                  {copiedHex === color.hex ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{color.hex}</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-brand-navy">
                    {color.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-brand-charcoal-muted leading-relaxed">
                    {color.role}
                  </p>
                </div>
                <p className="mt-4 pt-3 border-t border-brand-surface-border font-mono text-xs font-semibold text-brand-navy">
                  HEX: {color.hex}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* 3. Typography & Responsive Hierarchy */}
      <Section variant="grey" spacing="lg">
        <SectionHeader
          eyebrow="02. Typography System"
          title="Fluid Sans-Serif Hierarchy (Manrope & Inter)"
          description="Configured with clamp()-based responsive scaling so headlines command attention on desktop while remaining crisp and legible on mobile screens."
        />

        <Card variant="default" padding="lg" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline border-b border-brand-surface-border pb-6">
            <div className="lg:col-span-3">
              <Badge variant="navy">display-xl</Badge>
              <p className="mt-1 text-xs font-mono text-brand-charcoal-subtle">
                Manrope ExtraBold • clamp(2.5rem, 5vw, 4.25rem)
              </p>
            </div>
            <div className="lg:col-span-9 font-heading text-display-xl text-brand-navy">
              Moving Made Easy. Space Made Clear.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline border-b border-brand-surface-border pb-6">
            <div className="lg:col-span-3">
              <Badge variant="navy">display-lg</Badge>
              <p className="mt-1 text-xs font-mono text-brand-charcoal-subtle">
                Manrope ExtraBold • clamp(2rem, 3.8vw, 3.25rem)
              </p>
            </div>
            <div className="lg:col-span-9 font-heading text-display-lg text-brand-navy">
              Full-Service Relocation &amp; Junk Removal
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline border-b border-brand-surface-border pb-6">
            <div className="lg:col-span-3">
              <Badge variant="light">heading-1</Badge>
              <p className="mt-1 text-xs font-mono text-brand-charcoal-subtle">
                Manrope Bold • Section Headings
              </p>
            </div>
            <div className="lg:col-span-9 font-heading text-heading-1 text-brand-navy">
              Trusted Across Calgary, Airdrie, Strathmore, Red Deer &amp; Edmonton
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline border-b border-brand-surface-border pb-6">
            <div className="lg:col-span-3">
              <Badge variant="light">heading-2 &amp; heading-3</Badge>
              <p className="mt-1 text-xs font-mono text-brand-charcoal-subtle">
                Manrope Bold/SemiBold • Card &amp; Feature Titles
              </p>
            </div>
            <div className="lg:col-span-9 space-y-2">
              <div className="font-heading text-heading-2 text-brand-navy">
                Photo-First Junk Removal Estimates in Minutes
              </div>
              <div className="font-heading text-heading-3 text-brand-charcoal">
                Upload photos from your phone and let our team prepare a clear estimate.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline">
            <div className="lg:col-span-3">
              <Badge variant="light">Body Copy (Inter)</Badge>
              <p className="mt-1 text-xs font-mono text-brand-charcoal-subtle">
                Charcoal #222A35 • High-Contrast Readability
              </p>
            </div>
            <div className="lg:col-span-9 space-y-3 text-base leading-relaxed text-brand-charcoal">
              <p>
                QuickMove Solutions helps individuals, families, property owners, and businesses
                relocate, transport items, prepare for moves, and clear unwanted belongings. Every
                interface is designed for clarity, speed, and zero confusion.
              </p>
            </div>
          </div>
        </Card>
      </Section>

      {/* 4. Buttons, Badges & Interactive Controls */}
      <Section variant="white" spacing="lg">
        <SectionHeader
          eyebrow="03. Action System"
          title="Buttons, Call-to-Actions & Status Badges"
          description="Every button features keyboard focus rings, active feedback, icon support, and loading states."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Button Variants &amp; Hierarchy</CardTitle>
              <CardDescription>
                Primary Orange is reserved for high-intent actions (Get a Free Quote, Submit).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Get a Free Quote
                </Button>
                <Button variant="secondary" leftIcon={<Truck className="h-4 w-4" />}>
                  Explore Services
                </Button>
                <Button
                  variant="call"
                  href={BUSINESS_INFO.phoneHref}
                  leftIcon={<Phone className="h-4 w-4" />}
                >
                  {BUSINESS_INFO.phoneDisplay}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-brand-surface-border">
                <Button variant="outline" size="sm">
                  Small Outline
                </Button>
                <Button variant="secondary" size="md">
                  Medium Default
                </Button>
                <Button variant="primary" size="lg">
                  Large Conversion
                </Button>
                <Button variant="primary" size="md" isLoading>
                  Processing
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Badges &amp; Branded Icon Containers</CardTitle>
              <CardDescription>
                Used across public service cards, quote wizard steps, and CRM pipeline statuses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="navy">Primary Market: Calgary</Badge>
                <Badge variant="orange">Photo-First Estimate</Badge>
                <Badge variant="orange-solid">Popular Service</Badge>
                <Badge variant="light">Step 2 of 8</Badge>
                <Badge variant="success">Booking Confirmed</Badge>
                <Badge variant="warning">Quote Pending</Badge>
                <Badge variant="info">New Lead</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-brand-surface-border">
                <IconBox variant="orange" size="lg">
                  <Truck className="h-6 w-6" />
                </IconBox>
                <IconBox variant="navy" size="lg">
                  <Trash2 className="h-6 w-6" />
                </IconBox>
                <IconBox variant="soft-orange" size="lg">
                  <Camera className="h-6 w-6" />
                </IconBox>
                <IconBox variant="soft-navy" size="lg">
                  <Package className="h-6 w-6" />
                </IconBox>
                <IconBox variant="white" size="lg">
                  <Building2 className="h-6 w-6" />
                </IconBox>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 5. Interactive Quote Wizard Selection Cards & Forms Preview */}
      <Section variant="grey" spacing="lg">
        <SectionHeader
          eyebrow="04. Interactive Quote Primitives"
          title="Visual Selection Cards & Accessible Form Controls"
          description="Foundational UI patterns powering the 8-Step Visual Moving Quote and 6-Step Photo-First Junk Removal Quote wizards."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Visual Selection Cards Demo */}
          <div className="lg:col-span-7 space-y-6">
            <Card variant="default" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="orange">Moving Quote — Property Size Pattern</Badge>
                  <h3 className="mt-2 font-heading text-heading-3 text-brand-navy">
                    Select Property Size (Single-Select Demo)
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <SelectionCard
                  title="Studio / 1 Bedroom"
                  description="Ideal for apartments, condos, and light residential moves."
                  icon={<Home className="h-5 w-5" />}
                  selected={selectedPropertySize === 'one-bedroom'}
                  onClick={() => setSelectedPropertySize('one-bedroom')}
                />
                <SelectionCard
                  title="Two Bedrooms"
                  description="Standard 2-bedroom condo, townhouse, or bungalow."
                  icon={<Home className="h-5 w-5" />}
                  badge="Common"
                  selected={selectedPropertySize === 'two-bedroom'}
                  onClick={() => setSelectedPropertySize('two-bedroom')}
                />
                <SelectionCard
                  title="Three+ Bedrooms"
                  description="Full family home relocation with larger furniture inventory."
                  icon={<Truck className="h-5 w-5" />}
                  selected={selectedPropertySize === 'three-bedroom'}
                  onClick={() => setSelectedPropertySize('three-bedroom')}
                />
                <SelectionCard
                  title="Commercial / Office"
                  description="Workstations, commercial furniture, and business equipment."
                  icon={<Building2 className="h-5 w-5" />}
                  selected={selectedPropertySize === 'commercial'}
                  onClick={() => setSelectedPropertySize('commercial')}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-brand-surface-border">
                <Badge variant="navy">Junk Removal — Multi-Select Category Pattern</Badge>
                <h3 className="mt-2 mb-4 font-heading text-heading-3 text-brand-navy">
                  What items need clearing? (Click to toggle multiple)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'furniture', title: 'Furniture & Sofas', desc: 'Couches, tables, chairs' },
                    { id: 'appliances', title: 'Appliances', desc: 'Fridges, washers, stoves' },
                    { id: 'cleanout', title: 'Garage / Basement', desc: 'Boxes & household clutter' },
                  ].map((cat) => (
                    <SelectionCard
                      key={cat.id}
                      title={cat.title}
                      description={cat.desc}
                      selected={selectedJunkCategories.includes(cat.id)}
                      onClick={() => toggleJunkCategory(cat.id)}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Form Controls Demo */}
          <div className="lg:col-span-5">
            <Card variant="default" padding="lg">
              <CardHeader>
                <Badge variant="light" className="w-fit">
                  Form System
                </Badge>
                <CardTitle>Accessible Input Controls</CardTitle>
                <CardDescription>
                  Includes clear labels, required markers, helper hints, and validation states.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="Pickup Address in Calgary or Area"
                  htmlFor="demo-pickup"
                  required
                  hint="Include unit or buzzer number if applicable."
                >
                  <Input
                    id="demo-pickup"
                    placeholder="e.g., 123 8 Ave SW, Calgary, AB"
                    leftIcon={<MapPin className="h-4 w-4" />}
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Service Type" htmlFor="demo-service" required>
                    <Select id="demo-service" defaultValue="residential">
                      <option value="residential">Residential Moving</option>
                      <option value="commercial">Commercial Moving</option>
                      <option value="junk">Full Junk Removal</option>
                      <option value="delivery">Furniture Delivery</option>
                      <option value="packing">Packing &amp; Unpacking</option>
                    </Select>
                  </FormField>

                  <FormField label="Preferred Date" htmlFor="demo-date" required>
                    <Input
                      id="demo-date"
                      type="date"
                      leftIcon={<Calendar className="h-4 w-4" />}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Access & Inventory Notes"
                  htmlFor="demo-notes"
                  hint="Mention stairs, elevator booking, parking, or heavy items."
                >
                  <Textarea
                    id="demo-notes"
                    placeholder="Tell us about stairs, elevators, or items that need special care..."
                  />
                </FormField>

                <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Continue to Next Step
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* 6. Official Services & Service Areas Card Patterns */}
      <Section variant="white" spacing="lg">
        <SectionHeader
          eyebrow="05. Service & Location Card Patterns"
          title="All 7 Official Service Lines & 5 Alberta Markets"
          description="Reusable card layouts designed for the Homepage, Service Pages, and Local SEO Pages."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFICIAL_SERVICES.map((service) => (
            <Card key={service.id} variant="interactive" padding="md" className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <IconBox
                    variant={service.category === 'junk-removal' ? 'orange' : 'soft-navy'}
                    size="md"
                  >
                    {service.category === 'junk-removal' ? (
                      <Trash2 className="h-5 w-5" />
                    ) : service.category === 'delivery' ? (
                      <Package className="h-5 w-5" />
                    ) : (
                      <Truck className="h-5 w-5" />
                    )}
                  </IconBox>
                  <Badge variant={service.category === 'junk-removal' ? 'orange' : 'light'}>
                    {service.shortName}
                  </Badge>
                </div>

                <CardTitle className="text-brand-navy">{service.name}</CardTitle>
                <p className="mt-2 text-sm text-brand-charcoal-muted leading-relaxed">
                  {service.description}
                </p>

                <ul className="mt-4 space-y-1.5 text-xs text-brand-charcoal">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <CardFooter>
                <Button
                  href={service.href}
                  variant="ghost"
                  size="sm"
                  className="px-0 hover:bg-transparent hover:text-brand-orange"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Explore {service.shortName}
                </Button>
                <Button href={service.quoteHref} variant="primary" size="sm">
                  Get Quote
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Service Areas Strip */}
        <div className="mt-12 rounded-2xl bg-brand-navy p-7 sm:p-9 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <Badge variant="orange-solid">Official Service Areas</Badge>
              <h3 className="mt-2 font-heading text-heading-2 text-white">
                Calgary Headquarters &amp; Regional Alberta Coverage
              </h3>
            </div>
            <Button
              href="/service-areas"
              variant="outline-light"
              size="md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View All Service Areas
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SERVICE_AREAS.map((area) => (
              <a
                key={area.id}
                href={area.href}
                className="group rounded-xl border border-white/15 bg-white/5 p-4 transition-all hover:border-brand-orange hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading text-base font-bold text-white group-hover:text-brand-orange transition-colors">
                    {area.city}, {area.province}
                  </span>
                  {area.isPrimaryMarket && (
                    <span className="rounded bg-brand-orange px-2 py-0.5 text-[10px] font-bold text-white">
                      Primary
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-brand-navy-100 leading-relaxed line-clamp-3">
                  {area.summary}
                </p>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* 7. Interactive FAQ Accordion Pattern */}
      <Section variant="grey" spacing="lg" containerSize="narrow">
        <SectionHeader
          eyebrow="06. Accordion Component"
          title="Accessible Frequently Asked Questions Pattern"
          description="Keyboard-navigable accordion with ARIA region attributes for service and location pages."
        />

        <Accordion
          items={[
            {
              id: 'faq-1',
              question: 'How does the Photo-First Junk Removal quote experience work?',
              answer:
                'Select your junk categories, snap or upload photos directly from your smartphone, choose an approximate load volume, and share your pickup access details. Our team reviews your photos and provides a clear quotation before any work begins.',
            },
            {
              id: 'faq-2',
              question: 'Which communities does QuickMove Solutions serve?',
              answer:
                'Our primary market is Calgary, Alberta, and we also serve Airdrie, Strathmore, Red Deer, and Edmonton for residential moving, commercial moving, delivery services, and full junk removal.',
            },
            {
              id: 'faq-3',
              question: 'Is a requested moving date automatically confirmed?',
              answer:
                'When you submit a quote or booking request, your preferred date and time window are recorded for our dispatch team. A booking is officially confirmed once an administrator verifies crew and truck availability and sends your confirmation.',
            },
          ]}
        />
      </Section>
    </div>
  );
}

