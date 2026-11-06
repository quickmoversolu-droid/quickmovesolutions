import type { Metadata } from 'next';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${BUSINESS_INFO.name} (${BUSINESS_INFO.website}). Learn how we protect customer contact details, quote requests, and uploaded job photos.`,
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <Section variant="navy-mesh" spacing="sm" containerSize="narrow">
        <Badge variant="orange-solid">Legal &amp; Privacy</Badge>
        <h1 className="mt-3 font-heading text-display-lg text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-brand-navy-100">
          Effective Date: November 1, 2026 • {BUSINESS_INFO.name} ({BUSINESS_INFO.primaryLocation})
        </p>
      </Section>

      <Section variant="white" spacing="lg" containerSize="narrow">
        <Card variant="default" padding="lg" className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-200 bg-[#0A1324] border-white/15 shadow-xl">
          <div className="space-y-2">
            <h2 className="font-heading text-heading-3 text-white font-extrabold">
              1. Overview &amp; Commitment to Customer Privacy
            </h2>
            <p>
              {BUSINESS_INFO.name} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;)
              respects your privacy and is committed to protecting personal information collected
              through our website ({BUSINESS_INFO.website}), Visual Moving Quote wizard,
              Photo-First Junk Removal Quote wizard, Customer Portal, and operational communications.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-heading-3 text-white font-extrabold">
              2. Information We Collect
            </h2>
            <p>When you request a quotation, schedule a service, or contact us, we collect:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-200">
              <li>
                <strong className="text-white">Contact Details:</strong> Name, phone number, email address, and preferred
                contact method.
              </li>
              <li>
                <strong className="text-white">Job &amp; Location Details:</strong> Pickup address, destination address,
                property type/size, access conditions (stairs, elevator, parking), preferred moving
                or collection dates, and inventory descriptions.
              </li>
              <li>
                <strong className="text-white">Uploaded Photos:</strong> Photos voluntarily uploaded by you to help our
                administrators assess moving items or junk removal volume.
              </li>
              <li>
                <strong className="text-white">Technical &amp; Attribution Data:</strong> Standard website analytics and
                campaign UTM parameters to understand how customers discover our services.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-heading-3 text-white font-extrabold">
              3. How We Use &amp; Protect Your Information
            </h2>
            <p>
              We use your information strictly to prepare accurate quotations, coordinate bookings,
              assign moving or cleanout crews, send transactional job notifications, and provide
              customer support. Customer-uploaded photos are stored privately and are never
              published as public marketing content without explicit consent.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-heading-3 text-white font-extrabold">
              4. Contact Us Regarding Privacy
            </h2>
            <p>
              If you wish to review, update, or request deletion of your personal records, please
              contact {BUSINESS_INFO.name} at{' '}
              <a href={BUSINESS_INFO.emailHref} className="font-bold text-brand-orange hover:underline">
                {BUSINESS_INFO.email}
              </a>{' '}
              or call{' '}
              <a href={BUSINESS_INFO.phoneHref} className="font-bold text-white hover:text-brand-orange hover:underline">
                {BUSINESS_INFO.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </Card>
      </Section>
    </div>
  );
}

