/**
 * QUICKMOVE SOLUTIONS — NOTIFICATION & AUTOMATION SERVICE
 * Phase 11 & Part 12 of KNOWLEDGE.md
 * Handles branded transactional emails, event triggers, audit logging,
 * and SMS payload preparation using official Resend API integration.
 */

import crypto from 'crypto';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { readPlatformStore, writePlatformStore, type NotificationRecord } from '@/lib/db/platform-store';
import type { UnifiedQuoteSubmissionInput } from '@/lib/validations/quote-schemas';

export type NotificationEventType =
  | 'REQUEST_RECEIVED'
  | 'QUOTE_SENT'
  | 'QUOTE_ACCEPTED'
  | 'BOOKING_CONFIRMED'
  | 'CREW_DISPATCHED'
  | 'JOB_COMPLETED'
  | 'JOB_COMPLETED_REVIEW_INVITE'
  | 'REVIEW_REQUEST'
  | 'CHANGE_REQUEST'
  | 'SYSTEM_ALERT'
  | string;

export interface SendNotificationOptions {
  eventType: NotificationEventType;
  channel?: 'EMAIL' | 'SMS' | 'IN_APP';
  recipientType: 'CUSTOMER' | 'ADMIN';
  recipientAddress: string;
  recipientName?: string;
  subject: string;
  bodyPreview?: string;
  htmlContent?: string;
  relatedLeadId?: string;
  relatedQuoteId?: string;
  relatedBookingId?: string;
}

/**
 * Direct email sender using Resend API with guaranteed fallback configuration
 */
export async function sendEmailDirect(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const fromEmail = process.env.EMAIL_FROM || 'QuickMove Solutions <info@quickmovesolution.ca>';
  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients,
        reply_to: options.replyTo || process.env.ADMIN_NOTIFICATION_EMAIL || 'quickmoversolu@gmail.com',
        subject: options.subject,
        html: options.html,
      }),
    });

    const data = await res.json();
    if (res.ok && data?.id) {
      return { success: true, id: data.id };
    }
    console.error('[Resend Error Response]:', data);
    return { success: false, error: data?.message || 'Email dispatch failed' };
  } catch (err: any) {
    console.error('[Resend Network Exception]:', err);
    return { success: false, error: err?.message || 'Network exception sending email' };
  }
}

/**
 * Generate branded HTML email template for QuickMove Solutions
 */
