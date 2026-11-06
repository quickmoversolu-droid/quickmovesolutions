# QUICKMOVE SOLUTIONS — TECHNICAL ARCHITECTURE (`ARCHITECTURE.md`)

**Document Status:** Phase 0 Architecture Proposal (Awaiting Owner Approval)  
**Project:** QuickMove Solutions Digital Business Platform  
**Primary Location:** Calgary, Alberta, Canada (`America/Edmonton`)  

---

## 1. Current Codebase & Environment Audit

### 1.1 Existing Project Inspection
An inspection of the workspace (`c:\Users\Aji4r\OneDrive\Desktop\quickmovesolutions`) confirmed:
- **Existing Files:** Only `KNOWLEDGE.md` (46,959 bytes, 2,251 lines) is present.
- **Existing Codebase:** None (Greenfield project). There are no existing frontend, backend, database, or configuration files to replace or migrate.
- **Version Control:** Git is not yet initialized in this directory.
- **Local Runtime Environment:**
  - **OS:** Windows
  - **Node.js:** `v24.12.0` (`C:\Program Files\nodejs\node.exe`)
  - **npm:** `v10.2.5` (`C:\Program Files\nodejs\npm.ps1`)
  - **Environment Note:** An empty 0-byte file exists at `C:\Users\Aji4r\node` which can shadow the `node` command if `C:\Users\Aji4r` precedes `C:\Program Files\nodejs` in shell lookup. We will ensure scripts use standard PATH resolution or remove/bypass that empty file if approved.

---

## 2. Recommended System Architecture

Because we are building a unified **Digital Operating System** combining five core systems (Public Website, Customer Acquisition Flows, CRM & Operations, Quotation & Booking System, and AI Marketing Manager), we recommend a **Modular Monolith in Next.js (App Router) with TypeScript and PostgreSQL**.

### 2.1 High-Level Application Boundaries

The platform is organized into three connected applications sharing a single backend, database, and domain layer:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     QUICKMOVE SOLUTIONS PLATFORM (Next.js)                 │
├────────────────────────┬─────────────────────────┬─────────────────────────┤
│   1. PUBLIC WEBSITE    │  2. CUSTOMER EXPERIENCE │   3. ADMIN APPLICATION  │
│  (SSR / SSG Marketing) │  (Interactive Wizards   │   (Secure SaaS CRM,     │
│                        │   & Customer Portal)    │    Ops & AI Marketing)  │
├────────────────────────┴─────────────────────────┴─────────────────────────┤
│                    SHARED APPLICATION & DOMAIN SERVICES                    │
│  • Lead & CRM Service          • Quotation & PDF Engine                    │
│  • Booking & Conflict Engine   • Notification & Email Dispatcher           │
│  • AI Marketing Studio Engine  • Meta Graph API Publishing Scheduler       │
├────────────────────────────────────────────────────────────────────────────┤
│                     DATA & INFRASTRUCTURE LAYER                            │
│  • PostgreSQL + Prisma ORM     • Private Object Storage (Photos & PDFs)    │
│  • Role-Based Auth (RBAC)      • Background Job Processor / Cron Runner    │
└────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack Selection

| Layer | Recommended Technology | Justification |
|---|---|---|
| **Framework** | **Next.js 15 (App Router) + React 19** | Combines fast server-rendered SEO pages (Public Website) with rich interactive client views (Quote Wizards, Admin SaaS Dashboard, Customer Portal) and Server Actions / Route Handlers in one cohesive codebase. |
| **Language** | **TypeScript (Strict Mode)** | End-to-end type safety across database models, API payloads, quote calculations, and UI components. |
| **Styling & Design System** | **Tailwind CSS + Custom Design Tokens** | Enforces official QuickMove brand palette (`#101D35` Navy, `#F47732` Orange, `#FFFFFF` White, `#F4F6F8` Light Grey, `#222A35` Charcoal), responsive typography (`Manrope` + `Inter`), and accessible UI primitives. |
| **3D & Motion** | **React Three Fiber (`@react-three/fiber`, `drei`) + Framer Motion** | Enables an optimized, lazy-loaded 3D homepage hero experience with automatic mobile/reduced-motion fallbacks and zero blocking of LCP/CTA interactivity. |
| **Database & ORM** | **PostgreSQL + Prisma ORM** | Strict relational modeling for all 31+ core and marketing entities, declarative migrations, foreign-key integrity, and transactional safety. *(During local development prior to cloud DB provisioning, Prisma supports local PostgreSQL or SQLite dev fallback with identical application queries).* |
| **Validation** | **Zod + React Hook Form** | Shared schema validation across multi-step quote wizards and server endpoints. Never trusts client-side financial totals or unvalidated inputs. |
| **Authentication & RBAC** | **Auth.js (NextAuth v5) / Encrypted Session Auth** | Role-Based Access Control (`OWNER`, `ADMIN`, `DISPATCHER`, `EMPLOYEE`, `CUSTOMER`). Protects `/admin/*` and `/api/admin/*` routes on the server. |
| **File & Photo Storage** | **Storage Adapter Pattern (S3 / Cloudflare R2 + Local Private Storage)** | Private storage for customer-uploaded junk removal/moving photos, generated quote PDFs, and AI Marketing media library assets. Served only via authenticated or signed URLs. |
| **PDF Generation** | **Server-Side Branded PDF Generator** | Generates clean, printable, branded QuickMove Solutions quotations with server-calculated line items, taxes, and terms. |
| **Email & Notifications** | **Event-Driven Notification Service (Resend / SMTP)** | Logs every notification in the `Notifications` table, supports HTML email templates, retry handling, and an extensible SMS adapter interface (Twilio-ready). |
| **AI Marketing Engine** | **Google Gemini API / OpenAI SDK (Server-Side)** | Grounded strictly in verified QuickMove business rules (`KNOWLEDGE.md`), generating structured hooks, captions, CTAs, hashtags, image concepts, and weekly plans without inventing prices, discounts, or reviews. |
| **Social Publishing & Scheduler** | **Official Meta Graph API + DB-Backed Job Queue** | Uses official OAuth 2.0 tokens for Facebook Pages and Instagram Professional accounts, encrypted at rest, processed by a server-side background scheduler with idempotency locks. |

