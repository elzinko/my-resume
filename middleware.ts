import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

import { i18n } from './i18n-config';
import { resolveShortLink } from './lib/short-links';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales: string[] = [...i18n.locales];
  try {
    const matched = matchLocale(languages, locales, i18n.defaultLocale);
    return matched ?? i18n.defaultLocale;
  } catch {
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (process.env.VERCEL === '1') {
    const devPattern = /^\/(?:fr|en)\/dev\//;
    if (devPattern.test(pathname)) {
      return NextResponse.rewrite(new URL('/not-found', request.url), {
        status: 404,
      });
    }
  }

  // Liens courts « vanity » (ex. /resilience) → CV ciblé, avant la locale.
  const shortLinkTarget = resolveShortLink(pathname);
  if (shortLinkTarget) {
    return NextResponse.redirect(
      new URL(`${basePath}${shortLinkTarget}`, request.url),
      307,
    );
  }

  // Case where the user is accessing the root path
  if (pathname === '' || pathname === '/') {
    const locale = getLocale(request);
    const newUrl = new URL(`${basePath}/${locale}/`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If locale is already present in the pathname, do nothing
  if (pathnameHasLocale) {
    return;
  }

  // Otherwise, redirect to the same path with the best locale
  const locale = getLocale(request);
  const newUrl = new URL(`${basePath}/${locale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
