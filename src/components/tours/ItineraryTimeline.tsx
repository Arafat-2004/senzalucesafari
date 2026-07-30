"use client";

import { useState } from "react";
import { Moon, ChevronDown, ChevronUp } from "lucide-react";
import type { DayItinerary } from "@/data/tours";
import { Button } from "@/components/ui/button";

interface ItineraryTimelineProps {
    itinerary: DayItinerary[];
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
    // Expand first day by default
    const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(() => {
        const initial: Record<number, boolean> = {};
        if (itinerary.length > 0) {
            initial[itinerary[0].day] = true;
        }
        return initial;
    });

    const toggleDay = (dayNum: number) => {
        setExpandedDays(prev => ({
            ...prev,
            [dayNum]: !prev[dayNum]
        }));
    };

    const expandAll = () => {
        const nextState: Record<number, boolean> = {};
        itinerary.forEach(d => {
            nextState[d.day] = true;
        });
        setExpandedDays(nextState);
    };

    const collapseAll = () => {
        setExpandedDays({});
    };

    const allExpanded = itinerary.every(d => expandedDays[d.day]);

    return (
        <div className="space-y-4">
            {/* Expand / Collapse Controls */}
            <div className="flex justify-end gap-2 mb-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs gap-1.5"
                    onClick={allExpanded ? collapseAll : expandAll}
                >
                    {allExpanded ? (
                        <>
                            <span>Collapse All</span>
                        </>
                    ) : (
                        <>
                            <span>Expand All</span>
                        </>
                    )}
                </Button>
            </div>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-2 bottom-2 w-0.5 bg-primary/20 hidden md:block" />

                <div className="space-y-4">
                    {itinerary.map((day) => {
                        const isExpanded = !!expandedDays[day.day];
                        return (
                            <div key={day.day} className="relative">
                                {/* Timeline Dot */}
                                <div className={`absolute left-6 w-4 h-4 rounded-full border-4 border-background hidden md:block transition-all ${isExpanded ? 'bg-primary scale-110' : 'bg-muted'}`} />

                                {/* Day Card */}
                                <div className="md:pl-20">
                                    <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-md transition-all">
                                        {/* Day Header - Clickable */}
                                        <button
                                            onClick={() => toggleDay(day.day)}
                                            className="w-full flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/5 px-6 py-4 border-b border-border/50 text-left hover:from-primary/15 transition-all"
                                            aria-expanded={isExpanded}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${isExpanded ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                                    {day.day}
                                                </span>
                                                <h3 className="font-bold text-base md:text-lg text-foreground line-clamp-1">{day.title}</h3>
                                            </div>
                                            <div className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Day Content - Collapsible */}
                                        {isExpanded && (
                                            <div className="p-6 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                                    {day.description}
                                                </p>

                                                {/* Overnight Info */}
                                                {day.overnight && (
                                                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                                                        <Moon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-1">Overnight Accommodation</p>
                                                            <p className="text-sm text-muted-foreground">{day.overnight}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
