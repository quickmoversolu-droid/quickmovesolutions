'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Truck,
  CheckCircle2,
  XCircle,
  Calendar,
  FileText,
  MapPin,
  Phone,
  LogOut,
  ShieldCheck,
  Camera,
  Printer,
  PenTool,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Send,
  Boxes,
  CheckSquare,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhotoUploadManager, WizardPhotoItem } from '@/components/quote-wizards/PhotoUploadManager';
import { BUSINESS_INFO } from '@/lib/constants/business';
import type { QuoteRecord } from '@/lib/db/platform-store';

interface PortalPayload {
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    preferredContact: string;
    address: string;
    city: string;
    postalCode: string;
  };
  leads: {
    id: string;
    referenceCode: string;
    serviceType: string;
    status: string;
    createdAt: string;
  }[];
  jobs: {
    id: string;
    leadId: string;
    serviceType: string;
    serviceCategory: string;
    lifecycleStage: string;
    pickupAddress: string;
    pickupCity: string;
    destinationAddress?: string;
    destinationCity?: string;
    preferredDate: string;
    preferredTimeWindow: string;
    confirmedDate?: string;
    specialRequirements: string;
    createdAt: string;
  }[];
  quotes: (QuoteRecord & {
    signatureName?: string;
    signedAt?: string;
  })[];
  bookings: {
    id: string;
    bookingNumber: string;
    serviceType: string;
    status: string;
    scheduledDate: string;
    arrivalWindow: string;
    pickupAddress: string;
    pickupCity: string;
    destinationCity?: string;
  }[];
  photos: {
    id: string;
    jobRequestId: string;
    originalFilename: string;
    caption: string;
    previewDataUrl?: string;
    createdAt: string;
  }[];
}

function CustomerPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCustomerId = searchParams.get('customerId') || searchParams.get('cid') || '';
  const queryQuoteId = searchParams.get('quoteId') || '';

  const [data, setData] = useState<PortalPayload | null>(null);
  const [newPhotos, setNewPhotos] = useState<WizardPhotoItem[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [previewCustomerId, setPreviewCustomerId] = useState<string>(queryCustomerId || 'cust_seed_1');

  // E-Signature Modal State
  const [signingQuote, setSigningQuote] = useState<QuoteRecord | null>(null);
  const [legalSignatureName, setLegalSignatureName] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [agreedToAccess, setAgreedToAccess] = useState<boolean>(false);
  const [isSubmittingSignature, setIsSubmittingSignature] = useState<boolean>(false);

  // Change Request Modal State
  const [isChangeRequestOpen, setIsChangeRequestOpen] = useState<boolean>(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [changeRequestType, setChangeRequestType] = useState<string>('DATE_OR_TIME');
  const [requestedNewDate, setRequestedNewDate] = useState<string>('');
  const [requestedNewWindow, setRequestedNewWindow] = useState<string>('Morning (08:00 AM - 11:00 AM)');
  const [changeDetails, setChangeDetails] = useState<string>('');
  const [isSubmittingChange, setIsSubmittingChange] = useState<boolean>(false);

  const loadPortal = async (cid?: string, targetQuoteId?: string) => {
    const activeCid = cid || queryCustomerId || previewCustomerId;
    const activeQid = targetQuoteId || queryQuoteId;
    const queryParts: string[] = [];
    if (activeCid) queryParts.push(`customerId=${encodeURIComponent(activeCid)}`);
    if (activeQid) queryParts.push(`quoteId=${encodeURIComponent(activeQid)}`);
    const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

    const res = await fetch(`/api/portal${query}`);
    const json = await res.json();
    if (json.ok) {
      setData(json);
      if (json.customer?.id) {
        setPreviewCustomerId(json.customer.id);
      }
      if (json.customer?.fullName) {
        setLegalSignatureName(json.customer.fullName);
      }
      if (json.bookings?.length > 0) {
        setSelectedBookingId(json.bookings[0].id);
      }
      // If a specific quote was requested in URL and is awaiting signature, auto-open signature modal
      if (activeQid && Array.isArray(json.quotes)) {
        const targetQ = json.quotes.find(
          (q: QuoteRecord) => q.id === activeQid || q.quoteNumber === activeQid
        );
        if (targetQ && (targetQ.status === 'SENT' || targetQ.status === 'DRAFT' || targetQ.status === 'REVISED')) {
          setSigningQuote(targetQ);
        }
      }
    } else {
      setFeedback(json.error || 'Customer profile not found.');
    }
  };

  useEffect(() => {
    loadPortal(queryCustomerId || previewCustomerId, queryQuoteId);
  }, [queryCustomerId, queryQuoteId]);

  // Handle Online Digital Signature / Quote Acceptance
  const handleSignAndAcceptQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !signingQuote) return;

    if (!legalSignatureName.trim()) {
      setFeedback('Please enter your full legal name to sign.');
      return;
    }
    if (!agreedToTerms || !agreedToAccess) {
      setFeedback('Please review and check the acknowledgment boxes to proceed.');
      return;
    }

    setIsSubmittingSignature(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESPOND_TO_QUOTE',
          customerId: data.customer.id,
          quoteId: signingQuote.id,
          decision: 'ACCEPT',
          signatureName: legalSignatureName.trim(),
          customerNote: `Digitally signed by ${legalSignatureName.trim()} via QuickMove Customer Portal.`,
        }),
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        setFeedback(
          `🎉 Congratulations! Quotation ${json.quote.quoteNumber} has been officially ACCEPTED & SIGNED. Your Calgary moving booking is confirmed!`
        );
        setSigningQuote(null);
        await loadPortal(data.customer.id);
      } else {
        setFeedback(json.error || 'Failed to process signature. Please try again.');
      }
    } catch {
      setFeedback('Network error while processing signature.');
    } finally {
      setIsSubmittingSignature(false);
    }
  };

  // Handle Quote Decline
  const handleDeclineQuote = async (quoteId: string) => {
    if (!data) return;
    if (!confirm('Are you sure you want to decline this quotation?')) return;
    setFeedback(null);
    try {
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESPOND_TO_QUOTE',
          customerId: data.customer.id,
          quoteId,
          decision: 'DECLINE',
        }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setFeedback(`Quotation ${json.quote.quoteNumber} marked as declined.`);
        await loadPortal(data.customer.id);
      }
    } catch {
      setFeedback('Error updating quotation status.');
    }
  };

  // Handle Schedule / Move Change Request
  const handleSubmitChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !changeDetails.trim()) {
      setFeedback('Please provide details for your change request.');
      return;
    }

    setIsSubmittingChange(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT_CHANGE_REQUEST',
          customerId: data.customer.id,
          bookingId: selectedBookingId,
          requestType: changeRequestType,
          newDate: requestedNewDate,
          newWindow: requestedNewWindow,
          details: changeDetails,
        }),
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        setFeedback(
          '✓ Your move change request has been submitted to the QuickMove Solutions Calgary dispatch team. We will review and confirm within 2 business hours.'
        );
        setIsChangeRequestOpen(false);
        setChangeDetails('');
      } else {
        setFeedback(json.error || 'Failed to submit change request.');
      }
    } catch {
      setFeedback('Network error submitting request.');
    } finally {
      setIsSubmittingChange(false);
    }
  };

  // Upload Additional Job Photos
  const handleUploadMorePhotos = async () => {
    if (!data || data.jobs.length === 0 || newPhotos.length === 0) return;
    setFeedback(null);
    const res = await fetch('/api/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPLOAD_ADDITIONAL_PHOTOS',
        customerId: data.customer.id,
        jobRequestId: data.jobs[0].id,
        photos: newPhotos,
      }),
    });
    const json = await res.json();
    if (res.ok && json.ok) {
      setNewPhotos([]);
      setFeedback(`✓ Uploaded ${json.added} additional photo(s) to your job file.`);
      await loadPortal(data.customer.id);
    }
  };

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/portal/login');
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#05080D] flex items-center justify-center p-8 text-sm font-bold text-white">
        <div className="flex items-center gap-3">
          <Truck className="h-6 w-6 animate-pulse text-brand-orange" />
          <span>Loading QuickMove Solutions Customer Portal...</span>
        </div>
      </div>
    );
  }

  const latestJob = data.jobs[0];
  const activeBooking = data.bookings[0];
  const isMoveConfirmed = activeBooking && activeBooking.status === 'CONFIRMED';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A1324]">
      {/* =====================================================================
          1. PORTAL TOP BAR
         ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05080D] text-white backdrop-blur-md">
        <div className="container mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange to-[#ff8c4a] text-white shadow-orange-glow">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-base font-extrabold text-white">
                {BUSINESS_INFO.name}
              </p>
              <p className="text-[11px] text-white/60">
                Customer Portal • Calgary &amp; Surrounding Areas
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Account Switcher for Demo / QA */}
            <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/[0.05] px-2.5 py-1 text-xs">
              <span className="text-[11px] text-white/50 hidden sm:inline">Profile:</span>
              <select
                value={previewCustomerId}
                onChange={(e) => {
                  setPreviewCustomerId(e.target.value);
                  loadPortal(e.target.value);
                }}
                aria-label="Preview Customer Profile"
                className="bg-transparent text-xs font-bold text-white focus:outline-none"
              >
                <option value="cust_seed_1" className="text-black">
                  Michael Henderson (Residential Move)
                </option>
                <option value="cust_seed_2" className="text-black">
                  Priya Patel (Junk Removal)
                </option>
                {data?.customer && data.customer.id !== 'cust_seed_1' && data.customer.id !== 'cust_seed_2' && (
                  <option value={data.customer.id} className="text-black">
                    {data.customer.fullName} (Active Account)
                  </option>
                )}
              </select>
            </div>

            <a
              href={BUSINESS_INFO.phoneHref}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-orange px-3 py-1.5 text-xs font-bold text-white shadow-orange-glow transition hover:brightness-110"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dispatch: </span>
              {BUSINESS_INFO.phoneDisplay}
            </a>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
        {/* Security / Isolation Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/80 p-4 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Authenticated Client Session:</strong> Welcome back,{' '}
              <strong>{data.customer.fullName}</strong> ({data.customer.email}). You are securely viewing your private quotes, bookings, and moving timeline.
            </span>
          </div>
          <Link
            href="/"
            className="font-bold text-brand-orange hover:underline shrink-0 text-xs inline-flex items-center gap-1"
          >
            <span>Return to Website</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Global Feedback Alert */}
        {feedback && (
          <div className="flex items-center gap-3 rounded-2xl border border-brand-orange/30 bg-orange-50 p-4 text-xs font-bold text-brand-navy shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0" />
            <span className="flex-1">{feedback}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-brand-navy/50 hover:text-brand-navy text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* =====================================================================
            2. MOVING DAY LIVE STATUS & PROGRESS TRACKER
           ===================================================================== */}
        {latestJob && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-[#05080D] via-[#0A1324] to-[#101D35] p-6 text-white sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="orange">Active Calgary Relocation</Badge>
                    <span className="text-xs text-white/60">
                      Ref #{data.leads[0]?.referenceCode || latestJob.id}
                    </span>
                  </div>
                  <h1 className="mt-2 font-heading text-xl font-extrabold text-white sm:text-2xl">
                    {latestJob.serviceType.replace(/_/g, ' ')}
                  </h1>
                  <p className="mt-1 text-xs text-white/70">
                    <MapPin className="inline h-3.5 w-3.5 mr-1 text-brand-orange" />
                    Pickup: <strong>{latestJob.pickupAddress}, {latestJob.pickupCity}</strong>
                    {latestJob.destinationCity ? (
                      <span> → Destination: <strong>{latestJob.destinationAddress || 'Calgary Area'}, {latestJob.destinationCity}</strong></span>
                    ) : ''}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangeRequestOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
                  >
                    <PenTool className="h-3.5 w-3.5 text-brand-orange" />
                    <span>Request Move Change</span>
                  </button>
                </div>
              </div>

              {/* 5-Step Visual Timeline */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
                  Moving Day Progress Timeline
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                  {/* Step 1 */}
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>1. Quote Prepared</span>
                    </div>
                    <p className="text-[11px] text-white/70">Custom estimate generated for your items.</p>
                  </div>

                  {/* Step 2 */}
                  <div className={`rounded-xl border p-3 ${
                    data.quotes.some((q) => q.status === 'ACCEPTED')
                      ? 'border-emerald-500/40 bg-emerald-950/30'
                      : 'border-brand-orange/50 bg-brand-orange/10'
                  }`}>
                    <div className={`flex items-center gap-1.5 font-bold text-xs mb-1 ${
                      data.quotes.some((q) => q.status === 'ACCEPTED') ? 'text-emerald-400' : 'text-brand-orange'
                    }`}>
                      {data.quotes.some((q) => q.status === 'ACCEPTED') ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4 animate-spin" />
                      )}
                      <span>2. Digital Sign-Off</span>
                    </div>
                    <p className="text-[11px] text-white/70">
                      {data.quotes.some((q) => q.status === 'ACCEPTED') ? 'Signed & agreed online.' : 'Action required: sign below.'}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className={`rounded-xl border p-3 ${
                    isMoveConfirmed ? 'border-emerald-500/40 bg-emerald-950/30' : 'border-white/10 bg-white/[0.02]'
                  }`}>
                    <div className={`flex items-center gap-1.5 font-bold text-xs mb-1 ${
                      isMoveConfirmed ? 'text-emerald-400' : 'text-white/40'
                    }`}>
                      <Calendar className="h-4 w-4" />
                      <span>3. Booking Locked</span>
                    </div>
                    <p className="text-[11px] text-white/70">
                      {isMoveConfirmed ? `Scheduled: ${activeBooking?.scheduledDate}` : 'Pending quote sign-off'}
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex items-center gap-1.5 text-white/40 font-bold text-xs mb-1">
                      <Truck className="h-4 w-4" />
                      <span>4. Crew &amp; Truck</span>
                    </div>
                    <p className="text-[11px] text-white/70">Equipped truck &amp; blankets assigned.</p>
                  </div>

                  {/* Step 5 */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex items-center gap-1.5 text-white/40 font-bold text-xs mb-1">
                      <CheckSquare className="h-4 w-4" />
                      <span>5. Job Completion</span>
                    </div>
                    <p className="text-[11px] text-white/70">Room placement &amp; satisfaction sign-off.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Dashboard Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* ===================================================================
              LEFT COLUMN: WRITTEN QUOTATIONS & BOOKINGS (8 Cols)
             =================================================================== */}
          <div className="space-y-6 lg:col-span-8">
            {/* Written Quotations */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-brand-orange" />
                  <h2 className="font-heading text-lg font-extrabold text-[#0A1324]">
                    Written Quotations ({data.quotes.length})
                  </h2>
                </div>
                <span className="text-xs text-slate-500">
                  Itemized pricing with transparent Alberta GST
                </span>
              </div>

              {data.quotes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                  No quotation prepared yet. Our coordinator is preparing your estimate.
                </div>
              ) : (
                data.quotes.map((quo) => {
                  const isAccepted = quo.status === 'ACCEPTED';
                  const isDeclined = quo.status === 'DECLINED';

                  return (
                    <div
                      key={quo.id}
                      className={`overflow-hidden rounded-2xl border-2 transition ${
                        isAccepted
                          ? 'border-emerald-500/30 bg-emerald-50/20'
                          : 'border-slate-200 bg-slate-50/60 hover:border-brand-orange/40'
                      }`}
                    >
                      {/* Quote Header */}
                      <div className="p-5 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-mono text-xs font-extrabold text-brand-orange">
                              {quo.quoteNumber} (v{quo.version})
                            </span>
                            <h3 className="font-heading text-base font-extrabold text-[#0A1324]">
                              {quo.serviceType.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Proposed Move Date: <strong>{quo.proposedDate}</strong> • Window: <strong>{quo.proposedWindow}</strong>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                isAccepted ? 'success' : isDeclined ? 'outline' : 'orange'
                              }
                            >
                              {quo.status}
                            </Badge>

                            <Link
                              href={`/admin/quotes/${quo.id}/pdf`}
                              target="_blank"
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-100"
                              title="Print or view PDF quotation"
                            >
                              <Printer className="h-3.5 w-3.5 text-slate-500" />
                              <span>View PDF</span>
                            </Link>
                          </div>
                        </div>

                        {/* Scope Summary */}
                        <div className="rounded-xl bg-white p-3.5 text-xs text-slate-700 border border-slate-200/80 leading-relaxed">
                          <strong className="text-slate-900 block mb-1">Scope of Work:</strong>
                          {quo.scopeSummary || 'Complete moving services including equipped truck, protective blankets, and experienced crew.'}
                        </div>

                        {/* Itemized Line Items */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 text-xs">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Itemized Estimate Breakdown
                          </p>
                          {quo.lineItems.map((li) => (
                            <div key={li.id} className="flex justify-between py-1 border-b border-slate-100 last:border-none">
                              <span className="text-slate-700">
                                {li.description} {li.quantity > 1 && <span className="text-slate-400">(x{li.quantity})</span>}
                              </span>
                              <span className="font-bold text-slate-900">
                                ${(li.totalCents / 100).toFixed(2)}
                              </span>
                            </div>
                          ))}

                          <div className="pt-2 flex justify-between text-slate-500 border-t border-slate-200">
                            <span>Subtotal:</span>
                            <span>${(quo.subtotalCents / 100).toFixed(2)}</span>
                          </div>
                          {quo.discountCents > 0 && (
                            <div className="flex justify-between text-emerald-600 font-semibold">
                              <span>Special Discount:</span>
                              <span>-${(quo.discountCents / 100).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-500">
                            <span>Alberta GST ({quo.taxRatePercent}%):</span>
                            <span>${(quo.taxCents / 100).toFixed(2)}</span>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                            <span>Total Estimated Investment:</span>
                            <span className="text-brand-orange text-base font-black">
                              ${(quo.totalCents / 100).toFixed(2)} CAD
                            </span>
                          </div>
                        </div>

                        {/* Signature Status or Action Buttons */}
                        {isAccepted ? (
                          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span>
                                <strong>Accepted &amp; Digitally Signed</strong> by{' '}
                                <em>{quo.signatureName || quo.customerResponse}</em>
                                {quo.signedAt && ` on ${new Date(quo.signedAt).toLocaleDateString()}`}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              ✓ Legally Binding
                            </span>
                          </div>
                        ) : isDeclined ? (
                          <div className="rounded-xl bg-slate-100 p-3 text-xs text-slate-500">
                            This quote was declined. If you would like a revised estimate, please contact our dispatch coordinator.
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <span className="text-[11px] text-slate-500">
                              Estimate Valid Until: <strong>{quo.validUntil}</strong>
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeclineQuote(quo.id)}
                                className="text-slate-600 hover:text-red-600"
                              >
                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                Decline
                              </Button>
                              <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={() => setSigningQuote(quo)}
                                className="bg-brand-orange hover:bg-brand-orange-hover shadow-orange-glow text-white font-bold"
                              >
                                <PenTool className="mr-1.5 h-3.5 w-3.5" />
                                Review &amp; Sign Digitally Online
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Confirmed & Scheduled Bookings */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-5 w-5 text-brand-orange" />
                  <h2 className="font-heading text-lg font-extrabold text-[#0A1324]">
                    Scheduled Bookings &amp; Arrival Windows ({data.bookings.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangeRequestOpen(true)}
                  className="text-xs font-bold text-brand-orange hover:underline inline-flex items-center gap-1"
                >
                  <PenTool className="h-3 w-3" />
                  Request Date Change
                </button>
              </div>

              {data.bookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                  No active bookings scheduled yet. Accept a quotation above to lock in your moving date.
                </div>
              ) : (
                data.bookings.map((bkg) => (
                  <div
                    key={bkg.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-brand-orange">
                        {bkg.bookingNumber} • {bkg.scheduledDate}
                      </span>
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                        {bkg.status}
                      </span>
                    </div>

                    <p className="font-heading text-sm font-bold text-slate-900">
                      Guaranteed Arrival Window: {bkg.arrivalWindow}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Location:</span>
                        <span>{bkg.pickupAddress}, {bkg.pickupCity}</span>
                      </div>
                      {bkg.destinationCity && (
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination:</span>
                          <span>{bkg.destinationCity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ===================================================================
              RIGHT COLUMN: MOVE CHECKLIST, PHOTOS & DIRECT DISPATCH (4 Cols)
             =================================================================== */}
          <div className="space-y-6 lg:col-span-4">
            {/* Direct Calgary Dispatch Card */}
            <div className="rounded-3xl bg-[#05080D] p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-brand-orange" />
                <h3 className="font-heading text-base font-extrabold text-white">
                  Calgary Dispatch Coordinator
                </h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Have questions about your upcoming move or need to adjust arrival timing? Call our direct Calgary line anytime:
              </p>

              <a
                href={BUSINESS_INFO.phoneHref}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-orange to-[#ff8c4a] p-3 text-sm font-extrabold text-white shadow-orange-glow transition hover:brightness-110"
              >
                <Phone className="h-4 w-4" />
                <span>Call {BUSINESS_INFO.phoneDisplay}</span>
              </a>

              <div className="border-t border-white/10 pt-3 text-[11px] text-white/60 space-y-1">
                <p>📍 Operations Hub: Calgary, AB</p>
                <p>📧 Email: {BUSINESS_INFO.email}</p>
                <p>🕒 Mon - Sun: 7:00 AM - 9:00 PM</p>
              </div>
            </div>

            {/* Upload Additional Job Photos */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Camera className="h-5 w-5 text-brand-orange" />
                <h3 className="font-heading text-base font-extrabold">
                  Upload Additional Item Photos
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Found more boxes, tight staircases, or specialty furniture (pianos, safes)? Upload photos directly to your job file:
              </p>

              <PhotoUploadManager
                photos={newPhotos}
                onChange={setNewPhotos}
                maxPhotos={6}
                title="Add Photos to Active Job"
              />

              {newPhotos.length > 0 && (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleUploadMorePhotos}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold"
                >
                  <Send className="mr-1.5 h-4 w-4" />
                  Submit {newPhotos.length} Photo(s) to Dispatch
                </Button>
              )}
            </div>

            {/* Calgary Moving Preparation Tips */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <Boxes className="h-5 w-5 text-brand-orange" />
                <h3 className="font-heading text-sm font-extrabold">
                  Moving Day Preparation Tips
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange font-bold">1.</span>
                  <span><strong>Condo Elevator Booking:</strong> Ensure service elevator is reserved for your arrival window.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange font-bold">2.</span>
                  <span><strong>Truck Parking:</strong> Save two vehicle spots in front of your home or alley for our moving truck.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange font-bold">3.</span>
                  <span><strong>Essentials Box:</strong> Keep keys, medications, phone chargers, and paperwork in a separate personal bag.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-orange font-bold">4.</span>
                  <span><strong>Payment on Completion:</strong> Interac e-Transfer or debit card accepted upon job completion.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* =====================================================================
          MODAL 1: DIGITAL E-SIGNATURE MODAL
         ===================================================================== */}
      {signingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-[#0B1426] p-6 shadow-2xl sm:p-8 space-y-5 my-8 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-brand-orange p-2 text-white">
                  <PenTool className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-extrabold text-white">
                    Digital Signature &amp; Quote Acceptance
                  </h2>
                  <p className="text-xs text-white/60">
                    Quotation #{signingQuote.quoteNumber} • Total: ${(signingQuote.totalCents / 100).toFixed(2)} CAD
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSigningQuote(null)}
                className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSignAndAcceptQuote} className="space-y-4 text-xs">
              {/* Summary Pill */}
              <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/10 p-3.5 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Proposed Move Date:</span>
                  <span className="text-brand-orange">{signingQuote.proposedDate} ({signingQuote.proposedWindow})</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>Service Type:</span>
                  <span>{signingQuote.serviceType.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between font-bold text-white border-t border-brand-orange/20 pt-1 mt-1">
                  <span>Total Amount (Alberta 5% GST Included):</span>
                  <span className="text-base text-brand-orange">${(signingQuote.totalCents / 100).toFixed(2)} CAD</span>
                </div>
              </div>

              {/* Full Legal Name for E-Signature */}
              <div className="space-y-1.5">
                <label className="block font-bold text-white/90">
                  Full Legal Name (Electronic Signature) *
                </label>
                <input
                  type="text"
                  required
                  value={legalSignatureName}
                  onChange={(e) => setLegalSignatureName(e.target.value)}
                  placeholder="e.g. Michael Henderson"
                  className="w-full rounded-xl border border-white/20 bg-[#05080D] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-brand-orange focus:outline-none"
                />
              </div>

              {/* Live Script Signature Preview */}
              {legalSignatureName.trim() && (
                <div className="rounded-xl border border-white/15 bg-white/[0.03] p-4 text-center">
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1">
                    Signature Preview
                  </p>
                  <p className="font-serif italic text-2xl text-brand-orange tracking-wide">
                    {legalSignatureName}
                  </p>
                  <p className="text-[10px] text-white/50 mt-1">
                    Digitally generated timestamp: {new Date().toLocaleString()}
                  </p>
                </div>
              )}

              {/* Legal Terms Acknowledgments */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#05080D] text-brand-orange focus:ring-brand-orange"
                  />
                  <span className="text-white/80 leading-snug">
                    I agree to the itemized scope of work, rate terms, and Alberta cargo liability standards specified in Quotation #{signingQuote.quoteNumber}.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToAccess}
                    onChange={(e) => setAgreedToAccess(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-[#05080D] text-brand-orange focus:ring-brand-orange"
                  />
                  <span className="text-white/80 leading-snug">
                    I confirm that property access, hallways, and driveway clearances have been accurately represented and payment will be finalized upon job completion.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSigningQuote(null)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmittingSignature || !legalSignatureName.trim() || !agreedToTerms || !agreedToAccess}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-orange-glow disabled:opacity-50"
                >
                  {isSubmittingSignature ? 'Securing Signature...' : 'Confirm & Legally Sign'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: MOVE / SCHEDULE CHANGE REQUEST MODAL
         ===================================================================== */}
      {isChangeRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-[#0B1426] p-6 shadow-2xl sm:p-8 space-y-5 my-8 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-brand-orange p-2 text-white">
                  <PenTool className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-extrabold text-white">
                    Request Move / Schedule Change
                  </h2>
                  <p className="text-xs text-white/60">
                    Direct notification to QuickMove Solutions Dispatch Coordinator
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangeRequestOpen(false)}
                className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitChangeRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-white/80 mb-1.5">Change Category *</label>
                <select
                  value={changeRequestType}
                  onChange={(e) => setChangeRequestType(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#05080D] px-3 py-2.5 text-xs text-white focus:border-brand-orange focus:outline-none"
                >
                  <option value="DATE_OR_TIME">Change Moving Date or Arrival Window</option>
                  <option value="ADDRESS_CHANGE">Update Pickup or Destination Address</option>
                  <option value="EXTRA_ITEMS">Add Heavy / Specialty Items (Piano, Safe, Extra Furniture)</option>
                  <option value="ACCESS_NOTES">Update Elevator / Parking / Gate Access Details</option>
                  <option value="GENERAL_QUESTION">General Move Inquiries</option>
                </select>
              </div>

              {changeRequestType === 'DATE_OR_TIME' && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-white/80 mb-1.5">Requested New Date</label>
                    <input
                      type="date"
                      value={requestedNewDate}
                      onChange={(e) => setRequestedNewDate(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#05080D] px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-white/80 mb-1.5">Preferred Window</label>
                    <select
                      value={requestedNewWindow}
                      onChange={(e) => setRequestedNewWindow(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#05080D] px-3 py-2 text-xs text-white focus:border-brand-orange focus:outline-none"
                    >
                      <option value="Morning (08:00 AM - 11:00 AM)">Morning (08:00 AM - 11:00 AM)</option>
                      <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                      <option value="Flexible All Day">Flexible All Day</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-white/80 mb-1.5">Details of Your Request *</label>
                <textarea
                  required
                  rows={4}
                  value={changeDetails}
                  onChange={(e) => setChangeDetails(e.target.value)}
                  placeholder="Please describe what you need updated (e.g., We got key release delayed by 2 hours, or We added a 3-piece sectional couch to the pickup)."
                  className="w-full rounded-xl border border-white/15 bg-[#05080D] px-3 py-2 text-xs text-white placeholder-white/30 focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChangeRequestOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmittingChange || !changeDetails.trim()}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold shadow-orange-glow disabled:opacity-50"
                >
                  {isSubmittingChange ? 'Sending Request...' : 'Send to Dispatch Coordinator'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerPortalDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A1220] flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-3">
            <Truck className="h-8 w-8 animate-bounce text-[#F47732]" />
            <p className="text-sm font-semibold tracking-wide text-slate-300">
              Loading QuickMove Customer Portal...
            </p>
          </div>
        </div>
      }
    >
      <CustomerPortalContent />
    </Suspense>
  );
}
