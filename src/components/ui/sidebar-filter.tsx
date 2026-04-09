"use client";

import { useState } from "react";
import { Filter, X, ChevronDown, DollarSign, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

const defaultFilters: FilterState = {
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    duration: "all",
    destination: "all"
};

export function SidebarFilter({ onFilterChange, isOpen, onClose }: SidebarFilterProps) {
    const [filters, setFilters] = useState<FilterState>(defaultFilters);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        category: true,
        price: true,
        duration: true,
        destination: true
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

    const updateFilter = (key: keyof FilterState, value: any) => {
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
        filters.destination !== "all";

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
                                                checked={filters.category === cat.id}
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
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Min ($)</label>
                                        <input
                                            type="number"
                                            value={filters.minPrice}
                                            onChange={(e) => updateFilter('minPrice', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Max ($)</label>
                                        <input
                                            type="number"
                                            value={filters.maxPrice}
                                            onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value) || 10000)}
                                            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="10000"
                                        />
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Showing: ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
                                </div>
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
                                                checked={filters.duration === dur.id}
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
                                                checked={filters.destination === dest.id}
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
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
