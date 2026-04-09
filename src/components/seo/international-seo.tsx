/**
 * SEO Head Component for Internationalization
 * Adds hreflang tags, canonical URLs, and locale metadata
 */

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { generateAlternateLinks, getCanonicalUrl } from '@/lib/i18n-helpers';

interface InternationalSEOProps {
    path?: string;
    baseUrl?: string;
}

export function InternationalSEO({
    path,
    baseUrl = 'https://senzalucesafaris.com'
}: InternationalSEOProps) {
    const locale = useLocale();
    const pathname = usePathname();
    const currentPath = path || pathname;

    // Generate alternate links for all locales
    const alternateLinks = generateAlternateLinks(baseUrl, currentPath);

    // Get canonical URL
    const canonicalUrl = getCanonicalUrl(baseUrl, locale, currentPath);

    return (
        <>
            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Alternate language links */}
            {alternateLinks.map((link) => (
                <link
                    key={link.hreflang}
                    rel="alternate"
                    hrefLang={link.hreflang}
                    href={link.href}
                />
            ))}

            {/* Language metadata */}
            <meta property="og:locale" content={getLocaleCode(locale)} />
            {alternateLinks
                .filter(link => link.hreflang !== 'x-default')
                .map(link => (
                    <meta
                        key={`og:${link.hreflang}`}
                        property="og:locale:alternate"
                        content={getLocaleCode(link.hreflang)}
                    />
                ))}
        </>
    );
}

/**
 * Convert locale code to Open Graph format
 */
function getLocaleCode(locale: string): string {
    const localeMap: Record<string, string> = {
        en: 'en_US',
        it: 'it_IT',
        de: 'de_DE',
        fr: 'fr_FR',
        es: 'es_ES'
    };

    return localeMap[locale] || 'en_US';
}
