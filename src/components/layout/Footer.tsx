'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Clock,
  Truck,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  OFFICIAL_SERVICES,
  SERVICE_AREAS,
  JUNK_REMOVAL_DISCLAIMER,
} from '@/lib/constants/business';
import { BrandLogo } from './BrandLogo';
import { Button } from '@/components/ui/Button';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/portal')) {
    return null;
  }

  return (
    <footer className="bg-[#070D19] text-white border-t border-white/10">
      {/* Top Conversion Strip */}
      <div className="border-b border-white/10 bg-[#05080D]">
        <div className="container mx-auto py-8 sm:py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-brand-orange">
              Ready for a Smooth Move or Space Cleanout?
            </p>
            <h3 className="mt-1 font-heading text-xl sm:text-2xl font-bold text-white">
              {BUSINESS_INFO.tagline}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Button
              href="/get-a-quote"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Get a Free Quote
            </Button>
            <Button
              href={BUSINESS_INFO.phoneHref}
              variant="outline-light"
              size="lg"
              leftIcon={<Phone className="h-4 w-4 text-brand-orange" />}
            >
              Call {BUSINESS_INFO.phoneDisplay}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="container mx-auto py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand & Official Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <BrandLogo theme="light" showTagline />
            <p className="text-sm leading-relaxed text-brand-navy-100 max-w-sm">
              QuickMove Solutions helps individuals, families, property owners, and businesses
              across Calgary and Alberta relocate, transport items, prepare for moves, and clear
              unwanted belongings.
            </p>

            <div className="space-y-3 pt-1">
              <a
                href={BUSINESS_INFO.phoneHref}
                className="flex items-center gap-3 text-sm font-heading font-semibold text-white hover:text-brand-orange transition-colors"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-brand-orange">
                  <Phone className="h-4 w-4" />
                </span>
                <span>{BUSINESS_INFO.phoneDisplay}</span>
              </a>

              <a
                href={BUSINESS_INFO.emailHref}
                className="flex items-center gap-3 text-sm font-medium text-brand-navy-100 hover:text-brand-orange transition-colors"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-brand-orange">
                  <Mail className="h-4 w-4" />
                </span>
                <span>{BUSINESS_INFO.email}</span>
              </a>

              <div className="flex items-center gap-3 text-sm text-brand-navy-100">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-orange">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>Primary Location: {BUSINESS_INFO.primaryLocation}</span>
              </div>
            </div>

            {/* Official Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={BUSINESS_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="QuickMove Solutions on Facebook"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white hover:border-brand-orange hover:bg-brand-orange transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href={BUSINESS_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="QuickMove Solutions on Instagram"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white hover:border-brand-orange hover:bg-brand-orange transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Column 2: Moving & Junk Services (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-orange">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/moving-services"
                  className="text-brand-navy-100 hover:text-white transition-colors"
                >
                  All Moving Services
                </Link>
              </li>
              {OFFICIAL_SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    href={service.href}
                    className="text-brand-navy-100 hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Alberta Service Areas (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-orange">
              Service Areas
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/service-areas"
                  className="text-brand-navy-100 hover:text-white transition-colors"
                >
                  All Service Areas
                </Link>
              </li>
              {SERVICE_AREAS.map((area) => (
                <li key={area.id}>
                  <Link
                    href={area.href}
                    className="inline-flex items-center gap-1.5 text-brand-navy-100 hover:text-white transition-colors"
                  >
                    <span>{area.city}</span>
                    {area.isPrimaryMarket && (
                      <span className="rounded bg-brand-orange/20 px-1.5 py-0.2 text-[10px] font-semibold text-brand-orange">
                        Primary
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links & Quote Flows (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-brand-orange">
              Quick Links &amp; Quotes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/get-a-quote"
                  className="font-semibold text-white hover:text-brand-orange transition-colors"
                >
                  Visual Moving Quote Wizard
                </Link>
              </li>
              <li>
                <Link
                  href="/get-a-quote?service=junk-removal"
                  className="font-semibold text-white hover:text-brand-orange transition-colors"
                >
                  Photo-First Junk Removal Quote
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-brand-navy-100 hover:text-white transition-colors"
                >
                  About QuickMove Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-brand-navy-100 hover:text-white transition-colors"
                >
                  Moving &amp; Cleanout Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-brand-navy-100 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/design-system"
                  className="text-brand-navy-200 hover:text-white transition-colors text-xs"
                >
                  Brand &amp; Design System Reference
                </Link>
              </li>
            </ul>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-brand-navy-100 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-brand-orange shrink-0" />
                <span>Approved Item Policy</span>
              </div>
              <p className="leading-relaxed text-[11px] text-brand-navy-200">
                {JUNK_REMOVAL_DISCLAIMER}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-white/10 bg-[#05080D]">
        <div className="container mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-navy-200">
          <p>
            &copy; {currentYear} {BUSINESS_INFO.name}. All rights reserved. Primary Location:{' '}
            {BUSINESS_INFO.primaryLocation}.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/junk-removal-policy" className="hover:text-white transition-colors">
              Junk Removal Policy
            </Link>
            <Link href="/portal" className="text-brand-orange hover:text-white transition-colors font-semibold">
              Customer Portal
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              Staff OS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

