# QUICKMOVE SOLUTIONS — DATABASE ARCHITECTURE (`DATABASE.md`)

**ORM:** Prisma ORM  
**Primary Database Engine:** PostgreSQL (with local development support)  
**Timezone Standard:** `America/Edmonton` (stored as UTC timestamps with timezone-aware formatting)

---

## 1. Entity Relationship Overview

The database is structured around two connected domains sharing unified authentication and audit logging:
1. **Core Business & Operations Domain (19 Entities):** Manages users, customers, inquiries/leads, multi-step job requests, private photos, itemized quotations, resource-checked bookings, employees, teams, vehicles, checklists, notifications, and settings.
2. **AI Marketing & Social Publishing Domain (12 Entities):** Manages campaigns, official Meta OAuth social accounts, AI-generated posts, media assets, platform targets, content calendar slots, approval history, background publishing jobs/logs, analytics, and UTM lead attribution.

---

## 2. Core Business Entities (19 Tables)

| # | Entity / Table | Primary Purpose & Key Fields |
|---|---|---|
| 1 | `Users` | Authenticated accounts (`id`, `email`, `passwordHash`, `name`, `phone`, `roleId`, `isActive`, `lastLoginAt`, `createdAt`, `updatedAt`). |
| 2 | `Roles` | Role definitions & JSON permission sets (`OWNER`, `ADMIN`, `DISPATCHER`, `EMPLOYEE`, `CUSTOMER`). |
| 3 | `Customers` | Deduplicated customer profiles (`id`, `userId?`, `fullName`, `email`, `phone`, `preferredContact`, `address`, `city`, `postalCode`, `notes`, `createdAt`). Indexed on `email` and `phone`. |
| 4 | `Services` | Official service catalog (`id`, `slug`, `name`, `category` [`MOVING`, `JUNK_REMOVAL`, `DELIVERY`, `PACKING`], `description`, `isActive`). |
| 5 | `Leads` | Central CRM lead pipeline (`id`, `referenceCode`, `customerId`, `serviceId`, `status` [11 pipeline states], `source`, `utmSource`, `utmMedium`, `utmCampaign`, `assignedEmployeeId?`, `potentialValue?`, `internalNotes`, `createdAt`, `updatedAt`). |
| 6 | `JobRequests` | Detailed operational record linked to a Lead/Customer (`id`, `leadId`, `customerId`, `serviceType`, `lifecycleStage` [10 stages from `NEW_LEAD` to `FOLLOW_UP`], `pickupAddress`, `pickupCity`, `pickupPostalCode`, `pickupAccessDetails`, `destinationAddress?`, `destinationCity?`, `destinationPostalCode?`, `destinationAccessDetails?`, `preferredDate`, `isFlexibleDate`, `preferredTimeWindow`, `confirmedDate?`, `propertySize?`, `inventoryDetailsJson`, `junkCategoriesJson`, `junkVolumeEstimate?`, `specialRequirements`, `aiSummary?`, `aiVolumeSuggestion?`, `requiresManualInspection`, `completionNotes?`, `completedAt?`). |
| 7 | `JobPhotos` | Customer & operational photos (`id`, `jobRequestId`, `storageKey`, `originalFilename`, `mimeType`, `fileSizeBytes`, `caption?`, `aiDetectedCategoriesJson?`, `uploadedByRole`, `createdAt`). |
| 8 | `Quotes` | Customer quotations (`id`, `quoteNumber`, `leadId`, `jobRequestId`, `customerId`, `status` [`DRAFT`, `SENT`, `ACCEPTED`, `DECLINED`, `EXPIRED`], `subtotal`, `discountAmount`, `taxRate`, `taxName`, `taxAmount`, `totalAmount`, `terms`, `validUntil`, `pdfStorageKey?`, `sentAt?`, `acceptedAt?`, `declinedAt?`, `createdByUserId`, `createdAt`, `updatedAt`). |
| 9 | `QuoteItems` | Editable line items (`id`, `quoteId`, `category` [`LABOUR`, `VEHICLE`, `PACKING`, `MATERIALS`, `JUNK_REMOVAL`, `DELIVERY`, `ADDITIONAL_SERVICE`, `FEE`, `DISCOUNT`], `description`, `quantity`, `unitPrice`, `lineTotal`, `sortOrder`). |
| 10 | `Bookings` | Authorized scheduled jobs (`id`, `bookingNumber`, `jobRequestId`, `quoteId?`, `customerId`, `status` [`PENDING_CONFIRMATION`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `RESCHEDULED`], `scheduledDate`, `startTime`, `endTime`, `assignedTeamId?`, `assignedVehicleId?`, `confirmedByUserId?`, `confirmedAt?`, `cancellationReason?`, `createdAt`, `updatedAt`). |
| 11 | `Employees` | Staff profiles (`id`, `userId?`, `employeeCode`, `fullName`, `email`, `phone`, `roleTitle`, `status` [`ACTIVE`, `ON_LEAVE`, `INACTIVE`], `notes`, `createdAt`). |
| 12 | `Teams` | Operational crews (`id`, `name`, `leadEmployeeId?`, `isActive`, `members` relation to `Employees`). |
| 13 | `Vehicles` | Moving trucks & delivery fleet (`id`, `name`, `licensePlate`, `vehicleType`, `capacityDescription`, `status` [`AVAILABLE`, `IN_USE`, `MAINTENANCE`, `OUT_OF_SERVICE`], `maintenanceNotes`, `nextMaintenanceDate?`). |
| 14 | `Availability` | Resource availability blocks & time-off (`id`, `resourceType` [`EMPLOYEE`, `TEAM`, `VEHICLE`], `employeeId?`, `teamId?`, `vehicleId?`, `date`, `startTime`, `endTime`, `isAvailable`, `reason?`). |
| 15 | `JobChecklists` | Checklist instances attached to a `JobRequest` (`id`, `jobRequestId`, `title`, `serviceCategory`, `completedCount`, `totalCount`, `createdAt`). |
| 16 | `JobChecklistItems` | Individual checklist steps (`id`, `jobChecklistId`, `label`, `isCompleted`, `completedByUserId?`, `completedAt?`, `sortOrder`). |
| 17 | `Notifications` | Transactional email & SMS log (`id`, `eventType`, `channel` [`EMAIL`, `SMS`, `IN_APP`], `recipientType` [`CUSTOMER`, `ADMIN`], `recipientAddress`, `subject`, `bodyPreview`, `status` [`PENDING`, `SENT`, `FAILED`, `RETRYING`], `errorMessage?`, `retryCount`, `relatedLeadId?`, `relatedQuoteId?`, `relatedBookingId?`, `sentAt?`, `createdAt`). |
| 18 | `ActivityLogs` | Immutable audit trail (`id`, `actorUserId?`, `actorRole`, `entityType`, `entityId`, `action`, `previousValueJson?`, `newValueJson?`, `ipAddress?`, `createdAt`). |
| 19 | `BusinessSettings` | Configurable company & financial settings (`id`, `businessName`, `phone`, `email`, `primaryLocation`, `verifiedAddress?`, `defaultTaxName`, `defaultTaxRate`, `quoteValidityDays`, `defaultQuoteTerms`, `timezone`, `updatedAt`). |

