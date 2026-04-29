import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/safaris-tours`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/destinations`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/accommodations`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/vehicles`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${SITE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/enquiry`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/support`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    // Dynamic tour pages
    let tourPages: MetadataRoute.Sitemap = []
    try {
        const tours = await prisma.tour.findMany({
            where: { isActive: true },
            select: { slug: true, updatedAt: true },
        })
        tourPages = tours.map((tour: { slug: string; updatedAt: Date }) => ({
            url: `${SITE_URL}/safaris-tours/${tour.slug}`,
            lastModified: tour.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    } catch { /* DB unavailable during build */ }

    // Dynamic destination pages
    let destinationPages: MetadataRoute.Sitemap = []
    try {
        const destinations = await prisma.destination.findMany({
            where: { isActive: true },
            select: { slug: true, updatedAt: true },
        })
        destinationPages = destinations.map((dest: { slug: string; updatedAt: Date }) => ({
            url: `${SITE_URL}/destinations/${dest.slug}`,
            lastModified: dest.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    } catch { /* DB unavailable during build */ }

    // Dynamic blog pages
    let blogPages: MetadataRoute.Sitemap = []
    try {
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            select: { slug: true, updatedAt: true },
        })
        blogPages = posts.map((post: { slug: string; updatedAt: Date }) => ({
            url: `${SITE_URL}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }))
    } catch { /* DB unavailable during build */ }

    return [...staticPages, ...tourPages, ...destinationPages, ...blogPages]
}
