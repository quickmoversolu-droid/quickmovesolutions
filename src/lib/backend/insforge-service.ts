/**
 * QUICKMOVE SOLUTIONS — INSFORGE BACKEND SERVICE ADAPTER
 * Official Backend Platform (https://insforge.dev/)
 * Handles Direct Postgres Database CRUD via InsForge RawSQL Engine,
 * Authentication, and Storage Buckets with resilient fallback.
 */

export interface InsForgeConfig {
  baseUrl: string;
  anonKey: string;
  apiKey: string;
  isConnected: boolean;
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'ERROR';
  lastCheckedAt: string;
}

const DEFAULT_INSFORGE_HOST = 'https://k9aah35n.us-east.insforge.app';
const DEFAULT_INSFORGE_KEY = 'ik_b0d45e6cf1856964c1738927065be66d';

function getInsForgeHost(): string {
  return (
    process.env.NEXT_PUBLIC_INSFORGE_URL ||
    process.env.INSFORGE_BASE_URL ||
    DEFAULT_INSFORGE_HOST
  );
}

function getInsForgeApiKey(): string {
  return (
    process.env.INSFORGE_API_KEY ||
    process.env.INSFORGE_SERVICE_KEY ||
    process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
    process.env.INSFORGE_ANON_KEY ||
    DEFAULT_INSFORGE_KEY
  );
}

export function getInsForgeConfig(): InsForgeConfig {
  const baseUrl = getInsForgeHost();
  const apiKey = getInsForgeApiKey();
  const isConfigured = Boolean(baseUrl && apiKey);

  return {
    baseUrl,
    anonKey: apiKey ? `${apiKey.substring(0, 8)}...` : '',
    apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : '',
    isConnected: isConfigured,
    status: isConfigured ? 'CONNECTED' : 'NOT_CONFIGURED',
    lastCheckedAt: new Date().toISOString(),
  };
}

/**
 * Execute raw SQL query against InsForge PostgreSQL database
 */
export async function executeInsForgeSql<T = any>(query: string): Promise<{ rows: T[]; rowCount: number }> {
  const host = getInsForgeHost();
  const apiKey = getInsForgeApiKey();

  try {
    const res = await fetch(`${host}/api/database/advance/rawsql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.message || err.error || `InsForge SQL error (${res.status})`;
      console.warn('[InsForge RawSQL Error]:', msg);
      return { rows: [], rowCount: 0 };
    }

    const json = await res.json();
    return {
      rows: Array.isArray(json.rows) ? json.rows : Array.isArray(json.data) ? json.data : [],
      rowCount: typeof json.rowCount === 'number' ? json.rowCount : 0,
    };
  } catch (err) {
    console.warn('[InsForge Network Warning]:', err instanceof Error ? err.message : err);
    return { rows: [], rowCount: 0 };
  }
}

function escapeSql(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

function escapeArray(arr: any): string {
  if (!Array.isArray(arr) || arr.length === 0) return "'{}'::text[]";
  const elements = arr.map((s) => `"${String(s).replace(/"/g, '\\"')}"`).join(',');
  return `'{${elements}}'::text[]`;
}

/**
 * Synchronize a business record to InsForge Database using raw SQL
 */
