'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Printer,
  ArrowLeft,
  Truck,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BUSINESS_INFO, JUNK_REMOVAL_DISCLAIMER } from '@/lib/constants/business';
import type { PlatformDatabaseState } from '@/lib/db/platform-store';

export default function BrandedQuotePdfDocumentPage() {
  const params = useParams();
  const quoteId = String(params?.id || '');
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
      <div className="p-12 text-center text-sm font-bold text-brand-navy">
        Preparing Branded Quotation Document...
      </div>
    );
  }

  const quote = db.quotes.find((q) => q.id === quoteId) || db.quotes[0];
  const customer = quote ? db.customers.find((c) => c.id === quote.customerId) : undefined;
  const job = quote ? db.jobRequests.find((j) => j.id === quote.jobRequestId) : undefined;

  if (!quote || !customer) {
    return (
      <div className="p-12 text-center text-sm font-bold text-red-600">
        Quotation record not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Non-Print Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-navy hover:text-brand-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotation Manager
        </Link>
        <div className="flex items-center gap-3">
          <Button type="button" variant="primary" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Save as Official PDF
          </Button>
        </div>
      </div>

      {/* Printable A4/Letter Executive Quotation Sheet */}
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-brand-navy/15 bg-white p-8 shadow-2xl sm:p-12 print:border-0 print:p-4 print:shadow-none print:[print-color-adjust:exact] print:[-webkit-print-color-adjust:exact]">
        {/* Faded Background Logo Watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden z-0"
        >
          <img
            src="/images/quickmove-logo.png"
            alt=""
            className="w-[520px] max-w-[85%] object-contain opacity-[0.06] print:opacity-[0.08] filter drop-shadow-sm"
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10">
          {/* Top Branded Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-4 border-brand-orange pb-6">
            <div className="flex items-start gap-4">
              {/* Official QuickMove Logo */}
              <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm border border-slate-200">
                <img
                  src="/images/quickmove-logo.png"
                  alt="QuickMove Solutions Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-extrabold text-brand-navy">
                  {BUSINESS_INFO.name}
                </h1>
                <p className="text-xs font-bold text-brand-orange">{BUSINESS_INFO.tagline}</p>
                <div className="mt-2 space-y-0.5 text-xs text-brand-charcoal">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                    {BUSINESS_INFO.primaryLocation}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-brand-orange" />
                    {BUSINESS_INFO.phoneDisplay}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-brand-orange" />
                    {BUSINESS_INFO.email}
                  </p>
                </div>
              </div>
            </div>

          <div className="text-left sm:text-right">
            <span className="inline-block rounded-lg bg-brand-navy px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
              Official Written Quotation
            </span>
            <p className="mt-2 font-mono text-2xl font-extrabold text-brand-navy">
              {quote.quoteNumber}
            </p>
            <p className="text-xs text-brand-muted">
              Version {quote.version} • Status: <strong>{quote.status}</strong>
            </p>
            <p className="text-xs text-brand-muted">
              Issued: {quote.createdAt.slice(0, 10)} • Valid Until:{' '}
              <strong>{quote.validUntil}</strong>
            </p>
          </div>
        </div>

        {/* Customer & Service Locations */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 text-xs">
          <div className="rounded-2xl bg-brand-light p-4">
            <p className="font-bold uppercase tracking-wider text-brand-muted">Prepared For</p>
            <p className="mt-1 font-heading text-base font-extrabold text-brand-navy">
              {customer.fullName}
            </p>
            <p className="mt-1 text-brand-charcoal">{customer.phone}</p>
            <p className="text-brand-charcoal">{customer.email}</p>
            <p className="mt-1 text-brand-muted">
              {customer.address}, {customer.city} {customer.postalCode}
            </p>
          </div>

          <div className="rounded-2xl bg-brand-light p-4">
            <p className="font-bold uppercase tracking-wider text-brand-muted">
              Proposed Schedule &amp; Route
            </p>
            <p className="mt-1 font-heading text-sm font-extrabold text-brand-navy">
              Target Date: {quote.proposedDate} ({quote.proposedWindow})
            </p>
            <p className="mt-1 text-brand-charcoal">
              <strong>Pickup:</strong> {job?.pickupAddress || customer.address},{' '}
              {job?.pickupCity || customer.city}
            </p>
            {job?.destinationAddress && (
              <p className="mt-0.5 text-brand-charcoal">
                <strong>Destination:</strong> {job.destinationAddress}, {job.destinationCity}
              </p>
            )}
          </div>
        </div>

        {/* Scope of Work */}
        <div className="mt-6 rounded-2xl border border-brand-navy/10 p-4 text-xs">
          <p className="font-bold uppercase tracking-wider text-brand-navy">
            Written Scope of Work
          </p>
          <p className="mt-1.5 leading-relaxed text-brand-charcoal">{quote.scopeSummary}</p>
        </div>

        {/* Itemized Line Items */}
        <div className="mt-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-brand-navy bg-brand-navy text-white">
                <th className="py-3 px-4 rounded-tl-xl">#</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Service / Item Description</th>
                <th className="py-3 px-4 text-right">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right rounded-tr-xl">Total (CAD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/10">
              {quote.lineItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-3.5 px-4 font-mono text-brand-muted">{index + 1}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-brand-orange">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-brand-navy">{item.description}</td>
                  <td className="py-3.5 px-4 text-right">{item.quantity}</td>
                  <td className="py-3.5 px-4 text-right">
                    ${(item.unitPriceCents / 100).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-brand-navy">
                    ${(item.totalCents / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Box */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-6 border-t border-brand-navy/15 pt-6">
          <div className="max-w-md space-y-2 text-[11px] text-brand-muted">
            <p className="font-bold text-brand-navy flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-orange" />
              Terms, Protection &amp; Operational Notes:
            </p>
            <p>{quote.termsAndNotes}</p>
            <p className="font-semibold text-brand-navy">
              <strong>Accepted Payment Methods:</strong> Interac e-Transfer and Debit Card only upon completion.
            </p>
            {quote.serviceCategory === 'JUNK_REMOVAL' && <p>{JUNK_REMOVAL_DISCLAIMER}</p>}
          </div>

          <div className="w-full sm:w-72 rounded-2xl bg-brand-light p-5 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-brand-muted">Subtotal:</span>
              <span className="font-bold text-brand-navy">
                ${(quote.subtotalCents / 100).toFixed(2)} CAD
              </span>
            </div>
            {quote.discountCents > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount Applied:</span>
                <span className="font-bold">-${(quote.discountCents / 100).toFixed(2)} CAD</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-brand-muted">Alberta GST ({quote.taxRatePercent}%):</span>
              <span className="font-bold text-brand-navy">
                ${(quote.taxCents / 100).toFixed(2)} CAD
              </span>
            </div>
            <div className="flex justify-between border-t border-brand-navy/15 pt-2 text-sm font-extrabold text-brand-navy">
              <span>Total Estimate:</span>
              <span className="text-brand-orange">${(quote.totalCents / 100).toFixed(2)} CAD</span>
            </div>
            {quote.depositCents > 0 && (
              <div className="flex justify-between text-[11px] text-brand-muted pt-1">
                <span>Booking Deposit:</span>
                <span className="font-bold">${(quote.depositCents / 100).toFixed(2)} CAD</span>
              </div>
            )}
          </div>
        </div>

        {/* Customer Acceptance Signature Block */}
        <div className="mt-8 border-t border-dashed border-brand-navy/20 pt-6 grid gap-6 sm:grid-cols-2 text-xs">
          <div>
            <p className="font-bold text-brand-navy">Customer Acceptance Signature</p>
            <div className="mt-6 border-b border-brand-navy/40 pb-1 text-brand-muted">
              {quote.status === 'ACCEPTED'
                ? `Digitally Accepted by ${customer.fullName}`
                : 'Sign here or accept digitally via your Customer Portal link'}
            </div>
          </div>
          <div>
            <p className="font-bold text-brand-navy">Authorized by QuickMove Solutions</p>
            <div className="mt-6 border-b border-brand-navy/40 pb-1 text-brand-navy font-semibold">
              Calgary Dispatch &amp; Estimating Team • {BUSINESS_INFO.phoneDisplay}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

