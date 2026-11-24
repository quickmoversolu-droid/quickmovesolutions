'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Printer,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Check,
  AlertCircle,
  Clock,
  Send,
  CreditCard,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BUSINESS_INFO } from '@/lib/constants/business';
import type { PlatformDatabaseState, InvoiceRecord, InvoicePaymentStatus } from '@/lib/db/platform-store';

function formatCategoryLabel(category?: string): string {
  switch (category) {
    case 'MOVING_CREW':
      return 'Moving Crew';
    case 'TRUCK_VEHICLE':
      return 'Equipped Truck';
    case 'MILEAGE':
      return 'Mileage';
    case 'FUEL_SURCHARGE':
      return 'Fuel Surcharge';
    case 'MOVING_SERVICE':
      return 'Crew & Truck';
    case 'LABOUR':
      return 'Labour';
    case 'PACKING_UNPACKING':
      return 'Packing';
    case 'MATERIALS':
      return 'Materials';
    case 'JUNK_REMOVAL':
      return 'Junk Removal';
    case 'DISPOSAL_HANDLING':
      return 'Disposal Fee';
    case 'DELIVERY':
      return 'Delivery';
    case 'STAIRS_ACCESS':
      return 'Access / Stairs';
    case 'TRAVEL_DISTANCE':
      return 'Travel';
    case 'SPECIALTY_ITEM':
      return 'Specialty Item';
    case 'CUSTOM':
      return 'Custom';
    default:
      return category?.replace(/_/g, ' ') || 'Service Item';
  }
}

