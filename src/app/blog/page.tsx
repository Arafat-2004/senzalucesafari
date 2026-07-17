import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, Clock, PawPrint, Compass, Hotel, Mountain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/ui/hero-section";
import { getAllBlogArticles } from "@/lib/db/blogs";
import { BlogSearchGrid } from "@/components/blog/blog-search-grid";

export const metadata: Metadata = {
    title: "Blog & Travel Stories - Senza Luce Safaris",
    description: "Read inspiring safari stories, travel tips, and wildlife insights from Tanzania's wilderness.",
};

export const revalidate = 3600;

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    imageUrl: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    featured: boolean;
}

export default async function BlogPage() {
    const articles = await getAllBlogArticles();
    
    const blogPosts: BlogPost[] = Object.entries(articles).map(([slug, article]) => ({
        id: slug,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || article.title,
        imageUrl: article.heroImage || article.imageUrl || "/images/blog/placeholder.jpg",
        author: article.author,
        date: article.date,
        readTime: article.readTime,
        category: article.category,
        featured: false
    }));
    
    blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const featuredPost = blogPosts[0] || null;
    const regularPosts = blogPosts.slice(1);

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title="Safari Stories & Travel Insights"
                subtitle="Expert tips, wildlife encounters, and unforgettable adventures from Tanzania's wilderness"
                backgroundImage="/images/blog/great-migration.jpg"
                ctaText="Read Latest Articles"
                ctaLink="#latest-articles"
            />

            {/* Featured Post */}
            {featuredPost && (
                <section className="container py-12 sm:py-16 md:py-20 lg:py-24">
                    <div className="bg-secondary/30 rounded-2xl sm:rounded-3xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            <div className="relative aspect-video lg:aspect-auto bg-muted">
                                <Image
                                    src={featuredPost.imageUrl}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                            <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                                <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-4 w-fit">
                                    Featured Story
                                </span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">{featuredPost.title}</h2>
                                <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed px-2">{featuredPost.excerpt}</p>

                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                                    <div className="flex items-center space-x-1">
                                        <User className="w-4 h-4" />
                                        <span>{featuredPost.author}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{featuredPost.date}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{featuredPost.readTime}</span>
                                    </div>
                                </div>

                                <Button variant="safari" className="w-fit">
                                    <Link href={`/blog/${featuredPost.slug}`} className="flex items-center">
                                        Read Full Story
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Blog Posts Feed with Dynamic Search & Filters */}
            <section id="latest-articles" className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">Latest Articles</h2>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                        Discover inspiring safari stories, expert travel tips, and wildlife insights
                    </p>
                </div>

                <BlogSearchGrid posts={regularPosts} />
            </section>

            {/* Categories Section */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24 border-t border-border/40 bg-muted/10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore topics that match your safari interests
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { name: 'Wildlife', slug: "wildlife", icon: PawPrint, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20" },
                        { name: 'Travel Tips', slug: "travel-tips", icon: Compass, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" },
                        { name: 'Accommodation', slug: "accommodation", icon: Hotel, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20" },
                        { name: 'Adventure', slug: "adventure", icon: Mountain, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/20" },
                        { name: 'Culture', slug: "culture", icon: Sparkles, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20" }
                    ].map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.slug}
                                href={`/blog/category/${category.slug}`}
                                prefetch={true}
                                className="bg-card border border-border/50 rounded-2xl p-6 text-center hover:border-primary hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center space-y-4"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color} transition-transform group-hover:scale-110 duration-300`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-base group-hover:text-primary transition-colors mb-0">
                                    {category.name}
                                </h3>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
