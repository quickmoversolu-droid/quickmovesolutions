/**
 * QUICKMOVE SOLUTIONS — SUPABASE BACKEND SERVICE ADAPTER
 * Primary Cloud PostgreSQL Database & Object Storage via @supabase/supabase-js.
 * Replaces legacy InsForge backend with permanent Supabase infrastructure.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface CloudBackendConfig {
  baseUrl: string;
  anonKey: string;
  apiKey: string;
  isConnected: boolean;
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'ERROR';
  lastCheckedAt: string;
  provider: 'SUPABASE';
}

const DEFAULT_SUPABASE_URL = 'https://dolaaqgjdvlgkyfityim.supabase.co';

export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL
  );
}

export function getSupabaseSecretKey(): string {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ''
  );
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseSecretKey();
  if (!url || !key) return null;
  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cachedClient;
}

export function getSupabaseConfig(): CloudBackendConfig {
  const baseUrl = getSupabaseUrl();
  const secretKey = getSupabaseSecretKey();
  const isConfigured = Boolean(baseUrl && secretKey);

  return {
    baseUrl,
    anonKey: secretKey ? `${secretKey.substring(0, 12)}...` : '',
    apiKey: secretKey ? `${secretKey.substring(0, 12)}...` : '',
    isConnected: isConfigured,
    status: isConfigured ? 'CONNECTED' : 'NOT_CONFIGURED',
    lastCheckedAt: new Date().toISOString(),
    provider: 'SUPABASE',
  };
}

function mapTableName(table: string): string | null {
  const norm = table.toLowerCase();
  if (norm === 'customers' || norm === 'customer') return 'Customer';
  if (norm === 'leads' || norm === 'lead') return 'Lead';
  if (norm === 'job_requests' || norm === 'jobrequest') return 'JobRequest';
  if (norm === 'quotes' || norm === 'quote') return 'Quote';
  if (norm === 'invoices' || norm === 'invoice') return 'Invoice';
  if (norm === 'bookings' || norm === 'booking') return 'Booking';
  if (norm === 'marketing_posts' || norm === 'marketingpost') return 'MarketingPost';
  if (norm === 'job_photos' || norm === 'jobphoto') return 'JobPhoto';
  return null;
}

function sanitizeRecordForTable(tableName: string, record: Record<string, any>): Record<string, any> {
  const now = new Date().toISOString();

  switch (tableName) {
    case 'Customer':
      return {
        id: record.id,
        fullName: record.fullName || 'Valued Customer',
        email: record.email || '',
        phone: record.phone || '',
        preferredContact: record.preferredContact || 'phone',
        address: record.address || 'Calgary, AB',
        city: record.city || 'Calgary',
        postalCode: record.postalCode || '',
        notes: record.notes || '',
        portalPasscode: record.portalPasscode || '',
        createdAt: record.createdAt || now,
        updatedAt: record.updatedAt || now,
      };

    case 'Lead':
      return {
        id: record.id,
        referenceCode: record.referenceCode || null,
        customerId: record.customerId,
        jobRequestId: record.jobRequestId || null,
        serviceType: record.serviceType || 'residential',
        status: record.status || 'NEW',
        source: record.source || 'Website',
        utmSource: record.utmSource || null,
        utmMedium: record.utmMedium || null,
        utmCampaign: record.utmCampaign || null,
        assignedEmployeeId: record.assignedEmployeeId || null,
        internalNotes: record.internalNotes || '',
        createdAt: record.createdAt || now,
        updatedAt: record.updatedAt || now,
      };

    case 'JobRequest':
      return {
        id: record.id,
        leadId: record.leadId || null,
        customerId: record.customerId,
        serviceType: record.serviceType || 'residential',
        serviceCategory: record.serviceCategory || 'MOVING',
        lifecycleStage: record.lifecycleStage || 'NEW_LEAD',
        pickupAddress: record.pickupAddress || 'Calgary, AB',
        pickupCity: record.pickupCity || 'Calgary',
        pickupPostalCode: record.pickupPostalCode || '',
        pickupAccessDetails: record.pickupAccessDetails || '',
        destinationAddress: record.destinationAddress || null,
        destinationCity: record.destinationCity || null,
        destinationPostalCode: record.destinationPostalCode || null,
        destinationAccessDetails: record.destinationAccessDetails || null,
        preferredDate: record.preferredDate || null,
        isFlexibleDate: Boolean(record.isFlexibleDate),
        preferredTimeWindow: record.preferredTimeWindow || 'flexible',
        confirmedDate: record.confirmedDate || null,
        propertySize: record.propertySize || null,
        inventoryDetails: record.inventoryDetails || null,
        junkCategories: Array.isArray(record.junkCategories) ? record.junkCategories : [],
        junkVolumeEstimate: record.junkVolumeEstimate || null,
        specialRequirements: record.specialRequirements || null,
        aiSummary: record.aiSummary || null,
        aiVolumeSuggestion: record.aiVolumeSuggestion || null,
        requiresManualInspection: Boolean(record.requiresManualInspection),
        assignedTeamId: record.assignedTeamId || null,
        assignedVehicleId: record.assignedVehicleId || null,
        completionNotes: record.completionNotes || null,
        completedAt: record.completedAt || null,
        createdAt: record.createdAt || now,
        updatedAt: record.updatedAt || now,
      };

    case 'Quote':
      return {
        id: record.id,
        quoteNumber: record.quoteNumber,
        version: record.version || 1,
        leadId: record.leadId || null,
        jobRequestId: record.jobRequestId || null,
        customerId: record.customerId || 'cust_seed_1',
        serviceType: record.serviceType || 'residential',
        status: record.status || 'DRAFT',
        proposedDate: record.proposedDate || null,
        proposedWindow: record.proposedWindow || null,
        validUntil: record.validUntil || null,
        scopeSummary: record.scopeSummary || '',
        lineItems: Array.isArray(record.lineItems) ? record.lineItems : [],
        subtotalCents: Number(record.subtotalCents) || 0,
        discountCents: Number(record.discountCents) || 0,
        taxRatePercent: Number(record.taxRatePercent) || 5.0,
        taxCents: Number(record.taxCents) || 0,
        totalCents: Number(record.totalCents) || 0,
        depositCents: Number(record.depositCents) || 0,
        termsAndNotes: record.termsAndNotes || '',
        customerResponse: record.customerResponse || null,
        respondedAt: record.respondedAt || null,
        sentAt: record.sentAt || null,
        recipientEmail: record.recipientEmail || null,
        createdAt: record.createdAt || now,
        updatedAt: record.updatedAt || now,
      };

    case 'Invoice':
      return {
        id: record.id,
        invoiceNumber: record.invoiceNumber,
        bookingId: record.bookingId || null,
        quoteId: record.quoteId || null,
        jobRequestId: record.jobRequestId || null,
        customerId: record.customerId || 'cust_seed_1',
        customerName: record.customerName || null,
        customerEmail: record.customerEmail || null,
        customerPhone: record.customerPhone || null,
        customerAddress: record.customerAddress || null,
        serviceType: record.serviceType || 'residential',
        serviceCategory: record.serviceCategory || 'MOVING',
        status: record.status || 'ISSUED',
        issueDate: record.issueDate || now.slice(0, 10),
        dueDate: record.dueDate || now.slice(0, 10),
        completionDate: record.completionDate || null,
        lineItems: Array.isArray(record.lineItems) ? record.lineItems : [],
        subtotalCents: Number(record.subtotalCents) || 0,
        discountCents: Number(record.discountCents) || 0,
        taxRatePercent: Number(record.taxRatePercent) || 5.0,
        taxCents: Number(record.taxCents) || 0,
        totalCents: Number(record.totalCents) || 0,
        depositPaidCents: Number(record.depositPaidCents) || 0,
        amountPaidCents: Number(record.amountPaidCents) || 0,
        balanceDueCents: Number(record.balanceDueCents) || 0,
        paymentMethod: record.paymentMethod || 'INTERAC_E_TRANSFER',
        paymentReference: record.paymentReference || null,
        paidAt: record.paidAt || null,
        paymentTerms: record.paymentTerms || 'Payment Due Upon Completion of Service',
        notesAndInstructions: record.notesAndInstructions || '',
        sentAt: record.sentAt || null,
        recipientEmail: record.recipientEmail || null,
        createdAt: record.createdAt || now,
        updatedAt: record.updatedAt || now,
      };

    case 'Booking':
      return {
        id: record.id,
        jobRequestId: record.jobRequestId || null,
        quoteId: record.quoteId || null,
        customerId: record.customerId,
        serviceType: record.serviceType || 'residential',
        serviceCategory: record.serviceCategory || 'MOVING',
        status: record.status || 'CONFIRMED',
        scheduledDate: record.scheduledDate || null,
        startTime: record.startTime || null,
        endTime: record.endTime || null,
        arrivalWindow: record.arrivalWindow || null,
        assignedTeamId: record.assignedTeamId || null,
        assignedVehicleId: record.assignedVehicleId || null,
        crewMemberIds: Array.isArray(record.crewMemberIds) ? record.crewMemberIds : [],
        dispatchNotes: record.dispatchNotes || '',
        createdAt: record.createdAt || now,
        updatedAt: record.updatedAt || now,
      };

    case 'MarketingPost':
      return {
        id: record.id,
        campaignId: record.campaignId || null,
        title: record.title || null,
        caption: record.caption || null,
        hashtags: Array.isArray(record.hashtags) ? record.hashtags : [],
        platform: record.platform || 'FACEBOOK',
        status: record.status || 'DRAFT',
        scheduledFor: record.scheduledFor || null,
        publishedAt: record.publishedAt || null,
        imageUrl: record.imageUrl || null,
        metaPostId: record.metaPostId || null,
        createdAt: record.createdAt || now,
        updatedAt: record.updatedAt || now,
      };

    case 'JobPhoto':
      return {
        id: record.id,
        jobRequestId: record.jobRequestId || null,
        storageKey: record.storageKey || null,
        originalFilename: record.originalFilename || null,
        mimeType: record.mimeType || null,
        fileSizeBytes: Number(record.fileSizeBytes) || 0,
        publicUrl: record.publicUrl || null,
        createdAt: record.createdAt || now,
      };

    default:
      return record;
  }
}

/**
 * Upsert a business record to Supabase PostgreSQL
 */
