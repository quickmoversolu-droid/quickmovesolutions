import { cookies } from 'next/headers';
import type { UserRole } from '@/lib/db/platform-store';
import {
  SESSION_COOKIE_NAME,
  ROLE_PERMISSION_MATRIX,
  type SessionPayload,
} from './permissions';

export * from './permissions';

function getSecretKey(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'qm-solutions-calgary-alberta-hmac-secret-2026'
  );
}

function simpleSignature(payloadB64: string, secret: string): string {
  let h1 = 0xdeadbeef ^ secret.length;
  let h2 = 0x41c6ce57 ^ secret.length;
  const combined = `${payloadB64}.${secret}`;
  for (let i = 0; i < combined.length; i++) {
    const ch = combined.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (
    (h1 >>> 0).toString(16).padStart(8, '0') +
    (h2 >>> 0).toString(16).padStart(8, '0')
  );
}

export function encodeSessionToken(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json, 'utf-8').toString('base64url');
  const sig = simpleSignature(b64, getSecretKey());
  return `${b64}.${sig}`;
}

export function decodeSessionToken(token?: string | null): SessionPayload | null {
  if (!token || !token.includes('.')) return null;
  try {
    const [b64, sig] = token.split('.');
    if (!b64 || !sig) return null;
    const expectedSig = simpleSignature(b64, getSecretKey());
    if (sig !== expectedSig) return null;
    const json = Buffer.from(b64, 'base64url').toString('utf-8');
    const parsed = JSON.parse(json) as SessionPayload;
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getServerSession(): SessionPayload | null {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return decodeSessionToken(raw);
  } catch {
    return null;
  }
}

