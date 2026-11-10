/**
 * QuickMove Solutions — Meta (Facebook & Instagram) Publisher
 * Dispatches live posts to Facebook Page feed and Instagram Business account
 * using the official Meta Graph API v20.0.
 */

import fs from 'fs';
import path from 'path';
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

  // Pre-cache base64 image in global memory and /tmp for Instagram URL fetch
  const postId = post.id || 'hero';
  if (post.imageUrl && post.imageUrl.startsWith('data:image/')) {
    try {
      const globalCache = (globalThis as any).__marketingImageCache || ((globalThis as any).__marketingImageCache = new Map<string, string>());
      globalCache.set(postId, post.imageUrl);

      const tmpDir = path.join('/tmp', 'marketing-cache');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      const match = post.imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
      const b64Data = match ? match[2] : post.imageUrl.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(path.join(tmpDir, `${postId}.png`), Buffer.from(b64Data, 'base64'));
    } catch {
      // Best-effort caching
    }
  }

  // 1. Publish to Facebook Page (Direct binary photo upload if image present, feed post if clean text)
  if ((post.platform === 'FACEBOOK' || post.platform === 'BOTH') && pageId) {
    try {
      let fbRes: Response | null = null;

      if (post.imageUrl) {
        const rawImage = (post.imageUrl || '').trim();
        let imageBlob: Blob | null = null;
        let filename = 'quickmove-marketing.png';

        // Method A: Extract base64 binary buffer directly into a Blob
        if (rawImage.startsWith('data:image/')) {
          const match = rawImage.match(/^data:image\/(\w+);base64,(.+)$/);
          const ext = match ? match[1] : 'png';
          filename = `quickmove-marketing.${ext}`;
          const b64 = match ? match[2] : rawImage.replace(/^data:image\/\w+;base64,/, '');
          const buf = Buffer.from(b64, 'base64');
          imageBlob = new Blob([buf], { type: `image/${ext}` });
        }
        // Method B: Local public file (e.g. /images/...)
        else if (rawImage.startsWith('/')) {
          const localPath = path.join(process.cwd(), 'public', rawImage);
          if (fs.existsSync(localPath)) {
            const buf = fs.readFileSync(localPath);
            const ext = path.extname(localPath).replace('.', '') || 'jpg';
            filename = `quickmove-marketing.${ext}`;
            imageBlob = new Blob([buf], { type: `image/${ext === 'jpg' ? 'jpeg' : ext}` });
          }
        }
        // Method C: Remote HTTP/HTTPS URL — download binary buffer to avoid external DNS/crawler failure
        else if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
          try {
            const dlRes = await fetch(rawImage);
            if (dlRes.ok) {
              const arrayBuf = await dlRes.arrayBuffer();
              const cType = dlRes.headers.get('content-type') || 'image/jpeg';
              imageBlob = new Blob([arrayBuf], { type: cType });
              filename = 'quickmove-marketing.jpg';
            }
          } catch {
            // Will fallback to url param below
          }
        }

        // Direct Binary Upload to Facebook (Bypasses URL download completely!)
        if (imageBlob) {
          const formData = new FormData();
          formData.append('source', imageBlob, filename);
          formData.append('caption', post.primaryCaption);
          formData.append('access_token', pageAccessToken);

          fbRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/photos`, {
            method: 'POST',
            body: formData,
          });
        } else {
          // Fallback to URL photo upload if Blob couldn't be constructed
          let finalFbImageUrl = rawImage.startsWith('/') ? `${siteUrl}${rawImage}` : rawImage;
          fbRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: finalFbImageUrl,
              caption: post.primaryCaption,
              access_token: pageAccessToken,
            }),
          });
        }
      } else {
        // Clean text post
        fbRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: post.primaryCaption,
            access_token: pageAccessToken,
          }),
        });
      }

      if (fbRes) {
        const fbData = await fbRes.json();
        if (fbData?.id || fbData?.post_id) {
          result.facebookPostId = fbData.post_id || fbData.id;
          result.success = true;
        } else if (fbData?.error) {
          // If photo upload errored out, fallback gracefully to feed text post so publishing never blocks
          console.warn(`Facebook photo upload warning (${fbData.error.message}), falling back to feed post...`);
          const fallbackFeedRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: post.primaryCaption,
              access_token: pageAccessToken,
            }),
          });
          const fallbackData = await fallbackFeedRes.json();
          if (fallbackData?.id) {
            result.facebookPostId = fallbackData.id;
            result.success = true;
          } else {
            result.errors.push(`Facebook Error: ${fbData.error.message} (code ${fbData.error.code})`);
          }
        }
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
        finalImageUrl = `${siteUrl}/api/marketing/image/${postId}.png`;
      } else if (finalImageUrl.startsWith('/')) {
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