export function generateEmailHtml(options: {
  title: string;
  recipientName: string;
  contentParagraphs: string[];
  ctaButton?: {
    label: string;
    url: string;
  };
  detailsBox?: {
    label: string;
    value: string;
  }[];
}): string {
  const { title, recipientName, contentParagraphs, ctaButton, detailsBox } = options;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #05080D; margin: 0; padding: 24px; color: #1E293B; }
    .wrapper { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #05080D 0%, #101D35 100%); padding: 32px 28px; text-align: left; border-bottom: 4px solid #F47732; }
    .brand-name { font-size: 22px; font-weight: 900; color: #FFFFFF; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .brand-tagline { font-size: 12px; font-weight: 700; color: #F47732; margin: 4px 0 0 0; }
    .content { padding: 32px 28px; font-size: 14px; line-height: 1.6; color: #334155; }
    .greeting { font-size: 16px; font-weight: 800; color: #0F172A; margin-bottom: 16px; }
    .details-table { width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #F8FAFC; border-radius: 12px; overflow: hidden; }
    .details-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #E2E8F0; }
    .details-table td.label { font-weight: 700; color: #64748B; width: 38%; }
    .details-table td.val { font-weight: 800; color: #0F172A; }
    .cta-container { text-align: center; margin: 32px 0; }
    .cta-button { display: inline-block; background-color: #F47732; color: #FFFFFF !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(244,119,50,0.4); }
    .footer { background-color: #05080D; padding: 24px 28px; text-align: center; font-size: 12px; color: #94A3B8; }
    .footer a { color: #F47732; text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1 class="brand-name">${BUSINESS_INFO.name}</h1>
      <p class="brand-tagline">${BUSINESS_INFO.tagline}</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${recipientName || 'Valued Customer'},</div>
      ${contentParagraphs.map((p) => `<p>${p}</p>`).join('')}

      ${detailsBox && detailsBox.length > 0 ? `
        <table class="details-table">
          ${detailsBox.map((d) => `<tr><td class="label">${d.label}</td><td class="val">${d.value}</td></tr>`).join('')}
        </table>
      ` : ''}

      ${ctaButton ? `
        <div class="cta-container">
          <a href="${ctaButton.url}" class="cta-button">${ctaButton.label}</a>
        </div>
      ` : ''}

      <p style="margin-top: 24px; font-size: 13px; color: #64748B;">
        Need to speak with your Calgary dispatch coordinator? Call us directly at <strong>${BUSINESS_INFO.phoneDisplay}</strong> or reply to this email.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;"><strong>${BUSINESS_INFO.name}</strong> • Calgary & Surrounding Areas, Alberta</p>
      <p style="margin: 0;">Phone: <a href="${BUSINESS_INFO.phoneHref}">${BUSINESS_INFO.phoneDisplay}</a> • Email: <a href="${BUSINESS_INFO.emailHref}">${BUSINESS_INFO.email}</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Dispatch notification, execute Resend email delivery, and persist to platform audit log
 */
export async function sendNotification(options: SendNotificationOptions): Promise<NotificationRecord> {
  const db = readPlatformStore();
  const now = new Date().toISOString();

  const record: NotificationRecord = {
    id: `ntf_${crypto.randomBytes(5).toString('hex')}`,
    eventType: options.eventType,
    channel: options.channel || 'EMAIL',
    recipientType: options.recipientType,
    recipientAddress: options.recipientAddress,
    subject: options.subject,
    bodyPreview: options.bodyPreview || options.subject,
    status: 'SENT',
    relatedLeadId: options.relatedLeadId,
    createdAt: now,
  };

  db.notifications.unshift(record);

  // Execute live email dispatch via Resend
  if (record.channel === 'EMAIL' && options.recipientAddress) {
    const html = options.htmlContent || `<p>${record.bodyPreview}</p>`;
    const resendResult = await sendEmailDirect({
      to: record.recipientAddress,
      subject: record.subject,
      html,
    });
    if (!resendResult.success) {
      record.status = 'FAILED';
    }
  }

  db.activityLogs.unshift({
    id: `act_${crypto.randomBytes(5).toString('hex')}`,
    actorRole: 'SYSTEM_AUTOMATION',
    entityType: 'NOTIFICATION',
    entityId: record.id,
    action: record.status === 'SENT' ? 'NOTIFICATION_DELIVERED' : 'NOTIFICATION_FAILED',
    summary: `Delivered ${record.channel} alert [${record.eventType}] to ${record.recipientAddress}: "${record.subject}"`,
    createdAt: now,
  });

  writePlatformStore(db);
  return record;
}

/**
 * Comprehensive automated dispatch for newly submitted quote requests
 * Dispatches live emails to both Admin (Dispatch) and Customer concurrently.
 */
export async function dispatchNewQuoteEmails(
  input: UnifiedQuoteSubmissionInput,
  result: {
    referenceCode: string;
    leadId: string;
    jobRequestId: string;
    customerId: string;
    photoCount: number;
    createdAt: string;
  }
): Promise<{ adminSent: boolean; customerSent: boolean }> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quickmovesolution.ca').replace(/\/+$/, '');
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || BUSINESS_INFO.email || 'quickmoversolu@gmail.com';

  // 1. Determine Human-Readable Service Labels
  let serviceLabel = 'Moving Service';
  if (input.flowType === 'junk-removal') {
    serviceLabel = 'Photo-First Junk Removal';
  } else if (input.flowType === 'delivery') {
    serviceLabel = `Furniture & Item Delivery (${input.deliveryType})`;
  } else if (input.flowType === 'moving') {
    serviceLabel = `Residential & Commercial Moving (${input.movingServiceType})`;
  } else if (input.flowType === 'contact') {
    serviceLabel = `Direct Contact Inquiry (${input.serviceType})`;
  }

  const pickupCity = 'pickupCity' in input ? input.pickupCity : 'Calgary';
  const pickupAddress = 'pickupAddress' in input ? input.pickupAddress : 'Calgary Area';
  const destinationCity = 'destinationCity' in input ? input.destinationCity : '';
  const destinationAddress = 'destinationAddress' in input ? input.destinationAddress : '';
  const preferredDate = 'preferredDate' in input ? input.preferredDate : 'Flexible / Soon';
  const preferredTime = 'preferredTimeWindow' in input ? input.preferredTimeWindow : 'flexible';

  let scopeDetails = '';
  if (input.flowType === 'moving') {
    scopeDetails = `Property Size: ${input.propertySize || 'Standard'}; Access: ${input.pickupAccessDetails || 'None stated'}`;
  } else if (input.flowType === 'junk-removal') {
    const cats = input.categories?.join(', ') || 'Mixed household/commercial items';
    scopeDetails = `Categories: ${cats}; Volume: ${input.volumeEstimate || 'Standard estimate'}`;
  } else if (input.flowType === 'delivery') {
    scopeDetails = `Pickup: ${input.pickupLocationName || 'Retail/Private'}; Items: ${input.itemSummary}`;
  } else if (input.flowType === 'contact') {
    scopeDetails = input.notes || 'General customer inquiry';
  }

  const specialNotes =
    input.flowType === 'moving'
      ? input.specialRequirements
      : input.flowType === 'junk-removal'
      ? input.additionalNotes
      : input.flowType === 'delivery'
      ? input.accessNotes
      : input.notes;

  // 2. Build Admin Alert Email
  const adminHtml = generateEmailHtml({
    title: `🚨 New Lead [${result.referenceCode}]: ${input.customer.fullName}`,
    recipientName: 'QuickMove Dispatch & Management',
    contentParagraphs: [
      `A new customer quote request was just submitted on <strong>quickmovesolution.ca</strong>.`,
      `Please review the customer specifications below, prepare the itemized quotation, or reach out to the customer via their preferred contact method (<strong>${input.customer.preferredContact.toUpperCase()}</strong>).`,
    ],
    detailsBox: [
      { label: 'Reference Code', value: result.referenceCode },
      { label: 'Customer Name', value: input.customer.fullName },
      { label: 'Phone Number', value: `<a href="tel:${input.customer.phone.replace(/\\D/g, '')}">${input.customer.phone}</a>` },
      { label: 'Email Address', value: `<a href="mailto:${input.customer.email}">${input.customer.email}</a>` },
      { label: 'Preferred Contact', value: input.customer.preferredContact.toUpperCase() },
      { label: 'Service Requested', value: serviceLabel },
      { label: 'Pickup Location', value: `${pickupCity} (${pickupAddress})` },
      ...(destinationCity ? [{ label: 'Destination', value: `${destinationCity} (${destinationAddress})` }] : []),
      { label: 'Preferred Schedule', value: `${preferredDate} (${preferredTime})` },
      { label: 'Scope & Categories', value: scopeDetails },
      { label: 'Uploaded Photos', value: `${result.photoCount} photo(s) submitted` },
      ...(specialNotes ? [{ label: 'Customer Notes', value: specialNotes }] : []),
    ],
    ctaButton: {
      label: 'Open Lead in Admin CRM',
      url: `${siteUrl}/admin/leads`,
    },
  });

  // 3. Build Customer Confirmation Email
  const customerHtml = generateEmailHtml({
    title: `Quote Request Confirmed (${result.referenceCode})`,
    recipientName: input.customer.fullName,
    contentParagraphs: [
      `Thank you for requesting an estimate with <strong>QuickMove Solutions</strong>! We have successfully received your inquiry for <strong>${serviceLabel}</strong> in <strong>${pickupCity}</strong>.`,
      `Your official reference number is <strong>${result.referenceCode}</strong>. Keep this number handy—you can view your job details and customer portal at any time.`,
      `Our Calgary dispatch team is reviewing your job specifications right now. During regular business hours, our coordinators typically prepare and return transparent, itemized quotes within <strong>15 to 30 minutes</strong>.`,
      result.photoCount > 0
        ? `We received your <strong>${result.photoCount} uploaded photo(s)</strong>. Our team will inspect them directly to ensure complete volume accuracy with zero surprise fees.`
        : `If you have additional photos or access details you'd like to share, feel free to reply directly to this email or call us at <strong>${BUSINESS_INFO.phoneDisplay}</strong>.`,
    ],
    detailsBox: [
      { label: 'Reference Code', value: result.referenceCode },
      { label: 'Service Requested', value: serviceLabel },
      { label: 'Service Location', value: pickupCity },
      { label: 'Preferred Date', value: preferredDate },
      { label: 'Contact Method', value: input.customer.preferredContact.toUpperCase() },
    ],
    ctaButton: {
      label: 'View Your Online Portal',
      url: `${siteUrl}/portal?code=${result.referenceCode}`,
    },
  });

  // 4. Dispatch Emails Concurrently via Resend
  const [adminRes, customerRes] = await Promise.allSettled([
    sendEmailDirect({
      to: adminEmail,
      subject: `🚨 [New Lead ${result.referenceCode}] ${input.customer.fullName} — ${serviceLabel} (${pickupCity})`,
      html: adminHtml,
      replyTo: input.customer.email,
    }),
    sendEmailDirect({
      to: input.customer.email,
      subject: `QuickMove Solutions — We Received Your ${serviceLabel} Quote Request (${result.referenceCode})`,
      html: customerHtml,
      replyTo: adminEmail,
    }),
  ]);

  const adminSent = adminRes.status === 'fulfilled' && adminRes.value.success;
  const customerSent = customerRes.status === 'fulfilled' && customerRes.value.success;

  console.log(`[Quote Notification Results] Admin (${adminEmail}): ${adminSent ? 'DELIVERED' : 'FAILED'}, Customer (${input.customer.email}): ${customerSent ? 'DELIVERED' : 'FAILED'}`);

  return { adminSent, customerSent };
}
