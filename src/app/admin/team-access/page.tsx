'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  Lock,
  CheckCircle2,
  XCircle,
  Edit3,
  Sliders,
  History,
  LogOut,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  UserX,
  Plus,
} from 'lucide-react';
import {
  buildDefaultModulePermissions,
  type PermissionModuleKey,
  type ModulePermissionActions,
  type UserPermissionMatrix,
} from '@/lib/auth/permissions';
import type {
  PlatformDatabaseState,
  UserRecord,
  UserRole,
} from '@/lib/db/platform-store';
import { cn } from '@/lib/utils';

const MODULE_LABELS: { key: PermissionModuleKey; label: string; description: string }[] = [
  { key: 'dashboard', label: 'Main Dashboard', description: 'KPI overview, daily schedule & alerts' },
  { key: 'leads_crm', label: 'Leads & CRM', description: '11-stage lead pipeline & follow-ups' },
  { key: 'jobs_bookings', label: 'Jobs & Bookings', description: 'Dispatch calendar, crews & checklists' },
  { key: 'quotations', label: 'Quotations & PDFs', description: 'Itemized quotes, discounts & GST' },
  { key: 'customers', label: 'Customers', description: 'Customer profiles, addresses & history' },
  { key: 'team_vehicles', label: 'Team & Vehicles', description: 'Crews, moving trucks & equipment' },
  { key: 'team_access', label: 'Team & Access Management', description: 'Employee accounts, roles & security' },
  { key: 'reports_analytics', label: 'Reports & Analytics', description: 'Operational & conversion metrics' },
  { key: 'ai_marketing', label: 'AI Marketing Manager', description: 'Content studio, calendar & social publishing' },
  { key: 'finances', label: 'Business Finances', description: 'Revenue totals, margins & deposits' },
  { key: 'settings_security', label: 'System Settings & Security', description: 'Tax rates, encryption & global config' },
];

const ACTION_KEYS: (keyof ModulePermissionActions)[] = [
  'view',
  'create',
  'edit',
  'delete',
  'approve',
  'manage',
];

const INITIAL_ROLES: {
  role: UserRole;
  title: string;
  summary: string;
}[] = [
  {
    role: 'OWNER',
    title: 'Super Admin / Owner',
    summary:
      'Full access to the entire platform, finances, employee accounts, settings, and AI Marketing approval.',
  },
  {
    role: 'ADMIN',
    title: 'Administrator / Manager',
    summary:
      'Manage leads, customers, bookings, jobs, quotations, and employee assignments. No owner security settings.',
  },
  {
    role: 'COORDINATOR',
    title: 'Dispatcher',
    summary:
      'View and manage job schedules, assign available employees and vehicles, and update booking statuses.',
  },
  {
    role: 'CREW_MEMBER',
    title: 'Employee',
    summary:
      'View assigned jobs and relevant customer info, update job progress, upload job photos, and complete checklists.',
  },
  {
    role: 'MARKETING_MANAGER',
    title: 'Marketing Manager',
    summary:
      'Access AI Marketing Manager, create content, view marketing analytics, and manage approved social workflows.',
  },
];

