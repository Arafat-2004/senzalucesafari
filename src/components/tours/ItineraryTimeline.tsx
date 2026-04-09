import { Clock, Moon } from "lucide-react";
import type { DayItinerary } from "@/data/tours";

interface ItineraryTimelineProps {
    itinerary: DayItinerary[];
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
    return (
        <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

            <div className="space-y-8">
                {itinerary.map((day, index) => (
                    <div key={day.day} className="relative">
                        {/* Timeline Dot */}
                        <div className="absolute left-6 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block" />

                        {/* Day Card */}
                        <div className="md:pl-20">
                            <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Day Header */}
                                <div className="bg-gradient-to-r from-primary/10 to-accent/5 px-6 py-4 border-b border-border/50">
                                    <div className="flex items-center gap-3">
                                        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                            {day.day}
                                        </span>
                                        <h3 className="font-bold text-xl text-foreground">{day.title}</h3>
                                    </div>
                                </div>

                                {/* Day Content */}
                                <div className="p-6">
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        {day.description}
                                    </p>

                                    {/* Overnight Info */}
                                    {day.overnight && (
                                        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                                            <Moon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold text-foreground mb-1">Overnight Accommodation</p>
                                                <p className="text-sm text-muted-foreground">{day.overnight}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
