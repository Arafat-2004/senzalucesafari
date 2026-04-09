import { generateMultilingualSitemap } from '@/lib/multilingual-sitemap';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com';
    const sitemap = generateMultilingualSitemap(baseUrl);

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400'
        }
    });
}
