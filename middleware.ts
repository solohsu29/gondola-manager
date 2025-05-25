import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for a cookie named 'token' (set on login)
  const token = request.cookies.get('token')?.value;

  // The matcher ensures this middleware only runs on protected routes.
  if (!token) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/gondolas/:path*',
    '/documents/:path*',
    '/inspections/:path*',
    '/projects/:path*',
    '/orientation/:path*',
    '/calendar/:path*',
    // add more as needed
  ],
};
