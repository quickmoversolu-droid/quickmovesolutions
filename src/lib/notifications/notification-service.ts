/**
 * QUICKMOVE SOLUTIONS — NOTIFICATION & AUTOMATION SERVICE
 * Phase 11 & Part 12 of KNOWLEDGE.md
 * Handles branded transactional emails, event triggers, audit logging,
 * and SMS payload preparation.
 */

import crypto from 'crypto';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { readPlatformStore, writePlatformStore, type NotificationRecord } from '@/lib/db/platform-store';

export type NotificationEventType =
  | 'REQUEST_RECEIVED'
  | 'QUOTE_SENT'
  | 'QUOTE_ACCEPTED'
  | 'BOOKING_CONFIRMED'
  | 'CREW_DISPATCHED'
  | 'JOB_COMPLETED'
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
    .details-table td.label { font-weight: 700; color: #64748B; width: 40%; }
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
        Need to reach your Calgary dispatch coordinator? Call us directly at <strong>${BUSINESS_INFO.phoneDisplay}</strong> or reply to this email.
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
 * Dispatch notification and persist to platform audit log
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

  // If Resend API Key is provided and channel is EMAIL, execute live email dispatch
  const resendApiKey = process.env.RESEND_API_KEY;
  const isResendEnabled = process.env.EMAIL_PROVIDER === 'resend' || Boolean(resendApiKey);

  if (isResendEnabled && resendApiKey && record.channel === 'EMAIL') {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'QuickMove Solutions <info@quickmovesolution.ca>';
      const emailPayload = {
        from: fromEmail,
        to: [record.recipientAddress],
        subject: record.subject,
        html: options.htmlContent || `<p>${record.bodyPreview}</p>`,
      };

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      if (!resendRes.ok) {
        const errData = await resendRes.json().catch(() => ({}));
        console.error('[Resend Email Error]:', errData);
      }
    } catch (err) {
      console.error('[Resend Dispatch Exception]:', err);
    }
  }

  db.activityLogs.unshift({
    id: `act_${crypto.randomBytes(5).toString('hex')}`,
    actorRole: 'SYSTEM_AUTOMATION',
    entityType: 'NOTIFICATION',
    entityId: record.id,
    action: 'NOTIFICATION_DELIVERED',
    summary: `Delivered ${record.channel} alert [${record.eventType}] to ${record.recipientAddress}: "${record.subject}"`,
    createdAt: now,
  });

  writePlatformStore(db);
  return record;
}