export async function syncRecordToSupabase(
  table: string,
  record: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string }> {
  const tableName = mapTableName(table);
  if (!tableName) return { success: true };

  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) return { success: false, error: 'Supabase secret key not configured' };
    const payload = sanitizeRecordForTable(tableName, record);
    const { data, error } = await supabase
      .from(tableName)
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      console.warn(`[Supabase Upsert Warning - ${tableName}]:`, error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown Supabase error';
    console.warn(`[Supabase Sync Exception - ${tableName}]:`, msg);
    return { success: false, error: msg };
  }
}

/**
 * Permanently delete a record from Supabase and track its ID in DeletedRecord
 */
export async function deleteRecordFromSupabase(
  entityType: 'INVOICE' | 'QUOTE',
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) return { success: false, error: 'Supabase secret key not configured' };
    const tableName = entityType === 'INVOICE' ? 'Invoice' : 'Quote';

    const { error: delErr } = await supabase.from(tableName).delete().eq('id', id);
    if (delErr) {
      console.warn(`[Supabase Delete Warning - ${tableName}]:`, delErr.message);
    }

    const { error: trackErr } = await supabase
      .from('DeletedRecord')
      .upsert({ id, entityType, deletedAt: new Date().toISOString() }, { onConflict: 'id' });
    if (trackErr) {
      console.warn('[Supabase DeletedRecord Warning]:', trackErr.message);
    }

    return { success: !delErr };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown Supabase delete error';
    console.warn('[Supabase Delete Exception]:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Pull remote records from Supabase PostgreSQL to restore state across Vercel serverless containers
 */
export async function pullRemoteRecordsFromSupabase(): Promise<{
  customers: any[];
  leads: any[];
  jobRequests: any[];
  quotes: any[];
  invoices: any[];
  bookings: any[];
  deletedIds: string[];
} | null> {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) return null;

    const [custRes, leadsRes, jobsRes, quotesRes, bookingsRes, invRes, delRes] = await Promise.all([
      supabase.from('Customer').select('*').order('createdAt', { ascending: false }).limit(200),
      supabase.from('Lead').select('*').order('createdAt', { ascending: false }).limit(200),
      supabase.from('JobRequest').select('*').order('createdAt', { ascending: false }).limit(200),
      supabase.from('Quote').select('*').order('createdAt', { ascending: false }).limit(200),
      supabase.from('Booking').select('*').order('createdAt', { ascending: false }).limit(200),
      supabase.from('Invoice').select('*').order('createdAt', { ascending: false }).limit(200),
      supabase.from('DeletedRecord').select('id').limit(500),
    ]);

    return {
      customers: Array.isArray(custRes.data) ? custRes.data : [],
      leads: Array.isArray(leadsRes.data) ? leadsRes.data : [],
      jobRequests: Array.isArray(jobsRes.data) ? jobsRes.data : [],
      quotes: Array.isArray(quotesRes.data) ? quotesRes.data : [],
      invoices: Array.isArray(invRes.data) ? invRes.data : [],
      bookings: Array.isArray(bookingsRes.data) ? bookingsRes.data : [],
      deletedIds: Array.isArray(delRes.data) ? delRes.data.map((r: any) => r.id) : [],
    };
  } catch (err) {
    console.warn('[Supabase] pullRemoteRecords warning:', err);
    return null;
  }
}

