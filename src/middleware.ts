
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isAuthenticated = request.cookies.get('auth_token')?.value === 'true';
  const userRole = request.cookies.get('user_role')?.value;

  const isAuthPage = pathname.startsWith('/login');

  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }
  
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isAuthenticated && pathname.startsWith('/dashboard')) {
    // Role-based access control for settings page - ONLY ADMIN
    if (pathname.startsWith('/dashboard/settings')) {
      if (userRole !== 'Admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    // Role-based access for Accountant - ONLY Financials
    if (userRole === 'Accountant') {
        const allowedPaths = ['/dashboard', '/dashboard/financials', '/dashboard/profile', '/dashboard/support'];
        if (!allowedPaths.some(p => pathname.startsWith(p))) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
