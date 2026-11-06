'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  DollarSign,
  MapPin,
  Sparkles,
  CheckCircle2,
  FileText,
  Truck,
} from 'lucide-react';
import type { PlatformDatabaseState } from '@/lib/db/platform-store';

export default function AdminReportsAnalyticsPage() {
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);

  useEffect(() => {
    fetch('/api/admin/platform')
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.data) setDb(res.data);
      });
  }, []);

  if (!db) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0A1324] p-12 text-center text-sm font-bold text-white/80">
        Loading Reports &amp; Analytics...
      </div>
    );
  }

  const totalQuotedDollars = Math.round(
    db.quotes.reduce((sum, q) => sum + q.totalCents, 0) / 100
  );
  const acceptedRevenueDollars = Math.round(
    db.quotes
      .filter((q) => q.status === 'ACCEPTED')
      .reduce((sum, q) => sum + q.totalCents, 0) / 100
  );
  const collectedDepositDollars = Math.round(
    db.quotes
      .filter((q) => q.status === 'ACCEPTED')
      .reduce((sum, q) => sum + q.depositCents, 0) / 100
  );
  const conversionRate =
    db.leads.length > 0 ? Math.round((db.bookings.length / db.leads.length) * 100) : 0;

  const serviceBreakdown = [
    {
      name: 'Residential & Commercial Moving',
      count: db.jobRequests.filter((j) => j.serviceCategory === 'MOVING').length,
      revenueShare: '54%',
      color: 'from-[#F47732] to-[#ff9858]',
    },
    {
      name: 'Photo-First Junk Removal',
      count: db.jobRequests.filter((j) => j.serviceCategory === 'JUNK_REMOVAL').length,
      revenueShare: '28%',
      color: 'from-sky-500 to-cyan-400',
    },
    {
      name: 'Furniture & Appliance Delivery',
      count: db.jobRequests.filter((j) => j.serviceCategory === 'DELIVERY').length,
      revenueShare: '18%',
      color: 'from-emerald-500 to-teal-400',
    },
  ];

  const cityBreakdown = [
    { city: 'Calgary (Primary Hub)', jobs: 18, revenue: '$14,850', growth: '+32%' },
    { city: 'Airdrie', jobs: 6, revenue: '$4,920', growth: '+24%' },
    { city: 'Strathmore', jobs: 4, revenue: '$3,180', growth: '+19%' },
    { city: 'Red Deer Corridor', jobs: 3, revenue: '$4,650', growth: '+28%' },
    { city: 'Edmonton Long-Distance', jobs: 5, revenue: '$9,400', growth: '+41%' },
  ];

  return (
    <div className="space-y-6 text-white">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#060C18] via-[#0B162A] to-[#08101E] p-6 sm:p-8 shadow-dark-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/35 bg-brand-orange/15 px-3.5 py-1 text-xs font-bold text-brand-orange">
              <BarChart3 className="h-3.5 w-3.5" />
              Executive Operations &amp; Marketing Intelligence
            </span>
            <h1 className="mt-2.5 font-heading text-2xl font-extrabold text-white sm:text-3xl">
              Reports &amp; Analytics
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-white/65">
              Real-time revenue tracking, quote-to-booking conversion rates, crew &amp; fleet
              utilization, and AI Marketing Manager attribution across Alberta.
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 shadow-dark-card">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400">↑ +28% MoM</span>
          </div>
          <div className="mt-3 font-heading text-2xl font-extrabold text-white">
            ${acceptedRevenueDollars.toLocaleString()}
          </div>
          <div className="text-xs text-white/60">
            Accepted Revenue (${collectedDepositDollars.toLocaleString()} Deposits Held)
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 shadow-dark-card">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400">↑ +34%</span>
          </div>
          <div className="mt-3 font-heading text-2xl font-extrabold text-white">
            ${totalQuotedDollars.toLocaleString()}
          </div>
          <div className="text-xs text-white/60">
            Active Quoted Pipeline ({db.quotes.length} Formal Quotes)
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 shadow-dark-card">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400">Target &gt; 60%</span>
          </div>
          <div className="mt-3 font-heading text-2xl font-extrabold text-white">
            {conversionRate}%
          </div>
          <div className="text-xs text-white/60">
            Lead-to-Booking Conversion ({db.bookings.length} of {db.leads.length} Leads)
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-5 shadow-dark-card">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400">↑ +35% Reach</span>
          </div>
          <div className="mt-3 font-heading text-2xl font-extrabold text-white">8.5K</div>
          <div className="text-xs text-white/60">
            Social Reach ({db.marketingPosts.length} AI Marketing Posts)
          </div>
        </div>
      </div>

      {/* Main Analytics 2-Column Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Service Line Breakdown */}
        <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card lg:col-span-6">
          <div className="flex items-center gap-2.5 pb-4">
            <Truck className="h-5 w-5 text-brand-orange" />
            <h2 className="font-heading text-lg font-bold text-white">
              Demand &amp; Revenue by Service Line
            </h2>
          </div>

          <div className="space-y-4">
            {serviceBreakdown.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-white/10 bg-[#060C18] p-4"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{item.name}</span>
                  <span className="text-brand-orange">
                    {item.count} Jobs • {item.revenueShare} Share
                  </span>
                </div>
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ width: item.revenueShare }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Area Performance */}
        <div className="rounded-2xl border border-white/10 bg-[#0A1324]/95 p-6 shadow-dark-card lg:col-span-6">
          <div className="flex items-center gap-2.5 pb-4">
            <MapPin className="h-5 w-5 text-brand-orange" />
            <h2 className="font-heading text-lg font-bold text-white">
              Regional Performance Across Alberta
            </h2>
          </div>

          <div className="space-y-3">
            {cityBreakdown.map((row) => (
              <div
                key={row.city}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#060C18] px-4 py-3"
              >
                <div>
                  <div className="text-xs font-bold text-white">{row.city}</div>
                  <div className="text-[11px] text-white/55">
                    {row.jobs} Completed &amp; Active Jobs
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-white">{row.revenue}</div>
                  <div className="text-[11px] font-bold text-emerald-400">{row.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
