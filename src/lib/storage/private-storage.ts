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

export function getPrivatePhotosDir(): string {
  // On Vercel / serverless runtime, process.cwd() is read-only. /tmp is the only writable path
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const dir = path.join('/tmp', 'private-photos');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }
  const dir = path.join(process.cwd(), 'storage', 'private', 'photos');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// In-memory runtime cache for serverless environments
type PhotoCacheEntry = { buffer: Buffer; mimeType: string; originalFilename: string };
function getGlobalPhotoCache(): Map<string, PhotoCacheEntry> {
  return (globalThis as any).__jobPhotosStore || ((globalThis as any).__jobPhotosStore = new Map<string, PhotoCacheEntry>());
}

/**
 * Validates and stores a customer-uploaded photo in private storage.
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

      // 1. Cache in global memory
      getGlobalPhotoCache().set(storageKey, {
        buffer,
        mimeType: normalizedMime,
        originalFilename: params.originalFilename,
      });

      // 2. Persist to writable directory (/tmp on Vercel)
      const targetPath = path.join(getPrivatePhotosDir(), storageKey);
      fs.writeFileSync(targetPath, buffer);
    } catch (err) {
      console.warn('[PrivateStorage] Error saving photo buffer to disk:', err);
    }
  }

  return {
    storageKey,
    originalFilename: params.originalFilename,
    mimeType: normalizedMime,
    fileSizeBytes: params.fileSizeBytes,
  };
}

/**
 * Retrieves a customer-uploaded photo buffer by its storageKey or ID
 */
export function getPrivateJobPhoto(key: string): { buffer: Buffer; mimeType: string; originalFilename: string } | null {
  const cleanKey = path.basename(key);

  // 1. Check in-memory global cache
  const cached = getGlobalPhotoCache().get(cleanKey);
  if (cached) {
    return cached;
  }

  // 2. Check /tmp on Vercel
  try {
    const tmpFile = path.join('/tmp', 'private-photos', cleanKey);
    if (fs.existsSync(tmpFile)) {
      const buffer = fs.readFileSync(tmpFile);
      const ext = path.extname(cleanKey).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      return { buffer, mimeType, originalFilename: cleanKey };
    }
  } catch {
    // Continue
  }

  // 3. Check local storage directory
  try {
    const localFile = path.join(process.cwd(), 'storage', 'private', 'photos', cleanKey);
    if (fs.existsSync(localFile)) {
      const buffer = fs.readFileSync(localFile);
      const ext = path.extname(cleanKey).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      return { buffer, mimeType, originalFilename: cleanKey };
    }
  } catch {
    // Continue
  }

  return null;
}
