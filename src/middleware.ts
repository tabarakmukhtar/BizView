
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
  } else if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  } else if (isAuthenticated && pathname.startsWith('/dashboard')) {
    // Role-based access control for settings page
    if (pathname.startsWith('/dashboard/settings')) {
      if (userRole !== 'Manager' && userRole !== 'Admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
