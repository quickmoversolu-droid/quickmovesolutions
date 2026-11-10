import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
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
        const tmpPng = path.join('/tmp', 'marketing-cache', `${cleanId}.png`);
        const tmpJpg = path.join('/tmp', 'marketing-cache', `${cleanId}.jpg`);
        if (fs.existsSync(tmpJpg)) {
          const fileBuffer = fs.readFileSync(tmpJpg);
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'image/jpeg',
              'Content-Length': fileBuffer.length.toString(),
              'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
            },
          });
        }
        if (fs.existsSync(tmpPng)) {
          const fileBuffer = fs.readFileSync(tmpPng);
          const jpegBuffer = await sharp(fileBuffer).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
          return new NextResponse(jpegBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'image/jpeg',
              'Content-Length': jpegBuffer.length.toString(),
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

    // 4. If imageSource is a base64 Data URI, convert to JPEG and stream
    if (imageSource && imageSource.startsWith('data:image/')) {
      const base64Data = imageSource.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const jpegBuffer = await sharp(buffer)
        .jpeg({ quality: 90, mozjpeg: true })
        .toBuffer();

      return new NextResponse(jpegBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': jpegBuffer.length.toString(),
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      });
    }

    // 5. If remote HTTP/HTTPS URL, download, normalize to JPEG, and stream
    if (imageSource && (imageSource.startsWith('http://') || imageSource.startsWith('https://'))) {
      try {
        const remoteRes = await fetch(imageSource);
        if (remoteRes.ok) {
          const arrayBuf = await remoteRes.arrayBuffer();
          const jpegBuffer = await sharp(Buffer.from(arrayBuf))
            .jpeg({ quality: 90, mozjpeg: true })
            .toBuffer();

          return new NextResponse(jpegBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'image/jpeg',
              'Content-Length': jpegBuffer.length.toString(),
              'Cache-Control': 'public, max-age=86400',
            },
          });
        }
      } catch {
        // Fall through to fallback
      }
    }

    // 6. Resilient Fallback: If no post or image found, stream real JPEG
    // Instagram strictly requires JPEG format
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
