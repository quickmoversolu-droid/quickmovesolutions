'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertTriangle,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState<string>('');
  const [accessCode, setAccessCode] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
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

  return (
    <div className="min-h-screen bg-[#05080D] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#101D35]/80 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-lg">
        {/* Navigation & Logo */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <BrandLogo variant="horizontal" showTagline />
          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-orange transition-colors hover:border-brand-orange hover:bg-brand-orange/10"
          >
            ← Public Website
          </Link>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0A1324]/95 p-8 shadow-dark-card sm:p-10 backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/35 bg-brand-orange/15 px-3.5 py-1 text-xs font-bold text-brand-orange">
            <KeyRound className="h-3.5 w-3.5" />
            QuickMove Admin & Dispatch Portal
          </span>

          <h1 className="mt-4 font-heading text-2xl font-extrabold text-white sm:text-3xl">
            {mustChangeUser
              ? 'Set New Password'
              : 'Sign In to Admin Portal'}
          </h1>
          <p className="mt-2 text-sm text-white/65">
            {mustChangeUser
              ? `Welcome ${mustChangeUser.name}. For your security, please set a new personal password before continuing.`
              : 'Enter your staff email or username and password to access dispatch and operations.'}
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
                    placeholder="e.g. quickmoversolu@gmail.com or owner"
                    className="w-full rounded-xl border border-white/15 bg-[#060C18] pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/75">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/15 bg-[#060C18] pl-10 pr-11 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-orange focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F47732] to-[#ff8b49] px-6 py-3.5 text-sm font-bold text-white shadow-orange-glow transition-all hover:brightness-110 disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In to Admin Portal'}
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
                  placeholder="Min 8 characters"
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
                  placeholder="Re-type new password"
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

          <div className="mt-8 border-t border-white/10 pt-5 flex items-center justify-between text-xs text-white/55">
            <span>Customer Looking for Quotes?</span>
            <Link href="/portal/login" className="font-bold text-brand-orange hover:underline">
              Open Customer Portal →
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>End-to-end encrypted session • Calgary Operations</span>
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
