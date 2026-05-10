import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://senzalucesafaris.com").replace(/\/+$/, "");

  const staticPages: { path: string; priority: number; changeFreq: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1.0, changeFreq: "weekly" },
    { path: "/about", priority: 0.8, changeFreq: "monthly" },
    { path: "/safaris-tours", priority: 0.9, changeFreq: "weekly" },
    { path: "/destinations", priority: 0.9, changeFreq: "weekly" },
    { path: "/blog", priority: 0.8, changeFreq: "weekly" },
    { path: "/contact", priority: 0.7, changeFreq: "monthly" },
    { path: "/enquiry", priority: 0.6, changeFreq: "monthly" },
    { path: "/faq", priority: 0.7, changeFreq: "monthly" },
    { path: "/vehicles", priority: 0.6, changeFreq: "monthly" },
    { path: "/privacy", priority: 0.3, changeFreq: "yearly" },
    { path: "/terms", priority: 0.3, changeFreq: "yearly" },
    { path: "/support", priority: 0.4, changeFreq: "monthly" },
    { path: "/favourites", priority: 0.5, changeFreq: "monthly" },
  ];

  const staticEntries = staticPages.map(({ path, priority, changeFreq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq as "weekly" | "monthly" | "yearly",
    priority,
  }));

  let dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const [tours, destinations, blogPosts] = await Promise.all([
      prisma.tour.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
      prisma.destination.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
      prisma.blogPost.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
    ]);

    dynamicEntries = [
      ...tours.map((t) => ({
        url: `${baseUrl}/safaris-tours/${t.slug}`,
        lastModified: t.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...destinations.map((d) => ({
        url: `${baseUrl}/destinations/${d.slug}`,
        lastModified: d.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...blogPosts.map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // If DB is unavailable, serve only static pages
  }

  return [...staticEntries, ...dynamicEntries];
}
