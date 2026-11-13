'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  UserCheck,
  CalendarCheck,
  FileText,
  Rocket,
  Users,
  ShieldCheck,
  Truck,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Headphones,
  LogOut,
  ExternalLink,
  Briefcase,
  Star,
  KeyRound,
  Menu,
  X,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/db/platform-store';

export interface AdminNavItem {
  label: string;
  href: string;
  matchPrefixes?: string[];
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles: UserRole[];
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: Home,
    roles: ['OWNER', 'ADMIN', 'COORDINATOR', 'MARKETING_MANAGER', 'CREW_MEMBER'],
  },
  {
    label: 'Leads & CRM',
    href: '/admin/leads',
    icon: UserCheck,
    roles: ['OWNER', 'ADMIN', 'COORDINATOR'],
  },
  {
    label: 'Jobs & Bookings',
    href: '/admin/bookings',
    matchPrefixes: ['/admin/bookings', '/admin/jobs'],
    icon: CalendarCheck,
    roles: ['OWNER', 'ADMIN', 'COORDINATOR', 'CREW_MEMBER'],
  },
  {
    label: 'Quotations',
    href: '/admin/quotes',
    icon: FileText,
    roles: ['OWNER', 'ADMIN', 'COORDINATOR'],
  },
  {
    label: 'AI Marketing Manager',
    href: '/admin/marketing',
    icon: Rocket,
    roles: ['OWNER', 'ADMIN', 'MARKETING_MANAGER'],
  },
  {
    label: 'Customers',
    href: '/admin/customers',
    icon: Users,
    roles: ['OWNER', 'ADMIN', 'COORDINATOR'],
  },
  {
    label: 'Team & Access Management',
    href: '/admin/team-access',
    icon: ShieldCheck,
    roles: ['OWNER', 'ADMIN'],
  },
  {
    label: 'Team & Vehicles',
    href: '/admin/resources',
    icon: Truck,
    roles: ['OWNER', 'ADMIN', 'COORDINATOR'],
  },
  {
    label: 'Finished Jobs & Media',
    href: '/admin/finished-jobs',
    icon: Camera,
    roles: ['OWNER', 'ADMIN', 'COORDINATOR', 'MARKETING_MANAGER', 'CREW_MEMBER'],
  },
  {
    label: 'Reports & Analytics',
    href: '/admin/reports',
    matchPrefixes: ['/admin/reports', '/admin/reviews', '/admin/notifications'],
    icon: BarChart3,
    roles: ['OWNER', 'ADMIN', 'COORDINATOR', 'MARKETING_MANAGER'],
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['OWNER'],
  },
];

const ROLE_LABELS: Record<UserRole, { name: string; title: string }> = {
  OWNER: { name: 'QuickMove Owner', title: 'Owner' },
  ADMIN: { name: 'Devon Reid', title: 'Administrator' },
  COORDINATOR: { name: 'Sarah Chen', title: 'Dispatcher' },
  MARKETING_MANAGER: { name: 'Elena Vance', title: 'Marketing Manager' },
  CREW_MEMBER: { name: 'Marcus Vance', title: 'Employee' },
  CUSTOMER: { name: 'Customer', title: 'Customer' },
};

const QUICK_SEARCH_LINKS = [
  { label: 'AI Marketing Manager & Content Studio', href: '/admin/marketing', category: 'Marketing' },
  { label: 'Team & Access Management (Employee Accounts & RBAC)', href: '/admin/team-access', category: 'Security' },
  { label: 'Leads & 11-Stage CRM Pipeline', href: '/admin/leads', category: 'CRM' },
  { label: 'Dispatch Calendar & Bookings', href: '/admin/bookings', category: 'Dispatch' },
  { label: 'Active Jobs & Operational Checklists', href: '/admin/jobs', category: 'Operations' },
  { label: 'Quotations & Printable PDF Builder', href: '/admin/quotes', category: 'Sales' },
  { label: 'Customer Directory & History', href: '/admin/customers', category: 'CRM' },
  { label: 'Fleet Vehicles & Moving Crews', href: '/admin/resources', category: 'Fleet' },
  { label: 'Finished Jobs & Media Portfolio (Upload Photos & Banners)', href: '/admin/finished-jobs', category: 'Portfolio & Media' },
  { label: 'Reports, Analytics & Performance', href: '/admin/reports', category: 'Analytics' },
  { label: 'Reviews & Verified Testimonials', href: '/admin/reviews', category: 'Reputation' },
  { label: 'Notifications & Security Audit Log', href: '/admin/notifications', category: 'Audit' },
  { label: 'AI & OpenRouter Settings', href: '/admin/settings/ai', category: 'AI & Backend' },
  { label: 'System Settings & Tax Configuration', href: '/admin/settings', category: 'System' },
];

