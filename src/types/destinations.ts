export interface Wildlife {
    name: string;
    category: "Big Five" | "Predators" | "Herbivores" | "Primates" | "Birds" | "Unique";
    icon: string;
    description: string;
}

export interface Activity {
    name: string;
    description: string;
    duration: string;
    difficulty: "Easy" | "Moderate" | "Challenging";
    bestTime: string;
}

export interface DestinationAccommodation {
    name: string;
    type: "Luxury" | "Mid-Range" | "Budget" | "Camping";
    description: string;
    priceRange: string;
    features: string[];
}

export interface Itinerary {
    title: string;
    duration: string;
    days: { day: number; title: string; description: string }[];
}

export interface TravelTip {
    category: string;
    tips: string[];
}

export interface DestinationFAQ {
    question: string;
    answer: string;
}

export interface Destination {
    id: string;
    name: string;
    slug: string;
    region: string;
    shortDescription: string;
    whyVisit: string;
    fullDescription: string;
    parkSize: string;
    elevation: string;
    established: string;
    nearestAirport: string;
    distanceFromArusha?: string;
    distanceFromDarEsSalaam?: string;
    recommendedStay: string;
    bigFive: string[];
    keySpecies: string[];
    birdWatching: boolean;
    uniqueSpecies: string[];
    wildlifeRating: number;
    bestTimeToGo: string[];
    peakSeason: string;
    lowSeason: string;
    monthlyBreakdown: { month: string; wildlife: string; weather: string; rating: number }[];
    activities: Activity[];
    highlights: string[];
    landscape: string;
    ecosystems: string[];
    wildlife?: Wildlife[];
    accommodations: DestinationAccommodation[];
    sampleItineraries?: Itinerary[];
    suggestedItineraries?: string;
    gettingThere: { byAir: string; byRoad: string; transferTime: string };
    conservation: string;
    communityInitiatives?: string;
    culturalContext?: string;
    travelTips: TravelTip[];
    faqs: DestinationFAQ[];
    imageUrl: string;
    gallery: string[];
    relatedDestinations?: string[];
    localTribes?: string[];
    metaTitle?: string;
    metaDescription?: string;
}