/**
 * Compute the next strictly-unique sequential document number across Supabase + local store.
 * Prevents duplicate INV-YYYY-XXXX or Q-YYYY-XXXX numbers across Vercel serverless containers.
 */
export async function getNextDocumentNumber(
  type: 'INVOICE' | 'QUOTE',
  localExistingNumbers: string[] = []
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = type === 'INVOICE' ? `INV-${year}-` : `Q-${year}-`;
  const allNumbers = new Set<string>(localExistingNumbers.filter(Boolean));

  try {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const tableName = type === 'INVOICE' ? 'Invoice' : 'Quote';
      const colName = type === 'INVOICE' ? 'invoiceNumber' : 'quoteNumber';
      const { data } = await supabase.from(tableName).select(colName).limit(1000);
      if (Array.isArray(data)) {
        for (const row of data as Record<string, any>[]) {
          if (row[colName]) allNumbers.add(String(row[colName]));
        }
      }
    }
  } catch (err) {
    console.warn(`[Supabase getNextDocumentNumber Warning - ${type}]:`, err);
  }

  let maxSeq = 1000;
  for (const num of Array.from(allNumbers)) {
    const match = num.match(/(\d+)$/);
    if (match) {
      const parsed = parseInt(match[1], 10);
      if (!Number.isNaN(parsed) && parsed > maxSeq) {
        maxSeq = parsed;
      }
    }
  }

  return `${prefix}${maxSeq + 1}`;
}

/**
 * Upload file to Supabase Storage Bucket
 * Supported buckets: 'customer-photos', 'marketing-creatives', 'quote-documents'
 */
export async function uploadToSupabaseStorage(
  bucket: 'customer-photos' | 'marketing-creatives' | 'quote-documents',
  filePath: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<{ success: boolean; publicUrl?: string; storageKey?: string; error?: string }> {
  const fallbackKey = `${bucket}/${Date.now()}-${filePath.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return {
        success: false,
        storageKey: fallbackKey,
        error: 'Supabase secret key not configured',
      };
    }
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.warn(`[Supabase Storage Warning - ${bucket}]:`, error.message);
      return {
        success: false,
        storageKey: fallbackKey,
        error: error.message,
      };
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      storageKey: data.path,
      publicUrl: urlData.publicUrl,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown Supabase storage error';
    console.warn(`[Supabase Storage Exception - ${bucket}]:`, msg);
    return {
      success: false,
      storageKey: fallbackKey,
      error: msg,
    };
  }
}
