import { NextRequest, NextResponse } from 'next/server';
import { UnifiedQuoteSubmissionSchema } from '@/lib/validations/quote-schemas';
import {
  createQuoteSubmissionRecord,
  readPlatformStore,
} from '@/lib/db/platform-store';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { dispatchNewQuoteEmails } from '@/lib/notifications/notification-service';

// Simple in-memory rate limiter per IP (Phase 4.D spam prevention)
const rateLimitWindowMs = 60 * 1000;
const maxRequestsPerMinute = 15;
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + rateLimitWindowMs });
    return true;
  }
  if (entry.count >= maxRequestsPerMinute) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Too many requests. Please wait a moment or call (587) 999-9565.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Spam honeypot check
    if (body && typeof body.honeypot === 'string' && body.honeypot.length > 0) {
      return NextResponse.json(
        { ok: false, error: 'Spam check triggered.' },
        { status: 400 }
      );
    }

    const parsed = UnifiedQuoteSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        {
          ok: false,
          error: firstIssue
            ? `${firstIssue.path.join('.')}: ${firstIssue.message}`
            : 'Invalid quote submission data.',
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const result = createQuoteSubmissionRecord(parsed.data);

    // Cross-Container Database Persistence via InsForge
    try {
      const db = readPlatformStore();
      const newCustomer = db.customers.find((c) => c.id === result.customerId);
      const newJob = db.jobRequests.find((j) => j.id === result.jobRequestId);
      const newLead = db.leads.find((l) => l.id === result.leadId);
      const { syncRecordToInsForge } = await import('@/lib/backend/insforge-service');
      await Promise.allSettled([
        newCustomer ? syncRecordToInsForge('Customer', newCustomer as any) : Promise.resolve(),
        newJob ? syncRecordToInsForge('JobRequest', newJob as any) : Promise.resolve(),
        newLead ? syncRecordToInsForge('Lead', newLead as any) : Promise.resolve(),
      ]);
    } catch (syncErr) {
      console.warn('[InsForge Lead Sync Warning]:', syncErr);
    }

    // Live Email Dispatch via Resend: Notify Admin (quickmoversolu@gmail.com) and Customer
    try {
      await dispatchNewQuoteEmails(parsed.data, result);
    } catch (emailErr) {
      console.error('[Quote Notification Dispatch Warning]:', emailErr);
    }

    return NextResponse.json(
      {
        ok: true,
        referenceCode: result.referenceCode,
        leadId: result.leadId,
        jobRequestId: result.jobRequestId,
        customerId: result.customerId,
        photoCount: result.photoCount,
        createdAt: result.createdAt,
        officialContact: {
          phone: BUSINESS_INFO.phoneDisplay,
          email: BUSINESS_INFO.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unable to process quote request.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  const db = readPlatformStore();
  return NextResponse.json({
    ok: true,
    totalLeads: db.leads.length,
    totalJobRequests: db.jobRequests.length,
  });
}
