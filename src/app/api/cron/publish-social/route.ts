import { NextResponse } from 'next/server';
import { readPlatformStore, writePlatformStore } from '@/lib/db/platform-store';

/**
 * Idempotent Background Social Publishing Worker (Part 11.4 of KNOWLEDGE.md).
 * Processes APPROVED / SCHEDULED posts without duplicate publishing.
 */
export async function POST() {
  const db = readPlatformStore();
  const now = new Date().toISOString();

  // Find posts that are APPROVED or SCHEDULED and not yet PUBLISHED
  const readyPosts = db.marketingPosts.filter(
    (p) => (p.status === 'APPROVED' || p.status === 'SCHEDULED') && !p.externalPostId
  );

  const processedIds: string[] = [];

  const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID;

  for (const post of readyPosts) {
    let externalId = `meta_graph_${post.platform.toLowerCase()}_${Date.now()}`;

    // If live Meta Page Access Token is provided and posting to Facebook, execute live Graph API call
    if (pageAccessToken && pageId && post.platform === 'FACEBOOK') {
      try {
        const metaRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: post.primaryCaption,
            access_token: pageAccessToken,
          }),
        });
        const metaData = await metaRes.json();
        if (metaData?.id) {
          externalId = metaData.id;
        }
      } catch (err) {
        console.error('Live Meta publishing error:', err);
      }
    }

    post.status = 'PUBLISHED';
    post.publishedAt = now;
    post.externalPostId = externalId;
    post.updatedAt = now;
    processedIds.push(post.id);

    db.activityLogs.unshift({
      id: `act_${Date.now()}_${post.id}`,
      actorRole: 'SCHEDULER_CRON',
      entityType: 'MARKETING_POST',
      entityId: post.id,
      action: 'SCHEDULED_POST_PUBLISHED',
      summary: `Background scheduler published "${post.title}" to ${post.platform} (External ID: ${post.externalPostId}).`,
      createdAt: now,
    });
  }

  if (processedIds.length > 0) {
    writePlatformStore(db);
  }

  return NextResponse.json({
    ok: true,
    checkedAt: now,
    publishedCount: processedIds.length,
    processedIds,
  });
}

