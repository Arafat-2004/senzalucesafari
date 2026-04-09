"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { Search, X, Compass, Map, FileText } from "lucide-react";
import { tourPackages } from "@/data/tours";
import { allDestinations } from "@/data/destinations";
import { blogArticles } from "@/data/blogs";
import { Link as I18nLink } from '@/i18n/navigation';

interface SearchResult {
    type: "tour" | "destination" | "blog";
    title: string;
    description: string;
    href: string;
    icon: any;
}

export function SearchModal() {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);

    // Keyboard shortcut: Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Search logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const searchTerm = query.toLowerCase();
        const searchResults: SearchResult[] = [];

        // Search tours
        tourPackages.forEach((tour) => {
            if (
                tour.name.toLowerCase().includes(searchTerm) ||
                tour.shortDescription.toLowerCase().includes(searchTerm)
            ) {
                searchResults.push({
                    type: "tour",
                    title: tour.name,
                    description: tour.shortDescription.substring(0, 100),
                    href: `/safaris-tours/${tour.slug}`,
                    icon: Compass
                });
            }
        });

        // Search destinations
        allDestinations.forEach((dest) => {
            if (
                dest.name.toLowerCase().includes(searchTerm) ||
                dest.shortDescription.toLowerCase().includes(searchTerm)
            ) {
                searchResults.push({
                    type: "destination",
                    title: dest.name,
                    description: dest.shortDescription.substring(0, 100),
                    href: `/destinations/${dest.slug}`,
                    icon: Map
                });
            }
        });

        // Search blogs
        Object.values(blogArticles).forEach((blog) => {
            if (
                blog.title.toLowerCase().includes(searchTerm) ||
                blog.subtitle.toLowerCase().includes(searchTerm)
            ) {
                searchResults.push({
                    type: "blog",
                    title: blog.title,
                    description: blog.subtitle.substring(0, 100),
                    href: `/blog/${blog.slug}`,
                    icon: FileText
                });
            }
        });

        setResults(searchResults.slice(0, 10));
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 md:pt-32 px-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 p-4 border-b border-border">
                    <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('search.placeholder')}
                        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                        autoFocus
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                        aria-label="Close search"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                    {!query.trim() ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="text-sm">{t('search.startTyping')}</p>
                            <p className="text-xs mt-2 opacity-60">
                                {t('search.pressEsc')} <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd> {t('search.toClose')}
                            </p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p className="text-sm">{t('search.noResults')} "{query}"</p>
                            <p className="text-xs mt-2 opacity-60">{t('search.tryDifferent')}</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.map((result, index) => (
                                <I18nLink
                                    key={index}
                                    href={result.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors group"
                                >
                                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <result.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-primary uppercase tracking-wide">
                                                {t(`search.typeLabels.${result.type}`)}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-foreground text-sm truncate">
                                            {result.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {result.description}
                                        </p>
                                    </div>
                                </I18nLink>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-4 py-3 border-t border-border bg-muted/30">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">↑↓</kbd>
                                {t('search.navigate')}
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">↵</kbd>
                                {t('search.select')}
                            </span>
                        </div>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">esc</kbd>
                            {t('search.close')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SearchTrigger() {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-sm text-muted-foreground min-w-[200px]"
                aria-label="Open search"
            >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">{t('search.search')}</span>
                <kbd className="hidden md:inline-flex items-center gap-1 ml-auto text-xs">
                    <span className="px-1.5 py-0.5 bg-muted rounded">⌘</span>
                    <span className="px-1.5 py-0.5 bg-muted rounded">K</span>
                </kbd>
            </button>
            {isOpen && <SearchModal />}
        </>
    );
}
