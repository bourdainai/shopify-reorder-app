import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  
  // Skip middleware entirely for these paths
  if (url.pathname === '/check' || 
      url.pathname === '/env-check' || 
      url.pathname === '/api/env-check' ||
      url.pathname.startsWith('/api/auth')) {
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
    // Match all request paths except for the ones specified
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