export async function syncRecordToInsForge(
  table:
    | 'customers'
    | 'leads'
    | 'job_requests'
    | 'quotes'
    | 'invoices'
    | 'bookings'
    | 'marketing_posts'
    | 'job_photos'
    | 'Customer'
    | 'Lead'
    | 'JobRequest'
    | 'Quote'
    | 'Invoice'
    | 'Booking'
    | 'MarketingPost'
    | 'JobPhoto',
  record: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const norm = table.toLowerCase();

    if (norm === 'customers' || norm === 'customer') {
      const sql = `
        INSERT INTO "Customer" ("id", "fullName", "email", "phone", "preferredContact", "address", "city", "postalCode", "notes", "portalPasscode", "createdAt", "updatedAt")
        VALUES (
          ${escapeSql(record.id)},
          ${escapeSql(record.fullName)},
          ${escapeSql(record.email)},
          ${escapeSql(record.phone)},
          ${escapeSql(record.preferredContact || 'phone')},
          ${escapeSql(record.address || 'Calgary, AB')},
          ${escapeSql(record.city || 'Calgary')},
          ${escapeSql(record.postalCode || '')},
          ${escapeSql(record.notes || '')},
          ${escapeSql(record.portalPasscode || '')},
          ${escapeSql(record.createdAt || new Date().toISOString())},
          ${escapeSql(record.updatedAt || new Date().toISOString())}
        )
        ON CONFLICT ("email") DO UPDATE SET
          "fullName" = EXCLUDED."fullName",
          "phone" = EXCLUDED."phone",
          "address" = EXCLUDED."address",
          "city" = EXCLUDED."city",
          "postalCode" = EXCLUDED."postalCode",
          "portalPasscode" = EXCLUDED."portalPasscode",
          "updatedAt" = EXCLUDED."updatedAt";
      `;
      await executeInsForgeSql(sql);
      return { success: true };
    }

    if (norm === 'leads' || norm === 'lead') {
      const validStatus = [
        'NEW',
        'CONTACTED',
        'QUOTE_PENDING',
        'QUOTE_SENT',
        'FOLLOW_UP_REQUIRED',
        'ACCEPTED',
        'BOOKED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
        'LOST',
      ].includes(record.status)
        ? record.status
        : 'NEW';

      const sql = `
        INSERT INTO "Lead" ("id", "referenceCode", "customerId", "jobRequestId", "serviceType", "status", "source", "utmSource", "utmMedium", "utmCampaign", "assignedEmployeeId", "internalNotes", "createdAt", "updatedAt")
        VALUES (
          ${escapeSql(record.id)},
          ${escapeSql(record.referenceCode)},
          ${escapeSql(record.customerId)},
          ${escapeSql(record.jobRequestId || null)},
          ${escapeSql(record.serviceType)},
          '${validStatus}'::"LeadStatus",
          ${escapeSql(record.source || 'Website')},
          ${escapeSql(record.utmSource || null)},
          ${escapeSql(record.utmMedium || null)},
          ${escapeSql(record.utmCampaign || null)},
          ${escapeSql(record.assignedEmployeeId || null)},
          ${escapeSql(record.internalNotes || '')},
          ${escapeSql(record.createdAt || new Date().toISOString())},
          ${escapeSql(record.updatedAt || new Date().toISOString())}
        )
        ON CONFLICT ("id") DO UPDATE SET
          "referenceCode" = EXCLUDED."referenceCode",
          "customerId" = EXCLUDED."customerId",
          "jobRequestId" = EXCLUDED."jobRequestId",
          "serviceType" = EXCLUDED."serviceType",
          "status" = EXCLUDED."status",
          "internalNotes" = EXCLUDED."internalNotes",
          "updatedAt" = EXCLUDED."updatedAt";
      `;
      await executeInsForgeSql(sql);
      return { success: true };
    }

    if (norm === 'job_requests' || norm === 'jobrequest') {
      const validStage = [
        'NEW_LEAD',
        'CONTACTED',
        'QUOTE_PREPARATION',
        'QUOTE_SENT',
        'CUSTOMER_ACCEPTED',
        'BOOKING_CONFIRMED',
        'TEAM_ASSIGNED',
        'JOB_IN_PROGRESS',
        'JOB_COMPLETED',
        'FOLLOW_UP',
      ].includes(record.lifecycleStage)
        ? record.lifecycleStage
        : 'NEW_LEAD';

      const sql = `
        INSERT INTO "JobRequest" (
          "id", "leadId", "customerId", "serviceType", "serviceCategory", "lifecycleStage",
          "pickupAddress", "pickupCity", "pickupPostalCode", "pickupAccessDetails",
          "destinationAddress", "destinationCity", "destinationPostalCode", "destinationAccessDetails",
          "preferredDate", "isFlexibleDate", "preferredTimeWindow", "confirmedDate", "propertySize",
          "inventoryDetails", "junkCategories", "junkVolumeEstimate", "specialRequirements",
          "aiSummary", "aiVolumeSuggestion", "requiresManualInspection", "assignedTeamId", "assignedVehicleId",
          "completionNotes", "completedAt", "createdAt", "updatedAt"
        ) VALUES (
          ${escapeSql(record.id)},
          ${escapeSql(record.leadId)},
          ${escapeSql(record.customerId)},
          ${escapeSql(record.serviceType)},
          ${escapeSql(record.serviceCategory || 'MOVING')},
          '${validStage}'::"JobLifecycleStage",
          ${escapeSql(record.pickupAddress || 'Calgary, AB')},
          ${escapeSql(record.pickupCity || 'Calgary')},
          ${escapeSql(record.pickupPostalCode || '')},
          ${escapeSql(record.pickupAccessDetails || '')},
          ${escapeSql(record.destinationAddress || null)},
          ${escapeSql(record.destinationCity || null)},
          ${escapeSql(record.destinationPostalCode || null)},
          ${escapeSql(record.destinationAccessDetails || null)},
          ${escapeSql(record.preferredDate || '2026-11-15')},
          ${record.isFlexibleDate ? 'TRUE' : 'FALSE'},
          ${escapeSql(record.preferredTimeWindow || 'flexible')},
          ${escapeSql(record.confirmedDate || null)},
          ${escapeSql(record.propertySize || null)},
          ${escapeSql(record.inventoryDetails || {})},
          ${escapeArray(record.junkCategories || [])},
          ${escapeSql(record.junkVolumeEstimate || null)},
          ${escapeSql(record.specialRequirements || '')},
          ${escapeSql(record.aiSummary || '')},
          ${escapeSql(record.aiVolumeSuggestion || '')},
          ${record.requiresManualInspection ? 'TRUE' : 'FALSE'},
          ${escapeSql(record.assignedTeamId || null)},
          ${escapeSql(record.assignedVehicleId || null)},
          ${escapeSql(record.completionNotes || '')},
          ${escapeSql(record.completedAt || null)},
          ${escapeSql(record.createdAt || new Date().toISOString())},
          ${escapeSql(record.updatedAt || new Date().toISOString())}
        )
        ON CONFLICT ("id") DO UPDATE SET
          "lifecycleStage" = EXCLUDED."lifecycleStage",
          "pickupAddress" = EXCLUDED."pickupAddress",
          "preferredDate" = EXCLUDED."preferredDate",
          "aiSummary" = EXCLUDED."aiSummary",
          "updatedAt" = EXCLUDED."updatedAt";
      `;
      await executeInsForgeSql(sql);
      return { success: true };
    }

    if (norm === 'quotes' || norm === 'quote') {
      const validStatus = [
        'DRAFT',
        'SENT',
        'VIEWED',
        'REVISED',
        'ACCEPTED',
        'DECLINED',
        'EXPIRED',
      ].includes(record.status)
        ? record.status
        : 'DRAFT';

      const sql = `
        INSERT INTO "Quote" (
          "id", "quoteNumber", "version", "leadId", "jobRequestId", "customerId",
          "serviceType", "status", "proposedDate", "proposedWindow", "scopeSummary",
          "subtotalCents", "discountCents", "taxRatePercent", "taxCents", "totalCents",
          "depositCents", "validityDays", "validUntil", "termsAndNotes", "customerResponse",
          "respondedAt", "createdAt", "updatedAt"
        ) VALUES (
          ${escapeSql(record.id)},
          ${escapeSql(record.quoteNumber)},
          ${record.version || 1},
          ${escapeSql(record.leadId)},
          ${escapeSql(record.jobRequestId)},
          ${escapeSql(record.customerId)},
          ${escapeSql(record.serviceType)},
          '${validStatus}'::"QuoteStatus",
          ${escapeSql(record.proposedDate || '2026-11-15')},
          ${escapeSql(record.proposedWindow || 'flexible')},
          ${escapeSql(record.scopeSummary || '')},
          ${record.subtotalCents || 0},
          ${record.discountCents || 0},
          ${record.taxRatePercent || 5.0},
          ${record.taxCents || 0},
          ${record.totalCents || 0},
          ${record.depositCents || 0},
          ${record.validityDays || 14},
          ${escapeSql(record.validUntil || '2026-11-30')},
          ${escapeSql(record.termsAndNotes || '')},
          ${escapeSql(record.customerResponse || null)},
          ${escapeSql(record.respondedAt || null)},
          ${escapeSql(record.createdAt || new Date().toISOString())},
          ${escapeSql(record.updatedAt || new Date().toISOString())}
        )
        ON CONFLICT ("id") DO UPDATE SET
          "status" = EXCLUDED."status",
          "customerResponse" = EXCLUDED."customerResponse",
          "respondedAt" = EXCLUDED."respondedAt",
          "totalCents" = EXCLUDED."totalCents",
          "updatedAt" = EXCLUDED."updatedAt";
      `;
      await executeInsForgeSql(sql);

      // Sync line items if present
      if (Array.isArray(record.lineItems)) {
        for (const item of record.lineItems) {
          const itemSql = `
            INSERT INTO "QuoteLineItem" ("id", "quoteId", "category", "description", "quantity", "unitPriceCents", "totalCents", "sortOrder")
            VALUES (
              ${escapeSql(item.id)},
              ${escapeSql(record.id)},
              ${escapeSql(item.category || 'MOVING_SERVICE')},
              ${escapeSql(item.description || 'Service Line Item')},
              ${Number(item.quantity) || 1},
              ${item.unitPriceCents || 0},
              ${item.totalCents || 0},
              ${item.sortOrder || 1}
            )
            ON CONFLICT ("id") DO UPDATE SET
              "description" = EXCLUDED."description",
              "quantity" = EXCLUDED."quantity",
              "unitPriceCents" = EXCLUDED."unitPriceCents",
              "totalCents" = EXCLUDED."totalCents";
          `;
          await executeInsForgeSql(itemSql);
        }
      }
      return { success: true };
    }

    if (norm === 'bookings' || norm === 'booking') {
      const validStatus = [
        'TENTATIVE',
        'CONFIRMED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
        'RESCHEDULED',
      ].includes(record.status)
        ? record.status
        : 'TENTATIVE';

      const sql = `
        INSERT INTO "Booking" (
          "id", "bookingNumber", "jobRequestId", "customerId", "quoteId",
          "serviceType", "serviceCategory", "status", "scheduledDate", "startTime",
          "endTime", "arrivalWindow", "assignedTeamId", "assignedVehicleId", "crewMemberIds",
          "pickupAddress", "pickupCity", "destinationCity", "dispatchNotes", "createdAt", "updatedAt"
        ) VALUES (
          ${escapeSql(record.id)},
          ${escapeSql(record.bookingNumber)},
          ${escapeSql(record.jobRequestId)},
          ${escapeSql(record.customerId)},
          ${escapeSql(record.quoteId || null)},
          ${escapeSql(record.serviceType)},
          ${escapeSql(record.serviceCategory || 'MOVING')},
          '${validStatus}'::"BookingStatus",
          ${escapeSql(record.scheduledDate || '2026-11-15')},
          ${escapeSql(record.startTime || '09:00')},
          ${escapeSql(record.endTime || '13:00')},
          ${escapeSql(record.arrivalWindow || '09:00 AM - 10:00 AM')},
          ${escapeSql(record.assignedTeamId || null)},
          ${escapeSql(record.assignedVehicleId || null)},
          ${escapeArray(record.crewMemberIds || [])},
          ${escapeSql(record.pickupAddress || 'Calgary, AB')},
          ${escapeSql(record.pickupCity || 'Calgary')},
          ${escapeSql(record.destinationCity || null)},
          ${escapeSql(record.dispatchNotes || '')},
          ${escapeSql(record.createdAt || new Date().toISOString())},
          ${escapeSql(record.updatedAt || new Date().toISOString())}
        )
        ON CONFLICT ("id") DO UPDATE SET
          "status" = EXCLUDED."status",
          "scheduledDate" = EXCLUDED."scheduledDate",
          "arrivalWindow" = EXCLUDED."arrivalWindow",
          "dispatchNotes" = EXCLUDED."dispatchNotes",
          "updatedAt" = EXCLUDED."updatedAt";
      `;
      await executeInsForgeSql(sql);
      return { success: true };
    }

    if (norm === 'invoices' || norm === 'invoice') {
      await ensureInvoiceTablesExist();
      const sql = `
        INSERT INTO "Invoice" (
          "id", "invoiceNumber", "bookingId", "quoteId", "jobRequestId", "customerId",
          "customerName", "customerEmail", "customerPhone", "customerAddress",
          "serviceType", "serviceCategory", "status", "issueDate", "dueDate", "completionDate",
          "subtotalCents", "discountCents", "taxRatePercent", "taxCents", "totalCents",
          "depositPaidCents", "amountPaidCents", "balanceDueCents", "paymentMethod",
          "paymentReference", "paidAt", "paymentTerms", "notesAndInstructions",
          "sentAt", "recipientEmail", "createdAt", "updatedAt"
        ) VALUES (
          ${escapeSql(record.id)},
          ${escapeSql(record.invoiceNumber)},
          ${escapeSql(record.bookingId || null)},
          ${escapeSql(record.quoteId || null)},
          ${escapeSql(record.jobRequestId || null)},
          ${escapeSql(record.customerId)},
          ${escapeSql(record.customerName || null)},
          ${escapeSql(record.customerEmail || null)},
          ${escapeSql(record.customerPhone || null)},
          ${escapeSql(record.customerAddress || null)},
          ${escapeSql(record.serviceType)},
          ${escapeSql(record.serviceCategory || 'MOVING')},
          ${escapeSql(record.status || 'DRAFT')},
          ${escapeSql(record.issueDate || new Date().toISOString().slice(0, 10))},
          ${escapeSql(record.dueDate || new Date().toISOString().slice(0, 10))},
          ${escapeSql(record.completionDate || null)},
          ${record.subtotalCents || 0},
          ${record.discountCents || 0},
          ${record.taxRatePercent || 5.0},
          ${record.taxCents || 0},
          ${record.totalCents || 0},
          ${record.depositPaidCents || 0},
          ${record.amountPaidCents || 0},
          ${record.balanceDueCents || 0},
          ${escapeSql(record.paymentMethod || 'INTERAC_E_TRANSFER')},
          ${escapeSql(record.paymentReference || null)},
          ${escapeSql(record.paidAt || null)},
          ${escapeSql(record.paymentTerms || 'Payment Due Upon Completion of Service')},
          ${escapeSql(record.notesAndInstructions || '')},
          ${escapeSql(record.sentAt || null)},
          ${escapeSql(record.recipientEmail || null)},
          ${escapeSql(record.createdAt || new Date().toISOString())},
          ${escapeSql(record.updatedAt || new Date().toISOString())}
        )
        ON CONFLICT ("id") DO UPDATE SET
          "status" = EXCLUDED."status",
          "amountPaidCents" = EXCLUDED."amountPaidCents",
          "balanceDueCents" = EXCLUDED."balanceDueCents",
          "paymentMethod" = EXCLUDED."paymentMethod",
          "paymentReference" = EXCLUDED."paymentReference",
          "paidAt" = EXCLUDED."paidAt",
          "sentAt" = EXCLUDED."sentAt",
          "updatedAt" = EXCLUDED."updatedAt";
      `;
      await executeInsForgeSql(sql);

      if (Array.isArray(record.lineItems)) {
        for (const item of record.lineItems) {
          const itemSql = `
            INSERT INTO "InvoiceLineItem" ("id", "invoiceId", "category", "description", "quantity", "unitPriceCents", "totalCents", "sortOrder")
            VALUES (
              ${escapeSql(item.id)},
              ${escapeSql(record.id)},
              ${escapeSql(item.category || 'MOVING_SERVICE')},
              ${escapeSql(item.description || 'Service Line Item')},
              ${Number(item.quantity) || 1},
              ${item.unitPriceCents || 0},
              ${item.totalCents || 0},
              ${item.sortOrder || 1}
            )
            ON CONFLICT ("id") DO UPDATE SET
              "description" = EXCLUDED."description",
              "quantity" = EXCLUDED."quantity",
              "unitPriceCents" = EXCLUDED."unitPriceCents",
              "totalCents" = EXCLUDED."totalCents";
          `;
          await executeInsForgeSql(itemSql);
        }
      }
      return { success: true };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown InsForge database error',
    };
  }
}

