import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  
  // Allow access to environment check pages without authentication
  if (url.pathname === '/check' || url.pathname === '/env-check' || url.pathname === '/api/env-check') {
    return NextResponse.next();
  }

  // Allow access to auth endpoints without shop parameter
  if (url.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // For all other routes, ensure shop parameter is present
  const shop = url.searchParams.get('shop');
  if (!shop) {
    return new NextResponse(JSON.stringify({ error: 'No shop provided' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/auth/* (auth routes)
     * 2. /api/webhooks/* (webhook routes)
     * 3. /_next/* (Next.js internals)
     * 4. /static/* (static files)
     * 5. /*.{png,jpg,gif} (static images)
     * 6. /favicon.ico (favicon)
     */
    '/((?!api/auth|api/webhooks|_next/static|static|.*\\..*|favicon.ico).*)',
  ],
};
