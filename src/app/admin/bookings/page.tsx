'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  Truck,
  Users,
  Plus,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type {
  PlatformDatabaseState,
  BookingStatus,
} from '@/lib/db/platform-store';

type CalendarViewMode = 'MONTHLY' | 'WEEKLY' | 'DAILY';

function BookingsAndCalendarContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('jobRequestId') || '';
  const initialQuoteId = searchParams.get('quoteId') || '';

  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [viewMode, setViewMode] = useState<CalendarViewMode>('MONTHLY');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-08');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(Boolean(initialJobId));

  // New Booking Form State
  const [jobRequestId, setJobRequestId] = useState<string>(initialJobId);
  const [quoteId, setQuoteId] = useState<string>(initialQuoteId);
  const [scheduledDate, setScheduledDate] = useState<string>('2026-11-10');
  const [startTime, setStartTime] = useState<string>('08:30');
  const [endTime, setEndTime] = useState<string>('13:30');
  const [arrivalWindow, setArrivalWindow] = useState<string>('8:30 AM – 9:30 AM');
  const [assignedTeamId, setAssignedTeamId] = useState<string>('team_alpha');
  const [assignedVehicleId, setAssignedVehicleId] = useState<string>('veh_2');
  const [status, setStatus] = useState<BookingStatus>('CONFIRMED');
  const [dispatchNotes, setDispatchNotes] = useState<string>('');

  const [conflictErrors, setConflictErrors] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    const res = await fetch('/api/admin/platform');
    const json = await res.json();
    if (json.ok && json.data) {
      setDb(json.data);
      if (!jobRequestId && json.data.jobRequests.length > 0) {
        setJobRequestId(json.data.jobRequests[0].id);
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
        Loading Dispatch Calendar &amp; Resource Conflict Engine...
      </div>
    );
  }

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictErrors([]);
    setFeedback(null);

    const team = db.teams.find((t) => t.id === assignedTeamId);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE_BOOKING',
        jobRequestId,
        quoteId,
        scheduledDate,
        startTime,
        endTime,
        arrivalWindow,
        assignedTeamId,
        assignedVehicleId,
        crewMemberIds: team?.memberIds || [],
        status,
        dispatchNotes,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      if (data.conflicts && Array.isArray(data.conflicts)) {
        setConflictErrors(data.conflicts);
      } else {
        setConflictErrors([data.error || 'Unable to schedule booking.']);
      }
      return;
    }

    setFeedback(
      `Scheduled Booking ${data.booking.bookingNumber} on ${data.booking.scheduledDate} (${data.booking.startTime}–${data.booking.endTime}).`
    );
    setSelectedDate(data.booking.scheduledDate);
    setShowCreateForm(false);
    await loadData();
  };

  const handleUpdateBookingStatus = async (bookingId: string, nextStatus: BookingStatus) => {
    setConflictErrors([]);
    setFeedback(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE_BOOKING',
        bookingId,
        status: nextStatus,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(`Booking ${data.booking.bookingNumber} updated to ${nextStatus}.`);
      await loadData();
    } else if (data.conflicts) {
      setConflictErrors(data.conflicts);
    }
  };

  // Fill form with an overlapping window to demonstrate the double-booking conflict guard
  const simulateConflictTest = () => {
    setShowCreateForm(true);
    setScheduledDate('2026-11-08');
    setStartTime('09:30');
    setEndTime('12:30');
    setAssignedTeamId('team_alpha');
    setAssignedVehicleId('veh_1');
    setConflictErrors([]);
    setFeedback(
      'Loaded overlapping time window (2026-11-08 09:30–12:30 with Team Alpha & Unit #01). Click "Confirm & Schedule Booking" to test server-side conflict rejection.'
    );
  };

  // Generate November 2026 Calendar Days (30 days)
  const novDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = String(i + 1).padStart(2, '0');
    return `2026-11-${dayNum}`;
  });

  // 7-day slice around selectedDate for Weekly View
  const selectedDayIndex = Math.max(0, novDays.indexOf(selectedDate));
  const weekStartIdx = Math.min(23, Math.max(0, selectedDayIndex - 2));
  const weekDays = novDays.slice(weekStartIdx, weekStartIdx + 7);

  const bookingsOnSelectedDate = db.bookings.filter(
    (b) => b.scheduledDate === selectedDate
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="orange" className="mb-2">
            Section 9.4 • Dispatch Calendar &amp; Conflict Prevention
          </Badge>
          <h1 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Bookings, Dispatch Calendar &amp; Resource Scheduling
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Schedule Moving, Junk Removal, and Delivery jobs across Daily, Weekly, and Monthly
            views with automatic server-side double-booking prevention.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={simulateConflictTest}>
            <ShieldAlert className="mr-1.5 h-4 w-4 text-brand-orange" />
            Test Conflict Guard
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => setShowCreateForm((prev) => !prev)}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            {showCreateForm ? 'Close Booking Form' : 'Schedule New Booking'}
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {conflictErrors.length > 0 && (
        <div className="rounded-2xl border-2 border-red-500 bg-red-50 p-4 text-xs text-red-800 space-y-1.5">
          <div className="flex items-center gap-2 font-heading text-sm font-extrabold text-red-700">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Double-Booking Resource Conflict Blocked by Server (HTTP 409)</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 font-semibold">
            {conflictErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Create Booking Modal / Panel */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateBooking}
          className="rounded-3xl border-2 border-brand-orange bg-white p-6 shadow-xl sm:p-8 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-brand-navy/10 pb-4">
            <h2 className="font-heading text-xl font-extrabold text-brand-navy">
              Schedule &amp; Assign New Booking
            </h2>
            <Badge variant="orange">Real-Time Conflict Detection Enabled</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Select Job Request *
              </label>
              <select
                value={jobRequestId}
                onChange={(e) => setJobRequestId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-navy"
              >
                {db.jobRequests.map((j) => {
                  const cust = db.customers.find((c) => c.id === j.customerId);
                  const lead = db.leads.find((l) => l.id === j.leadId);
                  return (
                    <option key={j.id} value={j.id}>
                      {lead?.referenceCode || j.id} — {cust?.fullName} ({j.pickupCity})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Scheduled Date *
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-navy"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="TENTATIVE">TENTATIVE (Hold Slot)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Start Time (24h) *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                End Time (24h) *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Customer Arrival Window
              </label>
              <input
                type="text"
                value={arrivalWindow}
                onChange={(e) => setArrivalWindow(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Assign Crew Team
              </label>
              <select
                value={assignedTeamId}
                onChange={(e) => setAssignedTeamId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-navy"
              >
                {db.teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Assign Fleet Truck
              </label>
              <select
                value={assignedVehicleId}
                onChange={(e) => setAssignedVehicleId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-navy"
              >
                {db.vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.licensePlate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Dispatch Instructions
              </label>
              <input
                type="text"
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                placeholder="Elevator code, floor runners, dolly notes..."
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 px-3.5 py-2.5 text-xs text-brand-navy"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" variant="primary">
              Confirm &amp; Schedule Booking
            </Button>
          </div>
        </form>
      )}

      {/* Calendar View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-brand-orange" />
          <span className="font-heading text-sm font-extrabold text-brand-navy">
            November 2026 Dispatch Schedule — Selected Date: {selectedDate}
          </span>
        </div>

        <div className="flex rounded-xl bg-brand-light p-1">
          {(['MONTHLY', 'WEEKLY', 'DAILY'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`rounded-lg px-4 py-1.5 text-xs font-extrabold transition ${
                viewMode === mode
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-brand-navy hover:text-brand-orange'
              }`}
            >
              {mode} VIEW
            </button>
          ))}
        </div>
      </div>

      {/* MONTHLY VIEW */}
      {viewMode === 'MONTHLY' && (
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-6 gap-2.5">
            {novDays.map((dateStr) => {
              const dayBookings = db.bookings.filter((b) => b.scheduledDate === dateStr);
              const isSelected = selectedDate === dateStr;
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex flex-col justify-between rounded-2xl border p-3 text-left transition min-h-[105px] ${
                    isSelected
                      ? 'border-2 border-brand-orange bg-brand-orange/5 shadow-sm'
                      : dayBookings.length > 0
                        ? 'border-brand-navy/25 bg-brand-light/50 hover:border-brand-orange'
                        : 'border-brand-navy/10 bg-white hover:bg-brand-light/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-brand-navy">
                      Nov {dateStr.slice(-2)}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-bold text-white">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1">
                    {dayBookings.map((b) => (
                      <div
                        key={b.id}
                        className={`truncate rounded-lg px-2 py-1 text-[10px] font-bold ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-500/15 text-emerald-800'
                            : 'bg-amber-500/15 text-amber-800'
                        }`}
                      >
                        {b.startTime} • {b.serviceCategory}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY VIEW */}
      {viewMode === 'WEEKLY' && (
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-base font-extrabold text-brand-navy mb-4">
            7-Day Operational Dispatch Board ({weekDays[0]} to {weekDays[weekDays.length - 1]})
          </h3>
          <div className="grid gap-3 md:grid-cols-7">
            {weekDays.map((dateStr) => {
              const dayBookings = db.bookings.filter((b) => b.scheduledDate === dateStr);
              return (
                <div
                  key={dateStr}
                  className="rounded-2xl border border-brand-navy/15 bg-brand-light/40 p-3 min-h-[220px]"
                >
                  <p className="font-mono text-xs font-extrabold text-brand-navy border-b border-brand-navy/10 pb-2">
                    {dateStr}
                  </p>
                  <div className="mt-2 space-y-2">
                    {dayBookings.length > 0 ? (
                      dayBookings.map((b) => {
                        const cust = db.customers.find((c) => c.id === b.customerId);
                        const team = db.teams.find((t) => t.id === b.assignedTeamId);
                        return (
                          <div
                            key={b.id}
                            className="rounded-xl bg-white p-2.5 text-[11px] shadow-sm border border-brand-navy/10"
                          >
                            <p className="font-mono font-bold text-brand-orange">
                              {b.startTime}–{b.endTime}
                            </p>
                            <p className="font-bold text-brand-navy">{cust?.fullName}</p>
                            <p className="text-brand-muted">
                              {b.pickupCity} • {team?.code}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[11px] text-brand-muted pt-2">Available Capacity</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAILY DISPATCH TIMELINE & ALL BOOKINGS */}
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-extrabold text-brand-navy">
            {viewMode === 'DAILY'
              ? `Daily Dispatch Timeline for ${selectedDate} (${bookingsOnSelectedDate.length})`
              : `All Scheduled Bookings (${db.bookings.length})`}
          </h3>
        </div>

        <div className="space-y-3">
          {(viewMode === 'DAILY' ? bookingsOnSelectedDate : db.bookings).map((bkg) => {
            const cust = db.customers.find((c) => c.id === bkg.customerId);
            const team = db.teams.find((t) => t.id === bkg.assignedTeamId);
            const vehicle = db.vehicles.find((v) => v.id === bkg.assignedVehicleId);

            return (
              <div
                key={bkg.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-brand-navy/10 bg-brand-light/50 p-5 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-brand-navy">
                      {bkg.bookingNumber}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        bkg.status === 'CONFIRMED'
                          ? 'bg-emerald-500/15 text-emerald-700'
                          : bkg.status === 'COMPLETED'
                            ? 'bg-brand-navy text-white'
                            : 'bg-amber-500/15 text-amber-800'
                      }`}
                    >
                      {bkg.status}
                    </span>
                    <span className="font-mono font-bold text-brand-orange">
                      {bkg.scheduledDate} • {bkg.startTime}–{bkg.endTime} ({bkg.arrivalWindow})
                    </span>
                  </div>

                  <p className="font-heading text-base font-extrabold text-brand-navy">
                    {cust?.fullName} — {bkg.serviceType}
                  </p>
                  <p className="text-brand-charcoal">
                    <MapPin className="inline h-3.5 w-3.5 mr-1 text-brand-orange" />
                    {bkg.pickupAddress}, {bkg.pickupCity}
                    {bkg.destinationCity ? ` → ${bkg.destinationCity}` : ''}
                  </p>
                  <p className="text-brand-muted">
                    <Users className="inline h-3.5 w-3.5 mr-1 text-brand-orange" />
                    Team: <strong>{team?.name || 'Unassigned'}</strong> •{' '}
                    <Truck className="inline h-3.5 w-3.5 mx-1 text-brand-orange" />
                    Truck: <strong>{vehicle?.name || 'Unassigned'}</strong>
                  </p>
                  {bkg.dispatchNotes && (
                    <p className="text-[11px] italic text-brand-muted">
                      Dispatch Notes: {bkg.dispatchNotes}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateBookingStatus(bkg.id, 'CONFIRMED')}
                  >
                    Confirm
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateBookingStatus(bkg.id, 'IN_PROGRESS')}
                  >
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    Start Job
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateBookingStatus(bkg.id, 'COMPLETED')}
                  >
                    Complete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminBookingsAndCalendarPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-12 text-center text-sm font-bold text-brand-navy">
          Loading Dispatch Calendar...
        </div>
      }
    >
      <BookingsAndCalendarContent />
    </Suspense>
  );
}