---

## 3. Directory & Module Structure

```text
quickmovesolutions/
├── docs/                          # Additional technical & operational guides
├── prisma/
│   ├── schema.prisma              # Complete relational database schema
│   ├── migrations/                # Versioned SQL migrations
│   └── seed.ts                    # Initial services, checklists, and owner setup
├── public/
│   ├── images/                    # Optimized public brand assets & icons
│   └── models/                    # Compressed 3D assets (if external GLTF used)
├── src/
│   ├── app/
│   │   ├── (public)/              # Public Website (SEO-optimized SSR/SSG)
│   │   │   ├── page.tsx           # Homepage (16 structured sections + 3D Hero)
│   │   │   ├── moving-services/
│   │   │   ├── residential-moving/
│   │   │   ├── commercial-moving/
│   │   │   ├── local-moving/
│   │   │   ├── long-distance-moving/
│   │   │   ├── packing-unpacking/
│   │   │   ├── delivery-services/
│   │   │   ├── junk-removal/
│   │   │   ├── service-areas/
│   │   │   ├── moving-company-calgary/
│   │   │   ├── moving-company-airdrie/
│   │   │   ├── moving-company-strathmore/
│   │   │   ├── moving-company-red-deer/
│   │   │   ├── moving-company-edmonton/
│   │   │   ├── about-us/
│   │   │   ├── contact/
│   │   │   ├── blog/
│   │   │   ├── privacy-policy/
│   │   │   ├── terms-and-conditions/
│   │   │   └── junk-removal-policy/
│   │   ├── get-a-quote/           # Interactive Customer Acquisition Wizards
│   │   │   ├── page.tsx           # Service selector & unified entry
│   │   │   ├── moving/            # 8-Step Visual Moving Quote Experience
│   │   │   ├── junk-removal/      # 6-Step Photo-First Junk Removal Experience
│   │   │   └── delivery/          # Delivery & Commercial Quote Flow
│   │   ├── portal/                # Phase 9: Secure Customer Portal
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── quotes/[id]/
│   │   │   └── bookings/[id]/
│   │   ├── admin/                 # Phases 5–10: Secure Admin SaaS Platform
│   │   │   ├── login/
│   │   │   ├── page.tsx           # Executive & Operational Overview
│   │   │   ├── leads/             # Lead Pipeline & Management
│   │   │   ├── customers/         # Customer Database & History
│   │   │   ├── jobs/              # Central Job Lifecycle & Checklists
│   │   │   ├── quotes/            # Quotation Builder & PDF Engine
│   │   │   ├── bookings/          # Daily/Weekly/Monthly Calendar & Conflict Detection
│   │   │   ├── resources/         # Employees, Teams & Vehicles
│   │   │   ├── marketing/         # Phase 10: AI Marketing Manager (12 sub-modules)
│   │   │   ├── notifications/     # Notification Logs & Retry Queue
│   │   │   └── settings/          # Business & Tax Settings
│   │   ├── api/                   # Validated REST / Webhook / Cron Route Handlers
│   │   ├── sitemap.ts             # Dynamic XML Sitemap
│   │   └── robots.ts              # Robots.txt configuration
│   ├── components/
│   │   ├── ui/                    # Phase 1 Design System primitives (Button, Card, Input, Badge, Modal, etc.)
│   │   ├── layout/                # Header, Mobile Drawer, Footer, Admin Sidebar
│   │   ├── three/                 # Lazy-loaded 3D Hero Scene & Fallback Visuals
│   │   ├── marketing-site/        # Reusable public website sections
│   │   ├── quote-wizards/         # Stepper, visual cards, mobile photo uploader
│   │   ├── admin/                 # CRM tables, pipeline boards, quote editor, calendar
│   │   └── seo/                   # Schema.org JSON-LD generators & breadcrumbs
│   ├── lib/
│   │   ├── db/                    # Prisma client & transaction helpers
│   │   ├── auth/                  # Session verification, RBAC guards, password hashing
│   │   ├── storage/               # Private file upload validation & signed URL adapter
│   │   ├── pdf/                   # Quotation PDF generator
│   │   ├── notifications/         # Event-based email & future SMS dispatcher
│   │   ├── ai/                    # Brand-grounded AI Marketing prompt & generation service
│   │   ├── social/                # Official Meta Graph API client & scheduler worker
│   │   ├── validations/           # Shared Zod schemas for leads, quotes, bookings, marketing
│   │   └── constants/             # Official business info, contact constants, pipeline states
│   └── types/                     # Shared TypeScript interfaces
├── KNOWLEDGE.md                   # Master Specification
├── PROJECT_PLAN.md                # Phase-by-phase implementation roadmap
├── ARCHITECTURE.md                # This document
├── DATABASE.md                    # Complete relational schema specification
├── INTEGRATIONS.md                # External APIs, credentials & setup guide
├── PROGRESS.md                    # Phase tracker & status log
└── TESTING.md                     # QA test plan & verification logs
```

