'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Receipt,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  Printer,
  Calendar,
  CreditCard,
  Clock,
  AlertCircle,
  Search,
  DollarSign,
  ArrowRight,
  Filter,
  FileCheck,
  Building2,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type {
  PlatformDatabaseState,
  InvoiceRecord,
  InvoiceLineItemRecord,
  InvoicePaymentStatus,
} from '@/lib/db/platform-store';

const LINE_ITEM_CATEGORIES: {
  value: InvoiceLineItemRecord['category'];
  label: string;
  defaultDescription: string;
  defaultUnitPrice: number;
}[] = [
  { value: 'MOVING_CREW', label: 'Moving Crew (Labour)', defaultDescription: 'Professional Moving Crew (Hourly Labour)', defaultUnitPrice: 110 },
  { value: 'TRUCK_VEHICLE', label: 'Equipped Moving Truck', defaultDescription: 'Equipped 20ft Moving Box Truck', defaultUnitPrice: 65 },
  { value: 'MILEAGE', label: 'Mileage / Travel Distance', defaultDescription: 'Travel Mileage (Per km rate)', defaultUnitPrice: 1.5 },
  { value: 'FUEL_SURCHARGE', label: 'Fuel / Fuel Surcharge', defaultDescription: 'Fuel Surcharge / Fuel Expense', defaultUnitPrice: 45 },
  { value: 'MOVING_SERVICE', label: 'Moving Crew & Equipped Truck (Combo)', defaultDescription: 'Professional Moving Crew & Equipped Box Truck', defaultUnitPrice: 175 },
  { value: 'LABOUR', label: 'Additional Crew Labour / Helper', defaultDescription: 'Additional Crew Labour / Helper', defaultUnitPrice: 55 },
  { value: 'PACKING_UNPACKING', label: 'Packing & Unpacking Service', defaultDescription: 'Full Packing & Unpacking Service', defaultUnitPrice: 95 },
  { value: 'MATERIALS', label: 'Boxes & Protective Materials', defaultDescription: 'Mattress Bags, Shrink Wrap & Floor Protection Package', defaultUnitPrice: 65 },
  { value: 'JUNK_REMOVAL', label: 'Junk Removal & Hauling', defaultDescription: 'Junk Removal, Hauling & Loading Labour', defaultUnitPrice: 150 },
  { value: 'DISPOSAL_HANDLING', label: 'Disposal / Landfill Transfer Fee', defaultDescription: 'City Landfill & Disposal Transfer Fee', defaultUnitPrice: 85 },
  { value: 'DELIVERY', label: 'Furniture / Appliance Delivery', defaultDescription: 'White Glove Furniture / Appliance Delivery', defaultUnitPrice: 120 },
  { value: 'STAIRS_ACCESS', label: 'Stairs / Elevator / Long-Walk Access', defaultDescription: 'Stairs / Long-Walk Access Handling Fee', defaultUnitPrice: 50 },
  { value: 'TRAVEL_DISTANCE', label: 'Inter-City / Highway Travel', defaultDescription: 'Inter-City Highway Transit Fee', defaultUnitPrice: 100 },
  { value: 'SPECIALTY_ITEM', label: 'Heavy / Specialty Item Handling', defaultDescription: 'Piano / Heavy Safe Specialty Handling', defaultUnitPrice: 150 },
  { value: 'CUSTOM', label: 'Custom Line Item / Adjustment', defaultDescription: 'Custom Service Line Item', defaultUnitPrice: 95 },
];

