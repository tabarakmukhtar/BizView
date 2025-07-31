
'use client';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isAuthenticated = request.cookies.get('auth_token')?.value === 'true';
  const userRole = request.cookies.get('user_role')?.value;

  const isAuthPage = pathname.startsWith('/login');
  const isDashboardPage = pathname.startsWith('/dashboard');

  // If trying to access a dashboard page and not authenticated, redirect to login immediately.
  if (isDashboardPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If on the login page and already authenticated, redirect to the dashboard.
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Clone the request headers to set new ones
  const response = NextResponse.next();

  // For all dashboard pages, set aggressive cache-control headers
  // This is the crucial part to prevent the back button from showing a cached page after logout.
  if (isDashboardPage) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('Expires', '-1');
    response.headers.set('Pragma', 'no-cache');
  }
  
  // Role-based access control for authenticated users
  if (isAuthenticated && isDashboardPage) {
    if (userRole === 'Accountant') {
      const allowedPaths = [
        '/dashboard', 
        '/dashboard/financials', 
        '/dashboard/profile', 
        '/dashboard/support',
        '/dashboard/search'
      ];
      if (!allowedPaths.some(p => pathname.startsWith(p))) {
          return NextResponse.redirect(new URL('/dashboard/financials', request.url));
      }
    } else if (userRole === 'Manager') {
       if (pathname.startsWith('/dashboard/settings')) {
         return NextResponse.redirect(new URL('/dashboard', request.url));
       }
    }
    // Admin has access to everything, so no specific checks are needed.
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