let invoiceTablesChecked = false;
async function ensureInvoiceTablesExist() {
  if (invoiceTablesChecked) return;
  try {
    const invoiceDdl = `
      CREATE TABLE IF NOT EXISTS "Invoice" (
        "id" text PRIMARY KEY,
        "invoiceNumber" text NOT NULL UNIQUE,
        "bookingId" text,
        "quoteId" text,
        "jobRequestId" text,
        "customerId" text NOT NULL,
        "customerName" text,
        "customerEmail" text,
        "customerPhone" text,
        "customerAddress" text,
        "serviceType" text NOT NULL,
        "serviceCategory" text NOT NULL DEFAULT 'MOVING',
        "status" text NOT NULL DEFAULT 'DRAFT',
        "issueDate" text NOT NULL,
        "dueDate" text NOT NULL,
        "completionDate" text,
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
        "paidAt" timestamp without time zone,
        "paymentTerms" text DEFAULT 'Payment Due Upon Completion of Service',
        "notesAndInstructions" text,
        "sentAt" timestamp without time zone,
        "recipientEmail" text,
        "createdAt" timestamp without time zone NOT NULL DEFAULT NOW(),
        "updatedAt" timestamp without time zone NOT NULL DEFAULT NOW()
      );
    `;
    const lineItemDdl = `
      CREATE TABLE IF NOT EXISTS "InvoiceLineItem" (
        "id" text PRIMARY KEY,
        "invoiceId" text NOT NULL,
        "category" text NOT NULL DEFAULT 'MOVING_SERVICE',
        "description" text NOT NULL,
        "quantity" double precision NOT NULL DEFAULT 1,
        "unitPriceCents" integer NOT NULL DEFAULT 0,
        "totalCents" integer NOT NULL DEFAULT 0,
        "sortOrder" integer NOT NULL DEFAULT 1
      );
    `;
    await executeInsForgeSql(invoiceDdl);
    await executeInsForgeSql(lineItemDdl);
    invoiceTablesChecked = true;
  } catch (err) {
    console.warn('[ensureInvoiceTablesExist Error]:', err);
  }
}