export default function AdminTeamAndAccessManagementPage() {
  const [db, setDb] = useState<PlatformDatabaseState | null>(null);
  const [activeTab, setActiveTab] = useState<
    'accounts' | 'permissions' | 'custom-roles' | 'login-activity'
  >('accounts');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Add / Edit Account Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPhone, setFormPhone] = useState('(587) 999-9565');
  const [formRole, setFormRole] = useState<UserRole>('CREW_MEMBER');
  const [formCustomRoleId, setFormCustomRoleId] = useState('');
  const [formOnboardingMode, setFormOnboardingMode] = useState<'temp-password' | 'invite'>(
    'temp-password'
  );
  const [formMfa, setFormMfa] = useState(false);

  // Generated credential banner after account creation or password reset
  const [issuedCredential, setIssuedCredential] = useState<{
    employeeName: string;
    email: string;
    temporaryPassword: string;
    invitationLink?: string;
  } | null>(null);

  // Selected user for Granular Permission Editor
  const [selectedPermUserId, setSelectedPermUserId] = useState<string>('usr_admin_1');
  const [workingPermissions, setWorkingPermissions] = useState<UserPermissionMatrix>(
    buildDefaultModulePermissions('ADMIN')
  );

  // Custom Role Creator State
  const [customRoleName, setCustomRoleName] = useState('');
  const [customRoleDesc, setCustomRoleDesc] = useState('');
  const [customRoleBase, setCustomRoleBase] = useState<UserRole>('COORDINATOR');
  const [customRolePerms, setCustomRolePerms] = useState<UserPermissionMatrix>(
    buildDefaultModulePermissions('COORDINATOR')
  );

  const loadData = async () => {
    const res = await fetch('/api/admin/platform');
    const json = await res.json();
    if (json.ok) {
      setDb(json.data);
      const target = json.data.users.find((u: UserRecord) => u.id === selectedPermUserId);
      if (target) {
        setWorkingPermissions(
          target.modulePermissions || buildDefaultModulePermissions(target.role)
        );
      }
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!db) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0B1322] p-10 text-center text-sm font-bold text-white">
        Loading Team &amp; Access Management System...
      </div>
    );
  }

  const staffAccounts = db.users.filter((u) => u.role !== 'CUSTOMER');
  const selectedPermUser =
    staffAccounts.find((u) => u.id === selectedPermUserId) || staffAccounts[0];

  const handleSelectPermUser = (user: UserRecord) => {
    setSelectedPermUserId(user.id);
    setWorkingPermissions(
      user.modulePermissions || buildDefaultModulePermissions(user.role)
    );
    setActiveTab('permissions');
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormUsername('');
    setFormPhone('(587) 999-9565');
    setFormRole('CREW_MEMBER');
    setFormCustomRoleId('');
    setFormOnboardingMode('temp-password');
    setFormMfa(false);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (user: UserRecord) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormUsername(user.username || user.email.split('@')[0]);
    setFormPhone(user.phone);
    setFormRole(user.role);
    setFormCustomRoleId(user.customRoleId || '');
    setFormMfa(Boolean(user.mfaEnabled));
    setShowAddModal(true);
  };

  const handleSaveEmployeeAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setErrorMsg(null);

    const roleMeta = INITIAL_ROLES.find((r) => r.role === formRole);

    if (editingUser) {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_USER_ACCOUNT',
          userId: editingUser.id,
          name: formName,
          email: formEmail,
          username: formUsername,
          phone: formPhone,
          role: formRole,
          roleDisplayTitle: roleMeta?.title || formRole,
          customRoleId: formCustomRoleId || undefined,
          mfaEnabled: formMfa,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setFeedback(`Updated account profile for ${formName}.`);
        setShowAddModal(false);
        await loadData();
      } else {
        setErrorMsg(data.error || 'Could not update employee account.');
      }
      return;
    }

    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE_USER_ACCOUNT',
        name: formName,
        email: formEmail,
        username: formUsername,
        phone: formPhone,
        role: formRole,
        roleDisplayTitle: roleMeta?.title || formRole,
        customRoleId: formCustomRoleId || undefined,
        onboardingMode: formOnboardingMode,
        mfaEnabled: formMfa,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setShowAddModal(false);
      setIssuedCredential({
        employeeName: formName,
        email: formEmail,
        temporaryPassword: data.temporaryPassword,
        invitationLink: data.invitationLink,
      });
      setFeedback(
        `Created account for ${formName}. Password hashed with scrypt; employee must change temporary password on first login.`
      );
      await loadData();
    } else {
      setErrorMsg(data.error || 'Could not create employee account.');
    }
  };

  const handleResetPassword = async (user: UserRecord) => {
    setFeedback(null);
    setErrorMsg(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'RESET_USER_PASSWORD',
        userId: user.id,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setIssuedCredential({
        employeeName: user.name,
        email: user.email,
        temporaryPassword: data.temporaryPassword,
      });
      setFeedback(
        `Reset password for ${user.name}. Active sessions revoked and temporary password generated.`
      );
      await loadData();
    } else {
      setErrorMsg(data.error || 'Could not reset password.');
    }
  };

  const handleToggleAccountStatus = async (
    user: UserRecord,
    desiredStatus?: 'ACTIVE' | 'DEACTIVATED' | 'REMOVED'
  ) => {
    setFeedback(null);
    setErrorMsg(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'TOGGLE_USER_STATUS',
        userId: user.id,
        accountStatus: desiredStatus,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(`${user.name} account status updated to ${data.accountStatus}.`);
      await loadData();
    } else {
      setErrorMsg(data.error || 'Cannot modify protected Super Admin account.');
    }
  };

  const handleRevokeSessions = async (user: UserRecord) => {
    setFeedback(null);
    setErrorMsg(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'REVOKE_USER_SESSIONS',
        userId: user.id,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(
        `Revoked all active sessions for ${user.name} (Session Version v${data.sessionVersion}).`
      );
      await loadData();
    } else {
      setErrorMsg(data.error || 'Unable to revoke sessions.');
    }
  };

  const handleTogglePermissionCell = (
    moduleKey: PermissionModuleKey,
    actionKey: keyof ModulePermissionActions
  ) => {
    if (selectedPermUser?.isProtectedOwner) return;
    setWorkingPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [actionKey]: !prev[moduleKey]?.[actionKey],
      },
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedPermUser) return;
    setFeedback(null);
    setErrorMsg(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE_USER_ACCOUNT',
        userId: selectedPermUser.id,
        modulePermissions: workingPermissions,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFeedback(`Saved granular module permissions for ${selectedPermUser.name}.`);
      await loadData();
    } else {
      setErrorMsg(data.error || 'Failed to save permissions.');
    }
  };

  const handleCreateCustomRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleName.trim()) return;
    setFeedback(null);
    setErrorMsg(null);
    const res = await fetch('/api/admin/platform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE_CUSTOM_ROLE',
        name: customRoleName,
        description: customRoleDesc,
        baseRole: customRoleBase,
        modulePermissions: customRolePerms,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setCustomRoleName('');
      setCustomRoleDesc('');
      setFeedback(`Created custom role "${data.customRole.name}".`);
      await loadData();
    } else {
      setErrorMsg(data.error || 'Failed to create custom role.');
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0E192D] via-[#0B1322] to-[#080D18] p-6 sm:p-8 shadow-2xl">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-brand-orange/15 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-brand-orange/15 px-3.5 py-1 text-xs font-heading font-bold text-brand-orange">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Super Admin Security &amp; RBAC Center</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Team &amp; Access Management
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Create individual employee login accounts, generate temporary passwords or secure
              invitations, configure module-by-module permissions, revoke sessions, and audit staff
              login activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="qm-orange-pill inline-flex items-center gap-2 rounded-full px-6 py-3 font-heading text-xs sm:text-sm font-extrabold text-white transition-transform hover:scale-[1.02]"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Employee Account</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom-roles')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-heading text-xs sm:text-sm font-bold text-white hover:border-brand-orange hover:bg-white/10 transition-all"
            >
              <Sliders className="h-4 w-4 text-brand-orange" />
              <span>Custom Roles ({db.customRoles?.length || 0})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="qm-dark-card rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/60">Staff &amp; Admin Accounts</p>
            <p className="mt-1 font-heading text-2xl font-extrabold text-white">
              {staffAccounts.length}
            </p>
          </div>
          <span className="rounded-xl bg-brand-orange/15 p-3 text-brand-orange">
            <ShieldCheck className="h-6 w-6" />
          </span>
        </div>

        <div className="qm-dark-card rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/60">Active Staff Logins</p>
            <p className="mt-1 font-heading text-2xl font-extrabold text-emerald-400">
              {staffAccounts.filter((u) => u.isActive).length}
            </p>
          </div>
          <span className="rounded-xl bg-emerald-500/15 p-3 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </span>
        </div>

        <div className="qm-dark-card rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/60">Password Hashing</p>
            <p className="mt-1 font-heading text-lg font-extrabold text-white">
              scrypt + 16B Salt
            </p>
            <p className="text-[11px] text-emerald-400">Zero Plain-Text Storage</p>
          </div>
          <span className="rounded-xl bg-brand-orange/15 p-3 text-brand-orange">
            <Lock className="h-6 w-6" />
          </span>
        </div>

        <div className="qm-dark-card rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/60">MFA Enabled Accounts</p>
            <p className="mt-1 font-heading text-2xl font-extrabold text-white">
              {staffAccounts.filter((u) => u.mfaEnabled).length} / {staffAccounts.length}
            </p>
          </div>
          <span className="rounded-xl bg-sky-500/15 p-3 text-sky-400">
            <KeyRound className="h-6 w-6" />
          </span>
        </div>
      </div>

      {/* Feedback & Issued Temporary Password Banner */}
      {feedback && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-5 py-3.5 text-xs sm:text-sm font-semibold text-emerald-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs text-white/60 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/15 px-5 py-3.5 text-xs sm:text-sm font-semibold text-rose-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-xs text-white/60 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {issuedCredential && (
        <div className="rounded-2xl border-2 border-brand-orange bg-[#101C33] p-5 shadow-orange-glow space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-heading font-extrabold uppercase tracking-wider text-brand-orange">
              <Sparkles className="h-4 w-4" />
              <span>Temporary Credentials Issued (One-Time Display)</span>
            </span>
            <button
              type="button"
              onClick={() => setIssuedCredential(null)}
              className="text-xs text-white/60 hover:text-white"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-white/80">
            Share this temporary password or invitation link securely with{' '}
            <strong className="text-white">{issuedCredential.employeeName}</strong> (
            {issuedCredential.email}). They will be required to change their password upon first
            login.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-white/15 bg-[#070C16] px-4 py-2.5 font-mono text-sm font-bold text-brand-orange">
              Temp Password: {issuedCredential.temporaryPassword}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(issuedCredential.temporaryPassword);
                setCopiedSecret(true);
                setTimeout(() => setCopiedSecret(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-white/15"
            >
              {copiedSecret ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copiedSecret ? 'Copied!' : 'Copy Password'}</span>
            </button>
          </div>
          {issuedCredential.invitationLink && (
            <p className="text-[11px] font-mono text-white/60 break-all">
              Invite URL: {issuedCredential.invitationLink}
            </p>
          )}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'accounts', label: 'Employee & Admin Accounts', icon: ShieldCheck },
          { id: 'permissions', label: 'Granular Module Permissions', icon: Sliders },
          { id: 'custom-roles', label: 'Initial & Custom Roles', icon: KeyRound },
          { id: 'login-activity', label: 'Employee Login Activity & Audit', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-heading text-xs font-extrabold transition-all',
                active
                  ? 'qm-orange-pill text-white'
                  : 'bg-[#0C1526] text-white/70 border border-white/10 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EMPLOYEE & ADMIN ACCOUNTS LIST */}
      {activeTab === 'accounts' && (
        <div className="rounded-3xl border border-white/10 bg-[#0B1322] overflow-hidden shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-white">
                Individual Employee &amp; Administrator Accounts ({staffAccounts.length})
              </h2>
              <p className="text-xs text-white/60">
                Protected Super Admin owner account cannot be modified or deactivated by ordinary
                employees.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="qm-orange-pill inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold text-white"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-[#070C16] text-[11px] font-heading font-bold uppercase tracking-wider text-white/55">
                <tr>
                  <th className="py-3.5 px-5">Employee &amp; Login</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Security &amp; MFA</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-5 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {staffAccounts.map((user) => {
                  const isOwner = Boolean(user.isProtectedOwner || user.id === 'usr_owner_1');
                  const statusLabel = user.accountStatus || (user.isActive ? 'ACTIVE' : 'DEACTIVATED');
                  return (
                    <tr key={user.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-heading text-xs font-extrabold text-white',
                              isOwner
                                ? 'bg-gradient-to-br from-brand-orange to-amber-600 shadow-md'
                                : 'bg-[#162642] border border-white/10'
                            )}
                          >
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading text-sm font-bold text-white">
                                {user.name}
                              </span>
                              {isOwner && (
                                <span className="rounded-full bg-brand-orange/25 border border-brand-orange/50 px-2 py-0.5 text-[10px] font-extrabold text-brand-orange">
                                  Protected Super Admin
                                </span>
                              )}
                            </div>
                            <p className="text-white/65">{user.email}</p>
                            <p className="text-[11px] font-mono text-white/45">
                              Username: {user.username || user.email.split('@')[0]} • {user.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-heading text-xs font-bold text-white">
                          {user.roleDisplayTitle || user.role}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold',
                            statusLabel === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                              : statusLabel === 'INVITED'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/35'
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              statusLabel === 'ACTIVE'
                                ? 'bg-emerald-400'
                                : statusLabel === 'INVITED'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                            )}
                          />
                          {statusLabel}
                        </span>
                      </td>

                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                            scrypt Hashed
                          </span>
                          {user.mfaEnabled && (
                            <span className="rounded bg-sky-500/20 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                              MFA Active
                            </span>
                          )}
                        </div>
                        {user.mustChangePassword && (
                          <p className="text-[10px] font-semibold text-amber-400">
                            Must change temp password on next login
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-4 text-white/70">
                        {user.lastLoginAt ? (
                          <div>
                            <p className="font-semibold text-white">
                              {new Date(user.lastLoginAt).toLocaleDateString('en-CA', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-[11px] text-white/50">
                              {user.loginCount || 1} total login(s)
                            </p>
                          </div>
                        ) : (
                          <span className="text-white/40">Never logged in</span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(user)}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-white hover:border-brand-orange"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-brand-orange" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSelectPermUser(user)}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-white hover:border-brand-orange"
                          >
                            <Sliders className="h-3.5 w-3.5 text-brand-orange" />
                            <span>Permissions</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleResetPassword(user)}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-white hover:border-brand-orange"
                          >
                            <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                            <span>Reset Password</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRevokeSessions(user)}
                            title="Revoke active sessions"
                            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-white/80 hover:border-rose-400 hover:text-rose-300"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Revoke</span>
                          </button>

                          {!isOwner && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleAccountStatus(
                                    user,
                                    user.isActive ? 'DEACTIVATED' : 'ACTIVE'
                                  )
                                }
                                className={cn(
                                  'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors',
                                  user.isActive
                                    ? 'border border-amber-500/35 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                                    : 'border border-emerald-500/35 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                                )}
                              >
                                {user.isActive ? (
                                  <>
                                    <XCircle className="h-3.5 w-3.5" />
                                    <span>Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Activate</span>
                                  </>
                                )}
                              </button>

                              {user.accountStatus !== 'REMOVED' && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleAccountStatus(user, 'REMOVED')}
                                  title="Remove access when employee leaves company"
                                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/35 bg-rose-500/15 px-2.5 py-1.5 text-[11px] font-bold text-rose-300 hover:bg-rose-500/25"
                                >
                                  <UserX className="h-3.5 w-3.5" />
                                  <span>Remove Access</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GRANULAR MODULE PERMISSION MATRIX */}
      {activeTab === 'permissions' && selectedPermUser && (
        <div className="rounded-3xl border border-white/10 bg-[#0B1322] p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-white">
                Granular Module Permissions Matrix
              </h2>
              <p className="text-xs text-white/65">
                Configure View, Create, Edit, Delete, Approve, and Manage permissions for each
                platform module.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedPermUser.id}
                onChange={(e) => {
                  const u = staffAccounts.find((item) => item.id === e.target.value);
                  if (u) handleSelectPermUser(u);
                }}
                className="rounded-xl border border-white/15 bg-[#070C16] px-4 py-2.5 text-xs font-bold text-white"
              >
                {staffAccounts.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.roleDisplayTitle || u.role})
                  </option>
                ))}
              </select>

              {!selectedPermUser.isProtectedOwner && (
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="qm-orange-pill rounded-xl px-5 py-2.5 font-heading text-xs font-extrabold text-white"
                >
                  Save Employee Permissions
                </button>
              )}
            </div>
          </div>

          {selectedPermUser.isProtectedOwner && (
            <div className="rounded-2xl border border-brand-orange/40 bg-brand-orange/10 px-4 py-3 text-xs text-brand-orange font-semibold">
              Protected Super Admin Rule: The Owner account permanently holds full View, Create,
              Edit, Delete, Approve, and Manage permissions across all modules.
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-[#070C16] text-[11px] font-heading font-bold uppercase tracking-wider text-white/60">
                <tr>
                  <th className="py-3 px-4">Platform Module</th>
                  {ACTION_KEYS.map((act) => (
                    <th key={act} className="py-3 px-3 text-center capitalize">
                      {act}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {MODULE_LABELS.map((mod) => {
                  const modPerms = workingPermissions[mod.key] || {
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                    approve: false,
                    manage: false,
                  };
                  return (
                    <tr key={mod.key} className="hover:bg-white/[0.03]">
                      <td className="py-3.5 px-4">
                        <p className="font-heading font-bold text-white">{mod.label}</p>
                        <p className="text-[11px] text-white/50">{mod.description}</p>
                      </td>
                      {ACTION_KEYS.map((act) => {
                        const checked = Boolean(modPerms[act]);
                        return (
                          <td key={act} className="py-3.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={Boolean(selectedPermUser.isProtectedOwner)}
                              onChange={() => handleTogglePermissionCell(mod.key, act)}
                              className="h-4 w-4 rounded accent-brand-orange cursor-pointer disabled:opacity-60"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INITIAL & CUSTOM ROLES */}
      {activeTab === 'custom-roles' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#0B1322] p-6 space-y-4">
              <h2 className="font-heading text-lg font-extrabold text-white">
                5 Built-In System Roles + Custom Roles
              </h2>
              <div className="space-y-3">
                {INITIAL_ROLES.map((r, idx) => (
                  <div
                    key={r.role}
                    className="rounded-2xl border border-white/10 bg-[#070C16] p-4 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-brand-orange/20 px-2 py-0.5 text-[10px] font-extrabold text-brand-orange">
                          Role 0{idx + 1}
                        </span>
                        <h3 className="font-heading text-sm font-extrabold text-white">
                          {r.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-white/65 leading-relaxed">{r.summary}</p>
                    </div>
                  </div>
                ))}

                {(db.customRoles || []).map((cr) => (
                  <div
                    key={cr.id}
                    className="rounded-2xl border border-brand-orange/40 bg-brand-orange/10 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-brand-orange px-2 py-0.5 text-[10px] font-extrabold text-white">
                        Custom Role
                      </span>
                      <span className="text-[11px] text-white/60">Base: {cr.baseRole}</span>
                    </div>
                    <h3 className="mt-1 font-heading text-sm font-extrabold text-white">
                      {cr.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/75">{cr.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={handleCreateCustomRole}
              className="rounded-3xl border border-white/10 bg-[#0B1322] p-6 space-y-4"
            >
              <h3 className="font-heading text-lg font-extrabold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-brand-orange" />
                <span>Create Custom Role</span>
              </h3>
              <p className="text-xs text-white/65">
                Define a custom role template that you can assign to any employee.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                  Custom Role Name *
                </label>
                <input
                  type="text"
                  required
                  value={customRoleName}
                  onChange={(e) => setCustomRoleName(e.target.value)}
                  placeholder="e.g., Operations Supervisor, Fleet Lead"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#070C16] px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                  Base Permission Template
                </label>
                <select
                  value={customRoleBase}
                  onChange={(e) => {
                    const role = e.target.value as UserRole;
                    setCustomRoleBase(role);
                    setCustomRolePerms(buildDefaultModulePermissions(role));
                  }}
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#070C16] px-4 py-2.5 text-xs text-white"
                >
                  <option value="ADMIN">Administrator / Manager</option>
                  <option value="COORDINATOR">Dispatcher</option>
                  <option value="MARKETING_MANAGER">Marketing Manager</option>
                  <option value="CREW_MEMBER">Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                  Role Description
                </label>
                <textarea
                  rows={2}
                  value={customRoleDesc}
                  onChange={(e) => setCustomRoleDesc(e.target.value)}
                  placeholder="Describe which sections and actions this custom role can access..."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#070C16] px-4 py-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="qm-orange-pill w-full rounded-xl py-3 font-heading text-xs font-extrabold text-white"
              >
                Create Custom Role Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: EMPLOYEE LOGIN ACTIVITY & SECURITY AUDIT */}
      {activeTab === 'login-activity' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#0B1322] p-6 space-y-4">
            <h2 className="font-heading text-lg font-extrabold text-white">
              Employee Login History
            </h2>
            <div className="space-y-3">
              {staffAccounts.map((u) => (
                <div
                  key={u.id}
                  className="rounded-2xl border border-white/10 bg-[#070C16] p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-bold text-white">
                      {u.name} ({u.roleDisplayTitle || u.role})
                    </span>
                    <span className="text-[11px] font-mono text-brand-orange">
                      Session v{u.sessionVersion || 1}
                    </span>
                  </div>
                  {(u.loginHistory || []).length > 0 ? (
                    <div className="space-y-1.5">
                      {(u.loginHistory || []).slice(0, 3).map((ev, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[11px] text-white/65 border-t border-white/5 pt-1.5"
                        >
                          <span>
                            {ev.method} • {ev.deviceSummary}
                          </span>
                          <span className="font-mono text-white/45">
                            {new Date(ev.timestamp).toLocaleString('en-CA')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/40">No login events recorded yet.</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0B1322] p-6 space-y-4">
            <h2 className="font-heading text-lg font-extrabold text-white">
              Account &amp; Security Audit Trail
            </h2>
            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {db.activityLogs
                .filter(
                  (log) =>
                    log.entityType === 'USER_ACCOUNT' ||
                    log.entityType === 'AUTH' ||
                    log.entityType === 'CUSTOM_ROLE'
                )
                .map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-white/10 bg-[#070C16] p-3.5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-brand-orange">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-white/45">
                        {new Date(log.createdAt).toLocaleString('en-CA')}
                      </span>
                    </div>
                    <p className="text-white/85">{log.summary}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT EMPLOYEE ACCOUNT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#0B1322] p-6 sm:p-7 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-heading text-lg font-extrabold">
                {editingUser ? `Edit Account: ${editingUser.name}` : 'Create Employee Account'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveEmployeeAccount} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-white/80">
                    Employee Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Jordan Taylor"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#070C16] px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-white/80">
                    Email Login *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#070C16] px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-white/80">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="jordan.taylor"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#070C16] px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-white/80">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#070C16] px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-white/80">
                    Assigned System Role *
                  </label>
                  <select
                    value={formRole}
                    disabled={Boolean(editingUser?.isProtectedOwner)}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#070C16] px-3.5 py-2.5 text-white"
                  >
                    {INITIAL_ROLES.map((r) => (
                      <option key={r.role} value={r.role}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-white/80">
                    Optional Custom Role Override
                  </label>
                  <select
                    value={formCustomRoleId}
                    onChange={(e) => setFormCustomRoleId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-[#070C16] px-3.5 py-2.5 text-white"
                  >
                    <option value="">Use Standard Role Permissions</option>
                    {(db.customRoles || []).map((cr) => (
                      <option key={cr.id} value={cr.id}>
                        {cr.name}
                      </option>
                    ))}
                  </select>
                </div>

                {!editingUser && (
                  <div className="sm:col-span-2">
                    <label className="block font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Credential Provisioning Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setFormOnboardingMode('temp-password')}
                        className={cn(
                          'rounded-xl border p-3 text-left transition-all',
                          formOnboardingMode === 'temp-password'
                            ? 'border-brand-orange bg-brand-orange/20 text-white'
                            : 'border-white/15 bg-[#070C16] text-white/65'
                        )}
                      >
                        <p className="font-heading font-bold">Generate Temporary Password</p>
                        <p className="text-[11px] opacity-80 mt-0.5">
                          Requires password change on first login
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormOnboardingMode('invite')}
                        className={cn(
                          'rounded-xl border p-3 text-left transition-all',
                          formOnboardingMode === 'invite'
                            ? 'border-brand-orange bg-brand-orange/20 text-white'
                            : 'border-white/15 bg-[#070C16] text-white/65'
                        )}
                      >
                        <p className="font-heading font-bold">Send Secure Invitation</p>
                        <p className="text-[11px] opacity-80 mt-0.5">
                          Generates secure invite token link
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2.5 cursor-pointer rounded-xl border border-white/10 bg-[#070C16] p-3">
                    <input
                      type="checkbox"
                      checked={formMfa}
                      onChange={(e) => setFormMfa(e.target.checked)}
                      className="h-4 w-4 rounded accent-brand-orange"
                    />
                    <span>Enable Multi-Factor Authentication (MFA) for this account</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/15 px-4 py-2.5 font-bold text-white/75"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="qm-orange-pill rounded-xl px-6 py-2.5 font-heading font-extrabold text-white"
                >
                  {editingUser ? 'Save Account Changes' : 'Create Employee Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

