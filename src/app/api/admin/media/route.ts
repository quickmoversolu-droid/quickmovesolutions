import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { uploadToInsForgeStorage } from '@/lib/backend/insforge-service';
import { updateHeroImages, readPlatformStore, writePlatformStore } from '@/lib/db/platform-store';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

export async function GET() {
  const db = readPlatformStore();
  return NextResponse.json({
    ok: true,
    homepageHeroImageUrl: db.settings.homepageHeroImageUrl || '/images/quickmove-truck-hero.jpg',
    aiMarketingHeroImageUrl: db.settings.aiMarketingHeroImageUrl || '/images/quickmove-marketing-hero.jpg',
  });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let filename = '';
    let mimeType = '';
    let buffer: Buffer;
    let target = 'general'; // 'homepage-hero' | 'ai-marketing-hero' | 'finished-job' | 'general'

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      target = (formData.get('target') as string) || 'general';

      if (!file) {
        return NextResponse.json({ ok: false, error: 'No file provided in form data.' }, { status: 400 });
      }

      filename = file.name;
      mimeType = file.type || 'image/jpeg';
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      const body = await request.json();
      filename = body.filename || `upload-${Date.now()}.jpg`;
      mimeType = body.mimeType || 'image/jpeg';
      target = body.target || 'general';

      if (!body.base64Data) {
        return NextResponse.json({ ok: false, error: 'base64Data is required.' }, { status: 400 });
      }

      const cleanBase64 = body.base64Data.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      buffer = Buffer.from(cleanBase64, 'base64');
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      return NextResponse.json(
        { ok: false, error: 'Invalid file format. Please upload a .png, .jpeg, or .webp image.' },
        { status: 400 }
      );
    }

    // Generate safe unique filename
    const ext = path.extname(filename) || (mimeType.includes('png') ? '.png' : '.jpg');
    const safeBaseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 32);
    const uniqueId = crypto.randomBytes(6).toString('hex');
    const storageFilename = `${safeBaseName}-${uniqueId}${ext}`;

    // 1. Save to local public/uploads directory for zero-latency instant rendering
    const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(publicUploadsDir)) {
      fs.mkdirSync(publicUploadsDir, { recursive: true });
    }
    const localFilePath = path.join(publicUploadsDir, storageFilename);
    fs.writeFileSync(localFilePath, buffer);
    const publicUrl = `/uploads/${storageFilename}`;

    // 2. Upload to InsForge Storage bucket (marketing-creatives or customer-photos)
    const bucket = target === 'finished-job' ? 'customer-photos' : 'marketing-creatives';
    const insforgeResult = await uploadToInsForgeStorage(bucket, `media/${storageFilename}`, buffer, mimeType);

    const finalUrl = insforgeResult?.publicUrl || publicUrl;

    // 3. If target is homepage-hero or ai-marketing-hero, update system settings automatically
    if (target === 'homepage-hero') {
      updateHeroImages({ homepageHeroImageUrl: finalUrl });
    } else if (target === 'ai-marketing-hero') {
      updateHeroImages({ aiMarketingHeroImageUrl: finalUrl });
    }

    return NextResponse.json({
      ok: true,
      url: finalUrl,
      localUrl: publicUrl,
      insforgeUrl: insforgeResult?.publicUrl || null,
      filename: storageFilename,
      target,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Media upload failed.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