interface AdminShellProps {
  children: React.ReactNode;
  activeRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export function AdminShell({
  children,
  activeRole = 'OWNER',
  onRoleChange,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(activeRole);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setProfileMenuOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  // If on login page or printable PDF page, render children bare
  if (pathname === '/admin/login' || pathname?.endsWith('/pdf')) {
    return <>{children}</>;
  }

  const handleSwitchRole = async (newRole: UserRole) => {
    setCurrentRole(newRole);
    setProfileMenuOpen(false);
    if (onRoleChange) onRoleChange(newRole);
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'role-switch', role: newRole }),
      });
      router.refresh();
    } catch {
      // Ignore network error during role switch
    }
  };

  const handleChangeOwnPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CHANGE_OWN_PASSWORD',
        newPassword,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setPasswordFeedback('Password updated and hashed securely with scrypt.');
      setNewPassword('');
      setTimeout(() => {
        setPasswordModalOpen(false);
        setPasswordFeedback(null);
      }, 1400);
    } else {
      setPasswordFeedback(data.error || 'Could not update password.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const [platformData, setPlatformData] = useState<{
    customers: any[];
    leads: any[];
    quotes: any[];
    bookings: any[];
  } | null>(null);

  useEffect(() => {
    fetch('/api/admin/platform')
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.data) {
          setPlatformData({
            customers: res.data.customers || [],
            leads: res.data.leads || [],
            quotes: res.data.quotes || [],
            bookings: res.data.bookings || [],
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  const visibleNav = ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(currentRole));
  
  const filteredSearch = (() => {
    if (!searchQuery.trim()) {
      return QUICK_SEARCH_LINKS.slice(0, 6);
    }
    const q = searchQuery.trim().toLowerCase();
    const cleanQ = q.replace(/[^a-z0-9]/g, '');

    // Nav matches
    const navMatches = QUICK_SEARCH_LINKS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );

    // Customer matches
    const custMatches = (platformData?.customers || [])
      .filter((c) => {
        const cleanPhone = (c.phone || '').replace(/[^0-9]/g, '');
        return (
          c.fullName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          (cleanQ && cleanPhone.includes(cleanQ)) ||
          c.phone?.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q)
        );
      })
      .slice(0, 4)
      .map((c) => ({
        label: `${c.fullName} • ${c.email || c.phone}`,
        href: `/admin/customers`,
        category: 'Customer',
      }));

    // Lead matches
    const leadMatches = (platformData?.leads || [])
      .filter((l) => {
        const cust = platformData?.customers?.find((c) => c.id === l.customerId);
        return (
          l.referenceCode?.toLowerCase().includes(q) ||
          l.serviceType?.toLowerCase().includes(q) ||
          cust?.fullName?.toLowerCase().includes(q) ||
          cust?.email?.toLowerCase().includes(q)
        );
      })
      .slice(0, 4)
      .map((l) => {
        const cust = platformData?.customers?.find((c) => c.id === l.customerId);
        return {
          label: `${l.referenceCode} — ${l.serviceType} (${cust?.fullName || 'Customer'})`,
          href: `/admin/leads`,
          category: 'Lead CRM',
        };
      });

    // Quote matches
    const quoteMatches = (platformData?.quotes || [])
      .filter((quo) => {
        const cust = platformData?.customers?.find((c) => c.id === quo.customerId);
        return (
          quo.quoteNumber?.toLowerCase().includes(q) ||
          quo.serviceType?.toLowerCase().includes(q) ||
          cust?.fullName?.toLowerCase().includes(q)
        );
      })
      .slice(0, 3)
      .map((quo) => {
        const cust = platformData?.customers?.find((c) => c.id === quo.customerId);
        return {
          label: `Quote ${quo.quoteNumber} • $${(quo.totalCents / 100).toFixed(2)} CAD (${cust?.fullName || 'Customer'})`,
          href: `/admin/quotes?quoteId=${encodeURIComponent(quo.id)}`,
          category: 'Quotation',
        };
      });

    // Booking matches
    const bookingMatches = (platformData?.bookings || [])
      .filter((b) => b.bookingNumber?.toLowerCase().includes(q) || b.scheduledDate?.includes(q))
      .slice(0, 3)
      .map((b) => ({
        label: `Booking ${b.bookingNumber} • ${b.scheduledDate} (${b.status})`,
        href: `/admin/bookings`,
        category: 'Dispatch',
      }));

    return [...leadMatches, ...custMatches, ...quoteMatches, ...bookingMatches, ...navMatches].slice(0, 8);
  })();

  const activeUserMeta = ROLE_LABELS[currentRole] || ROLE_LABELS.OWNER;

  return (
    <div className="min-h-screen bg-[#05080D] text-white flex flex-col lg:flex-row selection:bg-brand-orange/30 selection:text-white">
      {/* Dark Obsidian & Deep Navy Sidebar — Matches Visual Reference 1 */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 xl:w-[270px] bg-gradient-to-b from-[#09101D] via-[#070C16] to-[#05080D] border-r border-white/[0.08] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 shrink-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top Stacked Logo + Navigation */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="relative px-5 pt-6 pb-5 border-b border-white/[0.06] flex flex-col items-center">
            <BrandLogo theme="light" variant="stacked" showTagline href="/admin" />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-white/60 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Primary Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : item.matchPrefixes
                    ? item.matchPrefixes.some((p) => pathname?.startsWith(p))
                    : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'group flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-heading font-bold transition-all duration-200',
                    isActive
                      ? 'qm-orange-pill text-white shadow-[0_8px_22px_rgba(244,119,50,0.4)]'
                      : 'text-white/75 hover:bg-white/[0.06] hover:text-white'
                  )}
                >
                  <span className="flex items-center gap-3.5">
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-white' : 'text-white/65 group-hover:text-brand-orange'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                </Link>
              );
            })}

            {/* Sub-Shortcuts for Jobs, Reviews & Logs */}
            <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-1">
              <p className="px-4 py-1 text-[10px] font-heading font-bold uppercase tracking-widest text-white/35">
                Operations &amp; Audit
              </p>
              <Link
                href="/admin/jobs"
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-semibold transition-all',
                  pathname === '/admin/jobs'
                    ? 'bg-white/10 text-brand-orange'
                    : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
                )}
              >
                <Briefcase className="h-3.5 w-3.5 text-brand-orange" />
                <span>Job Checklists (10-Stage)</span>
              </Link>
              <Link
                href="/admin/reviews"
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-semibold transition-all',
                  pathname === '/admin/reviews'
                    ? 'bg-white/10 text-brand-orange'
                    : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
                )}
              >
                <Star className="h-3.5 w-3.5 text-brand-orange" />
                <span>Reviews &amp; Testimonials</span>
              </Link>
              <Link
                href="/admin/notifications"
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-semibold transition-all',
                  pathname === '/admin/notifications'
                    ? 'bg-white/10 text-brand-orange'
                    : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
                )}
              >
                <Bell className="h-3.5 w-3.5 text-brand-orange" />
                <span>Notifications &amp; Audit Log</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Bottom "Need Help?" Card — Matches Visual Reference 1 */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="rounded-2xl border border-white/10 bg-[#0D1628]/90 p-4 text-center shadow-inner">
            <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
              <Headphones className="h-5 w-5" />
            </div>
            <p className="font-heading text-sm font-extrabold text-white">Need Help?</p>
            <p className="mt-0.5 text-[11px] text-white/60">Our team is here to assist you.</p>
            <a
              href={BUSINESS_INFO.phoneHref}
              className="qm-orange-pill mt-3 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 font-heading text-xs font-extrabold text-white transition-transform hover:scale-[1.02]"
            >
              Contact Support
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#05080D]">
        {/* Top Dark Header Bar — Search Anything, Notifications Badge, User Profile */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between gap-4 border-b border-white/[0.08] bg-[#070C16]/90 backdrop-blur-xl px-4 sm:px-8">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global Search Bar — Matches "Search anything..." in Reference 1 */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything..."
                className="w-full rounded-full border border-white/10 bg-[#0E1729] pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
              />

              {searchFocused && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-white/15 bg-[#0B1322] p-2 shadow-2xl z-50">
                  <p className="px-3 py-1.5 text-[10px] font-heading font-bold uppercase tracking-wider text-white/45">
                    Quick Platform Navigation
                  </p>
                  {filteredSearch.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/10 hover:text-brand-orange"
                    >
                      <span>{item.label}</span>
                      <span className="rounded-md bg-brand-orange/20 px-2 py-0.5 text-[10px] font-bold text-brand-orange">
                        {item.category}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Controls: Role Preview Switcher, Notification Bell (3), User Profile */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Quick Role Tester Pill */}
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-white/10 bg-[#0E1729] px-3 py-1.5 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-orange" />
              <span className="text-white/55">Role View:</span>
              <select
                value={currentRole}
                onChange={(e) => handleSwitchRole(e.target.value as UserRole)}
                aria-label="Switch active role view"
                className="bg-transparent font-heading font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="OWNER" className="bg-[#0B1322] text-white">
                  Super Admin / Owner
                </option>
                <option value="ADMIN" className="bg-[#0B1322] text-white">
                  Administrator / Manager
                </option>
                <option value="COORDINATOR" className="bg-[#0B1322] text-white">
                  Dispatcher
                </option>
                <option value="MARKETING_MANAGER" className="bg-[#0B1322] text-white">
                  Marketing Manager
                </option>
                <option value="CREW_MEMBER" className="bg-[#0B1322] text-white">
                  Employee (Field Crew)
                </option>
              </select>
            </div>

            {/* Notification Bell with Red Badge (3) — Matches Reference 1 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0E1729] text-white/85 hover:border-brand-orange hover:text-white transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow">
                  3
                </span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/15 bg-[#0B1322] p-4 shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-white">
                      Platform Notifications
                    </span>
                    <Link
                      href="/admin/notifications"
                      className="text-[11px] font-bold text-brand-orange hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="rounded-xl bg-white/[0.04] p-2.5 border border-white/5">
                      <p className="font-bold text-white">Quote Q-2026-1001 Accepted</p>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        Michael Henderson accepted Residential Moving Quote ($1,464.75 CAD).
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-2.5 border border-white/5">
                      <p className="font-bold text-white">AI Marketing Plan Ready</p>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        Weekly Calgary &amp; Airdrie social schedule ready for Owner approval.
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-2.5 border border-white/5">
                      <p className="font-bold text-white">Photo Junk Quote Submitted</p>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        Priya Patel uploaded garage &amp; sofa photos in Airdrie.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill — Matches Reference 1 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-[#0E1729] pl-1.5 pr-3.5 py-1.5 hover:border-brand-orange/50 transition-all"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-amber-600 font-heading text-xs font-extrabold text-white shadow">
                  {activeUserMeta.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="font-heading text-xs font-extrabold text-white">
                    {activeUserMeta.name}
                  </p>
                  <p className="text-[11px] text-white/60">{activeUserMeta.title}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/60" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/15 bg-[#0B1322] p-2 shadow-2xl z-50 space-y-1 text-xs">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="font-heading font-bold text-white">{activeUserMeta.name}</p>
                    <p className="text-[11px] text-brand-orange">{activeUserMeta.title}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setPasswordModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-semibold text-white/85 hover:bg-white/10"
                  >
                    <KeyRound className="h-4 w-4 text-brand-orange" />
                    <span>Change My Password</span>
                  </button>

                  <Link
                    href="/admin/team-access"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-white/85 hover:bg-white/10"
                  >
                    <ShieldCheck className="h-4 w-4 text-brand-orange" />
                    <span>Team &amp; Access Management</span>
                  </Link>

                  <Link
                    href="/portal"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-white/85 hover:bg-white/10"
                  >
                    <Users className="h-4 w-4 text-brand-orange" />
                    <span>Customer Self-Service Portal</span>
                  </Link>

                  <Link
                    href="/"
                    className="flex items-center justify-between rounded-xl px-3 py-2 font-semibold text-white/85 hover:bg-white/10"
                  >
                    <span>View Public Website</span>
                    <ExternalLink className="h-3.5 w-3.5 text-white/50" />
                  </Link>

                  <div className="pt-1 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-bold text-rose-400 hover:bg-rose-500/15"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Workspace Container — Dark SaaS Surface */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto qm-admin-dark-workspace">
          {children}
        </main>
      </div>

      {/* Self-Service Password Change Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0B1322] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-heading text-lg font-extrabold flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-brand-orange" />
                <span>Update Account Password</span>
              </h3>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangeOwnPassword} className="mt-4 space-y-4">
              <p className="text-xs text-white/65">
                Passwords are never stored in plain text. Your new password will be salted and
                hashed using cryptographic scrypt.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                  New Password (minimum 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#070C16] px-4 py-3 text-sm text-white focus:border-brand-orange focus:outline-none"
                />
              </div>

              {passwordFeedback && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2.5 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{passwordFeedback}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-bold text-white/80 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="qm-orange-pill rounded-xl px-5 py-2.5 text-xs font-extrabold text-white"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
