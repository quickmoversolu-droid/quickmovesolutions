# QUICKMOVE SOLUTIONS — MASTER IMPLEMENTATION ROADMAP (`PROJECT_PLAN.md`)

**Project:** QuickMove Solutions Digital Business Platform  
**Primary Location:** Calgary, Alberta, Canada  
**Official Website:** https://quickmovesolution.com/  
**Official Contact:** (587) 999-9565 (`tel:+15879999565`) | `quickmoversolu@gmail.com`  
**Brand Tagline:** *"Moving Made Easy. Space Made Clear."*

---

## Overview

This document defines the strict phase-by-phase execution plan for building QuickMove Solutions' complete digital operating system. No phase may be skipped, and no phase is marked complete until its acceptance criteria are verified and documented in `PROGRESS.md` and `TESTING.md`.

---

## PHASE 0 — PROJECT AUDIT AND ARCHITECTURE *(Current Phase — Complete)*

**Goal:** Understand the existing project and establish a safe implementation plan.

### Key Findings
- **Existing Codebase:** Greenfield workspace containing `KNOWLEDGE.md` (2,251 lines). No legacy frontend, backend, or database files exist.
- **Proposed Stack:** Next.js (App Router) + React + TypeScript + Tailwind CSS + PostgreSQL (Prisma ORM) + Auth.js RBAC + React Three Fiber / Framer Motion + Private Storage Adapter + Official Meta Graph API & AI Marketing Engine.

### Deliverables
- [x] `PROJECT_PLAN.md`
- [x] `ARCHITECTURE.md`
- [x] `PROGRESS.md`
- [x] `INTEGRATIONS.md`
- [x] `DATABASE.md`
- [x] `TESTING.md`

**Completion Gate:** Owner reviews and approves the proposed architecture before Phase 1 begins.

---

## PHASE 1 — DESIGN SYSTEM AND BRAND FOUNDATION

**Goal:** Establish the premium QuickMove Solutions design system and foundational Next.js project scaffold.

### Tasks
1. Initialize Next.js + TypeScript + Tailwind CSS project structure without breaking existing documentation.
2. Configure official brand colour tokens:
   - **Navy (`#101D35`):** Main brand identity colour
   - **Orange (`#F47732`):** Primary CTAs and highlights
   - **White (`#FFFFFF`):** Primary background
   - **Light Grey (`#F4F6F8`):** Alternate section backgrounds
   - **Charcoal (`#222A35`):** Primary body text
3. Configure typography hierarchy (`Manrope` for headings, `Inter` for body and UI controls) with responsive fluid sizing.
4. Centralize official business constants (`(587) 999-9565`, `quickmoversolu@gmail.com`, Calgary primary location, Airdrie, Strathmore, Red Deer, Edmonton service areas, Facebook & Instagram URLs).
5. Build core reusable UI component library:
   - `Button` (Primary Orange CTA, Secondary Navy, Outline, Ghost, Call CTA)
   - `Input`, `Select`, `Textarea`, `Checkbox`, `RadioCard`, `FileDropzone`
   - `Card`, `Badge`, `SectionContainer`, `PageHeader`, `Modal`, `Accordion`
6. Build responsive `Header` (desktop mega-menu + polished mobile drawer with prominent "Get a Quote" & click-to-call `(587) 999-9565`) and `Footer`.
7. Define motion & accessibility rules (keyboard focus rings, ARIA labels, `prefers-reduced-motion` support).

**Completion Criteria:** Design system and navigation components are consistent, accessible, and verified across desktop and mobile viewports.

---

## PHASE 2 — PREMIUM HOMEPAGE

**Goal:** Build an exceptional, high-converting homepage (`/`).

### Tasks (16 Ordered Sections)
1. **Navigation:** Sticky premium header with instant quote & phone actions.
2. **Hero Section:**
   - Headline: *"Moving Made Easy. Space Made Clear."*
   - Supporting copy: *"From residential and commercial relocations to furniture delivery and full junk removal, QuickMove Solutions helps make your next move simpler."*
   - Primary CTA: *"Get a Free Quote"* (`/get-a-quote`)
   - Secondary CTA: *"Call (587) 999-9565"* (`tel:+15879999565`)
   - Visual: Lazy-loaded interactive 3D relocation & space-clearing hero scene (React Three Fiber) with instant high-craft fallback for mobile and reduced-motion users.
