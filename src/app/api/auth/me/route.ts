import { NextResponse } from 'next/server';
import { getServerSession, ROLE_PERMISSION_MATRIX } from '@/lib/auth/session';

export async function GET() {
  const session = getServerSession();
  if (!session) {
    return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    authenticated: true,
    session,
    permissions: ROLE_PERMISSION_MATRIX[session.role],
  });
}