export default function BrandedInvoicePdfDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = String(params?.id || '');
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [isUpdatingType, setIsUpdatingType] = useState(false);
  const [currentServiceType, setCurrentServiceType] = useState<string>('residential');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/platform?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.data) {
          setDb(res.data);
          const foundInv = res.data.invoices?.find(
            (inv: any) => inv.id === invoiceId || inv.invoiceNumber === invoiceId
          );
          if (foundInv?.serviceType) {
            setCurrentServiceType(foundInv.serviceType);
          }
        }
      });
  }, [invoiceId]);

  const handleUpdateServiceType = async (newType: string) => {
    if (!invoice) return;
    setIsUpdatingType(true);
    setCurrentServiceType(newType);
    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_INVOICE_STATUS',
          invoiceId: invoice.id,
          serviceType: newType,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setDb((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            invoices: prev.invoices.map((inv) =>
              inv.id === invoice.id ? { ...inv, serviceType: newType } : inv
            ),
          };
        });
        setEmailStatus(`Invoice service scope updated to ${newType === 'commercial' ? 'Commercial' : 'Residential'}.`);
      }
    } catch (err) {
      console.error('[Update Service Type Error]:', err);
    } finally {
      setIsUpdatingType(false);
    }
  };

  if (!db) {
    return (
      <div className="p-12 text-center text-sm font-bold text-brand-navy">
        Preparing Branded Official Invoice Document...
      </div>
    );
  }

  const invoice: InvoiceRecord | undefined =
    db.invoices?.find((inv) => inv.id === invoiceId || inv.invoiceNumber === invoiceId);

  if (!invoice) {
    return (
      <div className="p-12 text-center text-sm font-bold text-brand-navy space-y-4">
        <p className="text-red-500 font-extrabold text-base">Invoice Not Found ({invoiceId})</p>
        <p className="text-slate-500 text-xs">This invoice could not be located in the system records.</p>
        <div className="pt-2">
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-navy hover:text-brand-orange underline"
          >
            ← Back to Invoice Directory
          </Link>
        </div>
      </div>
    );
  }

  const customer = invoice
    ? db.customers.find((c) => c.id === invoice.customerId)
    : undefined;

  const booking = invoice?.bookingId
    ? db.bookings.find((b) => b.id === invoice.bookingId)
    : undefined;

  const quote = invoice?.quoteId
    ? db.quotes.find((q) => q.id === invoice.quoteId)
    : undefined;

  const job = invoice?.jobRequestId
    ? db.jobRequests.find((j) => j.id === invoice.jobRequestId)
    : undefined;

  if (!invoice) {
    return (
      <div className="p-12 text-center text-sm font-bold text-red-600">
        Invoice record not found.
      </div>
    );
  }

  const clientName = invoice.customerName || customer?.fullName || 'Valued Client';
  const clientEmail = invoice.customerEmail || invoice.recipientEmail || customer?.email || '';
  const clientPhone = invoice.customerPhone || customer?.phone || '';
  const clientAddress = invoice.customerAddress || customer?.address || '';

  const isPaid = invoice.status === 'PAID';
  const isPartiallyPaid = invoice.status === 'PARTIALLY_PAID';
  const isOverdue = invoice.status === 'OVERDUE';

  const handleSendEmail = async () => {
    if (!invoice) return;
    setIsSendingEmail(true);
    setEmailStatus(null);
    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_INVOICE_EMAIL',
          invoiceId: invoice.id,
          payload: { invoiceId: invoice.id },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        const target = data.recipientEmail || data.data?.recipientEmail || clientEmail;
        setEmailStatus('Invoice successfully emailed to ' + target);
      } else {
        setEmailStatus('Failed to send email: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      console.error('[Send Invoice Email Error]:', err);
      setEmailStatus('Network error while dispatching invoice email: ' + (err?.message || ''));
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleUpdateStatus = async (newStatus: InvoicePaymentStatus) => {
    if (!invoice) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_INVOICE_STATUS',
          invoiceId: invoice.id,
          status: newStatus,
          payload: {
            invoiceId: invoice.id,
            status: newStatus,
          },
        }),
      });
      const data = await res.json();
      if (data.ok && data.invoice) {
        setDb((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            invoices: prev.invoices.map((inv) =>
              inv.id === invoice.id ? { ...inv, ...data.invoice } : inv
            ),
          };
        });
        setEmailStatus(
          newStatus === 'PAID'
            ? '✅ Invoice marked as PAID in full! Status and balance updated successfully.'
            : `Invoice status changed to ${newStatus}.`
        );
      }
    } catch (err: any) {
      console.error('[Update Invoice Status Error]:', err);
      setEmailStatus('Failed to update invoice status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoice) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE_INVOICE',
          invoiceId: invoice.id,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push('/admin/invoices');
      } else {
        alert(data.error || 'Failed to delete invoice.');
      }
    } catch (err) {
      console.error('[Delete Invoice Error]:', err);
      alert('Network error deleting invoice.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Non-Print Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-navy hover:text-brand-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoice Directory
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {!isPaid ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => handleUpdateStatus('PAID')}
              disabled={isUpdatingStatus}
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isUpdatingStatus ? 'Updating...' : 'Mark as Paid'}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleUpdateStatus('ISSUED')}
              disabled={isUpdatingStatus}
              className="border-emerald-600/30 text-emerald-700 hover:bg-emerald-50"
            >
              <Check className="mr-2 h-4 w-4 text-emerald-600" />
              {isUpdatingStatus ? 'Updating...' : 'Paid in Full (Click to Re-open)'}
            </Button>
          )}

          <div className="flex items-center gap-2 rounded-xl border border-brand-navy/15 bg-white px-3 py-1.5 shadow-sm">
            <span className="text-xs font-bold text-brand-navy">Service Scope:</span>
            <select
              value={currentServiceType.toLowerCase()}
              onChange={(e) => handleUpdateServiceType(e.target.value)}
              disabled={isUpdatingType}
              className="rounded-lg border border-brand-navy/20 bg-brand-light px-2.5 py-1 text-xs font-bold text-brand-navy focus:border-brand-orange focus:outline-none"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          {clientEmail && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-white"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSendingEmail ? 'Sending Email...' : 'Email Invoice to Client'}
            </Button>
          )}
          <Button type="button" variant="primary" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Save as Official PDF
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleDeleteInvoice}
            disabled={isDeleting}
            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete Invoice'}
          </Button>
        </div>
      </div>

      {emailStatus && (
        <div
          className={`p-3 rounded-xl text-xs font-bold print:hidden ${
            emailStatus.includes('successfully')
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {emailStatus}
        </div>
      )}

      {/* Printable A4/Letter Executive Invoice Sheet */}
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
              <div className="flex items-center justify-start sm:justify-end gap-2">
                <span
                  className={`inline-block rounded-lg px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white ${
                    isPaid
                      ? 'bg-emerald-600'
                      : isOverdue
                      ? 'bg-red-600'
                      : isPartiallyPaid
                      ? 'bg-amber-600'
                      : 'bg-brand-navy'
                  }`}
                >
                  {isPaid ? 'PAID IN FULL' : isOverdue ? 'PAYMENT OVERDUE' : isPartiallyPaid ? 'PARTIAL PAYMENT' : 'OFFICIAL INVOICE'}
                </span>
                {!isPaid && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('PAID')}
                    disabled={isUpdatingStatus}
                    className="print:hidden inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-extrabold uppercase text-white shadow-sm hover:bg-emerald-500 transition-colors"
                    title="Click to Mark Paid"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {isUpdatingStatus ? 'Saving...' : 'Mark Paid'}
                  </button>
                )}
              </div>
              <p className="mt-2 font-mono text-2xl font-extrabold text-brand-navy">
                {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-brand-muted">
                Issue Date: <strong>{invoice.issueDate}</strong>
              </p>
              <p className="text-xs text-brand-muted">
                Payment Due: <strong>{invoice.dueDate}</strong>
              </p>
              {invoice.completionDate && (
                <p className="text-xs text-brand-muted">
                  Service Completed: <strong>{invoice.completionDate}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Customer & Service Locations */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 text-xs">
            <div className="rounded-2xl bg-brand-light p-4">
              <p className="font-bold uppercase tracking-wider text-brand-muted">Billed To (Client)</p>
              <p className="mt-1 font-heading text-base font-extrabold text-brand-navy">
                {clientName}
              </p>
              {clientPhone && <p className="mt-1 text-brand-charcoal">{clientPhone}</p>}
              {clientEmail && <p className="text-brand-charcoal">{clientEmail}</p>}
              {clientAddress && (
                <p className="mt-1 text-brand-muted">{clientAddress}</p>
              )}
            </div>

            <div className="rounded-2xl bg-brand-light p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold uppercase tracking-wider text-brand-muted">
                  Service &amp; Reference Details
                </p>
                <div className="print:hidden flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Change:</span>
                  <select
                    value={currentServiceType.toLowerCase()}
                    onChange={(e) => handleUpdateServiceType(e.target.value)}
                    disabled={isUpdatingType}
                    className="rounded-lg border border-brand-navy/20 bg-white px-2 py-0.5 text-xs font-bold text-brand-navy focus:border-brand-orange focus:outline-none"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>
              <p className="mt-1 font-heading text-sm font-extrabold text-brand-navy">
                Category: {invoice.serviceCategory} ({currentServiceType.toLowerCase() === 'commercial' ? 'Commercial' : 'Residential'})
              </p>
              {booking && (
                <p className="mt-1 text-brand-charcoal">
                  <strong>Booking Ref:</strong> {booking.bookingNumber} ({booking.scheduledDate})
                </p>
              )}
              {quote && (
                <p className="mt-0.5 text-brand-charcoal">
                  <strong>Quotation Ref:</strong> {quote.quoteNumber}
                </p>
              )}
              {job?.pickupAddress && (
                <p className="mt-1 text-brand-charcoal">
                  <strong>Job Location:</strong> {job.pickupAddress}, {job.pickupCity}
                  {job.destinationAddress ? ` → ${job.destinationAddress}, ${job.destinationCity}` : ''}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Line Items */}
          <div className="mt-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-brand-navy bg-brand-navy text-white">
                  <th className="py-3 px-4 rounded-tl-xl">#</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Qty</th>
                  <th className="py-3 px-4 text-right">Rate ($ CAD)</th>
                  <th className="py-3 px-4 text-right rounded-tr-xl">Amount ($ CAD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/10">
                {invoice.lineItems.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="py-3.5 px-4 font-mono text-brand-muted">{index + 1}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-brand-orange">
                      {formatCategoryLabel(item.category)}
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

          {/* Totals & Financial Box */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-6 border-t border-brand-navy/15 pt-6">
            {/* Payment Instructions / Interac */}
            <div className="max-w-md space-y-3 text-xs">
              <div className="rounded-2xl border-2 border-brand-orange/40 bg-orange-50/50 p-4">
                <p className="font-extrabold text-brand-navy flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <CreditCard className="h-4 w-4 text-brand-orange" />
                  Interac e-Transfer Payment Instructions
                </p>
                <div className="mt-2 space-y-1 text-xs text-brand-charcoal">
                  <p>
                    <strong>Recipient Email:</strong>{' '}
                    <span className="font-mono font-bold text-brand-navy">
                      quickmoversolu@gmail.com
                    </span>
                  </p>
                  <p>
                    <strong>Memo / Reference:</strong>{' '}
                    <span className="font-mono font-bold text-brand-orange">
                      {invoice.invoiceNumber}
                    </span>
                  </p>
                  <p className="text-[11px] text-brand-muted mt-1">
                    * QuickMove Solutions has Auto-Deposit enabled. No security question required.
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-brand-muted">
                <p className="font-bold text-brand-navy flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" />
                  Terms &amp; Operational Policies:
                </p>
                <p>{invoice.paymentTerms || 'Payment due immediately upon completion of services rendered.'}</p>
                {invoice.notesAndInstructions && (
                  <p className="italic text-brand-charcoal">{invoice.notesAndInstructions}</p>
                )}
              </div>
            </div>

            {/* Calculations Box */}
            <div className="w-full sm:w-80 rounded-2xl bg-brand-light p-5 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-brand-muted">Subtotal:</span>
                <span className="font-bold text-brand-navy">
                  ${(invoice.subtotalCents / 100).toFixed(2)} CAD
                </span>
              </div>
              {invoice.discountCents > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount Applied:</span>
                  <span className="font-bold">
                    -${(invoice.discountCents / 100).toFixed(2)} CAD
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-brand-muted">
                  Alberta GST ({invoice.taxRatePercent}%):
                </span>
                <span className="font-bold text-brand-navy">
                  ${(invoice.taxCents / 100).toFixed(2)} CAD
                </span>
              </div>
              <div className="flex justify-between border-t border-brand-navy/15 pt-2 text-sm font-extrabold text-brand-navy">
                <span>Grand Total:</span>
                <span className="text-brand-navy">
                  ${(invoice.totalCents / 100).toFixed(2)} CAD
                </span>
              </div>

              {invoice.depositPaidCents > 0 && (
                <div className="flex justify-between text-emerald-700 pt-1">
                  <span>Deposit Credited:</span>
                  <span className="font-bold">
                    -${(invoice.depositPaidCents / 100).toFixed(2)} CAD
                  </span>
                </div>
              )}

              {invoice.amountPaidCents > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Total Payments Applied:</span>
                  <span className="font-bold">
                    -${(invoice.amountPaidCents / 100).toFixed(2)} CAD
                  </span>
                </div>
              )}

              <div
                className={`flex justify-between border-t-2 pt-2 text-base font-extrabold rounded-xl p-2 ${
                  invoice.balanceDueCents <= 0
                    ? 'border-emerald-600 bg-emerald-100 text-emerald-900'
                    : 'border-brand-orange bg-orange-100 text-brand-navy'
                }`}
              >
                <span>Balance Due:</span>
                <span className={invoice.balanceDueCents <= 0 ? 'text-emerald-700' : 'text-brand-orange'}>
                  ${(invoice.balanceDueCents / 100).toFixed(2)} CAD
                </span>
              </div>

              {isPaid && (
                <p className="text-center font-bold text-emerald-700 flex items-center justify-center gap-1.5 pt-1 text-[11px]">
                  <CheckCircle2 className="h-4 w-4" />
                  Paid in Full • Thank you for your business!
                </p>
              )}
            </div>
          </div>

          {/* Official Sign-off & Verification Footer */}
          <div className="mt-8 border-t border-dashed border-brand-navy/20 pt-6 grid gap-6 sm:grid-cols-2 text-xs">
            <div>
              <p className="font-bold text-brand-navy">Customer Confirmation &amp; Receipt</p>
              <div className="mt-6 border-b border-brand-navy/40 pb-1 text-brand-muted">
                {isPaid
                  ? `Payment confirmed & receipted for ${clientName}`
                  : 'Customer signature / authorization upon job completion'}
              </div>
            </div>
            <div>
              <p className="font-bold text-brand-navy">Authorized by QuickMove Solutions</p>
              <div className="mt-6 border-b border-brand-navy/40 pb-1 text-brand-navy font-semibold">
                Calgary Accounting &amp; Dispatch • {BUSINESS_INFO.phoneDisplay}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

