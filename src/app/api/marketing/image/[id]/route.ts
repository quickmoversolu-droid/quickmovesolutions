import { NextRequest, NextResponse } from 'next/server';
import { readPlatformStore } from '@/lib/db/platform-store';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id || '';
    const cleanId = rawId.replace(/\.(png|jpg|jpeg|webp)$/i, '');

    const db = readPlatformStore();
    const post = db.marketingPosts.find((p) => p.id === cleanId || p.id === rawId);

    if (!post || !post.imageUrl) {
      return new NextResponse('Marketing image not found', { status: 404 });
    }

    // 1. If stored as Base64 Data URI, stream binary buffer with proper MIME headers
    if (post.imageUrl.startsWith('data:image/')) {
      const match = post.imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
      const mime = match ? `image/${match[1]}` : 'image/png';
      const base64Data = match ? match[2] : post.imageUrl.replace(/^data:image\/\w+;base64,/, '');
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

    // 2. If already a public HTTPS URL, redirect
    if (post.imageUrl.startsWith('http://') || post.imageUrl.startsWith('https://')) {
      return NextResponse.redirect(post.imageUrl, 307);
    }

    return new NextResponse('Unsupported image format', { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error serving marketing image';
    return new NextResponse(message, { status: 500 });
  }
}

