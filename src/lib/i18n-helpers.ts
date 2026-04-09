/**
 * Internationalization Helpers
 * Utilities for handling multilingual content in dynamic data
 */

import { Locale } from 'next-intl';

/**
 * Represents a translatable field with values for each locale
 */
export interface TranslatableField {
    en: string;
    it: string;
    de: string;
    fr: string;
    es: string;
}

/**
 * Get localized field value based on current locale
 * Falls back to English if translation is missing
 * 
 * @param field - TranslatableField object or string
 * @param locale - Current locale
 * @returns Localized string
 */
export function getLocalizedField(
    field: TranslatableField | string | undefined,
    locale: Locale
): string {
    if (!field) return '';
    if (typeof field === 'string') return field;

    // Return requested locale or fallback to English
    return field[locale as keyof TranslatableField] || field.en;
}

/**
 * Generate hreflang links for SEO
 * 
 * @param baseUrl - Base URL of the site
 * @param path - Current path (without locale prefix)
 * @returns Array of hreflang objects
 */
export function generateHreflangs(baseUrl: string, path: string = '') {
    const locales = ['en', 'it', 'de', 'fr', 'es'];

    return locales.map(locale => ({
        hreflang: locale,
        href: `${baseUrl}/${locale}${path}`
    }));
}

/**
 * Get canonical URL for current page
 * 
 * @param baseUrl - Base URL of the site
 * @param locale - Current locale
 * @param path - Current path
 * @returns Canonical URL
 */
export function getCanonicalUrl(baseUrl: string, locale: string, path: string): string {
    // For default locale (en), use root path
    if (locale === 'en') {
        return `${baseUrl}${path}`;
    }
    return `${baseUrl}/${locale}${path}`;
}

/**
 * Generate alternate language links for SEO
 * 
 * @param baseUrl - Base URL
 * @param path - Current path
 * @returns Array of alternate link objects
 */
export function generateAlternateLinks(baseUrl: string, path: string = '') {
    const locales = ['en', 'it', 'de', 'fr', 'es'];

    return [
        // x-default link (points to English as default)
        {
            hreflang: 'x-default',
            href: `${baseUrl}${path}`
        },
        // All locale-specific links
        ...locales.map(locale => ({
            hreflang: locale,
            href: locale === 'en' ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`
        }))
    ];
}

/**
 * Create multilingual metadata object
 * 
 * @param translations - Object with title and description for each locale
 * @param locale - Current locale
 * @returns Metadata object
 */
export function createLocalizedMetadata(
    translations: {
        title: TranslatableField;
        description: TranslatableField;
    },
    locale: Locale
) {
    return {
        title: getLocalizedField(translations.title, locale),
        description: getLocalizedField(translations.description, locale)
    };
}
