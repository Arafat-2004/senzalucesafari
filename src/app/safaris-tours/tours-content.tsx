"use client";

import { useState, useEffect } from "react";
import { showToast } from '@/lib/ui/toast';
import Link from "next/link";
import Image from "next/image";
import type { TourPackage } from "@/types/tours";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, Calendar, CheckCircle, MessageCircle, Map, Ticket, ClipboardList, Compass, Shirt, Camera, Pill, FileText, Sun, PawPrint } from "lucide-react";
import { TourCard } from "@/components/ui/tour-card";
import { SidebarFilter, FilterState } from "@/components/ui/sidebar-filter";
import { BookingModal } from "@/components/ui/booking-modal";
import { ComparisonBar } from "@/components/ui/comparison-bar";
import { useTourComparison } from "@/components/ui/tour-comparison";

interface ToursContentProps {
    tours: TourPackage[];
}

export function ToursContent({ tours }: ToursContentProps) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        category: "all",
        minPrice: 0,
        maxPrice: 10000,
        duration: "all",
        destination: "all",
        difficulty: "all",
        minRating: 0,
        travelMonth: "all"
    });

    // Simple text search for tours (client-side)
    const [search, setSearch] = useState("");

    // Tour comparison hook
    const {
        compareTours,
        addTour,
        removeTour,
        isAdded,
        clearAll
    } = useTourComparison();

    const handleCompareToggle = (tour: TourPackage) => {
        if (isAdded(tour.id)) {
            removeTour(tour.id);
            showToast('Removed from compare', { type: 'info' });
        } else {
            if (compareTours.length >= 4) {
                showToast('You can compare up to 4 tours at a time', { type: 'warning' });
                return;
            }
            addTour(tour);
            showToast('Added to compare', { type: 'success' });
        }
    };

    const categories = [
        { id: "all", label: "All Tours" },
        { id: "Wildlife Safari", label: "Wildlife Safari" },
        { id: "Safari & Beach", label: "Safari & Beach" },
        { id: "Trekking", label: "Trekking" },
        { id: "Beach Holiday", label: "Beach Holiday" },
        { id: "Luxury Safari", label: "Luxury Safari" }
    ];

    const handleBookClick = (tour: TourPackage) => {
        setSelectedTour(tour);
        setIsModalOpen(true);
        showToast(`Booking started for ${tour.name}`, { type: 'info' });
    };

    // Prefill compare from URL if present (shareable link support)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const url = new URL(window.location.href);
            const compareParam = url.searchParams.get('compare');
            if (!compareParam) return;
            const ids = compareParam.split(',').map((s) => s.trim()).filter(Boolean);
            if (ids.length === 0) return;
            // Fetch tours by IDs from API and add them to compare
            fetch(`/api/tours/ids?ids=${ids.join(',')}`)
                .then((r) => r.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        data.forEach((t: any) => {
                            // Cast to TourPackage-like object; ensure types align
                            addTour(t as TourPackage);
                        });
                    }
                })
                .catch(() => {
                    showToast('Failed to load compare tours', { type: 'error' });
                });
        } catch {
            // Ignore URL parsing errors
        }
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Month data for interactive selector
    const monthData: Record<string, { weather: string; crowd: string; quality: string; season: string; bestFor: string }> = {
        Jan: { weather: "Warm, occasional showers", crowd: "Moderate", quality: "Excellent", season: "Short Dry Season", bestFor: "Calving season, predator action" },
        Feb: { weather: "Warm, mostly dry", crowd: "Moderate", quality: "Excellent", season: "Short Dry Season", bestFor: "Newborn animals, photography" },
        Mar: { weather: "Increasing rain", crowd: "Low", quality: "Good", season: "Long Rains Begin", bestFor: "Budget travel, birding" },
        Apr: { weather: "Heavy rains", crowd: "Very Low", quality: "Fair", season: "Long Rains Peak", bestFor: "Lowest prices, lush landscapes" },
        May: { weather: "Rain decreasing", crowd: "Low", quality: "Good", season: "Long Rains End", bestFor: "Green scenery, fewer tourists" },
        Jun: { weather: "Cool and dry", crowd: "High", quality: "Excellent", season: "Dry Season Start", bestFor: "Wildlife viewing begins" },
        Jul: { weather: "Cool, dry", crowd: "Very High", quality: "Outstanding", season: "Peak Dry Season", bestFor: "Great Migration crossings" },
        Aug: { weather: "Warm, dry", crowd: "Very High", quality: "Outstanding", season: "Peak Dry Season", bestFor: "River crossings, big cats" },
        Sep: { weather: "Warm, dry", crowd: "High", quality: "Excellent", season: "Dry Season", bestFor: "Migration continues, great weather" },
        Oct: { weather: "Hot, dry", crowd: "Moderate-High", quality: "Excellent", season: "Dry Season End", bestFor: "Wildlife around waterholes" },
        Nov: { weather: "Short rains begin", crowd: "Low-Moderate", quality: "Good", season: "Short Rains Start", bestFor: "Bird watching, lower prices" },
        Dec: { weather: "Warm, mixed rain", crowd: "Moderate", quality: "Very Good", season: "Short Rains End", bestFor: "Festive season, migration south" }
    };

    // Apply filters
    const filteredTours = tours.filter(tour => {
        // Quick search filter
        if (search.trim()) {
            const q = search.toLowerCase();
            const hay = `${tour.name} ${tour.shortDescription} ${tour.destinations?.join(' ') ?? ''} ${tour.category}`.toLowerCase();
            if (!hay.includes(q)) return false;
        }
        // Category filter
        if (filters.category !== "all" && tour.category !== filters.category) return false;

        // Price filter
        if (tour.priceFrom < filters.minPrice || tour.priceFrom > filters.maxPrice) return false;

        // Duration filter
        if (filters.duration !== "all") {
            const daysMatch = tour.duration.match(/(\d+)/);
            const days = daysMatch ? parseInt(daysMatch[1]) : 0;

            if (filters.duration === "1-3" && (days < 1 || days > 3)) return false;
            if (filters.duration === "4-6" && (days < 4 || days > 6)) return false;
            if (filters.duration === "7-9" && (days < 7 || days > 9)) return false;
            if (filters.duration === "10+" && days < 10) return false;
        }

        // Destination filter - checks destinations array first, then falls back to text search
        if (filters.destination !== "all") {
            // Check if tour has destinations array
            if (tour.destinations && tour.destinations.length > 0) {
                if (!tour.destinations.includes(filters.destination)) return false;
            } else {
                // Fallback to text search for older tours
                const searchText = `${tour.startEnd} ${tour.highlights.join(' ')}`.toLowerCase();
                if (filters.destination === "serengeti" && !searchText.includes("serengeti")) return false;
                if (filters.destination === "ngorongoro" && !searchText.includes("ngorongoro")) return false;
                if (filters.destination === "tarangire" && !searchText.includes("tarangire")) return false;
                if (filters.destination === "zanzibar" && !searchText.includes("zanzibar")) return false;
                if (filters.destination === "manyara" && !searchText.includes("manyara")) return false;
                if (filters.destination === "kilimanjaro" && !searchText.includes("kilimanjaro")) return false;
            }
        }

        // Difficulty filter (if tour has difficulty property)
        if (filters.difficulty !== "all" && tour.difficulty) {
            if (tour.difficulty !== filters.difficulty) return false;
        }

        // Minimum rating filter
        if (filters.minRating > 0 && tour.rating < filters.minRating) return false;

        // Travel month filter (basic implementation - can be enhanced with best travel times)
        if (filters.travelMonth !== "all") {
            // This is a placeholder - you can add best travel month data to tours
            // For now, we'll show all tours for any month
            // Future enhancement: Add bestMonths property to tour data
        }

        return true;
    });

    return (
        <>
            {/* Introduction Section */}
            <section className="container py-6 md:py-8">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Search</div>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tours..."
                        className="border rounded-md px-3 py-2 text-sm w-48"
                        aria-label="Search tours"
                    />
                </div>
            </section>
            {/* Introduction Section */}
            <section className="container py-12 md:py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Safari & Tour Packages</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        From thrilling wildlife encounters to serene beach retreats, discover experiences that will create lifelong memories
                    </p>
                </div>
            </section>

            {/* Main Content with Sidebar */}
            <section className="container pb-16">
                <div className="flex gap-8">
                    {/* Mobile Filter Toggle */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden mb-4 fixed bottom-4 right-4 z-30 shadow-lg rounded-full px-4 py-2 bg-primary text-white border-none hover:bg-primary/90"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>

                    {/* Sidebar Filter */}
                    <SidebarFilter
                        onFilterChange={setFilters}
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />

                    {/* Main Grid Area */}
                    <div className="flex-1">
                        {/* Category Filter Tabs - Desktop */}
                        <div className="hidden lg:flex flex-wrap gap-3 mb-8">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setActiveCategory(category.id);
                                        setFilters(prev => ({ ...prev, category: category.id }));
                                    }}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category.id
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-card border border-border/50 text-foreground hover:border-primary hover:shadow-sm'
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>

                        {/* Tours Grid */}
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredTours.length > 0 ? filteredTours.map((tour) => (
                                <TourCard
                                    key={tour.id}
                                    tour={tour}
                                    onBookClick={handleBookClick}
                                    onCompareToggle={handleCompareToggle}
                                    isComparing={isAdded(tour.id)}
                                />
                            )) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-muted-foreground mb-2">No tours found with current filters</p>
                                    <Button
                    onClick={() => {
                        setFilters({
                                                category: "all",
                                                minPrice: 0,
                                                maxPrice: 10000,
                                                duration: "all",
                                                destination: "all",
                                                difficulty: "all",
                                                minRating: 0,
                                                travelMonth: "all"
                                            });
                        setActiveCategory("all");
                        showToast('Filters reset', { type: 'info' });
                                        }}
                                        className="btn-safari mt-4"
                                    >
                                        Reset All Filters
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Booking Modal */}
                        <BookingModal
                            tour={selectedTour}
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                        />

                        {/* Empty State */}
                        {filteredTours.length === 0 && (
                            <div className="text-center py-16">
                                <div className="max-w-md mx-auto">
                                    <p className="text-muted-foreground text-lg mb-6">
                                        We couldn&apos;t find any tours matching your current filters. Try adjusting your criteria or explore all our packages.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setFilters({
                                                category: "all",
                                                minPrice: 0,
                                                maxPrice: 10000,
                                                duration: "all",
                                                destination: "all",
                                                difficulty: "all",
                                                minRating: 0,
                                                travelMonth: "all"
                                            });
                                            setActiveCategory("all");
                                        }}
                                        className="btn-safari"
                                    >
                                        Reset All Filters
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Best Time to Visit Section - Redesigned */}
            <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background via-muted/20 to-background">
                <div className="container px-4 md:px-6">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                            Plan Your Perfect Safari
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            Best Time to Visit Tanzania
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Choose a month to discover weather patterns, wildlife highlights, and the best experiences for your safari
                        </p>
                    </div>

                    {/* Month Buttons Grid - Responsive */}
                    <div className="max-w-5xl mx-auto mb-8">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 md:gap-3">
                            {Object.keys(monthData).map((month, index) => (
                                <button
                                    key={month}
                                    onClick={() => setSelectedMonth(selectedMonth === month ? null : month)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setSelectedMonth(selectedMonth === month ? null : month);
                                        }
                                    }}
                                    aria-pressed={selectedMonth === month}
                                    aria-label={`${month} - ${monthData[month].season}`}
                                    className={`relative group px-3 py-3 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-semibold border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${selectedMonth === month
                                        ? 'bg-primary text-white border-primary shadow-lg scale-105 z-10'
                                        : 'bg-card text-foreground border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 hover:shadow-md'
                                        }`}
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    {/* Active indicator dot */}
                                    {selectedMonth === month && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-white animate-pulse" />
                                    )}
                                    <span className="block">{month}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Seasonal Details Panel - Animated */}
                    <div className="max-w-4xl mx-auto min-h-[300px]">
                        {selectedMonth ? (
                            <div
                                key={selectedMonth}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                            >
                                <div className="bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
                                    {/* Panel Header with Gradient */}
                                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6 md:p-8 border-b border-border/50">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Calendar className="w-6 h-6 text-primary flex-shrink-0" />
                                                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                                                        {selectedMonth}
                                                    </h3>
                                                </div>
                                                <p className="text-base md:text-lg text-primary font-semibold">
                                                    {monthData[selectedMonth].season}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedMonth(null)}
                                                className="flex-shrink-0 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                                                aria-label="Close seasonal details"
                                            >
                                                View All Seasons
                                            </button>
                                        </div>
                                    </div>

                                    {/* Panel Content Grid */}
                                    <div className="p-6 md:p-8">
                                        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                                            {/* Left Column */}
                                            <div className="space-y-6">
                                                <div className="group">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Weather</p>
                                                    </div>
                                                    <p className="text-sm md:text-base font-semibold text-foreground pl-10">{monthData[selectedMonth].weather}</p>
                                                </div>

                                                <div className="group">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Crowd Level</p>
                                                    </div>
                                                    <p className="text-sm md:text-base font-semibold text-foreground pl-10">{monthData[selectedMonth].crowd}</p>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="space-y-6">
                                                <div className="group">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Safari Quality</p>
                                                    </div>
                                                    <p className="text-sm md:text-base font-semibold text-foreground pl-10">{monthData[selectedMonth].quality}</p>
                                                </div>

                                                <div className="group">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Best For</p>
                                                    </div>
                                                    <p className="text-sm md:text-base font-semibold text-foreground pl-10">{monthData[selectedMonth].bestFor}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="mt-8 pt-6 border-t border-border/50">
                                            <Button className="btn-safari w-full sm:w-auto" nativeButton={false} render={<Link href="/contact" className="flex items-center justify-center gap-2" />}>
                                                <span>Plan Your Safari in {selectedMonth}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Default State - Season Overview Cards */
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                                {[
                                    {
                                        iconName: "Sun",
                                        title: "Dry Season",
                                        period: "June - October",
                                        description: "Peak wildlife viewing with animals gathering around water sources. Best for the Great Migration river crossings.",
                                        color: "from-amber-500/10 to-orange-500/10",
                                        borderColor: "border-amber-500/30"
                                    },
                                    {
                                        iconName: "PawPrint",
                                        title: "Green Season",
                                        period: "November - May",
                                        description: "Lush landscapes, excellent bird watching, and fewer crowds. Perfect for photography and budget travelers.",
                                        color: "from-green-500/10 to-emerald-500/10",
                                        borderColor: "border-green-500/30"
                                    },
                                    {
                                        iconName: "PawPrint",
                                        title: "Calving Season",
                                        period: "January - February",
                                        description: "Witness thousands of wildebeest calves being born in the Southern Serengeti. Predator action at its peak.",
                                        color: "from-primary/10 to-primary-light/10",
                                        borderColor: "border-primary/30"
                                    }
                                ].map((season, idx) => {
                                    const IconComponent = season.iconName === "Sun" ? Sun : PawPrint;
                                    return (
                                        <div
                                            key={idx}
                                            className={`bg-gradient-to-br ${season.color} rounded-xl p-6 border ${season.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                                        >
                                            <div className="mb-4">
                                                <IconComponent className="w-10 h-10 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 text-foreground">{season.title}</h3>
                                            <p className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">{season.period}</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{season.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Planning Section - Redesigned */}
            <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background via-muted/20 to-background">
                <div className="container px-4 md:px-6">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                            How It Works
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            Your Safari Planning Journey
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            From your initial inquiry to your unforgettable African adventure, we guide you every step of the way
                        </p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                        {/* Left Column - Steps */}
                        <div className="space-y-4 md:space-y-5 order-2 lg:order-1">
                            {[
                                { step: "01", title: "Free Consultation", desc: "Share your dream safari with our experts. We'll listen to your preferences, budget, and travel dates.", icon: MessageCircle },
                                { step: "02", title: "Custom Itinerary", desc: "Receive a personalized safari plan crafted just for you, with handpicked accommodations and experiences.", icon: Map },
                                { step: "03", title: "Secure Booking", desc: "Confirm your adventure with our easy booking process. Flexible payment plans available.", icon: Ticket },
                                { step: "04", title: "Preparation Support", desc: "Get comprehensive pre-departure guidance including packing lists, visa info, and health recommendations.", icon: ClipboardList },
                                { step: "05", title: "Unforgettable Experience", desc: "Embark on your dream safari with 24/7 on-ground support from our local team.", icon: Compass }
                            ].map((item, index) => (
                                <div
                                    key={item.step}
                                    className="group flex items-start gap-4 md:gap-5 p-5 md:p-6 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                                >
                                    {/* Step Number & Icon */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                                            <span className="text-xl md:text-2xl font-bold text-primary">{item.step}</span>
                                        </div>
                                        {/* Connector Line (except last item) */}
                                        {index < 4 && (
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-4 md:h-6 bg-gradient-to-b from-primary/30 to-transparent hidden md:block" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pt-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <item.icon className="w-6 h-6 text-primary flex-shrink-0" />
                                            <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Column - Image & CTA Card (Integrated Design) */}
                        <div className="order-1 lg:order-2">
                            {/* Unified Container - Creates Visual Connection */}
                            <div className="relative bg-gradient-to-b from-muted/30 to-background rounded-2xl p-4 md:p-6 lg:p-8">
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-xl overflow-hidden bg-muted shadow-lg group">
                                    <Image
                                        src="/images/general/planning-safari.jpg"
                                        alt="Safari planning consultation"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        priority={false}
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-60" />

                                    {/* Subtle badge on image */}
                                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md">
                                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">Expert Guidance</span>
                                    </div>
                                </div>

                                {/* CTA Card - Overlapping Design */}
                                <div className="relative -mt-12 md:-mt-14 lg:-mt-16 mx-2 md:mx-4 bg-card rounded-xl shadow-2xl border border-border/50 p-6 md:p-7 lg:p-8 z-10 hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
                                    {/* Decorative accent line */}
                                    <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-primary via-primary-light to-accent rounded-b-full opacity-80" />

                                    {/* Icon & Title */}
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <CheckCircle className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 leading-tight">
                                                Free Expert Consultation
                                            </h3>
                                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                                Our safari specialists have decades of combined experience and will help you design the perfect adventure
                                            </p>
                                        </div>
                                    </div>

                                    {/* CTA Button - Enhanced */}
                                    <Button className="btn-safari w-full" nativeButton={false} render={<Link href="/contact" className="flex items-center justify-center gap-2" />}>
                                        <span>Start Your Safari Journey</span>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Button>

                                    {/* Trust indicators */}
                                    <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/30">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                            <span>No Obligation</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                            <span>Expert Advice</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What to Pack Section */}
            <section className="bg-secondary/30 py-16 md:py-20">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Essential Safari Packing List</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Be prepared for your African adventure with our comprehensive packing guide
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Shirt, title: "Clothing", items: ["Lightweight, breathable fabrics", "Neutral colors (khaki, olive, beige)", "Warm layers for morning drives", "Wide-brimmed hat", "Comfortable walking shoes"] },
                            { icon: Camera, title: "Equipment", items: ["Binoculars (8x42 recommended)", "Camera with zoom lens", "Extra memory cards & batteries", "Power bank & adapters", "Flashlight/headlamp"] },
                            { icon: Pill, title: "Health & Safety", items: ["Prescription medications", "Malaria prophylaxis", "High SPF sunscreen", "Insect repellent (DEET)", "Basic first aid kit"] },
                            { icon: FileText, title: "Documents", items: ["Valid passport (6+ months)", "Tanzania visa", "Travel insurance", "Vaccination certificates", "Flight confirmations"] }
                        ].map((category, idx) => (
                            <div key={idx} className="bg-card rounded-xl p-6 border border-border/50">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <category.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-4">{category.title}</h3>
                                <ul className="space-y-2">
                                    {category.items.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container py-16">
                <div className="relative overflow-hidden bg-primary rounded-3xl p-12 md:p-16 text-white">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Ready to Start Your Safari Adventure?</h2>
                        <p className="text-lg md:text-xl mb-8 opacity-90">
                            Let our experts create your perfect Tanzanian experience with personalized itineraries and unbeatable value
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-primary hover:bg-white/90" nativeButton={false} render={<Link href="/contact" className="inline-flex items-center" />}>
                                Start Planning Today
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" nativeButton={false} render={<Link href="/about" className="inline-flex items-center" />}>
                                Learn More About Us
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tour Comparison Bar */}
            <ComparisonBar
                tours={compareTours}
                onRemoveTour={removeTour}
                onClearAll={clearAll}
            />
        </>
    );
}
