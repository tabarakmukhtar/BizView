import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // This is a mock authentication check. In a real app, you'd verify a real session token.
  const isAuthenticated = request.cookies.get('auth_token')?.value === 'true';

  const isAuthPage = pathname.startsWith('/login');

  if (isAuthPage) {
    if (isAuthenticated) {
      // If user is authenticated and tries to access login page, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (!isAuthenticated && !pathname.startsWith('/_next')) {
    // If user is not authenticated and is trying to access a protected route, redirect to login
    // We exclude /_next to allow static assets to be served.
    if (pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher to specify which routes the middleware should run on.
  matcher: ['/dashboard/:path*', '/login'],
};
