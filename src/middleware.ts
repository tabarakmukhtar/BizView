
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isAuthenticated = request.cookies.get('auth_token')?.value === 'true';
  const userRole = request.cookies.get('user_role')?.value;

  const isAuthPage = pathname.startsWith('/login');
  const isDashboardPage = pathname.startsWith('/dashboard');

  const response = NextResponse.next();

  // Prevent caching of pages
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');


  // If on login page
  if (isAuthPage) {
    // If authenticated, redirect to dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Otherwise, allow access to login page
    return response;
  }
  
  // If trying to access a dashboard page
  if (isDashboardPage) {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If authenticated, apply role-based access control
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
    // Admin has access to everything, so no specific redirect needed
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
