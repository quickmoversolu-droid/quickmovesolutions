import type { Metadata } from 'next';
import {
  CheckCircle2,
  ShieldAlert,
  Camera,
  ArrowRight,
  Phone,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  JUNK_REMOVAL_DISCLAIMER,
} from '@/lib/constants/business';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Junk Removal & Approved Item Policy',
  description:
    'Official Junk Removal Policy for QuickMove Solutions in Calgary and Alberta: approved household/commercial items, photo-first volume estimates, and prohibited hazardous materials.',
  alternates: { canonical: '/junk-removal-policy' },
};

const APPROVED_ITEMS = [
  'Household furniture (sofas, sectionals, loveseats, recliners, chairs, tables, desks, dressers, bed frames)',
  'Mattresses and box springs',
  'Standard household appliances (refrigerators, freezers, washers, dryers, stoves, dishwashers, microwaves)',
  'Household electronics (TVs, monitors, computers, printers, audio gear)',
  'Boxed household clutter, books, clothing, toys, and non-hazardous garage/basement items',
  'Office furniture, cubicles, filing cabinets, and commercial workspace clutter',
  'Move-out, rental turnover, and general approved property cleanout items',
];

const PROHIBITED_HAZARDOUS_ITEMS = [
  'Asbestos or asbestos-containing building materials',
  'Medical, biohazardous, or infectious waste',
  'Industrial or household chemicals, solvents, liquid paints, pesticides, or herbicides',
  'Gasoline, propane cylinders, pressurized tanks, fuels, or oils',
  'Ammunition, fireworks, explosives, or firearms',
  'Radioactive or regulated industrial waste',
];

export default function JunkRemovalPolicyPage() {
  return (
    <div>
      <Section variant="navy-mesh" spacing="sm" containerSize="narrow">
        <Badge variant="orange-solid">Operational &amp; Safety Policy</Badge>
        <h1 className="mt-3 font-heading text-display-lg text-white">
          Junk Removal &amp; Approved Item Policy
        </h1>
        <p className="mt-2 text-sm text-brand-navy-100">
          {BUSINESS_INFO.name} • {BUSINESS_INFO.primaryLocation}
        </p>
      </Section>

      <Section variant="white" spacing="lg" containerSize="narrow">
        <div className="space-y-8">
          {/* Mandatory Disclaimer Highlight */}
          <div className="rounded-2xl border-2 border-brand-orange bg-brand-orange-50 p-6 flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-brand-orange shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h2 className="font-heading text-lg font-bold text-brand-navy">
                Hazardous &amp; Regulated Waste Restriction
              </h2>
              <p className="text-sm text-brand-charcoal leading-relaxed">
                {JUNK_REMOVAL_DISCLAIMER}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default" padding="md" className="space-y-4 bg-[#0A1324] border-white/15 shadow-xl">
              <Badge variant="success">Approved for Collection</Badge>
              <h3 className="font-heading text-lg font-extrabold text-white">
                Items We Regularly Remove
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-100 font-medium">
                {APPROVED_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-100 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card variant="grey" padding="md" className="space-y-4 bg-[#0A1324] border-red-500/30 shadow-xl">
              <Badge variant="warning">Restricted / Not Accepted</Badge>
              <h3 className="font-heading text-lg font-extrabold text-white">
                Prohibited Hazardous Materials
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-100 font-medium">
                {PROHIBITED_HAZARDOUS_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-slate-100 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card variant="default" padding="lg" className="space-y-4 bg-[#0A1324] border-white/15 shadow-xl">
            <h3 className="font-heading text-heading-3 text-white font-extrabold">
              Photo Assessment &amp; Volume Estimations
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              When you submit photos and select an approximate volume category (A few items, Small
              load, Medium load, Large load, or Full property cleanout) through our Photo-First
              Junk Removal experience, those selections serve as preliminary descriptions. An
              administrator inspects your photos and access details before issuing a formal written
              quotation, and our crew verifies accepted items on site prior to loading.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                href="/get-a-quote?service=junk-removal"
                variant="primary"
                size="md"
                leftIcon={<Camera className="h-4 w-4" />}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Start Photo Junk Removal Quote
              </Button>
              <Button
                href={BUSINESS_INFO.phoneHref}
                variant="outline"
                size="md"
                className="border-white/20 text-white hover:bg-white/10"
                leftIcon={<Phone className="h-4 w-4 text-brand-orange" />}
              >
                Ask About an Item: {BUSINESS_INFO.phoneDisplay}
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}

