"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X, Compass, Map, FileText, Phone, Mail, Calendar, ArrowRight, LucideIcon } from "lucide-react";
import { tourPackages } from "@/data/tours";
import { allDestinations } from "@/data/destinations";
import { blogArticles } from "@/data/blogs";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface SearchResult {
    type: "tour" | "destination" | "blog" | "action";
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    action?: () => void;
}

interface QuickAction {
    title: string;
    description: string;
    icon: LucideIcon;
    href?: string;
    action?: () => void;
}

export function SearchModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

    // Quick actions for command palette
    const quickActions: QuickAction[] = useMemo(() => [
        {
            title: "Book a Safari",
            description: "Browse our safari packages",
            icon: Calendar,
            href: "/safaris-tours"
        },
        {
            title: "Contact Us",
            description: "Get in touch with our team",
            icon: Phone,
            href: "/contact"
        },
        {
            title: "Send Email",
            description: "Email us directly",
            icon: Mail,
            action: () => {
                window.location.href = "mailto:info@senzalucesafaris.com";
                toast({
                    title: "Opening Email Client",
                    description: "Your email client should open shortly",
                    variant: "info"
                });
            }
        },
        {
            title: "View Destinations",
            description: "Explore Tanzania destinations",
            icon: Map,
            href: "/destinations"
        },
        {
            title: "Read Travel Guides",
            description: "Browse our blog articles",
            icon: FileText,
            href: "/blog"
        }
    ], []);

    // Derive search results from query (no effect needed)
    const results = useMemo<SearchResult[]>(() => {
        if (!query.trim()) return [];

        const searchTerm = query.toLowerCase();
        const searchResults: SearchResult[] = [];

        // Search tours
        tourPackages.forEach((tour) => {
            if (
                tour.name.toLowerCase().includes(searchTerm) ||
                tour.shortDescription.toLowerCase().includes(searchTerm) ||
                tour.category.toLowerCase().includes(searchTerm) ||
                tour.destinations?.some(d => d.toLowerCase().includes(searchTerm))
            ) {
                searchResults.push({
                    type: "tour",
                    title: tour.name,
                    description: `${tour.duration} • From $${tour.priceFrom.toLocaleString()}`,
                    href: `/safaris-tours/${tour.slug}`,
                    icon: Compass
                });
            }
        });

        // Search destinations
        allDestinations.forEach((dest) => {
            if (
                dest.name.toLowerCase().includes(searchTerm) ||
                dest.shortDescription.toLowerCase().includes(searchTerm) ||
                dest.highlights?.some(h => h.toLowerCase().includes(searchTerm))
            ) {
                searchResults.push({
                    type: "destination",
                    title: dest.name,
                    description: dest.shortDescription.substring(0, 80),
                    href: `/destinations/${dest.slug}`,
                    icon: Map
                });
            }
        });

        // Search blogs
        Object.values(blogArticles).forEach((blog) => {
            if (
                blog.title.toLowerCase().includes(searchTerm) ||
                blog.subtitle.toLowerCase().includes(searchTerm) ||
                blog.excerpt?.toLowerCase().includes(searchTerm)
            ) {
                searchResults.push({
                    type: "blog",
                    title: blog.title,
                    description: blog.subtitle.substring(0, 80),
                    href: `/blog/${blog.slug}`,
                    icon: FileText
                });
            }
        });

        // Search quick actions
        if (searchTerm.length > 0) {
            quickActions.forEach((action) => {
                if (
                    action.title.toLowerCase().includes(searchTerm) ||
                    action.description.toLowerCase().includes(searchTerm)
                ) {
                    searchResults.push({
                        type: "action",
                        title: action.title,
                        description: action.description,
                        href: action.href || "#",
                        icon: action.icon,
                        action: action.action
                    });
                }
            });
        }

        return searchResults.slice(0, 12);
    }, [query, quickActions]);

    // Helper to update query and reset selection
    const updateQuery = useCallback((newQuery: string) => {
        setQuery(newQuery);
        setSelectedIndex(0);
    }, []);

    // Keyboard shortcut: Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
                updateQuery("");
            }
            if (e.key === "Escape") {
                setIsOpen(false);
                updateQuery("");
            }
            // Arrow navigation
            if (isOpen && results.length > 0) {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % results.length);
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
                } else if (e.key === "Enter" && results[selectedIndex]) {
                    e.preventDefault();
                    const selected = results[selectedIndex];
                    if (selected.action) {
                        selected.action();
                        setIsOpen(false);
                    } else if (selected.href) {
                        router.push(selected.href);
                        setIsOpen(false);
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, results, selectedIndex, router, updateQuery]);

    const handleResultClick = useCallback((result: SearchResult) => {
        if (result.action) {
            result.action();
        } else if (result.href) {
            router.push(result.href);
        }
        setIsOpen(false);
        updateQuery("");
    }, [router, updateQuery]);

    if (!isOpen) return <></>;

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
                        onChange={(e) => updateQuery(e.target.value)}
                        placeholder="Search safaris, destinations, guides..."
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
                        <div className="p-6">
                            <div className="text-center text-muted-foreground mb-6">
                                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm font-medium">Search safaris, destinations, guides...</p>
                                <p className="text-xs mt-2 opacity-60">
                                    Or choose a quick action below
                                </p>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                                    Quick Actions
                                </p>
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (action.action) {
                                                action.action();
                                            } else if (action.href) {
                                                router.push(action.href);
                                            }
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors group text-left"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <action.icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-foreground text-sm">{action.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p className="text-sm">No results for &quot;{query}&quot;</p>
                            <p className="text-xs mt-2 opacity-60">Try a different search term</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.map((result, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleResultClick(result)}
                                    className={`w-full flex items-start gap-3 px-4 py-3 transition-colors group text-left ${index === selectedIndex
                                            ? 'bg-primary/10 border-l-2 border-primary'
                                            : 'hover:bg-muted'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg transition-colors ${index === selectedIndex
                                            ? 'bg-primary/20'
                                            : 'bg-primary/10 group-hover:bg-primary/20'
                                        }`}>
                                        <result.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-primary uppercase tracking-wide">
                                                {result.type === 'tour' ? 'Safari' :
                                                    result.type === 'destination' ? 'Destination' :
                                                        result.type === 'blog' ? 'Blog' : 'Action'}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-foreground text-sm truncate">
                                            {result.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {result.description}
                                        </p>
                                    </div>
                                    {result.href !== '#' && (
                                        <ArrowRight className="w-4 h-4 text-muted-foreground mt-2" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-4 py-3 border-t border-border bg-muted/30">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">↑↓</kbd>
                                Navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">↵</kbd>
                                Select
                            </span>
                        </div>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">esc</kbd>
                            Close
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SearchTrigger() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-sm text-muted-foreground"
                aria-label="Open search"
            >
                <Search className="w-4 h-4" />
                <span>Search</span>
            </button>
            {isOpen && <SearchModal />}
        </>
    );
}

export function MobileSearchTrigger() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                aria-label="Open search"
            >
                <Search className="h-5 w-5" />
            </button>
            {isOpen && <SearchModal />}
        </>
    );
}
