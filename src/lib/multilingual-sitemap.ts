export function generateMultilingualSitemap(baseUrl: string): string {
    const routes = [
        '',
        '/about',
        '/contact',
        '/destinations',
        '/safaris-tours',
        '/vehicles',
        '/accommodations',
        '/blog',
        '/faq',
        '/privacy',
        '/terms',
        '/support',
        '/enquiry',
    ];

    const sitemapEntries = routes
        .map((route) => {
            return `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
        })
        .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries}
</urlset>`;
}