---

## 4. Core Architectural Principles & Safeguards

1. **Single Source of Truth for Official Business Information:**
   All contact constants (`(587) 999-9565`, `tel:+15879999565`, `quickmoversolu@gmail.com`, `https://quickmovesolution.com/`, Facebook & Instagram URLs, Calgary primary location, and service areas) are centralized in `src/lib/constants/business.ts` so no page, PDF, or AI prompt can ever use outdated or fabricated details.
2. **Server-Side Financial & Business Logic:**
   - Quotation line items, subtotals, configurable taxes, discounts, and totals are **always calculated and verified on the server**.
   - Revenue metrics on the Admin Dashboard are strictly segregated into `Potential`, `Quoted`, `Accepted`, `Booked`, `Completed`, and `Paid`. Inquiries are never counted as revenue.
3. **Strict Booking Authorization & Conflict Prevention:**
   - Customer-submitted dates are stored as `preferredDate` on the Lead/JobRequest.
   - A `Booking` record with `CONFIRMED` status can only be created or confirmed by an authorized administrator, with server-side conflict detection checking team and vehicle availability across overlapping time windows.
4. **Private Customer Media & Future AI Readiness:**
   - Uploaded moving and junk removal photos are validated for file type (`image/jpeg`, `image/png`, `image/webp`, `image/heic`), size limits, and stored in private storage linked via `JobPhotos`.
   - The `JobPhotos` and `JobRequests` schema includes structured metadata fields (`aiCategoryTags`, `aiVolumeEstimate`, `aiSummary`, `requiresManualReview`) ready for optional AI photo assessment without ever auto-quoting prices or accepting hazardous waste.
5. **Safe, Approval-First AI Marketing & Meta Publishing:**
   - The AI Content Studio embeds a strict system guardrail enforcing QuickMove Solutions' brand facts and prohibiting fabricated prices, discounts, reviews, ratings, insurance claims, or awards.
   - Every generated post enters `DRAFT` or `PENDING_APPROVAL`. Automatic publishing is disabled by default and requires explicit owner activation plus verified Meta OAuth credentials.

---

## 5. Key Technical Decisions Requiring Owner Approval

Before proceeding to **Phase 1**, please confirm or adjust the following technical choices:

1. **Framework & Stack:** Next.js (App Router) + TypeScript + Tailwind CSS in a unified repository serving the Public Website, Quote Wizards, Customer Portal (`/portal`), and Admin Platform (`/admin`).
2. **Database Strategy:** PostgreSQL with Prisma ORM. For immediate development in Phases 1–6 before cloud credentials are provided, should we configure a local SQLite/PostgreSQL development database via Prisma so all features can be built and tested locally right away, ready to point to your production PostgreSQL URL (`DATABASE_URL`) at any time?
3. **3D Hero Approach (Phase 2):** A custom, lightweight React Three Fiber (`Three.js`) interactive 3D relocation/space-clearing scene with instant static/CSS fallback for mobile devices and `prefers-reduced-motion` users.
4. **Shell Environment Fix:** Removing or renaming the empty 0-byte file at `C:\Users\Aji4r\node` so standard `node` CLI commands resolve cleanly to `C:\Program Files\nodejs\node.exe` (`v24.12.0`).
