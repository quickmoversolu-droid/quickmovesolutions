import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from '@/lib/auth/session';
import { readPlatformStore, writePlatformStore } from '@/lib/db/platform-store';
import { savePrivateJobPhoto } from '@/lib/storage/private-storage';
import { BUSINESS_INFO } from '@/lib/constants/business';

export async function GET(request: NextRequest) {
  const session = getServerSession();
  const db = readPlatformStore();

  const requestedCustomerId =
    request.nextUrl.searchParams.get('customerId') ||
    request.nextUrl.searchParams.get('cid');
  const requestedQuoteId = request.nextUrl.searchParams.get('quoteId');

  let targetCustomerId = '';

  if (session?.role === 'CUSTOMER' && session.customerId) {
    targetCustomerId = session.customerId;
  } else if (requestedCustomerId && requestedCustomerId.trim()) {
    const raw = requestedCustomerId.trim();
    const match = db.customers.find(
      (c) =>
        c.id === raw ||
        (c.portalPasscode && c.portalPasscode.toLowerCase() === raw.toLowerCase()) ||
        c.email.toLowerCase() === raw.toLowerCase()
    );
    targetCustomerId = match ? match.id : raw;
  } else if (requestedQuoteId && requestedQuoteId.trim()) {
    const rawQ = requestedQuoteId.trim();
    const matchQuote = db.quotes.find((q) => q.id === rawQ || q.quoteNumber === rawQ);
    if (matchQuote) {
      targetCustomerId = matchQuote.customerId;
    }
  } else if (session?.role === 'OWNER' || session?.role === 'ADMIN') {
    targetCustomerId = requestedCustomerId || 'cust_seed_1';
  } else {
    targetCustomerId = requestedCustomerId || 'cust_seed_1';
  }

  // Attempt to load customer from local database
  let customer = db.customers.find((c) => c.id === targetCustomerId);

  // If customer not found in memory (e.g. fresh Vercel serverless container), query InsForge database
  if (!customer && targetCustomerId) {
    try {
      const { pullRemoteRecordsFromInsForge } = await import('@/lib/backend/insforge-service');
      const remote = await pullRemoteRecordsFromInsForge();
      if (remote && remote.customers.length > 0) {
        let changed = false;
        for (const rc of remote.customers) {
          if (!db.customers.some((c) => c.id === rc.id)) {
            db.customers.unshift(rc);
            changed = true;
          }
        }
        for (const rl of remote.leads) {
          if (!db.leads.some((l) => l.id === rl.id)) {
            db.leads.unshift(rl);
            changed = true;
          }
        }
        for (const rj of remote.jobRequests) {
          if (!db.jobRequests.some((j) => j.id === rj.id)) {
            db.jobRequests.unshift(rj);
            changed = true;
          }
        }
        for (const rq of remote.quotes) {
          if (!db.quotes.some((q) => q.id === rq.id)) {
            db.quotes.unshift(rq);
            changed = true;
          }
        }
        for (const rb of remote.bookings) {
          if (!db.bookings.some((b) => b.id === rb.id)) {
            db.bookings.unshift(rb);
            changed = true;
          }
        }
        if (changed) {
          writePlatformStore(db);
        }
        customer = db.customers.find((c) => c.id === targetCustomerId);
      }
    } catch (remoteErr) {
      console.warn('[Portal InsForge Fallback Warning]:', remoteErr);
    }
  }

  // Fallback to primary seed customer if none specified or still not found
  if (!customer) {
    customer = db.customers.find((c) => c.id === 'cust_seed_1') || db.customers[0];
  }

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
      // Resiliently match quote by ID or quoteNumber across all quotes
      const quote = db.quotes.find(
        (q) => q.id === quoteId || q.quoteNumber === quoteId
      );
      if (!quote) {
        return NextResponse.json(
          { ok: false, error: 'Quotation not found.' },
          { status: 404 }
        );
      }

      // Resolve the true customer for this quotation
      const actualCustomer = db.customers.find((c) => c.id === quote.customerId) || customer;

      quote.status = decision === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED';
      quote.customerResponse =
        customerNote ||
        (decision === 'ACCEPT'
          ? `Digitally Accepted & Signed by ${signatureName || actualCustomer.fullName}`
          : 'Declined via Customer Portal');
      if (decision === 'ACCEPT' && signatureName) {
        quote.signatureName = signatureName;
        quote.signedAt = now;
      }
      quote.respondedAt = now;
      quote.updatedAt = now;

      const lead = db.leads.find((l) => l.id === quote.leadId);
      const job = db.jobRequests.find((j) => j.id === quote.jobRequestId);

      let createdOrConfirmedBooking = null;

      if (decision === 'ACCEPT') {
        if (lead) {
          lead.status = 'ACCEPTED';
          lead.updatedAt = now;
        }
        if (job) {
          job.lifecycleStage = 'CUSTOMER_ACCEPTED';
          job.updatedAt = now;
        }

        // Auto-provision or confirm Booking
        const existingBooking = db.bookings.find(
          (b) => b.jobRequestId === quote.jobRequestId || b.quoteId === quote.id
        );

        if (existingBooking) {
          existingBooking.status = 'CONFIRMED';
          existingBooking.scheduledDate = quote.proposedDate || existingBooking.scheduledDate;
          existingBooking.arrivalWindow = quote.proposedWindow || existingBooking.arrivalWindow;
          existingBooking.dispatchNotes = `Confirmed online upon digital quote acceptance by ${signatureName || actualCustomer.fullName}`;
          existingBooking.updatedAt = now;
          createdOrConfirmedBooking = existingBooking;
        } else {
          const bookingNum = `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
          const newBooking = {
            id: `bkg_${crypto.randomBytes(5).toString('hex')}`,
            bookingNumber: bookingNum,
            jobRequestId: quote.jobRequestId,
            customerId: actualCustomer.id,
            quoteId: quote.id,
            serviceType: quote.serviceType,
            serviceCategory: quote.serviceCategory,
            status: 'CONFIRMED' as const,
            scheduledDate: quote.proposedDate || new Date().toISOString().slice(0, 10),
            startTime: '09:00',
            endTime: '13:00',
            arrivalWindow: quote.proposedWindow || '09:00 AM - 10:00 AM',
            pickupAddress: job?.pickupAddress || actualCustomer.address || 'Calgary, AB',
            pickupCity: job?.pickupCity || actualCustomer.city || 'Calgary',
            destinationCity: job?.destinationCity,
            crewMemberIds: [],
            dispatchNotes: `Confirmed online upon digital quote acceptance by ${signatureName || actualCustomer.fullName}`,
            createdAt: now,
            updatedAt: now,
          };
          db.bookings.unshift(newBooking);
          createdOrConfirmedBooking = newBooking;
        }

        // Live Email Dispatch: Notify Admin & Dispatch of the Customer's Signature
        try {
          const { sendEmailDirect, generateEmailHtml } = await import('@/lib/notifications/notification-service');
          await sendEmailDirect({
            to: [BUSINESS_INFO.email, 'quickmoversolu@gmail.com'],
            subject: `🎉 [Quote Accepted & Signed] Quote ${quote.quoteNumber} — ${actualCustomer.fullName}`,
            html: generateEmailHtml({
              title: `Customer Accepted Quote ${quote.quoteNumber}`,
              recipientName: 'QuickMove Dispatch & Management',
              contentParagraphs: [
                `Great news! <strong>${actualCustomer.fullName}</strong> has officially accepted and digitally signed Quotation <strong>${quote.quoteNumber}</strong> online via the Customer Portal.`,
                `<strong>Service:</strong> ${quote.serviceType}`,
                `<strong>Scheduled Date:</strong> ${quote.proposedDate || 'Confirmed'} (${quote.proposedWindow || 'Arrival Window'})`,
                `<strong>Grand Total:</strong> $${(quote.totalCents / 100).toFixed(2)} CAD`,
                `<strong>Digital Signature:</strong> "${signatureName || actualCustomer.fullName}" (Signed at: ${now})`,
                `The dispatch calendar and booking status have been automatically confirmed.`,
              ],
              detailsBox: [
                { label: 'Customer', value: actualCustomer.fullName },
                { label: 'Phone', value: actualCustomer.phone },
                { label: 'Email', value: actualCustomer.email },
                { label: 'Quote', value: quote.quoteNumber },
                { label: 'Total', value: `$${(quote.totalCents / 100).toFixed(2)} CAD` },
                { label: 'Status', value: 'CONFIRMED' },
              ],
              ctaButton: {
                label: 'View in Dispatch Dashboard',
                url: `${BUSINESS_INFO.website}/admin/bookings`,
              },
            }),
          });
        } catch (emailErr) {
          console.warn('[Admin Accepted Quote Notification Warning]:', emailErr);
        }
      }

      db.notifications.unshift({
        id: `ntf_${crypto.randomBytes(5).toString('hex')}`,
        eventType: decision === 'ACCEPT' ? 'QUOTE_ACCEPTED' : 'QUOTE_DECLINED',
        channel: 'EMAIL',
        recipientType: 'ADMIN',
        recipientAddress: BUSINESS_INFO.email,
        subject: `[Portal ${decision === 'ACCEPT' ? 'Accepted & Signed' : 'Declined'}] Quote ${quote.quoteNumber} — ${actualCustomer.fullName}`,
        bodyPreview: `${actualCustomer.fullName} ${decision === 'ACCEPT' ? `ACCEPTED and signed (Signature: "${signatureName || actualCustomer.fullName}")` : 'DECLINED'} Quote ${quote.quoteNumber} ($${(quote.totalCents / 100).toFixed(2)} CAD). Dispatch schedule updated.`,
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
        summary: `${actualCustomer.fullName} ${decision === 'ACCEPT' ? `signed and accepted Quote ${quote.quoteNumber}` : `declined Quote ${quote.quoteNumber}`} in the Customer Portal.`,
        createdAt: now,
      });

      writePlatformStore(db);

      // Asynchronous background sync to InsForge Database
      try {
        const { syncRecordToInsForge } = await import('@/lib/backend/insforge-service');
        await Promise.allSettled([
          syncRecordToInsForge('Quote', quote as any),
          lead ? syncRecordToInsForge('Lead', lead as any) : Promise.resolve(),
          job ? syncRecordToInsForge('JobRequest', job as any) : Promise.resolve(),
          createdOrConfirmedBooking ? syncRecordToInsForge('Booking', createdOrConfirmedBooking as any) : Promise.resolve(),
        ]);
      } catch (syncErr) {
        console.warn('[InsForge Sync Warning]:', syncErr);
      }

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

