'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  KeyRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { PlatformDatabaseState } from '@/lib/db/platform-store';

export default function AdminCustomersDirectoryPage() {
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/platform')
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.data) {
          setDb(res.data);
          if (res.data.customers.length > 0) {
            setSelectedId(res.data.customers[0].id);
          }
        }
      });
  }, []);

  if (!db) {
    return (
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-12 text-center text-sm font-bold text-brand-navy">
        Loading Customer Directory...
      </div>
    );
  }

  const filtered = db.customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const activeCustomer =
    db.customers.find((c) => c.id === selectedId) || filtered[0];

  const customerLeads = activeCustomer
    ? db.leads.filter((l) => l.customerId === activeCustomer.id)
    : [];
  const customerJobs = activeCustomer
    ? db.jobRequests.filter((j) => j.customerId === activeCustomer.id)
    : [];
  const customerQuotes = activeCustomer
    ? db.quotes.filter((q) => q.customerId === activeCustomer.id)
    : [];
  const customerBookings = activeCustomer
    ? db.bookings.filter((b) => b.customerId === activeCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="orange" className="mb-2">
            Section 8.4 • Deduplicated Customer CRM
          </Badge>
          <h1 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Customers &amp; Multi-Service History
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Unified customer profiles linking Moving, Junk Removal, and Delivery history without
            duplicate records.
          </p>
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer by name, email, phone, or city..."
          className="w-full rounded-xl border border-brand-navy/15 bg-white pl-10 pr-4 py-2.5 text-sm text-brand-navy"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Customer List */}
        <div className="space-y-3 lg:col-span-5">
          {filtered.map((cust) => {
            const isSelected = activeCustomer?.id === cust.id;
            const jobCount = db.jobRequests.filter((j) => j.customerId === cust.id).length;
            return (
              <button
                key={cust.id}
                type="button"
                onClick={() => setSelectedId(cust.id)}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-brand-orange bg-white shadow-md'
                    : 'border-brand-navy/10 bg-white/80 hover:border-brand-navy/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-extrabold text-brand-navy">
                    {cust.fullName}
                  </span>
                  <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-[10px] font-bold text-brand-navy">
                    {jobCount} Job(s)
                  </span>
                </div>
                <p className="mt-1 text-xs text-brand-muted">
                  {cust.city}, AB • {cust.phone}
                </p>
                <p className="text-[11px] text-brand-muted truncate">{cust.email}</p>
              </button>
            );
          })}
        </div>

        {/* Customer Profile Detail */}
        <div className="lg:col-span-7">
          {activeCustomer ? (
            <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-navy/10 pb-4">
                <div>
                  <Badge variant="navy" className="mb-1.5">
                    Customer ID: {activeCustomer.id}
                  </Badge>
                  <h2 className="font-heading text-2xl font-extrabold text-brand-navy">
                    {activeCustomer.fullName}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-brand-muted">
                    <span className="inline-flex items-center gap-1 font-bold text-brand-navy">
                      <Phone className="h-3.5 w-3.5 text-brand-orange" />
                      {activeCustomer.phone} ({activeCustomer.preferredContact})
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-brand-navy">
                      <Mail className="h-3.5 w-3.5 text-brand-orange" />
                      {activeCustomer.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                      {activeCustomer.address}, {activeCustomer.city} {activeCustomer.postalCode}
                    </span>
                  </div>
                </div>

                {activeCustomer.portalPasscode && (
                  <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 px-4 py-2.5 text-xs">
                    <p className="flex items-center gap-1 font-bold text-brand-orange">
                      <KeyRound className="h-3.5 w-3.5" />
                      Customer Portal Access Code
                    </p>
                    <p className="mt-0.5 font-mono font-extrabold text-brand-navy">
                      {activeCustomer.portalPasscode}
                    </p>
                  </div>
                )}
              </div>

              {/* Linked Leads & Jobs */}
              <div>
                <h3 className="font-heading text-sm font-extrabold uppercase tracking-wider text-brand-navy">
                  Job Requests &amp; Lead History ({customerJobs.length})
                </h3>
                <div className="mt-3 space-y-2.5">
                  {customerJobs.map((job) => {
                    const lead = customerLeads.find((l) => l.id === job.leadId);
                    return (
                      <div
                        key={job.id}
                        className="rounded-2xl border border-brand-navy/10 bg-brand-light/60 p-4 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-brand-navy">
                            {lead?.referenceCode || job.id} • {job.serviceType}
                          </span>
                          <span className="rounded-full bg-brand-orange/15 px-2.5 py-0.5 text-[10px] font-bold text-brand-orange">
                            {job.lifecycleStage}
                          </span>
                        </div>
                        <p className="mt-1 text-brand-charcoal">{job.aiSummary}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <Link
                            href="/admin/jobs"
                            className="font-bold text-brand-orange hover:underline"
                          >
                            Open Job &amp; Checklist →
                          </Link>
                          <Link
                            href={`/admin/quotes?jobRequestId=${job.id}`}
                            className="font-bold text-brand-navy hover:underline"
                          >
                            Create Quote →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Linked Quotes & Bookings */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-navy/10 p-4">
                  <h4 className="flex items-center gap-1.5 font-heading text-xs font-extrabold uppercase tracking-wider text-brand-navy">
                    <FileText className="h-4 w-4 text-brand-orange" />
                    Quotations ({customerQuotes.length})
                  </h4>
                  <div className="mt-2.5 space-y-2 text-xs">
                    {customerQuotes.length > 0 ? (
                      customerQuotes.map((q) => (
                        <div
                          key={q.id}
                          className="flex items-center justify-between rounded-xl bg-brand-light p-2.5"
                        >
                          <div>
                            <p className="font-mono font-bold text-brand-navy">{q.quoteNumber}</p>
                            <p className="text-[11px] text-brand-muted">{q.status}</p>
                          </div>
                          <span className="font-heading font-extrabold text-brand-navy">
                            ${(q.totalCents / 100).toFixed(2)} CAD
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-brand-muted">No quotes issued yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-brand-navy/10 p-4">
                  <h4 className="flex items-center gap-1.5 font-heading text-xs font-extrabold uppercase tracking-wider text-brand-navy">
                    <Calendar className="h-4 w-4 text-brand-orange" />
                    Bookings ({customerBookings.length})
                  </h4>
                  <div className="mt-2.5 space-y-2 text-xs">
                    {customerBookings.length > 0 ? (
                      customerBookings.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between rounded-xl bg-brand-light p-2.5"
                        >
                          <div>
                            <p className="font-mono font-bold text-brand-navy">{b.bookingNumber}</p>
                            <p className="text-[11px] text-brand-muted">{b.scheduledDate}</p>
                          </div>
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            {b.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-brand-muted">No scheduled bookings yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-brand-navy/10 bg-white p-10 text-center text-sm text-brand-muted">
              Select a customer from the directory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

