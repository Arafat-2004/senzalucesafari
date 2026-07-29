import type { MetadataRoute } from 'next'
import { blogArticles } from '@/data/blogs'
import { allDestinations } from '@/data/destinations'
import { tourPackages } from '@/data/tours'
import { SITE_URL } from '@/config/site'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

const STATIC_CONTENT_LAST_MODIFIED = '2026-07-29'
const STATIC_BLOG_FALLBACK_DATE = '2026-01-01'

const staticPages: Array<{
  path: string
  lastModified: string
  changeFrequency: ChangeFrequency
  priority: number
}> = [
  { path: '/', lastModified: '2026-07-29', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', lastModified: '2026-07-29', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/safaris-tours', lastModified: '2026-07-29', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/destinations', lastModified: '2026-07-29', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/accommodations', lastModified: '2026-07-29', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/vehicles', lastModified: '2026-07-29', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blog', lastModified: '2026-07-29', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/blog/category/wildlife', lastModified: '2026-07-29', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/blog/category/travel-tips', lastModified: '2026-07-29', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/blog/category/accommodation', lastModified: '2026-07-29', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/blog/category/adventure', lastModified: '2026-07-29', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/blog/category/culture', lastModified: '2026-07-29', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/contact', lastModified: '2026-07-29', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', lastModified: '2026-07-29', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/support', lastModified: '2026-07-29', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy', lastModified: '2026-07-29', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', lastModified: '2026-07-29', changeFrequency: 'yearly', priority: 0.3 },
]

function toUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).toString()
}

function parseStaticBlogDate(value: string): string {
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp)
    ? STATIC_BLOG_FALLBACK_DATE
    : new Date(timestamp).toISOString().slice(0, 10)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: toUrl(page.path),
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  const [tourResult, destinationResult, blogResult] = await Promise.all([
    prisma.tour.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { slug: 'asc' },
    }).catch(() => null),
    prisma.destination.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { slug: 'asc' },
    }).catch(() => null),
    prisma.blogPost.findMany({
      where: {
        isPublished: true,
        publishedAt: { lte: new Date() },
      },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { slug: 'asc' },
    }).catch(() => null),
  ])

  const tourEntries: MetadataRoute.Sitemap = tourResult === null
    ? tourPackages.map((tour) => ({
        url: toUrl(`/safaris-tours/${tour.slug}`),
        lastModified: STATIC_CONTENT_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    : tourResult.map((tour) => ({
        url: toUrl(`/safaris-tours/${tour.slug}`),
        lastModified: tour.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      }))

  const destinationEntries: MetadataRoute.Sitemap = destinationResult === null
    ? allDestinations.map((destination) => ({
        url: toUrl(`/destinations/${destination.slug}`),
        lastModified: STATIC_CONTENT_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    : destinationResult.map((destination) => ({
        url: toUrl(`/destinations/${destination.slug}`),
        lastModified: destination.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      }))

  const blogEntries: MetadataRoute.Sitemap = blogResult === null
    ? Object.values(blogArticles).map((article) => ({
        url: toUrl(`/blog/${article.slug}`),
        lastModified: parseStaticBlogDate(article.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))
    : blogResult.map((post) => ({
        url: toUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt ?? post.publishedAt ?? undefined,
        changeFrequency: 'monthly',
        priority: 0.7,
      }))

  return [...staticEntries, ...tourEntries, ...destinationEntries, ...blogEntries]
}
