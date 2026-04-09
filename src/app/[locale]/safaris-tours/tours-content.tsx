"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';
import Image from "next/image";
import { tourPackages, TourPackage } from "@/data/tours";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, MapPin, Clock, Calendar, CheckCircle, Info, MessageCircle, Map, Ticket, ClipboardList, Compass, Shirt, Camera, Pill, FileText, Sun, PawPrint } from "lucide-react";
import { TourCard } from "@/components/ui/tour-card";
import { SidebarFilter, FilterState } from "@/components/ui/sidebar-filter";
import { BookingModal } from "@/components/ui/booking-modal";

export function ToursContent() {
    const t = useTranslations();
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
        destination: "all"
    });

    const categories = [
        { id: "all", label: t('tours.categories.all') },
        { id: "Wildlife Safari", label: t('tours.categories.wildlife') },
        { id: "Safari & Beach", label: t('tours.categories.safariBeach') },
        { id: "Trekking", label: t('tours.categories.trekking') },
        { id: "Beach Holiday", label: t('tours.categories.beach') },
        { id: "Luxury Safari", label: t('tours.categories.luxury') }
    ];

    const handleBookClick = (tour: TourPackage) => {
        setSelectedTour(tour);
        setIsModalOpen(true);
    };

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
    const filteredTours = tourPackages.filter(tour => {
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

        return true;
    });

    // Debug: Log filter state and results
    if (typeof window !== 'undefined') {
        console.log('🔍 Filter State:', filters);
        console.log('📦 Total Tours:', tourPackages.length);
        console.log('✅ Filtered Tours:', filteredTours.length);
        if (filteredTours.length === 0) {
            console.log('❌ No tours matching filters!');
            console.log('Sample tour category:', tourPackages[0]?.category);
            console.log('Filter category:', filters.category);
        }
    }

    return (
        <>
            {/* Introduction Section */}
            <section className="container py-12 md:py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('tours.intro.title')}</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {t('tours.intro.description')}
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
                        {t('tours.filters.button')}
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

                        {/* Results Count */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {t('tours.filters.showing')} <span className="font-semibold text-foreground">{filteredTours.length}</span> {t('tours.filters.packages')}
                                {process.env.NODE_ENV === 'development' && (
                                    <span className="ml-2 text-xs text-red-500">(Debug: Total={tourPackages.length}, Filter={filters.category})</span>
                                )}
                            </p>
                            {(filters.category !== "all" || filters.minPrice > 0 || filters.maxPrice < 10000 || filters.duration !== "all" || filters.destination !== "all") && (
                                <button
                                    onClick={() => {
                                        setFilters({
                                            category: "all",
                                            minPrice: 0,
                                            maxPrice: 10000,
                                            duration: "all",
                                            destination: "all"
                                        });
                                        setActiveCategory("all");
                                    }}
                                    className="text-xs text-primary hover:underline font-medium"
                                >
                                    {t('tours.filters.clearAll')}
                                </button>
                            )}
                        </div>

                        {/* Tours Grid */}
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredTours.length > 0 ? filteredTours.map((tour) => (
                                <TourCard
                                    key={tour.id}
                                    tour={tour}
                                    onBookClick={handleBookClick}
                                />
                            )) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-muted-foreground mb-2">No tours found with current filters</p>
                                    <p className="text-sm text-muted-foreground mb-4">Total tours in database: {tourPackages.length}</p>
                                    <p className="text-xs text-red-500">Filtered: {filteredTours.length} | Filter: {filters.category} | Price: ${filters.minPrice}-${filters.maxPrice}</p>
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
                                        {t('tours.filters.noResults')}
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setFilters({
                                                category: "all",
                                                minPrice: 0,
                                                maxPrice: 10000,
                                                duration: "all",
                                                destination: "all"
                                            });
                                            setActiveCategory("all");
                                        }}
                                        className="btn-safari"
                                    >
                                        {t('tours.filters.resetAll')}
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
                            {t('tours.bestTime.badge')}
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            {t('tours.bestTime.title')}
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            {t('tours.bestTime.description')}
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
                                    <span className="block">{t(`tours.bestTime.months.${month}`)}</span>
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
                                                        {t(`tours.bestTime.months.${selectedMonth}`)}
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
                                                {t('tours.bestTime.allSeasons')}
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
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('tours.bestTime.weather')}</p>
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
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('tours.bestTime.crowd')}</p>
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
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('tours.bestTime.quality')}</p>
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
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('tours.bestTime.bestFor')}</p>
                                                    </div>
                                                    <p className="text-sm md:text-base font-semibold text-foreground pl-10">{monthData[selectedMonth].bestFor}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="mt-8 pt-6 border-t border-border/50">
                                            <Button className="btn-safari w-full sm:w-auto min-h-[48px] text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300" nativeButton={false} render={<I18nLink href="/contact" className="flex items-center justify-center gap-2" />}>
                                                <span>{t('tours.bestTime.planButton', { month: selectedMonth })}</span>
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
                                        title: t('tours.seasons.dry.title'),
                                        period: t('tours.seasons.dry.period'),
                                        description: t('tours.seasons.dry.description'),
                                        color: "from-amber-500/10 to-orange-500/10",
                                        borderColor: "border-amber-500/30"
                                    },
                                    {
                                        iconName: "PawPrint",
                                        title: t('tours.seasons.green.title'),
                                        period: t('tours.seasons.green.period'),
                                        description: t('tours.seasons.green.description'),
                                        color: "from-green-500/10 to-emerald-500/10",
                                        borderColor: "border-green-500/30"
                                    },
                                    {
                                        iconName: "PawPrint",
                                        title: t('tours.seasons.calving.title'),
                                        period: t('tours.seasons.calving.period'),
                                        description: t('tours.seasons.calving.description'),
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
                            {t('tours.planning.badge')}
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            {t('tours.planning.title')}
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {t('tours.planning.description')}
                        </p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                        {/* Left Column - Steps */}
                        <div className="space-y-4 md:space-y-5 order-2 lg:order-1">
                            {[
                                { step: "01", title: t('tours.planning.steps.consultation.title'), desc: t('tours.planning.steps.consultation.desc'), icon: MessageCircle },
                                { step: "02", title: t('tours.planning.steps.itinerary.title'), desc: t('tours.planning.steps.itinerary.desc'), icon: Map },
                                { step: "03", title: t('tours.planning.steps.booking.title'), desc: t('tours.planning.steps.booking.desc'), icon: Ticket },
                                { step: "04", title: t('tours.planning.steps.preparation.title'), desc: t('tours.planning.steps.preparation.desc'), icon: ClipboardList },
                                { step: "05", title: t('tours.planning.steps.experience.title'), desc: t('tours.planning.steps.experience.desc'), icon: Compass }
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
                                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t('tours.planning.expertBadge')}</span>
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
                                                {t('tours.planning.freeConsultation.title')}
                                            </h3>
                                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                                {t('tours.planning.freeConsultation.description')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CTA Button - Enhanced */}
                                    <Button className="btn-safari w-full min-h-[52px] md:min-h-[56px] text-base md:text-lg font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary" nativeButton={false} render={<I18nLink href="/contact" className="flex items-center justify-center gap-2.5" />}>
                                        <span>{t('tours.planning.freeConsultation.button')}</span>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Button>

                                    {/* Trust indicators */}
                                    <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/30">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                            <span>{t('tours.planning.freeConsultation.noObligation')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                            <span>{t('tours.planning.freeConsultation.expertAdvice')}</span>
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('tours.packing.title')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('tours.packing.description')}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Shirt, title: t('tours.packing.categories.clothing.title'), items: t.raw('tours.packing.categories.clothing.items') },
                            { icon: Camera, title: t('tours.packing.categories.equipment.title'), items: t.raw('tours.packing.categories.equipment.items') },
                            { icon: Pill, title: t('tours.packing.categories.health.title'), items: t.raw('tours.packing.categories.health.items') },
                            { icon: FileText, title: t('tours.packing.categories.documents.title'), items: t.raw('tours.packing.categories.documents.items') }
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
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{t('tours.cta.title')}</h2>
                        <p className="text-lg md:text-xl mb-8 opacity-90">
                            {t('tours.cta.description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-safari text-base px-8" nativeButton={false} render={<I18nLink href="/contact" className="inline-flex items-center" />}>
                                {t('tours.cta.startPlanning')}
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-base px-8" nativeButton={false} render={<I18nLink href="/about" className="inline-flex items-center" />}>
                                {t('tours.cta.learnMore')}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
