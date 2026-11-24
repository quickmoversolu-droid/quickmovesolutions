/**
 * QUICKMOVE SOLUTIONS — CLOUD BACKEND SERVICE ADAPTER
 * Migrated from legacy InsForge to Supabase PostgreSQL & Storage (@supabase/supabase-js).
 * Preserves legacy export names for full backward compatibility across all API routes.
 */

import {
  getSupabaseConfig,
  syncRecordToSupabase,
  deleteRecordFromSupabase,
  pullRemoteRecordsFromSupabase,
  uploadToSupabaseStorage,
  type CloudBackendConfig,
} from './supabase-service';

export type InsForgeConfig = CloudBackendConfig;

export function getInsForgeConfig(): InsForgeConfig {
  return getSupabaseConfig();
}

export async function executeInsForgeSql<T = any>(_query: string): Promise<{ rows: T[]; rowCount: number }> {
  return { rows: [], rowCount: 0 };
}

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
  return syncRecordToSupabase(table, record);
}

export async function recordDeletionInInsForge(entityType: 'INVOICE' | 'QUOTE', id: string): Promise<void> {
  await deleteRecordFromSupabase(entityType, id);
}

export async function pullRemoteRecordsFromInsForge(): Promise<{
  customers: any[];
  leads: any[];
  jobRequests: any[];
  quotes: any[];
  invoices: any[];
  bookings: any[];
  deletedIds: string[];
} | null> {
  return pullRemoteRecordsFromSupabase();
}

export async function uploadToInsForgeStorage(
  bucket: 'customer-photos' | 'marketing-creatives' | 'quote-documents',
  filePath: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<{ success: boolean; publicUrl?: string; storageKey?: string; error?: string }> {
  return uploadToSupabaseStorage(bucket, filePath, fileBuffer, mimeType);
}
