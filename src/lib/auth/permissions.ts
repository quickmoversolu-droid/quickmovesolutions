import type { UserRole } from '@/lib/db/platform-store';

export const SESSION_COOKIE_NAME = 'qm_session_v1';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  customerId?: string;
  employeeId?: string;
  issuedAt: number;
  expiresAt: number;
}

export const ROLE_PERMISSION_MATRIX: Record<
  UserRole,
  {
    label: string;
    description: string;
    canAccessAdmin: boolean;
    canAccessCrm: boolean;
    canManageQuotes: boolean;
    canManageBookings: boolean;
    canManageFleetAndEmployees: boolean;
    canViewFinances: boolean;
    canAccessMarketing: boolean;
    canApproveMarketing: boolean;
    canManageSettings: boolean;
    canAccessCustomerPortal: boolean;
  }
> = {
  OWNER: {
    label: 'Owner (Full Executive Access)',
    description:
      'Full access to all modules, settings, employees, finances, and marketing approvals.',
    canAccessAdmin: true,
    canAccessCrm: true,
    canManageQuotes: true,
    canManageBookings: true,
    canManageFleetAndEmployees: true,
    canViewFinances: true,
    canAccessMarketing: true,
    canApproveMarketing: true,
    canManageSettings: true,
    canAccessCustomerPortal: true,
  },
  ADMIN: {
    label: 'Operations Administrator',
    description: 'Operational and CRM management access across leads, jobs, quotes, and fleet.',
    canAccessAdmin: true,
    canAccessCrm: true,
    canManageQuotes: true,
    canManageBookings: true,
    canManageFleetAndEmployees: true,
    canViewFinances: true,
    canAccessMarketing: true,
    canApproveMarketing: true,
    canManageSettings: true,
    canAccessCustomerPortal: true,
  },
  COORDINATOR: {
    label: 'Dispatch & Quote Coordinator',
    description: 'Leads, quotes, bookings, customers, and scheduling access.',
    canAccessAdmin: true,
    canAccessCrm: true,
    canManageQuotes: true,
    canManageBookings: true,
    canManageFleetAndEmployees: false,
    canViewFinances: false,
    canAccessMarketing: false,
    canApproveMarketing: false,
    canManageSettings: false,
    canAccessCustomerPortal: false,
  },
  MARKETING_MANAGER: {
    label: 'Marketing Manager',
    description:
      'Marketing Studio, calendar, content creation, and draft scheduling access.',
    canAccessAdmin: true,
    canAccessCrm: false,
    canManageQuotes: false,
    canManageBookings: false,
    canManageFleetAndEmployees: false,
    canViewFinances: false,
    canAccessMarketing: true,
    canApproveMarketing: true,
    canManageSettings: false,
    canAccessCustomerPortal: false,
  },
  CREW_MEMBER: {
    label: 'Field Crew Member',
    description: 'Assigned job schedule, job notes, and operational checklist view.',
    canAccessAdmin: true,
    canAccessCrm: false,
    canManageQuotes: false,
    canManageBookings: false,
    canManageFleetAndEmployees: false,
    canViewFinances: false,
    canAccessMarketing: false,
    canApproveMarketing: false,
    canManageSettings: false,
    canAccessCustomerPortal: false,
  },
  CUSTOMER: {
    label: 'Customer Portal User',
    description: 'Customer portal access to own quotes, bookings, and job updates only.',
    canAccessAdmin: false,
    canAccessCrm: false,
    canManageQuotes: false,
    canManageBookings: false,
    canManageFleetAndEmployees: false,
    canViewFinances: false,
    canAccessMarketing: false,
    canApproveMarketing: false,
    canManageSettings: false,
    canAccessCustomerPortal: true,
  },
};

export type PermissionModuleKey =
  | 'dashboard'
  | 'leads_crm'
  | 'jobs_bookings'
  | 'quotations'
  | 'customers'
  | 'team_vehicles'
  | 'team_access'
  | 'reports_analytics'
  | 'ai_marketing'
  | 'settings_security'
  | 'finances';

export interface ModulePermissionActions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  manage: boolean;
}

export type UserPermissionMatrix = Record<PermissionModuleKey, ModulePermissionActions>;

export function buildDefaultModulePermissions(role: UserRole): UserPermissionMatrix {
  const full: ModulePermissionActions = {
    view: true,
    create: true,
    edit: true,
    delete: true,
    approve: true,
    manage: true,
  };
  const manageNoApprove: ModulePermissionActions = {
    view: true,
    create: true,
    edit: true,
    delete: false,
    approve: false,
    manage: true,
  };
  const viewAndEdit: ModulePermissionActions = {
    view: true,
    create: true,
    edit: true,
    delete: false,
    approve: false,
    manage: false,
  };
  const viewOnly: ModulePermissionActions = {
    view: true,
    create: false,
    edit: false,
    delete: false,
    approve: false,
    manage: false,
  };
  const none: ModulePermissionActions = {
    view: false,
    create: false,
    edit: false,
    delete: false,
    approve: false,
    manage: false,
  };

  if (role === 'OWNER') {
    return {
      dashboard: { ...full },
      leads_crm: { ...full },
      jobs_bookings: { ...full },
      quotations: { ...full },
      customers: { ...full },
      team_vehicles: { ...full },
      team_access: { ...full },
      reports_analytics: { ...full },
      ai_marketing: { ...full },
      settings_security: { ...full },
      finances: { ...full },
    };
  }

  if (role === 'ADMIN') {
    return {
      dashboard: { ...manageNoApprove },
      leads_crm: { ...manageNoApprove },
      jobs_bookings: { ...manageNoApprove },
      quotations: { ...manageNoApprove },
      customers: { ...manageNoApprove },
      team_vehicles: { ...manageNoApprove },
      team_access: { ...viewOnly },
      reports_analytics: { ...viewOnly },
      ai_marketing: { ...viewAndEdit },
      settings_security: { ...none },
      finances: { ...none },
    };
  }

  if (role === 'COORDINATOR') {
    return {
      dashboard: { ...viewOnly },
      leads_crm: { ...viewAndEdit },
      jobs_bookings: { ...manageNoApprove },
      quotations: { ...viewAndEdit },
      customers: { ...viewAndEdit },
      team_vehicles: { ...viewAndEdit },
      team_access: { ...none },
      reports_analytics: { ...viewOnly },
      ai_marketing: { ...none },
      settings_security: { ...none },
      finances: { ...none },
    };
  }

  if (role === 'MARKETING_MANAGER') {
    return {
      dashboard: { ...viewOnly },
      leads_crm: { ...none },
      jobs_bookings: { ...none },
      quotations: { ...none },
      customers: { ...none },
      team_vehicles: { ...none },
      team_access: { ...none },
      reports_analytics: { ...viewOnly },
      ai_marketing: { ...manageNoApprove },
      settings_security: { ...none },
      finances: { ...none },
    };
  }

  // CREW_MEMBER / Employee
  return {
    dashboard: { ...viewOnly },
    leads_crm: { ...none },
    jobs_bookings: { ...viewAndEdit },
    quotations: { ...none },
    customers: { ...viewOnly },
    team_vehicles: { ...viewOnly },
    team_access: { ...none },
    reports_analytics: { ...none },
    ai_marketing: { ...none },
    settings_security: { ...none },
    finances: { ...none },
  };
}

