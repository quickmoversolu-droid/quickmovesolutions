import type { Metadata } from 'next';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: `Terms and Conditions governing moving, delivery, packing, and junk removal quotations and bookings with ${BUSINESS_INFO.name}.`,
  alternates: { canonical: '/terms-and-conditions' },
};

export default function TermsAndConditionsPage() {
  return (
    <div>
      <Section variant="navy-mesh" spacing="sm" containerSize="narrow">
        <Badge variant="orange-solid">Service Terms</Badge>
        <h1 className="mt-3 font-heading text-display-lg text-white">
          Terms and Conditions
        </h1>
        <p className="mt-2 text-sm text-brand-navy-100">
          Effective Date: November 1, 2026 • {BUSINESS_INFO.name} ({BUSINESS_INFO.primaryLocation})
        </p>
      </Section>

      <Section variant="white" spacing="lg" containerSize="narrow">
        <Card variant="default" padding="lg" className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-200 bg-[#0A1324] border-white/15 shadow-xl">
          <div className="space-y-2">
            <h2 className="font-heading text-heading-3 text-white font-extrabold">
              1. Quote Requests &amp; Written Quotations
            </h2>
            <p>
              Submitting an online quote request through {BUSINESS_INFO.website} creates an inquiry
              for review by our administrative team. Preliminary volume selections or inventory
              summaries submitted online are used to prepare an itemized written quotation. Final
              pricing is governed by the formal written quotation issued by {BUSINESS_INFO.name} and
              any changes in actual on-site inventory, volume, or access conditions.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-heading-3 text-white font-extrabold">
              2. Booking Confirmation Policy
            </h2>
            <p>
              Preferred moving, delivery, or junk removal dates selected during a quote request are
              treated as requested dates—not confirmed bookings. A booking is officially confirmed
              only after you accept a written quotation and an authorized administrator verifies crew
              and vehicle availability and issues a booking confirmation.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-heading-3 text-white font-extrabold">
              3. Customer Access &amp; Preparation Responsibilities
            </h2>
            <p>
              Customers are responsible for ensuring safe, unobstructed access at pickup and
              destination properties, reserving required condo/commercial service elevators, and
              disclosing stairs, long carry distances, or heavy specialty items prior to dispatch.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-heading-3 text-white font-extrabold">
              4. Contact Information
            </h2>
            <p>
              For questions regarding quotations, bookings, rescheduling, or service terms, contact{' '}
              {BUSINESS_INFO.name} at{' '}
              <a href={BUSINESS_INFO.phoneHref} className="font-bold text-brand-orange hover:underline">
                {BUSINESS_INFO.phoneDisplay}
              </a>{' '}
              or{' '}
              <a href={BUSINESS_INFO.emailHref} className="font-bold text-white hover:text-brand-orange hover:underline">
                {BUSINESS_INFO.email}
              </a>
              .
            </p>
          </div>
        </Card>
      </Section>
    </div>
  );
}

