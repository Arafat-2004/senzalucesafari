"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface BlogSearchGridProps {
    posts: BlogPost[];
}

export function BlogSearchGrid({ posts }: BlogSearchGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Extract categories dynamically
    const categories = useMemo(() => {
        const unique = new Set(posts.map(p => p.category));
        return ['All', ...Array.from(unique)];
    }, [posts]);

    // Filtering logic
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = 
                activeCategory === 'All' || 
                post.category === activeCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [posts, searchQuery, activeCategory]);

    const handleReset = () => {
        setSearchQuery('');
        setActiveCategory('All');
    };

    return (
        <div className="space-y-10">
            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/50">
                {/* Localized Search Input */}
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search safari articles, travel guides..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 bg-card border border-border/60 rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
                        id="blog-local-search"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                    )}
                </div>

                {/* Horizontal Category Filters */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 -my-1 -mx-4 px-4 md:mx-0 md:px-0">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 cursor-pointer",
                                activeCategory === category
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Info */}
            {(searchQuery || activeCategory !== 'All') && (
                <div className="text-sm text-muted-foreground">
                    Found {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} 
                    {activeCategory !== 'All' && <span> in &quot;{activeCategory}&quot;</span>}
                    {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
                </div>
            )}

            {/* Empty State */}
            {filteredPosts.length === 0 ? (
                <div className="text-center py-16 bg-muted/20 border border-dashed border-border/60 rounded-2xl p-8 max-w-lg mx-auto">
                    <Search className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-60" />
                    <h3 className="text-lg font-bold mb-2">No articles found</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        We couldn&apos;t find any stories or guides matching your criteria. Try adjusting your keywords or category filters.
                    </p>
                    <button
                        onClick={handleReset}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                /* Symmetrical Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredPosts.map((post) => (
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
                                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-background/90 backdrop-blur-sm text-primary text-xs font-semibold rounded-full shadow-sm">
                                        {post.category}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1 leading-relaxed">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                                        <div className="flex items-center space-x-3">
                                            <span className="flex items-center space-x-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{post.date}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{post.readTime}</span>
                                            </span>
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
