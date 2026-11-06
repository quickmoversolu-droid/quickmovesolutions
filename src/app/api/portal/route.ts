import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from '@/lib/auth/session';
import { readPlatformStore, writePlatformStore } from '@/lib/db/platform-store';
import { savePrivateJobPhoto } from '@/lib/storage/private-storage';
import { BUSINESS_INFO } from '@/lib/constants/business';

export async function GET(request: NextRequest) {
  const session = getServerSession();
  const db = readPlatformStore();

  const requestedCustomerId = request.nextUrl.searchParams.get('customerId');

  // Strict Customer Isolation:
  // If logged in as CUSTOMER, strictly lock to session.customerId.
  // If logged in as OWNER/ADMIN previewing the portal, allow requestedCustomerId or default to cust_seed_1.
  let targetCustomerId = 'cust_seed_1';
  if (session?.role === 'CUSTOMER' && session.customerId) {
    targetCustomerId = session.customerId;
  } else if (
    (session?.role === 'OWNER' || session?.role === 'ADMIN') &&
    requestedCustomerId
  ) {
    targetCustomerId = requestedCustomerId;
  } else if (session?.customerId) {
    targetCustomerId = session.customerId;
  }

  const customer = db.customers.find((c) => c.id === targetCustomerId);
  if (!customer) {
    return NextResponse.json(
      { ok: false, error: 'Customer profile not found.' },
      { status: 404 }
    );
  }

  // Strip internal CRM notes before returning to customer portal (Section 9.5 & Part 15)
  const sanitizedLeads = db.leads
    .filter((l) => l.customerId === customer.id)
    .map((l) => ({
      id: l.id,
      referenceCode: l.referenceCode,
      serviceType: l.serviceType,
      status: l.status,
      createdAt: l.createdAt,
    }));

  const sanitizedJobs = db.jobRequests
    .filter((j) => j.customerId === customer.id)
    .map((j) => ({
      id: j.id,
      leadId: j.leadId,
      serviceType: j.serviceType,
      serviceCategory: j.serviceCategory,
      lifecycleStage: j.lifecycleStage,
      pickupAddress: j.pickupAddress,
      pickupCity: j.pickupCity,
      destinationAddress: j.destinationAddress,
      destinationCity: j.destinationCity,
      preferredDate: j.preferredDate,
      preferredTimeWindow: j.preferredTimeWindow,
      confirmedDate: j.confirmedDate,
      specialRequirements: j.specialRequirements,
      createdAt: j.createdAt,
    }));

  const customerQuotes = db.quotes.filter((q) => q.customerId === customer.id);

  const sanitizedBookings = db.bookings
    .filter((b) => b.customerId === customer.id)
    .map((b) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      serviceType: b.serviceType,
      status: b.status,
      scheduledDate: b.scheduledDate,
      arrivalWindow: b.arrivalWindow,
      pickupAddress: b.pickupAddress,
      pickupCity: b.pickupCity,
      destinationCity: b.destinationCity,
    }));

  const jobIds = new Set(sanitizedJobs.map((j) => j.id));
  const customerPhotos = db.jobPhotos
    .filter((p) => jobIds.has(p.jobRequestId))
    .map((p) => ({
      id: p.id,
      jobRequestId: p.jobRequestId,
      originalFilename: p.originalFilename,
      caption: p.caption,
      previewDataUrl: p.previewDataUrl,
      createdAt: p.createdAt,
    }));

  return NextResponse.json({
    ok: true,
    customer: {
      id: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      preferredContact: customer.preferredContact,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode,
    },
    leads: sanitizedLeads,
    jobs: sanitizedJobs,
    quotes: customerQuotes,
    bookings: sanitizedBookings,
    photos: customerPhotos,
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = getServerSession();
    const body = await request.json();
    const action = String(body.action || '');
    const db = readPlatformStore();
    const now = new Date().toISOString();

    const activeCustomerId =
      session?.role === 'CUSTOMER' && session.customerId
        ? session.customerId
        : body.customerId || 'cust_seed_1';

    const customer = db.customers.find((c) => c.id === activeCustomerId);
    if (!customer) {
      return NextResponse.json({ ok: false, error: 'Unauthorized customer session.' }, { status: 401 });
    }

    // 1. CUSTOMER ACCEPTS OR DECLINES OWN QUOTE (WITH E-SIGNATURE)
    if (action === 'RESPOND_TO_QUOTE') {
      const { quoteId, decision, customerNote, signatureName } = body;
      const quote = db.quotes.find(
        (q) => q.id === quoteId && q.customerId === customer.id
      );
      if (!quote) {
        return NextResponse.json(
          { ok: false, error: 'Quotation not found or does not belong to your account.' },
          { status: 403 }
        );
      }

      quote.status = decision === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED';
      quote.customerResponse =
        customerNote ||
        (decision === 'ACCEPT'
          ? `Digitally Accepted & Signed by ${signatureName || customer.fullName}`
          : 'Declined via Customer Portal');
      if (decision === 'ACCEPT' && signatureName) {
        quote.signatureName = signatureName;
        quote.signedAt = now;
      }
      quote.respondedAt = now;
      quote.updatedAt = now;

      const lead = db.leads.find((l) => l.id === quote.leadId);
      const job = db.jobRequests.find((j) => j.id === quote.jobRequestId);

      if (decision === 'ACCEPT') {
        if (lead) lead.status = 'ACCEPTED';
        if (job) job.lifecycleStage = 'CUSTOMER_ACCEPTED';

        // Auto-provision or confirm Booking
        const existingBooking = db.bookings.find(
          (b) => b.jobRequestId === quote.jobRequestId || b.quoteId === quote.id
        );

        if (existingBooking) {
          existingBooking.status = 'CONFIRMED';
          existingBooking.scheduledDate = quote.proposedDate || existingBooking.scheduledDate;
          existingBooking.arrivalWindow = quote.proposedWindow || existingBooking.arrivalWindow;
          existingBooking.updatedAt = now;
        } else {
          const bookingNum = `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
          db.bookings.unshift({
            id: `bkg_${crypto.randomBytes(5).toString('hex')}`,
            bookingNumber: bookingNum,
            jobRequestId: quote.jobRequestId,
            customerId: customer.id,
            quoteId: quote.id,
            serviceType: quote.serviceType,
            serviceCategory: quote.serviceCategory,
            status: 'CONFIRMED',
            scheduledDate: quote.proposedDate || new Date().toISOString().slice(0, 10),
            startTime: '09:00',
            endTime: '13:00',
            arrivalWindow: quote.proposedWindow || '09:00 AM - 10:00 AM',
            pickupAddress: job?.pickupAddress || customer.address || 'Calgary, AB',
            pickupCity: job?.pickupCity || customer.city || 'Calgary',
            destinationCity: job?.destinationCity,
            crewMemberIds: [],
            dispatchNotes: `Confirmed online upon digital quote acceptance by ${signatureName || customer.fullName}`,
            createdAt: now,
            updatedAt: now,
          });
        }
      }

      db.notifications.unshift({
        id: `ntf_${crypto.randomBytes(5).toString('hex')}`,
        eventType: decision === 'ACCEPT' ? 'QUOTE_ACCEPTED' : 'QUOTE_DECLINED',
        channel: 'EMAIL',
        recipientType: 'ADMIN',
        recipientAddress: BUSINESS_INFO.email,
        subject: `[Portal ${decision === 'ACCEPT' ? 'Accepted & Signed' : 'Declined'}] Quote ${quote.quoteNumber} — ${customer.fullName}`,
        bodyPreview: `${customer.fullName} ${decision === 'ACCEPT' ? `ACCEPTED and signed (Signature: "${signatureName || customer.fullName}")` : 'DECLINED'} Quote ${quote.quoteNumber} ($${(quote.totalCents / 100).toFixed(2)} CAD). Dispatch schedule updated.`,
        status: 'SENT',
        relatedLeadId: quote.leadId,
        createdAt: now,
      });

      db.activityLogs.unshift({
        id: `act_${crypto.randomBytes(5).toString('hex')}`,
        actorRole: 'CUSTOMER',
        entityType: 'QUOTE',
        entityId: quote.id,
        action: decision === 'ACCEPT' ? 'PORTAL_QUOTE_ACCEPTED' : 'PORTAL_QUOTE_DECLINED',
        summary: `${customer.fullName} ${decision === 'ACCEPT' ? `signed and accepted Quote ${quote.quoteNumber}` : `declined Quote ${quote.quoteNumber}`} in the Customer Portal.`,
        createdAt: now,
      });

      writePlatformStore(db);
      return NextResponse.json({ ok: true, quote });
    }

    // 2. CUSTOMER SUBMITS MOVE / BOOKING CHANGE REQUEST
    if (action === 'SUBMIT_CHANGE_REQUEST') {
      const { bookingId, requestType, newDate, newWindow, details } = body;
      const booking = db.bookings.find((b) => b.id === bookingId && b.customerId === customer.id);

      db.notifications.unshift({
        id: `ntf_${crypto.randomBytes(5).toString('hex')}`,
        eventType: 'BOOKING_CHANGED',
        channel: 'EMAIL',
        recipientType: 'ADMIN',
        recipientAddress: BUSINESS_INFO.email,
        subject: `[Customer Change Request] ${customer.fullName} — ${requestType || 'Schedule Update'}`,
        bodyPreview: `${customer.fullName} requested a move change (${requestType}): ${details || 'No details'}${newDate ? ` [Proposed New Date: ${newDate} (${newWindow || 'Any window'})]` : ''}. Booking: ${booking?.bookingNumber || 'General'}`,
        status: 'SENT',
        createdAt: now,
      });

      db.activityLogs.unshift({
        id: `act_${crypto.randomBytes(5).toString('hex')}`,
        actorRole: 'CUSTOMER',
        entityType: 'BOOKING',
        entityId: bookingId || 'general',
        action: 'PORTAL_CHANGE_REQUESTED',
        summary: `${customer.fullName} submitted a change request for ${booking?.bookingNumber || 'Move'}: ${requestType} — ${details}`,
        createdAt: now,
      });

      writePlatformStore(db);
      return NextResponse.json({
        ok: true,
        message: 'Your update request has been securely submitted to QuickMove Solutions dispatch.',
      });
    }

    // 2. CUSTOMER UPLOADS ADDITIONAL PHOTOS TO OWN JOB
    if (action === 'UPLOAD_ADDITIONAL_PHOTOS') {
      const { jobRequestId, photos } = body;
      const job = db.jobRequests.find(
        (j) => j.id === jobRequestId && j.customerId === customer.id
      );
      if (!job) {
        return NextResponse.json(
          { ok: false, error: 'Job request not found for your account.' },
          { status: 403 }
        );
      }

      const rawList = Array.isArray(photos) ? photos : [];
      for (const p of rawList) {
        const saved = savePrivateJobPhoto({
          originalFilename: p.originalFilename || 'portal-upload.jpg',
          mimeType: p.mimeType || 'image/jpeg',
          fileSizeBytes: Number(p.fileSizeBytes) || 1024,
          base64Data: p.dataUrl,
        });
        db.jobPhotos.unshift({
          id: `pho_${crypto.randomBytes(5).toString('hex')}`,
          jobRequestId: job.id,
          storageKey: saved.storageKey,
          originalFilename: saved.originalFilename,
          mimeType: saved.mimeType,
          fileSizeBytes: saved.fileSizeBytes,
          caption: p.caption || 'Uploaded via Customer Portal',
          previewDataUrl: p.dataUrl ? String(p.dataUrl).slice(0, 180000) : undefined,
          aiDetectedCategories: [],
          createdAt: now,
        });
      }

      db.activityLogs.unshift({
        id: `act_${crypto.randomBytes(5).toString('hex')}`,
        actorRole: 'CUSTOMER',
        entityType: 'JOB',
        entityId: job.id,
        action: 'PORTAL_PHOTOS_ADDED',
        summary: `${customer.fullName} uploaded ${rawList.length} additional photo(s) via Customer Portal.`,
        createdAt: now,
      });

      writePlatformStore(db);
      return NextResponse.json({ ok: true, added: rawList.length });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported portal action.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Portal action failed' },
      { status: 500 }
    );
  }
}

