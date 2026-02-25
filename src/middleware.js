// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // For now, allow all requests through
  return NextResponse.next();
}

export const config = {
  // Only run middleware on /ui routes (or any protected routes)
  matcher: ['/ui/:path*'],
};
