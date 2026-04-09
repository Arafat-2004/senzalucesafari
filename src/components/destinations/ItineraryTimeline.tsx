import { Itinerary } from "@/data/destinations";
import { Calendar, MapPin } from "lucide-react";

interface ItineraryTimelineProps {
    itineraries: Itinerary[];
}

export default function ItineraryTimeline({ itineraries }: ItineraryTimelineProps) {
    if (!itineraries || itineraries.length === 0) return null;

    return (
        <div className="space-y-8">
            {itineraries.map((itinerary, idx) => (
                <div key={idx} className="bg-card border border-border/50 rounded-xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="w-6 h-6 text-primary" />
                        <div>
                            <h3 className="text-xl font-bold text-foreground">{itinerary.title}</h3>
                            <p className="text-sm text-muted-foreground">{itinerary.duration}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {itinerary.days.map((day, dayIdx) => (
                            <div key={dayIdx} className="relative pl-8 pb-6 last:pb-0">
                                {/* Timeline line */}
                                {dayIdx !== itinerary.days.length - 1 && (
                                    <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-border"></div>
                                )}

                                {/* Timeline dot */}
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                    {day.day}
                                </div>

                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        {day.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{day.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