3. **Service Highlights:** Quick interactive entry cards for Moving, Junk Removal, Delivery, and Packing.
4. **Trust Indicators:** Verified business facts only (no fabricated ratings or unverified awards).
5. **Main Services Overview:** Comprehensive breakdown of all 7 service lines.
6. **Residential & Commercial Moving Feature:** Tailored value propositions for homeowners, renters, and businesses.
7. **Dedicated Junk Removal Feature:** Highlighting full-service cleanouts and our photo-first estimate flow.
8. **Delivery Services Feature:** Furniture, appliances, and commercial pickup/drop-off.
9. **How It Works:** Clear step-by-step customer journey from quote to completion.
10. **Why Choose QuickMove Solutions:** Professionalism, careful handling, transparent quoting, and local expertise.
11. **Service Areas:** Interactive showcase of Calgary (Primary) plus Airdrie, Strathmore, Red Deer, and Edmonton.
12. **Verified Customer Reviews:** Structured section ready for verified Google Business Profile testimonials (never fabricated).
13. **Project Gallery:** Categorized visual showcase (never presenting AI images as completed customer jobs).
14. **Frequently Asked Questions:** Interactive accordion addressing moving, junk removal, delivery, and scheduling.
15. **Final CTA Banner:** High-contrast Navy & Orange conversion section.
16. **Footer:** Full navigation, official contact details, service area links, social links, and legal policies.

**Completion Criteria:** All 16 sections are polished, responsive, fast, accessible, and all CTAs function properly.

---

## PHASE 3 — COMPLETE PUBLIC WEBSITE

**Goal:** Build all required service, location, blog, and legal pages with unique, search-optimized content.

### Required Pages & Routes
1. `/moving-services` — Moving Services Overview
2. `/residential-moving` — Apartment, Condo, House & Townhouse Moves
3. `/commercial-moving` — Office, Equipment & Business Relocations
4. `/local-moving` — Calgary & Surrounding Community Moves
5. `/long-distance-moving` — Inter-city Relocations Across Alberta
6. `/packing-unpacking` — Packing Assistance, Furniture Protection & Materials
7. `/delivery-services` — Furniture, Large-Item & Business Deliveries
8. `/junk-removal` — Dedicated Full Junk Removal Service Line (with approved item guidelines & hazardous waste disclaimers)
9. `/service-areas` — Regional Hub Page
10. `/moving-company-calgary` — Primary Market Page (Calgary)
11. `/moving-company-airdrie` — Unique Service Area Page (Airdrie)
12. `/moving-company-strathmore` — Unique Service Area Page (Strathmore)
13. `/moving-company-red-deer` — Unique Service Area Page (Red Deer)
14. `/moving-company-edmonton` — Unique Service Area Page (Edmonton)
15. `/about-us` — Company Mission, Standards & Values
16. `/contact` — Direct Contact Form, Phone, Email & Service Area Coverage
17. `/blog` & `/blog/[slug]` — Blog System populated with the 9 foundational articles specified in Section 14.5
18. `/privacy-policy`, `/terms-and-conditions`, `/junk-removal-policy` — Legal & Operational Policy Pages

**Completion Criteria:** Every page has unique, non-duplicated content, proper SEO metadata, responsive layout, and working CTAs.

---

## PHASE 4 — ADVANCED QUOTE AND CUSTOMER ACQUISITION SYSTEM

**Goal:** Build the interactive customer acquisition wizards and connect them to validated backend records.

### Tasks
1. **Visual Moving Quote Experience (`/get-a-quote/moving` — 8 Steps):**
   - Step 1: Moving service selection cards (Residential, Apartment, House, Commercial, Local, Long-distance, Other)
   - Step 2: Pickup & destination addresses, city, postal code, access details
   - Step 3: Preferred moving date, flexible date option, time window
   - Step 4: Visual property size cards (Studio to 5+ Bedrooms, Commercial, Not sure)
   - Step 5: Inventory & requirements (Furniture, appliances, fragile/heavy items, packing/unpacking, stairs, elevator, parking, long walk, extra stops, optional photo uploads)
   - Step 6: Contact details & preferred contact method
   - Step 7: Complete interactive review with inline step editing
   - Step 8: Validated server submission, reference number generation (`QM-MOV-...`), confirmation view
2. **Photo-First Junk Removal Experience (`/get-a-quote/junk-removal` — 6 Steps):**
   - Step 1: Multi-select item categories (Furniture, Sofa, Mattress, Appliances, Electronics, Household junk, Garage/Basement clutter, Office items, Property cleanout, Other)
   - Step 2: Mobile-optimized camera/file multi-photo upload with previews, replacement, removal, and per-photo notes
   - Step 3: Preliminary volume selection cards (A few items, Small/Medium/Large load, Full cleanout, Not sure)
   - Step 4: Pickup address, property type, indoor/outdoor, stairs/elevator, parking, access, preferred date
   - Step 5: Customer contact details
   - Step 6: Summary & photo review, server submission (`QM-JNK-...`), future-ready AI assessment hook
3. **Delivery & Commercial Flows (`/get-a-quote/delivery`):**
   - Dedicated pickup/drop-off item and business scheduling fields.
