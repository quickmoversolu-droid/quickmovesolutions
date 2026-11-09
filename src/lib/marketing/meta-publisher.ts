/**
 * QuickMove Solutions — Meta (Facebook & Instagram) Publisher
 * Dispatches live posts to Facebook Page feed and Instagram Business account
 * using the official Meta Graph API v20.0.
 */

export interface MetaPublishResult {
  facebookPostId?: string;
  instagramPostId?: string;
  success: boolean;
  errors: string[];
}

export async function publishPostToMeta(post: {
  title: string;
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'BOTH';
  primaryCaption: string;
  imageUrl?: string;
}): Promise<MetaPublishResult> {
  const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID;
  const igAccountId = process.env.META_INSTAGRAM_ACCOUNT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quickmovesolution.ca';

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
      // Instagram requires an absolute HTTPS image URL
      let finalImageUrl = post.imageUrl;
      if (!finalImageUrl || finalImageUrl.startsWith('/')) {
        finalImageUrl = `${siteUrl}${finalImageUrl || '/images/quickmove-truck-hero.jpg'}`;
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

        // Step 2B: Publish Media Container
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
      } else if (containerData?.error) {
        result.errors.push(`Instagram Container Error: ${containerData.error.message}`);
      }
    } catch (e: any) {
      result.errors.push(`Instagram Network Exception: ${e.message}`);
    }
  }

  return result;
}
