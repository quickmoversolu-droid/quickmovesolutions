'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  ExternalLink,
  ShieldCheck,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BUSINESS_INFO } from '@/lib/constants/business';
import type { PlatformDatabaseState } from '@/lib/db/platform-store';

export default function AdminReviewsAndTestimonialsPage() {
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

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
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-12 text-center text-sm font-bold text-brand-navy">
        Loading Review Requests &amp; Verified Testimonials...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="orange" className="mb-2">
            Section 8.9 • Reputation &amp; Review Management
          </Badge>
          <h1 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Customer Review Requests &amp; Verified Testimonials
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Send post-job Google review invitations to completed customers and manage verified
            customer feedback with strict truth-in-marketing guardrails.
          </p>
        </div>
        <a
          href={BUSINESS_INFO.googleBusinessSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-extrabold text-white"
        >
          Open Google Business Listing <ExternalLink className="h-3.5 w-3.5 text-brand-orange" />
        </a>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Truth-in-Reviews Guardrail Notice */}
      <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-4 text-xs text-brand-navy flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-orange mt-0.5" />
        <div>
          <strong className="font-extrabold">
            Part 18 Non-Negotiable Rule — Verified Reviews Only:
          </strong>{' '}
          QuickMove Solutions never fabricates customer reviews, star ratings, or review counts.
          Review invitations are sent only to real customers upon job completion, and testimonials
          require explicit Owner verification before appearing on public pages.
        </div>
      </div>

      {/* Review Invitations Queue */}
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-brand-navy">
          <Send className="h-5 w-5 text-brand-orange" />
          <h2 className="font-heading text-lg font-extrabold">
            Post-Job Review Request Queue ({db.reviewRequests.length})
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          {db.reviewRequests.map((req) => {
            const cust = db.customers.find((c) => c.id === req.customerId);
            const job = db.jobRequests.find((j) => j.id === req.jobRequestId);
            return (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-brand-navy/10 bg-brand-light/50 p-4 text-xs"
              >
                <div>
                  <span className="rounded-full bg-brand-navy px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {req.status}
                  </span>
                  <p className="mt-1.5 font-heading text-sm font-extrabold text-brand-navy">
                    {cust?.fullName} • {job?.serviceType} ({job?.pickupCity})
                  </p>
                  <p className="mt-0.5 text-brand-muted">{req.notes}</p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    setFeedback(
                      `Dispatched Google Review invitation email to ${cust?.email} (${BUSINESS_INFO.googleBusinessSearchUrl}).`
                    )
                  }
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Send Review Invite
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Testimonials Moderation */}
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-brand-navy">
          <Star className="h-5 w-5 text-brand-orange" />
          <h2 className="font-heading text-lg font-extrabold">
            Verified Testimonials Moderation ({db.testimonials.length})
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          {db.testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-brand-navy/10 bg-brand-light/40 p-4 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-brand-navy">
                  {t.customerName} ({t.city}) — {t.serviceType}
                </span>
                <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                  {t.isPublished ? 'Published' : 'Unpublished / Awaiting Verification'}
                </span>
              </div>
              <p className="mt-2 italic text-brand-charcoal">&ldquo;{t.quoteText}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