4. **Backend & Storage Connection:**
   - Server-side Zod validation, rate limiting, spam protection, database persistence (`Customers`, `Leads`, `JobRequests`, `JobPhotos`), private file storage, and customer/admin notification triggers.

**Completion Criteria:** Every quote flow works end-to-end, stores photos securely, generates a reference code, and creates real CRM records.

---

## PHASE 5 — DATABASE AND SECURE ADMIN FOUNDATION

**Goal:** Build the relational database, authentication, RBAC, and SaaS admin shell (`/admin`).

### Tasks
1. Finalize Prisma schema and migrations for all core and marketing entities.
2. Implement secure authentication and initial Owner account provisioning.
3. Configure Role-Based Access Control (`OWNER`, `ADMIN`, `DISPATCHER`, `EMPLOYEE`, `CUSTOMER`).
4. Build the `/admin` SaaS application shell (collapsible sidebar, top search bar, notification center, user profile menu, responsive layout).
5. Enforce server-side authorization middleware across all `/admin` pages and API routes.
6. Configure private file/photo retrieval endpoints for authorized staff.

**Completion Criteria:** Owner can log in securely; unauthorized users are blocked from all admin routes and private records.

---

## PHASE 6 — CRM AND OPERATIONAL DASHBOARD

**Goal:** Build the complete lead, customer, job, checklist, and resource management system.

