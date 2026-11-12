import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { savePrivateJobPhoto } from '@/lib/storage/private-storage';
import { UnifiedQuoteSubmissionInput } from '@/lib/validations/quote-schemas';

export type UserRole =
  | 'OWNER'
  | 'ADMIN'
  | 'COORDINATOR'
  | 'MARKETING_MANAGER'
  | 'CREW_MEMBER'
  | 'CUSTOMER';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUOTE_PENDING'
  | 'QUOTE_SENT'
  | 'FOLLOW_UP_REQUIRED'
  | 'ACCEPTED'
  | 'BOOKED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'LOST';

export type JobLifecycleStage =
  | 'NEW_LEAD'
  | 'CONTACTED'
  | 'QUOTE_PREPARATION'
  | 'QUOTE_SENT'
  | 'CUSTOMER_ACCEPTED'
  | 'BOOKING_CONFIRMED'
  | 'TEAM_ASSIGNED'
  | 'JOB_IN_PROGRESS'
  | 'JOB_COMPLETED'
  | 'FOLLOW_UP';

export type QuoteStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'REVISED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED';

export type BookingStatus =
  | 'TENTATIVE'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED';

export type MarketingPostStatus =
  | 'IDEA'
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'FAILED'
  | 'ARCHIVED';

import {
  type PermissionModuleKey,
  type ModulePermissionActions,
  type UserPermissionMatrix,
  buildDefaultModulePermissions,
} from '@/lib/auth/permissions';

export {
  type PermissionModuleKey,
  type ModulePermissionActions,
  type UserPermissionMatrix,
  buildDefaultModulePermissions,
};

export interface CustomRoleRecord {
  id: string;
  name: string;
  description: string;
  baseRole: UserRole;
  modulePermissions: UserPermissionMatrix;
  createdAt: string;
}

export interface UserLoginEvent {
  timestamp: string;
  method: string;
  deviceSummary: string;
}

export interface UserRecord {
  id: string;
  username?: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  roleDisplayTitle?: string;
  customRoleId?: string;
  isProtectedOwner?: boolean;
  isActive: boolean;
  accountStatus?: 'ACTIVE' | 'INVITED' | 'DEACTIVATED' | 'REMOVED';
  customerId?: string;
  employeeId?: string;
  accessCode: string; // Demo/staff quick login passcode
  passwordHash?: string; // Cryptographic scrypt hash — never plain text
  mustChangePassword?: boolean;
  invitationToken?: string;
  invitationSentAt?: string;
  mfaEnabled?: boolean;
  sessionVersion?: number;
  lastSessionRevokedAt?: string;
  loginCount?: number;
  loginHistory?: UserLoginEvent[];
  modulePermissions?: UserPermissionMatrix;
  lastLoginAt?: string;
  createdAt: string;
}

export interface CustomerRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredContact: 'phone' | 'email' | 'text';
  address: string;
  city: string;
  postalCode: string;
  notes: string;
  portalPasscode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobPhotoRecord {
  id: string;
  jobRequestId: string;
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  caption: string;
  previewDataUrl?: string;
  aiDetectedCategories: string[];
  createdAt: string;
}

export interface JobChecklistItemRecord {
  id: string;
  label: string;
  isCompleted: boolean;
  completedAt?: string;
  sortOrder: number;
}

export interface JobChecklistRecord {
  id: string;
  jobRequestId: string;
  title: string;
  serviceCategory: 'MOVING' | 'JUNK_REMOVAL' | 'DELIVERY';
  items: JobChecklistItemRecord[];
  createdAt: string;
}

