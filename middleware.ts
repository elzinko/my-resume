import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

import { i18n } from './i18n-config';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/** Chemin sans préfixe `basePath` (ex. `/en/short` pour `/my-resume/en/short`). */
function pathnameWithoutBase(pathname: string, basePath: string): string {
  if (!basePath) return pathname;
  const bp = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  if (pathname === bp) return '/';
  if (pathname.startsWith(`${bp}/`)) return pathname.slice(bp.length) || '/';
  return pathname;
}

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
  const path = pathnameWithoutBase(pathname, basePath);

  // Case where the user is accessing the root path
  if (path === '' || path === '/') {
    const locale = getLocale(request);
    const newUrl = new URL(`${basePath}/${locale}/`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Check if the pathname already has a locale (après basePath)
  const pathnameHasLocale = i18n.locales.some(
    (locale) => path.startsWith(`/${locale}/`) || path === `/${locale}`,
  );

  // If locale is already present in the pathname, do nothing
  if (pathnameHasLocale) {
    return;
  }

  // Otherwise, redirect to the same path with the best locale
  const locale = getLocale(request);
  const newUrl = new URL(`${basePath}/${locale}${path}`, request.url);
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
