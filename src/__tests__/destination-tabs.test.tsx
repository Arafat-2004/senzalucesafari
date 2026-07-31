import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DestinationTabsClient from '@/components/destinations/DestinationTabsClient';
import { Destination } from '@/types/destinations';

const mockGet = jest.fn();

jest.mock('next/navigation', () => ({
    useSearchParams: () => ({
        get: mockGet,
    }),
}));

const mockDestination: Destination = {
    id: "serengeti-national-park",
    name: "Serengeti National Park",
    slug: "serengeti-national-park",
    region: "Northern Circuit, Tanzania",
    shortDescription: "World-famous national park",
    whyVisit: "Witness the Great Migration and world-class predator action.",
    fullDescription: "Serengeti National Park is a vast ecosystem in East Africa.\n\nIt spans over 14,750 square kilometers.",
    parkSize: "14,763 km²",
    elevation: "920m - 1,850m",
    established: "1951",
    recommendedStay: "3 - 5 Days",
    nearestAirport: "Seronera Airstrip (SEU)",
    bigFive: ["Lion", "Leopard", "Elephant", "Rhino", "Buffalo"],
    keySpecies: ["Cheetah", "Wildebeest", "Zebra", "Giraffe"],
    birdWatching: true,
    uniqueSpecies: ["Kori Bustard", "Secretary Bird"],
    wildlifeRating: 5,
    bestTimeToGo: ["June to October", "December to March"],
    peakSeason: "June to October (Great Migration & Dry Season)",
    lowSeason: "April to May (Heavy Rains)",
    monthlyBreakdown: [
        { month: "January", wildlife: "Calving season", weather: "Warm and dry", rating: 5 },
    ],
    activities: [
        { name: "Game Drive", description: "Classic safari experience", duration: "Full Day", difficulty: "Easy", bestTime: "Year-round" }
    ],
    highlights: ["The Great Migration", "Endless Savanna Plains"],
    landscape: "Savanna, grasslands, riverine forest",
    ecosystems: ["Grassland", "Woodland"],
    accommodations: [
        { name: "Serengeti Safari Lodge", type: "Luxury", description: "Five-star lodge", priceRange: "$$$$", features: ["Pool", "Wifi"] }
    ],
    sampleItineraries: [
        { title: "3-Day Serengeti Express", duration: "3 Days", days: [{ day: 1, title: "Arrival", description: "Game drive on arrival" }] }
    ],
    gettingThere: { byAir: "Fly to Seronera", byRoad: "Drive from Arusha", transferTime: "6 hours drive or 1 hour flight" },
    conservation: "Anti-poaching patrols",
    travelTips: [
        { category: "Packing", tips: ["Bring binoculars", "Neutral color clothing"] }
    ],
    faqs: [
        { question: "When is the best time to see the migration?", answer: "July to October for river crossings." }
    ],
    imageUrl: "/images/destinations/serengeti.jpg",
    gallery: ["/images/destinations/serengeti-1.jpg"],
};

describe('DestinationTabsClient Component', () => {
    beforeEach(() => {
        mockGet.mockReturnValue(null);
        window.history.replaceState = jest.fn();
    });

    test('renders all 7 defined tab buttons and activates Overview by default', () => {
        render(
            <DestinationTabsClient
                destination={mockDestination}
                relatedToursNode={<div data-testid="related-tours">Related Tours</div>}
                relatedDestinationsNode={<div data-testid="related-destinations">Related Destinations</div>}
            />
        );

        expect(screen.getByRole('tab', { name: /Overview/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Wildlife/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Experiences/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Best Time to Visit/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Accommodations/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Itineraries/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Travel Info/i })).toBeInTheDocument();

        // Overview tab content should be visible by default
        expect(screen.getByText('Witness the Great Migration and world-class predator action.')).toBeInTheDocument();
        expect(screen.getByText('Quick Stats Summary')).toBeInTheDocument();
    });

    test('switches tabs and updates URL search params on tab click', () => {
        render(
            <DestinationTabsClient
                destination={mockDestination}
                relatedToursNode={<div data-testid="related-tours">Related Tours</div>}
                relatedDestinationsNode={<div data-testid="related-destinations">Related Destinations</div>}
            />
        );

        const wildlifeTab = screen.getByRole('tab', { name: /Wildlife/i });
        fireEvent.click(wildlifeTab);

        expect(window.history.replaceState).toHaveBeenCalledWith(
            null,
            "",
            expect.stringContaining("?tab=wildlife")
        );

        expect(screen.getByText("Wildlife & Biodiversity")).toBeInTheDocument();
    });

    test('initializes active tab from URL query param tab=experiences', () => {
        mockGet.mockReturnValue('experiences');

        render(
            <DestinationTabsClient
                destination={mockDestination}
                relatedToursNode={<div data-testid="related-tours">Related Tours</div>}
                relatedDestinationsNode={<div data-testid="related-destinations">Related Destinations</div>}
            />
        );

        expect(screen.getByText("Experiences & Activities")).toBeInTheDocument();
        expect(screen.getByText("Classic safari experience")).toBeInTheDocument();
    });
});
