'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  KeyRound,
  Mail,
  ArrowRight,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BUSINESS_INFO } from '@/lib/constants/business';

const DEMO_CUSTOMER_ACCOUNTS = [
  {
    name: 'Michael Henderson (Calgary Residential Move)',
    email: 'm.henderson.yyc@example.com',
    referenceCode: 'QM-MOV-261101-A1B2',
    summary: '3-Bedroom Move • Accepted Quote Q-2026-1001 • Confirmed Booking BK-2026-501',
  },
  {
    name: 'Priya Patel (Airdrie Photo Junk Removal)',
    email: 'priya.patel.airdrie@example.com',
    referenceCode: 'QM-JNK-261101-C3D4',
    summary: 'Photo Junk Removal • Sent Quote Q-2026-1002 Ready for Acceptance',
  },
];

function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/portal';

  const [email, setEmail] = useState(DEMO_CUSTOMER_ACCOUNTS[0].email);
  const [referenceCode, setReferenceCode] = useState(
    DEMO_CUSTOMER_ACCOUNTS[0].referenceCode
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePortalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'portal',
          email,
          referenceCode,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Unable to verify customer credentials.');
      }
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Portal sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange text-white shadow-lg">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-heading text-lg font-extrabold text-white">
                {BUSINESS_INFO.name}
              </p>
              <p className="text-xs text-white/70">Customer Self-Service Portal</p>
            </div>
          </Link>
          <a
            href={BUSINESS_INFO.phoneHref}
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange hover:underline"
          >
            <Phone className="h-4 w-4" />
            Need Help? Call {BUSINESS_INFO.phoneDisplay}
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="rounded-3xl bg-white p-8 shadow-2xl lg:col-span-7 sm:p-10">
            <Badge variant="orange" className="mb-3">
              Section 9.5 • Secure Customer Portal
            </Badge>
            <h1 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
              View Your Quote, Booking &amp; Job Status
            </h1>
            <p className="mt-1 text-sm text-brand-muted">
              Enter the email address used on your quote request along with your Reference Code
              (`QM-MOV-...`, `QM-JNK-...`) or Quote Number (`Q-2026-...`).
            </p>

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePortalLogin} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                  Your Email Address *
                </label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-brand-navy/15 pl-10 pr-4 py-3 text-sm text-brand-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                  Reference Code or Quote Number *
                </label>
                <div className="relative mt-1.5">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
                  <input
                    type="text"
                    required
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value)}
                    placeholder="e.g., QM-MOV-261101-A1B2 or Q-2026-1001"
                    className="w-full rounded-xl border border-brand-navy/15 pl-10 pr-4 py-3 font-mono text-sm text-brand-navy uppercase"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading}>
                {isLoading ? 'Verifying Access...' : 'Access My Customer Portal'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 border-t border-brand-navy/10 pt-5 flex items-center justify-between text-xs text-brand-muted">
              <span>Need to submit a new quote request?</span>
              <Link href="/get-a-quote" className="font-bold text-brand-orange hover:underline">
                Start New Quote →
              </Link>
            </div>
          </div>

          {/* Demo Customer Presets */}
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 text-white backdrop-blur-md lg:col-span-5 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-brand-orange">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Customer Isolation Demo Profiles
              </span>
            </div>
            <p className="text-xs text-white/75 leading-relaxed">
              Click either sample customer below to inspect how the Customer Portal strictly scopes
              quotes, bookings, and photos to the authenticated customer while hiding internal CRM
              notes:
            </p>

            <div className="space-y-3">
              {DEMO_CUSTOMER_ACCOUNTS.map((acct) => (
                <button
                  key={acct.referenceCode}
                  type="button"
                  onClick={() => {
                    setEmail(acct.email);
                    setReferenceCode(acct.referenceCode);
                    setError(null);
                  }}
                  className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-left hover:border-brand-orange transition"
                >
                  <p className="font-mono text-xs font-extrabold text-brand-orange">
                    {acct.referenceCode}
                  </p>
                  <p className="mt-1 font-heading text-sm font-bold text-white">{acct.name}</p>
                  <p className="mt-1 text-[11px] text-white/70">{acct.summary}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-navy flex items-center justify-center text-white">
          Loading Customer Portal...
        </div>
      }
    >
      <PortalLoginForm />
    </Suspense>
  );
}

