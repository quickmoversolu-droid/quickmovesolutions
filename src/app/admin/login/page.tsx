'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  AlertTriangle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { BUSINESS_INFO } from '@/lib/constants/business';
import type { UserRole } from '@/lib/db/platform-store';

const DEMO_ROLES: {
  role: UserRole;
  title: string;
  email: string;
  username: string;
  accessCode: string;
  scope: string;
}[] = [
  {
    role: 'OWNER',
    title: 'Super Admin / Owner',
    email: BUSINESS_INFO.email,
    username: 'owner',
    accessCode: 'QM-OWNER-2026',
    scope: 'Full platform access, Team & Access Control, Finances, Settings & AI Marketing Approval',
  },
  {
    role: 'ADMIN',
    title: 'Administrator / Manager',
    email: 'quickmoversolu+admin@gmail.com',
    username: 'sarah.admin',
    accessCode: 'QM-ADMIN-2026',
    scope: 'Manage Leads, Customers, Bookings, Quotations, Employee Assignments & Reports',
  },
  {
    role: 'COORDINATOR',
    title: 'Dispatcher',
    email: 'quickmoversolu+dispatch@gmail.com',
    username: 'marcus.dispatch',
    accessCode: 'QM-COORD-2026',
    scope: 'View & manage job schedules, assign crews/vehicles, update booking statuses',
  },
  {
    role: 'MARKETING_MANAGER',
    title: 'Marketing Manager',
    email: 'quickmoversolu+marketing@gmail.com',
    username: 'elena.marketing',
    accessCode: 'QM-MKT-2026',
    scope: 'AI Marketing Manager, Content Studio, Calendar, Analytics & Publishing Workflows',
  },
  {
    role: 'CREW_MEMBER',
    title: 'Employee (Field Crew)',
    email: 'quickmoversolu+crew@gmail.com',
    username: 'devon.crew',
    accessCode: 'QM-CREW-2026',
    scope: 'View assigned jobs, customer info, update job progress, upload photos & checklists',
  },
];

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState<string>(BUSINESS_INFO.email);
  const [accessCode, setAccessCode] = useState<string>('QM-OWNER-2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('OWNER');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // First-login temporary password change state
  const [mustChangeUser, setMustChangeUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'staff',
          email,
          accessCode,
          role: selectedRole,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.session?.mustChangePassword) {
        setMustChangeUser({
          id: data.session.userId,
          name: data.session.name,
          email: data.session.email,
        });
        setIsLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
      setIsLoading(false);
    }
  };

  const handleCompleteFirstLoginPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mustChangeUser) return;
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CHANGE_OWN_PASSWORD',
        userId: mustChangeUser.id,
        newPassword,
      }),
    });
    const data = await res.json();
    setIsLoading(false);
    if (res.ok && data.ok) {
      router.push(nextPath);
      router.refresh();
    } else {
      setError(data.error || 'Failed to update password.');
    }
  };

  const selectRolePreset = (preset: (typeof DEMO_ROLES)[number]) => {
    setSelectedRole(preset.role);
    setEmail(preset.email);
    setAccessCode(preset.accessCode);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#05080D] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#101D35]/80 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <BrandLogo variant="horizontal" showTagline />
          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-orange transition-colors hover:border-brand-orange hover:bg-brand-orange/10"
          >
            ← Back to Public Website
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Login Card */}
          <div className="rounded-3xl border border-white/10 bg-[#0A1324]/95 p-8 shadow-dark-card lg:col-span-7 sm:p-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/35 bg-brand-orange/15 px-3.5 py-1 text-xs font-bold text-brand-orange">
              <KeyRound className="h-3.5 w-3.5" />
              Secure Scrypt Role-Based Authentication
            </span>

            <h1 className="mt-3 font-heading text-2xl font-extrabold text-white sm:text-3xl">
              {mustChangeUser
                ? 'Change Temporary Password'
                : 'Sign In to QuickMove Admin'}
            </h1>
            <p className="mt-1.5 text-sm text-white/65">
              {mustChangeUser
                ? `Welcome ${mustChangeUser.name}. For your security, please set a new personal password before continuing.`
                : 'Enter your staff email or username and password, or select a role preset on the right.'}
            </p>

            {error && (
              <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-xs font-semibold text-red-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {!mustChangeUser ? (
              <form onSubmit={handleLogin} className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/75">
                    Staff Email or Username
                  </label>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email or username (e.g. owner)"
                      className="w-full rounded-xl border border-white/15 bg-[#060C18] pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/75">
                    Password / Access Code
                  </label>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                    <input
                      type="password"
                      required
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#060C18] pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-orange focus:outline-none"
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-white/55">
                    Selected Role:{' '}
                    <strong className="text-white">{selectedRole}</strong> (Default Code:{' '}
                    <code className="font-mono text-brand-orange">{accessCode}</code>)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F47732] to-[#ff8b49] px-6 py-3.5 text-sm font-bold text-white shadow-orange-glow transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {isLoading ? 'Signing In...' : `Sign In as ${selectedRole}`}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompleteFirstLoginPasswordChange} className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/75">
                    New Personal Password (Min 8 Characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060C18] px-4 py-3 text-sm text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/75">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#060C18] px-4 py-3 text-sm text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F47732] to-[#ff8b49] px-6 py-3.5 text-sm font-bold text-white shadow-orange-glow"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isLoading ? 'Saving Password...' : 'Save Password & Continue'}
                </button>
              </form>
            )}

            <div className="mt-6 border-t border-white/10 pt-5 flex items-center justify-between text-xs text-white/55">
              <span>Looking for the Customer Self-Service Portal?</span>
              <Link href="/portal/login" className="font-bold text-brand-orange hover:underline">
                Open Customer Portal →
              </Link>
            </div>
          </div>

          {/* Role Switcher Presets for RBAC Verification */}
          <div className="rounded-3xl border border-white/10 bg-[#0A1324]/90 p-6 text-white backdrop-blur-md lg:col-span-5 sm:p-8 shadow-dark-card">
            <div className="flex items-center gap-2 text-brand-orange">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Section 10 RBAC Role Presets
              </span>
            </div>
            <h2 className="mt-2 font-heading text-lg font-extrabold text-white">
              Quick-Select Staff Role
            </h2>
            <p className="mt-1 text-xs text-white/65">
              Click any role below to auto-fill credentials and inspect role-specific sidebar and
              permission boundaries:
            </p>

            <div className="mt-4 space-y-2.5">
              {DEMO_ROLES.map((item) => {
                const active = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => selectRolePreset(item)}
                    className={`w-full rounded-2xl border p-3.5 text-left transition-all ${
                      active
                        ? 'border-brand-orange bg-brand-orange/15 text-white shadow-orange-glow'
                        : 'border-white/10 bg-[#060C18]/80 text-white/80 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-brand-orange">
                        {item.title}
                      </span>
                      <UserCheck className="h-4 w-4 text-brand-orange" />
                    </div>
                    <p className="mt-0.5 text-[11px] font-mono text-white/60">
                      Login: {item.username} / {item.email}
                    </p>
                    <p className="mt-1 text-[11px] text-white/70">{item.scope}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#05080D] p-12 text-center text-white">
          Loading QuickMove Admin Login...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
