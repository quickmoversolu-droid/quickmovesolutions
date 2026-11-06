'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BUSINESS_INFO } from '@/lib/constants/business';
import type { PlatformDatabaseState } from '@/lib/db/platform-store';

export default function AdminNotificationsAndLogsPage() {
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [recipientFilter, setRecipientFilter] = useState<'ALL' | 'CUSTOMER' | 'ADMIN'>('ALL');
  const [eventType, setEventType] = useState('UPCOMING_BOOKING_REMINDER');
  const [channel, setChannel] = useState<'EMAIL' | 'SMS' | 'IN_APP'>('EMAIL');
  const [recipientAddress, setRecipientAddress] = useState('m.henderson.yyc@example.com');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    const res = await fetch('/api/admin/platform');
    const json = await res.json();
    if (json.ok && json.data) {
      setDb(json.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!db) {
    return (
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-12 text-center text-sm font-bold text-brand-navy">
        Loading Notifications &amp; Audit Logs...
      </div>
    );
  }

  const handleDispatchNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const isCustomer = recipientAddress !== BUSINESS_INFO.email;
    const subjectMap: Record<string, string> = {
      UPCOMING_BOOKING_REMINDER: `QuickMove Solutions — Upcoming Calgary Service Reminder`,
      REQUEST_RECEIVED: `QuickMove Solutions — Quote Request Confirmation`,
      QUOTE_SENT: `Your Itemized QuickMove Solutions Quotation Is Ready`,
      BOOKING_CONFIRMED: `Booking Confirmed — QuickMove Solutions Calgary`,
      JOB_COMPLETED_REVIEW_INVITE: `Thank You for Choosing QuickMove Solutions!`,
    };

    const res = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        channel,
        recipientType: isCustomer ? 'CUSTOMER' : 'ADMIN',
        recipientAddress,
        subject: subjectMap[eventType] || `QuickMove Solutions Notification (${eventType})`,
        bodyPreview: `Automated ${channel} notification (${eventType}) from ${BUSINESS_INFO.name} (${BUSINESS_INFO.phoneDisplay} • ${BUSINESS_INFO.email}).`,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(
        `Dispatched ${channel} notification (${eventType}) to ${recipientAddress} and recorded in Outbox Log.`
      );
      await loadData();
    }
  };

  const filteredNotifications = db.notifications.filter((n) =>
    recipientFilter === 'ALL' ? true : n.recipientType === recipientFilter
  );

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="orange" className="mb-2">
          Part 12 • Event-Driven Notifications &amp; Audit Trail
        </Badge>
        <h1 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
          Notifications, Automated Reminders &amp; Activity Logs
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Monitor every Customer and Admin email/SMS alert, trigger pre-move reminders, and inspect
          the immutable platform activity audit trail.
        </p>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Trigger Automated Reminder / Test Notification */}
      <form
        onSubmit={handleDispatchNotification}
        className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2 text-brand-navy">
          <Send className="h-5 w-5 text-brand-orange" />
          <h2 className="font-heading text-lg font-extrabold">
            Dispatch Automated Customer / Admin Notification
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
              Notification Event
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-navy/15 bg-white px-3 py-2.5 text-xs font-bold text-brand-navy"
            >
              <option value="UPCOMING_BOOKING_REMINDER">Upcoming Booking Reminder</option>
              <option value="REQUEST_RECEIVED">Quote Request Received</option>
              <option value="QUOTE_SENT">Quotation Ready Alert</option>
              <option value="BOOKING_CONFIRMED">Booking Confirmation</option>
              <option value="JOB_COMPLETED_REVIEW_INVITE">Job Completed + Review Invite</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
              Delivery Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as 'EMAIL' | 'SMS' | 'IN_APP')}
              className="mt-1 w-full rounded-xl border border-brand-navy/15 bg-white px-3 py-2.5 text-xs font-bold text-brand-navy"
            >
              <option value="EMAIL">Email (SMTP / Resend)</option>
              <option value="SMS">SMS Text (Twilio Ready)</option>
              <option value="IN_APP">In-App Admin Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
              Recipient Email / Phone
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-navy/15 px-3 py-2.5 text-xs text-brand-navy"
            />
          </div>

          <div className="flex items-end">
            <Button type="submit" variant="primary" fullWidth>
              <Send className="mr-1.5 h-4 w-4" />
              Send &amp; Log Notification
            </Button>
          </div>
        </div>
      </form>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Notification Delivery Logs */}
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-brand-navy">
              <Bell className="h-5 w-5 text-brand-orange" />
              <h2 className="font-heading text-lg font-extrabold">
                Notification Outbox &amp; Delivery Logs ({filteredNotifications.length})
              </h2>
            </div>

            <div className="flex gap-1.5">
              {(['ALL', 'CUSTOMER', 'ADMIN'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setRecipientFilter(f)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                    recipientFilter === f
                      ? 'bg-brand-navy text-white'
                      : 'bg-brand-light text-brand-navy'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredNotifications.map((ntf) => (
              <div
                key={ntf.id}
                className="rounded-2xl border border-brand-navy/10 bg-brand-light/50 p-4 text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-navy px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {ntf.channel} • {ntf.recipientType}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-brand-orange">
                      {ntf.eventType}
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                    {ntf.status}
                  </span>
                </div>

                <p className="font-heading text-sm font-extrabold text-brand-navy">
                  {ntf.subject}
                </p>
                <p className="text-brand-charcoal">{ntf.bodyPreview}</p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-brand-muted">
                  <span>
                    {ntf.channel === 'SMS' ? (
                      <MessageSquare className="inline h-3 w-3 mr-1 text-brand-orange" />
                    ) : (
                      <Mail className="inline h-3 w-3 mr-1 text-brand-orange" />
                    )}
                    To: <strong>{ntf.recipientAddress}</strong>
                  </span>
                  <span>{ntf.createdAt.slice(0, 19).replace('T', ' ')} UTC</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Immutable Activity Audit Trail */}
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-navy">
              <ShieldCheck className="h-5 w-5 text-brand-orange" />
              <h2 className="font-heading text-lg font-extrabold">
                Activity Audit Trail ({db.activityLogs.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={loadData}
              className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>

          <div className="space-y-2.5">
            {db.activityLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-brand-navy/10 bg-brand-light/40 p-3.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-extrabold uppercase text-brand-orange">
                    {log.actorRole} • {log.action}
                  </span>
                  <span className="text-[10px] text-brand-muted">
                    {log.createdAt.slice(0, 19).replace('T', ' ')}
                  </span>
                </div>
                <p className="mt-1 font-medium text-brand-navy">{log.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

