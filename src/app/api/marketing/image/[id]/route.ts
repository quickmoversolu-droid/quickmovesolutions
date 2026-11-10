import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readPlatformStore } from '@/lib/db/platform-store';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id || '';
    const cleanId = rawId.replace(/\.(png|jpg|jpeg|webp)$/i, '');

    // 1. Check in-memory fast cache
    const globalCache = (globalThis as any).__marketingImageCache as Map<string, string> | undefined;
    let imageSource = globalCache?.get(cleanId) || globalCache?.get(rawId);

    // 2. Check local /tmp disk cache
    if (!imageSource) {
      try {
        const tmpPath = path.join('/tmp', 'marketing-cache', `${cleanId}.png`);
        if (fs.existsSync(tmpPath)) {
          const fileBuffer = fs.readFileSync(tmpPath);
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'image/png',
              'Content-Length': fileBuffer.length.toString(),
              'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
            },
          });
        }
      } catch {
        // Continue to database check
      }
    }

    // 3. Check platform database
    if (!imageSource) {
      const db = readPlatformStore();
      const post = db.marketingPosts.find((p) => p.id === cleanId || p.id === rawId);
      if (post?.imageUrl) {
        imageSource = post.imageUrl;
      }
    }

    // 4. Stream base64 if found
    if (imageSource && imageSource.startsWith('data:image/')) {
      const match = imageSource.match(/^data:image\/(\w+);base64,(.+)$/);
      const mime = match ? `image/${match[1]}` : 'image/png';
      const base64Data = match ? match[2] : imageSource.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': mime,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      });
    }

    // 5. If HTTP/HTTPS URL, redirect directly
    if (imageSource && (imageSource.startsWith('http://') || imageSource.startsWith('https://'))) {
      return NextResponse.redirect(imageSource, 307);
    }

    // 6. Resilient Fallback: If no post or image found, NEVER 404 for Meta / social crawlers!
    // Stream authentic high-resolution QuickMove commercial moving truck photo
    const fallbackPath = path.join(process.cwd(), 'public', 'images', 'quickmove-truck-hero.jpg');
    if (fs.existsSync(fallbackPath)) {
      const fallbackBuffer = fs.readFileSync(fallbackPath);
      return new NextResponse(fallbackBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': fallbackBuffer.length.toString(),
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    return new NextResponse('Marketing image not found', { status: 404 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error serving marketing image';
    return new NextResponse(message, { status: 500 });
  }
}
