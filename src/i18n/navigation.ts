// i18n temporarily disabled (April 2026)
// Do not remove — will be re-enabled later

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // Single locale only (English) - i18n disabled
    locales: ['en'],

    // Default locale (English)
    defaultLocale: 'en',

    // No locale prefix - i18n disabled
    localePrefix: 'never'
});

// Lightweight wrappers around Next.js navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