function InvoicesManagerContent() {
  const searchParams = useSearchParams();
  const initialBookingId = searchParams.get('bookingId') || '';
  const initialQuoteId = searchParams.get('quoteId') || '';

  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [showBuilder, setShowBuilder] = useState<boolean>(Boolean(initialBookingId || initialQuoteId));
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvoicePaymentStatus>('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  // Form State
  const [selectedBookingId, setSelectedBookingId] = useState<string>(initialBookingId);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>(initialQuoteId);
  const [customerId, setCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [serviceCategory, setServiceCategory] = useState<'MOVING' | 'JUNK_REMOVAL' | 'DELIVERY'>('MOVING');
  const [serviceType, setServiceType] = useState<string>('residential');
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [completionDate, setCompletionDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<InvoicePaymentStatus>('ISSUED');
  const [discountDollars, setDiscountDollars] = useState<number>(0);
  const [depositPaidDollars, setDepositPaidDollars] = useState<number>(0);
  const [amountPaidDollars, setAmountPaidDollars] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<InvoiceRecord['paymentMethod']>('INTERAC_E_TRANSFER');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [paymentTerms, setPaymentTerms] = useState<string>(
    'Payment due immediately upon completion of services rendered via Interac e-Transfer to quickmoversolu@gmail.com'
  );
  const [notesAndInstructions, setNotesAndInstructions] = useState<string>(
    'Thank you for choosing QuickMove Solutions. Please include the Invoice Number in your Interac e-Transfer memo.'
  );

  const [lineItems, setLineItems] = useState<
    {
      id: string;
      category: InvoiceLineItemRecord['category'];
      description: string;
      quantity: number;
      unitPriceDollars: number;
    }[]
  >([
    {
      id: 'item_1',
      category: 'MOVING_CREW',
      description: 'Professional Moving Crew (Hourly Labour)',
      quantity: 4,
      unitPriceDollars: 110,
    },
    {
      id: 'item_2',
      category: 'TRUCK_VEHICLE',
      description: 'Equipped 20ft Moving Box Truck',
      quantity: 4,
      unitPriceDollars: 65,
    },
  ]);

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/platform');
      const json = await res.json();
      if (json.ok && json.data) {
        setDb(json.data);
      }
    } catch {
      // silently fail or retry
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync form when booking or quote is selected
  useEffect(() => {
    if (!db) return;

    if (selectedBookingId) {
      const booking = db.bookings?.find((b) => b.id === selectedBookingId);
      if (booking) {
        setCustomerId(booking.customerId);
        setServiceCategory(booking.serviceCategory || 'MOVING');
        setServiceType(booking.serviceType || 'residential');
        if (booking.scheduledDate) {
          setCompletionDate(booking.scheduledDate);
        }

        const customer = db.customers?.find((c) => c.id === booking.customerId);
        if (customer) {
          setCustomerName(customer.fullName);
          setCustomerEmail(customer.email);
          setCustomerPhone(customer.phone);
          setCustomerAddress(customer.address);
        }

        // If there's an associated quote, import quote line items and deposit
        if (booking.quoteId) {
          const quote = db.quotes?.find((q) => q.id === booking.quoteId);
          if (quote) {
            setSelectedQuoteId(quote.id);
            if (quote.depositCents) {
              setDepositPaidDollars(quote.depositCents / 100);
            }
            if (quote.discountCents) {
              setDiscountDollars(quote.discountCents / 100);
            }
            if (quote.lineItems && quote.lineItems.length > 0) {
              setLineItems(
                quote.lineItems.map((li, idx) => ({
                  id: `item_${idx + 1}`,
                  category: li.category,
                  description: li.description,
                  quantity: li.quantity,
                  unitPriceDollars: li.unitPriceCents / 100,
                }))
              );
            }
          }
        }
      }
    } else if (selectedQuoteId) {
      const quote = db.quotes?.find((q) => q.id === selectedQuoteId);
      if (quote) {
        setCustomerId(quote.customerId);
        setServiceCategory(quote.serviceCategory || 'MOVING');
        setServiceType(quote.serviceType || 'residential');
        if (quote.depositCents) {
          setDepositPaidDollars(quote.depositCents / 100);
        }
        if (quote.discountCents) {
          setDiscountDollars(quote.discountCents / 100);
        }
        const customer = db.customers?.find((c) => c.id === quote.customerId);
        if (customer) {
          setCustomerName(customer.fullName);
          setCustomerEmail(customer.email);
          setCustomerPhone(customer.phone);
          setCustomerAddress(customer.address);
        }
        if (quote.lineItems && quote.lineItems.length > 0) {
          setLineItems(
            quote.lineItems.map((li, idx) => ({
              id: `item_${idx + 1}`,
              category: li.category,
              description: li.description,
              quantity: li.quantity,
              unitPriceDollars: li.unitPriceCents / 100,
            }))
          );
        }
      }
    }
  }, [selectedBookingId, selectedQuoteId, db]);

  // Financial calculations
  const subtotalDollars = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.unitPriceDollars || 0), 0);
  }, [lineItems]);

  const afterDiscountDollars = Math.max(0, subtotalDollars - discountDollars);
  const taxDollars = afterDiscountDollars * 0.05; // Alberta 5% GST
  const grandTotalDollars = afterDiscountDollars + taxDollars;
  const balanceDueDollars = Math.max(0, grandTotalDollars - depositPaidDollars - amountPaidDollars);

  // Line item helpers
  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        category: 'MOVING_CREW',
        description: 'Professional Moving Crew (Hourly Labour)',
        quantity: 1,
        unitPriceDollars: 110,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: string, value: any) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === 'category') {
            const matching = LINE_ITEM_CATEGORIES.find((c) => c.value === value);
            const isDescDefault =
              !item.description ||
              item.description.trim() === '' ||
              LINE_ITEM_CATEGORIES.some((c) => c.defaultDescription === item.description);
            const isPriceDefault =
              !item.unitPriceDollars ||
              LINE_ITEM_CATEGORIES.some((c) => c.defaultUnitPrice === item.unitPriceDollars);
            return {
              ...item,
              category: value,
              description:
                isDescDefault && matching?.defaultDescription ? matching.defaultDescription : item.description,
              unitPriceDollars:
                isPriceDefault && matching?.defaultUnitPrice ? matching.defaultUnitPrice : item.unitPriceDollars,
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Submit invoice
  const handleSaveInvoice = async (sendEmailDirectly = false) => {
    // Email is completely optional. If "Save & Email" is clicked without an email,
    // we save the invoice as issued and simply skip the email dispatch without errors.
    const shouldDispatchEmail = Boolean(sendEmailDirectly && customerEmail?.trim());

    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      bookingId: selectedBookingId || undefined,
      quoteId: selectedQuoteId || undefined,
      customerId: customerId || undefined,
      customerName: customerName?.trim() || undefined,
      customerEmail: customerEmail?.trim() || undefined,
      customerPhone: customerPhone?.trim() || undefined,
      customerAddress: customerAddress?.trim() || undefined,
      serviceCategory,
      serviceType,
      status: sendEmailDirectly ? 'ISSUED' : status,
      issueDate,
      dueDate,
      completionDate,
      lineItems: lineItems.map((li) => ({
        id: li.id,
        category: li.category,
        description: li.description,
        quantity: Number(li.quantity),
        unitPriceCents: Math.round(Number(li.unitPriceDollars) * 100),
        totalCents: Math.round(Number(li.quantity) * Number(li.unitPriceDollars) * 100),
      })),
      discountCents: Math.round(discountDollars * 100),
      depositPaidCents: Math.round(depositPaidDollars * 100),
      amountPaidCents: Math.round(amountPaidDollars * 100),
      paymentMethod,
      paymentReference,
      paymentTerms,
      notesAndInstructions,
      sendEmail: shouldDispatchEmail,
    };

    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_INVOICE',
          ...payload,
          payload,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        const inv = data.invoice || data.data || data;
        let successMessage = `Invoice ${inv?.invoiceNumber || ''} saved successfully!`;
        if (shouldDispatchEmail) {
          successMessage += ` Email dispatched to ${customerEmail.trim()}.`;
        } else if (sendEmailDirectly && !customerEmail?.trim()) {
          successMessage += ` (Saved as issued; email was skipped because no customer email address was provided).`;
        }
        setFeedback({
          text: successMessage,
          type: 'success',
        });
        setShowBuilder(false);
        await loadData();
      } else {
        setFeedback({ text: data.error || 'Failed to create invoice.', type: 'error' });
      }
    } catch (err: any) {
      console.error('[Create Invoice Error]:', err);
      setFeedback({ text: err?.message || 'Network error saving invoice.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1-Click Update Status
  const handleUpdateStatus = async (invoiceId: string, newStatus: InvoicePaymentStatus) => {
    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_INVOICE_STATUS',
          invoiceId,
          status: newStatus,
          payload: {
            invoiceId,
            status: newStatus,
          },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback({ text: `Invoice marked as ${newStatus}`, type: 'success' });
        await loadData();
      } else {
        setFeedback({ text: data.error || 'Failed to update invoice status.', type: 'error' });
      }
    } catch (err: any) {
      console.error('[Update Status Error]:', err);
      setFeedback({ text: 'Failed to update invoice status.', type: 'error' });
    }
  };

  // Dispatch Email
  const handleSendEmail = async (invoiceId: string) => {
    setSendingEmailId(invoiceId);
    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_INVOICE_EMAIL',
          invoiceId,
          payload: { invoiceId },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        const target = data.recipientEmail || data.data?.recipientEmail || 'client';
        setFeedback({ text: `Invoice emailed to ${target}`, type: 'success' });
        await loadData();
      } else {
        setFeedback({ text: data.error || 'Email dispatch failed.', type: 'error' });
      }
    } catch (err: any) {
      console.error('[Send Email Error]:', err);
      setFeedback({ text: 'Failed to dispatch email.', type: 'error' });
    } finally {
      setSendingEmailId(null);
    }
  };

  // Filter & Search Invoices
  const invoices = db?.invoices || [];
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesNum = inv.invoiceNumber.toLowerCase().includes(q);
        const matchesName = (inv.customerName || '').toLowerCase().includes(q);
        const matchesEmail = (inv.customerEmail || inv.recipientEmail || '').toLowerCase().includes(q);
        if (!matchesNum && !matchesName && !matchesEmail) return false;
      }
      return true;
    });
  }, [invoices, statusFilter, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let totalInvoicedCents = 0;
    let totalPaidCents = 0;
    let totalBalanceCents = 0;
    let countPaid = 0;
    let countPending = 0;

    invoices.forEach((inv) => {
      totalInvoicedCents += inv.totalCents || 0;
      totalPaidCents += (inv.amountPaidCents || 0) + (inv.depositPaidCents || 0);
      totalBalanceCents += inv.balanceDueCents || 0;
      if (inv.status === 'PAID') countPaid++;
      else countPending++;
    });

    return {
      totalInvoiced: (totalInvoicedCents / 100).toFixed(2),
      totalPaid: (totalPaidCents / 100).toFixed(2),
      totalBalance: (totalBalanceCents / 100).toFixed(2),
      countPaid,
      countPending,
      countTotal: invoices.length,
    };
  }, [invoices]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-brand-orange/10 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-orange">
              Billing &amp; Financials
            </span>
            <span className="text-xs text-brand-muted">Alberta 5% GST Enforced</span>
          </div>
          <h1 className="mt-1 font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Invoices &amp; Client Billing Engine
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Issue post-job invoices with automated Alberta GST, Interac e-Transfer instructions, and executive printable PDFs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => setShowBuilder(!showBuilder)}
            className="flex items-center gap-2 shadow-lg shadow-brand-orange/20"
          >
            {showBuilder ? (
              <>Close Invoice Builder</>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Generate New Invoice
              </>
            )}
          </Button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs hover:underline opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-brand-navy/60 p-4 shadow-sm backdrop-blur-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Invoiced</p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-white">
            ${metrics.totalInvoiced} <span className="text-xs text-slate-400 font-normal">CAD</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">{metrics.countTotal} total invoices issued</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-navy/60 p-4 shadow-sm backdrop-blur-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Total Collected</p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-emerald-400">
            ${metrics.totalPaid} <span className="text-xs text-slate-400 font-normal">CAD</span>
          </p>
          <p className="mt-1 text-[11px] text-emerald-500/80">{metrics.countPaid} paid in full</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-navy/60 p-4 shadow-sm backdrop-blur-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">Outstanding Balance</p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-brand-orange">
            ${metrics.totalBalance} <span className="text-xs text-slate-400 font-normal">CAD</span>
          </p>
          <p className="mt-1 text-[11px] text-brand-orange/80">{metrics.countPending} pending payment</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-navy/60 p-4 shadow-sm backdrop-blur-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Payment Channel</p>
          <p className="mt-1 font-heading text-sm font-extrabold text-white truncate">
            quickmoversolu@gmail.com
          </p>
          <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Auto-Deposit Enabled
          </p>
        </div>
      </div>

      {/* Interactive Invoice Builder Drawer */}
      {showBuilder && (
        <div className="rounded-3xl border border-brand-orange/40 bg-brand-navy/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/20 text-brand-orange">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-extrabold text-white">
                  Executive Invoice Generator
                </h2>
                <p className="text-xs text-slate-400">
                  Select a completed booking or accepted quote to auto-populate all client and job details.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-brand-orange/20 px-3 py-1 text-[11px] font-extrabold text-brand-orange">
              Alberta 5% GST Auto-Calculated
            </span>
          </div>

          <div className="space-y-6">
            {/* Quick Sourcing Selector */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Source from Completed Booking (Optional)
                </label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => {
                    setSelectedBookingId(e.target.value);
                    if (e.target.value) setSelectedQuoteId('');
                  }}
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                >
                  <option value="">-- Manual Entry or Select Booking --</option>
                  {db?.bookings?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bookingNumber} • {b.scheduledDate} ({b.serviceCategory})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Source from Accepted Quote (Optional)
                </label>
                <select
                  value={selectedQuoteId}
                  onChange={(e) => {
                    setSelectedQuoteId(e.target.value);
                    if (e.target.value) setSelectedBookingId('');
                  }}
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                >
                  <option value="">-- Select from Existing Quotations --</option>
                  {db?.quotes?.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.quoteNumber} • ${(q.totalCents / 100).toFixed(2)} CAD ({q.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid gap-4 sm:grid-cols-4 border-t border-white/10 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Customer / Business Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. John Doe or Company"
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Customer Email (Optional)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Optional — leave blank if not emailing"
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Customer Phone</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(403) 555-0199"
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Billing / Service Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="123 4 Ave SW, Calgary, AB"
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                />
              </div>
            </div>

            {/* Dates & Categories */}
            <div className="grid gap-4 sm:grid-cols-5 border-t border-white/10 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Service Category</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                >
                  <option value="MOVING">Moving Services</option>
                  <option value="JUNK_REMOVAL">Junk Removal</option>
                  <option value="DELIVERY">Delivery Services</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Completion Date</label>
                <input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Payment Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InvoicePaymentStatus)}
                  className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none font-bold"
                >
                  <option value="ISSUED">ISSUED (Payment Pending)</option>
                  <option value="PAID">PAID (Payment Received)</option>
                  <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
                  <option value="OVERDUE">OVERDUE</option>
                </select>
              </div>
            </div>

            {/* Line Items Editor */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-heading text-sm font-extrabold text-white">Itemized Invoice Line Items</p>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Line Item
                </button>
              </div>

              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-white/10 bg-brand-charcoal/40 p-3"
                  >
                    <span className="font-mono text-xs text-slate-400 w-6 text-center">{index + 1}</span>
                    <select
                      value={item.category}
                      onChange={(e) => updateLineItem(item.id, 'category', e.target.value)}
                      className="rounded-xl border border-white/15 bg-brand-navy/90 px-3 py-1.5 text-xs text-white focus:border-brand-orange focus:outline-none sm:w-48"
                    >
                      {LINE_ITEM_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Item or service description"
                      className="flex-1 rounded-xl border border-white/15 bg-brand-navy/90 px-3 py-1.5 text-xs text-white focus:border-brand-orange focus:outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          placeholder="Qty"
                          className="w-full rounded-xl border border-white/15 bg-brand-navy/90 px-2 py-1.5 text-right text-xs text-white focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                      <span className="text-xs text-slate-400">×</span>
                      <div className="w-24">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={item.unitPriceDollars}
                          onChange={(e) => updateLineItem(item.id, 'unitPriceDollars', parseFloat(e.target.value) || 0)}
                          placeholder="Rate"
                          className="w-full rounded-xl border border-white/15 bg-brand-navy/90 px-2 py-1.5 text-right text-xs text-white focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                      <div className="w-24 text-right font-mono text-xs font-bold text-brand-orange">
                        ${((item.quantity || 0) * (item.unitPriceDollars || 0)).toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length <= 1}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adjustments & Totals Summary */}
            <div className="grid gap-6 sm:grid-cols-2 border-t border-white/10 pt-4">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Discount ($ CAD)</label>
                    <input
                      type="number"
                      min="0"
                      value={discountDollars}
                      onChange={(e) => setDiscountDollars(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-1.5 text-xs text-white focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Deposit Credited ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={depositPaidDollars}
                      onChange={(e) => setDepositPaidDollars(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-1.5 text-xs text-white focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Payments Applied ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={amountPaidDollars}
                      onChange={(e) => setAmountPaidDollars(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-1.5 text-xs text-white focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-1.5 text-xs text-white focus:border-brand-orange focus:outline-none"
                    >
                      <option value="INTERAC_E_TRANSFER">Interac e-Transfer</option>
                      <option value="CREDIT_CARD">Credit Card / Debit</option>
                      <option value="CASH">Cash</option>
                      <option value="DIRECT_DEPOSIT">Direct Deposit</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Payment Reference / Memo</label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="e.g. Interac Ref # or Receipt"
                      className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-1.5 text-xs text-white focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Notes &amp; Interac Instructions</label>
                  <textarea
                    rows={2}
                    value={notesAndInstructions}
                    onChange={(e) => setNotesAndInstructions(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-brand-charcoal/60 px-3 py-1.5 text-xs text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Calculations Card */}
              <div className="rounded-2xl border border-white/15 bg-brand-charcoal/60 p-5 space-y-2 text-xs">
                <p className="font-heading text-sm font-extrabold text-white mb-2">Financial Breakdown (Alberta 5% GST)</p>
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-white">${subtotalDollars.toFixed(2)} CAD</span>
                </div>
                {discountDollars > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Applied:</span>
                    <span className="font-mono font-bold">-${discountDollars.toFixed(2)} CAD</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Alberta GST (5%):</span>
                  <span className="font-mono font-bold text-white">${taxDollars.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between border-t border-white/15 pt-2 text-sm font-extrabold text-white">
                  <span>Grand Total:</span>
                  <span className="font-mono text-brand-orange">${grandTotalDollars.toFixed(2)} CAD</span>
                </div>

                {depositPaidDollars > 0 && (
                  <div className="flex justify-between text-emerald-400 pt-1">
                    <span>Deposit Paid / Credited:</span>
                    <span className="font-mono font-bold">-${depositPaidDollars.toFixed(2)} CAD</span>
                  </div>
                )}

                {amountPaidDollars > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Payments Received:</span>
                    <span className="font-mono font-bold">-${amountPaidDollars.toFixed(2)} CAD</span>
                  </div>
                )}

                <div
                  className={`flex justify-between border-t border-white/20 pt-2 text-base font-extrabold rounded-xl p-2.5 ${
                    balanceDueDollars <= 0
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-brand-orange/20 text-brand-orange'
                  }`}
                >
                  <span>Balance Due:</span>
                  <span className="font-mono">${balanceDueDollars.toFixed(2)} CAD</span>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Interac Destination:</span>
                  <span className="font-mono font-bold text-white">quickmoversolu@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBuilder(false)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleSaveInvoice(false)}
                disabled={isSubmitting}
                className="bg-brand-charcoal text-white hover:bg-slate-700"
              >
                {isSubmitting ? 'Saving...' : 'Save as Issued Invoice'}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => handleSaveInvoice(true)}
                disabled={isSubmitting}
                className="shadow-lg shadow-brand-orange/20"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Processing...' : 'Save & Email to Customer'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice #, customer name, email..."
            className="w-full rounded-2xl border border-white/10 bg-brand-navy/60 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-brand-orange focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'ISSUED', 'PAID', 'PARTIALLY_PAID', 'OVERDUE'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-brand-orange text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All Invoices' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Directory Table */}
      <div className="rounded-3xl border border-white/10 bg-brand-navy/60 overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Service Category</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
                <th className="py-3.5 px-4 text-right">Balance Due</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-200">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Receipt className="mx-auto h-8 w-8 opacity-40 mb-2" />
                    No invoices found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isPaid = inv.status === 'PAID';
                  const isOverdue = inv.status === 'OVERDUE';
                  const isPartiallyPaid = inv.status === 'PARTIALLY_PAID';

                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <Link
                          href={`/admin/invoices/${inv.id}/pdf`}
                          className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
                        >
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{inv.customerName || 'Valued Client'}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {inv.customerEmail || inv.recipientEmail || 'No email'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-300">
                          {inv.serviceCategory}
                        </span>
                        {inv.bookingId && (
                          <span className="block text-[10px] text-slate-400">
                            Booking linked
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {inv.issueDate}
                        <span className="block text-[10px] text-slate-400">
                          Due: {inv.dueDate}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                        ${(inv.totalCents / 100).toFixed(2)} CAD
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        <span
                          className={
                            inv.balanceDueCents <= 0
                              ? 'text-emerald-400'
                              : 'text-brand-orange'
                          }
                        >
                          ${(inv.balanceDueCents / 100).toFixed(2)} CAD
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block rounded-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                            isPaid
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isOverdue
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : isPartiallyPaid
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/invoices/${inv.id}/pdf`}
                            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-brand-orange transition-colors"
                            title="View / Print Official Branded PDF"
                          >
                            <Printer className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleSendEmail(inv.id)}
                            disabled={sendingEmailId === inv.id}
                            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-brand-orange transition-colors"
                            title="Send / Resend Invoice Email"
                          >
                            <Send className="h-4 w-4" />
                          </button>

                          {!isPaid ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(inv.id, 'PAID')}
                              className="rounded-lg px-2 py-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                              title="Mark as Paid"
                            >
                              Mark Paid
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(inv.id, 'ISSUED')}
                              className="rounded-lg px-2 py-1 text-[11px] font-bold bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"
                              title="Re-open Invoice"
                            >
                              Re-open
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminInvoicesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-bold text-slate-400">
          Loading Invoices &amp; Billing Engine...
        </div>
      }
    >
      <InvoicesManagerContent />
    </Suspense>
  );
}

