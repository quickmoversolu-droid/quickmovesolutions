/**
 * One-time migration script: pushes existing records from storage/db/quickmove-db.json
 * into Supabase PostgreSQL once supabase/schema.sql has been executed.
 */
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dolaaqgjdvlgkyfityim.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!SECRET_KEY) {
  console.error('❌ Missing SUPABASE_SECRET_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function migrate() {
  const dbPath = path.join(process.cwd(), 'storage', 'db', 'quickmove-db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Quick schema check
  const check = await supabase.from('Invoice').select('id').limit(1);
  if (check.error) {
    console.error('❌ Tables not created yet in Supabase:', check.error.message);
    console.error('Please run supabase/schema.sql in your Supabase Dashboard -> SQL Editor first.');
    process.exit(1);
  }

  const upsertAll = async (table, rows, mapper) => {
    if (!Array.isArray(rows) || rows.length === 0) return;
    const mapped = rows.map(mapper);
    const { error } = await supabase.from(table).upsert(mapped, { onConflict: 'id' });
    if (error) {
      console.warn(`⚠️ ${table}:`, error.message);
    } else {
      console.log(`✅ ${table}: migrated ${mapped.length} record(s)`);
    }
  };

  await upsertAll('Customer', db.customers, (c) => ({
    id: c.id,
    fullName: c.fullName || 'Valued Customer',
    email: c.email || '',
    phone: c.phone || '',
    preferredContact: c.preferredContact || 'phone',
    address: c.address || 'Calgary, AB',
    city: c.city || 'Calgary',
    postalCode: c.postalCode || '',
    notes: c.notes || '',
    portalPasscode: c.portalPasscode || '',
    createdAt: c.createdAt || new Date().toISOString(),
    updatedAt: c.updatedAt || new Date().toISOString(),
  }));

  await upsertAll('Lead', db.leads, (l) => ({
    id: l.id,
    referenceCode: l.referenceCode || null,
    customerId: l.customerId,
    jobRequestId: l.jobRequestId || null,
    serviceType: l.serviceType || 'residential',
    status: l.status || 'NEW',
    source: l.source || 'Website',
    utmSource: l.utmSource || null,
    utmMedium: l.utmMedium || null,
    utmCampaign: l.utmCampaign || null,
    assignedEmployeeId: l.assignedEmployeeId || null,
    internalNotes: l.internalNotes || '',
    createdAt: l.createdAt || new Date().toISOString(),
    updatedAt: l.updatedAt || new Date().toISOString(),
  }));

  await upsertAll('JobRequest', db.jobRequests, (j) => ({
    id: j.id,
    leadId: j.leadId || null,
    customerId: j.customerId,
    serviceType: j.serviceType || 'residential',
    serviceCategory: j.serviceCategory || 'MOVING',
    lifecycleStage: j.lifecycleStage || 'NEW_LEAD',
    pickupAddress: j.pickupAddress || 'Calgary, AB',
    pickupCity: j.pickupCity || 'Calgary',
    pickupPostalCode: j.pickupPostalCode || '',
    pickupAccessDetails: j.pickupAccessDetails || '',
    destinationAddress: j.destinationAddress || null,
    destinationCity: j.destinationCity || null,
    destinationPostalCode: j.destinationPostalCode || null,
    destinationAccessDetails: j.destinationAccessDetails || null,
    preferredDate: j.preferredDate || null,
    isFlexibleDate: Boolean(j.isFlexibleDate),
    preferredTimeWindow: j.preferredTimeWindow || 'flexible',
    confirmedDate: j.confirmedDate || null,
    propertySize: j.propertySize || null,
    inventoryDetails: j.inventoryDetails || null,
    junkCategories: Array.isArray(j.junkCategories) ? j.junkCategories : [],
    junkVolumeEstimate: j.junkVolumeEstimate || null,
    specialRequirements: j.specialRequirements || null,
    aiSummary: j.aiSummary || null,
    aiVolumeSuggestion: j.aiVolumeSuggestion || null,
    requiresManualInspection: Boolean(j.requiresManualInspection),
    assignedTeamId: j.assignedTeamId || null,
    assignedVehicleId: j.assignedVehicleId || null,
    completionNotes: j.completionNotes || null,
    completedAt: j.completedAt || null,
    createdAt: j.createdAt || new Date().toISOString(),
    updatedAt: j.updatedAt || new Date().toISOString(),
  }));

  await upsertAll('Quote', db.quotes, (q) => ({
    id: q.id,
    quoteNumber: q.quoteNumber,
    version: q.version || 1,
    leadId: q.leadId || null,
    jobRequestId: q.jobRequestId || null,
    customerId: q.customerId || 'cust_seed_1',
    serviceType: q.serviceType || 'residential',
    status: q.status || 'DRAFT',
    proposedDate: q.proposedDate || null,
    proposedWindow: q.proposedWindow || null,
    validUntil: q.validUntil || null,
    scopeSummary: q.scopeSummary || '',
    lineItems: Array.isArray(q.lineItems) ? q.lineItems : [],
    subtotalCents: Number(q.subtotalCents) || 0,
    discountCents: Number(q.discountCents) || 0,
    taxRatePercent: Number(q.taxRatePercent) || 5.0,
    taxCents: Number(q.taxCents) || 0,
    totalCents: Number(q.totalCents) || 0,
    depositCents: Number(q.depositCents) || 0,
    termsAndNotes: q.termsAndNotes || '',
    customerResponse: q.customerResponse || null,
    respondedAt: q.respondedAt || null,
    sentAt: q.sentAt || null,
    recipientEmail: q.recipientEmail || null,
    createdAt: q.createdAt || new Date().toISOString(),
    updatedAt: q.updatedAt || new Date().toISOString(),
  }));

  await upsertAll('Booking', db.bookings, (b) => ({
    id: b.id,
    jobRequestId: b.jobRequestId || null,
    quoteId: b.quoteId || null,
    customerId: b.customerId,
    serviceType: b.serviceType || 'residential',
    serviceCategory: b.serviceCategory || 'MOVING',
    status: b.status || 'CONFIRMED',
    scheduledDate: b.scheduledDate || null,
    startTime: b.startTime || null,
    endTime: b.endTime || null,
    arrivalWindow: b.arrivalWindow || null,
    assignedTeamId: b.assignedTeamId || null,
    assignedVehicleId: b.assignedVehicleId || null,
    crewMemberIds: Array.isArray(b.crewMemberIds) ? b.crewMemberIds : [],
    dispatchNotes: b.dispatchNotes || '',
    createdAt: b.createdAt || new Date().toISOString(),
    updatedAt: b.updatedAt || new Date().toISOString(),
  }));

  console.log('\n🎉 Supabase data migration complete!');
}

migrate().catch(console.error);
