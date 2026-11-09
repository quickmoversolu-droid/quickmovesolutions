'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Settings,
  CheckCircle2,
  Lock,
  Building2,
  Save,
  Bot,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROLE_PERMISSION_MATRIX } from '@/lib/auth/permissions';
import { BUSINESS_INFO } from '@/lib/constants/business';
import type { UserRole, SystemSettingsRecord, UserRecord } from '@/lib/db/platform-store';

export default function AdminSettingsAndRbacPage() {
  const [settings, setSettings] = useState<SystemSettingsRecord | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [gstRate, setGstRate] = useState<number>(5.0);
  const [validityDays, setValidityDays] = useState<number>(14);
  const [requireApproval, setRequireApproval] = useState<boolean>(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/platform')
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.data) {
          setSettings(res.data.settings);
          setUsers(res.data.users || []);
          setGstRate(res.data.settings.albertaGstPercent ?? 5.0);
          setValidityDays(res.data.settings.defaultQuoteValidityDays ?? 14);
          setRequireApproval(res.data.settings.requireOwnerMarketingApproval ?? true);
        }
      });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE_SETTINGS',
        albertaGstPercent: gstRate,
        defaultQuoteValidityDays: validityDays,
        requireOwnerMarketingApproval: requireApproval,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setSettings(data.settings);
      setSaveMessage('System settings updated and logged in audit trail.');
    } else {
      setSaveMessage(data.error || 'Error saving settings.');
    }
  };

  const rolesList = Object.entries(ROLE_PERMISSION_MATRIX) as [
    UserRole,
    (typeof ROLE_PERMISSION_MATRIX)[UserRole],
  ][];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="orange" className="mb-2">
            Platform Governance &amp; Security
          </Badge>
          <h1 className="font-heading text-2xl font-extrabold text-brand-navy sm:text-3xl">
            System Settings &amp; Role-Based Access Control (RBAC)
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Configure Alberta GST rates, quotation validity defaults, marketing approval gates, and
            inspect the 6-role security matrix defined in Section 8.2.
          </p>
        </div>
        <Link
          href="/admin/settings/ai"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-orange to-[#ff8c42] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-orange/20 transition-all hover:opacity-95"
        >
          <Bot className="h-4 w-4" />
          <span>Configure AI &amp; OpenRouter Gateway</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Official Immutable Business Identity Card */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm lg:col-span-6">
          <div className="flex items-center gap-2 text-brand-navy">
            <Building2 className="h-5 w-5 text-brand-orange" />
            <h2 className="font-heading text-lg font-extrabold">
              Verified Business Profile (Locked Source of Truth)
            </h2>
          </div>
          <p className="mt-1 text-xs text-brand-muted">
            These official business facts are enforced across all website pages, quotes, PDFs,
            emails, and AI Marketing prompts.
          </p>

          <dl className="mt-5 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
            <div className="rounded-xl bg-brand-light p-3.5">
              <dt className="font-bold uppercase tracking-wider text-brand-muted">Company Name</dt>
              <dd className="mt-1 font-heading text-sm font-extrabold text-brand-navy">
                {BUSINESS_INFO.name}
              </dd>
            </div>
            <div className="rounded-xl bg-brand-light p-3.5">
              <dt className="font-bold uppercase tracking-wider text-brand-muted">Tagline</dt>
              <dd className="mt-1 font-heading text-sm font-extrabold text-brand-navy">
                {BUSINESS_INFO.tagline}
              </dd>
            </div>
            <div className="rounded-xl bg-brand-light p-3.5">
              <dt className="font-bold uppercase tracking-wider text-brand-muted">Official Phone</dt>
              <dd className="mt-1 font-mono text-sm font-bold text-brand-orange">
                {BUSINESS_INFO.phoneDisplay}
              </dd>
            </div>
            <div className="rounded-xl bg-brand-light p-3.5">
              <dt className="font-bold uppercase tracking-wider text-brand-muted">Official Email</dt>
              <dd className="mt-1 font-mono text-xs font-bold text-brand-navy">
                {BUSINESS_INFO.email}
              </dd>
            </div>
            <div className="rounded-xl bg-brand-light p-3.5 sm:col-span-2">
              <dt className="font-bold uppercase tracking-wider text-brand-muted">
                Primary Market &amp; Timezone
              </dt>
              <dd className="mt-1 text-sm font-bold text-brand-navy">
                {BUSINESS_INFO.primaryLocation} ({BUSINESS_INFO.timezone}) — Serving Calgary,
                Airdrie, Strathmore, Red Deer &amp; Edmonton
              </dd>
            </div>
          </dl>
        </div>

        {/* Financial & Operational Parameters Form */}
        <form
          onSubmit={handleSaveSettings}
          className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm lg:col-span-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-brand-navy">
            <Settings className="h-5 w-5 text-brand-orange" />
            <h2 className="font-heading text-lg font-extrabold">
              Quotation, Tax &amp; Marketing Governance Settings
            </h2>
          </div>

          {saveMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>{saveMessage}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Alberta GST Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm text-brand-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                Default Quote Validity (Days)
              </label>
              <input
                type="number"
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm text-brand-navy"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-navy/10 bg-brand-light p-4">
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              className="h-5 w-5 rounded accent-brand-orange"
            />
            <div>
              <p className="text-xs font-bold text-brand-navy">
                Require Owner Approval Before Publishing Social Media Posts
              </p>
              <p className="text-[11px] text-brand-muted">
                Enforces Section 10.7: AI-generated posts remain in DRAFT or PENDING_APPROVAL until
                explicitly approved by the Owner.
              </p>
            </div>
          </label>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md">
              <Save className="mr-2 h-4 w-4" />
              Save Operational Settings
            </Button>
          </div>
        </form>
      </div>

      {/* RBAC Matrix Table */}
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-brand-navy">
          <ShieldCheck className="h-5 w-5 text-brand-orange" />
          <h2 className="font-heading text-lg font-extrabold">
            6-Role Access Control Matrix (Section 8.2)
          </h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-navy/10 text-[11px] uppercase tracking-wider text-brand-muted">
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 px-3">CRM &amp; Leads</th>
                <th className="py-3 px-3">Quotes</th>
                <th className="py-3 px-3">Bookings</th>
                <th className="py-3 px-3">Fleet &amp; Staff</th>
                <th className="py-3 px-3">AI Marketing</th>
                <th className="py-3 px-3">Approve Posts</th>
                <th className="py-3 px-3">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/10">
              {rolesList.map(([roleKey, perm]) => (
                <tr key={roleKey} className="hover:bg-brand-light/50">
                  <td className="py-3.5 pr-4">
                    <p className="font-heading font-extrabold text-brand-navy">{roleKey}</p>
                    <p className="text-[11px] text-brand-muted">{perm.description}</p>
                  </td>
                  <td className="py-3.5 px-3 font-bold">
                    {perm.canAccessCrm ? '✅ Allowed' : '—'}
                  </td>
                  <td className="py-3.5 px-3 font-bold">
                    {perm.canManageQuotes ? '✅ Allowed' : '—'}
                  </td>
                  <td className="py-3.5 px-3 font-bold">
                    {perm.canManageBookings ? '✅ Allowed' : '—'}
                  </td>
                  <td className="py-3.5 px-3 font-bold">
                    {perm.canManageFleetAndEmployees ? '✅ Allowed' : '—'}
                  </td>
                  <td className="py-3.5 px-3 font-bold">
                    {perm.canAccessMarketing ? '✅ Allowed' : '—'}
                  </td>
                  <td className="py-3.5 px-3 font-bold">
                    {perm.canApproveMarketing ? '✅ Owner Only' : '—'}
                  </td>
                  <td className="py-3.5 px-3 font-bold">
                    {perm.canManageSettings ? '✅ Owner Only' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provisioned Staff & Portal Accounts */}
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-brand-navy">
          <Lock className="h-5 w-5 text-brand-orange" />
          <h2 className="font-heading text-lg font-extrabold">
            Active Platform Users ({users.length})
          </h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="rounded-2xl border border-brand-navy/10 bg-brand-light/60 p-4 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brand-navy px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {u.role}
                </span>
                <span className="text-[11px] font-bold text-emerald-700">Active</span>
              </div>
              <p className="mt-2 font-heading text-sm font-extrabold text-brand-navy">{u.name}</p>
              <p className="text-brand-muted">{u.email}</p>
              <p className="mt-1 font-mono text-[11px] text-emerald-400">
                Password: •••••••• (Protected)
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