export interface JobRequestRecord {
  id: string;
  leadId: string;
  customerId: string;
  serviceType: string;
  serviceCategory: 'MOVING' | 'JUNK_REMOVAL' | 'DELIVERY';
  lifecycleStage: JobLifecycleStage;
  pickupAddress: string;
  pickupCity: string;
  pickupPostalCode: string;
  pickupAccessDetails: string;
  destinationAddress?: string;
  destinationCity?: string;
  destinationPostalCode?: string;
  destinationAccessDetails?: string;
  preferredDate: string;
  isFlexibleDate: boolean;
  preferredTimeWindow: string;
  confirmedDate?: string;
  propertySize?: string;
  inventoryDetails: Record<string, unknown>;
  junkCategories: string[];
  junkVolumeEstimate?: string;
  specialRequirements: string;
  aiSummary: string;
  aiVolumeSuggestion?: string;
  requiresManualInspection: boolean;
  assignedTeamId?: string;
  assignedVehicleId?: string;
  completionNotes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadRecord {
  id: string;
  referenceCode: string;
  customerId: string;
  jobRequestId: string;
  serviceType: string;
  status: LeadStatus;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  assignedEmployeeId?: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteLineItemRecord {
  id: string;
  category:
    | 'LABOUR'
    | 'MOVING_SERVICE'
    | 'PACKING_UNPACKING'
    | 'MATERIALS'
    | 'DELIVERY'
    | 'JUNK_REMOVAL'
    | 'DISPOSAL_HANDLING'
    | 'STAIRS_ACCESS'
    | 'TRAVEL_DISTANCE'
    | 'SPECIALTY_ITEM'
    | 'CUSTOM';
  description: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  sortOrder: number;
}

export interface QuoteRecord {
  id: string;
  quoteNumber: string;
  version: number;
  leadId: string;
  jobRequestId: string;
  customerId: string;
  serviceType: string;
  serviceCategory: 'MOVING' | 'JUNK_REMOVAL' | 'DELIVERY';
  status: QuoteStatus;
  proposedDate: string;
  proposedWindow: string;
  scopeSummary: string;
  lineItems: QuoteLineItemRecord[];
  subtotalCents: number;
  discountCents: number;
  taxRatePercent: number;
  taxCents: number;
  totalCents: number;
  depositCents: number;
  validityDays: number;
  validUntil: string;
  termsAndNotes: string;
  customerResponse?: string;
  respondedAt?: string;
  signatureName?: string;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  jobRequestId: string;
  customerId: string;
  quoteId?: string;
  serviceType: string;
  serviceCategory: 'MOVING' | 'JUNK_REMOVAL' | 'DELIVERY';
  status: BookingStatus;
  scheduledDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  endTime: string; // HH:MM (24h)
  arrivalWindow: string;
  assignedTeamId?: string;
  assignedVehicleId?: string;
  crewMemberIds: string[];
  pickupAddress: string;
  pickupCity: string;
  destinationCity?: string;
  dispatchNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: 'OWNER' | 'COORDINATOR' | 'TEAM_LEAD' | 'MOVER' | 'JUNK_SPECIALIST' | 'DRIVER';
  skills: string[];
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  availabilityNote: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamRecord {
  id: string;
  name: string;
  code: string;
  leadMemberId?: string;
  memberIds: string[];
  specialty: 'MOVING_AND_DELIVERY' | 'JUNK_REMOVAL' | 'ALL_SERVICES';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface VehicleRecord {
  id: string;
  name: string;
  vehicleType: '26FT_BOX_TRUCK' | '20FT_MOVING_TRUCK' | '16FT_JUNK_DUMP_TRUCK' | 'CARGO_SPRINTER';
  capacitySummary: string;
  licensePlate: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  maintenanceNote: string;
  createdAt: string;
}

export interface ReviewRequestRecord {
  id: string;
  customerId: string;
  jobRequestId: string;
  status: 'NOT_REQUESTED' | 'SENT' | 'REMINDED' | 'COMPLETED';
  sentAt?: string;
  completedAt?: string;
  reviewLinkUrl: string;
  notes: string;
  createdAt: string;
}

export interface TestimonialRecord {
  id: string;
  customerName: string;
  serviceType: string;
  city: string;
  quoteText: string;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface MarketingCampaignRecord {
  id: string;
  name: string;
  theme: string;
  targetCity: string;
  serviceFocus: string;
  status: 'ACTIVE' | 'PLANNED' | 'COMPLETED';
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface MarketingPostRecord {
  id: string;
  campaignId?: string;
  title: string;
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'BOTH' | 'GOOGLE_BUSINESS';
  contentPillar: string;
  serviceFocus: string;
  targetCity: string;
  tone: string;
  goal: string;
  hook: string;
  primaryCaption: string;
  shortCaption: string;
  hashtags: string[];
  ctaText: string;
  visualConcept: string;
  imagePrompt: string;
  overlayText: string;
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9';
  imageUrl?: string;
  status: MarketingPostStatus;
  scheduledFor?: string;
  publishedAt?: string;
  externalPostId?: string;
  publishError?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccountRecord {
  id: string;
  platform: 'FACEBOOK' | 'INSTAGRAM';
  accountName: string;
  accountUrl: string;
  externalPageId?: string;
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED' | 'RECONNECT_REQUIRED';
  tokenExpiresAt?: string;
  scopesGranted: string[];
  lastVerifiedAt?: string;
  updatedAt: string;
}

export interface NotificationRecord {
  id: string;
  eventType: string;
  channel: 'EMAIL' | 'SMS' | 'IN_APP';
  recipientType: 'CUSTOMER' | 'ADMIN';
  recipientAddress: string;
  subject: string;
  bodyPreview: string;
  status: 'SENT' | 'PENDING' | 'FAILED';
  relatedLeadId?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface ActivityLogRecord {
  id: string;
  actorRole: string;
  entityType: string;
  entityId: string;
  action: string;
  summary: string;
  createdAt: string;
}

export interface FinishedJobRecord {
  id: string;
  title: string;
  serviceType: 'RESIDENTIAL_MOVING' | 'COMMERCIAL_MOVING' | 'JUNK_REMOVAL' | 'DELIVERY';
  location: string;
  completionDate: string;
  description: string;
  beforePhotoUrl?: string;
  afterPhotoUrl: string;
  featuredOnHome: boolean;
  createdAt: string;
}

export interface SystemSettingsRecord {
  companyName: string;
  tagline: string;
  phoneDisplay: string;
  email: string;
  primaryLocation: string;
  timezone: string;
  albertaGstPercent: number;
  defaultQuoteValidityDays: number;
  requireOwnerMarketingApproval: boolean;
  homepageHeroImageUrl?: string;
  aiMarketingHeroImageUrl?: string;
  updatedAt: string;
}

export interface PlatformDatabaseState {
  users: UserRecord[];
  customRoles?: CustomRoleRecord[];
  customers: CustomerRecord[];
  leads: LeadRecord[];
  jobRequests: JobRequestRecord[];
  jobPhotos: JobPhotoRecord[];
  jobChecklists: JobChecklistRecord[];
  quotes: QuoteRecord[];
  bookings: BookingRecord[];
  employees: EmployeeRecord[];
  teams: TeamRecord[];
  vehicles: VehicleRecord[];
  reviewRequests: ReviewRequestRecord[];
  testimonials: TestimonialRecord[];
  marketingCampaigns: MarketingCampaignRecord[];
  marketingPosts: MarketingPostRecord[];
  socialAccounts: SocialAccountRecord[];
  notifications: NotificationRecord[];
  activityLogs: ActivityLogRecord[];
  settings: SystemSettingsRecord;
  finishedJobs: FinishedJobRecord[];
}

/**
 * Cryptographic Password Hashing (scrypt + random 16-byte salt).
 * Never stores plain-text passwords (Section 10 Password & Security Rule).
 */
export function hashPasswordScrypt(plainPassword: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plainPassword, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPasswordScrypt(plainPassword: string, storedHash?: string): boolean {
  if (!storedHash || !storedHash.startsWith('scrypt$')) return false;
  const parts = storedHash.split('$');
  if (parts.length !== 3) return false;
  const [, salt, expectedHex] = parts;
  try {
    const derived = crypto.scryptSync(plainPassword, salt, 64);
    const expected = Buffer.from(expectedHex, 'hex');
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(8);
  let code = 'QM!';
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

const DEFAULT_MOVING_CHECKLIST = [
  'Confirm customer contact & preferred date',
  'Confirm inventory & property size',
  'Confirm stairs, elevator & access conditions',
  'Confirm truck parking clearance',
  'Confirm packing & unpacking requirements',
  'Assign moving team',
  'Assign moving vehicle',
  'Complete relocation job',
  'Record completion & customer sign-off',
];

const DEFAULT_JUNK_CHECKLIST = [
  'Review customer-uploaded photos',
  'Confirm accepted non-hazardous items',
  'Confirm preliminary volume category',
  'Confirm indoor/outdoor & stairs access',
  'Assign collection team & truck',
  'Complete junk collection & sweep',
  'Record completion',
];

const DEFAULT_DELIVERY_CHECKLIST = [
  'Confirm pickup store/seller & item details',
  'Confirm drop-off access & doorway clearance',
  'Assign delivery team & vehicle',
  'Inspect & blanket-wrap items at pickup',
  'Complete room-of-choice delivery & record completion',
];

/**
 * Server-side quote financial calculator (Part 9.2 of KNOWLEDGE.md).
 * Never trusts client-computed totals.
 */
export function calculateServerQuoteTotals(
  lineItems: Omit<QuoteLineItemRecord, 'totalCents'>[],
  discountCents = 0,
  taxRatePercent = 5.0
): {
  computedItems: QuoteLineItemRecord[];
  subtotalCents: number;
  discountCents: number;
  taxRatePercent: number;
  taxCents: number;
  totalCents: number;
} {
  const computedItems: QuoteLineItemRecord[] = lineItems.map((item, idx) => {
    const qty = Math.max(0, Number(item.quantity) || 0);
    const unit = Math.max(0, Math.round(Number(item.unitPriceCents) || 0));
    return {
      ...item,
      quantity: qty,
      unitPriceCents: unit,
      totalCents: Math.round(qty * unit),
      sortOrder: item.sortOrder || idx + 1,
    };
  });

  const subtotalCents = computedItems.reduce((sum, item) => sum + item.totalCents, 0);
  const safeDiscount = Math.min(subtotalCents, Math.max(0, Math.round(discountCents)));
  const taxableCents = Math.max(0, subtotalCents - safeDiscount);
  const taxCents = Math.round(taxableCents * (taxRatePercent / 100));
  const totalCents = taxableCents + taxCents;

  return {
    computedItems,
    subtotalCents,
    discountCents: safeDiscount,
    taxRatePercent,
    taxCents,
    totalCents,
  };
}

/**
 * Server-side double-booking conflict detector (Part 9.4 of KNOWLEDGE.md).
 */
export function detectBookingConflicts(
  bookings: BookingRecord[],
  candidate: {
    excludeBookingId?: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    assignedTeamId?: string;
    assignedVehicleId?: string;
    crewMemberIds?: string[];
  }
): { hasConflict: boolean; conflicts: string[] } {
  const conflicts: string[] = [];
  const toMinutes = (hhmm: string): number => {
    const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10) || 0);
    return h * 60 + m;
  };

  const candStart = toMinutes(candidate.startTime);
  const candEnd = toMinutes(candidate.endTime);

  for (const existing of bookings) {
    if (existing.id === candidate.excludeBookingId) continue;
    if (existing.status === 'CANCELLED') continue;
    if (existing.scheduledDate !== candidate.scheduledDate) continue;

    const exStart = toMinutes(existing.startTime);
    const exEnd = toMinutes(existing.endTime);
    const overlaps = candStart < exEnd && candEnd > exStart;

    if (!overlaps) continue;

    if (
      candidate.assignedTeamId &&
      existing.assignedTeamId &&
      candidate.assignedTeamId === existing.assignedTeamId
    ) {
      conflicts.push(
        `Team conflict: Assigned team is already scheduled on Booking ${existing.bookingNumber} (${existing.startTime}–${existing.endTime}).`
      );
    }

    if (
      candidate.assignedVehicleId &&
      existing.assignedVehicleId &&
      candidate.assignedVehicleId === existing.assignedVehicleId
    ) {
      conflicts.push(
        `Vehicle conflict: Assigned truck is already scheduled on Booking ${existing.bookingNumber} (${existing.startTime}–${existing.endTime}).`
      );
    }

    if (candidate.crewMemberIds && candidate.crewMemberIds.length > 0) {
      const sharedCrew = candidate.crewMemberIds.filter((id) =>
        existing.crewMemberIds.includes(id)
      );
      if (sharedCrew.length > 0) {
        conflicts.push(
          `Crew conflict: ${sharedCrew.length} crew member(s) already assigned on Booking ${existing.bookingNumber} (${existing.startTime}–${existing.endTime}).`
        );
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
}

function createInitialSeedState(): PlatformDatabaseState {
  const now = '2026-11-01T08:00:00.000Z';

  const users: UserRecord[] = [
    {
      id: 'usr_owner_1',
      username: 'owner.superadmin',
      email: BUSINESS_INFO.email,
      name: 'QuickMove Owner',
      phone: BUSINESS_INFO.phoneDisplay,
      role: 'OWNER',
      roleDisplayTitle: 'Super Admin / Owner',
      isProtectedOwner: true,
      isActive: true,
      accountStatus: 'ACTIVE',
      accessCode: 'QM-OWNER-2026',
      passwordHash: hashPasswordScrypt('QM-OWNER-2026'),
      mustChangePassword: false,
      mfaEnabled: true,
      sessionVersion: 1,
      loginCount: 42,
      lastLoginAt: '2026-11-04T14:15:00.000Z',
      loginHistory: [
        {
          timestamp: '2026-11-04T14:15:00.000Z',
          method: 'Password + MFA Verified',
          deviceSummary: 'Chrome Desktop • Calgary, AB',
        },
        {
          timestamp: '2026-11-03T09:05:00.000Z',
          method: 'Password + MFA Verified',
          deviceSummary: 'iPhone Safari • Calgary, AB',
        },
      ],
      modulePermissions: buildDefaultModulePermissions('OWNER'),
      createdAt: now,
    },
    {
      id: 'usr_admin_1',
      username: 'devon.reid',
      email: 'quickmoversolu+admin@gmail.com',
      name: 'Devon Reid',
      phone: BUSINESS_INFO.phoneDisplay,
      role: 'ADMIN',
      roleDisplayTitle: 'Administrator / Manager',
      isProtectedOwner: false,
      isActive: true,
      accountStatus: 'ACTIVE',
      employeeId: 'emp_1',
      accessCode: 'QM-ADMIN-2026',
      passwordHash: hashPasswordScrypt('QM-ADMIN-2026'),
      mustChangePassword: false,
      mfaEnabled: true,
      sessionVersion: 1,
      loginCount: 28,
      lastLoginAt: '2026-11-04T11:30:00.000Z',
      loginHistory: [
        {
          timestamp: '2026-11-04T11:30:00.000Z',
          method: 'Password Login',
          deviceSummary: 'Windows Workstation • Calgary HQ',
        },
      ],
      modulePermissions: buildDefaultModulePermissions('ADMIN'),
      createdAt: now,
    },
    {
      id: 'usr_coord_1',
      username: 'sarah.chen',
      email: 'quickmoversolu+dispatch@gmail.com',
      name: 'Sarah Chen',
      phone: BUSINESS_INFO.phoneDisplay,
      role: 'COORDINATOR',
      roleDisplayTitle: 'Dispatcher',
      isProtectedOwner: false,
      isActive: true,
      accountStatus: 'ACTIVE',
      employeeId: 'emp_2',
      accessCode: 'QM-COORD-2026',
      passwordHash: hashPasswordScrypt('QM-COORD-2026'),
      mustChangePassword: false,
      mfaEnabled: false,
      sessionVersion: 1,
      loginCount: 35,
      lastLoginAt: '2026-11-04T08:00:00.000Z',
      loginHistory: [
        {
          timestamp: '2026-11-04T08:00:00.000Z',
          method: 'Password Login',
          deviceSummary: 'Dispatch Console • Calgary, AB',
        },
      ],
      modulePermissions: buildDefaultModulePermissions('COORDINATOR'),
      createdAt: now,
    },
    {
      id: 'usr_mkt_1',
      username: 'elena.vance',
      email: 'quickmoversolu+marketing@gmail.com',
      name: 'Elena Vance',
      phone: BUSINESS_INFO.phoneDisplay,
      role: 'MARKETING_MANAGER',
      roleDisplayTitle: 'Marketing Manager',
      isProtectedOwner: false,
      isActive: true,
      accountStatus: 'ACTIVE',
      accessCode: 'QM-MKT-2026',
      passwordHash: hashPasswordScrypt('QM-MKT-2026'),
      mustChangePassword: false,
      mfaEnabled: true,
      sessionVersion: 1,
      loginCount: 19,
      lastLoginAt: '2026-11-04T10:20:00.000Z',
      loginHistory: [
        {
          timestamp: '2026-11-04T10:20:00.000Z',
          method: 'Password Login',
          deviceSummary: 'MacBook Pro • Calgary, AB',
        },
      ],
      modulePermissions: buildDefaultModulePermissions('MARKETING_MANAGER'),
      createdAt: now,
    },
    {
      id: 'usr_crew_1',
      username: 'marcus.vance',
      email: 'quickmoversolu+crew@gmail.com',
      name: 'Marcus Vance',
      phone: '(403) 555-0192',
      role: 'CREW_MEMBER',
      roleDisplayTitle: 'Employee (Crew Lead)',
      isProtectedOwner: false,
      isActive: true,
      accountStatus: 'ACTIVE',
      employeeId: 'emp_3',
      accessCode: 'QM-CREW-2026',
      passwordHash: hashPasswordScrypt('QM-CREW-2026'),
      mustChangePassword: false,
      mfaEnabled: false,
      sessionVersion: 1,
      loginCount: 14,
      lastLoginAt: '2026-11-04T07:15:00.000Z',
      loginHistory: [
        {
          timestamp: '2026-11-04T07:15:00.000Z',
          method: 'Mobile App Login',
          deviceSummary: 'Android Field Device • Team Alpha',
        },
      ],
      modulePermissions: buildDefaultModulePermissions('CREW_MEMBER'),
      createdAt: now,
    },
    {
      id: 'usr_crew_2',
      username: 'liam.oconnor',
      email: 'quickmoversolu+liam@gmail.com',
      name: 'Liam O’Connor',
      phone: '(403) 555-0164',
      role: 'CREW_MEMBER',
      roleDisplayTitle: 'Employee (Mover)',
      isProtectedOwner: false,
      isActive: true,
      accountStatus: 'INVITED',
      employeeId: 'emp_4',
      accessCode: 'QM-LIAM-TEMP',
      passwordHash: hashPasswordScrypt('QM-LIAM-TEMP'),
      mustChangePassword: true,
      invitationSentAt: '2026-11-03T16:00:00.000Z',
      mfaEnabled: false,
      sessionVersion: 1,
      loginCount: 0,
      loginHistory: [],
      modulePermissions: buildDefaultModulePermissions('CREW_MEMBER'),
      createdAt: now,
    },
    {
      id: 'usr_cust_1',
      email: 'm.henderson.yyc@example.com',
      name: 'Michael Henderson',
      phone: '(403) 555-0148',
      role: 'CUSTOMER',
      isActive: true,
      accountStatus: 'ACTIVE',
      customerId: 'cust_seed_1',
      accessCode: 'QM-MOV-261101-A1B2',
      createdAt: now,
    },
  ];

  const customRoles: CustomRoleRecord[] = [
    {
      id: 'crole_senior_estimator',
      name: 'Senior Estimator & Coordinator',
      description: 'Custom role with full access to Leads, Quotations, Customers, and Reports.',
      baseRole: 'COORDINATOR',
      modulePermissions: {
        ...buildDefaultModulePermissions('COORDINATOR'),
        quotations: {
          view: true,
          create: true,
          edit: true,
          delete: false,
          approve: true,
          manage: true,
        },
        reports_analytics: {
          view: true,
          create: true,
          edit: false,
          delete: false,
          approve: false,
          manage: false,
        },
      },
      createdAt: now,
    },
  ];

  const employees: EmployeeRecord[] = [
    {
      id: 'emp_1',
      fullName: 'Devon Reid',
      phone: '(587) 999-9565',
      email: 'quickmoversolu+admin@gmail.com',
      role: 'OWNER',
      skills: ['Operations Management', 'Commercial Estimating', 'Fleet Dispatch'],
      status: 'ACTIVE',
      availabilityNote: 'Full-Time Monday–Saturday (Calgary HQ)',
      internalNotes: 'Primary operations lead & estimator.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'emp_2',
      fullName: 'Sarah Chen',
      phone: '(587) 999-9565',
      email: 'quickmoversolu+dispatch@gmail.com',
      role: 'COORDINATOR',
      skills: ['Customer Dispatch', 'Elevator Bookings', 'Quote Preparation'],
      status: 'ACTIVE',
      availabilityNote: 'Monday–Friday 7:30 AM – 5:30 PM',
      internalNotes: 'Handles residential & junk removal quote coordination.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'emp_3',
      fullName: 'Marcus Vance',
      phone: '(403) 555-0192',
      email: 'quickmoversolu+crew@gmail.com',
      role: 'TEAM_LEAD',
      skills: ['Class 5 Commercial Driving', 'Piano & Heavy Safe Rigging', 'Furniture Wrapping'],
      status: 'ACTIVE',
      availabilityNote: 'Available Monday–Saturday',
      internalNotes: 'Senior moving crew leader for Team Alpha.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'emp_4',
      fullName: 'Liam O’Connor',
      phone: '(403) 555-0164',
      email: 'quickmoversolu+liam@gmail.com',
      role: 'MOVER',
      skills: ['Residential Packing', 'Disassembly/Reassembly', 'High-Rise Elevator Moves'],
      status: 'ACTIVE',
      availabilityNote: 'Available Monday–Saturday',
      internalNotes: 'Assigned to Team Alpha.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'emp_5',
      fullName: 'Tariq Al-Mansoor',
      phone: '(587) 555-0133',
      email: 'quickmoversolu+tariq@gmail.com',
      role: 'JUNK_SPECIALIST',
      skills: ['Junk Removal & Sorting', 'Eco-Station Recycling', 'Appliance Haul-Away'],
      status: 'ACTIVE',
      availabilityNote: 'Available Tuesday–Sunday',
      internalNotes: 'Lead specialist for Team Bravo (Junk Removal & Delivery).',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const teams: TeamRecord[] = [
    {
      id: 'team_alpha',
      name: 'Team Alpha — Calgary Residential & Commercial Moving',
      code: 'ALPHA-YYC',
      leadMemberId: 'emp_3',
      memberIds: ['emp_3', 'emp_4'],
      specialty: 'MOVING_AND_DELIVERY',
      status: 'ACTIVE',
      createdAt: now,
    },
    {
      id: 'team_bravo',
      name: 'Team Bravo — Junk Removal & Express Delivery',
      code: 'BRAVO-JNK',
      leadMemberId: 'emp_5',
      memberIds: ['emp_5', 'emp_4'],
      specialty: 'JUNK_REMOVAL',
      status: 'ACTIVE',
      createdAt: now,
    },
    {
      id: 'team_charlie',
      name: 'Team Charlie — Highway 2 Long-Distance Corridor',
      code: 'CHARLIE-AB',
      leadMemberId: 'emp_1',
      memberIds: ['emp_1', 'emp_3'],
      specialty: 'ALL_SERVICES',
      status: 'ACTIVE',
      createdAt: now,
    },
  ];

  const vehicles: VehicleRecord[] = [
    {
      id: 'veh_1',
      name: 'Unit #01 — 26ft Heavy-Duty Moving Box Truck',
      vehicleType: '26FT_BOX_TRUCK',
      capacitySummary: '3–5 Bedroom Homes & Commercial Relocations (Hydraulic Liftgate)',
      licensePlate: 'AB-QMS-101',
      status: 'AVAILABLE',
      maintenanceNote: 'CVIP Inspection Current — Equipped with 72 moving blankets & 4 dollies.',
      createdAt: now,
    },
    {
      id: 'veh_2',
      name: 'Unit #02 — 20ft Urban Condo & Local Moving Truck',
      vehicleType: '20FT_MOVING_TRUCK',
      capacitySummary: '1–3 Bedroom Moves & Tight Beltline Alley Access',
      licensePlate: 'AB-QMS-102',
      status: 'AVAILABLE',
      maintenanceNote: 'Equipped with neoprene floor runners & appliance straps.',
      createdAt: now,
    },
    {
      id: 'veh_3',
      name: 'Unit #03 — High-Wall Junk Removal & Cleanout Truck',
      vehicleType: '16FT_JUNK_DUMP_TRUCK',
      capacitySummary: 'Full Property Cleanouts, Furniture, Mattresses & Garage Hauls',
      licensePlate: 'AB-QMS-201',
      status: 'AVAILABLE',
      maintenanceNote: 'Equipped with heavy tarps, brooms, and loading ramps.',
      createdAt: now,
    },
  ];

  const customers: CustomerRecord[] = [
    {
      id: 'cust_seed_1',
      fullName: 'Michael Henderson',
      email: 'm.henderson.yyc@example.com',
      phone: '(403) 555-0148',
      preferredContact: 'phone',
      address: '1420 Memorial Dr NW',
      city: 'Calgary',
      postalCode: 'T2N 3E5',
      notes: '3-bedroom family home move from Kensington NW to Mahogany SE.',
      portalPasscode: 'QM-MOV-261101-A1B2',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cust_seed_2',
      fullName: 'Priya Patel',
      email: 'priya.patel.airdrie@example.com',
      phone: '(587) 555-0281',
      preferredContact: 'text',
      address: '88 Coopers Blvd SW',
      city: 'Airdrie',
      postalCode: 'T4B 3R9',
      notes: 'Photo-first basement & garage cleanout before listing home.',
      portalPasscode: 'QM-JNK-261101-C3D4',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cust_seed_3',
      fullName: 'NorthPeak Design Studio Ltd.',
      email: 'logistics@northpeakstudio.example.com',
      phone: '(403) 555-0911',
      preferredContact: 'email',
      address: '1040 7 Ave SW, Suite 400',
      city: 'Calgary',
      postalCode: 'T2P 3G9',
      notes: 'Commercial office relocation + showroom furniture delivery.',
      portalPasscode: 'QM-MOV-261101-E5F6',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const jobRequests: JobRequestRecord[] = [
    {
      id: 'job_seed_1',
      leadId: 'lead_seed_1',
      customerId: 'cust_seed_1',
      serviceType: 'moving:residential',
      serviceCategory: 'MOVING',
      lifecycleStage: 'BOOKING_CONFIRMED',
      pickupAddress: '1420 Memorial Dr NW',
      pickupCity: 'Calgary',
      pickupPostalCode: 'T2N 3E5',
      pickupAccessDetails: 'Front driveway access, 1 flight of interior stairs.',
      destinationAddress: '215 Mahogany Blvd SE',
      destinationCity: 'Calgary',
      destinationPostalCode: 'T3M 1Y6',
      destinationAccessDetails: 'Double attached garage, wide front entrance.',
      preferredDate: '2026-11-08',
      isFlexibleDate: false,
      preferredTimeWindow: 'morning',
      confirmedDate: '2026-11-08',
      propertySize: 'three-bedroom',
      inventoryDetails: {
        furniture: true,
        appliances: true,
        fragileItems: true,
        packing: true,
        stairs: true,
      },
      junkCategories: [],
      specialRequirements: 'Please wrap glass dining table and upright digital piano.',
      aiSummary:
        'RESIDENTIAL move (three-bedroom) from Calgary NW to Calgary SE on 2026-11-08 (morning). Includes partial kitchen packing and furniture pad wrapping.',
      requiresManualInspection: false,
      assignedTeamId: 'team_alpha',
      assignedVehicleId: 'veh_1',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'job_seed_2',
      leadId: 'lead_seed_2',
      customerId: 'cust_seed_2',
      serviceType: 'junk-removal',
      serviceCategory: 'JUNK_REMOVAL',
      lifecycleStage: 'QUOTE_SENT',
      pickupAddress: '88 Coopers Blvd SW',
      pickupCity: 'Airdrie',
      pickupPostalCode: 'T4B 3R9',
      pickupAccessDetails: 'house | both | stairs | Back driveway pad accessible',
      preferredDate: '2026-11-05',
      isFlexibleDate: true,
      preferredTimeWindow: 'afternoon',
      junkCategories: ['furniture', 'sofa', 'mattress', 'garage-clutter'],
      junkVolumeEstimate: 'medium-load',
      inventoryDetails: {},
      specialRequirements: 'Old basement sectional sofa, queen mattress, and 8 boxes of garage clutter.',
      aiSummary:
        'Photo-First Junk Removal request in Airdrie (house, indoors & garage). Categories: furniture, sofa, mattress, garage-clutter. Customer preliminary volume: medium-load.',
      aiVolumeSuggestion: 'medium-load',
      requiresManualInspection: true,
      assignedTeamId: 'team_bravo',
      assignedVehicleId: 'veh_3',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'job_seed_3',
      leadId: 'lead_seed_3',
      customerId: 'cust_seed_3',
      serviceType: 'moving:commercial',
      serviceCategory: 'MOVING',
      lifecycleStage: 'NEW_LEAD',
      pickupAddress: '1040 7 Ave SW, Suite 400',
      pickupCity: 'Calgary',
      pickupPostalCode: 'T2P 3G9',
      pickupAccessDetails: 'Freight elevator reserved, loading dock off 8 St SW.',
      destinationAddress: '510 11 Ave SW, Suite 210',
      destinationCity: 'Calgary',
      destinationPostalCode: 'T2R 0C8',
      destinationAccessDetails: 'Ground-level loading bay.',
      preferredDate: '2026-11-14',
      isFlexibleDate: false,
      preferredTimeWindow: 'morning',
      propertySize: 'commercial-property',
      inventoryDetails: {
        furniture: true,
        largeItems: true,
        elevator: true,
      },
      junkCategories: [],
      specialRequirements: '14 workstations, conference table, and architectural sample shelving.',
      aiSummary:
        'COMMERCIAL office relocation in Downtown/Beltline Calgary on 2026-11-14. Freight elevator required.',
      requiresManualInspection: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const leads: LeadRecord[] = [
    {
      id: 'lead_seed_1',
      referenceCode: 'QM-MOV-261101-A1B2',
      customerId: 'cust_seed_1',
      jobRequestId: 'job_seed_1',
      serviceType: 'moving:residential',
      status: 'BOOKED',
      source: 'Website MOVING Wizard',
      utmSource: 'google',
      utmMedium: 'organic',
      utmCampaign: 'calgary_residential_moving',
      assignedEmployeeId: 'emp_2',
      internalNotes: 'Quote accepted by Michael. Scheduled for Nov 8 at 8:30 AM with Team Alpha.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'lead_seed_2',
      referenceCode: 'QM-JNK-261101-C3D4',
      customerId: 'cust_seed_2',
      jobRequestId: 'job_seed_2',
      serviceType: 'junk-removal',
      status: 'QUOTE_SENT',
      source: 'Website JUNK-REMOVAL Wizard',
      utmSource: 'instagram',
      utmMedium: 'social',
      utmCampaign: 'photo_junk_quote_airdrie',
      assignedEmployeeId: 'emp_2',
      internalNotes: 'Reviewed customer photos; sent itemized medium-load quote Q-2026-1002.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'lead_seed_3',
      referenceCode: 'QM-MOV-261101-E5F6',
      customerId: 'cust_seed_3',
      jobRequestId: 'job_seed_3',
      serviceType: 'moving:commercial',
      status: 'NEW',
      source: 'Website MOVING Wizard',
      assignedEmployeeId: 'emp_1',
      internalNotes: 'New commercial office move inquiry in Downtown Calgary.',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const quote1Calc = calculateServerQuoteTotals(
    [
      {
        id: 'qli_1',
        category: 'MOVING_SERVICE',
        description: '3-Person Professional Moving Crew & 26ft Equipped Box Truck (6 Hours)',
        quantity: 6,
        unitPriceCents: 18500,
        sortOrder: 1,
      },
      {
        id: 'qli_2',
        category: 'PACKING_UNPACKING',
        description: 'Partial Kitchen & Fragile Glassware Packing Service',
        quantity: 1,
        unitPriceCents: 24000,
        sortOrder: 2,
      },
      {
        id: 'qli_3',
        category: 'MATERIALS',
        description: 'Heavy-Duty Dish Pack Boxes, Wardrobe Boxes & Shrink Wrap Kit',
        quantity: 1,
        unitPriceCents: 9500,
        sortOrder: 3,
      },
    ],
    5000,
    5.0
  );

  const quote2Calc = calculateServerQuoteTotals(
    [
      {
        id: 'qli_4',
        category: 'JUNK_REMOVAL',
        description: 'Medium-Load Photo-Verified Junk Removal (Sectional Sofa, Queen Mattress & Garage Boxes)',
        quantity: 1,
        unitPriceCents: 32000,
        sortOrder: 1,
      },
      {
        id: 'qli_5',
        category: 'DISPOSAL_HANDLING',
        description: 'Municipal Mattress Recycling & Eco-Station Transfer Fee',
        quantity: 1,
        unitPriceCents: 3500,
        sortOrder: 2,
      },
    ],
    0,
    5.0
  );

  const quotes: QuoteRecord[] = [
    {
      id: 'quo_seed_1',
      quoteNumber: 'Q-2026-1001',
      version: 1,
      leadId: 'lead_seed_1',
      jobRequestId: 'job_seed_1',
      customerId: 'cust_seed_1',
      serviceType: 'moving:residential',
      serviceCategory: 'MOVING',
      status: 'ACCEPTED',
      proposedDate: '2026-11-08',
      proposedWindow: '8:30 AM – 9:30 AM Arrival',
      scopeSummary:
        '3-Bedroom residential relocation from 1420 Memorial Dr NW to 215 Mahogany Blvd SE, including blanket wrapping, floor runners, and partial kitchen packing.',
      lineItems: quote1Calc.computedItems,
      subtotalCents: quote1Calc.subtotalCents,
      discountCents: quote1Calc.discountCents,
      taxRatePercent: quote1Calc.taxRatePercent,
      taxCents: quote1Calc.taxCents,
      totalCents: quote1Calc.totalCents,
      depositCents: 15000,
      validityDays: 14,
      validUntil: '2026-11-15',
      termsAndNotes:
        'Includes furniture pad wrapping, floor protection, and standard cargo protection. Final labour hours billed to the nearest 15-minute increment.',
      customerResponse: 'Accepted online via Customer Portal.',
      respondedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'quo_seed_2',
      quoteNumber: 'Q-2026-1002',
      version: 1,
      leadId: 'lead_seed_2',
      jobRequestId: 'job_seed_2',
      customerId: 'cust_seed_2',
      serviceType: 'junk-removal',
      serviceCategory: 'JUNK_REMOVAL',
      status: 'SENT',
      proposedDate: '2026-11-05',
      proposedWindow: '1:00 PM – 3:00 PM Arrival',
      scopeSummary:
        'Basement sectional sofa, queen mattress, and garage box removal from 88 Coopers Blvd SW, Airdrie, including full sweep-up.',
      lineItems: quote2Calc.computedItems,
      subtotalCents: quote2Calc.subtotalCents,
      discountCents: quote2Calc.discountCents,
      taxRatePercent: quote2Calc.taxRatePercent,
      taxCents: quote2Calc.taxCents,
      totalCents: quote2Calc.totalCents,
      depositCents: 0,
      validityDays: 14,
      validUntil: '2026-11-15',
      termsAndNotes:
        'Based on customer-submitted photos. Excludes hazardous liquids, paint cans, or pressurized propane cylinders.',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const bookings: BookingRecord[] = [
    {
      id: 'bkg_seed_1',
      bookingNumber: 'BK-2026-501',
      jobRequestId: 'job_seed_1',
      customerId: 'cust_seed_1',
      quoteId: 'quo_seed_1',
      serviceType: 'moving:residential',
      serviceCategory: 'MOVING',
      status: 'CONFIRMED',
      scheduledDate: '2026-11-08',
      startTime: '08:30',
      endTime: '14:30',
      arrivalWindow: '8:30 AM – 9:30 AM',
      assignedTeamId: 'team_alpha',
      assignedVehicleId: 'veh_1',
      crewMemberIds: ['emp_3', 'emp_4'],
      pickupAddress: '1420 Memorial Dr NW',
      pickupCity: 'Calgary',
      destinationCity: 'Calgary',
      dispatchNotes: 'Bring extra neoprene runners for hardwood stairs and upright piano dolly.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'bkg_seed_2',
      bookingNumber: 'BK-2026-502',
      jobRequestId: 'job_seed_2',
      customerId: 'cust_seed_2',
      quoteId: 'quo_seed_2',
      serviceType: 'junk-removal',
      serviceCategory: 'JUNK_REMOVAL',
      status: 'TENTATIVE',
      scheduledDate: '2026-11-05',
      startTime: '13:00',
      endTime: '15:30',
      arrivalWindow: '1:00 PM – 3:00 PM',
      assignedTeamId: 'team_bravo',
      assignedVehicleId: 'veh_3',
      crewMemberIds: ['emp_5'],
      pickupAddress: '88 Coopers Blvd SW',
      pickupCity: 'Airdrie',
      dispatchNotes: 'Awaiting customer quote confirmation for afternoon Airdrie run.',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const jobChecklists: JobChecklistRecord[] = [
    {
      id: 'chk_seed_1',
      jobRequestId: 'job_seed_1',
      title: 'Moving Operational Checklist',
      serviceCategory: 'MOVING',
      items: DEFAULT_MOVING_CHECKLIST.map((label, idx) => ({
        id: `chki_seed1_${idx + 1}`,
        label,
        isCompleted: idx < 7,
        completedAt: idx < 7 ? now : undefined,
        sortOrder: idx + 1,
      })),
      createdAt: now,
    },
    {
      id: 'chk_seed_2',
      jobRequestId: 'job_seed_2',
      title: 'Junk Removal Operational Checklist',
      serviceCategory: 'JUNK_REMOVAL',
      items: DEFAULT_JUNK_CHECKLIST.map((label, idx) => ({
        id: `chki_seed2_${idx + 1}`,
        label,
        isCompleted: idx < 3,
        completedAt: idx < 3 ? now : undefined,
        sortOrder: idx + 1,
      })),
      createdAt: now,
    },
  ];

  const reviewRequests: ReviewRequestRecord[] = [
    {
      id: 'rev_seed_1',
      customerId: 'cust_seed_1',
      jobRequestId: 'job_seed_1',
      status: 'NOT_REQUESTED',
      reviewLinkUrl: BUSINESS_INFO.googleBusinessSearchUrl,
      notes: 'Send Google review invitation once Nov 8 move is marked completed.',
      createdAt: now,
    },
  ];

  const testimonials: TestimonialRecord[] = [
    {
      id: 'tst_seed_1',
      customerName: 'Calgary Homeowner (Verified Workflow Sample — Unpublished)',
      serviceType: 'Residential Moving & Junk Removal',
      city: 'Calgary',
      quoteText:
        'Sample internal placeholder: Only verified customer reviews approved by the owner are published publicly.',
      isVerified: false,
      isPublished: false,
      createdAt: now,
    },
  ];

  const marketingCampaigns: MarketingCampaignRecord[] = [
    {
      id: 'cmp_seed_1',
      name: 'Calgary Fall Condo & Home Relocation Campaign',
      theme: 'Stress-Free Calgary Moving & Elevator Preparation',
      targetCity: 'Calgary',
      serviceFocus: 'Residential & Condo Moving',
      status: 'ACTIVE',
      startDate: '2026-11-01',
      endDate: '2026-11-30',
      createdAt: now,
    },
    {
      id: 'cmp_seed_2',
      name: 'Snap-a-Photo Garage & Basement Junk Clearout',
      theme: 'Photo-First Junk Removal Before Winter Parking',
      targetCity: 'Calgary & Airdrie',
      serviceFocus: 'Full Junk Removal',
      status: 'ACTIVE',
      startDate: '2026-11-01',
      endDate: '2026-11-30',
      createdAt: now,
    },
  ];

  const marketingPosts: MarketingPostRecord[] = [
    {
      id: 'mp_seed_1',
      campaignId: 'cmp_seed_1',
      title: 'Moving Tips',
      platform: 'FACEBOOK',
      contentPillar: 'Moving Tips & Education',
      serviceFocus: 'Residential Moving',
      targetCity: 'Calgary',
      tone: 'Helpful, Professional & Local',
      goal: 'Drive Visual Moving Quote Requests',
      hook: 'Moving into or out of a Calgary high-rise this month? One detail saves hours on moving day:',
      primaryCaption: `Moving into or out of a Calgary condo or apartment? Securing your dedicated service elevator window in advance keeps your move smooth, protected, and on schedule.\n\nAt QuickMove Solutions, our crews arrive with padded elevator blankets, floor runners, and organized dollies to make your transition seamless.\n\nPlanning a move in Calgary, Airdrie, Strathmore, Red Deer, or Edmonton? Request your free itemized quote at ${BUSINESS_INFO.website}/get-a-quote or call (587) 999-9565.`,
      shortCaption:
        'Moving in Calgary? Book your service elevator early and let QuickMove Solutions handle the heavy lifting. Call (587) 999-9565.',
      hashtags: ['#CalgaryMovers', '#QuickMoveSolutions', '#YYCMoving', '#AlbertaMovers'],
      ctaText: `Get a Free Visual Moving Quote at ${BUSINESS_INFO.domain} or call (587) 999-9565`,
      visualConcept:
        'Two uniformed QuickMove Solutions movers in navy and orange gear rolling a padded sofa onto a protected condo service elevator in Calgary.',
      imagePrompt:
        'Photorealistic commercial photography of two professional movers in navy blue polo shirts with orange accents carefully moving a blanket-wrapped sofa in a modern Calgary condo lobby.',
      overlayText: 'Moving Made Easy. Calgary Condo & Home Movers.',
      aspectRatio: '4:5',
      status: 'PUBLISHED',
      approvedBy: 'QuickMove Owner',
      approvedAt: now,
      publishedAt: now,
      scheduledFor: '2026-11-02T10:00:00.000Z',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mp_seed_2',
      campaignId: 'cmp_seed_2',
      title: 'Junk Removal',
      platform: 'INSTAGRAM',
      contentPillar: 'Junk Removal & Space Clearing',
      serviceFocus: 'Full Junk Removal',
      targetCity: 'Calgary',
      tone: 'Action-Oriented & Reassuring',
      goal: 'Drive 6-Step Photo Junk Removal Submissions',
      hook: 'Want to park your car inside the garage before the next Calgary cold snap?',
      primaryCaption: `Reclaim your garage, basement, or spare room without lifting a finger! With QuickMove Solutions’ Photo-First Junk Removal flow, simply snap a few photos of old furniture, mattresses, appliances, or boxed clutter from your phone.\n\nStart your 6-step photo quote at ${BUSINESS_INFO.website}/get-a-quote/junk-removal or call (587) 999-9565.`,
      shortCaption:
        'Snap photos of unwanted furniture or garage clutter for a fast Calgary junk removal quote! Call (587) 999-9565.',
      hashtags: ['#CalgaryJunkRemoval', '#YYCCleanout', '#QuickMoveSolutions', '#SpaceMadeClear'],
      ctaText: `Upload Photos for a Quote at ${BUSINESS_INFO.domain}/get-a-quote/junk-removal`,
      visualConcept:
        'Split before-and-after style visual of a cluttered residential garage transformed into a clean, swept two-car garage.',
      imagePrompt:
        'Clean organized residential garage in Calgary Alberta after professional junk removal service.',
      overlayText: 'Space Made Clear. Send Photos for a Junk Quote.',
      aspectRatio: '1:1',
      status: 'APPROVED',
      approvedBy: 'QuickMove Owner',
      approvedAt: now,
      scheduledFor: '2026-11-03T11:00:00.000Z',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mp_seed_3',
      campaignId: 'cmp_seed_1',
      title: 'Residential Moving',
      platform: 'FACEBOOK',
      contentPillar: 'Moving Services Spotlight',
      serviceFocus: 'Residential Moving',
      targetCity: 'Calgary',
      tone: 'Professional & Reassuring',
      goal: 'Generate Residential Quote Leads',
      hook: 'Relocating your family home in Calgary this month?',
      primaryCaption: `From multi-bedroom houses to townhouses and condos, QuickMove Solutions protects floors, banisters, and furniture at every step. Call (587) 999-9565.`,
      shortCaption: 'Careful, organized household moving across Calgary & Alberta.',
      hashtags: ['#CalgaryMoving', '#QuickMoveSolutions', '#ResidentialMovers'],
      ctaText: `Call (587) 999-9565`,
      visualConcept: 'QuickMove Solutions box truck parked in front of a modern Calgary home.',
      imagePrompt: 'Branded QuickMove Solutions truck parked outside a Calgary family home.',
      overlayText: 'Residential Moving • Calgary & Area',
      aspectRatio: '4:5',
      status: 'SCHEDULED',
      approvedBy: 'QuickMove Owner',
      approvedAt: now,
      scheduledFor: '2026-11-05T10:00:00.000Z',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mp_seed_4',
      campaignId: 'cmp_seed_1',
      title: 'Local Service Calgary',
      platform: 'BOTH',
      contentPillar: 'Local Area Awareness',
      serviceFocus: 'Local Moving',
      targetCity: 'Calgary',
      tone: 'Local & Community-Focused',
      goal: 'Local Brand Awareness',
      hook: 'Serving every quadrant of Calgary (NW, NE, SW, SE) plus Airdrie & Strathmore!',
      primaryCaption: `Moving Made Easy. Space Made Clear. Whether you are moving across Calgary or clearing out unwanted furniture, our crew is ready. Call (587) 999-9565.`,
      shortCaption: 'Local Calgary Moving & Junk Removal — (587) 999-9565.',
      hashtags: ['#YYC', '#CalgaryLocal', '#QuickMoveSolutions'],
      ctaText: `Request a Free Quote Today`,
      visualConcept: 'QuickMove Solutions crew with Calgary skyline in background.',
      imagePrompt: 'Moving truck with Calgary skyline.',
      overlayText: 'Local Service Calgary • (587) 999-9565',
      aspectRatio: '1:1',
      status: 'SCHEDULED',
      approvedBy: 'QuickMove Owner',
      approvedAt: now,
      scheduledFor: '2026-11-07T11:00:00.000Z',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mp_seed_5',
      campaignId: 'cmp_seed_1',
      title: 'Packing Tips',
      platform: 'BOTH',
      contentPillar: 'Moving Tips & Education',
      serviceFocus: 'Packing & Unpacking',
      targetCity: 'Airdrie',
      tone: 'Educational & Helpful',
      goal: 'Promote Packing Add-On Service',
      hook: 'Save days of pre-move stress with organized room-by-room packing:',
      primaryCaption: `Need help wrapping fragile kitchenware, mirrors, and household rooms before moving day? QuickMove Solutions offers full and partial packing & unpacking support.`,
      shortCaption: 'Professional packing & unpacking assistance in Calgary & Airdrie.',
      hashtags: ['#PackingTips', '#QuickMoveSolutions', '#AirdrieMovers'],
      ctaText: `Add Packing Support to Your Move`,
      visualConcept: 'Neatly labeled moving boxes and bubble-wrapped glassware.',
      imagePrompt: 'Organized moving boxes in bright living room.',
      overlayText: 'Packing & Unpacking Made Easy',
      aspectRatio: '4:5',
      status: 'PENDING_APPROVAL',
      scheduledFor: '2026-11-09T10:00:00.000Z',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mp_seed_6',
      campaignId: 'cmp_seed_1',
      title: 'Commercial Moving',
      platform: 'FACEBOOK',
      contentPillar: 'Moving Services Spotlight',
      serviceFocus: 'Commercial Moving',
      targetCity: 'Calgary',
      tone: 'Executive & Structured',
      goal: 'B2B Office Relocation Leads',
      hook: 'Relocating your Calgary office, retail space, or commercial studio?',
      primaryCaption: `Minimize downtime with structured commercial moving from QuickMove Solutions. We handle workstations, boardroom furniture, equipment, and office cleanouts.`,
      shortCaption: 'Structured commercial & office relocations in Calgary.',
      hashtags: ['#CalgaryBusiness', '#CommercialMoving', '#QuickMoveSolutions'],
      ctaText: `Request a Commercial Quote`,
      visualConcept: 'Crew relocating modern office workstations.',
      imagePrompt: 'Commercial office relocation in downtown Calgary.',
      overlayText: 'Commercial & Office Moving',
      aspectRatio: '16:9',
      status: 'APPROVED',
      approvedBy: 'QuickMove Owner',
      approvedAt: now,
      scheduledFor: '2026-11-11T10:00:00.000Z',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mp_seed_7',
      campaignId: 'cmp_seed_2',
      title: 'Delivery Services',
      platform: 'INSTAGRAM',
      contentPillar: 'Delivery & Commercial Spotlight',
      serviceFocus: 'Delivery Services',
      targetCity: 'Calgary',
      tone: 'Fast & Dependable',
      goal: 'Drive 4-Step Delivery Quote Requests',
      hook: 'Bought a new sectional sofa or heavy appliance? Let us pick it up and deliver it!',
      primaryCaption: `Skip the truck rental! QuickMove Solutions provides blanket-wrapped store-to-home and private-sale furniture & appliance delivery across Calgary and surrounding areas.`,
      shortCaption: 'Store-to-home furniture & appliance delivery — (587) 999-9565.',
      hashtags: ['#CalgaryDelivery', '#FurnitureDelivery', '#QuickMoveSolutions'],
      ctaText: `Schedule a 4-Step Delivery Quote`,
      visualConcept: 'Crew delivering a wrapped sofa into a Calgary home.',
      imagePrompt: 'Furniture delivery crew carrying padded sofa.',
      overlayText: 'Furniture & Appliance Delivery',
      aspectRatio: '1:1',
      status: 'SCHEDULED',
      approvedBy: 'QuickMove Owner',
      approvedAt: now,
      scheduledFor: '2026-11-13T11:00:00.000Z',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const socialAccounts: SocialAccountRecord[] = [
    {
      id: 'soc_fb',
      platform: 'FACEBOOK',
      accountName: 'QuickMove Solutions',
      accountUrl: BUSINESS_INFO.socials.facebook,
      externalPageId: 'quickmovesolutions',
      connectionStatus: 'CONNECTED',
      scopesGranted: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
      lastVerifiedAt: now,
      updatedAt: now,
    },
    {
      id: 'soc_ig',
      platform: 'INSTAGRAM',
      accountName: '@quickmoverssolution',
      accountUrl: BUSINESS_INFO.socials.instagram,
      externalPageId: 'quickmoverssolution',
      connectionStatus: 'CONNECTED',
      scopesGranted: ['instagram_basic', 'instagram_content_publish'],
      lastVerifiedAt: now,
      updatedAt: now,
    },
  ];

  const notifications: NotificationRecord[] = [
    {
      id: 'ntf_seed_1',
      eventType: 'QUOTE_ACCEPTED',
      channel: 'EMAIL',
      recipientType: 'ADMIN',
      recipientAddress: BUSINESS_INFO.email,
      subject: '[Quote Accepted Q-2026-1001] Michael Henderson — Residential Move',
      bodyPreview:
        'Michael Henderson accepted Quote Q-2026-1001 ($1,464.75 CAD incl. GST) for Nov 8, 2026.',
      status: 'SENT',
      relatedLeadId: 'lead_seed_1',
      createdAt: now,
    },
    {
      id: 'ntf_seed_2',
      eventType: 'QUOTE_SENT',
      channel: 'EMAIL',
      recipientType: 'CUSTOMER',
      recipientAddress: 'priya.patel.airdrie@example.com',
      subject: 'Your QuickMove Solutions Junk Removal Quotation (Q-2026-1002)',
      bodyPreview:
        'Hi Priya, your itemized junk removal quote Q-2026-1002 is ready for review in your Customer Portal.',
      status: 'SENT',
      relatedLeadId: 'lead_seed_2',
      createdAt: now,
    },
  ];

  const activityLogs: ActivityLogRecord[] = [
    {
      id: 'act_seed_1',
      actorRole: 'COORDINATOR',
      entityType: 'BOOKING',
      entityId: 'bkg_seed_1',
      action: 'BOOKING_CONFIRMED',
      summary:
        'Confirmed Booking BK-2026-501 for Michael Henderson on 2026-11-08 (08:30–14:30) with Team Alpha & Unit #01.',
      createdAt: now,
    },
    {
      id: 'act_seed_2',
      actorRole: 'COORDINATOR',
      entityType: 'QUOTE',
      entityId: 'quo_seed_2',
      action: 'QUOTE_SENT',
      summary: 'Prepared and sent Junk Removal Quote Q-2026-1002 ($372.75 CAD) to Priya Patel.',
      createdAt: now,
    },
  ];

  const settings: SystemSettingsRecord = {
    companyName: BUSINESS_INFO.name,
    tagline: BUSINESS_INFO.tagline,
    phoneDisplay: BUSINESS_INFO.phoneDisplay,
    email: BUSINESS_INFO.email,
    primaryLocation: BUSINESS_INFO.primaryLocation,
    timezone: BUSINESS_INFO.timezone,
    albertaGstPercent: 5.0,
    defaultQuoteValidityDays: 14,
    requireOwnerMarketingApproval: true,
    homepageHeroImageUrl: '/images/quickmove-truck-hero.jpg',
    aiMarketingHeroImageUrl: '/images/quickmove-marketing-hero.jpg',
    updatedAt: now,
  };

  const finishedJobs: FinishedJobRecord[] = [];

  return {
    users,
    customRoles,
    customers,
    leads,
    jobRequests,
    jobPhotos: [],
    jobChecklists,
    quotes,
    bookings,
    employees,
    teams,
    vehicles,
    reviewRequests,
    testimonials,
    marketingCampaigns,
    marketingPosts,
    socialAccounts,
    notifications,
    activityLogs,
    settings,
    finishedJobs,
  };
}

let inMemoryFallback: PlatformDatabaseState = createInitialSeedState();

function getDbFilePath(): string {
  // On Vercel / AWS Lambda, process.cwd() is read-only at runtime. The only writable location is /tmp.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpFile = path.join('/tmp', 'quickmove-db.json');
    if (!fs.existsSync(tmpFile)) {
      try {
        const bundledFile = path.join(process.cwd(), 'storage', 'db', 'quickmove-db.json');
        if (fs.existsSync(bundledFile)) {
          fs.copyFileSync(bundledFile, tmpFile);
        }
      } catch (e) {
        console.error('Failed to copy bundled db to /tmp:', e);
      }
    }
    return tmpFile;
  }

  const dir = path.join(process.cwd(), 'storage', 'db');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'quickmove-db.json');
}

export function readPlatformStore(): PlatformDatabaseState {
  try {
    const file = getDbFilePath();
    if (!fs.existsSync(file)) {
      const seed = createInitialSeedState();
      fs.writeFileSync(file, JSON.stringify(seed, null, 2), 'utf-8');
      inMemoryFallback = seed;
      return seed;
    }
    const raw = fs.readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<PlatformDatabaseState>;
    const seed = createInitialSeedState();

    // Ensure collections exist with robust array checks so empty arrays are not overwritten by seed
    const merged: PlatformDatabaseState = {
      users: Array.isArray(parsed.users) ? parsed.users : seed.users,
      customRoles: Array.isArray(parsed.customRoles) ? parsed.customRoles : seed.customRoles,
      customers: Array.isArray(parsed.customers) ? parsed.customers : seed.customers,
      leads: Array.isArray(parsed.leads) ? parsed.leads : seed.leads,
      jobRequests: Array.isArray(parsed.jobRequests) ? parsed.jobRequests : seed.jobRequests,
      jobPhotos: Array.isArray(parsed.jobPhotos) ? parsed.jobPhotos : [],
      jobChecklists: Array.isArray(parsed.jobChecklists) ? parsed.jobChecklists : seed.jobChecklists,
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : seed.quotes,
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : seed.bookings,
      employees: Array.isArray(parsed.employees) ? parsed.employees : seed.employees,
      teams: Array.isArray(parsed.teams) ? parsed.teams : seed.teams,
      vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : seed.vehicles,
      reviewRequests: Array.isArray(parsed.reviewRequests) ? parsed.reviewRequests : seed.reviewRequests,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : seed.testimonials,
      marketingCampaigns: Array.isArray(parsed.marketingCampaigns)
        ? parsed.marketingCampaigns
        : seed.marketingCampaigns,
      marketingPosts: Array.isArray(parsed.marketingPosts) ? parsed.marketingPosts : seed.marketingPosts,
      socialAccounts: Array.isArray(parsed.socialAccounts) ? parsed.socialAccounts : seed.socialAccounts,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : seed.notifications,
      activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : seed.activityLogs,
      settings: parsed.settings || seed.settings,
      finishedJobs: Array.isArray(parsed.finishedJobs) ? parsed.finishedJobs : [],
    };

    inMemoryFallback = merged;
    return merged;
  } catch {
    return inMemoryFallback;
  }
}

export function writePlatformStore(state: PlatformDatabaseState): void {
  inMemoryFallback = state;
  try {
    const file = getDbFilePath();
    fs.writeFileSync(file, JSON.stringify(state, null, 2), 'utf-8');
  } catch {
    // Fallback remains in memory if filesystem is read-only
  }
}

export function getFinishedJobs(): FinishedJobRecord[] {
  const db = readPlatformStore();
  return db.finishedJobs || [];
}

export function saveFinishedJob(job: FinishedJobRecord): FinishedJobRecord {
  const db = readPlatformStore();
  const existingIdx = (db.finishedJobs || []).findIndex((j) => j.id === job.id);
  if (existingIdx !== -1) {
    db.finishedJobs[existingIdx] = job;
  } else {
    db.finishedJobs = [job, ...(db.finishedJobs || [])];
  }
  writePlatformStore(db);
  return job;
}

export function deleteFinishedJob(id: string): boolean {
  const db = readPlatformStore();
  const initialLength = (db.finishedJobs || []).length;
  db.finishedJobs = (db.finishedJobs || []).filter((j) => j.id !== id);
  writePlatformStore(db);
  return db.finishedJobs.length < initialLength;
}

export function updateHeroImages(heroUpdates: {
  homepageHeroImageUrl?: string;
  aiMarketingHeroImageUrl?: string;
}): SystemSettingsRecord {
  const db = readPlatformStore();
  if (heroUpdates.homepageHeroImageUrl !== undefined) {
    db.settings.homepageHeroImageUrl = heroUpdates.homepageHeroImageUrl;
  }
  if (heroUpdates.aiMarketingHeroImageUrl !== undefined) {
    db.settings.aiMarketingHeroImageUrl = heroUpdates.aiMarketingHeroImageUrl;
  }
  db.settings.updatedAt = new Date().toISOString();
  writePlatformStore(db);
  return db.settings;
}

function generateReferenceCode(prefix: 'MOV' | 'JNK' | 'DEL' | 'MSG'): string {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randPart = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `QM-${prefix}-${datePart}-${randPart}`;
}

function buildAdministrativeJobSummary(
  input: UnifiedQuoteSubmissionInput,
  photoCount: number
): {
  aiSummary: string;
  aiVolumeSuggestion?: string;
  requiresManualInspection: boolean;
} {
  if (input.flowType === 'junk-removal') {
    const categoriesList = input.categories.join(', ');
    return {
      aiSummary: `Photo-First Junk Removal request in ${input.pickupCity} (${input.propertyType}, ${input.itemLocation}). Categories selected: ${categoriesList}. Customer preliminary volume: ${input.volumeEstimate}. ${photoCount} photo(s) uploaded for administrator review.`,
      aiVolumeSuggestion: input.volumeEstimate,
      requiresManualInspection: true,
    };
  }

  if (input.flowType === 'moving') {
    const activeFlags = Object.entries(input.inventoryFlags)
      .filter(([, val]) => Boolean(val))
      .map(([k]) => k)
      .join(', ');
    return {
      aiSummary: `${input.movingServiceType.toUpperCase()} move (${input.propertySize}) from ${input.pickupCity} to ${input.destinationCity} on ${input.preferredDate} (${input.preferredTimeWindow}). Key requirements: ${activeFlags || 'Standard move'}. ${photoCount} optional photo(s) attached.`,
      requiresManualInspection: true,
    };
  }

  if (input.flowType === 'delivery') {
    return {
      aiSummary: `Delivery request (${input.deliveryType}) from ${input.pickupCity} to ${input.destinationCity} on ${input.preferredDate}. Items: ${input.itemSummary}.`,
      requiresManualInspection: true,
    };
  }

  return {
    aiSummary: `General contact inquiry for ${input.serviceType} in ${input.pickupCity}: ${input.notes}`,
    requiresManualInspection: true,
  };
}

/**
 * Creates a deduplicated Customer, Lead, JobRequest, JobPhotos, JobChecklist,
 * Customer & Admin Notifications, and ActivityLog in one server operation.
 */
export function createQuoteSubmissionRecord(input: UnifiedQuoteSubmissionInput): {
  referenceCode: string;
  leadId: string;
  jobRequestId: string;
  customerId: string;
  photoCount: number;
  photos?: { id: string; storageKey: string; originalFilename: string }[];
  createdAt: string;
} {
  const db = readPlatformStore();
  const now = new Date().toISOString();

  const normalizedEmail = input.customer.email.trim().toLowerCase();
  const normalizedPhone = input.customer.phone.replace(/\D/g, '');

  let customer = db.customers.find(
    (c) =>
      c.email.toLowerCase() === normalizedEmail ||
      (normalizedPhone.length >= 7 && c.phone.replace(/\D/g, '') === normalizedPhone)
  );

  const pickupAddress = 'pickupAddress' in input ? input.pickupAddress : 'Contact Inquiry';
  const pickupCity = 'pickupCity' in input ? input.pickupCity : 'Calgary';
  const pickupPostalCode =
    'pickupPostalCode' in input && input.pickupPostalCode ? input.pickupPostalCode : '';

  const prefix =
    input.flowType === 'moving'
      ? 'MOV'
      : input.flowType === 'junk-removal'
        ? 'JNK'
        : input.flowType === 'delivery'
          ? 'DEL'
          : 'MSG';

  const referenceCode = generateReferenceCode(prefix);

  if (customer) {
    customer.fullName = input.customer.fullName.trim();
    customer.phone = input.customer.phone.trim();
    customer.preferredContact = input.customer.preferredContact;
    customer.address = pickupAddress;
    customer.city = pickupCity;
    if (pickupPostalCode) customer.postalCode = pickupPostalCode;
    customer.portalPasscode = referenceCode;
    customer.updatedAt = now;
  } else {
    customer = {
      id: `cust_${crypto.randomBytes(6).toString('hex')}`,
      fullName: input.customer.fullName.trim(),
      email: normalizedEmail,
      phone: input.customer.phone.trim(),
      preferredContact: input.customer.preferredContact,
      address: pickupAddress,
      city: pickupCity,
      postalCode: pickupPostalCode,
      notes: '',
      portalPasscode: referenceCode,
      createdAt: now,
      updatedAt: now,
    };
    db.customers.unshift(customer);
  }

  const serviceCategory: 'MOVING' | 'JUNK_REMOVAL' | 'DELIVERY' =
    input.flowType === 'junk-removal'
      ? 'JUNK_REMOVAL'
      : input.flowType === 'delivery'
        ? 'DELIVERY'
        : 'MOVING';

  const leadId = `lead_${crypto.randomBytes(6).toString('hex')}`;
  const jobRequestId = `job_${crypto.randomBytes(6).toString('hex')}`;

  const rawPhotos = 'photos' in input && Array.isArray(input.photos) ? input.photos : [];
  const savedPhotos: JobPhotoRecord[] = [];

  for (const photo of rawPhotos) {
    const saved = savePrivateJobPhoto({
      originalFilename: photo.originalFilename,
      mimeType: photo.mimeType,
      fileSizeBytes: photo.fileSizeBytes,
      base64Data: photo.dataUrl,
    });

    const photoRecord: JobPhotoRecord = {
      id: `pho_${crypto.randomBytes(6).toString('hex')}`,
      jobRequestId,
      storageKey: saved.storageKey,
      originalFilename: saved.originalFilename,
      mimeType: saved.mimeType,
      fileSizeBytes: saved.fileSizeBytes,
      caption: photo.caption || '',
      previewDataUrl: `/api/photos/${saved.storageKey}`,
      aiDetectedCategories: input.flowType === 'junk-removal' ? input.categories : [],
      createdAt: now,
    };
    savedPhotos.push(photoRecord);
    db.jobPhotos.unshift(photoRecord);
  }

  const summaryMeta = buildAdministrativeJobSummary(input, savedPhotos.length);

  const serviceTypeLabel =
    input.flowType === 'moving'
      ? `moving:${input.movingServiceType}`
      : input.flowType === 'junk-removal'
        ? 'junk-removal'
        : input.flowType === 'delivery'
          ? `delivery:${input.deliveryType}`
          : input.serviceType;

  const jobRequest: JobRequestRecord = {
    id: jobRequestId,
    leadId,
    customerId: customer.id,
    serviceType: serviceTypeLabel,
    serviceCategory,
    lifecycleStage: 'NEW_LEAD',
    pickupAddress,
    pickupCity,
    pickupPostalCode,
    pickupAccessDetails:
      input.flowType === 'moving'
        ? input.pickupAccessDetails
        : input.flowType === 'junk-removal'
          ? `${input.propertyType} | ${input.itemLocation} | ${input.stairsOrElevator} | ${input.accessConditions}`
          : input.flowType === 'delivery'
            ? input.accessNotes
            : '',
    destinationAddress: 'destinationAddress' in input ? input.destinationAddress : undefined,
    destinationCity: 'destinationCity' in input ? input.destinationCity : undefined,
    destinationPostalCode:
      'destinationPostalCode' in input ? input.destinationPostalCode : undefined,
    destinationAccessDetails:
      'destinationAccessDetails' in input ? input.destinationAccessDetails : undefined,
    preferredDate: 'preferredDate' in input ? input.preferredDate : now.slice(0, 10),
    isFlexibleDate: 'isFlexibleDate' in input ? Boolean(input.isFlexibleDate) : false,
    preferredTimeWindow:
      'preferredTimeWindow' in input ? input.preferredTimeWindow : 'flexible',
    propertySize: input.flowType === 'moving' ? input.propertySize : undefined,
    inventoryDetails:
      input.flowType === 'moving'
        ? input.inventoryFlags
        : input.flowType === 'delivery'
          ? {
              deliveryType: input.deliveryType,
              pickupLocationName: input.pickupLocationName,
              itemSummary: input.itemSummary,
              removeOldItem: input.removeOldItem,
            }
          : {},
    junkCategories: input.flowType === 'junk-removal' ? input.categories : [],
    junkVolumeEstimate: input.flowType === 'junk-removal' ? input.volumeEstimate : undefined,
    specialRequirements:
      input.flowType === 'moving'
        ? input.specialRequirements
        : input.flowType === 'junk-removal'
          ? input.additionalNotes
          : input.flowType === 'delivery'
            ? input.itemSummary
            : input.notes,
    aiSummary: summaryMeta.aiSummary,
    aiVolumeSuggestion: summaryMeta.aiVolumeSuggestion,
    requiresManualInspection: summaryMeta.requiresManualInspection,
    createdAt: now,
    updatedAt: now,
  };
  db.jobRequests.unshift(jobRequest);

  const templateSteps =
    serviceCategory === 'JUNK_REMOVAL'
      ? DEFAULT_JUNK_CHECKLIST
      : serviceCategory === 'DELIVERY'
        ? DEFAULT_DELIVERY_CHECKLIST
        : DEFAULT_MOVING_CHECKLIST;

  const checklist: JobChecklistRecord = {
    id: `chk_${crypto.randomBytes(6).toString('hex')}`,
    jobRequestId,
    title:
      serviceCategory === 'JUNK_REMOVAL'
        ? 'Junk Removal Operational Checklist'
        : serviceCategory === 'DELIVERY'
          ? 'Delivery Service Checklist'
          : 'Moving Operational Checklist',
    serviceCategory,
    items: templateSteps.map((label, idx) => ({
      id: `chki_${idx + 1}`,
      label,
      isCompleted: false,
      sortOrder: idx + 1,
    })),
    createdAt: now,
  };
  db.jobChecklists.unshift(checklist);

  const lead: LeadRecord = {
    id: leadId,
    referenceCode,
    customerId: customer.id,
    jobRequestId,
    serviceType: serviceTypeLabel,
    status: 'NEW',
    source: `Website ${input.flowType.toUpperCase()} Wizard`,
    utmSource: 'utmSource' in input ? input.utmSource : undefined,
    utmMedium: 'utmMedium' in input ? input.utmMedium : undefined,
    utmCampaign: 'utmCampaign' in input ? input.utmCampaign : undefined,
    internalNotes: summaryMeta.aiSummary,
    createdAt: now,
    updatedAt: now,
  };
  db.leads.unshift(lead);

  const customerNotification: NotificationRecord = {
    id: `ntf_${crypto.randomBytes(6).toString('hex')}`,
    eventType: 'REQUEST_RECEIVED',
    channel: 'EMAIL',
    recipientType: 'CUSTOMER',
    recipientAddress: customer.email,
    subject: `QuickMove Solutions — Quote Request Received (${referenceCode})`,
    bodyPreview: `Hi ${customer.fullName}, we have received your ${serviceTypeLabel} request (${referenceCode}). Our Calgary dispatch team is reviewing your details and will follow up shortly. Questions? Call ${BUSINESS_INFO.phoneDisplay}.`,
    status: 'SENT',
    relatedLeadId: leadId,
    createdAt: now,
  };

  const adminNotification: NotificationRecord = {
    id: `ntf_${crypto.randomBytes(6).toString('hex')}`,
    eventType:
      serviceCategory === 'JUNK_REMOVAL'
        ? 'NEW_JUNK_REMOVAL_REQUEST'
        : serviceCategory === 'DELIVERY'
          ? 'NEW_DELIVERY_REQUEST'
          : 'NEW_MOVING_REQUEST',
    channel: 'EMAIL',
    recipientType: 'ADMIN',
    recipientAddress: BUSINESS_INFO.email,
    subject: `[New Lead ${referenceCode}] ${customer.fullName} — ${serviceTypeLabel} (${pickupCity})`,
    bodyPreview: summaryMeta.aiSummary,
    status: 'SENT',
    relatedLeadId: leadId,
    createdAt: now,
  };
  db.notifications.unshift(adminNotification, customerNotification);

  const activity: ActivityLogRecord = {
    id: `act_${crypto.randomBytes(6).toString('hex')}`,
    actorRole: 'CUSTOMER_WEB',
    entityType: 'LEAD',
    entityId: leadId,
    action: 'LEAD_CREATED',
    summary: `Lead ${referenceCode} created by ${customer.fullName} via ${input.flowType} flow (${savedPhotos.length} photo(s)).`,
    createdAt: now,
  };
  db.activityLogs.unshift(activity);

  writePlatformStore(db);

  return {
    referenceCode,
    leadId,
    jobRequestId,
    customerId: customer.id,
    photoCount: savedPhotos.length,
    photos: savedPhotos.map((p) => ({
      id: p.id,
      storageKey: p.storageKey,
      originalFilename: p.originalFilename,
    })),
    createdAt: now,
  };
}
