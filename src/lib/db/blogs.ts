import { prisma } from '@/lib/prisma';
import type { BlogArticle, BlogSection, RelatedPost } from '@/types/blogs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DB record mapper
function mapBlogPost(post: Record<string, any>): BlogArticle {
    return {
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle ?? '',
        excerpt: post.excerpt ?? undefined,
        author: post.author,
        authorBio: post.authorBio ?? '',
        date: post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              })
            : '',
        category: post.category,
        readTime: `${post.readingTime} min read`,
        heroImage: post.featuredImage,
        imageUrl: post.featuredImage ?? undefined,
        sections: (post.sections ?? []) as BlogSection[],
        relatedPosts: (post.relatedPosts ?? []) as RelatedPost[],
    };
}

/** Get all published blog articles as a Record keyed by slug */
export async function getAllBlogArticles(): Promise<Record<string, BlogArticle>> {
    const posts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
    });
    const record: Record<string, BlogArticle> = {};
    for (const post of posts) {
        record[post.slug] = mapBlogPost(post);
    }
    return record;
}

/** Get a single blog article by slug */
export async function getBlogBySlug(slug: string): Promise<BlogArticle | null> {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post || !post.isPublished) return null;
    return mapBlogPost(post);
}

/** Get all published blog slugs (for generateStaticParams) */
export async function getAllBlogSlugs(): Promise<string[]> {
    const posts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true },
    });
    return posts.map((p: { slug: string }) => p.slug);
}

/** Get blog articles by category */
export async function getBlogsByCategory(category: string): Promise<BlogArticle[]> {
    const posts = await prisma.blogPost.findMany({
        where: { isPublished: true, category },
        orderBy: { publishedAt: 'desc' },
    });
    return posts.map(mapBlogPost);
}

/** Get related posts for a given slug */
export async function getRelatedPosts(currentSlug: string, count = 3): Promise<RelatedPost[]> {
    const current = await prisma.blogPost.findUnique({
        where: { slug: currentSlug },
        select: { category: true },
    });
    if (!current) return [];

    const related = await prisma.blogPost.findMany({
        where: {
            isPublished: true,
            slug: { not: currentSlug },
            category: current.category,
        },
        take: count,
        orderBy: { publishedAt: 'desc' },
    });

    return related.map((post: { title: string; excerpt: string; featuredImage: string; slug: string; publishedAt: Date | null }) => ({
        title: post.title,
        excerpt: post.excerpt,
        image: post.featuredImage,
        slug: post.slug,
        date: post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              })
            : '',
    }));
}
