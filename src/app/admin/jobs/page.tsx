'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Truck,
  Users,
  CheckCircle2,
  ClipboardList,
  MapPin,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type {
  PlatformDatabaseState,
  JobLifecycleStage,
} from '@/lib/db/platform-store';

const JOB_STAGES: JobLifecycleStage[] = [
  'NEW_LEAD',
  'CONTACTED',
  'QUOTE_PREPARATION',
  'QUOTE_SENT',
  'CUSTOMER_ACCEPTED',
  'BOOKING_CONFIRMED',
  'TEAM_ASSIGNED',
  'JOB_IN_PROGRESS',
  'JOB_COMPLETED',
  'FOLLOW_UP',
];

export default function AdminJobsAndChecklistsPage() {
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string>('');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [completionNotes, setCompletionNotes] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    const res = await fetch('/api/admin/platform');
    const json = await res.json();
    if (json.ok && json.data) {
      setDb(json.data);
      if (!selectedJobId && json.data.jobRequests.length > 0) {
        const first = json.data.jobRequests[0];
        setSelectedJobId(first.id);
        setTeamId(first.assignedTeamId || '');
        setVehicleId(first.assignedVehicleId || '');
        setCompletionNotes(first.completionNotes || '');
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
        Loading Jobs &amp; Operational Checklists...
      </div>
    );
  }

  const activeJob =
    db.jobRequests.find((j) => j.id === selectedJobId) || db.jobRequests[0];
  const activeCustomer = activeJob
    ? db.customers.find((c) => c.id === activeJob.customerId)
    : undefined;
  const activeLead = activeJob
    ? db.leads.find((l) => l.id === activeJob.leadId)
    : undefined;
  const activeChecklist = activeJob
    ? db.jobChecklists.find((chk) => chk.jobRequestId === activeJob.id)
    : undefined;

  const handleToggleChecklistItem = async (checklistId: string, itemId: string) => {
    await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'TOGGLE_CHECKLIST_ITEM',
        checklistId,
        itemId,
      }),
    });
    await loadData();
  };

  const handleUpdateJob = async (stage?: JobLifecycleStage) => {
    if (!activeJob) return;
    setFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE_JOB_STAGE',
        jobRequestId: activeJob.id,
        lifecycleStage: stage || activeJob.lifecycleStage,
        assignedTeamId: teamId,
        assignedVehicleId: vehicleId,
        completionNotes,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(`Updated job stage & resource assignments.`);
      await loadData();
    }
  };

  const completedStepsCount = activeChecklist
    ? activeChecklist.items.filter((i) => i.isCompleted).length
    : 0;
  const totalStepsCount = activeChecklist ? activeChecklist.items.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="orange" className="mb-2">
          Section 8.5 &amp; 8.6 • Job Lifecycle &amp; Operational Checklists
        </Badge>
        <h1 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
          Active Jobs, Resource Assignment &amp; Service Checklists
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Manage the 10-stage operational job lifecycle, assign crews and vehicles, and verify
          every Moving, Junk Removal, and Delivery checklist item.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Jobs List */}
        <div className="space-y-3 lg:col-span-4">
          {db.jobRequests.map((job) => {
            const cust = db.customers.find((c) => c.id === job.customerId);
            const lead = db.leads.find((l) => l.id === job.leadId);
            const selected = activeJob?.id === job.id;
            return (
              <button
                key={job.id}
                type="button"
                onClick={() => {
                  setSelectedJobId(job.id);
                  setTeamId(job.assignedTeamId || '');
                  setVehicleId(job.assignedVehicleId || '');
                  setCompletionNotes(job.completionNotes || '');
                  setFeedback(null);
                }}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                  selected
                    ? 'border-brand-orange bg-white shadow-md'
                    : 'border-brand-navy/10 bg-white/80 hover:border-brand-navy/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-brand-navy">
                    {lead?.referenceCode || job.id}
                  </span>
                  <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-[10px] font-bold text-brand-navy">
                    {job.serviceCategory}
                  </span>
                </div>
                <p className="mt-1 font-heading text-sm font-bold text-brand-navy">
                  {cust?.fullName} • {job.pickupCity}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-brand-orange">
                  Stage: {job.lifecycleStage.replace(/_/g, ' ')}
                </p>
              </button>
            );
          })}
        </div>

        {/* Job Detail & Interactive Checklist */}
        <div className="lg:col-span-8">
          {activeJob ? (
            <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-navy/10 pb-4">
                <div>
                  <span className="font-mono text-xs font-extrabold text-brand-orange">
                    {activeLead?.referenceCode || activeJob.id} • {activeJob.serviceType}
                  </span>
                  <h2 className="mt-0.5 font-heading text-xl font-extrabold text-brand-navy">
                    {activeCustomer?.fullName} — {activeJob.pickupCity}
                  </h2>
                  <p className="mt-1 text-xs text-brand-muted">
                    <MapPin className="inline h-3.5 w-3.5 mr-1 text-brand-orange" />
                    Pickup: {activeJob.pickupAddress}, {activeJob.pickupCity}
                    {activeJob.destinationAddress
                      ? ` → Drop-Off: ${activeJob.destinationAddress}, ${activeJob.destinationCity}`
                      : ''}
                  </p>
                </div>
                <Badge variant="navy">{activeJob.lifecycleStage.replace(/_/g, ' ')}</Badge>
              </div>

              {feedback && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{feedback}</span>
                </div>
              )}

              {/* Interactive Operational Checklist (Section 8.6) */}
              {activeChecklist && (
                <div className="rounded-2xl border border-brand-navy/15 bg-brand-light/50 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-brand-orange" />
                      <h3 className="font-heading text-base font-extrabold text-brand-navy">
                        {activeChecklist.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-bold text-white">
                      {completedStepsCount} / {totalStepsCount} Completed
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {activeChecklist.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleChecklistItem(activeChecklist.id, item.id)}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs transition ${
                          item.isCompleted
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-brand-navy'
                            : 'border-brand-navy/10 bg-white text-brand-charcoal hover:border-brand-orange'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 font-semibold">
                          {item.isCompleted ? (
                            <CheckSquare className="h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <Square className="h-4 w-4 shrink-0 text-brand-muted" />
                          )}
                          <span className={item.isCompleted ? 'line-through opacity-75' : ''}>
                            {item.label}
                          </span>
                        </span>
                        <span className="text-[10px] font-bold uppercase text-brand-muted">
                          {item.isCompleted ? 'Done' : 'Click to Complete'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Crew Team & Fleet Truck Assignment */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                    <Users className="inline h-3.5 w-3.5 mr-1 text-brand-orange" />
                    Assigned Crew Team
                  </label>
                  <select
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-brand-navy/15 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-navy"
                  >
                    <option value="">-- Unassigned --</option>
                    {db.teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                    <Truck className="inline h-3.5 w-3.5 mr-1 text-brand-orange" />
                    Assigned Fleet Vehicle
                  </label>
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-brand-navy/15 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-navy"
                  >
                    <option value="">-- Unassigned --</option>
                    {db.vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.licensePlate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                  Field Crew &amp; Completion Notes
                </label>
                <textarea
                  rows={2}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Record on-site arrival notes, parking clearance, or customer sign-off..."
                  className="mt-1.5 w-full rounded-xl border border-brand-navy/15 p-3 text-xs text-brand-navy"
                />
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="secondary" size="sm" onClick={() => handleUpdateJob()}>
                  Save Team, Truck &amp; Notes
                </Button>
              </div>

              {/* 10-Stage Job Lifecycle Selector */}
              <div className="border-t border-brand-navy/10 pt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-muted">
                  Transition 10-Stage Job Lifecycle (Section 8.5):
                </p>
                <div className="flex flex-wrap gap-2">
                  {JOB_STAGES.map((stage) => (
                    <Button
                      key={stage}
                      type="button"
                      size="sm"
                      variant={activeJob.lifecycleStage === stage ? 'primary' : 'outline'}
                      onClick={() => handleUpdateJob(stage)}
                    >
                      {stage.replace(/_/g, ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

