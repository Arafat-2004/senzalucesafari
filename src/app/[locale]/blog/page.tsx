import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/ui/hero-section";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "Blog & Travel Stories - Senza Luce Safaris",
    description: "Read inspiring safari stories, travel tips, and wildlife insights from Tanzania's wilderness.",
};

// Sample blog posts data
const blogPosts = [
    {
        id: 1,
        title: "Witnessing the Great Migration: A Photographer's Dream",
        slug: "great-migration-photographers-dream",
        excerpt: "Experience the awe-inspiring journey of millions of wildebeest as they traverse the Serengeti plains in search of fresh grazing lands.",
        imageUrl: "/images/blog/great-migration.jpg",
        author: "James Mwangi",
        date: "March 28, 2026",
        readTime: "8 min read",
        category: "Wildlife",
        featured: true
    },
    {
        id: 2,
        title: "Top 10 Safari Lodges in Northern Tanzania",
        slug: "top-safari-lodges-northern-tanzania",
        excerpt: "Discover luxury accommodations that blend seamlessly with nature while offering world-class amenities and unforgettable experiences.",
        imageUrl: "/images/blog/luxury-lodges.jpg",
        author: "Sarah Thompson",
        date: "March 25, 2026",
        readTime: "12 min read",
        category: "Accommodation",
        featured: false
    },
    {
        id: 3,
        title: "The Big Five: Your Ultimate Guide to Tanzania's Iconic Wildlife",
        slug: "big-five-guide-tanzania",
        excerpt: "Learn about the legendary Big Five animals and the best locations to spot them in their natural habitat across Tanzania's national parks.",
        imageUrl: "/images/blog/big-five.jpg",
        author: "David Kimaro",
        date: "March 20, 2026",
        readTime: "10 min read",
        category: "Wildlife",
        featured: false
    },
    {
        id: 4,
        title: "Best Time to Visit Tanzania: A Month-by-Month Guide",
        slug: "best-time-visit-tanzania-guide",
        excerpt: "Plan your perfect safari timing with our comprehensive guide to Tanzania's seasons, weather patterns, and wildlife viewing opportunities.",
        imageUrl: "/images/blog/seasons-guide.jpg",
        author: "Emily Chen",
        date: "March 15, 2026",
        readTime: "15 min read",
        category: "Travel Tips",
        featured: false
    },
    {
        id: 5,
        title: "Climbing Kilimanjaro: Routes, Tips, and What to Expect",
        slug: "climbing-kilimanjaro-complete-guide",
        excerpt: "Everything you need to know about conquering Africa's highest peak, from choosing the right route to preparation and acclimatization.",
        imageUrl: "/images/blog/kilimanjaro-climb.jpg",
        author: "Michael Roberts",
        date: "March 10, 2026",
        readTime: "18 min read",
        category: "Adventure",
        featured: false
    },
    {
        id: 6,
        title: "Zanzibar Beyond the Beach: Exploring Stone Town's Rich History",
        slug: "zanzibar-stone-town-history",
        excerpt: "Dive into the fascinating cultural heritage of Zanzibar's UNESCO World Heritage Site, where African, Arab, and European influences merge.",
        imageUrl: "/images/blog/stone-town.jpg",
        author: "Amina Hassan",
        date: "March 5, 2026",
        readTime: "9 min read",
        category: "Culture",
        featured: false
    }
];

export default function BlogPage() {
    const t = useTranslations();
    const featuredPost = blogPosts.find(post => post.featured);
    const regularPosts = blogPosts.filter(post => !post.featured);

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title={t('blog.hero.title')}
                subtitle={t('blog.hero.subtitle')}
                backgroundImage="/images/blog/great-migration.jpg"
                ctaText={t('blog.hero.cta')}
                ctaLink="#latest-articles"
            />

            {/* Featured Post */}
            {featuredPost && (
                <section className="container py-16 md:py-24 mb-20">
                    <div className="bg-secondary/30 rounded-3xl overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-0">
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
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-4 w-fit">
                                    {t('blog.featured.label')}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuredPost.title}</h2>
                                <p className="text-muted-foreground mb-6 leading-relaxed">{featuredPost.excerpt}</p>

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

                                <Button className="btn-safari w-fit">
                                    <Link href={`/blog/${featuredPost.slug}`}>
                                        {t('blog.featured.readFullStory')}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Blog Posts Grid */}
            <section id="latest-articles" className="container mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('blog.latest.title')}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t('blog.latest.description')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('blog.categories.title')}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t('blog.categories.description')}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { name: t('blog.categories.wildlife'), slug: "wildlife" },
                        { name: t('blog.categories.travelTips'), slug: "travel-tips" },
                        { name: t('blog.categories.accommodation'), slug: "accommodation" },
                        { name: t('blog.categories.adventure'), slug: "adventure" },
                        { name: t('blog.categories.culture'), slug: "culture" }
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
            <section className="container text-center p-12 bg-primary rounded-3xl text-white mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('blog.newsletter.title')}</h2>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                    {t('blog.newsletter.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder={t('blog.newsletter.placeholder')}
                        className="flex-1 px-4 py-3 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <Button className="bg-white text-primary hover:bg-white/90 btn-safari whitespace-nowrap">
                        {t('blog.newsletter.subscribe')}
                    </Button>
                </div>
            </section>
        </div>
    );
}
