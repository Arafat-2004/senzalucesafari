export interface DayItinerary {
    day: number;
    title: string;
    description: string;
    overnight?: string;
    activities?: string[];
    meals?: string[];
    accommodation?: string;
}

export interface TourPackage {
    id: string;
    name: string;
    slug: string;
    category: string;
    shortDescription: string;
    overview: string;
    bestFor: string[];
    duration: string;
    startEnd: string;
    highlights: string[];
    itinerary: DayItinerary[];
    included: string[];
    excluded: string[];
    imageUrl: string;
    priceFrom: number;
    rating: number;
    reviewCount: number;
    destinations?: string[];
    difficulty?: string;
}

// Alias for backward compatibility
export type Tour = TourPackage;
