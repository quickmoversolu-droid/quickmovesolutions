# QUICKMOVE SOLUTIONS — EXTERNAL INTEGRATIONS & CREDENTIALS (`INTEGRATIONS.md`)

**Project:** QuickMove Solutions Digital Business Platform  
**Phase:** Phase 8B — REQUIRED BACKEND & AI INFRASTRUCTURE  
**Primary Backend:** InsForge (`https://insforge.dev/`)  
**Primary AI Gateway:** OpenRouter (`https://openrouter.ai/`)  
**Social Media Publishing:** Official Meta Graph API  

---

## 1. Official Platform Architecture (Phase 8B)

The QuickMove Solutions platform is built on an enterprise architecture pairing **InsForge** as the central Backend-as-a-Service with **OpenRouter** as the centralized AI Gateway.

```mermaid
flowchart LR
    A[Public Next.js Web App] -->|Quote Photos & Inquiries| B[InsForge Backend BaaS]
    C[Admin Operations & CRM] -->|Job & Crew State| B
    D[AI Marketing Manager] -->|1. Generate Copy & Image Prompts| E[OpenRouter AI Gateway]
    E -->|2. High-Res Image Generation| E
    E -->|3. Store Creatives| B
    D -->|4. Owner Approval Queue| B
    B -->|5. Authorized Publishing| F[Meta Graph API]
    F -->|Facebook Page| G[QuickMove Solutions FB]
    F -->|Instagram Professional| H[@quickmoverssolution IG]
```

---

## 2. Primary Backend — InsForge (`https://insforge.dev/`)

**InsForge is our primary backend platform.** All application records, database operations, user authentication, and media storage are grounded in InsForge.

### Core InsForge Capabilities Used
- **PostgreSQL Database & PostgREST Engine:**
  - `customers` (deduplicated customer records & contact channels)
  - `leads` (inbound quote requests with UTM attribution)
  - `job_requests` (moving inventory, junk items, delivery specs)
  - `quotes` (itemized line items, subtotal, 5% Alberta GST, total)
  - `bookings` (crew and fleet dispatch calendar)
  - `marketing_posts` (AI-generated social content & review statuses)
  - `users` (Scrypt password hashing, session versions & permissions)
- **Object Storage Buckets:**
  - `customer-photos`: Customer-uploaded photos from the Photo-First Junk Removal quote wizard.
  - `marketing-creatives`: AI-generated promotional images from OpenRouter.
  - `quote-documents`: Server-rendered quote and invoice PDF files.
- **Client SDK Integration:**
  - Integrated via `@insforge/sdk` using server-side client initialization in `src/lib/backend/insforge-service.ts`.
  - Offline / local fallback ensures zero disruption during local development when remote cloud keys are not yet bound.

---

## 3. Primary AI Gateway — OpenRouter (`https://openrouter.ai/`)

**OpenRouter is our primary AI gateway for AI-powered features, especially the AI Marketing Manager.**

### Workflows Powered by OpenRouter
1. **AI Content Studio & Social Posts:** Generates platform-specific social media captions, moving tips, junk removal marketing, and hashtags.
2. **Weekly Content Plan Generator:** Produces 5-post balanced content calendars across Alberta service markets (Calgary, Airdrie, Strathmore, Red Deer, Edmonton).
3. **AI Image Generation:** Generates branded visual concepts and prompts for commercial moving trucks, residential moves, and cleanouts.
4. **Owner AI Settings (`/admin/settings/ai`):** Allows the Super Admin to configure API keys, switch models, adjust generation parameters (temperature, max tokens), and monitor token costs.

### Supported & Configurable Models

#### Text Generation Models
- **`anthropic/claude-3.5-sonnet` (Default / Recommended):** Highest quality Canadian marketing copy, storytelling, and strategic weekly plans.
- **`openai/gpt-4o`:** Fast and versatile multi-platform captions and structured JSON extraction.
- **`meta-llama/llama-3.3-70b-instruct`:** Cost-effective daily tips and community updates.
- **`deepseek/deepseek-chat`:** High-speed structured content generation and local SEO drafting.
- **`google/gemini-2.0-flash-exp:free`:** Zero-cost development and rapid experimentation.

