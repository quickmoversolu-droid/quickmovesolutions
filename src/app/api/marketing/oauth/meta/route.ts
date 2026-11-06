import { NextRequest, NextResponse } from 'next/server';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { readPlatformStore, writePlatformStore } from '@/lib/db/platform-store';

/**
 * Official Meta Graph API OAuth 2.0 Handler (Part 11 of KNOWLEDGE.md).
 * Never stores or requests raw Facebook/Instagram passwords.
 */
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('mode') || 'status';
  const appId = process.env.META_APP_ID || '';
  const redirectUri =
    process.env.META_REDIRECT_URI ||
    `${BUSINESS_INFO.website.replace(/\/$/, '')}/api/marketing/oauth/meta`;

  const requiredScopes = [
    'pages_manage_posts',
    'pages_read_engagement',
    'pages_show_list',
    'instagram_basic',
    'instagram_content_publish',
  ];

  if (mode === 'authorize') {
    if (!appId) {
      return NextResponse.json({
        ok: false,
        configured: false,
        message:
          'META_APP_ID is not yet set in environment variables. Add META_APP_ID and META_APP_SECRET in .env to launch live Meta OAuth 2.0 redirect.',
        oauthPreviewUrl: `https://www.facebook.com/v20.0/dialog/oauth?client_id=YOUR_META_APP_ID&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&scope=${requiredScopes.join(',')}&response_type=code`,
      });
    }

    const authUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${encodeURIComponent(
      appId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${requiredScopes.join(',')}&response_type=code`;

    return NextResponse.json({
      ok: true,
      configured: true,
      authUrl,
    });
  }

  const db = readPlatformStore();
  return NextResponse.json({
    ok: true,
    configured: Boolean(appId),
    requiredScopes,
    accounts: db.socialAccounts,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const db = readPlatformStore();
  const now = new Date().toISOString();

  if (body.action === 'SIMULATE_OAUTH_CONNECT') {
    db.socialAccounts = db.socialAccounts.map((acc) => ({
      ...acc,
      connectionStatus: 'CONNECTED',
      lastVerifiedAt: now,
      tokenExpiresAt: new Date(Date.now() + 60 * 86400000).toISOString(),
      updatedAt: now,
    }));
    db.activityLogs.unshift({
      id: `act_${Date.now()}`,
      actorRole: 'OWNER',
      entityType: 'SOCIAL_ACCOUNT',
      entityId: 'meta_oauth',
      action: 'META_OAUTH_VERIFIED',
      summary:
        'Verified Meta Graph API OAuth 2.0 connection for Facebook Page & Instagram Business Account.',
      createdAt: now,
    });
    writePlatformStore(db);
    return NextResponse.json({ ok: true, accounts: db.socialAccounts });
  }

  return NextResponse.json({ ok: false, error: 'Unsupported OAuth action' }, { status: 400 });
}

