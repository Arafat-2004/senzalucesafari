/**
 * Multilingual Sitemap Generator
 * Generates sitemap.xml with all locales for SEO
 */

import { routing } from '@/i18n/navigation';

interface RouteInfo {
    path: string;
    lastModified: string;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
}

// Define all routes with their update frequency and priority
const routes: RouteInfo[] = [
    { path: '/', lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 1.0 },
    { path: '/about', lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.8 },
    { path: '/safaris-tours', lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.9 },
    { path: '/destinations', lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.9 },
    { path: '/contact', lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.7 },
    { path: '/enquiry', lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.8 },
    { path: '/vehicles', lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.6 },
    { path: '/blog', lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.7 },
    { path: '/faq', lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.5 },
];

/**
 * Generate multilingual sitemap XML
 */
export function generateMultilingualSitemap(baseUrl: string): string {
    const locales = routing.locales;

    const sitemapEntries: Array<{
        url: string;
        lastModified: string;
        changeFrequency: string;
        priority: number;
        alternates: { languages: Record<string, string> };
    }> = [];

    // Generate entries for each route in each locale
    routes.forEach(route => {
        locales.forEach(locale => {
            const url = locale === routing.defaultLocale
                ? `${baseUrl}${route.path}`
                : `${baseUrl}/${locale}${route.path}`;

            // Generate alternate links for all locales
            const alternates: Record<string, string> = {};
            locales.forEach(altLocale => {
                alternates[altLocale] = altLocale === routing.defaultLocale
                    ? `${baseUrl}${route.path}`
                    : `${baseUrl}/${altLocale}${route.path}`;
            });

            sitemapEntries.push({
                url,
                lastModified: route.lastModified,
                changeFrequency: route.changeFrequency,
                priority: route.priority,
                alternates: {
                    languages: alternates
                }
            });
        });
    });

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
${Object.entries(entry.alternates.languages).map(([lang, url]) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}"/>`
    ).join('\n')}
  </url>`).join('\n')}
</urlset>`;

    return xml;
}

/**
 * Get sitemap routes for static generation
 */
export function getSitemapRoutes() {
    return routes;
}