#### Image Generation Models
- **`black-forest-labs/flux-1.1-pro` (Default):** Photorealistic commercial box trucks, modern luxury homes, and moving crew photography.
- **`recraft/recraft-v3`:** Vector brand creatives, badges, and marketing illustrations.
- **`openai/gpt-image-2`:** Detailed scene composition and environmental concepts.

---

## 4. Social Media Publishing — Official Meta Graph API

OpenRouter generates text and images; it does **NOT** publish directly to social networks. Publishing is executed strictly through official Meta Graph APIs after Owner approval:

$$\text{OpenRouter} \xrightarrow{\text{Generate Copy \& Image}} \text{InsForge Storage} \xrightarrow{\text{Owner Review}} \text{Owner Approval} \xrightarrow{\text{Meta Graph API}} \text{Facebook / Instagram}$$

- **Facebook:** Published via `/{page-id}/feed` or `/{page-id}/photos` using page access tokens (`pages_manage_posts`, `pages_read_engagement`).
- **Instagram:** Published via `/{ig-user-id}/media` and `/{ig-user-id}/media_publish` using Instagram Content Publishing API (`instagram_content_publish`).
- **Safety Rule:** Posts are only transitioned to `PUBLISHED` state once the Meta Graph API returns an HTTP 200 with an external `post_id`.

---

## 5. API Key Security & Environment Variables

All API keys, secrets, and database credentials **MUST** be kept strictly on the server side. Never expose secrets in client-side bundles or git repositories.

### Required Environment Variables (`.env.local` / Secret Manager)

```env
# ==============================================================================
# QUICKMOVE SOLUTIONS — ENVIRONMENT CONFIGURATION
# ==============================================================================

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# 1. Primary Backend — InsForge (https://insforge.dev/)
INSFORGE_BASE_URL="https://quickmove.insforge.app"
INSFORGE_ANON_KEY="your-insforge-anon-key"
INSFORGE_SERVICE_KEY="your-insforge-service-role-key"

# 2. Primary AI Gateway — OpenRouter (https://openrouter.ai/)
OPENROUTER_API_KEY="sk-or-v1-your-openrouter-key"
OPENROUTER_TEXT_MODEL="anthropic/claude-3.5-sonnet"
OPENROUTER_IMAGE_MODEL="black-forest-labs/flux-1.1-pro"

# 3. Official Meta Graph API (Facebook & Instagram Publishing)
META_APP_ID="your-meta-app-id"
META_APP_SECRET="your-meta-app-secret"
META_PAGE_ID="quickmovesolutions"
META_IG_BUSINESS_ID="quickmoverssolution"

# 4. Security & Encryption
AUTH_SECRET="your-32-byte-random-session-signing-key"
APP_ENCRYPTION_KEY="your-32-byte-token-encryption-key"

# 5. Business Notifications (Resend / SMTP)
ADMIN_NOTIFICATION_EMAIL="quickmoversolu@gmail.com"
EMAIL_PROVIDER="console" # "console" | "resend" | "smtp"
RESEND_API_KEY=""
```

---

## 6. Verification & Troubleshooting Procedures

1. **InsForge Connection Test:**
   - Query `/api/admin/ai/settings` to verify `insforgeConfig.status`.
   - In production, ensure the `customer-photos` and `marketing-creatives` buckets are created in your InsForge dashboard with appropriate public read and authenticated write policies.
2. **OpenRouter AI Generation Test:**
   - Navigate to `/admin/settings/ai` and input your OpenRouter API key.
   - Click **Save AI Configuration** and test text and image generation.
   - Usage statistics and cost estimates update dynamically after each generation.
3. **Deterministic Fallback Verification:**
   - If `OPENROUTER_API_KEY` is not present, the system automatically engages the deterministic brand knowledge engine to produce compliant QuickMove copy without errors or timeouts.
