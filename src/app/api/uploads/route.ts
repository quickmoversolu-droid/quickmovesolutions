import { NextRequest, NextResponse } from 'next/server';
import { savePrivateJobPhoto } from '@/lib/storage/private-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalFilename, mimeType, fileSizeBytes, base64Data } = body ?? {};

    if (!originalFilename || !mimeType || typeof fileSizeBytes !== 'number') {
      return NextResponse.json(
        { ok: false, error: 'Missing required file metadata.' },
        { status: 400 }
      );
    }

    const saved = savePrivateJobPhoto({
      originalFilename,
      mimeType,
      fileSizeBytes,
      base64Data,
    });

    return NextResponse.json({
      ok: true,
      ...saved,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'File upload failed.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

