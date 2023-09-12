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
    console.log('mw : request.url = ', request.url);
    console.log('mw : request.nextUrl = ', request.nextUrl.href);

    const pathname = request.nextUrl.pathname;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    console.log('mw : path = ', pathname);
    console.log('mw : base = ', basePath);

    // Cas où l'URL est exactement le basePath ou le basePath suivi d'un "/"
    if (pathname === '' || pathname === '/') {
        const locale = getLocale(request);
        const newUrl = new URL(`${basePath}/${locale}/`, request.url);
        console.log('mw : path is root => redirect to newUrl ', newUrl.toString());
        return NextResponse.redirect(newUrl);
    }

    // Vérifiez si une locale prise en charge est déjà présente dans le pathname
    const pathnameHasLocale = i18n.locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Si la locale est déjà présente, ne faites rien
    if (pathnameHasLocale) {
        console.log('mw : path has locale => do nothing');
        return;
    }

    // Sinon, ajoutez la locale à l'URL
    const locale = getLocale(request);
    const newUrl = new URL(`${basePath}/${locale}${pathname}`, request.url);
    console.log('mw : path has NO locale => build and redirect to newUrl = ', newUrl.toString());
    return NextResponse.redirect(newUrl);
}


// export function middleware(request: NextRequest) {
//     const pathname = request.nextUrl.pathname;
//     console.log('pathname', pathname);
//     const hostname = request.nextUrl.hostname;
//     console.log('hostname', hostname);

//     let basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
//     console.log('basePath', basePath);

//     // Delete basePath from pathname if present
//     const locales = i18n.locales.join('|');
//     const regex = new RegExp(`^/(${locales})`);
//     console.log('regex', regex);
//     const adjustedPathname = pathname.replace(regex, '');
//     console.log('adjustedPathname', adjustedPathname);

//     // Check if a Locale is present in the pathname
//     const pathnameIsMissingLocale = i18n.locales.every(
//         (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
//     );
//     console.log('pathnameIsMissingLocale', pathnameIsMissingLocale);

//     // Redirect if missing locale
//     if (pathnameIsMissingLocale) {
//         const locale = getLocale(request);
//         console.log('locale', locale);

//         // Build new URL
//         const newUrl = new URL(`${basePath}/${locale}/${adjustedPathname}`, request.url);
//         console.log('newUrl', newUrl);

//         return NextResponse.redirect(newUrl);
//     } else {
//         return NextRequest
//     }
// }
// export function middleware(request: NextRequest) {
//     const pathname = request.nextUrl.pathname
//     let basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

//     console.log('basePath', basePath);
//     console.log('pathname', pathname);

//     // Check if there is any supported locale in the pathname
//     const pathnameIsMissingLocale = i18n.locales.every(
//         (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
//     )
//     console.log('pathnameIsMissingLocale', pathnameIsMissingLocale);

//     // Redirect if there is no locale
//     if (pathnameIsMissingLocale) {
//         const locale = getLocale(request)

//         console.log('locale', locale);
//         // e.g. incoming request is /products
//         // The new URL is now /en-US/products
//         return NextResponse.redirect(new URL(`/${locale}/${pathname}`, request.url))
//     }
// }

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