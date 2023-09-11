import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { i18n } from './i18n-config'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { it } from 'node:test'

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
    console.log('pathname', pathname);
    const hostname = request.nextUrl.hostname;
    console.log('hostname', hostname);

    let basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    // // Detect platform and set basePath accordingly (e.g. GitHub Pages)
    // if (hostname.includes('github.io')) {
    //     basePath = 'my-resume';
    // } else if (hostname.includes('vercel.app')) {
    //     basePath = '';
    // }
    console.log('basePath', basePath);

    // Delete basePath from pathname if present
    const adjustedPathname = pathname.replace(new RegExp(`^${basePath}/(en|fr)/`), '');
    console.log('adjustedPathname', adjustedPathname);

    // Check if a Locale is present in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`${basePath}/${locale}/`) && pathname !== `${basePath}/${locale}`
    );
    console.log('pathnameIsMissingLocale', pathnameIsMissingLocale);

    // Redirect if missing locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        console.log('locale', locale);

        // Build new URL
        const newUrl = new URL(`${basePath}/${locale}/${adjustedPathname}`, request.url);
        console.log('newUrl', newUrl);

        return NextResponse.redirect(newUrl);
    }
}
// export function middleware(request: NextRequest) {
//     const pathname = request.nextUrl.pathname

//     // Check if there is any supported locale in the pathname
//     const pathnameIsMissingLocale = i18n.locales.every(
//         (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
//     )

//     // Redirect if there is no locale
//     if (pathnameIsMissingLocale) {
//         const locale = getLocale(request)

//         // e.g. incoming request is /products
//         // The new URL is now /en-US/products
//         return NextResponse.redirect(new URL(`/${locale}/${pathname}`, request.url))
//     }
// }

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}