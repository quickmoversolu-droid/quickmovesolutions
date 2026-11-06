import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public login endpoints
  if (pathname === '/admin/login' || pathname === '/portal/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (pathname.startsWith('/admin')) {
    if (!token || !token.includes('.')) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/portal')) {
    if (!token || !token.includes('.')) {
      const portalLoginUrl = new URL('/portal/login', request.url);
      portalLoginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(portalLoginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};

