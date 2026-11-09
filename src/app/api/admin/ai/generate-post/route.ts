import { NextResponse } from 'next/server';
import { generateMarketingContent } from '@/lib/ai/openrouter-service';
import { syncRecordToInsForge } from '@/lib/backend/insforge-service';
import { readPlatformStore, writePlatformStore } from '@/lib/db/platform-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await generateMarketingContent({
      platform: body.platform || 'BOTH',
      serviceFocus: body.serviceFocus || 'Junk Removal',
      targetCity: body.targetCity || 'Calgary',
      contentPillar: body.contentPillar || 'Moving Services Spotlight',
      tone: body.tone || 'Helpful, Reassuring & Local',
      goal: body.goal || 'Drive Visual Moving & Photo Junk Quotes',
      aspectRatio: body.aspectRatio || '4:5',
      customTopic: body.customTopic || '',
      generateImage: body.generateImage !== false,
    });

    const db = readPlatformStore();
    const newPostId = `mkt_or_${Date.now()}`;

    const newPost = {
      id: newPostId,
      campaignId: 'camp_calgary_spring',
      title: result.title,
      platform: body.platform || 'BOTH',
      contentPillar: body.contentPillar || 'Moving Services Spotlight',
      serviceFocus: body.serviceFocus || 'Junk Removal',
      targetCity: body.targetCity || 'Calgary',
      tone: body.tone || 'Helpful, Reassuring & Local',
      goal: body.goal || 'Drive Visual Moving & Photo Junk Quotes',
      hook: result.hook,
      primaryCaption: result.primaryCaption,
      shortCaption: result.shortCaption,
      hashtags: result.hashtags,
      ctaText: result.ctaText,
      visualConcept: result.visualConcept,
      imagePrompt: result.imagePrompt,
      overlayText: result.overlayText,
      aspectRatio: result.aspectRatio,
      imageUrl: result.generatedImageUrl || undefined,
      status: 'PENDING_APPROVAL' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Sync to InsForge Database
    await syncRecordToInsForge('marketing_posts', {
      id: newPost.id,
      title: newPost.title,
      platform: newPost.platform,
      service_focus: newPost.serviceFocus,
      target_city: newPost.targetCity,
      status: newPost.status,
      image_url: result.generatedImageUrl,
      model_used: result.modelUsed,
    });

    // 2. Persist to local platform store
    db.marketingPosts.unshift(newPost);
    writePlatformStore(db);

    return NextResponse.json({
      ok: true,
      post: newPost,
      generatedImageUrl: result.generatedImageUrl,
      aiMetadata: {
        modelUsed: result.modelUsed,
        tokensUsed: result.tokensUsed,
        costEstimateUsd: result.costEstimateUsd,
        isAiGenerated: result.isAiGenerated,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Error generating marketing post' },
      { status: 500 }
    );
  }
}

