import { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/ui/hero-section";
import { getAllBlogArticles } from "@/lib/db/blogs";

const NewsletterSignup = dynamic(() => import("@/components/ui/newsletter-form").then((mod) => mod.NewsletterSignup));

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
                <section className="container py-12 sm:py-16 md:py-24 mb-12 sm:mb-16 md:mb-20 px-4">
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
                                    <Link href={`/blog/${featuredPost.slug}`}>
                                        Read Full Story
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Blog Posts Grid */}
            <section id="latest-articles" className="container mb-12 sm:mb-16 md:mb-20 px-4">
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">Latest Articles</h2>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                        Discover inspiring safari stories, expert travel tips, and wildlife insights
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {regularPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <article className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-background/90 backdrop-blur-sm text-primary text-xs font-semibold rounded-full">
                                        {post.category}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                                        <div className="flex items-center space-x-3">
                                            <span className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{post.date}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{post.readTime}</span>
                                            </span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="container mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore topics that match your safari interests
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { name: 'Wildlife', slug: "wildlife" },
                        { name: 'Travel Tips', slug: "travel-tips" },
                        { name: 'Accommodation', slug: "accommodation" },
                        { name: 'Adventure', slug: "adventure" },
                        { name: 'Culture', slug: "culture" }
                    ].map((category) => (
                        <Link
                            key={category.slug}
                            href={`/blog/category/${category.slug}`}
                            prefetch={true}
                            className="bg-card border border-border/50 rounded-xl p-6 text-center hover:border-primary hover:shadow-md transition-all group"
                        >
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {category.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="container text-center p-8 md:p-12 bg-primary rounded-3xl text-white mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Subscribe to Our Newsletter</h2>
                <p className="text-base md:text-lg mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
                    Get the latest safari stories, travel tips, and exclusive offers delivered to your inbox
                </p>
                <NewsletterSignup />
            </section>
        </div>
    );
}
