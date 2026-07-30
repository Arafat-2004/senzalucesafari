"use client";

import { useState } from "react";
import { Itinerary } from "@/data/destinations";
import { Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItineraryTimelineProps {
    itineraries: Itinerary[];
}

export default function ItineraryTimeline({ itineraries }: ItineraryTimelineProps) {
    // Keep track of expanded days using format: "itineraryIdx-dayIdx"
    const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        if (itineraries && itineraries.length > 0) {
            itineraries.forEach((itin, itinIdx) => {
                if (itin.days && itin.days.length > 0) {
                    // Expand Day 1 of each itinerary by default
                    initial[`${itinIdx}-0`] = true;
                }
            });
        }
        return initial;
    });

    if (!itineraries || itineraries.length === 0) return <></>;

    const toggleDay = (itinIdx: number, dayIdx: number) => {
        const key = `${itinIdx}-${dayIdx}`;
        setExpandedDays(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="space-y-8">
            {itineraries.map((itinerary, itinIdx) => {
                const allExpanded = itinerary.days.every((_, dayIdx) => expandedDays[`${itinIdx}-${dayIdx}`]);
                
                const toggleAll = () => {
                    const nextState = { ...expandedDays };
                    itinerary.days.forEach((_, dayIdx) => {
                        nextState[`${itinIdx}-${dayIdx}`] = !allExpanded;
                    });
                    setExpandedDays(nextState);
                };

                return (
                    <div key={itinIdx} className="bg-card border border-border/50 rounded-xl p-5 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border/30 pb-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-primary" />
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">{itinerary.title}</h3>
                                    <p className="text-sm text-muted-foreground">{itinerary.duration}</p>
                                </div>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs font-semibold self-start sm:self-center"
                                onClick={toggleAll}
                            >
                                {allExpanded ? "Collapse All" : "Expand All"}
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {itinerary.days.map((day, dayIdx) => {
                                const isExpanded = !!expandedDays[`${itinIdx}-${dayIdx}`];
                                return (
                                    <div key={dayIdx} className="relative pl-8">
                                        {/* Timeline line */}
                                        {dayIdx !== itinerary.days.length - 1 && (
                                            <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-border"></div>
                                        )}

                                        {/* Timeline dot */}
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all ${isExpanded ? 'bg-primary scale-110' : 'bg-muted text-muted-foreground'}`}>
                                            {day.day}
                                        </div>

                                        <div className="bg-muted/50 rounded-lg overflow-hidden border border-border/20 transition-all">
                                            {/* Header toggle */}
                                            <button 
                                                onClick={() => toggleDay(itinIdx, dayIdx)}
                                                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
                                                aria-expanded={isExpanded}
                                            >
                                                <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm md:text-base">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    {day.title}
                                                </h4>
                                                <div className="text-muted-foreground">
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </div>
                                            </button>

                                            {/* Body content */}
                                            {isExpanded && (
                                                <div className="p-4 pt-0 border-t border-border/10 text-sm text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-1 duration-150">
                                                    {day.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
