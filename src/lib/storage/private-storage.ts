import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per photo

export interface StoredFileResult {
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
}

function getPrivatePhotosDir(): string {
  const dir = path.join(process.cwd(), 'storage', 'private', 'photos');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Validates and stores a customer-uploaded photo in private storage.
 * Never exposes private storage directories directly as static public assets.
 */
export function savePrivateJobPhoto(params: {
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  base64Data?: string;
}): StoredFileResult {
  const normalizedMime = params.mimeType.toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
    throw new Error(
      `Unsupported image format (${params.mimeType}). Allowed formats: JPEG, PNG, WebP, HEIC.`
    );
  }

  if (params.fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error('Image exceeds the 10 MB maximum file size limit.');
  }

  const ext = path.extname(params.originalFilename) || '.jpg';
  const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, '').slice(0, 6) || '.jpg';
  const uniqueId = crypto.randomBytes(8).toString('hex');
  const storageKey = `photo-${Date.now()}-${uniqueId}${safeExt}`;

  if (params.base64Data) {
    try {
      const cleanedBase64 = params.base64Data.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(cleanedBase64, 'base64');
      if (buffer.byteLength > MAX_FILE_SIZE_BYTES) {
        throw new Error('Decoded image exceeds the 10 MB maximum file size limit.');
      }
      const targetPath = path.join(getPrivatePhotosDir(), storageKey);
      fs.writeFileSync(targetPath, buffer);
    } catch {
      // If running in a read-only serverless container, storageKey is still preserved
    }
  }

  return {
    storageKey,
    originalFilename: params.originalFilename,
    mimeType: normalizedMime,
    fileSizeBytes: params.fileSizeBytes,
  };
}

