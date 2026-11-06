'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Calculator,
  UserCheck,
  Lock,
  MapPin,
  Home,
  Building2,
  Truck,
  Navigation,
  Package,
  Layers,
} from 'lucide-react';
import { BUSINESS_INFO, MAIN_NAVIGATION } from '@/lib/constants/business';
import { BrandLogo } from './BrandLogo';
import { cn } from '@/lib/utils';

const getDropdownMetadata = (href: string) => {
  switch (href) {
    // Moving Services
    case '/moving-services':
      return { icon: Layers, badge: 'Overview' };
    case '/residential-moving':
      return { icon: Home, badge: 'Most Popular' };
    case '/commercial-moving':
      return { icon: Building2, badge: 'Offices & Retail' };
    case '/local-moving':
      return { icon: Truck, badge: 'Calgary Area' };
    case '/long-distance-moving':
      return { icon: Navigation, badge: 'Alberta-Wide' };
    case '/packing-unpacking':
      return { icon: Package, badge: 'Full Care' };

    // Service Areas
    case '/service-areas':
      return { icon: Layers, badge: 'All Alberta' };
    case '/moving-company-calgary':
      return { icon: MapPin, badge: 'HQ & Main Hub' };
    case '/moving-company-airdrie':
      return { icon: MapPin, badge: '20-Min Dispatch' };
    case '/moving-company-strathmore':
      return { icon: MapPin, badge: 'East Calgary' };
    case '/moving-company-red-deer':
      return { icon: MapPin, badge: 'Highway 2' };
    case '/moving-company-edmonton':
      return { icon: MapPin, badge: 'Corridor Route' };

    default:
      return { icon: ArrowRight, badge: undefined };
  }
};

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/portal')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#070C16]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      {/* Top Official Utility Strip — Matches Reference Concept */}
      <div className="bg-[#05080D] text-white/80 text-xs border-b border-white/[0.07]">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="inline-flex items-center gap-1.5 font-medium text-white/85">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-orange shrink-0" />
              <span>Trusted Moving &amp; Junk Removal Services in Calgary and Surrounding Areas</span>
            </span>
            <span className="hidden md:inline text-white/25">|</span>
            <span className="hidden md:inline font-medium text-white/75">
              Quick, Reliable, Professional
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Official Social Icons */}
            <div className="hidden sm:flex items-center gap-2.5">
              <a
                href={BUSINESS_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="QuickMove Solutions on Facebook"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-brand-orange hover:text-white transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              <a
                href={BUSINESS_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="QuickMove Solutions on Instagram"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-brand-orange hover:text-white transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
              </a>
            </div>

            <span className="hidden sm:inline text-white/20">|</span>

            <Link
              href="/portal/login"
              className="hidden lg:inline-flex items-center gap-1 text-white/75 hover:text-brand-orange transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5 text-brand-orange" />
              <span>Customer Portal</span>
            </Link>

            <Link
              href="/admin"
              className="hidden lg:inline-flex items-center gap-1 text-white/75 hover:text-brand-orange transition-colors"
            >
              <Lock className="h-3.5 w-3.5 text-brand-orange" />
              <span>Admin OS</span>
            </Link>

            <span className="hidden lg:inline text-white/20">|</span>

            <a
              href={BUSINESS_INFO.phoneHref}
              className="inline-flex items-center gap-1.5 font-heading font-bold text-white hover:text-brand-orange transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-brand-orange" />
              <span>{BUSINESS_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Dark Navigation Bar */}
      <div className="container mx-auto flex h-20 items-center justify-between gap-4">
        <BrandLogo theme="light" variant="horizontal" />

        {/* Desktop Navigation */}
        <nav aria-label="Primary Navigation" className="hidden xl:flex items-center gap-1">
          {MAIN_NAVIGATION.map((item) => {
            const hasChildren = 'children' in item && item.children && item.children.length > 0;
            const isActive =
              pathname === item.href ||
              (hasChildren && item.children.some((child) => pathname === child.href));

            if (hasChildren) {
              const isOpen = openDropdown === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenDropdown((prev) => (prev === item.label ? null : item.label))
                    }
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold font-heading transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange',
                      isActive
                        ? 'text-brand-orange bg-brand-orange/15'
                        : 'text-white/85 hover:text-white hover:bg-white/[0.07]'
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-200 text-white/60',
                        isOpen && 'rotate-180 text-brand-orange'
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full pt-2 w-[460px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="rounded-2xl border-2 border-white/20 bg-[#0B1426] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
                        <div className="space-y-1.5">
                          {item.children.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            const meta = getDropdownMetadata(subItem.href);
                            const Icon = meta.icon;

                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  'group flex items-start gap-3 rounded-xl p-2.5 border transition-all duration-150',
                                  isSubActive
                                    ? 'bg-brand-orange/20 border-brand-orange/60 text-white shadow-sm'
                                    : 'bg-white/[0.04] border-white/10 hover:bg-[#13233F] hover:border-brand-orange/50 hover:shadow-md'
                                )}
                              >
                                <div
                                  className={cn(
                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors mt-0.5',
                                    isSubActive
                                      ? 'bg-brand-orange text-white'
                                      : 'bg-brand-orange/15 text-brand-orange ring-1 ring-brand-orange/30 group-hover:bg-brand-orange group-hover:text-white'
                                  )}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-heading text-sm font-extrabold text-white group-hover:text-brand-orange transition-colors">
                                      {subItem.label}
                                    </span>
                                    {meta.badge && (
                                      <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/80 group-hover:bg-brand-orange/25 group-hover:text-brand-orange">
                                        {meta.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-white/75 mt-0.5 line-clamp-1 group-hover:text-white/95">
                                    {subItem.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Dropdown Footer CTA Bar */}
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between px-2 text-xs">
                          {item.label === 'Moving Services' ? (
                            <Link
                              href="/get-a-quote/moving"
                              className="inline-flex items-center gap-1.5 font-bold text-brand-orange hover:text-white transition-colors"
                            >
                              <span>Need an exact estimate? Visual Moving Quote (8 Steps)</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          ) : (
                            <Link
                              href="/service-areas"
                              className="inline-flex items-center gap-1.5 font-bold text-brand-orange hover:text-white transition-colors"
                            >
                              <span>Explore Full Alberta Service Area Coverage Map</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold font-heading transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange',
                  isActive
                    ? 'text-brand-orange bg-brand-orange/15'
                    : 'text-white/85 hover:text-white hover:bg-white/[0.07]'
                )}
              >
                <span>{item.label}</span>
                {'badge' in item && item.badge && (
                  <span className="rounded-full bg-brand-orange/25 border border-brand-orange/40 px-2 py-0.5 text-[10px] font-bold text-brand-orange-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/get-a-quote"
            className="qm-orange-pill inline-flex items-center gap-2.5 rounded-full px-6 py-2.5 font-heading text-sm font-extrabold text-white transition-all hover:scale-[1.02] hover:shadow-cta-hover"
          >
            <Calculator className="h-4 w-4" />
            <span>Get a Quote</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Actions & Menu Trigger */}
        <div className="flex items-center gap-2 xl:hidden">
          <a
            href={BUSINESS_INFO.phoneHref}
            aria-label={`Call ${BUSINESS_INFO.phoneDisplay}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-orange/40 bg-brand-orange/15 text-brand-orange lg:hidden"
          >
            <Phone className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Dark Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/10 bg-[#070D19] text-white shadow-2xl max-h-[calc(100vh-7.5rem)] overflow-y-auto">
          <div className="container mx-auto py-5 space-y-2">
            {MAIN_NAVIGATION.map((item) => {
              const hasChildren = 'children' in item && item.children && item.children.length > 0;
              const isExpanded = mobileExpanded === item.label;

              if (hasChildren) {
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/[0.03]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpanded((prev) => (prev === item.label ? null : item.label))
                      }
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between px-4 py-3.5 font-heading text-base font-bold text-white"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          isExpanded && 'rotate-180 text-brand-orange'
                        )}
                      />
                    </button>

                    {isExpanded && (
                      <div className="border-t border-white/10 p-2.5 space-y-2 bg-[#05080D]">
                        {item.children.map((subItem) => {
                          const meta = getDropdownMetadata(subItem.href);
                          const Icon = meta.icon;
                          const isSubActive = pathname === subItem.href;

                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                'flex items-start gap-3 rounded-xl p-3 border transition-colors',
                                isSubActive
                                  ? 'bg-brand-orange/20 border-brand-orange/60 text-white'
                                  : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                              )}
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange/15 text-brand-orange ring-1 ring-brand-orange/30 mt-0.5">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-heading text-sm font-extrabold text-white">
                                    {subItem.label}
                                  </span>
                                  {meta.badge && (
                                    <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/80">
                                      {meta.badge}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-white/75 mt-0.5 block">
                                  {subItem.description}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 font-heading text-base font-bold text-white hover:border-brand-orange"
                >
                  <span>{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="rounded-full bg-brand-orange px-2.5 py-0.5 text-xs font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/get-a-quote"
                className="qm-orange-pill flex items-center justify-center gap-2 rounded-xl py-3.5 font-heading text-sm font-extrabold text-white"
              >
                <Calculator className="h-4 w-4" />
                <span>Get a Free Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={BUSINESS_INFO.phoneHref}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3.5 font-heading text-sm font-bold text-white"
              >
                <Phone className="h-4 w-4 text-brand-orange" />
                <span>Call {BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-white/60 border-t border-white/10">
              <a href={BUSINESS_INFO.emailHref} className="inline-flex items-center gap-1.5 hover:text-brand-orange">
                <Mail className="h-3.5 w-3.5 text-brand-orange" />
                <span>{BUSINESS_INFO.email}</span>
              </a>
              <div className="flex items-center gap-3">
                <Link href="/portal/login" className="hover:text-brand-orange">Customer Portal</Link>
                <Link href="/admin" className="hover:text-brand-orange">Admin OS</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
