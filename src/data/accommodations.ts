export interface AccommodationOption {
    id: string;
    name: string;
    tier: "luxury" | "midrange" | "budget";
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

export const luxuryAccommodations: AccommodationOption[] = [
    {
        id: "four-seasons-serengeti",
        name: "Four Seasons Safari Lodge Serengeti",
        tier: "luxury",
        location: "Central Serengeti",
        description: "An ultra-luxurious lodge perched on a hillside overlooking the endless plains of the Serengeti. Features an infinity pool, world-class spa, and unparalleled wildlife viewing from your private terrace.",
        priceRange: "$1,500 - $3,000+ per night",
        pricePerNight: "From $1,500",
        rating: 5,
        image: "/images/destinations/serengeti.jpg",
        features: [
            "Private plunge pools in select suites",
            "Infinity pool with Serengeti views",
            "Award-winning spa and wellness center",
            "Gourmet dining with bush breakfast options",
            "Private game drives with expert guides",
            "24-hour butler service"
        ],
        amenities: [
            "Free WiFi",
            "Air conditioning",
            "Mini bar",
            "Laundry service",
            "Airport transfers",
            "Conference facilities"
        ],
        bestFor: ["Honeymoons", "Luxury seekers", "Special occasions", "Photography"],
        highlights: [
            "Panoramic views of watering hole",
            "Migration front-row seats (seasonal)",
            "Exclusive sundowner experiences",
            "Cultural Maasai village visits"
        ]
    },
    {
        id: "andbeyond-ngorongoro",
        name: "&Beyond Ngorongoro Crater Lodge",
        tier: "luxury",
        location: "Ngorongoro Crater Rim",
        description: "Often called 'Versailles of the Void', this opulent lodge offers baroque-style luxury on the crater rim. Each suite features antique furnishings, fireplace, and private balcony with crater views.",
        priceRange: "$1,800 - $3,500+ per night",
        pricePerNight: "From $1,800",
        rating: 5,
        image: "/images/destinations/ngorongoro.jpg",
        features: [
            "Butler and maid service for each suite",
            "Fireplace and heated floors",
            "Champagne breakfast on crater rim",
            "Private crater descents",
            "Maasai cultural experiences",
            "All-inclusive premium beverages"
        ],
        amenities: [
            "Heated bathrooms",
            "Premium toiletries",
            "Espresso machines",
            "Wine cellar",
            "Library lounge",
            "Gift shop"
        ],
        bestFor: ["Romantic getaways", "Ultimate luxury", "Crater exploration", "Cultural immersion"],
        highlights: [
            "Unmatched crater floor access",
            "Black rhino sightings guaranteed",
            "Sunrise crater descents",
            "Maasai warrior ceremonies"
        ]
    },
    {
        id: "singita-sasakwa",
        name: "Singita Sasakwa Lodge",
        tier: "luxury",
        location: "Grumeti Reserves, Western Serengeti",
        description: "An Edwardian manor house set on 350,000 acres of pristine wilderness. Combines colonial elegance with contemporary African style, offering exclusive safari experiences in a private concession.",
        priceRange: "$2,000 - $4,000+ per night",
        pricePerNight: "From $2,000",
        rating: 5,
        image: "/images/destinations/serengeti.jpg",
        features: [
            "Private 350,000-acre concession",
            "Manor house with period antiques",
            "Infinity pool overlooking plains",
            "Tennis court and fitness center",
            "Wine cellar with sommelier",
            "Helicopter safaris available"
        ],
        amenities: [
            "Spa treatments",
            "Yoga sessions",
            "Art gallery",
            "Boutique shopping",
            "Kids' program",
            "Private airstrip"
        ],
        bestFor: ["Exclusive safaris", "Wine enthusiasts", "Families", "Long stays"],
        highlights: [
            "Exclusive migration crossings",
            "Walking safaris with armed rangers",
            "Night game drives",
            "Conservation education programs"
        ]
    }
];

export const midrangeAccommodations: AccommodationOption[] = [
    {
        id: "serena-safari-lodge",
        name: "Serena Safari Lodge Serengeti",
        tier: "midrange",
        location: "Central Serengeti",
        description: "A beautifully designed stone lodge blending seamlessly into the kopje landscape. Offers comfortable rooms with private balconies, excellent dining, and reliable wildlife viewing year-round.",
        priceRange: "$400 - $700 per night",
        pricePerNight: "From $400",
        rating: 4.5,
        image: "/images/destinations/serengeti.jpg",
        features: [
            "Stone architecture mimicking natural kopjes",
            "Swimming pool with sunset views",
            "Multiple dining venues",
            "Curio shop and craft market",
            "Regular game drives included",
            "Cultural boma evenings"
        ],
        amenities: [
            "WiFi in common areas",
            "Restaurant and bar",
            "Room service",
            "Laundry facilities",
            "Gift shop",
            "Parking"
        ],
        bestFor: ["First-time safari goers", "Families", "Value-conscious travelers", "Groups"],
        highlights: [
            "Excellent central location",
            "Reliable Big Five sightings",
            "Great photography opportunities",
            "Authentic Maasai performances"
        ]
    },
    {
        id: "ngorongoro-sopa",
        name: "Ngorongoro Sopa Lodge",
        tier: "midrange",
        location: "Eastern Crater Rim, Ngorongoro",
        description: "Perched on the eastern rim of the crater, this circular lodge offers panoramic views and comfortable accommodations. Known for excellent service and convenient crater access.",
        priceRange: "$350 - $600 per night",
        pricePerNight: "From $350",
        rating: 4,
        image: "/images/destinations/ngorongoro.jpg",
        features: [
            "Circular design with crater views",
            "Large swimming pool",
            "Buffet and à la carte dining",
            "Early morning crater descents",
            "Maasai cultural visits",
            "Spacious family rooms"
        ],
        amenities: [
            "Free parking",
            "Restaurant",
            "Bar and lounge",
            "Conference room",
            "Souvenir shop",
            "24-hour reception"
        ],
        bestFor: ["Crater tours", "Families", "Budget-conscious luxury", "Photographers"],
        highlights: [
            "Sunrise crater views",
            "Easy crater floor access",
            "Comfortable rooms",
            "Good value for location"
        ]
    },
    {
        id: "tarangire-sopa",
        name: "Tarangire Sopa Lodge",
        tier: "midrange",
        location: "Tarangire National Park",
        description: "Built on a hillside overlooking Tarangire River valley, this lodge offers stunning views of elephant herds and baobab-dotted landscapes. Perfect base for exploring Tarangire's unique ecosystem.",
        priceRange: "$300 - $550 per night",
        pricePerNight: "From $300",
        rating: 4,
        image: "/images/destinations/tarangire.jpg",
        features: [
            "Elevated position with valley views",
            "Infinity pool overlooking park",
            "Traditional Tanzanian cuisine",
            "Night game drives available",
            "Walking safaris with guides",
            "Bird watching excursions"
        ],
        amenities: [
            "Swimming pool",
            "Restaurant",
            "Bar",
            "WiFi in lobby",
            "Laundry service",
            "Parking"
        ],
        bestFor: ["Elephant enthusiasts", "Bird watchers", "Dry season safaris", "Nature lovers"],
        highlights: [
            "Massive elephant herds",
            "Ancient baobab trees",
            "Over 550 bird species",
            "Less crowded than Serengeti"
        ]
    }
];

export const budgetAccommodations: AccommodationOption[] = [
    {
        id: "imperial-tented-camp",
        name: "Imperial Tented Camp Serengeti",
        tier: "budget",
        location: "Central Serengeti",
        description: "Comfortable tented accommodation offering an authentic safari experience without breaking the bank. Clean facilities, friendly staff, and excellent location for wildlife viewing.",
        priceRange: "$150 - $300 per night",
        pricePerNight: "From $150",
        rating: 3.5,
        image: "/images/destinations/serengeti.jpg",
        features: [
            "Spacious canvas tents with en-suite",
            "Communal dining area",
            "Campfire evenings",
            "Shared lounge area",
            "Basic game drives available",
            "Friendly, helpful staff"
        ],
        amenities: [
            "Hot showers",
            "Flush toilets",
            "Restaurant",
            "Bar",
            "Limited WiFi",
            "Secure parking"
        ],
        bestFor: ["Budget travelers", "Backpackers", "Students", "Adventure seekers"],
        highlights: [
            "Authentic camping experience",
            "Great value for money",
            "Social atmosphere",
            "Central Serengeti location"
        ]
    },
    {
        id: "manyara-tree-lodge-budget",
        name: "Lake Manyara Public Campsite",
        tier: "budget",
        location: "Lake Manyara National Park",
        description: "Basic but well-maintained campsite within the park boundaries. Perfect for self-drive adventurers and those seeking an affordable way to experience Lake Manyara's unique ecosystem.",
        priceRange: "$30 - $80 per night",
        pricePerNight: "From $30",
        rating: 3,
        image: "/images/destinations/lake-manyara.jpg",
        features: [
            "Designated camping plots",
            "Shared bathroom facilities",
            "Cooking areas provided",
            "Park entry included",
            "Self-drive friendly",
            "Peaceful lakeside setting"
        ],
        amenities: [
            "Public restrooms",
            "Water points",
            "Picnic tables",
            "Fire pits",
            "Ranger station nearby",
            "Basic security"
        ],
        bestFor: ["Self-drivers", "Camping enthusiasts", "Ultra-budget travelers", "Solo adventurers"],
        highlights: [
            "Inside the national park",
            "Tree-climbing lion territory",
            "Flamingo-filled lake views",
            "Very affordable"
        ]
    },
    {
        id: "serengeti-kati-kati",
        name: "Kati Kati Tented Camp",
        tier: "budget",
        location: "Mobile Camp - Serengeti",
        description: "A mobile tented camp that follows the Great Migration, offering budget-friendly access to prime wildlife viewing. Simple but comfortable with a genuine bush camp atmosphere.",
        priceRange: "$200 - $350 per night",
        pricePerNight: "From $200",
        rating: 4,
        image: "/images/destinations/serengeti.jpg",
        features: [
            "Mobile camp following migration",
            "En-suite canvas tents",
            "Bush dining under the stars",
            "Intimate small camp (max 16 guests)",
            "Experienced guide team",
            "Authentic safari experience"
        ],
        amenities: [
            "Solar lighting",
            "Bucket showers (hot water)",
            "Dining tent",
            "Lounge tent",
            "Limited charging stations",
            "No WiFi (digital detox)"
        ],
        bestFor: ["Migration chasers", "Authentic experience seekers", "Small groups", "Nature purists"],
        highlights: [
            "Front-row migration seats",
            "Intimate camp atmosphere",
            "Stargazing opportunities",
            "True bush camp feel"
        ]
    }
];

export const allAccommodations = [
    ...luxuryAccommodations,
    ...midrangeAccommodations,
    ...budgetAccommodations
];

export function getAccommodationsByTier(tier: "luxury" | "midrange" | "budget") {
    switch (tier) {
        case "luxury":
            return luxuryAccommodations;
        case "midrange":
            return midrangeAccommodations;
        case "budget":
            return budgetAccommodations;
        default:
            return [];
    }
}