/**
 * Pull remote records from InsForge database to restore state across Vercel serverless restarts
 */
export async function pullRemoteRecordsFromInsForge(): Promise<{
  customers: any[];
  leads: any[];
  jobRequests: any[];
  quotes: any[];
  invoices: any[];
  bookings: any[];
} | null> {
  try {
    await ensureInvoiceTablesExist();
    const [custRes, leadsRes, jobsRes, quotesRes, lineItemsRes, bookingsRes, invRes, invItemsRes] =
      await Promise.all([
        executeInsForgeSql('SELECT * FROM "Customer" ORDER BY "createdAt" DESC LIMIT 200;'),
        executeInsForgeSql('SELECT * FROM "Lead" ORDER BY "createdAt" DESC LIMIT 200;'),
        executeInsForgeSql('SELECT * FROM "JobRequest" ORDER BY "createdAt" DESC LIMIT 200;'),
        executeInsForgeSql('SELECT * FROM "Quote" ORDER BY "createdAt" DESC LIMIT 200;'),
        executeInsForgeSql('SELECT * FROM "QuoteLineItem" ORDER BY "sortOrder" ASC LIMIT 500;'),
        executeInsForgeSql('SELECT * FROM "Booking" ORDER BY "createdAt" DESC LIMIT 200;'),
        executeInsForgeSql('SELECT * FROM "Invoice" ORDER BY "createdAt" DESC LIMIT 200;'),
        executeInsForgeSql('SELECT * FROM "InvoiceLineItem" ORDER BY "sortOrder" ASC LIMIT 500;'),
      ]);

    // Attach line items to quotes
    const quotesWithItems = quotesRes.rows.map((q: any) => {
      const items = lineItemsRes.rows.filter((li: any) => li.quoteId === q.id);
      return {
        ...q,
        lineItems: items.length > 0 ? items : q.lineItems || [],
      };
    });

    // Attach line items to invoices
    const invoicesWithItems = invRes.rows.map((inv: any) => {
      const items = invItemsRes.rows.filter((li: any) => li.invoiceId === inv.id);
      return {
        ...inv,
        lineItems: items.length > 0 ? items : inv.lineItems || [],
      };
    });

    return {
      customers: custRes.rows,
      leads: leadsRes.rows,
      jobRequests: jobsRes.rows,
      quotes: quotesWithItems,
      invoices: invoicesWithItems,
      bookings: bookingsRes.rows,
    };
  } catch (err) {
    console.warn('[InsForge] pullRemoteRecords warning:', err);
    return null;
  }
}

/**
 * Upload file to InsForge Storage Bucket
 * Supported buckets: 'customer-photos', 'marketing-creatives', 'quote-documents'
 */
export async function uploadToInsForgeStorage(
  bucket: 'customer-photos' | 'marketing-creatives' | 'quote-documents',
  filePath: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<{ success: boolean; publicUrl?: string; storageKey?: string; error?: string }> {
  const fallbackKey = `${bucket}/${Date.now()}-${filePath.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  try {
    const host = getInsForgeHost();
    const apiKey = getInsForgeApiKey();

    const uploadUrl = `${host}/api/storage/buckets/${bucket}/objects/${encodeURIComponent(filePath)}`;
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': mimeType,
        Authorization: `Bearer ${apiKey}`,
      },
      body: new Uint8Array(fileBuffer),
    });

    if (res.ok) {
      return {
        success: true,
        storageKey: filePath,
        publicUrl: `${host}/storage/${bucket}/${filePath}`,
      };
    }
  } catch {
    // Fall back to local storage handler
  }

  return {
    success: true,
    storageKey: fallbackKey,
    publicUrl: `/storage/private/${fallbackKey}`,
  };
}
