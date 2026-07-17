"use client";

import { useState } from "react";
import { Filter, X, ChevronDown, DollarSign, Clock, MapPin, Target, Smile, Dumbbell, Flame, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RangeSlider } from "@/components/ui/range-slider";

interface SidebarFilterProps {
    onFilterChange: (filters: FilterState) => void;
    isOpen: boolean;
    onClose: () => void;
}

export interface FilterState {
    category: string;
    minPrice: number;
    maxPrice: number;
    duration: string;
    destination: string;
    difficulty: string;
    minRating: number;
    travelMonth: string;
}

const defaultFilters: FilterState = {
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    duration: "all",
    destination: "all",
    difficulty: "all",
    minRating: 0,
    travelMonth: "all"
};

export function SidebarFilter({ onFilterChange, isOpen, onClose }: SidebarFilterProps) {
    const [filters, setFilters] = useState<FilterState>(defaultFilters);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        category: true,
        price: true,
        duration: true,
        destination: true,
        difficulty: true,
        rating: true,
        travelMonth: false
    });

    const categories = [
        { id: "all", label: "All Safaris", count: 33 },
        { id: "Wildlife Safari", label: "Wildlife Safari", count: 15 },
        { id: "Safari & Beach", label: "Safari & Beach", count: 7 },
        { id: "Trekking", label: "Trekking & Adventure", count: 5 },
        { id: "Beach Holiday", label: "Beach Holiday", count: 3 },
        { id: "Luxury Safari", label: "Luxury Safari", count: 3 }
    ];

    const durations = [
        { id: "all", label: "Any Duration", count: 33 },
        { id: "1-3", label: "1-3 Days", count: 8 },
        { id: "4-6", label: "4-6 Days", count: 14 },
        { id: "7-9", label: "7-9 Days", count: 7 },
        { id: "10+", label: "10+ Days", count: 4 }
    ];

    const destinations = [
        { id: "all", label: "All Destinations", count: 33 },
        { id: "serengeti", label: "Serengeti", count: 22 },
        { id: "ngorongoro", label: "Ngorongoro Crater", count: 18 },
        { id: "tarangire", label: "Tarangire", count: 13 },
        { id: "zanzibar", label: "Zanzibar", count: 10 },
        { id: "manyara", label: "Lake Manyara", count: 11 },
        { id: "kilimanjaro", label: "Mount Kilimanjaro", count: 5 }
    ];

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const updateFilter = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    const hasActiveFilters =
        filters.category !== "all" ||
        filters.minPrice > 0 ||
        filters.maxPrice < 10000 ||
        filters.duration !== "all" ||
        filters.destination !== "all" ||
        filters.difficulty !== "all" ||
        filters.minRating > 0 ||
        filters.travelMonth !== "all";

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:relative top-0 left-0 h-full lg:h-auto w-80 lg:w-72 bg-card border-r border-border/50 
                    transform transition-transform duration-300 ease-in-out z-50 lg:z-0 overflow-y-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Filters</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 hover:bg-secondary rounded-full transition-colors"
                            aria-label="Close filters"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Reset Filters */}
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                            className="w-full mb-6 text-sm"
                        >
                            Reset All Filters
                        </Button>
                    )}

                    {/* Category Filter */}
                    <div className="mb-6">
                        <button
                            onClick={() => toggleSection('category')}
                            className="w-full flex items-center justify-between mb-3 hover:text-primary transition-colors"
                        >
                            <span className="font-semibold text-base">Category</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {expandedSections.category && (
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <label
                                        key={cat.id}
                                        className="flex items-center justify-between cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="category"
                                                defaultChecked={filters.category === cat.id}
                                                onChange={() => updateFilter('category', cat.id)}
                                                className="w-4 h-4 text-primary border-border focus:ring-primary"
                                            />
                                            <span className="text-sm group-hover:text-primary transition-colors">
                                                {cat.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">({cat.count})</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-6">
                        <button
                            onClick={() => toggleSection('price')}
                            className="w-full flex items-center justify-between mb-3 hover:text-primary transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold text-base">Price Range</span>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {expandedSections.price && (
                            <div className="space-y-4 pt-1">
                                <RangeSlider
                                    min={0}
                                    max={10000}
                                    step={50}
                                    value={[filters.minPrice, filters.maxPrice]}
                                    onChange={([minPrice, maxPrice]) => {
                                        updateFilter('minPrice', minPrice);
                                        updateFilter('maxPrice', maxPrice);
                                    }}
                                    formatLabel={(v) => `$${v.toLocaleString()}`}
                                />
                            </div>
                        )}
                    </div>

                    {/* Duration Filter */}
                    <div className="mb-6">
                        <button
                            onClick={() => toggleSection('duration')}
                            className="w-full flex items-center justify-between mb-3 hover:text-primary transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="font-semibold text-base">Duration</span>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.duration ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {expandedSections.duration && (
                            <div className="space-y-2">
                                {durations.map(dur => (
                                    <label
                                        key={dur.id}
                                        className="flex items-center justify-between cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="duration"
                                                defaultChecked={filters.duration === dur.id}
                                                onChange={() => updateFilter('duration', dur.id)}
                                                className="w-4 h-4 text-primary border-border focus:ring-primary"
                                            />
                                            <span className="text-sm group-hover:text-primary transition-colors">
                                                {dur.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">({dur.count})</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Destination Filter */}
                    <div className="mb-6">
                        <button
                            onClick={() => toggleSection('destination')}
                            className="w-full flex items-center justify-between mb-3 hover:text-primary transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span className="font-semibold text-base">Destination</span>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.destination ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {expandedSections.destination && (
                            <div className="space-y-2">
                                {destinations.map(dest => (
                                    <label
                                        key={dest.id}
                                        className="flex items-center justify-between cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="destination"
                                                defaultChecked={filters.destination === dest.id}
                                                onChange={() => updateFilter('destination', dest.id)}
                                                className="w-4 h-4 text-primary border-border focus:ring-primary"
                                            />
                                            <span className="text-sm group-hover:text-primary transition-colors">
                                                {dest.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">({dest.count})</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Difficulty Level Filter */}
                    <div className="mb-6">
                        <button
                            onClick={() => toggleSection('difficulty')}
                            className="w-full flex items-center justify-between mb-3 hover:text-primary transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="font-semibold text-base">Difficulty</span>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.difficulty ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {expandedSections.difficulty && (
                            <div className="space-y-2">
                                {[
                                    { id: "all", label: "Any Level", icon: Target },
                                    { id: "easy", label: "Easy", icon: Smile },
                                    { id: "moderate", label: "Moderate", icon: Dumbbell },
                                    { id: "challenging", label: "Challenging", icon: Flame },
                                    { id: "strenuous", label: "Strenuous", icon: Zap }
                                ].map(diff => {
                                    const IconComponent = diff.icon;
                                    return (
                                        <label
                                            key={diff.id}
                                            className="flex items-center justify-between cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="difficulty"
                                                    defaultChecked={filters.difficulty === diff.id}
                                                    onChange={() => updateFilter('difficulty', diff.id)}
                                                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                                                />
                                                <span className="text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                                                    <IconComponent className="w-4 h-4" />
                                                    {diff.label}
                                                </span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Minimum Rating Filter */}
                    <div className="mb-6">
                        <button
                            onClick={() => toggleSection('rating')}
                            className="w-full flex items-center justify-between mb-3 hover:text-primary transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-semibold text-base">Minimum Rating</span>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {expandedSections.rating && (
                            <div className="space-y-2">
                                {[
                                    { rating: 0, label: "All Ratings" },
                                    { rating: 7, label: "7+ Good" },
                                    { rating: 8, label: "8+ Very Good" },
                                    { rating: 9, label: "9+ Excellent" },
                                    { rating: 9.5, label: "9.5+ Outstanding" }
                                ].map(option => (
                                    <label
                                        key={option.rating}
                                        className="flex items-center justify-between cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="minRating"
                                                defaultChecked={filters.minRating === option.rating}
                                                onChange={() => updateFilter('minRating', option.rating)}
                                                className="w-4 h-4 text-primary border-border focus:ring-primary"
                                            />
                                            <span className="text-sm group-hover:text-primary transition-colors">
                                                {option.label}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Travel Month Filter */}
                    <div className="mb-6">
                        <button
                            onClick={() => toggleSection('travelMonth')}
                            className="w-full flex items-center justify-between mb-3 hover:text-primary transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-semibold text-base">Travel Month</span>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.travelMonth ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {expandedSections.travelMonth && (
                            <div className="grid grid-cols-3 gap-2">
                                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => (
                                    <button
                                        key={month}
                                        onClick={() => updateFilter('travelMonth', filters.travelMonth === month ? "all" : month)}
                                        className={`px-2 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${filters.travelMonth === month
                                                ? 'bg-brand-green text-white border border-brand-green-dark shadow-sm'
                                                : 'bg-muted hover:bg-muted/80 text-muted-foreground border border-transparent'
                                            }`}
                                    >
                                        {filters.travelMonth === month && <Check className="w-3 h-3 text-white flex-shrink-0" />}
                                        <span>{month}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <div className="pt-6 border-t border-border/50">
                            <h3 className="text-sm font-semibold mb-3">Active Filters:</h3>
                            <div className="flex flex-wrap gap-2">
                                {filters.category !== "all" && (
                                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full">
                                        {categories.find(c => c.id === filters.category)?.label}
                                    </span>
                                )}
                                {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
                                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full">
                                        ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
                                    </span>
                                )}
                                {filters.duration !== "all" && (
                                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full">
                                        {durations.find(d => d.id === filters.duration)?.label}
                                    </span>
                                )}
                                {filters.destination !== "all" && (
                                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full">
                                        {destinations.find(d => d.id === filters.destination)?.label}
                                    </span>
                                )}
                                {filters.difficulty !== "all" && (
                                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full">
                                        {filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1)}
                                    </span>
                                )}
                                {filters.minRating > 0 && (
                                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full">
                                        {filters.minRating}+ Rating
                                    </span>
                                )}
                                {filters.travelMonth !== "all" && (
                                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full">
                                        {filters.travelMonth}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
