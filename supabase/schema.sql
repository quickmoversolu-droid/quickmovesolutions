-- =============================================================================
-- QUICKMOVE SOLUTIONS — SUPABASE POSTGRESQL SCHEMA
-- Run this once in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- =============================================================================

CREATE TABLE IF NOT EXISTS public."Customer" (
  "id" text PRIMARY KEY,
  "fullName" text NOT NULL,
  "email" text DEFAULT '',
  "phone" text DEFAULT '',
  "preferredContact" text DEFAULT 'phone',
  "address" text DEFAULT 'Calgary, AB',
  "city" text DEFAULT 'Calgary',
  "postalCode" text DEFAULT '',
  "notes" text DEFAULT '',
  "portalPasscode" text DEFAULT '',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."Lead" (
  "id" text PRIMARY KEY,
  "referenceCode" text,
  "customerId" text NOT NULL,
  "jobRequestId" text,
  "serviceType" text NOT NULL DEFAULT 'residential',
  "status" text NOT NULL DEFAULT 'NEW',
  "source" text DEFAULT 'Website',
  "utmSource" text,
  "utmMedium" text,
  "utmCampaign" text,
  "assignedEmployeeId" text,
  "internalNotes" text DEFAULT '',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."JobRequest" (
  "id" text PRIMARY KEY,
  "leadId" text,
  "customerId" text NOT NULL,
  "serviceType" text NOT NULL DEFAULT 'residential',
  "serviceCategory" text NOT NULL DEFAULT 'MOVING',
  "lifecycleStage" text NOT NULL DEFAULT 'NEW_LEAD',
  "pickupAddress" text DEFAULT 'Calgary, AB',
  "pickupCity" text DEFAULT 'Calgary',
  "pickupPostalCode" text DEFAULT '',
  "pickupAccessDetails" text DEFAULT '',
  "destinationAddress" text,
  "destinationCity" text,
  "destinationPostalCode" text,
  "destinationAccessDetails" text,
  "preferredDate" text,
  "isFlexibleDate" boolean DEFAULT false,
  "preferredTimeWindow" text DEFAULT 'flexible',
  "confirmedDate" text,
  "propertySize" text,
  "inventoryDetails" text,
  "junkCategories" jsonb DEFAULT '[]'::jsonb,
  "junkVolumeEstimate" text,
  "specialRequirements" text,
  "aiSummary" text,
  "aiVolumeSuggestion" text,
  "requiresManualInspection" boolean DEFAULT false,
  "assignedTeamId" text,
  "assignedVehicleId" text,
  "completionNotes" text,
  "completedAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."Quote" (
  "id" text PRIMARY KEY,
  "quoteNumber" text NOT NULL,
  "version" integer NOT NULL DEFAULT 1,
  "leadId" text,
  "jobRequestId" text,
  "customerId" text NOT NULL,
  "serviceType" text NOT NULL DEFAULT 'residential',
  "status" text NOT NULL DEFAULT 'DRAFT',
  "proposedDate" text,
  "proposedWindow" text,
  "validUntil" text,
  "scopeSummary" text DEFAULT '',
  "lineItems" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "subtotalCents" integer NOT NULL DEFAULT 0,
  "discountCents" integer NOT NULL DEFAULT 0,
  "taxRatePercent" double precision NOT NULL DEFAULT 5.0,
  "taxCents" integer NOT NULL DEFAULT 0,
  "totalCents" integer NOT NULL DEFAULT 0,
  "depositCents" integer NOT NULL DEFAULT 0,
  "termsAndNotes" text DEFAULT '',
  "customerResponse" text,
  "respondedAt" timestamptz,
  "sentAt" timestamptz,
  "recipientEmail" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."Invoice" (
  "id" text PRIMARY KEY,
  "invoiceNumber" text NOT NULL,
  "bookingId" text,
  "quoteId" text,
  "jobRequestId" text,
  "customerId" text NOT NULL,
  "customerName" text,
  "customerEmail" text,
  "customerPhone" text,
  "customerAddress" text,
  "serviceType" text NOT NULL DEFAULT 'residential',
  "serviceCategory" text NOT NULL DEFAULT 'MOVING',
  "status" text NOT NULL DEFAULT 'ISSUED',
  "issueDate" text NOT NULL,
  "dueDate" text NOT NULL,
  "completionDate" text,
  "lineItems" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "subtotalCents" integer NOT NULL DEFAULT 0,
  "discountCents" integer NOT NULL DEFAULT 0,
  "taxRatePercent" double precision NOT NULL DEFAULT 5.0,
  "taxCents" integer NOT NULL DEFAULT 0,
  "totalCents" integer NOT NULL DEFAULT 0,
  "depositPaidCents" integer NOT NULL DEFAULT 0,
  "amountPaidCents" integer NOT NULL DEFAULT 0,
  "balanceDueCents" integer NOT NULL DEFAULT 0,
  "paymentMethod" text DEFAULT 'INTERAC_E_TRANSFER',
  "paymentReference" text,
  "paidAt" timestamptz,
  "paymentTerms" text DEFAULT 'Payment Due Upon Completion of Service',
  "notesAndInstructions" text DEFAULT '',
  "sentAt" timestamptz,
  "recipientEmail" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."Booking" (
  "id" text PRIMARY KEY,
  "jobRequestId" text,
  "quoteId" text,
  "customerId" text NOT NULL,
  "serviceType" text DEFAULT 'residential',
  "serviceCategory" text DEFAULT 'MOVING',
  "status" text NOT NULL DEFAULT 'CONFIRMED',
  "scheduledDate" text,
  "startTime" text,
  "endTime" text,
  "arrivalWindow" text,
  "assignedTeamId" text,
  "assignedVehicleId" text,
  "crewMemberIds" jsonb DEFAULT '[]'::jsonb,
  "dispatchNotes" text DEFAULT '',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."MarketingPost" (
  "id" text PRIMARY KEY,
  "campaignId" text,
  "title" text,
  "caption" text,
  "hashtags" jsonb DEFAULT '[]'::jsonb,
  "platform" text DEFAULT 'FACEBOOK',
  "status" text DEFAULT 'DRAFT',
  "scheduledFor" timestamptz,
  "publishedAt" timestamptz,
  "imageUrl" text,
  "metaPostId" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."JobPhoto" (
  "id" text PRIMARY KEY,
  "jobRequestId" text,
  "storageKey" text,
  "originalFilename" text,
  "mimeType" text,
  "fileSizeBytes" integer DEFAULT 0,
  "publicUrl" text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."DeletedRecord" (
  "id" text PRIMARY KEY,
  "entityType" text NOT NULL,
  "deletedAt" timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables (server-side secret key bypasses RLS; public anon key has no direct access)
ALTER TABLE public."Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."JobRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Quote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."MarketingPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."JobPhoto" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DeletedRecord" ENABLE ROW LEVEL SECURITY;
