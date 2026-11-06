import { NextRequest, NextResponse } from 'next/server';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { sendNotification, generateEmailHtml } from '@/lib/notifications/notification-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventType = 'UPCOMING_BOOKING_REMINDER',
      channel = 'EMAIL',
      recipientType = 'CUSTOMER',
      recipientAddress = BUSINESS_INFO.email,
      recipientName,
      subject = `QuickMove Solutions — Upcoming Service Reminder`,
      bodyPreview,
      relatedLeadId,
      relatedQuoteId,
      relatedBookingId,
    } = body;

    const htmlContent = generateEmailHtml({
      title: subject,
      recipientName: recipientName || (recipientType === 'CUSTOMER' ? 'Valued Customer' : 'QuickMove Dispatch'),
      contentParagraphs: [
        bodyPreview || `Automated ${channel} notification from QuickMove Solutions.`,
        `Our Calgary operations team is dedicated to careful handling, transparent pricing, and on-time service.`,
      ],
      ctaButton: {
        label: 'View Your Portal & Booking',
        url: `${BUSINESS_INFO.website}/portal`,
      },
    });

    const record = await sendNotification({
      eventType,
      channel,
      recipientType,
      recipientAddress,
      recipientName,
      subject,
      bodyPreview: bodyPreview || subject,
      htmlContent,
      relatedLeadId,
      relatedQuoteId,
      relatedBookingId,
    });

    return NextResponse.json({
      ok: true,
      notification: record,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Notification dispatch failed' },
      { status: 500 }
    );
  }
}

