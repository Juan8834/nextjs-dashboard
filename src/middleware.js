// src/middleware.js

import { NextResponse } from 'next/server';

export function middleware(request) {
  // For now, allow all requests through
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
