import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, ArrowRight, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/ui/hero-section";
import { getAllBlogArticles } from "@/lib/db";

// Category slug to display name mapping
const categoryMap: Record<string, string> = {
    "wildlife": "Wildlife",
    "travel-tips": "Travel Tips",
    "accommodation": "Accommodation",
    "adventure": "Adventure",
    "culture": "Culture"
};

// Map URL slugs to actual category values in blog data
const categoryDataMap: Record<string, string[]> = {
    "wildlife": ["Wildlife & Photography", "Wildlife & Conservation"],
    "travel-tips": ["Travel Planning"],
    "accommodation": ["Accommodation & Luxury", "Ultra-Luxury", "Luxury Tented", "Mid-Range Luxury", "Unique Experience", "Budget-Friendly"],
    "adventure": ["Adventure & Trekking"],
    "culture": ["Culture & History"]
};

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { category } = await params;
    const categoryName = categoryMap[category];

    if (!categoryName) {
        return {
            title: "Category Not Found - Senza Luce Safaris",
        };
    }

    return {
        title: `${categoryName} Articles - Senza Luce Safaris`,
        description: `Explore our collection of ${categoryName.toLowerCase()} articles, guides, and insights for your Tanzanian safari adventure.`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params;
    const categoryName = categoryMap[category];

    // If category doesn't exist, show 404
    if (!categoryName) {
        notFound();
    }

    // Get all blog articles and filter by category
    const blogArticles = await getAllBlogArticles();
    const allArticles = Object.values(blogArticles);
    const matchingCategories = categoryDataMap[category] || [];

    const filteredPosts = allArticles.filter(article =>
        matchingCategories.includes(article.category)
    );

    // Get background image based on category
    const categoryImages: Record<string, string> = {
        "wildlife": "/images/blog/big-five.jpg",
        "travel-tips": "/images/blog/seasons-guide.jpg",
        "accommodation": "/images/blog/luxury-lodges.jpg",
        "adventure": "/images/blog/kilimanjaro-climb.jpg",
        "culture": "/images/blog/stone-town.jpg"
    };

    const backgroundImage = categoryImages[category] || "/images/blog/great-migration.jpg";

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <HeroSection
                title={`${categoryName} Articles`}
                subtitle={`Discover expert insights, tips, and stories about ${categoryName.toLowerCase()} in Tanzania.`}
                backgroundImage={backgroundImage}
                ctaText="Browse Articles"
                ctaLink="#articles"
            />

            {/* Breadcrumb Navigation */}
            <section className="container py-6">
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/blog" className="hover:text-primary transition-colors">
                        Blog
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium">{categoryName}</span>
                </nav>
            </section>

            {/* Back to Blog Button */}
            <section className="container pb-8">
                <Link href="/blog">
                    <Button variant="outline" className="group">
                        <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to All Articles
                    </Button>
                </Link>
            </section>

            {/* Articles Grid */}
            <section id="articles" className="container mb-20">
                {filteredPosts.length > 0 ? (
                    <>
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                {categoryName} Articles
                            </h2>
                            <p className="text-muted-foreground max-w-2xl">
                                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group block"
                                >
                                    <article className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                            <Image
                                                src={post.heroImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                                                {post.subtitle}
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
                    </>
                ) : (
                    /* Empty State */
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-2xl font-bold mb-4">No Articles Available Yet</h3>
                            <p className="text-muted-foreground mb-8">
                                We&apos;re working on creating amazing {categoryName.toLowerCase()} content for you. Check back soon!
                            </p>
                            <Link href="/blog">
                                <Button className="btn-safari">
                                    Browse All Articles
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </section>

            {/* Other Categories Section */}
            <section className="container mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore More Categories</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Discover other topics that might interest you
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(categoryMap).map(([slug, name]) => (
                        <Link
                            key={slug}
                            href={`/blog/category/${slug}`}
                            prefetch={true}
                            className={`bg-card border rounded-xl p-6 text-center hover:shadow-md transition-all group ${category === slug
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-border/50 hover:border-primary'
                                }`}
                        >
                            <h3 className={`font-semibold text-lg transition-colors ${category === slug
                                ? 'text-primary'
                                : 'group-hover:text-primary'
                                }`}>
                                {name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