### Tasks
1. **Executive & Operational Dashboard (`/admin`):**
   - Lead & job KPI cards (Total, New, Awaiting Contact, Quotes Pending/Sent/Accepted, Confirmed Bookings, Today's/Upcoming/In-Progress/Completed/Cancelled Jobs).
   - Segregated Revenue Pipeline (`Potential`, `Quoted`, `Accepted`, `Booked`, `Completed`, `Paid`) — never counting raw inquiries as revenue.
2. **Lead Management (`/admin/leads`):**
   - 11-stage pipeline (`New` → `Contacted` → `Quote Pending` → `Quote Sent` → `Follow-up Required` → `Accepted` → `Booked` → `In Progress` → `Completed` → `Cancelled` → `Lost`).
   - Search, filter, sort, staff assignment, internal notes, photo inspection, and one-click conversion to Quote/Job.
3. **Customer Management (`/admin/customers`):**
   - Deduplicated customer profiles linking all historical inquiries, quotes, bookings, jobs, and communications.
4. **Central Job Management & Checklists (`/admin/jobs`):**
   - 10-stage job lifecycle (`NEW LEAD` through `FOLLOW-UP`) with immutable `ActivityLogs`.
   - Configurable service checklists (Moving Checklist, Junk Removal Checklist, Delivery Checklist).
5. **Employee & Vehicle Management (`/admin/resources`):**
   - Staff profiles, roles, teams, availability, vehicle fleet, capacity, and maintenance notes.

**Completion Criteria:** Inquiries flow seamlessly into Leads, Customers, and Jobs with full persistence and audit logging.

---

## PHASE 7 — QUOTATION SYSTEM

**Goal:** Build the end-to-end itemized quotation builder, PDF generator, and customer acceptance workflow.

### Tasks
1. Itemized Quote Builder (`/admin/quotes`) supporting Labour, Vehicle, Packing, Materials, Junk Removal, Delivery, Additional Services, Fees, Discounts, and configurable Taxes (no hardcoded/invented prices).
2. Strict server-side financial calculation of subtotals, tax amounts, discounts, and grand totals.
3. Quote status tracking (`DRAFT`, `SENT`, `ACCEPTED`, `DECLINED`, `EXPIRED`).
4. Live Quote Preview and Branded PDF Generation featuring official QuickMove Solutions contact details and terms.
5. Email dispatch with secure customer review & acceptance link.

**Completion Criteria:** Administrators can create, edit, preview, generate PDFs, send, and track quotations end-to-end.

---

## PHASE 8 — BOOKING, CALENDAR AND RESOURCE MANAGEMENT

**Goal:** Build the multi-view scheduling calendar with conflict detection and resource assignment.

### Tasks
1. Interactive Calendar (`/admin/bookings`) with Daily, Weekly, and Monthly views.
2. Explicit distinction between customer `Requested Date` and admin-authorized `Confirmed Booking`.
3. Team and Vehicle assignment with automated server-side conflict detection (preventing double-booking of crews or trucks).
4. Rescheduling, cancellation, booking reminders, and job completion recording.

**Completion Criteria:** Administrators can schedule jobs across Daily/Weekly/Monthly calendars with active conflict prevention.

---

## PHASE 9 — CUSTOMER PORTAL

**Goal:** Provide customers with secure self-service access to their own quotes, bookings, and documents (`/portal`).

### Tasks
1. Secure customer authentication (magic link / access code + password support).
2. Strict tenant isolation (customers can only view records matching their authenticated `customerId`).
3. Customer Dashboard showing submitted quote requests, itemized quotations (with Accept/Decline actions), booking statuses, downloadable Quote PDFs, and change request forms.
4. Complete exclusion of internal CRM notes and staff-only fields.

**Completion Criteria:** Customers can securely log in, review/accept quotes, check booking status, and request updates without seeing internal CRM data.

---

## PHASE 10 — AI MARKETING MANAGER

**Goal:** Build QuickMove Solutions' internal AI-powered marketing department inside `/admin/marketing`.

### Tasks (All 12 Sub-Modules)
1. **Marketing Overview:** Quick KPIs, upcoming scheduled posts, approval queue count, and connected account status.
2. **AI Content Studio:** Natural-language prompt interface grounded in verified QuickMove business knowledge (`America/Edmonton` timezone) generating Hook, Platform-adapted Caption, CTA, Hashtags, Image Concept, Suggested Platform, and Suggested Publishing Time across 6 content categories (Educational, Promotional, Local, Engagement, Trust Building, Seasonal).
3. **Automated Weekly & Monthly Marketing Plan Generator:** One-click **"Generate Weekly Marketing Plan"** (Monday–Sunday default cadence configurable by owner).
4. **AI Image Generation Workflow & Media Library:** Branded visual concept generator using official colours (`#101D35`, `#F47732`, etc.) for Facebook Feed, Instagram Feed, Stories, and Reels covers, stored in the Media Library (never presented as real completed customer jobs).
5. **Content Calendar:** Visual weekly/monthly calendar of drafts, pending approvals, scheduled, and published posts.
6. **Draft Posts & Pending Approval Queue:** Full approval-first workflow (Edit, Approve, Reject, Regenerate, Reschedule, Delete). Automatic publishing is off by default and requires explicit owner toggle.
7. **Social Accounts (Meta OAuth 2.0):** Official Meta Graph API connection for Facebook Page (`https://www.facebook.com/quickmovesolutions`) and Instagram Professional Account (`https://www.instagram.com/quickmoverssolution/`) with encrypted token storage and expiry monitoring.
8. **Server-Side Publishing Scheduler & Publishing Logs:** Background job runner with idempotency locks, platform response logging, failure notifications, and manual retry.
9. **Campaigns, UTM Tracking & Analytics:** Real platform metrics (when connected) and UTM attribution connecting social posts to website visits and CRM leads.

**Completion Criteria:** Owner can generate brand-safe content, manage weekly plans, approve/schedule posts, connect Meta accounts via official OAuth, and track publishing logs and UTM attribution.

---

## PHASE 11 — NOTIFICATIONS AND AUTOMATION

**Goal:** Automate transactional emails and administrative alerts across all platform lifecycle events.

### Tasks
1. Event-driven notification service supporting all Customer events (Request received, Quote prepared/sent/accepted, Booking confirmed/changed, Reminder, Job completed) and Admin events (New lead/moving/junk/delivery request, Quote accepted, Booking change requested, Social publishing failure).
2. Branded HTML email templates with official contact details (`(587) 999-9565` & `quickmoversolu@gmail.com`).
3. Persistent `Notifications` log table with delivery status, error capture, and retry queue.
4. Modular SMS notification interface prepared for future Twilio activation.

**Completion Criteria:** Every key business event triggers a logged, retry-capable notification.

---

## PHASE 12 — SEO, ANALYTICS AND EXTERNAL INTEGRATIONS

**Goal:** Complete technical SEO, local search structured data, and conversion tracking.

### Tasks
1. Unique titles, meta descriptions, canonical URLs, Open Graph tags, and breadcrumbs on every public route.
2. Dynamic `sitemap.xml` and `robots.txt`.
3. Validated Schema.org JSON-LD (`Organization`, `MovingCompany`/`LocalBusiness`, `Service`, `BreadcrumbList`, `Article`) using strictly verified facts.
4. Google Business Profile verification integration guide and Google Search Console / GA4 conversion event hooks (quote submissions, click-to-call, UTM capture).

**Completion Criteria:** All public pages pass technical SEO checks, render valid JSON-LD, and track conversion events accurately.

---

## PHASE 13 — FINAL QUALITY ASSURANCE AND PRODUCTION LAUNCH

**Goal:** End-to-end verification, security audit, performance tuning, and production launch readiness.

### Tasks
1. Execute all 27 verification checks defined in Phase 13 of `KNOWLEDGE.md`.
2. Verify mobile responsiveness, keyboard accessibility, reduced-motion fallbacks, and Core Web Vitals.
3. Verify RBAC security, rate limiting, file upload restrictions, and environment variable configuration.
4. Purge any test records and deliver the final Production Launch Report.

**Completion Criteria:** The platform is stable, secure, fast, documented, and ready for real customer and administrative operations.

