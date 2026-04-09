// i18n temporarily disabled (April 2026)
// Do not remove — will be re-enabled later
// Root layout redirects all traffic to /en (English-only mode)

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // If accessing root, redirect to /en
    if (pathname === '/' || pathname === '') {
        url.pathname = '/en';
        return NextResponse.redirect(url);
    }

    // If accessing a non-locale route, redirect to /en version
    const localePattern = /^\/(en|de|fr|es|it)(\/|$)/;
    if (!localePattern.test(pathname)) {
        // This is a route without locale prefix, add /en
        url.pathname = `/en${pathname}`;
        return NextResponse.redirect(url);
    }

    // If accessing a non-English locale, redirect to English
    const nonEnglishPattern = /^\/(de|fr|es|it)(\/|$)/;
    if (nonEnglishPattern.test(pathname)) {
        const newPath = pathname.replace(nonEnglishPattern, '/en$2');
        url.pathname = newPath;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    // Match all pages EXCEPT api, _next, and static files
    matcher: [
        '/',
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
