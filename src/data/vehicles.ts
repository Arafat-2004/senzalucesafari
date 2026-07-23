export interface PublicVehicle {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    capacity: string;
    rating: number;
    reviews: number;
    priceRange: string;
    description: string;
    features: string[];
    bestFor: string[];
}

export const publicVehicles: PublicVehicle[] = [
    {
        id: "land-cruiser-vx",
        name: "Toyota Land Cruiser VX",
        category: "Luxury Safari Vehicle",
        imageUrl: "/images/vehicles/land-cruiser-vx.jpg",
        capacity: "6 passengers",
        rating: 5.0,
        reviews: 128,
        priceRange: "Premium",
        description: "Premium 4x4 safari vehicle with a pop-up roof, every-seat window access, cooling box, and charging points.",
        features: [
            "Pop-up roof for 360 degree game viewing",
            "Extended fuel tanks for remote areas",
            "Refrigerator for cold beverages",
            "Charging ports for cameras and devices",
            "Professional binoculars provided",
            "Field guide reference library"
        ],
        bestFor: ["Photography", "Luxury Travel", "Small Groups"]
    },
    {
        id: "land-cruiser-gx",
        name: "Toyota Land Cruiser GX",
        category: "Standard Safari Vehicle",
        imageUrl: "/images/vehicles/land-cruiser-gx.jpg",
        capacity: "6 passengers",
        rating: 4.8,
        reviews: 95,
        priceRange: "Standard",
        description: "Reliable 4x4 safari vehicle built for national parks, family safaris, and comfortable long-distance game drives.",
        features: [
            "Pop-up roof for wildlife viewing",
            "Extended fuel capacity",
            "Cooler box for refreshments",
            "USB charging points",
            "Comfortable safari seating",
            "Radio communication"
        ],
        bestFor: ["Value Seekers", "Families", "Adventure"]
    },
    {
        id: "safari-minivan",
        name: "Custom Safari Minivan",
        category: "Budget Safari Vehicle",
        imageUrl: "/images/vehicles/safari-minivan.jpg",
        capacity: "7 passengers",
        rating: 4.5,
        reviews: 67,
        priceRange: "Budget",
        description: "Cost-conscious safari vehicle for shorter routes, large groups, and travelers who want practical comfort.",
        features: [
            "Raised roof for standing view",
            "Large windows on all sides",
            "Air conditioning",
            "Guide commentary system",
            "Ample luggage space",
            "Budget-friendly pricing"
        ],
        bestFor: ["Budget Travel", "Large Groups", "Short Safaris"]
    },
    {
        id: "airport-transfer-sedan",
        name: "Comfort Transfer Sedan",
        category: "Transfer Vehicle",
        imageUrl: "/images/vehicles/transfer-sedan.jpg",
        capacity: "3 passengers",
        rating: 4.8,
        reviews: 120,
        priceRange: "Transfer Vehicle",
        description: "Comfortable private sedan for airport arrivals, departures, and city-to-hotel transfers.",
        features: ["Air conditioning", "Professional driver", "Luggage space", "Airport pickup", "Hotel drop-off"],
        bestFor: ["Airport Transfers", "Couples", "Solo Travelers"]
    },
    {
        id: "airport-transfer-minibus",
        name: "Safari Transfer Minibus",
        category: "Transfer Vehicle",
        imageUrl: "/images/vehicles/transfer-minibus.jpg",
        capacity: "10 passengers",
        rating: 4.9,
        reviews: 85,
        priceRange: "Transfer Vehicle",
        description: "Spacious transfer option for families, groups, and guests with additional luggage.",
        features: ["Air conditioning", "Group seating", "Large luggage space", "Professional driver", "Private route"],
        bestFor: ["Group Transfers", "Families", "Airport Transfers"]
    }
];
