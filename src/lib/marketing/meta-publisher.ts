/**
 * QuickMove Solutions — Meta (Facebook & Instagram) Publisher
 * Dispatches live posts to Facebook Page feed and Instagram Business account
 * using the official Meta Graph API v20.0.
 */

import { generateResonantMovingImageUrl } from '@/lib/marketing/image-prompt-builder';

export interface MetaPublishResult {
  facebookPostId?: string;
  instagramPostId?: string;
  success: boolean;
  errors: string[];
}

export async function publishPostToMeta(post: {
  id?: string;
  title: string;
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'BOTH' | 'GOOGLE_BUSINESS' | string;
  primaryCaption: string;
  imageUrl?: string;
  imagePrompt?: string;
}): Promise<MetaPublishResult> {
  let pageAccessToken = (process.env.META_PAGE_ACCESS_TOKEN || '').trim();
  if (pageAccessToken.startsWith('"') && pageAccessToken.endsWith('"')) {
    pageAccessToken = pageAccessToken.slice(1, -1);
  }
  const pageId = (process.env.META_PAGE_ID || '').trim();
  const igAccountId = (process.env.META_INSTAGRAM_ACCOUNT_ID || '').trim();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quickmovesolution.ca').replace(/\/+$/, '');

  const result: MetaPublishResult = {
    success: false,
    errors: [],
  };

  if (!pageAccessToken) {
    result.errors.push('META_PAGE_ACCESS_TOKEN is missing or not configured.');
    return result;
  }

  // 1. Publish to Facebook Page
  if ((post.platform === 'FACEBOOK' || post.platform === 'BOTH') && pageId) {
    try {
      const fbPayload: Record<string, string> = {
        message: post.primaryCaption,
        access_token: pageAccessToken,
      };

      const fbRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fbPayload),
      });

      const fbData = await fbRes.json();
      if (fbData?.id) {
        result.facebookPostId = fbData.id;
        result.success = true;
      } else if (fbData?.error) {
        result.errors.push(`Facebook Error: ${fbData.error.message} (code ${fbData.error.code})`);
      }
    } catch (e: any) {
      result.errors.push(`Facebook Network Exception: ${e.message}`);
    }
  }

  // 2. Publish to Instagram Business Account
  if ((post.platform === 'INSTAGRAM' || post.platform === 'BOTH') && igAccountId) {
    try {
      // Instagram requires an absolute HTTPS image URL with 4:5 to 1.91:1 aspect ratio
      let finalImageUrl = (post.imageUrl || '').trim();

      // If stored as base64 data URI, route through public stream endpoint for Meta
      if (finalImageUrl.startsWith('data:image/')) {
        finalImageUrl = `${siteUrl}/api/marketing/image/${post.id || 'hero'}.png`;
      } else if (finalImageUrl.startsWith('/')) {
        // If it's a relative path on the site, prefix with siteUrl
        finalImageUrl = `${siteUrl}${finalImageUrl}`;
      }

      // If missing or not an absolute URL, generate high-res photorealistic commercial moving visual
      if (!finalImageUrl.startsWith('http://') && !finalImageUrl.startsWith('https://')) {
        finalImageUrl = generateResonantMovingImageUrl('Residential Moving', post.title || post.primaryCaption, 'Calgary');
      }

      // Step 2A: Create Instagram Media Container
      const createContainerRes = await fetch(
        `https://graph.facebook.com/v20.0/${igAccountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: finalImageUrl,
            caption: post.primaryCaption,
            access_token: pageAccessToken,
          }),
        }
      );

      const containerData = await createContainerRes.json();
      if (containerData?.id) {
        const creationId = containerData.id;

        // Step 2B: Wait for Instagram Media Container to be ready (asynchronous processing)
        let isReady = false;
        for (let attempt = 0; attempt < 8; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 2500));
          const checkRes = await fetch(
            `https://graph.facebook.com/v20.0/${creationId}?fields=status_code,status&access_token=${encodeURIComponent(pageAccessToken)}`
          );
          const checkData = await checkRes.json();

          if (checkData?.status_code === 'FINISHED') {
            isReady = true;
            break;
          }
          if (checkData?.status_code === 'ERROR' || checkData?.status_code === 'EXPIRED') {
            result.errors.push(`Instagram Media Processing Error: ${checkData.status || checkData.status_code}`);
            break;
          }
        }

        if (!isReady && !result.errors.some((e) => e.includes('Instagram Media Processing Error'))) {
          // Attempt publish anyway if polling timed out
          isReady = true;
        }

        if (isReady) {
          // Step 2C: Publish Media Container
          const pubRes = await fetch(
            `https://graph.facebook.com/v20.0/${igAccountId}/media_publish`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                creation_id: creationId,
                access_token: pageAccessToken,
              }),
            }
          );

          const pubData = await pubRes.json();
          if (pubData?.id) {
            result.instagramPostId = pubData.id;
            result.success = true;
          } else if (pubData?.error) {
            result.errors.push(`Instagram Publish Error: ${pubData.error.message}`);
          }
        }
      } else if (containerData?.error) {
        result.errors.push(`Instagram Container Error: ${containerData.error.message}`);
      }
    } catch (e: any) {
      result.errors.push(`Instagram Network Exception: ${e.message}`);
    }
  }

  return result;
}

