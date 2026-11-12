import { NextRequest, NextResponse } from 'next/server';
import { getPrivateJobPhoto } from '@/lib/storage/private-storage';
import { readPlatformStore } from '@/lib/db/platform-store';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const rawKey = params.key || '';
    const cleanKey = decodeURIComponent(rawKey);

    // 1. Try retrieving the binary buffer from private storage or memory cache
    const stored = getPrivateJobPhoto(cleanKey);
    if (stored) {
      return new NextResponse(new Uint8Array(stored.buffer), {
        status: 200,
        headers: {
          'Content-Type': stored.mimeType || 'image/jpeg',
          'Content-Disposition': `inline; filename="${stored.originalFilename || 'customer-photo.jpg'}"`,
          'Content-Length': stored.buffer.length.toString(),
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      });
    }

    // 2. Fallback: Search in platform database state
    const db = readPlatformStore();
    const photoRecord = db.jobPhotos.find(
      (p) => p.storageKey === cleanKey || p.id === cleanKey || p.originalFilename === cleanKey
    );

    if (photoRecord) {
      // If photoRecord has previewDataUrl or base64 data
      if (photoRecord.previewDataUrl && photoRecord.previewDataUrl.startsWith('data:image/')) {
        const base64Data = photoRecord.previewDataUrl.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        return new NextResponse(new Uint8Array(buffer), {
          status: 200,
          headers: {
            'Content-Type': photoRecord.mimeType || 'image/jpeg',
            'Content-Disposition': `inline; filename="${photoRecord.originalFilename || 'customer-photo.jpg'}"`,
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=86400',
          },
        });
      }
    }

    return new NextResponse('Job photo not found', { status: 404 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error retrieving job photo';
    return new NextResponse(message, { status: 500 });
  }
}
