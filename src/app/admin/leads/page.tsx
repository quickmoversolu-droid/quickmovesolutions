'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  FileText,
  Phone,
  Mail,
  MapPin,
  Camera,
  CheckCircle2,
  Sparkles,
  Eye,
  X,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type {
  PlatformDatabaseState,
  LeadRecord,
  LeadStatus,
  JobRequestRecord,
} from '@/lib/db/platform-store';

const LEAD_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUOTE_PENDING',
  'QUOTE_SENT',
  'FOLLOW_UP_REQUIRED',
  'ACCEPTED',
  'BOOKED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'LOST',
];

export default function AdminLeadsPipelinePage() {
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<any | null>(null);

  const loadData = async () => {
    const res = await fetch('/api/admin/platform');
    const json = await res.json();
    if (json.ok && json.data) {
      setDb(json.data);
      if (!selectedLeadId && json.data.leads.length > 0) {
        setSelectedLeadId(json.data.leads[0].id);
        setNotesDraft(json.data.leads[0].internalNotes || '');
      }
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!db) {
    return (
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-12 text-center text-sm font-bold text-brand-navy">
        Loading CRM Leads Pipeline...
      </div>
    );
  }

  const filteredLeads = db.leads.filter((lead) => {
    if (statusFilter !== 'ALL' && lead.status !== statusFilter) return false;
    if (serviceFilter !== 'ALL' && !lead.serviceType.toLowerCase().includes(serviceFilter.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const cleanQ = q.replace(/[^a-z0-9]/g, '');
      const customer = db.customers.find((c) => c.id === lead.customerId);
      const cleanPhone = (customer?.phone || '').replace(/[^0-9]/g, '');
      const job = db.jobRequests.find((j) => j.id === lead.jobRequestId || j.leadId === lead.id);
      const quote = db.quotes.find((quo) => quo.leadId === lead.id || quo.jobRequestId === lead.jobRequestId);

      const matchesRef = lead.referenceCode.toLowerCase().includes(q);
      const matchesName = Boolean(customer?.fullName.toLowerCase().includes(q));
      const matchesEmail = Boolean(customer?.email.toLowerCase().includes(q));
      const matchesPhone = Boolean(
        (cleanQ.length > 0 && cleanPhone.includes(cleanQ)) ||
        customer?.phone?.toLowerCase().includes(q)
      );
      const matchesCity = Boolean(
        customer?.city.toLowerCase().includes(q) ||
        customer?.address?.toLowerCase().includes(q) ||
        job?.pickupCity?.toLowerCase().includes(q) ||
        job?.pickupAddress?.toLowerCase().includes(q) ||
        job?.destinationCity?.toLowerCase().includes(q)
      );
      const matchesService = lead.serviceType.toLowerCase().includes(q);
      const matchesNotes = Boolean(lead.internalNotes?.toLowerCase().includes(q));
      const matchesQuote = Boolean(quote?.quoteNumber.toLowerCase().includes(q));

      if (
        !matchesRef &&
        !matchesName &&
        !matchesEmail &&
        !matchesPhone &&
        !matchesCity &&
        !matchesService &&
        !matchesNotes &&
        !matchesQuote
      ) {
        return false;
      }
    }
    return true;
  });

  const activeLead: LeadRecord | undefined =
    db.leads.find((l) => l.id === selectedLeadId) || filteredLeads[0];
  const activeCustomer = activeLead
    ? db.customers.find((c) => c.id === activeLead.customerId)
    : undefined;
  const activeJob: JobRequestRecord | undefined = activeLead
    ? db.jobRequests.find((j) => j.id === activeLead.jobRequestId || j.leadId === activeLead.id) || {
        id: activeLead.jobRequestId || `job_${activeLead.id}`,
        leadId: activeLead.id,
        customerId: activeLead.customerId,
        serviceType: activeLead.serviceType,
        serviceCategory: activeLead.serviceType.toLowerCase().includes('junk')
          ? ('JUNK_REMOVAL' as const)
          : activeLead.serviceType.toLowerCase().includes('delivery')
          ? ('DELIVERY' as const)
          : ('MOVING' as const),
        lifecycleStage: 'NEW_LEAD' as const,
        pickupAddress: activeCustomer?.address || 'Calgary, AB',
        pickupCity: activeCustomer?.city || 'Calgary',
        pickupPostalCode: activeCustomer?.postalCode || 'T2P 1J9',
        pickupAccessDetails: 'Standard access',
        preferredDate: new Date().toISOString().slice(0, 10),
        isFlexibleDate: true,
        preferredTimeWindow: 'Flexible',
        inventoryDetails: {},
        junkCategories: [],
        specialRequirements: '',
        aiSummary: activeLead.internalNotes || 'Customer inquiry submitted via website.',
        requiresManualInspection: false,
        createdAt: activeLead.createdAt,
        updatedAt: activeLead.updatedAt,
      }
    : undefined;
  const activePhotos = activeJob
    ? db.jobPhotos.filter((p) => p.jobRequestId === activeJob.id)
    : [];

  const handleUpdateLead = async (newStatus: LeadStatus) => {
    if (!activeLead) return;
    setFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE_LEAD_STATUS',
        leadId: activeLead.id,
        status: newStatus,
        internalNotes: notesDraft,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(`Lead ${activeLead.referenceCode} updated to ${newStatus}.`);
      await loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="orange" className="mb-2">
            Section 8.3 • CRM Lead Pipeline
          </Badge>
          <h1 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Leads &amp; Customer Acquisition Pipeline
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Track every Moving, Photo-First Junk Removal, Delivery, and Contact inquiry across all
            11 operational stages.
          </p>
        </div>
        <Link
          href="/get-a-quote"
          className="rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-extrabold text-white hover:bg-brand-navy/90"
        >
          + Launch Public Quote Wizard
        </Link>
      </div>

      {/* 11-Stage Status Filter Strip */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-brand-navy/10 bg-white p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
            statusFilter === 'ALL'
              ? 'bg-brand-navy text-white'
              : 'bg-brand-light text-brand-navy hover:bg-brand-navy/10'
          }`}
        >
          All Stages ({db.leads.length})
        </button>
        {LEAD_STATUSES.map((st) => {
          const count = db.leads.filter((l) => l.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-brand-orange text-white'
                  : 'bg-brand-light text-brand-navy hover:bg-brand-navy/10'
              }`}
            >
              {st.replace(/_/g, ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Service Filter */}
      <div className="grid gap-4 sm:grid-cols-12">
        <div className="relative sm:col-span-8">
          <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference code (QM-MOV / QM-JNK), customer name, or city..."
            className="w-full rounded-xl border border-brand-navy/15 bg-white pl-10 pr-4 py-2.5 text-sm text-brand-navy"
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-4">
          <Filter className="h-4 w-4 text-brand-orange shrink-0" />
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full rounded-xl border border-brand-navy/15 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-navy"
          >
            <option value="ALL">All Service Lines</option>
            <option value="moving">Moving Services</option>
            <option value="junk-removal">Full Junk Removal</option>
            <option value="delivery">Delivery Services</option>
          </select>
        </div>
      </div>

      {/* Master-Detail Split */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Leads List */}
        <div className="space-y-3 lg:col-span-5">
          {filteredLeads.map((lead) => {
            const cust = db.customers.find((c) => c.id === lead.customerId);
            const job = db.jobRequests.find((j) => j.id === lead.jobRequestId);
            const selected = activeLead?.id === lead.id;

            return (
              <button
                key={lead.id}
                type="button"
                onClick={() => {
                  setSelectedLeadId(lead.id);
                  setNotesDraft(lead.internalNotes || '');
                  setFeedback(null);
                }}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                  selected
                    ? 'border-brand-orange bg-white shadow-md'
                    : 'border-brand-navy/10 bg-white/80 hover:border-brand-navy/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-extrabold text-brand-navy">
                    {lead.referenceCode}
                  </span>
                  <span className="rounded-full bg-brand-orange/15 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-orange">
                    {lead.status}
                  </span>
                </div>
                <p className="mt-1.5 font-heading text-sm font-extrabold text-brand-navy">
                  {cust?.fullName || 'Unknown Customer'}
                </p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  {lead.serviceType} • {job?.pickupCity || cust?.city || 'Calgary'} • Preferred:{' '}
                  <strong>{job?.preferredDate || 'Flexible'}</strong>
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Lead Inspector */}
        <div className="lg:col-span-7">
          {activeLead && activeCustomer && activeJob ? (
            <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-navy/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-brand-orange">
                      {activeLead.referenceCode}
                    </span>
                    <Badge variant="navy">{activeLead.status}</Badge>
                  </div>
                  <h2 className="mt-1 font-heading text-xl font-extrabold text-brand-navy">
                    {activeCustomer.fullName}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-brand-muted">
                    <a
                      href={`tel:${activeCustomer.phone}`}
                      className="inline-flex items-center gap-1 font-bold text-brand-navy hover:text-brand-orange"
                    >
                      <Phone className="h-3.5 w-3.5 text-brand-orange" />
                      {activeCustomer.phone}
                    </a>
                    <a
                      href={`mailto:${activeCustomer.email}`}
                      className="inline-flex items-center gap-1 font-bold text-brand-navy hover:text-brand-orange"
                    >
                      <Mail className="h-3.5 w-3.5 text-brand-orange" />
                      {activeCustomer.email}
                    </a>
                  </div>
                </div>

                <Link
                  href={`/admin/quotes?jobRequestId=${activeJob ? activeJob.id : (activeLead?.jobRequestId || activeLead?.id || '')}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-brand-orange/90"
                >
                  <FileText className="h-4 w-4" />
                  Build Itemized Quote
                </Link>
              </div>

              {feedback && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{feedback}</span>
                </div>
              )}

              {/* AI Administrative Assessment Summary */}
              <div className="rounded-2xl border border-brand-orange/25 bg-brand-orange/5 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
                  <Sparkles className="h-4 w-4" />
                  <span>Administrative Scope &amp; AI Assessment</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-brand-navy">
                  {activeJob.aiSummary}
                </p>
                {activeJob.aiVolumeSuggestion && (
                  <p className="mt-1 text-[11px] font-bold text-brand-navy">
                    Preliminary Junk Volume Category: {activeJob.aiVolumeSuggestion} (Subject to
                    coordinator verification)
                  </p>
                )}
              </div>

              {/* Locations & Access */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl bg-brand-light p-4">
                  <p className="font-bold uppercase tracking-wider text-brand-muted">
                    <MapPin className="inline h-3.5 w-3.5 mr-1 text-brand-orange" />
                    Pickup Location
                  </p>
                  <p className="mt-1 font-bold text-brand-navy">
                    {activeJob.pickupAddress}, {activeJob.pickupCity} {activeJob.pickupPostalCode}
                  </p>
                  <p className="mt-1 text-brand-muted">
                    Access: {activeJob.pickupAccessDetails || 'Standard'}
                  </p>
                </div>

                <div className="rounded-2xl bg-brand-light p-4">
                  <p className="font-bold uppercase tracking-wider text-brand-muted">
                    Destination &amp; Target Date
                  </p>
                  <p className="mt-1 font-bold text-brand-navy">
                    {activeJob.destinationAddress
                      ? `${activeJob.destinationAddress}, ${activeJob.destinationCity}`
                      : 'Single-Location Service (Junk Removal)'}
                  </p>
                  <p className="mt-1 text-brand-muted">
                    Customer Target Date: <strong>{activeJob.preferredDate}</strong> (
                    {activeJob.preferredTimeWindow})
                  </p>
                </div>
              </div>

              {/* Uploaded Photos Preview */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-navy flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-brand-orange" />
                  Customer-Uploaded Job Photos ({activePhotos.length})
                </p>
                {activePhotos.length > 0 ? (
                  <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {activePhotos.map((pho) => {
                      const photoUrl = pho.storageKey
                        ? `/api/photos/${encodeURIComponent(pho.storageKey)}`
                        : (pho.previewDataUrl || `/api/photos/${pho.id}`);

                      return (
                        <div
                          key={pho.id}
                          onClick={() => setPreviewPhoto(pho)}
                          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-brand-navy/15 bg-white p-2 shadow-sm transition-all hover:border-brand-orange hover:shadow-md"
                        >
                          <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photoUrl}
                              alt={pho.originalFilename}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                                const parent = (e.currentTarget as HTMLElement).parentElement;
                                if (parent) {
                                  const fallback = parent.querySelector('.photo-fallback');
                                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                            <div className="photo-fallback absolute inset-0 hidden flex-col items-center justify-center bg-slate-100 p-2 text-center text-xs text-brand-muted">
                              <Camera className="h-6 w-6 text-brand-muted mb-1" />
                              <span className="font-bold truncate max-w-full">{pho.originalFilename}</span>
                            </div>

                            {/* Hover Overlay with Eye Icon */}
                            <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
                                <Eye className="h-3.5 w-3.5" />
                                <span>Inspect Photo</span>
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-1">
                            <p className="truncate text-[11px] font-bold text-brand-navy" title={pho.originalFilename}>
                              {pho.originalFilename}
                            </p>
                            <span className="shrink-0 text-[10px] font-semibold text-brand-orange">
                              Click to view
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-brand-muted">
                    No photos attached to this request.
                  </p>
                )}
              </div>

              {/* Coordinator Notes & Stage Transition Controls */}
              <div className="space-y-3 border-t border-brand-navy/10 pt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                  Internal CRM Notes (Hidden from Customer Portal)
                </label>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full rounded-xl border border-brand-navy/15 p-3 text-xs text-brand-navy"
                />

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-muted">
                    Transition Lead Pipeline Status:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {LEAD_STATUSES.map((st) => (
                      <Button
                        key={st}
                        type="button"
                        size="sm"
                        variant={activeLead.status === st ? 'primary' : 'outline'}
                        onClick={() => handleUpdateLead(st)}
                      >
                        {st.replace(/_/g, ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-brand-navy/10 bg-white p-10 text-center text-sm text-brand-muted">
              Select a lead from the pipeline list to inspect full details.
            </div>
          )}
        </div>
      </div>
      {/* Full-Resolution Photo Viewer Lightbox Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-h-[95vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#070D18] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/20 text-brand-orange">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    {previewPhoto.originalFilename}
                  </h3>
                  <p className="text-xs text-white/60">
                    Uploaded Customer Photo • {previewPhoto.fileSizeBytes ? `${Math.round(previewPhoto.fileSizeBytes / 1024)} KB` : 'High Resolution'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="mt-4 flex max-h-[65vh] items-center justify-center overflow-auto rounded-2xl bg-black/50 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewPhoto.storageKey ? `/api/photos/${encodeURIComponent(previewPhoto.storageKey)}` : (previewPhoto.previewDataUrl || `/api/photos/${previewPhoto.id}`)}
                alt={previewPhoto.originalFilename}
                className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="text-xs text-white/70">
                {previewPhoto.caption ? (
                  <span><strong>Caption:</strong> {previewPhoto.caption}</span>
                ) : (
                  <span>Inspect customer items, stairs, and parking access before preparing quote.</span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <a
                  href={previewPhoto.storageKey ? `/api/photos/${encodeURIComponent(previewPhoto.storageKey)}` : (previewPhoto.previewDataUrl || `/api/photos/${previewPhoto.id}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white/20 hover:border-brand-orange"
                >
                  <ExternalLink className="h-4 w-4 text-brand-orange" />
                  <span>Open in New Tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="rounded-xl bg-brand-orange px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:brightness-110"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

