import { PawPrint, Bird } from "lucide-react";
import { Star } from "lucide-react";

interface WildlifeGridProps {
    bigFive: string[];
    keySpecies: string[];
    uniqueSpecies: string[];
    birdWatching: boolean;
    wildlifeRating: number;
}

export default function WildlifeGrid({
    bigFive,
    keySpecies,
    uniqueSpecies,
    birdWatching,
    wildlifeRating
}: WildlifeGridProps) {
    return (
        <div className="space-y-8">
            {/* Wildlife Rating */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Wildlife Viewing Quality</h3>
                        <p className="text-sm text-muted-foreground">Based on diversity, abundance, and sighting probability</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                        className={`h-6 w-6 ${i < wildlifeRating ? 'fill-current text-brand-gold' : 'text-muted'}`}
                            />
                        ))}
                        <span className="ml-2 text-2xl font-bold text-foreground">{wildlifeRating}/5</span>
                    </div>
                </div>
            </div>

            {/* Big Five */}
            {bigFive.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <PawPrint className="w-6 h-6 text-primary" />
                        The Big Five
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {bigFive.map((animal, index) => (
                            <div
                                key={index}
                                className="bg-card border border-border/50 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                            >
                                <PawPrint className="w-8 h-8 text-primary mx-auto mb-2" />
                                <p className="font-semibold text-foreground text-sm">{animal}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Key Species */}
            {keySpecies.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-foreground mb-4">Key Species</h3>
                    <div className="flex flex-wrap gap-3">
                        {keySpecies.map((species, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                            >
                                {species}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Unique Species */}
            {uniqueSpecies.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-foreground mb-4">Unique & Endemic Species</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uniqueSpecies.map((species, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 bg-muted/50 rounded-lg p-4"
                            >
                                <Star className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-foreground text-sm">{species}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bird Watching */}
            {birdWatching && (
                <div className="tone-info rounded-xl border p-6">
                    <div className="flex items-center gap-3">
                        <Bird className="h-8 w-8" />
                        <div>
                            <h3 className="font-bold text-foreground mb-1">Excellent Bird Watching</h3>
                            <p className="text-sm text-muted-foreground">This destination is a paradise for bird enthusiasts with diverse species year-round</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
