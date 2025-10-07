// import {
//   // getCookieCache,
//   // getCookies,
// } from 'better-auth/cookies';
import { getCookieCache, getSessionCookie } from 'better-auth/cookies';
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

/*
import { betterFetch } from '@better-fetch/fetch';
import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
 
export function middleware(req: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://my-analytics-platform.com', {
      method: 'POST',
      body: JSON.stringify({ pathname: req.nextUrl.pathname }),
    })
  )
 
  return NextResponse.next()
}

event.waitUntil(
    betterFetch<{
      userId: number;
      id: number;
      title: string;
      completed: boolean;
    }>('https://jsonplaceholder.typicode.com/todos/1', {
      cache: 'force-cache',
    })
      .then((res) => res.data)
      .then((data) => console.log('event.waitUntil data', data))
  );
*/

export async function middleware(request: NextRequest) {
  const session = await getCookieCache(request);
  // console.log('MIDDLEWARE session', session);
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  // if (!sessionCookie) {
  //   return NextResponse.redirect(new URL('/sign-in', request.url));
  // }
  // return request;
  return NextResponse.next();
}

export const config: MiddlewareConfig & {
  runtime?: 'nodejs' | 'edge';
} = {
  runtime: 'nodejs',
  // matcher: [
  //   /*
  //    * Match all request paths except for the ones starting with:
  //    * - api (API routes)
  //    * - _next/static (static files)
  //    * - _next/image (image optimization files)
  //    * - favicon.ico, sitemap.xml, robots.txt (metadata files)
  //    */
  //   '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  //   // '/verify-email(.*)',
  //   // '/reset-password(.*)',
  //   '/sign-in(.*)',
  //   // '/sign-up(.*)',
  // ],
  matcher: [
    // '/api/auth(.*)',
    '/profile(.*)',
    '/admin(.*)',
    // '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    // '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
  // matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