---

## 3. AI Marketing & Social Publishing Entities (12 Tables)

| # | Entity / Table | Primary Purpose & Key Fields |
|---|---|---|
| 20 | `MarketingCampaigns` | Multi-post marketing campaigns (`id`, `name`, `slug`, `objective`, `targetService`, `targetLocation`, `utmCampaign`, `startDate`, `endDate?`, `status`, `createdAt`). |
| 21 | `SocialAccounts` | Connected Meta accounts (`id`, `platform` [`FACEBOOK_PAGE`, `INSTAGRAM_PROFESSIONAL`], `accountName`, `externalAccountId`, `profileUrl`, `encryptedAccessToken`, `tokenExpiresAt`, `permissionsGrantedJson`, `status` [`CONNECTED`, `EXPIRED`, `DISCONNECTED`, `ERROR`], `lastVerifiedAt`, `createdAt`). |
| 22 | `SocialPosts` | AI or manually drafted social posts (`id`, `campaignId?`, `category` [`EDUCATIONAL`, `PROMOTIONAL`, `LOCAL`, `ENGAGEMENT`, `TRUST_BUILDING`, `SEASONAL`], `promptUsed?`, `hook`, `caption`, `callToAction`, `hashtags`, `imageConceptDescription`, `targetService?`, `targetCity?`, `status` [`DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `SCHEDULED`, `PUBLISHING`, `PUBLISHED`, `FAILED`, `REJECTED`], `scheduledFor?`, `publishedAt?`, `createdByUserId`, `createdAt`, `updatedAt`). |
| 23 | `SocialPostMedia` | Media library & post attachments (`id`, `socialPostId?`, `title`, `storageKey`, `publicPreviewUrl?`, `format` [`FB_FEED`, `IG_FEED`, `IG_STORY`, `REEL_COVER`], `isAiGenerated`, `aiPromptUsed?`, `isApprovedForUse`, `createdAt`). |
| 24 | `SocialPostPlatforms` | Platform-specific adaptation & external post IDs (`id`, `socialPostId`, `socialAccountId`, `platform` [`FACEBOOK`, `INSTAGRAM`], `adaptedCaption`, `adaptedHashtags`, `externalPostId?`, `permalink?`, `publishStatus`, `publishedAt?`). |
| 25 | `ContentCalendar` | Weekly/monthly planned calendar slots (`id`, `planWeekStart`, `dayOfWeek`, `plannedDate`, `suggestedTime`, `contentTheme`, `category`, `socialPostId?`, `status`). |
| 26 | `MarketingApprovals` | Approval workflow audit trail (`id`, `socialPostId`, `reviewerUserId`, `decision` [`APPROVED`, `REJECTED`, `CHANGES_REQUESTED`], `comments?`, `createdAt`). |
| 27 | `PublishingJobs` | Background scheduler queue (`id`, `socialPostId`, `socialPostPlatformId`, `runAt`, `idempotencyKey`, `status` [`QUEUED`, `LOCKED`, `COMPLETED`, `FAILED`, `CANCELLED`], `attempts`, `maxAttempts`, `lockedAt?`, `completedAt?`). |
| 28 | `PublishingLogs` | Raw Meta API request/response logs (`id`, `publishingJobId`, `socialPostId`, `platform`, `httpStatus?`, `platformResponseId?`, `errorMessage?`, `rawResponseSummary?`, `createdAt`). |
| 29 | `SocialAnalytics` | Real synced platform metrics (`id`, `socialPostPlatformId?`, `socialAccountId`, `metricDate`, `impressions`, `reach`, `likes`, `comments`, `shares`, `saves`, `followerCount?`, `syncedAt`). |
| 30 | `MarketingSettings` | Marketing guardrails & automation settings (`id`, `timezone` [`America/Edmonton`], `requireOwnerApproval` [default `true`], `allowAutoPublish` [default `false`], `weeklyFacebookTarget` [default `3`], `weeklyInstagramTarget` [default `3`], `approvedClaimsJson`, `prohibitedClaimsJson`, `updatedAt`). |
| 31 | `CampaignAttribution` | Connects website sessions & CRM leads to marketing campaigns (`id`, `leadId`, `campaignId?`, `socialPostId?`, `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `landingPage`, `conversionType` [`QUOTE_SUBMISSION`, `PHONE_CLICK`, `CONTACT_FORM`], `createdAt`). |

---

## 4. Data Integrity & Security Rules

1. **No LocalStorage Persistence for Business Records:** Draft wizard state may use temporary session recovery for UX convenience, but all submitted leads, quotes, bookings, customers, and marketing records are persisted in PostgreSQL.
2. **Server-Enforced Foreign Keys & Indexes:** Composite indexes on `Bookings(scheduledDate, assignedTeamId)` and `Bookings(scheduledDate, assignedVehicleId)` support rapid conflict detection.
3. **Encrypted Credentials:** `SocialAccounts.encryptedAccessToken` is encrypted at rest using `APP_ENCRYPTION_KEY` before storage and never returned to client components.

