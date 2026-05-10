export interface AccommodationOption {
    id: string;
    name: string;
    tier: "luxury" | "midrange" | "budget" | "camping";
    location: string;
    description: string;
    priceRange: string;
    pricePerNight: string;
    rating: number;
    image: string;
    features: string[];
    amenities: string[];
    bestFor: string[];
    highlights: string[];
}
