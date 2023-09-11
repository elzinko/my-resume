import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
    const hostname = request.nextUrl.hostname;

    let basePath = '';

    // Detect platform and set basePath accordingly (e.g. GitHub Pages)
    if (hostname.includes('github.io')) {
        basePath = '/my-resume';
    } else if (hostname.includes('vercel.app')) {
        basePath = '';
    }

    // Delete basePath from pathname if present
    const adjustedPathname = pathname.replace(new RegExp(`^${basePath}/(en|fr)/`), '');

    // Check if a Locale is present in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`${basePath}/${locale}/`) && pathname !== `${basePath}/${locale}`
    );

    // Redirect if missing locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);

        // Build new URL
        const newUrl = new URL(`${basePath}/${locale}/${adjustedPathname}`, request.url);

        return NextResponse.redirect(newUrl);
    }
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}