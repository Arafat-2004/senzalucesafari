import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, User, Clock, ArrowRight, Camera, MapPin, Lightbulb, AlertCircle, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb-nav";
import { HeroSection } from "@/components/ui/hero-section";
import { getAllBlogSlugs, getBlogBySlug } from "@/lib/db";
import { JsonLd } from "@/components/seo/JsonLd";
import type { BlogSection } from "@/types/blogs";

// Revalidate blog detail data every hour (or immediately when admin triggers revalidatePath)
export const revalidate = 3600;

// Simple translation fallback
const getTranslations = async () => {
    const translations: Record<string, string> = {
        'blog.detail.readTime': 'min read',
        'blog.detail.relatedArticles': 'Related Articles',
        'blog.detail.backToBlog': 'Back to Blog',
        'blog.detail.shareArticle': 'Share this article',
        'blog.detail.authorBio': 'Expert travel writer specializing in African wildlife and safari experiences.',
        'blog.hero.cta': 'Plan Your Safari',
        'common.readMore': 'Read More',
    };
    return (key: string) => translations[key] || key;
};

// Generate static params for all blog posts
export async function generateStaticParams() {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({ slug }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await getBlogBySlug(slug);

    if (!article) {
        return {
            title: "Blog Post Not Found | Senza Luce Safaris",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
        title: `${article.title} | Senza Luce Safaris`,
        description: article.subtitle,
        openGraph: {
            title: `${article.title} | Senza Luce Safaris`,
            description: article.subtitle,
            type: 'article',
            url: `${siteUrl}/blog/${slug}`,
            images: [
                {
                    url: article.heroImage || `${siteUrl}/images/og/home.jpg`,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            publishedTime: article.date,
            authors: [article.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${article.title} | Senza Luce Safaris`,
            description: article.subtitle,
            images: [article.heroImage || `${siteUrl}/images/og/home.jpg`],
        },
        alternates: {
            canonical: `${siteUrl}/blog/${slug}`,
        },
    };
}

/* eslint-disable @typescript-eslint/no-explicit-any -- Blog section content is dynamically structured CMS data */
// Render different section types
const renderSection = (section: BlogSection, index: number) => {
    if (!section.content) {
        return (
            <div key={index} className="p-4 my-4 bg-muted/20 border border-dashed border-border rounded-lg text-center text-muted-foreground text-sm">
                [Empty {section.type || 'blog'} section]
            </div>
        );
    }
    const content = section.content as Record<string, any>;

    switch (section.type) {
        case 'introduction':
            return (
                <div key={index} className="prose prose-lg max-w-none mb-12 sm:mb-16">
                    <p className="text-xl sm:text-2xl leading-relaxed text-foreground font-light italic border-l-4 border-primary pl-6 py-2">
                        &ldquo;{content.text.split('\n\n')[0]}&rdquo;
                    </p>
                    {content.text.split('\n\n').slice(1).map((paragraph: string, idx: number) => (
                        <p key={idx} className="text-base sm:text-lg leading-relaxed text-muted-foreground mt-6">
                            {paragraph}
                        </p>
                    ))}
                </div>
            );

        case 'heading':
            return (
                <h2 key={index} className={`text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 ${content.level === 3 ? 'mt-8' : ''}`}>
                    {content.text}
                </h2>
            );

        case 'paragraph':
            return (
                <p key={index} className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                    {content.text}
                </p>
            );

        case 'quote':
            return (
                <blockquote key={index} className="relative my-10 sm:my-16 p-6 sm:p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-l-4 border-primary">
                    <Camera className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
                    <p className="text-lg sm:text-xl md:text-2xl text-foreground font-medium italic leading-relaxed mb-4">
                        &ldquo;{content.text}&rdquo;
                    </p>
                    <footer className="text-sm text-muted-foreground">
                        — {content.author}
                    </footer>
                </blockquote>
            );

        case 'highlight':
            return (
                <div key={index} className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8">
                    <p className="text-base sm:text-lg text-foreground font-medium flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>{content.title}:</strong> {content.text}</span>
                    </p>
                </div>
            );

        case 'list':
            return (
                <div key={index} className="my-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{content.title}</h3>
                    <ul className="space-y-3">
                        {content.items.map((item: string, idx: number) => (
                            <li key={idx} className="text-base sm:text-lg text-muted-foreground flex items-start">
                                <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            );

        case 'grid':
            return renderGrid(section, index);

        case 'timeline':
            return renderTimeline(section, index);

        case 'cta':
            return (
                <section key={index} className="my-12 sm:my-16 p-8 sm:p-10 md:p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl border border-primary/20 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {content.heading}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        {content.text}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
<Button className="btn-safari">
                        Book This Safari
                    </Button>
                    <Button variant="outline" className="btn-outline">
                        Ask About This Tour
                    </Button>
                        <Button size="lg" variant="outline" className="btn-outline">
                            <Link href={content.secondaryButton.link} className="inline-flex items-center">
                                {content.secondaryButton.text}
                            </Link>
                        </Button>
                    </div>
                </section>
            );

        default:
            return (
                <div key={index} className="p-4 my-4 bg-muted/20 border border-dashed border-border rounded-lg text-center text-muted-foreground text-sm">
                    [Unknown section type: {section.type}]
                </div>
            );
    }
};

// Render grid layouts
const renderGrid = (section: BlogSection, index: number) => {
    if (!section.content) {
        return (
            <div key={index} className="p-4 my-8 bg-muted/20 border border-dashed border-border rounded-lg text-center text-muted-foreground text-sm">
                [Empty grid section]
            </div>
        );
    }
    const { columns, items } = section.content as Record<string, any>;

    // Different grid rendering based on content structure
    if (items[0]?.features) {
        // Feature list grid (for lodge categories)
        return (
            <div key={index} className={`grid ${columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-4 sm:gap-6 my-8`}>
                {items.map((item: Record<string, any>, idx: number) => (
                    <div key={idx} className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 hover:shadow-md transition-all hover:border-primary/30">
                        <h3 className="font-bold text-foreground text-base sm:text-lg mb-4">{item.title}</h3>
                        <ul className="space-y-2">
                            {item.features.map((feature: string, fIdx: number) => (
                                <li key={fIdx} className="text-sm text-muted-foreground flex items-start">
                                    <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }

    if (items[0]?.rating) {
        // Rating grid (for park comparisons)
        return (
            <div key={index} className={`grid ${columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-4 sm:gap-6 my-8`}>
                {items.map((item: Record<string, any>, idx: number) => (
                    <div key={idx} className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 hover:shadow-md transition-all">
                        <h3 className="font-bold text-foreground text-lg mb-2">{item.title}</h3>
                        <div className="text-yellow-500 text-sm mb-3">{item.rating}</div>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        <p className="text-xs text-primary font-semibold">Best for: {item.bestFor}</p>
                    </div>
                ))}
            </div>
        );
    }

    if (items[0]?.period) {
        // Seasonal comparison grid
        return (
            <div key={index} className={`grid ${columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-4 sm:gap-6 my-8`}>
                {items.map((item: Record<string, any>, idx: number) => (
                    <div key={idx} className="bg-card border border-border/50 rounded-xl p-5 sm:p-6">
                        <h3 className="font-bold text-foreground text-lg mb-2">{item.title}</h3>
                        {item.periods && (
                            <ul className="space-y-1 mb-3">
                                {item.periods.map((period: string, pIdx: number) => (
                                    <li key={pIdx} className="text-sm text-muted-foreground">• {period}</li>
                                ))}
                            </ul>
                        )}
                        {item.timing && <p className="text-sm text-primary font-semibold mb-2">When: {item.timing}</p>}
                        {item.details && <p className="text-sm text-muted-foreground">{item.details}</p>}
                        {item.advantages && <p className="text-sm text-muted-foreground mt-2"><strong>Advantages:</strong> {item.advantages}</p>}
                        {item.pros && (
                            <div className="mt-3">
                                <p className="text-xs font-semibold text-foreground mb-2">Pros:</p>
                                <ul className="space-y-1">
                                    {item.pros.map((pro: string, pIdx: number) => (
                                        <li key={pIdx} className="text-xs text-muted-foreground flex items-start">
                                            <Check className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                                            {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {item.cons && (
                            <div className="mt-3">
                                <p className="text-xs font-semibold text-foreground mb-2">Cons:</p>
                                <ul className="space-y-1">
                                    {item.cons.map((con: string, cIdx: number) => (
                                        <li key={cIdx} className="text-xs text-muted-foreground flex items-start">
                                            <AlertCircle className="w-3 h-3 text-red-500 mr-1 flex-shrink-0" />
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // Default card grid (for lodges, animals, routes, landmarks)
    return (
        <div key={index} className={`grid ${columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-4 sm:gap-6 my-8`}>
            {items.map((item: Record<string, any>, idx: number) => (
                <div key={idx} className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 hover:shadow-md transition-all hover:border-primary/30">
                    {item.icon && <div className="text-3xl mb-3">{item.icon}</div>}
                    {item.category && <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2">{item.category}</span>}
                    <h3 className="font-bold text-foreground text-base sm:text-lg mb-2">{item.title}</h3>
                    {item.duration && <p className="text-xs text-primary font-semibold mb-1">Duration: {item.duration}</p>}
                    {item.difficulty && <p className="text-xs text-muted-foreground mb-1">Difficulty: {item.difficulty}</p>}
                    {item.successRate && <p className="text-xs text-green-600 font-semibold mb-2">Success Rate: {item.successRate}</p>}
                    {item.priceRange && <p className="text-xs text-accent font-semibold mb-2">{item.priceRange}</p>}
                    {(item.description || item.content) && <p className="text-sm text-muted-foreground mb-3">{item.description || item.content}</p>}
                    {item.highlights && (
                        <ul className="space-y-1 mb-3">
                            {item.highlights.map((highlight: string, hIdx: number) => (
                                <li key={hIdx} className="text-xs text-muted-foreground flex items-start">
                                    <Star className="w-3 h-3 text-yellow-500 mr-1 flex-shrink-0" />
                                    {highlight}
                                </li>
                            ))}
                        </ul>
                    )}
                    {item.highlight && <p className="text-xs text-primary italic mt-2">{item.highlight}</p>}
                    {item.bestFor && <p className="text-xs text-muted-foreground mt-2"><strong>Best for:</strong> {item.bestFor}</p>}
                    {item.items && (
                        <ul className="space-y-1 mt-3">
                            {item.items.map((listItem: string, lIdx: number) => (
                                <li key={lIdx} className="text-sm text-muted-foreground flex items-start">
                                    <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                                    {listItem}
                                </li>
                            ))}
                        </ul>
                    )}
                    {item.elements && (
                        <ul className="space-y-1 mt-3">
                            {item.elements.map((element: string, eIdx: number) => (
                                <li key={eIdx} className="text-sm text-muted-foreground flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    {element}
                                </li>
                            ))}
                        </ul>
                    )}
                    {item.issues && (
                        <ul className="space-y-1 mt-3">
                            {item.issues.map((issue: string, iIdx: number) => (
                                <li key={iIdx} className="text-sm text-muted-foreground flex items-start">
                                    <AlertCircle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                                    {issue}
                                </li>
                            ))}
                        </ul>
                    )}
                    {item.actions && (
                        <ul className="space-y-1 mt-3">
                            {item.actions.map((action: string, aIdx: number) => (
                                <li key={aIdx} className="text-sm text-muted-foreground flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                    {action}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

// Render timeline sections
const renderTimeline = (section: BlogSection, index: number) => {
    if (!section.content) {
        return (
            <div key={index} className="p-4 my-8 bg-muted/20 border border-dashed border-border rounded-lg text-center text-muted-foreground text-sm">
                [Empty timeline section]
            </div>
        );
    }
    const { items } = section.content as Record<string, any>;

    return (
        <div key={index} className="space-y-4 sm:space-y-6 my-8">
            {items.map((item: Record<string, any>, idx: number) => (
                <div key={idx} className="bg-card border border-border/50 rounded-xl p-5 sm:p-6 hover:shadow-md transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <h3 className="font-bold text-foreground text-base sm:text-lg">{item.period}</h3>
                        {(item.season || item.event || item.focus) && (
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full whitespace-nowrap">
                                {item.season || item.event || item.focus}
                            </span>
                        )}
                    </div>
                    {item.location && (
                        <p className="text-sm text-primary font-semibold mb-2 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {item.location}
                        </p>
                    )}
                    {item.wildlife && <p className="text-sm text-muted-foreground mb-2"><strong>Wildlife:</strong> {item.wildlife}</p>}
                    {item.weather && <p className="text-sm text-muted-foreground mb-2"><strong>Weather:</strong> {item.weather}</p>}
                    {item.description && <p className="text-sm text-muted-foreground mb-2">{item.description}</p>}
                    {item.activities && (
                        <ul className="space-y-1 mt-3">
                            {item.activities.map((activity: string, aIdx: number) => (
                                <li key={aIdx} className="text-sm text-muted-foreground flex items-start">
                                    <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                                    {activity}
                                </li>
                            ))}
                        </ul>
                    )}
                    {item.bestFor && <p className="text-sm text-accent font-semibold mt-2">Best for: {item.bestFor}</p>}
                    {item.crowdLevel && <p className="text-xs text-muted-foreground mt-2">Crowd Level: {item.crowdLevel}</p>}
                </div>
            ))}
        </div>
    );
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const t = await getTranslations();
    const article = await getBlogBySlug(slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (!article) {
        notFound();
    }

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.subtitle,
        "image": article.heroImage,
        "datePublished": article.date,
        "author": {
            "@type": "Person",
            "name": article.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Senza Luce Safaris",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${siteUrl}/blog/${slug}`
        }
    };

    return (
        <article className="min-h-screen">
            <JsonLd data={articleJsonLd} />
            {/* Breadcrumb Navigation */}
            <div className="bg-muted/30 border-b">
                <div className="container px-4 py-4">
                    <Breadcrumb />
                </div>
            </div>

            {/* Hero Section */}
            <HeroSection
                title={article.title}
                subtitle={article.subtitle}
                backgroundImage={article.heroImage}
                ctaText={t('blog.hero.cta')}
                ctaLink="#article-content"
            />

            {/* Article Metadata Bar */}
            <section className="bg-card border-b border-border/50 sticky top-20 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container px-3 sm:px-4 md:px-6 lg:px-8 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-primary" />
                                <span className="font-medium text-foreground">{article.author}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{article.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{article.readTime} {t('blog.detail.readTime')}</span>
                            </div>
                        </div>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                            {article.category}
                        </span>
                    </div>
                </div>
            </section>

            {/* Main Article Content */}
            <div id="article-content" className="container px-3 sm:px-4 md:px-6 lg:px-8 max-w-4xl mx-auto py-12 sm:py-16 md:py-20">
                {/* Render all sections */}
                {article.sections.map((section, index) => renderSection(section, index))}

                {/* Author Bio */}
                <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-card rounded-2xl border border-border/50">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">About the Author</h3>
                            <p className="text-base text-muted-foreground mb-3">
                                <strong className="text-foreground">{article.author}</strong> - {article.authorBio}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Posts Section */}
            <section className="bg-muted/30 py-12 sm:py-16 md:py-20">
                <div className="container px-3 sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-10 sm:mb-12">
                        {t('blog.detail.relatedArticles')}
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                        {article.relatedPosts.map((post, index) => (
                            <Link
                                key={index}
                                href={`/blog/${post.slug}`}
                                className="group block"
                            >
                                <article className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute top-3 left-3 px-3 py-1.5 bg-background/90 backdrop-blur-sm text-primary text-xs font-semibold rounded-full">
                                            {t('common.readMore')}
                                        </div>
                                    </div>

                                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                                        <h3 className="text-lg sm:text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>

                                        <div className="flex items-center text-xs text-muted-foreground pt-4 border-t border-border/50 mt-auto">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Back to Blog Link */}
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-primary hover:text-primary-dark transition-colors font-medium group"
                >
                    <ArrowRight className="w-5 h-5 mr-2 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                    {t('blog.detail.backToBlog')}
                </Link>
            </div>
        </article>
    );
}
