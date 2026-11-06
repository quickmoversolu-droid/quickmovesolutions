'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  Printer,
  Calendar,
  Calculator,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type {
  PlatformDatabaseState,
  QuoteLineItemRecord,
  QuoteStatus,
} from '@/lib/db/platform-store';

const LINE_ITEM_CATEGORIES: {
  value: QuoteLineItemRecord['category'];
  label: string;
}[] = [
  { value: 'MOVING_SERVICE', label: 'Moving Crew & Equipped Truck' },
  { value: 'LABOUR', label: 'Additional Crew Labour' },
  { value: 'PACKING_UNPACKING', label: 'Packing & Unpacking Service' },
  { value: 'MATERIALS', label: 'Boxes & Protective Materials' },
  { value: 'JUNK_REMOVAL', label: 'Junk Removal & Hauling' },
  { value: 'DISPOSAL_HANDLING', label: 'Disposal / Recycling Transfer Fee' },
  { value: 'DELIVERY', label: 'Furniture / Appliance Delivery' },
  { value: 'STAIRS_ACCESS', label: 'Stairs / Elevator / Long-Walk Access' },
  { value: 'TRAVEL_DISTANCE', label: 'Inter-City / Highway Travel' },
  { value: 'SPECIALTY_ITEM', label: 'Heavy / Specialty Item Handling' },
  { value: 'CUSTOM', label: 'Custom Line Item' },
];

function QuotesManagerContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('jobRequestId') || '';

  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState<boolean>(Boolean(initialJobId));
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Quote Builder Form State
  const [jobRequestId, setJobRequestId] = useState<string>(initialJobId);
  const [proposedDate, setProposedDate] = useState<string>('2026-11-10');
  const [proposedWindow, setProposedWindow] = useState<string>('8:30 AM – 10:30 AM Arrival');
  const [scopeSummary, setScopeSummary] = useState<string>('');
  const [discountDollars, setDiscountDollars] = useState<number>(0);
  const [depositDollars, setDepositDollars] = useState<number>(100);
  const [validityDays, setValidityDays] = useState<number>(14);
  const [termsAndNotes, setTermsAndNotes] = useState<string>(
    'Includes uniformed crew, equipped truck, padded furniture blankets, floor runners, and standard cargo protection. Subject to 5% Alberta GST.'
  );
  const [lineItems, setLineItems] = useState<
    {
      id: string;
      category: QuoteLineItemRecord['category'];
      description: string;
      quantity: number;
      unitPriceDollars: number;
    }[]
  >([
    {
      id: 'item_1',
      category: 'MOVING_SERVICE',
      description: 'Professional Moving Crew & Equipped Box Truck (Estimated Hours)',
      quantity: 4,
      unitPriceDollars: 175,
    },
    {
      id: 'item_2',
      category: 'MATERIALS',
      description: 'Mattress Bags, Shrink Wrap & Floor Runner Protection Package',
      quantity: 1,
      unitPriceDollars: 65,
    },
  ]);

  const loadData = async () => {
    const res = await fetch('/api/admin/platform');
    const json = await res.json();
    if (json.ok && json.data) {
      setDb(json.data);
      if (!selectedQuoteId && json.data.quotes.length > 0) {
        setSelectedQuoteId(json.data.quotes[0].id);
      }
      if (!jobRequestId && json.data.jobRequests.length > 0) {
        const firstJob = json.data.jobRequests[0];
        setJobRequestId(firstJob.id);
        setProposedDate(firstJob.preferredDate);
        setScopeSummary(firstJob.aiSummary);
      }
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (db && initialJobId) {
      const targetJob = db.jobRequests.find((j) => j.id === initialJobId);
      if (targetJob) {
        setJobRequestId(targetJob.id);
        setProposedDate(targetJob.preferredDate);
        setScopeSummary(targetJob.aiSummary);
        setShowBuilder(true);
      }
    }
  }, [db, initialJobId]);

  if (!db) {
    return (
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-12 text-center text-sm font-bold text-brand-navy">
        Loading Quotation System...
      </div>
    );
  }

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        category: 'CUSTOM',
        description: '',
        quantity: 1,
        unitPriceDollars: 95,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Preview calculation (final calculation is strictly re-verified on server in /api/admin/platform)
  const previewSubtotal = lineItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPriceDollars) || 0),
    0
  );
  const previewTaxable = Math.max(0, previewSubtotal - (Number(discountDollars) || 0));
  const previewTax = previewTaxable * ((db.settings.albertaGstPercent || 5.0) / 100);
  const previewTotal = previewTaxable + previewTax;

  const handleCreateQuote = async (sendImmediately: boolean) => {
    setFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE_QUOTE',
        jobRequestId,
        proposedDate,
        proposedWindow,
        scopeSummary,
        discountCents: Math.round((Number(discountDollars) || 0) * 100),
        depositCents: Math.round((Number(depositDollars) || 0) * 100),
        validityDays,
        termsAndNotes,
        sendImmediately,
        lineItems: lineItems.map((li, idx) => ({
          id: li.id,
          category: li.category,
          description: li.description || 'Service Line Item',
          quantity: Number(li.quantity) || 1,
          unitPriceCents: Math.round((Number(li.unitPriceDollars) || 0) * 100),
          sortOrder: idx + 1,
        })),
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(
        `Created Quote ${data.quote.quoteNumber} (${
          sendImmediately ? 'Sent to Customer' : 'Saved as Draft'
        }).`
      );
      setSelectedQuoteId(data.quote.id);
      setShowBuilder(false);
      await loadData();
    } else {
      setFeedback(data.error || 'Error creating quote.');
    }
  };

  const handleQuoteStatusChange = async (quoteId: string, status: QuoteStatus) => {
    setFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE_QUOTE_STATUS',
        quoteId,
        status,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(`Quote ${data.quote.quoteNumber} marked as ${status}.`);
      await loadData();
    }
  };

  const activeQuote =
    db.quotes.find((q) => q.id === selectedQuoteId) || db.quotes[0];
  const activeQuoteCustomer = activeQuote
    ? db.customers.find((c) => c.id === activeQuote.customerId)
    : undefined;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="orange" className="mb-2">
            Part 9.1–9.3 • Itemized Quotations &amp; PDF Engine
          </Badge>
          <h1 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Quotation Builder, Financial Calculator &amp; PDF Generator
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Create itemized Moving, Junk Removal, and Delivery quotes with server-enforced Alberta
            GST calculations and printable Branded Quote PDFs.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => setShowBuilder((prev) => !prev)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {showBuilder ? 'Close Quote Builder' : 'Build New Itemized Quote'}
        </Button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Interactive Itemized Quote Builder */}
      {showBuilder && (
        <div className="rounded-3xl border-2 border-brand-orange bg-white p-6 shadow-xl sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-navy/10 pb-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-brand-orange" />
              <h2 className="font-heading text-xl font-extrabold text-brand-navy">
                New Itemized Quotation Builder
              </h2>
            </div>
            <Badge variant="orange">Server-Verified Totals (5% GST)</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Select Customer Job Request *
              </label>
              <select
                value={jobRequestId}
                onChange={(e) => {
                  const jId = e.target.value;
                  setJobRequestId(jId);
                  const found = db.jobRequests.find((j) => j.id === jId);
                  if (found) {
                    setProposedDate(found.preferredDate);
                    setScopeSummary(found.aiSummary);
                  }
                }}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-navy"
              >
                {db.jobRequests.map((j) => {
                  const cust = db.customers.find((c) => c.id === j.customerId);
                  const lead = db.leads.find((l) => l.id === j.leadId);
                  return (
                    <option key={j.id} value={j.id}>
                      {lead?.referenceCode || j.id} — {cust?.fullName} ({j.serviceType})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Proposed Service Date
              </label>
              <input
                type="date"
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Proposed Arrival Window
              </label>
              <input
                type="text"
                value={proposedWindow}
                onChange={(e) => setProposedWindow(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
              Written Scope Summary
            </label>
            <textarea
              rows={2}
              value={scopeSummary}
              onChange={(e) => setScopeSummary(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-brand-navy/15 p-3 text-xs text-brand-navy"
            />
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                Itemized Line Items
              </label>
              <button
                type="button"
                onClick={addLineItem}
                className="text-xs font-bold text-brand-orange hover:underline"
              >
                + Add Line Item Row
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {lineItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid gap-2.5 rounded-2xl border border-brand-navy/10 bg-brand-light/50 p-3 sm:grid-cols-12 items-center"
                >
                  <div className="sm:col-span-3">
                    <select
                      value={item.category}
                      onChange={(e) => {
                        const val = e.target.value as QuoteLineItemRecord['category'];
                        setLineItems((prev) =>
                          prev.map((r, i) => (i === idx ? { ...r, category: val } : r))
                        );
                      }}
                      className="w-full rounded-xl border border-brand-navy/15 bg-white px-2.5 py-2 text-xs font-bold text-brand-navy"
                    >
                      {LINE_ITEM_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLineItems((prev) =>
                          prev.map((r, i) => (i === idx ? { ...r, description: val } : r))
                        );
                      }}
                      placeholder="Item description..."
                      className="w-full rounded-xl border border-brand-navy/15 bg-white px-3 py-2 text-xs text-brand-navy"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setLineItems((prev) =>
                          prev.map((r, i) => (i === idx ? { ...r, quantity: val } : r))
                        );
                      }}
                      className="w-full rounded-xl border border-brand-navy/15 bg-white px-2.5 py-2 text-xs text-brand-navy"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      step="5"
                      min="0"
                      value={item.unitPriceDollars}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setLineItems((prev) =>
                          prev.map((r, i) => (i === idx ? { ...r, unitPriceDollars: val } : r))
                        );
                      }}
                      className="w-full rounded-xl border border-brand-navy/15 bg-white px-2.5 py-2 text-xs text-brand-navy"
                    />
                  </div>

                  <div className="sm:col-span-1 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                      title="Remove line item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount, Deposit & Summary */}
          <div className="grid gap-4 sm:grid-cols-3 border-t border-brand-navy/10 pt-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Discount ($ CAD)
              </label>
              <input
                type="number"
                min="0"
                value={discountDollars}
                onChange={(e) => setDiscountDollars(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-brand-navy/15 px-3 py-2 text-xs text-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Deposit Required ($ CAD)
              </label>
              <input
                type="number"
                min="0"
                value={depositDollars}
                onChange={(e) => setDepositDollars(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-brand-navy/15 px-3 py-2 text-xs text-brand-navy"
              />
            </div>

            <div className="rounded-2xl bg-brand-navy p-4 text-white text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-white/70">Subtotal:</span>
                <span className="font-bold">${previewSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Alberta GST (5%):</span>
                <span className="font-bold">${previewTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/15 pt-1 text-sm font-extrabold text-brand-orange">
                <span>Grand Total:</span>
                <span>${previewTotal.toFixed(2)} CAD</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleCreateQuote(false)}
            >
              Save as Draft Quote
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => handleCreateQuote(true)}
            >
              <Send className="mr-2 h-4 w-4" />
              Save &amp; Send Quote to Customer
            </Button>
          </div>
        </div>
      )}

      {/* Existing Quotes List & Inspector */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          {db.quotes.map((quo) => {
            const cust = db.customers.find((c) => c.id === quo.customerId);
            const selected = activeQuote?.id === quo.id;
            return (
              <button
                key={quo.id}
                type="button"
                onClick={() => setSelectedQuoteId(quo.id)}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                  selected
                    ? 'border-brand-orange bg-white shadow-md'
                    : 'border-brand-navy/10 bg-white/80 hover:border-brand-navy/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-brand-navy">
                    {quo.quoteNumber} (v{quo.version})
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                      quo.status === 'ACCEPTED'
                        ? 'bg-emerald-500/15 text-emerald-700'
                        : 'bg-brand-orange/15 text-brand-orange'
                    }`}
                  >
                    {quo.status}
                  </span>
                </div>
                <p className="mt-1.5 font-heading text-sm font-bold text-brand-navy">
                  {cust?.fullName} — ${(quo.totalCents / 100).toFixed(2)} CAD
                </p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  Proposed Date: {quo.proposedDate} • Valid Until: {quo.validUntil}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Quote Detail & Actions */}
        <div className="lg:col-span-7">
          {activeQuote ? (
            <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-navy/10 pb-4">
                <div>
                  <span className="font-mono text-sm font-extrabold text-brand-orange">
                    {activeQuote.quoteNumber}
                  </span>
                  <h2 className="mt-0.5 font-heading text-xl font-extrabold text-brand-navy">
                    {activeQuoteCustomer?.fullName} ({activeQuote.serviceType})
                  </h2>
                  <p className="mt-1 text-xs text-brand-muted">
                    Proposed: {activeQuote.proposedDate} ({activeQuote.proposedWindow}) • Valid
                    Until: {activeQuote.validUntil}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/quotes/${activeQuote.id}/pdf`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-xs font-extrabold text-white hover:bg-brand-navy/90"
                  >
                    <Printer className="h-3.5 w-3.5 text-brand-orange" />
                    Open Branded PDF View
                  </Link>
                  <Link
                    href={`/admin/bookings?jobRequestId=${activeQuote.jobRequestId}&quoteId=${activeQuote.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2 text-xs font-extrabold text-white hover:bg-brand-orange/90"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Convert to Booking
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl bg-brand-light p-4 text-xs">
                <p className="font-bold uppercase tracking-wider text-brand-muted">Scope Summary</p>
                <p className="mt-1 text-brand-navy leading-relaxed">{activeQuote.scopeSummary}</p>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-navy/10 text-[11px] uppercase tracking-wider text-brand-muted">
                      <th className="py-2 pr-3">Category</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Qty</th>
                      <th className="py-2 px-3 text-right">Unit Price</th>
                      <th className="py-2 pl-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-navy/10">
                    {activeQuote.lineItems.map((li) => (
                      <tr key={li.id}>
                        <td className="py-3 pr-3 font-mono text-[11px] font-bold text-brand-orange">
                          {li.category}
                        </td>
                        <td className="py-3 px-3 font-medium text-brand-navy">{li.description}</td>
                        <td className="py-3 px-3 text-right">{li.quantity}</td>
                        <td className="py-3 px-3 text-right">
                          ${(li.unitPriceCents / 100).toFixed(2)}
                        </td>
                        <td className="py-3 pl-3 text-right font-bold text-brand-navy">
                          ${(li.totalCents / 100).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Breakdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-brand-navy p-5 text-white text-xs">
                <div className="space-y-1">
                  <p className="text-white/70">
                    Subtotal: <strong>${(activeQuote.subtotalCents / 100).toFixed(2)} CAD</strong>
                  </p>
                  {activeQuote.discountCents > 0 && (
                    <p className="text-emerald-400">
                      Discount: -${(activeQuote.discountCents / 100).toFixed(2)} CAD
                    </p>
                  )}
                  <p className="text-white/70">
                    Alberta GST ({activeQuote.taxRatePercent}%):{' '}
                    <strong>${(activeQuote.taxCents / 100).toFixed(2)} CAD</strong>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider text-brand-orange font-bold">
                    Server-Calculated Grand Total
                  </p>
                  <p className="font-heading text-2xl font-extrabold text-white">
                    ${(activeQuote.totalCents / 100).toFixed(2)} CAD
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex flex-wrap items-center gap-2 border-t border-brand-navy/10 pt-4">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => handleQuoteStatusChange(activeQuote.id, 'SENT')}
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Send / Resend to Customer
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => handleQuoteStatusChange(activeQuote.id, 'ACCEPTED')}
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Mark Accepted
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuoteStatusChange(activeQuote.id, 'DECLINED')}
                >
                  <XCircle className="mr-1.5 h-3.5 w-3.5" />
                  Mark Declined
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function AdminQuotesPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-12 text-center text-sm font-bold text-brand-navy">
          Loading Quotation System...
        </div>
      }
    >
      <QuotesManagerContent />
    </Suspense>
  );
}

