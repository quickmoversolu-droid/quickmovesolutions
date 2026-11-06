'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ClipboardList,
  Calendar,
  FileText,
  Users,
  Truck,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Bell,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { PlatformDatabaseState } from '@/lib/db/platform-store';

export default function AdminExecutiveDashboardPage() {
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);

  useEffect(() => {
    fetch('/api/admin/platform')
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.data) {
          setDb(res.data);
        }
      });
  }, []);

  if (!db) {
    return (
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-12 text-center text-sm font-bold text-brand-navy">
        Loading QuickMove Solutions Executive Operations Dashboard...
      </div>
    );
  }

  // Segregated Revenue Metrics (Part 8.8 of KNOWLEDGE.md: Never mix pipeline, booked, and completed revenue)
  const quotePipelineCents = db.quotes
    .filter((q) => q.status === 'SENT' || q.status === 'VIEWED' || q.status === 'DRAFT')
    .reduce((sum, q) => sum + q.totalCents, 0);

  const confirmedBookingCents = db.quotes
    .filter((q) => q.status === 'ACCEPTED')
    .reduce((sum, q) => sum + q.totalCents, 0);

  const completedJobIds = new Set(
    db.jobRequests
      .filter((j) => j.lifecycleStage === 'JOB_COMPLETED')
      .map((j) => j.id)
  );
  const completedRevenueCents = db.quotes
    .filter((q) => completedJobIds.has(q.jobRequestId))
    .reduce((sum, q) => sum + q.totalCents, 0);

  const formatCad = (cents: number) =>
    `$${(cents / 100).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`;

  const newLeadsCount = db.leads.filter((l) => l.status === 'NEW').length;
  const pendingApprovalPosts = db.marketingPosts.filter(
    (p) => p.status === 'PENDING_APPROVAL'
  ).length;

  return (
    <div className="space-y-8">
      {/* Executive Banner */}
      <div className="rounded-3xl bg-brand-navy p-6 text-white shadow-xl sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <Badge variant="orange-solid" className="mb-2">
            Calgary &amp; Alberta Operations Command Center
          </Badge>
          <h1 className="font-heading text-2xl font-extrabold sm:text-3xl">
            QuickMove Solutions Executive Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/75 max-w-2xl">
            Real-time operational metrics across Moving, Photo-First Junk Removal, Furniture
            Delivery, Itemized Quotations, Fleet Dispatch, and AI Marketing.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/quotes"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-brand-orange/90"
          >
            <FileText className="h-4 w-4" />
            Create Itemized Quote
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-white/20"
          >
            <Calendar className="h-4 w-4" />
            Dispatch Calendar
          </Link>
        </div>
      </div>

      {/* Segregated Financial & Operational KPIs (Part 8.8) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
              Quote Pipeline Value
            </span>
            <FileText className="h-4 w-4 text-brand-orange" />
          </div>
          <p className="mt-2 font-heading text-2xl font-extrabold text-brand-navy">
            {formatCad(quotePipelineCents)}
          </p>
          <p className="mt-1 text-[11px] text-brand-muted">
            Open Draft / Sent Quotes awaiting acceptance
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Confirmed Booking Value
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-heading text-2xl font-extrabold text-brand-navy">
            {formatCad(confirmedBookingCents)}
          </p>
          <p className="mt-1 text-[11px] text-brand-muted">
            Accepted quotes &amp; scheduled jobs ({db.bookings.length} bookings)
          </p>
        </div>

        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
              Completed Revenue
            </span>
            <TrendingUp className="h-4 w-4 text-brand-navy" />
          </div>
          <p className="mt-2 font-heading text-2xl font-extrabold text-brand-navy">
            {formatCad(completedRevenueCents)}
          </p>
          <p className="mt-1 text-[11px] text-brand-muted">
            Strictly separated completed job revenue
          </p>
        </div>

        <div className="rounded-2xl border border-brand-navy/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
              Active Leads &amp; AI Queue
            </span>
            <ClipboardList className="h-4 w-4 text-brand-orange" />
          </div>
          <p className="mt-2 font-heading text-2xl font-extrabold text-brand-navy">
            {db.leads.length} Leads ({newLeadsCount} New)
          </p>
          <p className="mt-1 text-[11px] text-brand-muted">
            {pendingApprovalPosts} AI post(s) awaiting Owner approval
          </p>
        </div>
      </div>

      {/* Main Two-Column Executive View */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recent Leads & Job Requests */}
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-brand-navy">
                Recent Leads &amp; Quote Requests
              </h2>
              <p className="text-xs text-brand-muted">
                Live submissions from the 8-Step Moving, 6-Step Photo Junk &amp; Delivery Wizards
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:underline"
            >
              Open Full CRM Pipeline <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {db.leads.slice(0, 5).map((lead) => {
              const customer = db.customers.find((c) => c.id === lead.customerId);
              const job = db.jobRequests.find((j) => j.id === lead.jobRequestId);
              return (
                <div
                  key={lead.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-brand-navy/10 bg-brand-light/50 p-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-brand-navy">
                        {lead.referenceCode}
                      </span>
                      <span className="rounded-full bg-brand-orange/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-brand-orange">
                        {lead.status}
                      </span>
                      <span className="text-[11px] font-semibold text-brand-muted">
                        {lead.serviceType}
                      </span>
                    </div>
                    <p className="mt-1 font-heading text-sm font-bold text-brand-navy">
                      {customer?.fullName || 'Customer'} • {job?.pickupCity || 'Calgary'}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-muted line-clamp-1">
                      {lead.internalNotes}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/admin/leads"
                      className="rounded-xl bg-brand-navy px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-navy/90"
                    >
                      Manage Lead
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Dispatch Schedule & Fleet Status */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-extrabold text-brand-navy">
                Upcoming Scheduled Bookings
              </h2>
              <Link
                href="/admin/bookings"
                className="text-xs font-bold text-brand-orange hover:underline"
              >
                Calendar →
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {db.bookings.map((bkg) => {
                const customer = db.customers.find((c) => c.id === bkg.customerId);
                const team = db.teams.find((t) => t.id === bkg.assignedTeamId);
                const vehicle = db.vehicles.find((v) => v.id === bkg.assignedVehicleId);
                return (
                  <div
                    key={bkg.id}
                    className="rounded-2xl border border-brand-navy/10 bg-brand-light/40 p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-brand-navy">
                        {bkg.bookingNumber} • {bkg.scheduledDate}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          bkg.status === 'CONFIRMED'
                            ? 'bg-emerald-500/15 text-emerald-700'
                            : 'bg-amber-500/15 text-amber-700'
                        }`}
                      >
                        {bkg.status}
                      </span>
                    </div>
                    <p className="mt-1 font-heading text-sm font-bold text-brand-navy">
                      {customer?.fullName} ({bkg.pickupCity})
                    </p>
                    <p className="mt-0.5 text-brand-muted">
                      <Clock className="inline h-3 w-3 mr-1 text-brand-orange" />
                      {bkg.arrivalWindow} • {team?.code || 'Unassigned'} •{' '}
                      {vehicle?.licensePlate || 'No Truck'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Module Grid */}
          <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-base font-extrabold text-brand-navy">
              Platform Modules
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs font-bold">
              <Link
                href="/admin/customers"
                className="flex items-center gap-2 rounded-xl border border-brand-navy/10 p-3 text-brand-navy hover:border-brand-orange"
              >
                <Users className="h-4 w-4 text-brand-orange" />
                Customers ({db.customers.length})
              </Link>
              <Link
                href="/admin/jobs"
                className="flex items-center gap-2 rounded-xl border border-brand-navy/10 p-3 text-brand-navy hover:border-brand-orange"
              >
                <ClipboardList className="h-4 w-4 text-brand-orange" />
                Jobs &amp; Checklists ({db.jobRequests.length})
              </Link>
              <Link
                href="/admin/resources"
                className="flex items-center gap-2 rounded-xl border border-brand-navy/10 p-3 text-brand-navy hover:border-brand-orange"
              >
                <Truck className="h-4 w-4 text-brand-orange" />
                Teams &amp; Fleet ({db.vehicles.length})
              </Link>
              <Link
                href="/admin/marketing"
                className="flex items-center gap-2 rounded-xl border border-brand-navy/10 p-3 text-brand-navy hover:border-brand-orange"
              >
                <Sparkles className="h-4 w-4 text-brand-orange" />
                AI Marketing ({db.marketingPosts.length})
              </Link>
              <Link
                href="/admin/notifications"
                className="flex items-center gap-2 rounded-xl border border-brand-navy/10 p-3 text-brand-navy hover:border-brand-orange"
              >
                <Bell className="h-4 w-4 text-brand-orange" />
                Logs &amp; Alerts ({db.notifications.length})
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 rounded-xl border border-brand-navy/10 p-3 text-brand-navy hover:border-brand-orange"
              >
                <CheckCircle2 className="h-4 w-4 text-brand-orange" />
                RBAC &amp; Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

