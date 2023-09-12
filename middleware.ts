import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

import { i18n } from './i18n-config'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

    // Use negotiator and intl-localematcher to get best locale
    let languages = new Negotiator({ headers: negotiatorHeaders }).languages()
    // @ts-ignore locales are readonly
    const locales: string[] = i18n.locales
    return matchLocale(languages, locales, i18n.defaultLocale)
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    // Case where the user is accessing the root path
    if (pathname === '' || pathname === '/') {
        const locale = getLocale(request);
        const newUrl = new URL(`${basePath}/${locale}/`, request.url);
        return NextResponse.redirect(newUrl);
    }

    // Check if the pathname already has a locale
    const pathnameHasLocale = i18n.locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
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
}