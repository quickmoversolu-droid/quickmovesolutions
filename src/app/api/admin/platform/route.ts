import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession, ROLE_PERMISSION_MATRIX } from '@/lib/auth/session';
import {
  readPlatformStore,
  writePlatformStore,
  calculateServerQuoteTotals,
  detectBookingConflicts,
  hashPasswordScrypt,
  generateTemporaryPassword,
  buildDefaultModulePermissions,
  LeadStatus,
  JobLifecycleStage,
  QuoteStatus,
  BookingStatus,
  MarketingPostStatus,
  QuoteRecord,
  BookingRecord,
  MarketingPostRecord,
  UserRole,
  UserRecord,
  CustomRoleRecord,
  UserPermissionMatrix,
} from '@/lib/db/platform-store';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { publishPostToMeta } from '@/lib/marketing/meta-publisher';

export async function GET() {
  const session = getServerSession();
  const db = readPlatformStore();

  // If no session, default to OWNER in read-mode for seamless local preview or return session info
  const activeRole = session?.role || 'OWNER';
  const permissions = ROLE_PERMISSION_MATRIX[activeRole];

  // Sanitize passwordHash before returning to client (never expose password hashes)
  const sanitizedUsers = db.users.map((u) => {
    const { passwordHash, ...rest } = u;
    return {
      ...rest,
      hasPasswordHash: Boolean(passwordHash && passwordHash.startsWith('scrypt$')),
    };
  });

  return NextResponse.json({
    ok: true,
    session: session || {
      userId: 'usr_owner_1',
      email: BUSINESS_INFO.email,
      name: 'QuickMove Owner',
      role: 'OWNER',
    },
    permissions,
    data: {
      ...db,
      users: sanitizedUsers,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = getServerSession();
    const actorRole = session?.role || 'OWNER';
    const actorName = session?.name || 'QuickMove Owner';
    const permissions = ROLE_PERMISSION_MATRIX[actorRole];

    const body = await request.json();
    const action = String(body.action || '');
    const db = readPlatformStore();
    const now = new Date().toISOString();

    const logActivity = (entityType: string, entityId: string, act: string, summary: string) => {
      db.activityLogs.unshift({
        id: `act_${crypto.randomBytes(5).toString('hex')}`,
        actorRole,
        entityType,
        entityId,
        action: act,
        summary,
        createdAt: now,
      });
    };

    const pushNotification = (params: {
      eventType: string;
      recipientType: 'CUSTOMER' | 'ADMIN';
      recipientAddress: string;
      subject: string;
      bodyPreview: string;
      relatedLeadId?: string;
    }) => {
      db.notifications.unshift({
        id: `ntf_${crypto.randomBytes(5).toString('hex')}`,
        eventType: params.eventType,
        channel: 'EMAIL',
        recipientType: params.recipientType,
        recipientAddress: params.recipientAddress,
        subject: params.subject,
        bodyPreview: params.bodyPreview,
        status: 'SENT',
        relatedLeadId: params.relatedLeadId,
        createdAt: now,
      });
    };

    // 1. UPDATE LEAD STATUS
    if (action === 'UPDATE_LEAD_STATUS') {
      if (!permissions.canAccessCrm) {
        return NextResponse.json({ ok: false, error: 'Insufficient role permissions for CRM.' }, { status: 403 });
      }
      const { leadId, status, internalNotes } = body;
      const lead = db.leads.find((l) => l.id === leadId);
      if (!lead) {
        return NextResponse.json({ ok: false, error: 'Lead not found' }, { status: 404 });
      }
      lead.status = status as LeadStatus;
      if (typeof internalNotes === 'string') {
        lead.internalNotes = internalNotes;
      }
      lead.updatedAt = now;
      logActivity('LEAD', lead.id, 'LEAD_STATUS_UPDATED', `Updated lead ${lead.referenceCode} status to ${status}.`);
      writePlatformStore(db);
      return NextResponse.json({ ok: true, lead });
    }

    // 2. UPDATE JOB LIFECYCLE STAGE & ASSIGNMENTS
    if (action === 'UPDATE_JOB_STAGE') {
      const { jobRequestId, lifecycleStage, assignedTeamId, assignedVehicleId, completionNotes } = body;
      const job = db.jobRequests.find((j) => j.id === jobRequestId);
      if (!job) {
        return NextResponse.json({ ok: false, error: 'Job request not found' }, { status: 404 });
      }
      if (lifecycleStage) job.lifecycleStage = lifecycleStage as JobLifecycleStage;
      if (assignedTeamId !== undefined) job.assignedTeamId = assignedTeamId || undefined;
      if (assignedVehicleId !== undefined) job.assignedVehicleId = assignedVehicleId || undefined;
      if (typeof completionNotes === 'string') job.completionNotes = completionNotes;

      if (lifecycleStage === 'JOB_COMPLETED') {
        job.completedAt = now;
        const customer = db.customers.find((c) => c.id === job.customerId);
        if (customer) {
          pushNotification({
            eventType: 'JOB_COMPLETED_REVIEW_INVITE',
            recipientType: 'CUSTOMER',
            recipientAddress: customer.email,
            subject: `Thank You from QuickMove Solutions — How Did Our Crew Do?`,
            bodyPreview: `Hi ${customer.fullName}, your ${job.serviceType} job has been marked completed. Thank you for choosing QuickMove Solutions!`,
            relatedLeadId: job.leadId,
          });
        }
      }
      job.updatedAt = now;
      logActivity('JOB', job.id, 'JOB_UPDATED', `Updated job ${job.id} to stage ${job.lifecycleStage}.`);
      writePlatformStore(db);
      return NextResponse.json({ ok: true, job });
    }

    // 3. TOGGLE CHECKLIST ITEM
    if (action === 'TOGGLE_CHECKLIST_ITEM') {
      const { checklistId, itemId } = body;
      const checklist = db.jobChecklists.find((c) => c.id === checklistId);
      if (!checklist) {
        return NextResponse.json({ ok: false, error: 'Checklist not found' }, { status: 404 });
      }
      const item = checklist.items.find((i) => i.id === itemId);
      if (item) {
        item.isCompleted = !item.isCompleted;
        item.completedAt = item.isCompleted ? now : undefined;
        logActivity(
          'CHECKLIST',
          checklist.id,
          'CHECKLIST_ITEM_TOGGLED',
          `${item.isCompleted ? 'Completed' : 'Reopened'} checklist step: "${item.label}".`
        );
        writePlatformStore(db);
      }
      return NextResponse.json({ ok: true, checklist });
    }

    // 4. CREATE OR REVISE ITEMIZED QUOTE (Server-side calculation enforced)
    if (action === 'CREATE_QUOTE') {
      if (!permissions.canManageQuotes) {
        return NextResponse.json({ ok: false, error: 'Role cannot manage quotes.' }, { status: 403 });
      }
      const {
        jobRequestId,
        proposedDate,
        proposedWindow,
        scopeSummary,
        lineItems,
        discountCents,
        depositCents,
        validityDays,
        termsAndNotes,
        sendImmediately,
      } = body;

      const job = db.jobRequests.find((j) => j.id === jobRequestId);
      if (!job) {
        return NextResponse.json({ ok: false, error: 'Associated job request not found.' }, { status: 404 });
      }
      const customer = db.customers.find((c) => c.id === job.customerId);
      const calc = calculateServerQuoteTotals(
        Array.isArray(lineItems) ? lineItems : [],
        Number(discountCents) || 0,
        db.settings.albertaGstPercent || 5.0
      );

      const quoteNumber = `Q-${new Date().getFullYear()}-${1001 + db.quotes.length}`;
      const valDays = Number(validityDays) || db.settings.defaultQuoteValidityDays || 14;
      const validUntilDate = new Date(Date.now() + valDays * 86400000).toISOString().slice(0, 10);

      const newQuote: QuoteRecord = {
        id: `quo_${crypto.randomBytes(5).toString('hex')}`,
        quoteNumber,
        version: 1,
        leadId: job.leadId,
        jobRequestId: job.id,
        customerId: job.customerId,
        serviceType: job.serviceType,
        serviceCategory: job.serviceCategory,
        status: sendImmediately ? 'SENT' : 'DRAFT',
        proposedDate: proposedDate || job.preferredDate,
        proposedWindow: proposedWindow || '8:30 AM – 10:30 AM Arrival',
        scopeSummary: scopeSummary || job.aiSummary,
        lineItems: calc.computedItems,
        subtotalCents: calc.subtotalCents,
        discountCents: calc.discountCents,
        taxRatePercent: calc.taxRatePercent,
        taxCents: calc.taxCents,
        totalCents: calc.totalCents,
        depositCents: Math.max(0, Math.round(Number(depositCents) || 0)),
        validityDays: valDays,
        validUntil: validUntilDate,
        termsAndNotes:
          termsAndNotes ||
          'Includes professional crew, equipped truck, furniture protection, and standard cargo coverage. Subject to 5% Alberta GST.',
        createdAt: now,
        updatedAt: now,
      };

      db.quotes.unshift(newQuote);

      if (sendImmediately && customer) {
        const lead = db.leads.find((l) => l.id === job.leadId);
        if (lead) lead.status = 'QUOTE_SENT';
        job.lifecycleStage = 'QUOTE_SENT';

        pushNotification({
          eventType: 'QUOTE_SENT',
          recipientType: 'CUSTOMER',
          recipientAddress: customer.email,
          subject: `Your QuickMove Solutions Quotation (${quoteNumber})`,
          bodyPreview: `Hi ${customer.fullName}, your itemized quotation ${quoteNumber} ($${(newQuote.totalCents / 100).toFixed(2)} CAD incl. GST) is ready for review.`,
          relatedLeadId: job.leadId,
        });
      }

      logActivity(
        'QUOTE',
        newQuote.id,
        'QUOTE_CREATED',
        `Created Quote ${quoteNumber} ($${(newQuote.totalCents / 100).toFixed(2)} CAD) for ${customer?.fullName || 'Customer'}.`
      );
      writePlatformStore(db);
      return NextResponse.json({ ok: true, quote: newQuote });
    }

    // 5. UPDATE QUOTE STATUS (Send / Accept / Decline / Duplicate)
    if (action === 'UPDATE_QUOTE_STATUS') {
      const { quoteId, status, customerResponse } = body;
      const quote = db.quotes.find((q) => q.id === quoteId);
      if (!quote) {
        return NextResponse.json({ ok: false, error: 'Quote not found' }, { status: 404 });
      }
      quote.status = status as QuoteStatus;
      if (customerResponse) quote.customerResponse = customerResponse;
      quote.respondedAt = now;
      quote.updatedAt = now;

      const lead = db.leads.find((l) => l.id === quote.leadId);
      const job = db.jobRequests.find((j) => j.id === quote.jobRequestId);
      const customer = db.customers.find((c) => c.id === quote.customerId);

      if (status === 'SENT' && customer) {
        if (lead) lead.status = 'QUOTE_SENT';
        if (job) job.lifecycleStage = 'QUOTE_SENT';
        pushNotification({
          eventType: 'QUOTE_SENT',
          recipientType: 'CUSTOMER',
          recipientAddress: customer.email,
          subject: `Your QuickMove Solutions Quotation (${quote.quoteNumber})`,
          bodyPreview: `Hi ${customer.fullName}, your itemized quote ${quote.quoteNumber} is ready for review.`,
          relatedLeadId: quote.leadId,
        });
      }

      if (status === 'ACCEPTED') {
        if (lead) lead.status = 'ACCEPTED';
        if (job) job.lifecycleStage = 'CUSTOMER_ACCEPTED';
        pushNotification({
          eventType: 'QUOTE_ACCEPTED',
          recipientType: 'ADMIN',
          recipientAddress: BUSINESS_INFO.email,
          subject: `[Quote Accepted ${quote.quoteNumber}] ${customer?.fullName || 'Customer'}`,
          bodyPreview: `Quote ${quote.quoteNumber} was marked ACCEPTED. Ready for booking & crew dispatch confirmation.`,
          relatedLeadId: quote.leadId,
        });
      }

      logActivity('QUOTE', quote.id, `QUOTE_${status}`, `Quote ${quote.quoteNumber} marked as ${status}.`);
      writePlatformStore(db);
      return NextResponse.json({ ok: true, quote });
    }

    // 6. CREATE OR UPDATE BOOKING WITH DOUBLE-BOOKING CONFLICT DETECTION
    if (action === 'CREATE_BOOKING') {
      if (!permissions.canManageBookings) {
        return NextResponse.json({ ok: false, error: 'Role cannot manage bookings.' }, { status: 403 });
      }
      const {
        jobRequestId,
        quoteId,
        scheduledDate,
        startTime,
        endTime,
        arrivalWindow,
        assignedTeamId,
        assignedVehicleId,
        crewMemberIds,
        status,
        dispatchNotes,
      } = body;

      const job = db.jobRequests.find((j) => j.id === jobRequestId);
      if (!job) {
        return NextResponse.json({ ok: false, error: 'Job request not found.' }, { status: 404 });
      }

      const conflictCheck = detectBookingConflicts(db.bookings, {
        scheduledDate,
        startTime,
        endTime,
        assignedTeamId,
        assignedVehicleId,
        crewMemberIds: Array.isArray(crewMemberIds) ? crewMemberIds : [],
      });

      if (conflictCheck.hasConflict) {
        return NextResponse.json(
          {
            ok: false,
            error: conflictCheck.conflicts.join(' '),
            conflicts: conflictCheck.conflicts,
          },
          { status: 409 }
        );
      }

      const bookingNumber = `BK-${new Date().getFullYear()}-${501 + db.bookings.length}`;
      const newBooking: BookingRecord = {
        id: `bkg_${crypto.randomBytes(5).toString('hex')}`,
        bookingNumber,
        jobRequestId: job.id,
        customerId: job.customerId,
        quoteId: quoteId || undefined,
        serviceType: job.serviceType,
        serviceCategory: job.serviceCategory,
        status: (status as BookingStatus) || 'CONFIRMED',
        scheduledDate,
        startTime,
        endTime,
        arrivalWindow: arrivalWindow || `${startTime} – ${endTime}`,
        assignedTeamId: assignedTeamId || undefined,
        assignedVehicleId: assignedVehicleId || undefined,
        crewMemberIds: Array.isArray(crewMemberIds) ? crewMemberIds : [],
        pickupAddress: job.pickupAddress,
        pickupCity: job.pickupCity,
        destinationCity: job.destinationCity,
        dispatchNotes: dispatchNotes || '',
        createdAt: now,
        updatedAt: now,
      };

      db.bookings.unshift(newBooking);
      job.confirmedDate = scheduledDate;
      job.assignedTeamId = assignedTeamId || job.assignedTeamId;
      job.assignedVehicleId = assignedVehicleId || job.assignedVehicleId;
      job.lifecycleStage = assignedTeamId ? 'TEAM_ASSIGNED' : 'BOOKING_CONFIRMED';

      const lead = db.leads.find((l) => l.id === job.leadId);
      if (lead) lead.status = 'BOOKED';

      const customer = db.customers.find((c) => c.id === job.customerId);
      if (customer) {
        pushNotification({
          eventType: 'BOOKING_CONFIRMED',
          recipientType: 'CUSTOMER',
          recipientAddress: customer.email,
          subject: `Booking Confirmed (${bookingNumber}) — QuickMove Solutions`,
          bodyPreview: `Hi ${customer.fullName}, your booking ${bookingNumber} is confirmed for ${scheduledDate} (${newBooking.arrivalWindow}).`,
          relatedLeadId: job.leadId,
        });
      }

      logActivity(
        'BOOKING',
        newBooking.id,
        'BOOKING_CREATED',
        `Scheduled Booking ${bookingNumber} on ${scheduledDate} (${startTime}–${endTime}).`
      );
      writePlatformStore(db);
      return NextResponse.json({ ok: true, booking: newBooking });
    }

    // 7. UPDATE BOOKING STATUS / RESCHEDULE WITH CONFLICT DETECTION
    if (action === 'UPDATE_BOOKING') {
      const { bookingId, status, scheduledDate, startTime, endTime, assignedTeamId, assignedVehicleId } = body;
      const booking = db.bookings.find((b) => b.id === bookingId);
      if (!booking) {
        return NextResponse.json({ ok: false, error: 'Booking not found' }, { status: 404 });
      }

      const nextDate = scheduledDate || booking.scheduledDate;
      const nextStart = startTime || booking.startTime;
      const nextEnd = endTime || booking.endTime;
      const nextTeam = assignedTeamId !== undefined ? assignedTeamId : booking.assignedTeamId;
      const nextVehicle = assignedVehicleId !== undefined ? assignedVehicleId : booking.assignedVehicleId;

      if (status !== 'CANCELLED') {
        const conflictCheck = detectBookingConflicts(db.bookings, {
          excludeBookingId: booking.id,
          scheduledDate: nextDate,
          startTime: nextStart,
          endTime: nextEnd,
          assignedTeamId: nextTeam,
          assignedVehicleId: nextVehicle,
          crewMemberIds: booking.crewMemberIds,
        });
        if (conflictCheck.hasConflict) {
          return NextResponse.json(
            { ok: false, error: conflictCheck.conflicts.join(' '), conflicts: conflictCheck.conflicts },
            { status: 409 }
          );
        }
      }

      if (status) booking.status = status as BookingStatus;
      booking.scheduledDate = nextDate;
      booking.startTime = nextStart;
      booking.endTime = nextEnd;
      booking.assignedTeamId = nextTeam;
      booking.assignedVehicleId = nextVehicle;
      booking.updatedAt = now;

      logActivity('BOOKING', booking.id, 'BOOKING_UPDATED', `Updated Booking ${booking.bookingNumber} (${booking.status}, ${booking.scheduledDate}).`);
      writePlatformStore(db);
      return NextResponse.json({ ok: true, booking });
    }

    // 8. ADD EMPLOYEE OR VEHICLE
    if (action === 'CREATE_EMPLOYEE') {
      if (!permissions.canManageFleetAndEmployees) {
        return NextResponse.json({ ok: false, error: 'Insufficient permissions.' }, { status: 403 });
      }
      const emp = {
        id: `emp_${crypto.randomBytes(4).toString('hex')}`,
        fullName: String(body.fullName || 'New Team Member'),
        phone: String(body.phone || BUSINESS_INFO.phoneDisplay),
        email: String(body.email || BUSINESS_INFO.email),
        role: body.role || 'MOVER',
        skills: Array.isArray(body.skills) ? body.skills : ['Residential Moving', 'Furniture Protection'],
        status: 'ACTIVE' as const,
        availabilityNote: String(body.availabilityNote || 'Full-Time'),
        internalNotes: String(body.internalNotes || ''),
        createdAt: now,
        updatedAt: now,
      };
      db.employees.push(emp);
      logActivity('EMPLOYEE', emp.id, 'EMPLOYEE_ADDED', `Added staff member ${emp.fullName} (${emp.role}).`);
      writePlatformStore(db);
      return NextResponse.json({ ok: true, employee: emp });
    }

    if (action === 'CREATE_VEHICLE') {
      if (!permissions.canManageFleetAndEmployees) {
        return NextResponse.json({ ok: false, error: 'Insufficient permissions.' }, { status: 403 });
      }
      const veh = {
        id: `veh_${crypto.randomBytes(4).toString('hex')}`,
        name: String(body.name || 'New Moving Unit'),
        vehicleType: body.vehicleType || '26FT_BOX_TRUCK',
        capacitySummary: String(body.capacitySummary || 'Equipped Moving & Delivery Unit'),
        licensePlate: String(body.licensePlate || 'AB-QMS-NEW'),
        status: 'AVAILABLE' as const,
        maintenanceNote: String(body.maintenanceNote || 'Inspection current.'),
        createdAt: now,
      };
      db.vehicles.push(veh);
      logActivity('VEHICLE', veh.id, 'VEHICLE_ADDED', `Added fleet vehicle ${veh.name}.`);
      writePlatformStore(db);
      return NextResponse.json({ ok: true, vehicle: veh });
    }

    // 9. AI MARKETING STUDIO: GENERATE COMPLIANT POST OR 7-DAY WEEKLY PLAN
    if (action === 'GENERATE_AI_POST') {
      const {
        platform = 'BOTH',
        contentPillar = 'Residential Moving',
        serviceFocus = 'Residential Moving',
        targetCity = 'Calgary',
        tone = 'Helpful, Local & Professional',
        goal = 'Generate Quote Requests',
        customTopic = '',
        aspectRatio = '4:5',
      } = body;

      const isJunk =
        serviceFocus.toLowerCase().includes('junk') ||
        contentPillar.toLowerCase().includes('junk');

      const title = customTopic
        ? `${customTopic} — ${targetCity} (${serviceFocus})`
        : isJunk
          ? `Clear Your Space in ${targetCity}: Snap Photos for a Fast Junk Removal Quote`
          : `Smooth, Organized ${serviceFocus} in ${targetCity} & Surrounding Alberta`;

      const hook = isJunk
        ? `Ready to reclaim your garage, basement, or spare room in ${targetCity} without the heavy lifting?`
        : `Planning a ${serviceFocus.toLowerCase()} in ${targetCity}? Preparation and careful protection make all the difference:`;

      const quotePath = isJunk ? '/get-a-quote/junk-removal' : '/get-a-quote';

      const primaryCaption = `${hook}\n\nAt ${BUSINESS_INFO.name} ("${BUSINESS_INFO.tagline}"), our ${targetCity} crew handles the heavy lifting with padded furniture blankets, floor runners, and clear arrival windows.\n\n${
        isJunk
          ? 'Simply snap or upload photos of your unwanted furniture, mattresses, appliances, or household clutter using our 6-Step Photo-First Junk Removal Quote tool.'
          : 'Use our 8-Step Visual Moving Quote tool to share your property size, access details, and preferred moving date for a clear written scope.'
      }\n\nRequest your free estimate at ${BUSINESS_INFO.website}${quotePath} or call ${BUSINESS_INFO.phoneDisplay}.`;

      const shortCaption = `${BUSINESS_INFO.tagline} Serving ${targetCity} for ${serviceFocus}. Get your free quote at ${BUSINESS_INFO.domain}${quotePath} or call ${BUSINESS_INFO.phoneDisplay}.`;

      const newPost: MarketingPostRecord = {
        id: `mp_${crypto.randomBytes(5).toString('hex')}`,
        title,
        platform,
        contentPillar,
        serviceFocus,
        targetCity,
        tone,
        goal,
        hook,
        primaryCaption,
        shortCaption,
        hashtags: [
          `#${targetCity.replace(/\s+/g, '')}Movers`,
          '#QuickMoveSolutions',
          isJunk ? '#CalgaryJunkRemoval' : '#YYCMoving',
          '#AlbertaMoving',
          '#SpaceMadeClear',
        ],
        ctaText: `Request a Free Quote at ${BUSINESS_INFO.domain}${quotePath} or call ${BUSINESS_INFO.phoneDisplay}`,
        visualConcept: isJunk
          ? `QuickMove Solutions crew loading old furniture into a clean high-wall junk removal truck in ${targetCity}, followed by a swept garage floor.`
          : `Uniformed QuickMove Solutions movers in navy (#101D35) and orange (#F47732) wrapping household furniture in a bright ${targetCity} home.`,
        imagePrompt: `Photorealistic commercial brand photography for QuickMove Solutions in ${targetCity}, Alberta. Professional movers wearing navy blue uniforms with orange accents carefully handling ${serviceFocus.toLowerCase()}, clean daylight, high trust aesthetic.`,
        overlayText: isJunk
          ? `${targetCity} Photo Junk Removal • ${BUSINESS_INFO.phoneDisplay}`
          : `${targetCity} ${serviceFocus} • ${BUSINESS_INFO.phoneDisplay}`,
        aspectRatio,
        status: 'PENDING_APPROVAL',
        scheduledFor: new Date(Date.now() + 2 * 86400000).toISOString(),
        createdAt: now,
        updatedAt: now,
      };

      db.marketingPosts.unshift(newPost);
      logActivity(
        'MARKETING_POST',
        newPost.id,
        'AI_POST_GENERATED',
        `Generated compliant marketing post "${newPost.title}" in PENDING_APPROVAL state.`
      );
      writePlatformStore(db);
      return NextResponse.json({ ok: true, post: newPost });
    }

    // 10. GENERATE 7-DAY BALANCED WEEKLY MARKETING PLAN (Section 10.6)
    if (action === 'GENERATE_WEEKLY_PLAN') {
      const weeklyPlanBlueprint = [
        {
          dayOffset: 1,
          pillar: 'Moving Services Spotlight',
          service: 'Residential Moving',
          city: 'Calgary',
          platform: 'BOTH' as const,
          title: 'Monday Calgary Residential Moving Checklist: Protecting Floors & Doorframes',
        },
        {
          dayOffset: 2,
          pillar: 'Junk Removal & Space Clearing',
          service: 'Full Junk Removal',
          city: 'Calgary',
          platform: 'INSTAGRAM' as const,
          title: 'Tuesday Photo-First Junk Removal: Snap a Photo of Old Furniture or Mattresses',
        },
        {
          dayOffset: 3,
          pillar: 'Moving Tips & Education',
          service: 'Packing & Unpacking',
          city: 'Airdrie',
          platform: 'FACEBOOK' as const,
          title: 'Wednesday Packing Tip: How to Pack fragile Kitchen Glassware for an Airdrie Move',
        },
        {
          dayOffset: 4,
          pillar: 'Local Area Awareness',
          service: 'Long-Distance Moving',
          city: 'Red Deer',
          platform: 'BOTH' as const,
          title: 'Thursday Highway 2 Corridor Moves: Coordinated Calgary, Red Deer & Edmonton Relocations',
        },
        {
          dayOffset: 5,
          pillar: 'Delivery & Commercial Spotlight',
          service: 'Delivery Services',
          city: 'Calgary',
          platform: 'INSTAGRAM' as const,
          title: 'Friday Store-to-Home Furniture & Appliance Delivery Across Calgary',
        },
      ];

      const createdPosts: MarketingPostRecord[] = [];
      for (const item of weeklyPlanBlueprint) {
        const isJunk = item.service.includes('Junk');
        const schedDate = new Date(Date.now() + item.dayOffset * 86400000).toISOString();
        const post: MarketingPostRecord = {
          id: `mp_${crypto.randomBytes(5).toString('hex')}`,
          title: item.title,
          platform: item.platform,
          contentPillar: item.pillar,
          serviceFocus: item.service,
          targetCity: item.city,
          tone: 'Professional, Reassuring & Local',
          goal: 'Balanced Weekly Brand & Lead Generation',
          hook: item.title,
          primaryCaption: `${item.title}\n\n${BUSINESS_INFO.name} — "${BUSINESS_INFO.tagline}"\n\nServing Calgary, Airdrie, Strathmore, Red Deer, and Edmonton with careful moving, delivery, and full junk removal. Request your free written quote at ${BUSINESS_INFO.website}/get-a-quote or call ${BUSINESS_INFO.phoneDisplay}.`,
          shortCaption: `${item.title} — Call ${BUSINESS_INFO.phoneDisplay} or visit ${BUSINESS_INFO.domain}.`,
          hashtags: ['#QuickMoveSolutions', `#${item.city.replace(/\s+/g, '')}`, '#CalgaryMovers', '#CalgaryJunkRemoval'],
          ctaText: `Call ${BUSINESS_INFO.phoneDisplay} or get a quote at ${BUSINESS_INFO.domain}`,
          visualConcept: `Branded navy and orange visual highlighting ${item.service} in ${item.city}.`,
          imagePrompt: `Professional photography of QuickMove Solutions crew performing ${item.service} in ${item.city} Alberta.`,
          overlayText: `${item.service} • ${item.city}`,
          aspectRatio: '1:1',
          status: 'PENDING_APPROVAL',
          scheduledFor: schedDate,
          createdAt: now,
          updatedAt: now,
        };
        db.marketingPosts.unshift(post);
        createdPosts.push(post);
      }

      logActivity(
        'MARKETING_PLAN',
        'weekly_plan',
        'WEEKLY_PLAN_GENERATED',
        `Generated 5-post balanced weekly content plan across Moving, Junk Removal, Packing, Delivery & Alberta Service Areas.`
      );
      writePlatformStore(db);
      return NextResponse.json({ ok: true, createdPosts });
    }

    // 10B. GENERATE STRATEGIC MONTHLY CONTENT PLAN (12 POSTS ACROSS 4 WEEKS)
    if (action === 'GENERATE_MONTHLY_PLAN') {
      const monthlyPlanBlueprint = [
        // Week 1: Residential Moving & Packing Education
        {
          dayOffset: 2,
          pillar: 'Moving Services Spotlight',
          service: 'Residential Moving',
          city: 'Calgary',
          platform: 'BOTH' as const,
          title: 'Week 1: Stress-Free Mount Royal & SW Calgary Home Relocations',
          concept: 'Photo of QuickMove truck parked outside modern luxury home in Calgary.',
        },
        {
          dayOffset: 4,
          pillar: 'Moving Tips & Education',
          service: 'Packing & Unpacking',
          city: 'Airdrie',
          platform: 'INSTAGRAM' as const,
          title: 'Week 1: Top 5 Packing Hacks for Moving Without Broken Dishes',
          concept: 'Side-by-side comparison of bubble-wrapped fragile items and packed wardrobe boxes.',
        },
        {
          dayOffset: 6,
          pillar: 'Customer Testimonial & Social Proof',
          service: 'Residential Moving',
          city: 'Chestermere',
          platform: 'FACEBOOK' as const,
          title: 'Week 1: "Moved our 4-bedroom home in 6 hours with zero scratches!" — 5-Star Review',
          concept: 'Smiling family holding new house keys next to QuickMove branded moving truck.',
        },

        // Week 2: Junk Removal & Eco-Friendly Decluttering
        {
          dayOffset: 9,
          pillar: 'Junk Removal & Space Clearing',
          service: 'Full Junk Removal',
          city: 'Calgary',
          platform: 'BOTH' as const,
          title: 'Week 2: Spring Garage & Basement Cleanout: Photo-First Estimates in 15 Minutes',
          concept: 'Before and after garage declutter transformation with donation sorting.',
        },
        {
          dayOffset: 11,
          pillar: 'Eco-Friendly Recycling',
          service: 'Junk Removal & Donation',
          city: 'Okotoks',
          platform: 'INSTAGRAM' as const,
          title: 'Week 2: Where Does Your Junk Go? 80%+ Donated or Recycled in Alberta',
          concept: 'Infographic card showing electronics, scrap metal, and wood diversion from landfills.',
        },
        {
          dayOffset: 13,
          pillar: 'Junk Removal & Space Clearing',
          service: 'Renovation Debris Removal',
          city: 'Cochrane',
          platform: 'FACEBOOK' as const,
          title: 'Week 2: Post-Renovation Cleanup: Drywall, Tiles & Scrap Lumber Hauled Away',
          concept: 'Heavy-duty hauling crew clearing renovation debris cleanly from driveway.',
        },

        // Week 3: Commercial Relocation & Large Item Delivery
        {
          dayOffset: 16,
          pillar: 'Delivery & Commercial Spotlight',
          service: 'Commercial Office Relocation',
          city: 'Calgary Downtown',
          platform: 'BOTH' as const,
          title: 'Week 3: Zero-Downtime Weekend Corporate & Office Relocations in Calgary',
          concept: 'Modern office workstations and conference suites neatly packed and protected.',
        },
        {
          dayOffset: 18,
          pillar: 'Delivery & Commercial Spotlight',
          service: 'Furniture & Appliance Delivery',
          city: 'Calgary',
          platform: 'INSTAGRAM' as const,
          title: 'Week 3: Bought a New Couch or Fridge? White-Glove Store-to-Living-Room Delivery',
          concept: 'Clean delivery crew bringing wrapped designer sofa through double front doors.',
        },
        {
          dayOffset: 20,
          pillar: 'Moving Tips & Education',
          service: 'Specialty Item Handling',
          city: 'Calgary',
          platform: 'FACEBOOK' as const,
          title: 'Week 3: Moving Pianos, Safes & Heavy Exercise Equipment Safely',
          concept: 'Heavy equipment rigging with hydraulic liftgate truck and protective blankets.',
        },

        // Week 4: Regional Alberta Moves & Final Month Surge
        {
          dayOffset: 23,
          pillar: 'Local Area Awareness',
          service: 'Highway 2 Long Distance',
          city: 'Red Deer & Edmonton',
          platform: 'BOTH' as const,
          title: 'Week 4: Inter-City Moves: Calgary to Red Deer, Edmonton & Beyond',
          concept: 'QuickMove truck driving down Alberta Highway 2 under blue prairie skies.',
        },
        {
          dayOffset: 25,
          pillar: 'Moving Tips & Education',
          service: 'Condo & Apartment Moving',
          city: 'Beltline, Calgary',
          platform: 'INSTAGRAM' as const,
          title: 'Week 4: Calgary Condo Elevator Booking & Moving Rules You Must Know',
          concept: 'Elevator padded protection walls and smooth rolling dollies in downtown high-rise.',
        },
        {
          dayOffset: 27,
          pillar: 'Customer Testimonial & Social Proof',
          service: 'Complete Moving & Clearout',
          city: 'Calgary & Surrounding',
          platform: 'FACEBOOK' as const,
          title: 'Week 4: Monthly Wrap-Up: 100+ Calgary Families & Businesses Moved with Care',
          concept: 'Full team photo with thumbs up in front of equipped QuickMove fleet.',
        },
      ];

      const createdMonthlyPosts: MarketingPostRecord[] = [];
      for (const item of monthlyPlanBlueprint) {
        const schedDate = new Date(Date.now() + item.dayOffset * 86400000).toISOString();
        const post: MarketingPostRecord = {
          id: `mp_m_${crypto.randomBytes(5).toString('hex')}`,
          campaignId: 'camp_calgary_strategic_month',
          title: item.title,
          platform: item.platform,
          contentPillar: item.pillar,
          serviceFocus: item.service,
          targetCity: item.city,
          tone: 'Authoritative, Reassuring & Local',
          goal: 'Monthly Comprehensive Lead Generation & Brand Presence',
          hook: item.title,
          primaryCaption: `${item.title}\n\n${BUSINESS_INFO.name} — "${BUSINESS_INFO.tagline}"\n\nFull-service relocations, furniture transport, and photo-first junk removal across Calgary, Airdrie, Chestermere, Cochrane, Okotoks, Red Deer, and Edmonton.\n\n✨ Why Calgary chooses us:\n• Transparent upfront pricing (No hidden fees)\n• Equipped moving trucks with 50+ furniture pads & straps\n• Fully licensed & Alberta cargo insured\n• Photo-first junk quotes in 15 minutes\n\n👉 Get your free instant estimate: ${BUSINESS_INFO.website}/get-a-quote?utm_source=${item.platform.toLowerCase()}&utm_medium=social&utm_campaign=monthly_plan\n📞 Call or text our dispatch team: ${BUSINESS_INFO.phoneDisplay}`,
          shortCaption: `${item.title} — Call ${BUSINESS_INFO.phoneDisplay} or visit ${BUSINESS_INFO.domain}.`,
          hashtags: ['#QuickMoveSolutions', `#${item.city.replace(/[^a-zA-Z]/g, '')}`, '#CalgaryMovers', '#CalgaryJunkRemoval', '#AlbertaBusiness', '#YYCLocal'],
          ctaText: `Get a quote at ${BUSINESS_INFO.domain} or call ${BUSINESS_INFO.phoneDisplay}`,
          visualConcept: item.concept,
          imagePrompt: `Professional editorial photography for QuickMove Solutions: ${item.concept} High dynamic range, natural lighting, brand colors navy and orange.`,
          overlayText: `${item.service.toUpperCase()} • ${item.city.toUpperCase()}`,
          aspectRatio: item.platform === 'INSTAGRAM' ? '4:5' : '1:1',
          status: 'PENDING_APPROVAL',
          scheduledFor: schedDate,
          createdAt: now,
          updatedAt: now,
        };
        db.marketingPosts.unshift(post);
        createdMonthlyPosts.push(post);
      }

      logActivity(
        'MARKETING_PLAN',
        'monthly_strategic_plan',
        'MONTHLY_PLAN_GENERATED',
        `Generated 12-post strategic monthly marketing plan across all 4 weeks covering residential, junk removal, commercial, and Highway 2 corridor.`
      );
      writePlatformStore(db);
      return NextResponse.json({ ok: true, createdPosts: createdMonthlyPosts });
    }

    // 11. MARKETING APPROVAL & PUBLISHING WORKFLOW
    if (action === 'UPDATE_POST_STATUS') {
      const { postId, status } = body;
      const post = db.marketingPosts.find((p) => p.id === postId);
      if (!post) {
        return NextResponse.json({ ok: false, error: 'Marketing post not found' }, { status: 404 });
      }
      if (status === 'APPROVED' || status === 'PUBLISHED') {
        if (!permissions.canApproveMarketing && actorRole !== 'OWNER') {
          return NextResponse.json(
            { ok: false, error: 'Only the Owner can approve or publish marketing posts.' },
            { status: 403 }
          );
        }
        post.approvedBy = actorName;
        post.approvedAt = now;
      }
      post.status = status as MarketingPostStatus;
      if (status === 'PUBLISHED') {
        post.publishedAt = now;
        post.externalPostId = `meta_post_${Date.now()}`;

        // Live Meta Graph API Execution (Facebook + Instagram)
        const metaResult = await publishPostToMeta({
          title: post.title,
          platform: post.platform,
          primaryCaption: post.primaryCaption,
          imageUrl: post.imagePrompt || undefined,
        });

        if (metaResult.facebookPostId || metaResult.instagramPostId) {
          const ids = [
            metaResult.facebookPostId ? `fb:${metaResult.facebookPostId}` : null,
            metaResult.instagramPostId ? `ig:${metaResult.instagramPostId}` : null,
          ].filter(Boolean).join(' | ');
          post.externalPostId = ids;
        } else if (metaResult.errors.length > 0) {
          return NextResponse.json(
            { ok: false, error: `Meta Publishing Error: ${metaResult.errors.join('; ')}` },
            { status: 400 }
          );
        }
      }
      post.updatedAt = now;
      logActivity(
        'MARKETING_POST',
        post.id,
        `POST_${status}`,
        `Marketing post "${post.title}" transitioned to ${status} by ${actorName}.`
      );
      writePlatformStore(db);
      return NextResponse.json({ ok: true, post });
    }

    // 12. UPDATE SYSTEM SETTINGS (Owner Only)
    if (action === 'UPDATE_SETTINGS') {
      if (!permissions.canManageSettings) {
        return NextResponse.json(
          { ok: false, error: 'Only the Owner role can modify system settings.' },
          { status: 403 }
        );
      }
      db.settings = {
        ...db.settings,
        albertaGstPercent: Number(body.albertaGstPercent ?? db.settings.albertaGstPercent),
        defaultQuoteValidityDays: Number(
          body.defaultQuoteValidityDays ?? db.settings.defaultQuoteValidityDays
        ),
        requireOwnerMarketingApproval: Boolean(
          body.requireOwnerMarketingApproval ?? db.settings.requireOwnerMarketingApproval
        ),
        updatedAt: now,
      };
      logActivity('SETTINGS', 'system', 'SETTINGS_UPDATED', `Updated system settings by ${actorName}.`);
      writePlatformStore(db);
      return NextResponse.json({ ok: true, settings: db.settings });
    }

    // 13. SECTION 10: CREATE EMPLOYEE / ADMIN ACCOUNT (Super Admin / Owner Only)
    if (action === 'CREATE_USER_ACCOUNT') {
      if (actorRole !== 'OWNER') {
        return NextResponse.json(
          {
            ok: false,
            error: 'Only the Protected Super Admin / Owner can create employee login accounts.',
          },
          { status: 403 }
        );
      }

      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const username = String(
        body.username || email.split('@')[0] || `emp_${Date.now()}`
      )
        .trim()
        .toLowerCase();
      const phone = String(body.phone || BUSINESS_INFO.phoneDisplay).trim();
      const role = (body.role as UserRole) || 'CREW_MEMBER';
      const roleDisplayTitle = String(body.roleDisplayTitle || role).trim();
      const customRoleId = body.customRoleId ? String(body.customRoleId) : undefined;
      const onboardingMode = body.onboardingMode === 'invite' ? 'invite' : 'temp-password';
      const mfaEnabled = Boolean(body.mfaEnabled);

      if (!name || !email) {
        return NextResponse.json(
          { ok: false, error: 'Employee name and email address are required.' },
          { status: 400 }
        );
      }

      if (db.users.some((u) => u.email.toLowerCase() === email)) {
        return NextResponse.json(
          { ok: false, error: 'An account with that email address already exists.' },
          { status: 409 }
        );
      }

      const temporaryPassword =
        String(body.temporaryPassword || '').trim() || generateTemporaryPassword();
      const passwordHash = hashPasswordScrypt(temporaryPassword);
      const invitationToken =
        onboardingMode === 'invite'
          ? `qm_inv_${crypto.randomBytes(16).toString('hex')}`
          : undefined;

      const customRole = customRoleId
        ? db.customRoles?.find((r) => r.id === customRoleId)
        : undefined;

      const modulePermissions: UserPermissionMatrix =
        body.modulePermissions ||
        customRole?.modulePermissions ||
        buildDefaultModulePermissions(role);

      // Also create a linked EmployeeRecord if not already present
      const empId = `emp_${crypto.randomBytes(4).toString('hex')}`;
      db.employees.push({
        id: empId,
        fullName: name,
        phone,
        email,
        role:
          role === 'OWNER'
            ? 'OWNER'
            : role === 'COORDINATOR'
              ? 'COORDINATOR'
              : 'MOVER',
        skills: Array.isArray(body.skills) && body.skills.length > 0
          ? body.skills
          : ['Operations & Field Service'],
        status: 'ACTIVE',
        availabilityNote: String(body.availabilityNote || 'Full-Time'),
        internalNotes: `Account created by Super Admin (${onboardingMode}).`,
        createdAt: now,
        updatedAt: now,
      });

      const newUser: UserRecord = {
        id: `usr_${crypto.randomBytes(5).toString('hex')}`,
        username,
        email,
        name,
        phone,
        role,
        roleDisplayTitle: customRole ? customRole.name : roleDisplayTitle,
        customRoleId,
        isProtectedOwner: false,
        isActive: true,
        accountStatus: onboardingMode === 'invite' ? 'INVITED' : 'ACTIVE',
        employeeId: empId,
        accessCode: temporaryPassword,
        passwordHash,
        mustChangePassword: true,
        invitationToken,
        invitationSentAt: onboardingMode === 'invite' ? now : undefined,
        mfaEnabled,
        sessionVersion: 1,
        loginCount: 0,
        loginHistory: [],
        modulePermissions,
        createdAt: now,
      };

      db.users.push(newUser);

      pushNotification({
        eventType: onboardingMode === 'invite' ? 'EMPLOYEE_INVITATION_SENT' : 'EMPLOYEE_ACCOUNT_CREATED',
        recipientType: 'ADMIN',
        recipientAddress: email,
        subject: `Your QuickMove Solutions Staff Account (${newUser.roleDisplayTitle})`,
        bodyPreview:
          onboardingMode === 'invite'
            ? `Hi ${name}, you have been invited to QuickMove Solutions as ${newUser.roleDisplayTitle}. Complete setup with your temporary password: ${temporaryPassword}`
            : `Hi ${name}, your QuickMove Solutions account (${username}) is active. Temporary password (change required on first login): ${temporaryPassword}`,
      });

      logActivity(
        'USER_ACCOUNT',
        newUser.id,
        'ACCOUNT_CREATED',
        `Super Admin created account for ${name} (${email}) with role ${newUser.roleDisplayTitle} [Password hashed with scrypt, mustChangePassword=true].`
      );
      writePlatformStore(db);

      const { passwordHash: _omitted, ...safeUser } = newUser;
      void _omitted;
      return NextResponse.json({
        ok: true,
        user: safeUser,
        temporaryPassword,
        invitationLink: invitationToken
          ? `${BUSINESS_INFO.website}admin/login?invite=${invitationToken}&email=${encodeURIComponent(email)}`
          : undefined,
      });
    }

    // 14. SECTION 10: UPDATE EMPLOYEE ACCOUNT & GRANULAR PERMISSIONS
    if (action === 'UPDATE_USER_ACCOUNT') {
      if (actorRole !== 'OWNER') {
        return NextResponse.json(
          { ok: false, error: 'Only the Super Admin / Owner can edit account roles or permissions.' },
          { status: 403 }
        );
      }

      const targetUser = db.users.find((u) => u.id === body.userId);
      if (!targetUser) {
        return NextResponse.json({ ok: false, error: 'User account not found.' }, { status: 404 });
      }

      if (targetUser.isProtectedOwner && body.role && body.role !== 'OWNER') {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Security Rule Violation: The protected Super Admin owner account cannot be demoted.',
          },
          { status: 403 }
        );
      }

      if (typeof body.name === 'string' && body.name.trim()) targetUser.name = body.name.trim();
      if (typeof body.email === 'string' && body.email.trim())
        targetUser.email = body.email.trim().toLowerCase();
      if (typeof body.username === 'string' && body.username.trim())
        targetUser.username = body.username.trim().toLowerCase();
      if (typeof body.phone === 'string' && body.phone.trim()) targetUser.phone = body.phone.trim();
      if (body.role && !targetUser.isProtectedOwner) {
        targetUser.role = body.role as UserRole;
      }
      if (typeof body.roleDisplayTitle === 'string') {
        targetUser.roleDisplayTitle = body.roleDisplayTitle;
      }
      if (body.customRoleId !== undefined) {
        targetUser.customRoleId = body.customRoleId || undefined;
      }
      if (typeof body.mfaEnabled === 'boolean') {
        targetUser.mfaEnabled = body.mfaEnabled;
      }
      if (body.modulePermissions && !targetUser.isProtectedOwner) {
        targetUser.modulePermissions = body.modulePermissions as UserPermissionMatrix;
      }

      // Sync linked EmployeeRecord if present
      if (targetUser.employeeId) {
        const emp = db.employees.find((e) => e.id === targetUser.employeeId);
        if (emp) {
          emp.fullName = targetUser.name;
          emp.email = targetUser.email;
          emp.phone = targetUser.phone;
          emp.updatedAt = now;
        }
      }

      logActivity(
        'USER_ACCOUNT',
        targetUser.id,
        'ACCOUNT_PERMISSIONS_UPDATED',
        `Updated account & granular permissions for ${targetUser.name} (${targetUser.email}).`
      );
      writePlatformStore(db);
      return NextResponse.json({ ok: true });
    }

    // 15. SECTION 10: ACTIVATE / DEACTIVATE / REMOVE EMPLOYEE ACCESS
    if (action === 'TOGGLE_USER_STATUS') {
      if (actorRole !== 'OWNER') {
        return NextResponse.json(
          { ok: false, error: 'Only the Super Admin / Owner can activate or deactivate accounts.' },
          { status: 403 }
        );
      }

      const targetUser = db.users.find((u) => u.id === body.userId);
      if (!targetUser) {
        return NextResponse.json({ ok: false, error: 'Account not found.' }, { status: 404 });
      }

      if (targetUser.isProtectedOwner || targetUser.id === 'usr_owner_1') {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Security Rule Violation: The protected Super Admin owner account cannot be deactivated or removed.',
          },
          { status: 403 }
        );
      }

      const desiredStatus = body.accountStatus as 'ACTIVE' | 'DEACTIVATED' | 'REMOVED' | undefined;
      if (desiredStatus) {
        targetUser.accountStatus = desiredStatus;
        targetUser.isActive = desiredStatus === 'ACTIVE';
      } else {
        targetUser.isActive = !targetUser.isActive;
        targetUser.accountStatus = targetUser.isActive ? 'ACTIVE' : 'DEACTIVATED';
      }

      if (!targetUser.isActive) {
        targetUser.sessionVersion = (targetUser.sessionVersion || 1) + 1;
        targetUser.lastSessionRevokedAt = now;
      }

      if (targetUser.employeeId) {
        const emp = db.employees.find((e) => e.id === targetUser.employeeId);
        if (emp) {
          emp.status = targetUser.isActive ? 'ACTIVE' : 'INACTIVE';
          emp.updatedAt = now;
        }
      }

      logActivity(
        'USER_ACCOUNT',
        targetUser.id,
        `ACCOUNT_${targetUser.accountStatus}`,
        `${targetUser.name} (${targetUser.email}) account status changed to ${targetUser.accountStatus} by Super Admin.`
      );
      writePlatformStore(db);
      return NextResponse.json({
        ok: true,
        isActive: targetUser.isActive,
        accountStatus: targetUser.accountStatus,
      });
    }

    // 16. SECTION 10: SUPER ADMIN PASSWORD RESET (Generates Temporary Password & Forces Change on Login)
    if (action === 'RESET_USER_PASSWORD') {
      if (actorRole !== 'OWNER') {
        return NextResponse.json(
          { ok: false, error: 'Only the Super Admin / Owner can reset employee passwords.' },
          { status: 403 }
        );
      }

      const targetUser = db.users.find((u) => u.id === body.userId);
      if (!targetUser) {
        return NextResponse.json({ ok: false, error: 'User account not found.' }, { status: 404 });
      }

      const newTempPassword =
        String(body.newPassword || '').trim() || generateTemporaryPassword();
      targetUser.passwordHash = hashPasswordScrypt(newTempPassword);
      targetUser.accessCode = newTempPassword;
      targetUser.mustChangePassword = !targetUser.isProtectedOwner;
      targetUser.sessionVersion = (targetUser.sessionVersion || 1) + 1;
      targetUser.lastSessionRevokedAt = now;

      pushNotification({
        eventType: 'PASSWORD_RESET_BY_OWNER',
        recipientType: 'ADMIN',
        recipientAddress: targetUser.email,
        subject: 'QuickMove Solutions — Security Password Reset',
        bodyPreview: `Hi ${targetUser.name}, a temporary password has been generated for your account. You will be required to change it on your next login.`,
      });

      logActivity(
        'USER_ACCOUNT',
        targetUser.id,
        'PASSWORD_RESET',
        `Super Admin reset password for ${targetUser.name} (${targetUser.email}) and revoked prior sessions.`
      );
      writePlatformStore(db);
      return NextResponse.json({
        ok: true,
        temporaryPassword: newTempPassword,
        mustChangePassword: targetUser.mustChangePassword,
      });
    }

    // 17. SECTION 10: SELF-SERVICE PASSWORD CHANGE (First-Login Mandatory Change or Employee Reset)
    if (action === 'CHANGE_OWN_PASSWORD') {
      const targetUserId = body.userId || session?.userId || 'usr_owner_1';
      const targetUser = db.users.find((u) => u.id === targetUserId);
      if (!targetUser) {
        return NextResponse.json({ ok: false, error: 'User account not found.' }, { status: 404 });
      }

      const newPassword = String(body.newPassword || '').trim();
      if (newPassword.length < 8) {
        return NextResponse.json(
          { ok: false, error: 'New password must be at least 8 characters long.' },
          { status: 400 }
        );
      }

      targetUser.passwordHash = hashPasswordScrypt(newPassword);
      targetUser.accessCode = newPassword;
      targetUser.mustChangePassword = false;
      targetUser.accountStatus = 'ACTIVE';

      logActivity(
        'USER_ACCOUNT',
        targetUser.id,
        'PASSWORD_CHANGED',
        `${targetUser.name} updated their password (hashed with scrypt).`
      );
      writePlatformStore(db);
      return NextResponse.json({ ok: true });
    }

    // 18. SECTION 10: REVOKE ACTIVE SESSIONS
    if (action === 'REVOKE_USER_SESSIONS') {
      if (actorRole !== 'OWNER') {
        return NextResponse.json(
          { ok: false, error: 'Only the Super Admin can revoke employee sessions.' },
          { status: 403 }
        );
      }
      const targetUser = db.users.find((u) => u.id === body.userId);
      if (!targetUser) {
        return NextResponse.json({ ok: false, error: 'User account not found.' }, { status: 404 });
      }
      targetUser.sessionVersion = (targetUser.sessionVersion || 1) + 1;
      targetUser.lastSessionRevokedAt = now;
      logActivity(
        'USER_ACCOUNT',
        targetUser.id,
        'SESSIONS_REVOKED',
        `Revoked all active sessions for ${targetUser.name} (Session v${targetUser.sessionVersion}).`
      );
      writePlatformStore(db);
      return NextResponse.json({
        ok: true,
        sessionVersion: targetUser.sessionVersion,
        lastSessionRevokedAt: now,
      });
    }

    // 19. SECTION 10: CREATE CUSTOM ROLE WITH GRANULAR PERMISSIONS
    if (action === 'CREATE_CUSTOM_ROLE') {
      if (actorRole !== 'OWNER') {
        return NextResponse.json(
          { ok: false, error: 'Only the Super Admin / Owner can create custom roles.' },
          { status: 403 }
        );
      }
      const name = String(body.name || '').trim();
      const description = String(body.description || 'Custom permission profile').trim();
      const baseRole = (body.baseRole as UserRole) || 'COORDINATOR';
      const modulePermissions: UserPermissionMatrix =
        body.modulePermissions || buildDefaultModulePermissions(baseRole);

      if (!name) {
        return NextResponse.json({ ok: false, error: 'Custom role name is required.' }, { status: 400 });
      }

      if (!Array.isArray(db.customRoles)) {
        db.customRoles = [];
      }

      const customRole: CustomRoleRecord = {
        id: `crole_${crypto.randomBytes(4).toString('hex')}`,
        name,
        description,
        baseRole,
        modulePermissions,
        createdAt: now,
      };

      db.customRoles.push(customRole);
      logActivity(
        'CUSTOM_ROLE',
        customRole.id,
        'CUSTOM_ROLE_CREATED',
        `Super Admin created custom role "${customRole.name}".`
      );
      writePlatformStore(db);
      return NextResponse.json({ ok: true, customRole });
    }

    // 20. TOGGLE SOCIAL ACCOUNT CONNECTION STATUS (Facebook / Instagram)
    if (action === 'TOGGLE_SOCIAL_CONNECTION') {
      const account = db.socialAccounts.find((s) => s.id === body.accountId);
      if (!account) {
        return NextResponse.json({ ok: false, error: 'Social account not found.' }, { status: 404 });
      }
      account.connectionStatus =
        account.connectionStatus === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
      account.lastVerifiedAt = now;
      account.updatedAt = now;
      logActivity(
        'SOCIAL_ACCOUNT',
        account.id,
        `SOCIAL_${account.connectionStatus}`,
        `${account.platform} account (${account.accountName}) set to ${account.connectionStatus}.`
      );
      writePlatformStore(db);
      return NextResponse.json({ ok: true, account });
    }

    return NextResponse.json({ ok: false, error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Admin action failed' },
      { status: 500 }
    );
  }
}

