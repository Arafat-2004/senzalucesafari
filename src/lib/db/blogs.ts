import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import type { BlogArticle, BlogSection, RelatedPost } from '@/types/blogs';
import { blogArticles as staticBlogs } from '@/data/blogs';

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
export const getAllBlogArticles = unstable_cache(
  async (): Promise<Record<string, BlogArticle>> => {
    try {
      const posts = await prisma.blogPost.findMany({
          where: { isPublished: true },
          orderBy: { publishedAt: 'desc' },
      });
      const record: Record<string, BlogArticle> = {};
      for (const post of posts) {
          record[post.slug] = mapBlogPost(post);
      }
      return record;
    } catch {
      return staticBlogs;
    }
  },
  ['all-blog-articles'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['blogs'],
  }
);

/** Get a single blog article by slug */
export const getBlogBySlug = unstable_cache(
  async (slug: string): Promise<BlogArticle | null> => {
    try {
      const post = await prisma.blogPost.findUnique({ where: { slug } });
      if (!post || !post.isPublished) return null;
      return mapBlogPost(post);
    } catch {
      return staticBlogs[slug] ?? null;
    }
  },
  ['blog-by-slug'],
  {
    revalidate: 7200, // 2 hours
    tags: ['blogs', 'blog-detail'],
  }
);

/** Get all published blog slugs (for generateStaticParams) */
export async function getAllBlogSlugs(): Promise<string[]> {
    try {
      const posts = await prisma.blogPost.findMany({
          where: { isPublished: true },
          select: { slug: true },
      });
      return posts.map((p: { slug: string }) => p.slug);
    } catch {
      return Object.keys(staticBlogs);
    }
}

/** Get blog articles by category */
export const getBlogsByCategory = unstable_cache(
  async (category: string): Promise<BlogArticle[]> => {
    try {
      const posts = await prisma.blogPost.findMany({
          where: { isPublished: true, category },
          orderBy: { publishedAt: 'desc' },
      });
      return posts.map(mapBlogPost);
    } catch {
      return Object.values(staticBlogs).filter(b => b.category === category);
    }
  },
  ['blogs-by-category'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['blogs'],
  }
);

/** Get related posts for a given slug */
export async function getRelatedPosts(currentSlug: string, count = 3): Promise<RelatedPost[]> {
    try {
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
    } catch {
      const current = staticBlogs[currentSlug];
      if (!current) return [];
      return Object.values(staticBlogs)
        .filter(b => b.slug !== currentSlug && b.category === current.category)
        .slice(0, count)
        .map(b => ({
          title: b.title,
          excerpt: b.excerpt ?? '',
          image: b.heroImage,
          slug: b.slug,
          date: b.date,
        }));
    }
}
