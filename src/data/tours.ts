import type { TourPackage, DayItinerary } from '@/types/tours';
export type { TourPackage, DayItinerary };
export type Tour = TourPackage;

export const tourPackages: TourPackage[] = [
    {
        id: "5-days-wildlife",
        name: "5 Days Tanzania Wildlife Safari",
        slug: "5-days-wildlife",
        category: "Wildlife Safari",
        shortDescription: "A classic Northern Circuit safari covering Tarangire, Serengeti, and Ngorongoro",
        overview: "A classic Northern Circuit safari covering Tarangire, Serengeti, and Ngorongoro. Best for first-time visitors seeking a wildlife-focused experience.",
        bestFor: ["First-time visitors", "Wildlife focus"],
        duration: "5 days / 4 nights",
        startEnd: "Arusha",
        highlights: [
            "Big cats in Serengeti",
            "Ngorongoro Crater game drive",
            "Iconic baobabs + elephants in Tarangire"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arusha → Tarangire",
                description: "Game drive + picnic lunch",
                overnight: "Tarangire / Karatu"
            },
            {
                day: 2,
                title: "Tarangire → Serengeti",
                description: "Drive via Ngorongoro highlands. Afternoon game drive",
                overnight: "Serengeti"
            },
            {
                day: 3,
                title: "Serengeti (full day)",
                description: "Sunrise option + full-day game drive",
                overnight: "Serengeti"
            },
            {
                day: 4,
                title: "Serengeti → Ngorongoro / Karatu",
                description: "Morning game drive. Transfer to Karatu",
                overnight: "Karatu"
            },
            {
                day: 5,
                title: "Ngorongoro Crater → Arusha",
                description: "Crater descent + game drive. Return to Arusha",
                overnight: ""
            }
        ],
        included: [
            "Professional driver-guide",
            "Park fees",
            "Safari vehicle + fuel",
            "Meals as per itinerary",
            "Bottled water"
        ],
        excluded: [
            "International flights",
            "Visa + travel insurance",
            "Tips",
            "Alcoholic drinks"
        ],
        priceFrom: 2450,
        rating: 9.4,
        reviewCount: 87,
        imageUrl: "/images/destinations/serengeti/serengeti.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro"]
    },
    {
        id: "9-days-safari-zanzibar",
        name: "9 Days Safari + Zanzibar Beach Experience",
        slug: "9-days-safari-zanzibar",
        category: "Safari & Beach",
        shortDescription: "Combine Tanzania's top parks with a relaxing Zanzibar beach stay",
        overview: "Combine Tanzania's top parks with a relaxing Zanzibar beach stay. Perfect for travelers seeking both wildlife adventure and beach relaxation.",
        bestFor: ["Wildlife + beach", "Honeymoon", "Families"],
        duration: "9 days",
        startEnd: "Arusha • Zanzibar",
        highlights: [
            "Serengeti wildlife viewing",
            "Ngorongoro Crater",
            "Zanzibar white-sand beaches"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Arusha",
                description: "Welcome and transfer to hotel",
                overnight: "Arusha"
            },
            {
                day: 2,
                title: "Tarangire",
                description: "Full day game drive in Tarangire National Park",
                overnight: "Tarangire / Karatu"
            },
            {
                day: 3,
                title: "Serengeti",
                description: "Travel to Serengeti with en-route game viewing",
                overnight: "Serengeti"
            },
            {
                day: 4,
                title: "Serengeti",
                description: "Full day exploring Serengeti National Park",
                overnight: "Serengeti"
            },
            {
                day: 5,
                title: "Ngorongoro Crater",
                description: "Visit Ngorongoro Crater for game drive",
                overnight: "Karatu"
            },
            {
                day: 6,
                title: "Fly to Zanzibar",
                description: "Transfer to airport for flight to Zanzibar",
                overnight: "Zanzibar"
            },
            {
                day: 7,
                title: "Zanzibar leisure",
                description: "Relax on the beach. Optional spice tour or Stone Town visit",
                overnight: "Zanzibar"
            },
            {
                day: 8,
                title: "Zanzibar leisure",
                description: "Free day to enjoy the beach and water activities",
                overnight: "Zanzibar"
            },
            {
                day: 9,
                title: "Departure",
                description: "Transfer to airport for departure",
                overnight: ""
            }
        ],
        included: [
            "Safari vehicle + driver-guide",
            "Park fees (mainland)",
            "Domestic flight to Zanzibar (if included in your package)",
            "Meals + accommodations as per itinerary"
        ],
        excluded: [
            "International flights",
            "Visa + travel insurance",
            "Tips",
            "Optional activities"
        ],
        priceFrom: 4280,
        rating: 9.6,
        reviewCount: 124,
        imageUrl: "/images/destinations/zanzibar/zanzibar-beach.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro", "zanzibar"]
    },
    {
        id: "kilimanjaro-trekking",
        name: "Mount Kilimanjaro Trekking",
        slug: "kilimanjaro-trekking",
        category: "Trekking",
        shortDescription: "Climb Mount Kilimanjaro with experienced guides and strong safety standards",
        overview: "Climb Mount Kilimanjaro with experienced mountain guides and strong safety standards. Choose from multiple routes to suit your fitness and experience level.",
        bestFor: ["Adventure seekers", "Physical challenge", "Bucket list experience"],
        duration: "6-8 days (route dependent)",
        startEnd: "Arusha / Moshi",
        highlights: [
            "Summit Africa's highest peak",
            "Experienced mountain guides",
            "Multiple route options",
            "Strong safety standards"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arrival & Route Selection",
                description: "Choose your route: Machame, Marangu, Lemosho, or Rongai",
                overnight: "Arusha / Moshi"
            },
            {
                day: 2,
                title: "Begin Trek",
                description: "Start your ascent through diverse ecosystems",
                overnight: "Mountain camp / hut"
            },
            {
                day: 3,
                title: "Acclimatization Days",
                description: "Gradual ascent with proper acclimatization",
                overnight: "Mountain camp / hut"
            },
            {
                day: 4,
                title: "Continue Ascent",
                description: "Trek through heath and moorland zones",
                overnight: "Mountain camp / hut"
            },
            {
                day: 5,
                title: "Approach Summit",
                description: "Final preparations before summit attempt",
                overnight: "High camp"
            },
            {
                day: 6,
                title: "Summit Day",
                description: "Early morning summit attempt and descent",
                overnight: "Descent camp"
            },
            {
                day: 7,
                title: "Descend & Celebrate",
                description: "Complete descent and receive certificates",
                overnight: "Arusha / Moshi"
            }
        ],
        included: [
            "Mountain guides + porters",
            "Park fees",
            "Tents (if camping route)",
            "Meals on the mountain",
            "Safety equipment"
        ],
        excluded: [
            "International flights",
            "Visa + travel insurance",
            "Tips for guides and porters",
            "Personal gear rental",
            "Hotel before/after trek"
        ],
        priceFrom: 1850,
        rating: 9.2,
        reviewCount: 156,
        imageUrl: "/images/safaris/kilimanjaro.jpg",
        destinations: []
    },
    {
        id: "6-day-northern-circuit",
        name: "6 Days Northern Circuit Safari - Mount Kilimanjaro Views",
        slug: "6-day-northern-circuit",
        category: "Wildlife Safari",
        shortDescription: "Experience Tanzania's iconic parks with stunning Kilimanjaro views",
        overview: "A comprehensive safari covering Tarangire, Lake Manyara, Serengeti, and Ngorongoro Crater with breathtaking views of Mount Kilimanjaro.",
        bestFor: ["First-time visitors", "Photography", "Big Five"],
        duration: "6 days / 5 nights",
        startEnd: "Arusha",
        highlights: [
            "Big Five game viewing",
            "Ngorongoro Crater exploration",
            "Serengeti endless plains",
            "Kilimanjaro vistas"
        ],
        itinerary: [
            { day: 1, title: "Arusha → Tarangire", description: "Game drive in Tarangire National Park", overnight: "Tarangire" },
            { day: 2, title: "Tarangire → Lake Manyara", description: "Visit Lake Manyara tree-climbing lions", overnight: "Manyara" },
            { day: 3, title: "Lake Manyara → Serengeti", description: "Enter Serengeti via Ngorongoro highlands", overnight: "Serengeti" },
            { day: 4, title: "Serengeti Full Day", description: "Full day exploring Serengeti ecosystem", overnight: "Serengeti" },
            { day: 5, title: "Serengeti → Ngorongoro", description: "Morning game drive, transfer to crater rim", overnight: "Ngorongoro" },
            { day: 6, title: "Ngorongoro Crater → Arusha", description: "Crater floor game drive, return to Arusha", overnight: "" }
        ],
        included: ["Professional guide", "Park fees", "4x4 safari vehicle", "Meals", "Accommodation"],
        excluded: ["Flights", "Visa", "Tips", "Drinks"],
        priceFrom: 3300,
        rating: 9.5,
        reviewCount: 92,
        imageUrl: "/images/destinations/serengeti/serengeti.jpg",
        destinations: ["tarangire", "lake-manyara", "serengeti", "ngorongoro"]
    },
    {
        id: "4-day-zanzibar-beach",
        name: "4 Days Zanzibar Beach Holiday - Stone Town & Spice Tour",
        slug: "4-day-zanzibar-beach",
        category: "Safari & Beach",
        shortDescription: "Relax on pristine beaches and explore historic Stone Town",
        overview: "Perfect beach getaway combining relaxation on white sand beaches with cultural exploration of Stone Town and spice plantations.",
        bestFor: ["Beach lovers", "Culture", "Relaxation"],
        duration: "4 days / 3 nights",
        startEnd: "Zanzibar",
        highlights: [
            "White sand beaches",
            "Stone Town UNESCO site",
            "Spice plantation tour",
            "Sunset dhow cruise"
        ],
        itinerary: [
            { day: 1, title: "Arrive Zanzibar", description: "Transfer to beach resort", overnight: "Zanzibar" },
            { day: 2, title: "Stone Town Tour", description: "Guided walking tour of historic Stone Town", overnight: "Zanzibar" },
            { day: 3, title: "Spice Tour & Beach", description: "Morning spice tour, afternoon beach relaxation", overnight: "Zanzibar" },
            { day: 4, title: "Departure", description: "Free morning, transfer to airport", overnight: "" }
        ],
        included: ["Airport transfers", "Hotel accommodation", "Breakfast daily", "Stone Town tour", "Spice tour"],
        excluded: ["Flights", "Lunch/dinner", "Optional activities", "Tips"],
        priceFrom: 1150,
        rating: 9.1,
        reviewCount: 78,
        imageUrl: "/images/destinations/zanzibar/zanzibar-beach.jpg",
        destinations: ["zanzibar"]
    },
    {
        id: "3-day-luxury-safari",
        name: "3 Days Luxury Serengeti Safari - Paradise & Star Beds",
        slug: "3-day-luxury-safari",
        category: "Wildlife Safari",
        shortDescription: "Ultimate luxury safari experience in premium lodges",
        overview: "Short but luxurious safari staying in top-tier lodges with exceptional service, gourmet dining, and prime wildlife viewing locations.",
        bestFor: ["Luxury travelers", "Short trips", "Honeymoon"],
        duration: "3 days / 2 nights",
        startEnd: "Arusha",
        highlights: [
            "Luxury tented camps",
            "Private game drives",
            "Gourmet bush dinners",
            "Star bed experience"
        ],
        itinerary: [
            { day: 1, title: "Fly to Serengeti", description: "Scenic flight to Serengeti airstrip", overnight: "Serengeti luxury lodge" },
            { day: 2, title: "Serengeti Exploration", description: "Full day private game drive with picnic lunch", overnight: "Serengeti luxury lodge" },
            { day: 3, title: "Return to Arusha", description: "Morning game drive, fly back to Arusha", overnight: "" }
        ],
        included: ["Domestic flights", "Luxury accommodation", "All meals", "Private guide", "Premium beverages"],
        excluded: ["International flights", "Gratuities", "Spa treatments", "Additional activities"],
        priceFrom: 2800,
        rating: 9.8,
        reviewCount: 45,
        imageUrl: "/images/accommodations/luxury/luxury-lodge.jpg",
        destinations: ["serengeti"]
    },
    {
        id: "7-day-great-migration",
        name: "7 Days Great Migration Safari - River Crossings & Predator Action",
        slug: "7-day-great-migration",
        category: "Wildlife Safari",
        shortDescription: "Witness the spectacular wildebeest migration river crossings",
        overview: "Timed to coincide with the Great Migration river crossings, this safari offers front-row seats to nature's most dramatic spectacle.",
        bestFor: ["Wildlife enthusiasts", "Photographers", "Migration season"],
        duration: "7 days / 6 nights",
        startEnd: "Arusha",
        highlights: [
            "River crossing action",
            "Predator hunting scenes",
            "Hot air balloon safari",
            "Maasai village visit"
        ],
        itinerary: [
            { day: 1, title: "Arusha → Tarangire", description: "Game drive in elephant paradise", overnight: "Tarangire" },
            { day: 2, title: "Tarangire → Serengeti", description: "Drive to central Serengeti", overnight: "Serengeti" },
            { day: 3, title: "Northern Serengeti", description: "Travel to migration area", overnight: "Serengeti North" },
            { day: 4, title: "Migration Viewing", description: "Full day observing river crossings", overnight: "Serengeti North" },
            { day: 5, title: "Balloon Safari", description: "Sunrise hot air balloon over Serengeti", overnight: "Serengeti" },
            { day: 6, title: "Serengeti → Ngorongoro", description: "Morning game drive, transfer to crater", overnight: "Ngorongoro" },
            { day: 7, title: "Ngorongoro → Arusha", description: "Crater game drive, return to Arusha", overnight: "" }
        ],
        included: ["Expert guide", "Park fees", "Vehicle", "Meals", "Balloon safari"],
        excluded: ["Flights", "Visa", "Tips", "Alcoholic drinks"],
        priceFrom: 4200,
        rating: 9.7,
        reviewCount: 134,
        imageUrl: "/images/blog/great-migration.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro"]
    },
    {
        id: "5-day-family-adventure",
        name: "5 Days Family Adventure Safari - Kid-Friendly Lodges & Activities",
        slug: "5-day-family-adventure",
        category: "Wildlife Safari",
        shortDescription: "Tailored safari designed specifically for families with children",
        overview: "Family-focused safari with kid-friendly accommodations, flexible schedules, and engaging activities suitable for all ages.",
        bestFor: ["Families with kids", "Educational", "Multi-generational"],
        duration: "5 days / 4 nights",
        startEnd: "Arusha",
        highlights: [
            "Kid-friendly guides",
            "Junior ranger program",
            "Swimming pools",
            "Flexible timing"
        ],
        itinerary: [
            { day: 1, title: "Arusha → Tarangire", description: "Easy game drive, pool time at lodge", overnight: "Tarangire family lodge" },
            { day: 2, title: "Tarangire → Serengeti", description: "Scenic drive with stops for photos", overnight: "Serengeti family camp" },
            { day: 3, title: "Serengeti Discovery", description: "Junior ranger activities, game drive", overnight: "Serengeti family camp" },
            { day: 4, title: "Serengeti → Karatu", description: "Morning drive, Maasai cultural visit", overnight: "Karatu" },
            { day: 5, title: "Ngorongoro → Arusha", description: "Crater visit, return to Arusha", overnight: "" }
        ],
        included: ["Family guide", "Park fees", "Vehicle", "Meals", "Kids activities"],
        excluded: ["Flights", "Visa", "Tips", "Personal items"],
        priceFrom: 2650,
        rating: 9.3,
        reviewCount: 67,
        imageUrl: "/images/destinations/serengeti/serengeti.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro"]
    },
    {
        id: "8-day-photography-safari",
        name: "8 Days Photography Safari - Professional Guide & Optimal Lighting",
        slug: "8-day-photography-safari",
        category: "Wildlife Safari",
        shortDescription: "Specialized safari for photography enthusiasts with expert guidance",
        overview: "Designed for photographers with optimal timing for golden hour shots, specialized vehicles with camera mounts, and expert photography guidance.",
        bestFor: ["Photographers", "Wildlife photography", "Advanced techniques"],
        duration: "8 days / 7 nights",
        startEnd: "Arusha",
        highlights: [
            "Photography specialist guide",
            "Bean bag camera mounts",
            "Golden hour focus",
            "Post-processing tips"
        ],
        itinerary: [
            { day: 1, title: "Arusha → Tarangire", description: "Afternoon light photography session", overnight: "Tarangire" },
            { day: 2, title: "Tarangire Sunrise", description: "Dawn shoot, baobab landscapes", overnight: "Tarangire" },
            { day: 3, title: "Tarangire → Serengeti", description: "En-route photo opportunities", overnight: "Serengeti" },
            { day: 4, title: "Central Serengeti", description: "Predator photography focus", overnight: "Serengeti" },
            { day: 5, title: "Western Corridor", description: "Grumeti River crocodiles", overnight: "Serengeti West" },
            { day: 6, title: "Northern Serengeti", description: "Big cat territory exploration", overnight: "Serengeti North" },
            { day: 7, title: "Ngorongoro Crater", description: "Crater rim and floor photography", overnight: "Ngorongoro" },
            { day: 8, title: "Return to Arusha", description: "Morning crater shoot, return", overnight: "" }
        ],
        included: ["Photo specialist guide", "Camera equipment support", "Park fees", "Vehicle", "Meals"],
        excluded: ["Camera gear", "Flights", "Visa", "Tips"],
        priceFrom: 4800,
        rating: 9.6,
        reviewCount: 52,
        imageUrl: "/images/blog/big-five.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro"]
    },
    {
        id: "10-day-grand-tanzania",
        name: "10 Days Grand Tanzania Safari - Complete Northern Circuit Experience",
        slug: "10-day-grand-tanzania",
        category: "Wildlife Safari",
        shortDescription: "Comprehensive safari covering all major northern parks",
        overview: "The ultimate Tanzania safari experience visiting every major park in the northern circuit with extended game viewing time.",
        bestFor: ["Complete experience", "Serious wildlife watchers", "Extended vacation"],
        duration: "10 days / 9 nights",
        startEnd: "Arusha",
        highlights: [
            "All northern parks",
            "Extended game drives",
            "Cultural experiences",
            "Premium accommodations"
        ],
        itinerary: [
            { day: 1, title: "Arusha Arrival", description: "Welcome briefing, gear check", overnight: "Arusha" },
            { day: 2, title: "Tarangire", description: "Full day elephant watching", overnight: "Tarangire" },
            { day: 3, title: "Lake Manyara", description: "Tree-climbing lions, flamingos", overnight: "Manyara" },
            { day: 4, title: "Ngorongoro Highlands", description: "Olduvai Gorge visit", overnight: "Ngorongoro" },
            { day: 5, title: "Serengeti South", description: "Enter Serengeti, Ndutu area", overnight: "Serengeti" },
            { day: 6, title: "Central Serengeti", description: "Seronera Valley exploration", overnight: "Serengeti" },
            { day: 7, title: "Northern Serengeti", description: "Remote wilderness areas", overnight: "Serengeti North" },
            { day: 8, title: "Eastern Serengeti", description: "Moru Kopjes, rock art sites", overnight: "Serengeti" },
            { day: 9, title: "Ngorongoro Crater", description: "Full crater floor exploration", overnight: "Ngorongoro" },
            { day: 10, title: "Return to Arusha", description: "Final game drive, departure", overnight: "" }
        ],
        included: ["Expert guide", "All park fees", "Vehicle", "All meals", "Cultural visits"],
        excluded: ["Flights", "Visa", "Tips", "Optional activities"],
        priceFrom: 5500,
        rating: 9.8,
        reviewCount: 89,
        imageUrl: "/images/destinations/serengeti/serengeti.jpg",
        destinations: ["tarangire", "lake-manyara", "serengeti", "ngorongoro"]
    },
    {
        id: "6-day-bush-beach",
        name: "6 Days Bush & Beach Combo - Serengeti & Zanzibar",
        slug: "6-day-bush-beach",
        category: "Safari & Beach",
        shortDescription: "Perfect blend of safari adventure and beach relaxation",
        overview: "Ideal combination package offering the best of both worlds - thrilling safari followed by relaxing beach time in Zanzibar.",
        bestFor: ["Best of both worlds", "Honeymoon", "Balanced vacation"],
        duration: "6 days / 5 nights",
        startEnd: "Arusha • Zanzibar",
        highlights: [
            "Serengeti game drives",
            "Zanzibar beaches",
            "Seamless logistics",
            "Two distinct experiences"
        ],
        itinerary: [
            { day: 1, title: "Arusha → Serengeti", description: "Fly directly to Serengeti", overnight: "Serengeti" },
            { day: 2, title: "Serengeti Safari", description: "Full day game viewing", overnight: "Serengeti" },
            { day: 3, title: "Morning Safari → Fly Zanzibar", description: "Early game drive, afternoon flight to Zanzibar", overnight: "Zanzibar" },
            { day: 4, title: "Zanzibar Beach", description: "Relax on pristine beaches", overnight: "Zanzibar" },
            { day: 5, title: "Zanzibar Leisure", description: "Optional water sports or spa", overnight: "Zanzibar" },
            { day: 6, title: "Departure", description: "Transfer to airport", overnight: "" }
        ],
        included: ["Domestic flights", "Safari vehicle", "Beach hotel", "Meals as specified", "Transfers"],
        excluded: ["International flights", "Visa", "Tips", "Optional excursions"],
        priceFrom: 3800,
        rating: 9.4,
        reviewCount: 103,
        imageUrl: "/images/destinations/serengeti/serengeti-sunset.jpg",
        destinations: ["serengeti", "zanzibar"]
    },
    {
        id: "4-day-quick-safari",
        name: "4 Days Quick Safari Express - Ngorongoro & Lake Manyara",
        slug: "4-day-quick-safari",
        category: "Wildlife Safari",
        shortDescription: "Compact safari perfect for short stays or stopovers",
        overview: "Efficiently designed short safari maximizing wildlife viewing in limited time, ideal for business travelers or those with tight schedules.",
        bestFor: ["Time-constrained", "Stopover", "Quick experience"],
        duration: "4 days / 3 nights",
        startEnd: "Arusha",
        highlights: [
            "Ngorongoro Crater",
            "Lake Manyara",
            "Efficient routing",
            "Quality over quantity"
        ],
        itinerary: [
            { day: 1, title: "Arusha → Lake Manyara", description: "Direct drive, afternoon game drive", overnight: "Manyara" },
            { day: 2, title: "Manyara → Ngorongoro", description: "Morning drive, crater rim arrival", overnight: "Ngorongoro" },
            { day: 3, title: "Ngorongoro Crater", description: "Full day crater floor exploration", overnight: "Ngorongoro" },
            { day: 4, title: "Return to Arusha", description: "Morning departure, return to Arusha", overnight: "" }
        ],
        included: ["Guide", "Park fees", "Vehicle", "Meals", "Accommodation"],
        excluded: ["Flights", "Visa", "Tips", "Drinks"],
        priceFrom: 1950,
        rating: 8.9,
        reviewCount: 71,
        imageUrl: "/images/destinations/ngorongoro/ngorongoro.jpg",
        destinations: ["lake-manyara", "ngorongoro"]
    },
    {
        id: "12-day-ultimate-tanzania",
        name: "12 Days Ultimate Tanzania - Safari, Zanzibar & Culture",
        slug: "12-day-ultimate-tanzania",
        category: "Safari & Beach",
        shortDescription: "The complete Tanzania experience with everything included",
        overview: "Comprehensive journey combining extensive safari, beach relaxation, cultural immersion, and optional Kilimanjaro views.",
        bestFor: ["Ultimate experience", "Extended vacation", "Once-in-a-lifetime"],
        duration: "12 days / 11 nights",
        startEnd: "Arusha • Zanzibar",
        highlights: [
            "Complete northern circuit",
            "Zanzibar extension",
            "Maasai cultural visit",
            "Coffee farm tour"
        ],
        itinerary: [
            { day: 1, title: "Arusha Arrival", description: "Welcome, city tour if time permits", overnight: "Arusha" },
            { day: 2, title: "Tarangire", description: "Elephant herds, baobabs", overnight: "Tarangire" },
            { day: 3, title: "Lake Manyara", description: "Birdlife, tree-climbing lions", overnight: "Manyara" },
            { day: 4, title: "Ngorongoro Highlands", description: "Maasai village visit", overnight: "Ngorongoro" },
            { day: 5, title: "Serengeti South", description: "Enter Serengeti", overnight: "Serengeti" },
            { day: 6, title: "Central Serengeti", description: "Seronera area exploration", overnight: "Serengeti" },
            { day: 7, title: "Northern Serengeti", description: "Remote areas, big cats", overnight: "Serengeti North" },
            { day: 8, title: "Return South", description: "Drive back through central", overnight: "Serengeti" },
            { day: 9, title: "Ngorongoro Crater", description: "Crater floor game drive", overnight: "Ngorongoro" },
            { day: 10, title: "Fly to Zanzibar", description: "Morning flight to islands", overnight: "Zanzibar" },
            { day: 11, title: "Zanzibar Beach", description: "Relaxation day", overnight: "Zanzibar" },
            { day: 12, title: "Departure", description: "Transfer to airport", overnight: "" }
        ],
        included: ["Expert guide", "All parks", "Flights to Zanzibar", "All meals", "Cultural visits"],
        excluded: ["International flights", "Visa", "Tips", "Personal expenses"],
        priceFrom: 6200,
        rating: 9.9,
        reviewCount: 67,
        imageUrl: "/images/safaris/serengeti-migration.jpg",
        destinations: ["tarangire", "lake-manyara", "serengeti", "ngorongoro", "zanzibar"]
    },
    {
        id: "5-day-budget-safari",
        name: "5 Days Budget Camping Safari - Authentic Bush Experience",
        slug: "5-day-budget-safari",
        category: "Wildlife Safari",
        shortDescription: "Affordable safari with comfortable camping accommodations",
        overview: "Budget-friendly option offering authentic camping experience without compromising on wildlife viewing quality or safety.",
        bestFor: ["Budget travelers", "Adventure seekers", "Young travelers"],
        duration: "5 days / 4 nights",
        startEnd: "Arusha",
        highlights: [
            "Camping under stars",
            "Same parks as luxury",
            "Authentic experience",
            "Great value"
        ],
        itinerary: [
            { day: 1, title: "Arusha → Tarangire", description: "Drive and set up camp", overnight: "Tarangire campsite" },
            { day: 2, title: "Tarangire → Serengeti", description: "Long drive, evening camp setup", overnight: "Serengeti campsite" },
            { day: 3, title: "Serengeti Full Day", description: "Game drive, return to camp", overnight: "Serengeti campsite" },
            { day: 4, title: "Serengeti → Ngorongoro", description: "Morning drive, crater rim camp", overnight: "Ngorongoro campsite" },
            { day: 5, title: "Crater → Arusha", description: "Early crater descent, return", overnight: "" }
        ],
        included: ["Camping equipment", "Guide", "Park fees", "Meals", "Vehicle"],
        excluded: ["Sleeping bags (rental available)", "Flights", "Visa", "Tips"],
        priceFrom: 1450,
        rating: 8.7,
        reviewCount: 94,
        imageUrl: "/images/destinations/serengeti/serengeti-lions.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro"]
    },
    {
        id: "7-day-honeymoon-luxury",
        name: "7 Days Honeymoon Luxury Safari - Romance & Wildlife",
        slug: "7-day-honeymoon-luxury",
        category: "Safari & Beach",
        shortDescription: "Romantic luxury safari designed for honeymooners",
        overview: "Specially crafted romantic safari with luxury accommodations, private experiences, and intimate settings perfect for newlyweds.",
        bestFor: ["Honeymoon", "Romance", "Luxury couples"],
        duration: "7 days / 6 nights",
        startEnd: "Arusha • Zanzibar",
        highlights: [
            "Private game drives",
            "Bush dinners",
            "Couples spa treatments",
            "Beach sunset cruises"
        ],
        itinerary: [
            { day: 1, title: "Arusha → Luxury Lodge", description: "Private transfer to exclusive lodge", overnight: "Luxury lodge" },
            { day: 2, title: "Tarangire Private Safari", description: "Exclusive vehicle and guide", overnight: "Luxury lodge" },
            { day: 3, title: "Fly to Serengeti", description: "Private charter to remote camp", overnight: "Luxury tented camp" },
            { day: 4, title: "Serengeti Romance", description: "Private picnic, sunset sundowners", overnight: "Luxury tented camp" },
            { day: 5, title: "Fly to Zanzibar", description: "Private transfer to beach villa", overnight: "Beach villa" },
            { day: 6, title: "Zanzibar Couples", description: "Couples massage, dhow cruise", overnight: "Beach villa" },
            { day: 7, title: "Departure", description: "Private airport transfer", overnight: "" }
        ],
        included: ["Private guide", "Luxury accommodations", "All meals", "Private transfers", "Romantic extras"],
        excluded: ["International flights", "Visa", "Additional spa treatments", "Tips"],
        priceFrom: 7500,
        rating: 9.9,
        reviewCount: 38,
        imageUrl: "/images/accommodations/luxury/luxury-lodge.jpg",
        destinations: ["tarangire", "serengeti", "zanzibar"]
    },
    {
        id: "9-days-wildlife-photography",
        name: "9 Days Wildlife & Bird Photography - Expert-Led Workshop",
        slug: "9-days-wildlife-photography",
        category: "Wildlife Safari",
        shortDescription: "Intensive photography workshop with professional instruction",
        overview: "Advanced photography safari led by professional wildlife photographer with hands-on instruction, critique sessions, and optimal shooting conditions.",
        bestFor: ["Serious photographers", "Workshop participants", "Skill development"],
        duration: "9 days / 8 nights",
        startEnd: "Arusha",
        highlights: [
            "Professional photographer guide",
            "Daily critique sessions",
            "Optimal lighting times",
            "Equipment advice"
        ],
        itinerary: [
            { day: 1, title: "Arusha → Tarangire", description: "Introduction session, evening shoot", overnight: "Tarangire" },
            { day: 2, title: "Tarangire Dawn Shoot", description: "Pre-dawn setup, morning light", overnight: "Tarangire" },
            { day: 3, title: "To Serengeti", description: "En-route composition lessons", overnight: "Serengeti" },
            { day: 4, title: "Predator Photography", description: "Focus on big cats, action shots", overnight: "Serengeti" },
            { day: 5, title: "Landscape & Wildlife", description: "Combining scenery with animals", overnight: "Serengeti" },
            { day: 6, title: "Behavioral Photography", description: "Capturing animal interactions", overnight: "Serengeti" },
            { day: 7, title: "Ngorongoro Crater", description: "Crater rim and floor techniques", overnight: "Ngorongoro" },
            { day: 8, title: "Bird Photography Focus", description: "Specialized bird shooting day", overnight: "Ngorongoro" },
            { day: 9, title: "Portfolio Review → Arusha", description: "Final session, return", overnight: "" }
        ],
        included: ["Pro photographer guide", "Critique sessions", "Park fees", "Vehicle", "Meals"],
        excluded: ["Camera equipment", "Flights", "Visa", "Tips"],
        priceFrom: 5200,
        rating: 9.7,
        reviewCount: 41,
        imageUrl: "/images/blog/big-five.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro"]
    },
    {
        id: "3-days-tarangire-ngorongoro-manyara",
        name: "3 Days Mid-range Safari - Tarangire, Ngorongoro & Lake Manyara",
        slug: "3-days-tarangire-ngorongoro-manyara",
        category: "Wildlife Safari",
        shortDescription: "Explore three iconic parks in 3 days with comfortable lodges",
        overview: "A perfect introduction to Tanzania's northern circuit covering Tarangire, Ngorongoro Crater, and Lake Manyara. Stay in comfortable mid-range lodges, enjoy full-board meals, and travel in a private 4x4 safari vehicle. Ideal for time-constrained travelers seeking maximum wildlife experiences.",
        bestFor: ["Short trips", "First-time visitors", "Budget-conscious", "Three parks experience"],
        duration: "3 days / 2 nights",
        startEnd: "Arusha",
        highlights: [
            "Elephant herds and baobabs in Tarangire",
            "Ngorongoro Crater wildlife viewing",
            "Tree-climbing lions in Lake Manyara",
            "Private 4x4 Land Cruiser with WiFi",
            "Full-board meals included"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arusha → Tarangire National Park",
                description: "Pickup from lodge/airport. Game drive in Tarangire spotting elephants, zebras, giraffes, and lions around Tarangire River. Picnic lunch in park. Evening transfer to Karatu lodge.",
                overnight: "Ngorongoro Coffee Lodge, Karatu"
            },
            {
                day: 2,
                title: "Karatu → Ngorongoro Crater",
                description: "Early breakfast, drive to Ngorongoro Crater. Full-day game drive in the crater spotting elephants, lions, buffaloes, hippos, zebras, and rare black rhino. Stunning crater scenery with high walls and sparkling waterholes.",
                overnight: "Ngorongoro Coffee Lodge, Karatu"
            },
            {
                day: 3,
                title: "Karatu → Lake Manyara → Arusha",
                description: "Morning game drive in Lake Manyara National Park. Spot tree-climbing lions, baboons, flamingos, and diverse birdlife. Picnic lunch in park. Afternoon transfer back to Arusha where safari concludes.",
                overnight: ""
            }
        ],
        included: [
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser with WiFi",
            "Mineral water, beer & wine during safari",
            "All national park entry fees",
            "All activities listed in itinerary",
            "Full-board meals (Day 1-2), Breakfast & lunch (Day 3)",
            "Airport/lodge transfers"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Drinks at lodges",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ],
        priceFrom: 990,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/3-days-tarangire-ngorongoro-manyara/hero.jpg",
        destinations: ["tarangire", "ngorongoro", "lake-manyara"]
    },
    {
        id: "3-days-zanzibar-beach-escape",
        name: "3 Days Zanzibar Beach Escape - Nur Beach Hotel",
        slug: "3-days-zanzibar-beach-escape",
        category: "Beach Holiday",
        shortDescription: "Relaxing beach getaway at affordable Nur Beach Hotel",
        overview: "Experience the beauty and tranquility of Zanzibar with this relaxing 3-day beach escape. Perfect for budget-conscious travelers who want to unwind by the Indian Ocean, enjoy tropical atmosphere, and experience warm Zanzibari hospitality at Nur Beach Hotel.",
        bestFor: ["Budget travelers", "Beach relaxation", "Short breaks", "Tropical escape"],
        duration: "3 days / 2 nights",
        startEnd: "Zanzibar Airport",
        highlights: [
            "White sandy beaches of Zanzibar",
            "Warm Indian Ocean swimming",
            "Comfortable beachfront accommodation",
            "Daily breakfast included",
            "Private airport transfers"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Zanzibar",
                description: "Warm welcome at Abeid Amani Karume International Airport by Tanview Safaris representative. Transfer to Nur Beach Hotel for check-in. Relax and enjoy ocean breeze and beautiful coastal surroundings.",
                overnight: "Nur Beach Hotel"
            },
            {
                day: 2,
                title: "Leisure & Beach Activities",
                description: "Full day at leisure at Nur Beach Hotel. Enjoy beach relaxation along white sandy shores, swim in warm Indian Ocean, sunbathe with tropical views, or participate in optional water activities arranged by hotel.",
                overnight: "Nur Beach Hotel"
            },
            {
                day: 3,
                title: "Departure",
                description: "Breakfast at Nur Beach Hotel. Check-out and transfer to Abeid Amani Karume International Airport for departure flight. End of memorable Zanzibar beach getaway.",
                overnight: ""
            }
        ],
        included: [
            "Airport pick-up and drop-off",
            "2 nights accommodation at Nur Beach Hotel",
            "Daily breakfast at hotel",
            "Private airport transfers",
            "Tanview Safaris representative assistance",
            "All government taxes and service charges"
        ],
        excluded: [
            "Lunch and dinner meals",
            "Personal expenses (snacks, drinks, souvenirs)",
            "Optional activities and excursions",
            "Travel insurance",
            "International and domestic flights",
            "Tips and gratuities"
        ],
        priceFrom: 508,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/3-days-zanzibar-beach-escape/hero.jpg",
        destinations: ["zanzibar"]
    },
    {
        id: "3-days-serengeti-ngorongoro-fly",
        name: "3 Days Amazing Safari - Serengeti & Ngorongoro Crater (Fly-in)",
        slug: "3-days-serengeti-ngorongoro-fly",
        category: "Wildlife Safari",
        shortDescription: "Fly-in safari to Serengeti and Ngorongoro with luxury lodges",
        overview: "Experience Tanzania's top two destinations in just 3 days with convenient domestic flights. Stay at Kubukubu Lodge in Serengeti and Ngorongoro Serena Lodge on the crater rim. Includes private 4x4 Land Cruiser with WiFi, full-board meals, and professional guide.",
        bestFor: ["Short trips", "Luxury experience", "Serengeti focus", "Time-efficient"],
        duration: "3 days / 2 nights",
        startEnd: "Arusha (with domestic flight)",
        highlights: [
            "Domestic flight to Serengeti (saves time)",
            "Kubukubu Lodge in Serengeti",
            "Ngorongoro Serena Lodge on crater rim",
            "Morning game drives when animals most active",
            "Private 4x4 Land Cruiser with WiFi"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arusha → Fly to Serengeti",
                description: "Pickup from Arusha hotel/lodge. Transfer to Arusha Airport for flight to Seronera Airstrip in Serengeti. Game drive en-route with packed lunch. Spot wildebeest, zebras, antelopes, lions, leopards, and cheetahs.",
                overnight: "Kubukubu Lodge, Serengeti"
            },
            {
                day: 2,
                title: "Serengeti → Ngorongoro Highlands",
                description: "Early morning game drive in Serengeti (peak wildlife activity). Depart for Ngorongoro Conservation Area. Arrive at lodge on crater rim for relaxing evening with stunning views.",
                overnight: "Ngorongoro Serena Lodge"
            },
            {
                day: 3,
                title: "Ngorongoro Crater → Arusha",
                description: "Descend into Ngorongoro Crater for unforgettable game drive. World's largest unbroken caldera with extraordinary wildlife concentration including lions, elephants, rhinos, buffaloes. Morning exploration then transfer back to Arusha.",
                overnight: ""
            }
        ],
        included: [
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser",
            "Domestic flight Arusha to Seronera",
            "All national park entry fees",
            "Bottled mineral water during safari",
            "All activities in itinerary",
            "Full-board meals (Days 1-2), Breakfast & lunch (Day 3)"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Drinks at lodges/camps",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ],
        priceFrom: 1312,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/3-days-serengeti-ngorongoro-fly/hero.jpg",
        destinations: ["serengeti", "ngorongoro"]
    },
    {
        id: "5-days-luxury-northern-parks",
        name: "5 Days Luxury Safari - Northern Tanzania Parks",
        slug: "5-days-luxury-northern-parks",
        category: "Luxury Safari",
        shortDescription: "Premium 5-day safari with Gran Melia and Serena lodges",
        overview: "Unforgettable 5-day luxury safari across Tarangire, Serengeti, Ngorongoro Crater, and Lake Manyara. Stay at prestigious Gran Melia Arusha, Lake Manyara Serena Safari Lodge, and Serengeti Serena Safari Lodge. Private game drives, breathtaking sunsets, and tranquil evenings immersed in nature.",
        bestFor: ["Luxury travelers", "Premium experience", "Brand-name lodges", "All 4 parks"],
        duration: "5 days / 4 nights",
        startEnd: "Arusha",
        highlights: [
            "Gran Melia Arusha (5-star luxury)",
            "Serena Safari Lodges (premium brand)",
            "All 4 northern circuit parks",
            "Private game drives with expert guide",
            "Sunset game drives in Serengeti"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Arusha",
                description: "Warm welcome by representative and private driver-guide. Transfer to Gran Melia Arusha. Rest of day at leisure - relax, freshen up, peaceful garden walk, delicious dinner.",
                overnight: "Gran Melia Arusha"
            },
            {
                day: 2,
                title: "Arusha → Tarangire → Lake Manyara",
                description: "Scenic 2-hour drive to Tarangire National Park. Private game drive spotting giraffes, zebras, lions, diverse birdlife. Picnic lunch in nature. Late afternoon transfer to Lake Manyara Serena Safari Lodge.",
                overnight: "Lake Manyara Serena Safari Lodge"
            },
            {
                day: 3,
                title: "Ngorongoro Crater → Serengeti",
                description: "Early breakfast, depart for Ngorongoro Crater. Descend into crater for morning and afternoon game drive. Spot zebras, wildebeest, gazelles, lions, endangered black rhino. Picnic lunch surrounded by breathtaking scenery. Continue to Serengeti for sunset game drive.",
                overnight: "Serengeti Serena Safari Lodge"
            },
            {
                day: 4,
                title: "Serengeti Full Day → Lake Manyara",
                description: "6:30am departure for morning game drive. 6-7 hours exploring vast wilderness. Famous Great Migration (seasonal). Spot lions, leopards, cheetahs, hippos, crocodiles, buffaloes. 2pm drive back to Lake Manyara Serena Safari Lodge. Relax by pool, dinner by fire under African sky.",
                overnight: "Lake Manyara Serena Safari Lodge"
            },
            {
                day: 5,
                title: "Lake Manyara → Arusha",
                description: "Early breakfast, short drive to Lake Manyara National Park. Game drive spotting monkeys, giraffes, zebras, wildebeests, buffalo, elephants, tree-climbing lions. Over 500 bird species including flamingos. Packed lunch, return to Arusha in time for onward travel.",
                overnight: ""
            }
        ],
        included: [
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser",
            "Mineral water during safari",
            "All national park entry fees",
            "All activities in itinerary",
            "Meals as specified per day",
            "Airport/lodge transfers"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Drinks at lodges",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ],
        priceFrom: 2124,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/5-days-luxury-northern-parks/hero.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro", "lake-manyara"]
    },
    {
        id: "6-days-zanzibar-beach-holiday",
        name: "6 Days Zanzibar Beach Holiday - Paradise & Fun Beach Resorts",
        slug: "6-days-zanzibar-beach-holiday",
        category: "Beach Holiday",
        shortDescription: "Extended 6-day beach escape with two beautiful resorts",
        overview: "Enjoy a relaxing 6-day island escape in Zanzibar with turquoise waters, white sandy beaches, and tropical charm. Stay at two beautiful beach resorts - Paradise Beach Resort and Fun Beach Hotel. Perfect combination of comfort, beach relaxation, and peaceful island atmosphere.",
        bestFor: ["Extended beach stay", "Two-resort experience", "Relaxation", "Tropical paradise"],
        duration: "6 days / 5 nights",
        startEnd: "Zanzibar Airport",
        highlights: [
            "Two different beach resorts",
            "5 nights of pure relaxation",
            "White sandy beaches and turquoise waters",
            "Daily breakfast included",
            "Private airport transfers"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Zanzibar",
                description: "Warm welcome at Abeid Amani Karume International Airport by Tanview Safaris representative. Transfer to Paradise Beach Resort for check-in. Rest of day relaxing after journey, enjoying beautiful coastline surroundings.",
                overnight: "Paradise Beach Resort"
            },
            {
                day: 2,
                title: "Transfer to Fun Beach Hotel",
                description: "Breakfast at Paradise Beach Resort. Check-out and scenic coastal drive to Fun Beach Hotel. Check-in and enjoy tranquil beach resort atmosphere. Afternoon relaxing by beach, swimming, or exploring nearby coastline.",
                overnight: "Fun Beach Hotel"
            },
            {
                day: 3,
                title: "Leisure at Fun Beach Hotel",
                description: "Full day at leisure after breakfast. Relax on white sandy beach, swim in warm Indian Ocean, enjoy hotel facilities including swimming pool, sunbathing areas, and beach walks.",
                overnight: "Fun Beach Hotel"
            },
            {
                day: 4,
                title: "Relaxation & Optional Activities",
                description: "Another full day enjoying peaceful environment at Fun Beach Hotel. Optional activities include snorkeling, beach walks, or relaxing under tropical sun with stunning ocean views.",
                overnight: "Fun Beach Hotel"
            },
            {
                day: 5,
                title: "Beach Leisure Day",
                description: "Final full day at Fun Beach Hotel after breakfast. Unwind completely, capture beautiful photos of Zanzibar coastline, or simply enjoy calm island atmosphere.",
                overnight: "Fun Beach Hotel"
            },
            {
                day: 6,
                title: "Departure",
                description: "Breakfast at Fun Beach Hotel. Check-out and transfer to Abeid Amani Karume International Airport for departure flight. End of memorable Zanzibar beach holiday.",
                overnight: ""
            }
        ],
        included: [
            "Airport pick-up and drop-off",
            "1 night at Paradise Beach Resort",
            "4 nights at Fun Beach Hotel",
            "Daily breakfast at hotels",
            "Private airport transfers",
            "Tanview Safaris representative assistance",
            "All government taxes and service charges"
        ],
        excluded: [
            "Lunch and dinner meals",
            "Personal expenses (snacks, drinks, souvenirs)",
            "Optional activities and excursions",
            "Travel insurance",
            "International and domestic flights",
            "Tips and gratuities"
        ],
        priceFrom: 1195,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/6-days-zanzibar-beach-holiday/hero.jpg",
        destinations: ["zanzibar"]
    },
    {
        id: "3-days-calving-season-ndutu",
        name: "3 Days Calving Season Safari - Ndutu Great Migration",
        slug: "3-days-calving-season-ndutu",
        category: "Wildlife Safari",
        shortDescription: "Witness the miracle of Ndutu calving season with newborn animals",
        overview: "Experience one of nature's most spectacular events - the Ndutu calving season. Witness thousands of wildebeest giving birth, attracting predators like lions, cheetahs, and hyenas. This fast-paced 3-day safari offers incredible wildlife action and the chance to see the circle of life unfold in real-time.",
        bestFor: ["Calving season", "Predator action", "Photography", "Unique wildlife experience"],
        duration: "3 days / 2 nights",
        startEnd: "Arusha",
        highlights: [
            "Newborn wildebeest and herbivores",
            "Predators in hunting mode",
            "Safari Haven Migration Camp",
            "Ngorongoro Crater visit",
            "Fast-paced wildlife adventure"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arusha → Ngorongoro Crater → Ndutu",
                description: "Early breakfast departure from Arusha. Drive to Ngorongoro Conservation Area, descend 600m into crater for first game drive. Spot elephants, lions, buffaloes, zebras, rare black rhino. Continue to Ndutu area, arrive at Safari Haven Migration Camp for dinner and overnight.",
                overnight: "Safari Haven Migration Camp"
            },
            {
                day: 2,
                title: "Full Day Ndutu Calving Season",
                description: "Spend entire day in Ndutu area witnessing the calving spectacle. See newborn wildebeest, zebras, and other herbivores taking their first steps. Watch predators - lions, cheetahs, hyenas - in action as they hunt vulnerable young animals. Incredible photography opportunities throughout the day.",
                overnight: "Safari Haven Migration Camp"
            },
            {
                day: 3,
                title: "Ndutu Morning Game Drive → Arusha",
                description: "Early morning final game drive in Ndutu for last wildlife sightings. After breakfast, depart for Arusha with smooth transfer to your hotel or Kilimanjaro International Airport. Reflect on unforgettable fast-paced safari across Tanzania's iconic landscapes.",
                overnight: ""
            }
        ],
        included: [
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in itinerary",
            "Meals as specified (Lunch & dinner Day 1, all meals Day 2, breakfast Day 3)",
            "Free round-trip airport transfers"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Drinks at lodges and camps",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ],
        priceFrom: 948,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/3-days-calving-season-ndutu/hero.jpg",
        destinations: ["ngorongoro", "serengeti"]
    },
    {
        id: "4-days-zanzibar-beach-hyatt-nungwi",
        name: "4 Days Zanzibar Beach Holiday - Hyatt & Nungwi Beach Resort",
        slug: "4-days-zanzibar-beach-hyatt-nungwi",
        category: "Beach Holiday",
        shortDescription: "Luxury 4-day beach escape with Hyatt Zanzibar and Nungwi Beach Resort",
        overview: "Discover the beauty of Zanzibar on this relaxing 4-day beach escape. Stay in luxurious beachfront hotels - Hyatt Zanzibar and Nungwi Beach Resort. Enjoy tropical activities, unwind on pristine sands, and experience the vibrant coastal atmosphere of this tropical paradise.",
        bestFor: ["Luxury beach", "Two-resort experience", "Water sports", "Romantic getaway"],
        duration: "4 days / 3 nights",
        startEnd: "Zanzibar Airport",
        highlights: [
            "Hyatt Zanzibar luxury stay",
            "Nungwi Beach Resort",
            "Turquoise waters and white sand",
            "Optional water sports",
            "Scenic coastal drives"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arrival at Zanzibar - Hyatt Zanzibar",
                description: "Warm welcome at Abeid Amani Karume International Airport by Tanview Safaris representative. Transfer to Hyatt Zanzibar for check-in. Spend the day relaxing, enjoying hotel facilities, and taking in tropical ocean views. Evening at leisure.",
                overnight: "Hyatt Zanzibar"
            },
            {
                day: 2,
                title: "Transfer to Nungwi Beach Resort",
                description: "After breakfast, check out from Hyatt Zanzibar and drive to Nungwi Beach Resort Hotel along scenic coast. Check-in and enjoy full day of beach relaxation. Activities include swimming in turquoise waters, sunbathing on white sand, optional snorkeling or diving, walking along coastline.",
                overnight: "Nungwi Beach Resort Hotel"
            },
            {
                day: 3,
                title: "Full Day at Nungwi Beach Resort",
                description: "Second full day of leisure at Nungwi Beach Resort. Relax by beach, participate in optional hotel activities, explore nearby coastal attractions, or simply enjoy serene tropical environment. Perfect day for unwinding and soaking up island vibes.",
                overnight: "Nungwi Beach Resort Hotel"
            },
            {
                day: 4,
                title: "Departure",
                description: "After breakfast at Nungwi Beach Resort, check out from hotel. Transfer to Abeid Amani Karume International Airport for departure flight. End of memorable Zanzibar beach getaway with Tanview Safaris.",
                overnight: ""
            }
        ],
        included: [
            "Airport pick-up and drop-off",
            "1 night at Hyatt Zanzibar",
            "2 nights at Nungwi Beach Resort",
            "Daily breakfast at hotels",
            "Private airport transfers",
            "Tanview Safaris representative assistance",
            "All government taxes and service charges"
        ],
        excluded: [
            "Lunch and dinner meals",
            "Personal expenses (snacks, drinks, souvenirs)",
            "Optional activities and excursions",
            "Travel insurance",
            "International and domestic flights",
            "Tips and gratuities"
        ],
        priceFrom: 858,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/4-days-zanzibar-beach-hyatt-nungwi/hero.jpg",
        destinations: ["zanzibar"]
    },
    {
        id: "6-days-northern-tanzania-affordable",
        name: "6 Days Best of Northern Tanzania Parks - Affordable Safari",
        slug: "6-days-northern-tanzania-affordable",
        category: "Wildlife Safari",
        shortDescription: "Affordable 6-day safari covering Tarangire, Serengeti, Ngorongoro & Manyara",
        overview: "Embark on a remarkable 6-day private safari visiting Tanzania's iconic parks - Tarangire, Serengeti, Ngorongoro Crater, and Lake Manyara. Witness incredible wildlife, breathtaking landscapes, and stay in comfortable lodges, all at an affordable price. Experienced guides and exciting game drives promise unforgettable moments without stretching your budget.",
        bestFor: ["Budget-conscious", "Complete circuit", "First-time visitors", "Value for money"],
        duration: "6 days / 5 nights",
        startEnd: "Arusha",
        highlights: [
            "All 4 northern circuit parks",
            "Elephant herds in Tarangire",
            "Serengeti migration viewing",
            "Ngorongoro Crater exploration",
            "Tree-climbing lions in Manyara"
        ],
        itinerary: [
            {
                day: 1,
                title: "Airport Arrival → Arusha",
                description: "Welcome to Tanzania! Warm greeting by Shafino Wildlife Safari representative at airport. Transfer to lodge in Arusha. Depending on arrival time, relax and prepare for exciting safari adventure ahead. Arusha is gateway to northern Tanzania's renowned national parks.",
                overnight: "Karibu Heritage House"
            },
            {
                day: 2,
                title: "Arusha → Tarangire National Park",
                description: "After breakfast, drive to Tarangire National Park (2-hour journey). Famous for large elephant herds along Tarangire River. Spot giraffes, bushbucks, hartebeests, lions, leopards. Ancient baobab trees over 1000 years old. Picnic lunch in park. Evening transfer to Karatu.",
                overnight: "Eileen's Trees Inn"
            },
            {
                day: 3,
                title: "Karatu → Serengeti National Park",
                description: "Drive through cooler Ngorongoro Conservation Area with breathtaking crater views. Continue to Serengeti National Park - vast open grasslands with excellent wildlife viewing. Famous for annual wildebeest migration. Picnic lunch in park. Magical overnight stay in Serengeti.",
                overnight: "Kontiki Serengeti Camp"
            },
            {
                day: 4,
                title: "Full Day Serengeti Exploration",
                description: "Incredible full day in Serengeti wildlife paradise. Witness impalas, buffaloes, hippos, lions, cheetahs, leopards. Choose early morning and late afternoon game drives, or full day exploration with picnic lunch. Vast savannahs teeming with diverse wildlife and harmonious nature sounds.",
                overnight: "Kontiki Serengeti Camp"
            },
            {
                day: 5,
                title: "Serengeti → Ngorongoro Crater → Mto wa Mbu",
                description: "Scenic drive to famous Ngorongoro Crater with beautiful views en route. Half-day exploring this natural wonder - UNESCO World Heritage Site with golden savannahs, lakes, wetlands. Spot wildebeest, zebras, gazelles, 500+ bird species, endangered black rhino. Continue to Ngare Lodge in Mto wa Mbu.",
                overnight: "Ngare Lodge"
            },
            {
                day: 6,
                title: "Lake Manyara National Park → Airport Transfer",
                description: "Morning drive to Lake Manyara National Park - small but diverse park framed by Great Rift Escarpment. Shallow Salt Lake attracts thousands of wading birds including flamingos. Spot baboons, elephants, tree-climbing lions. Picnic lunch in park. Transfer to Arusha, Kilimanjaro Airport, or Arusha Airport.",
                overnight: ""
            }
        ],
        included: [
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser (safari-equipped)",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in program",
            "Free round-trip airport transfers",
            "Meals as specified per day"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Drinks at lodges and camps",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ],
        priceFrom: 1546,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/6-days-northern-tanzania-affordable/hero.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro", "lake-manyara"]
    },
    {
        id: "6-days-memorable-luxury-safari",
        name: "6 Days Memorable Luxury Safari - Northern Tanzania Premium Experience",
        slug: "6-days-memorable-luxury-safari",
        category: "Luxury Safari",
        shortDescription: "Premium 6-day luxury safari with Gran Melia and Escarpment Lodge",
        overview: "This 6-day luxury safari takes you through the best of Northern Safari Circuit with premium accommodations. See amazing wildlife in different landscapes - monkeys in forests, lions in trees, elephants among acacia, animals in collapsed volcano. Visit world-famous Serengeti with beautiful scenery creating truly special experience.",
        bestFor: ["Luxury travelers", "Premium experience", "Gran Melia stay", "Comprehensive circuit"],
        duration: "6 days / 5 nights",
        startEnd: "Arusha",
        highlights: [
            "Gran Meliá Arusha (5-star luxury)",
            "Escarpment Luxury Lodge Manyara",
            "Tukaone Hembe Camp Serengeti",
            "All 4 northern parks",
            "Premium game drives"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Arusha - Gran Meliá",
                description: "Shafino Wildlife Safari representative meets you at airport. Transfer to accommodation in Arusha. Stay at Gran Meliá - luxury hotel offering peaceful and beautiful environment. Relax and prepare for exciting adventures ahead. Dinner included.",
                overnight: "Gran Meliá Arusha"
            },
            {
                day: 2,
                title: "Arusha → Tarangire National Park",
                description: "Morning pickup by experienced personal safari guide. Travel to Tarangire along smooth tarmac road crossing Maasai plains. See Maasai people in colorful attire. Large elephant herds, diverse wildlife from open-roof modern safari jeep. Zebras, wildebeests, buffaloes, giraffes, lions, leopards. Evening transfer to Escarpment Luxury Lodge Manyara with swimming pool.",
                overnight: "Escarpment Luxury Lodge Manyara"
            },
            {
                day: 3,
                title: "Mto wa Mbu → Central Serengeti",
                description: "Depart Mto wa Mbu toward fertile highlands where Iraqw people cultivate wheat and maize. Pass through misty rainforests of Ngorongoro Conservation Area - spot baboons, elephants, leopards. Continue to Serengeti arriving midday. Scenic game drive en route. Picnic lunch in heart of Serengeti. Extended afternoon game drive. Experience magic of Serengeti sunset. Check-in at tented camp.",
                overnight: "Tukaone Hembe Camp"
            },
            {
                day: 4,
                title: "Full Day Serengeti Game Drive",
                description: "Full day exploring remarkable Serengeti park. Discover wildlife and stunning landscapes. Impalas, buffaloes, crocodiles, hippos. Famous great migrating herds of zebras and wildebeests following seasonal rains. Observe predators - leopards, cheetahs, lions in natural habitat. Unforgettable wildlife experience.",
                overnight: "Tukaone Hembe Camp"
            },
            {
                day: 5,
                title: "Serengeti → Ngorongoro Crater → Mto wa Mbu",
                description: "Hearty breakfast then scenic drive to famous Ngorongoro Crater with stunning landscapes. Half-day exploring this UNESCO World Heritage Site surrounded by high volcanic walls. Golden savannahs, lakes, wetlands, acacia woodlands. Wildebeest, zebras, gazelles, 500+ bird species, endangered black rhino. Continue to Escarpment Luxury Lodge Manyara.",
                overnight: "Escarpment Luxury Lodge Manyara"
            },
            {
                day: 6,
                title: "Lake Manyara National Park → Airport",
                description: "Morning drive to Lake Manyara - final stop on incredible safari. Small yet diverse park framed by towering Great Rift Escarpment. Shallow Salt Lake changes with seasons, attracting thousands of wading birds including flamingos and 500+ species. Spot baboons, elephants, tree-climbing lions. Picnic lunch. Transfer to Arusha town, Kilimanjaro Airport, or Arusha Airport.",
                overnight: ""
            }
        ],
        included: [
            "Dedicated professional driver-guide",
            "Private 4x4 Toyota Land Cruiser (safari-equipped)",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in program",
            "Free round-trip airport transfers",
            "Meals as specified per day"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Drinks at lodges and camps",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ],
        priceFrom: 2575,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/6-days-memorable-luxury-safari/hero.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro", "lake-manyara"]
    },
    {
        id: "4-days-discover-tarangire-serengeti-ngorongoro",
        name: "4 Days Discover Tarangire, Serengeti & Ngorongoro Crater",
        slug: "4-days-discover-tarangire-serengeti-ngorongoro",
        category: "Wildlife Safari",
        shortDescription: "Unforgettable 4-day mid-range safari through Tanzania's top wildlife destinations",
        overview: "Enjoy unforgettable 4-day mid-range safari through Tanzania's top wildlife destinations - Tarangire National Park, famous Serengeti, and Ngorongoro Crater. See large elephant herds among baobab trees, explore wide Serengeti plains, take in stunning views of Ngorongoro's crater. Wonderful chance to experience beauty and wildlife of Africa.",
        bestFor: ["Mid-range value", "Three major parks", "Great Migration", "Compact safari"],
        duration: "4 days / 3 nights",
        startEnd: "Arusha",
        highlights: [
            "Tarangire elephant herds",
            "Ndutu calving season viewing",
            "Serengeti endless plains",
            "Ngorongoro Crater descent",
            "Hot air balloon option"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arusha → Tarangire National Park",
                description: "Early breakfast then travel to Tarangire National Park - famous for large elephant herds, iconic baobab trees, diverse wildlife including lions and big cats. Lunch at Tarangire River picnic site. Afternoon game drive exploring more of park. Evening proceed to Eileen's Trees Inn in Karatu for dinner and overnight.",
                overnight: "Country Lodge (Eileen's Trees Inn)"
            },
            {
                day: 2,
                title: "Karatu → Ndutu via Ngorongoro Highlands",
                description: "Early breakfast, travel from Karatu to Ndutu via scenic Ngorongoro Highlands with game viewing en route. Enter Ndutu, begin first game drive spotting zebras, wildebeests, elephants, predators in this remarkable region home to Great Wildebeest Migration. Afternoon return to lodge for lunch. Sunset game drive taking in breathtaking Serengeti plains beauty.",
                overnight: "Safari Haven Migration Camp"
            },
            {
                day: 3,
                title: "Full Day Ndutu Game Drives",
                description: "Early morning game drive when predators most active. Ndutu renowned for rich wildlife - lions, cheetahs, leopards. Optional hot air balloon safari for unique sunrise view. Full day exploring wide open plains, beauty and diversity of Ndutu. Spot elephants, giraffes, zebras, many other species. Return to lodge evening to reflect on unforgettable day.",
                overnight: "Safari Haven Camp"
            },
            {
                day: 4,
                title: "Ndutu → Ngorongoro Crater → Arusha",
                description: "Early breakfast, scenic game drive to Ngorongoro Crater. Descend into crater searching for rare black rhino - one of hardest animals to spot. Inside stunning crater called Africa's 'Noah's Ark' encounter wide variety of wildlife - elephants, hyenas, big cats, rhinos. Afternoon lunch by hippo pool, another game drive ascending to crater rim. Continue journey to Arusha arriving early evening.",
                overnight: ""
            }
        ],
        included: [
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in program",
            "Meals as specified (Lunch & dinner Day 1, all meals Days 2-3, breakfast & lunch Day 4)"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Drinks at lodges/camps",
            "Laundry services",
            "Tips and personal expenses",
            "Hot air balloon safari (optional extra)",
            "Extra accommodation before/after safari"
        ],
        priceFrom: 1074,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/4-days-discover-tarangire-serengeti-ngorongoro/hero.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro"]
    },
    {
        id: "4-days-luxury-safari-serena",
        name: "4 Days Luxury Safari - Serena Lodges Tarangire, Serengeti & Ngorongoro",
        slug: "4-days-luxury-safari-serena",
        category: "Luxury Safari",
        shortDescription: "Premium 4-day safari staying at prestigious Serena Safari Lodges",
        overview: "Enjoy 4-day journey through Tanzania's most famous parks staying at prestigious Serena Safari Lodges. Encounter incredible wildlife, observe animals in natural habitats, take in stunning landscapes. Led by professional driver-guide ensuring safe, enjoyable, memorable journey. Private 4x4 Land Cruiser with mineral water, power sockets, binoculars. Perfect combination of adventure, comfort, unforgettable experiences.",
        bestFor: ["Luxury experience", "Serena brand loyalty", "Premium lodges", "4-day circuit"],
        duration: "4 days / 3 nights",
        startEnd: "Arusha",
        highlights: [
            "Lake Manyara Serena Safari Lodge",
            "Serengeti Serena Safari Lodge",
            "Ngorongoro Serena Safari Lodge",
            "Premium game drives",
            "All 3 major parks"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arusha → Tarangire National Park",
                description: "Warm welcome and pickup from lodge or Kilimanjaro/Arusha Airport. Transfer to Tarangire National Park with packed lunch boxes. Famous for large elephant herds, iconic baobab trees, diverse wildlife. Game drive spotting lions, leopards, giraffes, zebras, fascinating bird species. Peaceful landscapes wonderful introduction to Tanzania wildlife. Late afternoon depart for Mto wa Mbu. Dinner and restful night at Lake Manyara Serena Safari Lodge.",
                overnight: "Lake Manyara Serena Safari Lodge"
            },
            {
                day: 2,
                title: "Serengeti National Park Full Day",
                description: "After breakfast, depart for Serengeti National Park - heart of Tanzania's wildlife. Upon arrival, game drive with lunch at suitable location inside park. Celebrated for vast migrating herds of wildebeest, zebras, antelopes. Encounter resident predators - lions, leopards, cheetahs showcasing fascinating circle of life. Endless savannah, rolling plains, dramatic skies offer breathtaking photography. Evening relax at Serengeti Serena Safari Lodge reflecting on thrilling wildlife encounters.",
                overnight: "Serengeti Serena Safari Lodge"
            },
            {
                day: 3,
                title: "Serengeti → Ngorongoro Conservation Area",
                description: "Wake up early for exciting morning and afternoon game drive in Serengeti when animals most active. After wonderful day of wildlife viewing, travel late afternoon to Ngorongoro Conservation Area. Stay overnight on rim of crater. From elevated location enjoy stunning views of surrounding landscapes, glimpse wildlife-filled crater below. Staying on rim allows early descent next morning when animals most active. Delicious dinner and peaceful night at Ngorongoro Serena Safari Lodge.",
                overnight: "Ngorongoro Serena Safari Lodge"
            },
            {
                day: 4,
                title: "Ngorongoro Crater → Arusha",
                description: "After breakfast, descend into Ngorongoro Crater for unforgettable game drive. Magnificent caldera - largest of its kind in world - home to incredible variety of wildlife including lions, elephants, rhinos, buffaloes, zebras, flamingos. Unique ecosystem provides wonderful opportunities for close encounters and excellent photography. Picnic lunch inside crater. Transfer back to Arusha bringing safari to memorable and satisfying conclusion.",
                overnight: ""
            }
        ],
        included: [
            "Dedicated professional driver-guide",
            "Private 4x4 Toyota Land Cruiser",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in program",
            "Transfers listed in itinerary",
            "Meals as specified (All meals Days 1-3, breakfast & lunch Day 4)"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Drinks at lodges/camps",
            "Laundry services",
            "Tips and personal expenses",
            "Anything not explicitly included",
            "Extra accommodation before/after safari"
        ],
        priceFrom: 2064,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/4-days-luxury-safari-serena/hero.jpg",
        destinations: ["tarangire", "serengeti", "ngorongoro"]
    },
    {
        id: "7-days-wildlife-safari-zanzibar-combo",
        name: "7 Days Wildlife Safari Experience - Serengeti, Ngorongoro & Zanzibar",
        slug: "7-days-wildlife-safari-zanzibar-combo",
        category: "Safari & Beach",
        shortDescription: "Perfect 7-day combo combining Serengeti/Ndutu/Ngorongoro safari with Zanzibar beach",
        overview: "This 7-day safari offers wonderful experience in Northern Tanzania visiting Serengeti, Ndutu, and Ngorongoro Crater. Enjoy rich wildlife, chances to see Big Five, witness wildebeest calving during Ndutu calving season. Comfortable mid-range lodges and beautiful sunsets provide safe, enjoyable, memorable safari adventure. Conclude with Zanzibar beach relaxation.",
        bestFor: ["Bush and beach combo", "Calving season", "Extended vacation", "Best of both worlds"],
        duration: "7 days / 6 nights",
        startEnd: "Arusha • Zanzibar",
        highlights: [
            "Fly-in to Serengeti saves time",
            "Ndutu calving season viewing",
            "Ngorongoro Crater exploration",
            "Zanzibar beach extension",
            "Makuyuni Wildlife Area"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arrival at Kilimanjaro Airport → Arusha",
                description: "Upon arrival at Kilimanjaro International Airport, warmly welcomed by representative holding sign with your name in arrivals hall. Comfortable transfer to accommodation in Arusha City. Relax and refresh in preparation for exciting safari journey. Dinner included.",
                overnight: "Four Point"
            },
            {
                day: 2,
                title: "Arusha → Fly to Central Serengeti",
                description: "After breakfast, pickup from Arusha hotel and transfer to Arusha Airport for scheduled light aircraft flight to Seronera Airstrip in heart of Serengeti National Park. Welcomed by safari guide, begin first exciting game drive in vast Serengeti plains. Camera ready for incredible wildlife - lions, elephants, leopards, giraffes, large herds of herbivores.",
                overnight: "Malaika Luxury Camp"
            },
            {
                day: 3,
                title: "Full Day Serengeti Game Drive",
                description: "Spend full day exploring heart of Serengeti searching for lions, elephants, cheetahs, remarkable wildlife while taking in breathtaking scenery. Midday proceed to lodge for hot delicious lunch with wildlife viewing opportunities. Rest and refresh, then exciting afternoon game drive across vast plains teeming with diverse animal life. Experienced guide assists spotting wildlife in winding river valleys and open savannah. Evening return to lodge for hearty dinner and peaceful overnight under starlit African sky.",
                overnight: "Malaika Luxury Camp"
            },
            {
                day: 4,
                title: "Serengeti → Ngorongoro Crater",
                description: "After breakfast at Serengeti camp, depart morning and drive toward Ngorongoro Conservation Area enjoying scenic game drive en route. Leave vast Serengeti plains behind, continue spotting wildlife - lions, elephants, zebras, giraffes during journey. Beautiful landscapes and chances to observe animals in natural habitat before arriving Ngorongoro area later in day. Reach lodge or camp, relax and enjoy dinner preparing for next day's adventure.",
                overnight: "Ole Farm Lodge"
            },
            {
                day: 5,
                title: "Karatu → Makuyuni Wildlife Area → Fly to Zanzibar",
                description: "After breakfast in Karatu, depart for Makuyuni Wildlife Area for morning game drive. Spot wildlife such as zebras, giraffes, elephants, antelopes. After game drive, transfer to Arusha Airport for scheduled flight to Zanzibar. Marks end of safari and start of beach holiday. Welcome and transfer to Fruits and Spice resort.",
                overnight: "Fruits and Spice"
            },
            {
                day: 6,
                title: "Zanzibar Full Day Activities",
                description: "Spend day enjoying beautiful island of Zanzibar. After breakfast, time to relax on white sandy beaches or participate in optional activities - Stone Town tour, spice tour, snorkeling, boat trip to explore clear turquoise waters of Indian Ocean. Return to hotel evening for dinner and overnight stay enjoying peaceful island atmosphere.",
                overnight: "Fruits and Spice"
            },
            {
                day: 7,
                title: "Departure from Zanzibar",
                description: "After breakfast at Zanzibar hotel, enjoy final moments on island. Depending on flight schedule, free time to relax at beach or explore nearby areas. Later transfer to Abeid Amani Karume International Airport for departure flight. End of memorable Tanzania safari and beach holiday.",
                overnight: ""
            }
        ],
        included: [
            "Dedicated professional driver-guide",
            "Private 4x4 Toyota Land Cruiser (safari-equipped)",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in program",
            "Domestic flights (Arusha-Serengeti, Arusha-Zanzibar)",
            "Free round-trip airport transfers",
            "Meals as specified per day"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Drinks at lodges and camps",
            "Laundry services",
            "Tips and personal expenses",
            "Optional Zanzibar activities",
            "Extra accommodation before/after safari"
        ],
        priceFrom: 1820,
        rating: 0,
        reviewCount: 0,
        imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800",
        destinations: ["serengeti", "ngorongoro", "zanzibar"]
    },
    {
        id: "6-days-kilimanjaro-machame-route",
        name: "6 Days Kilimanjaro Machame Route - Ethical Ascents",
        slug: "6-days-kilimanjaro-machame-route",
        category: "Trekking",
        shortDescription: "Conquer Africa's highest peak via scenic Machame 'Whiskey' Route",
        overview: "The Machame Route is a popular trekking route known as the 'Whiskey Route' due to its challenging nature. Considered one of most scenic routes offering stunning views of mountain and surrounding landscape. Takes 6-7 days, best suited for experienced hikers with good physical fitness. Greater chance of acclimatization and higher success rate for reaching summit. Start at Machame Gate, pass through lush forest, reach Shira Plateau, cross Barranco Wall, summit at Uhuru Peak.",
        bestFor: ["Experienced trekkers", "Scenic route", "High success rate", "Physical challenge"],
        duration: "6 days / 5 nights on mountain",
        startEnd: "Moshi / Arusha",
        highlights: [
            "Machame 'Whiskey' Route",
            "Stunning mountain views",
            "Better acclimatization profile",
            "Uhuru Peak summit (5,895m)",
            "Professional mountain guides"
        ],
        itinerary: [
            {
                day: 1,
                title: "Airport Pickup → Moshi Hotel",
                description: "Meet and greet by transfer guide at Kilimanjaro Airport. Drive to hotel in Moshi. Evening meet Mountain Guide for short briefing of climb next day. Kits and necessary equipment checked. Upon booking confirmation, provided detailed guideline regarding climate, clothing, footwear, baggage, equipment so participants can fully prepare prior to activity.",
                overnight: "Moshi Salsalinero Hotel"
            },
            {
                day: 2,
                title: "Marangu Gate (1,860m) → Mandara Hut (2,715m)",
                description: "Hiking time: 5 hours | Distance: 8.1 km | Habitat: Montane Forest. Drive from Moshi to Kilimanjaro National Park gate (50 minutes). Pass through Marangu village on lower slopes. At park gate, sign in at Park office, make final preparations. Porters arrange and load packs with food, water, cooking gas, equipment. Ascend cleared ridge trail through rain forest spotting Kilimanjaro's animals. Alternative scenic parallel forest trail available. Mandara hut features wooden A-framed huts with solar lighting, 6-8 sleeping bunks, capacity 60 climbers. Water piped from springs, flush toilets available.",
                overnight: "Mandara Hut"
            },
            {
                day: 3,
                title: "Mandara Hut (2,715m) → Horombo Hut (3,705m)",
                description: "Hiking time: 6 hours | Distance: 11.6 km | Habitat: Moorland. Trail passes through short stretch of forest, skirts base of Maundi Crater, emerges into transition from rain forest to moorland. Short detour to scramble up rim of Maundi Crater for first impressive view of Kibo Crater. Clear day, Kibo glimmers in distance with majestic glaciers in morning sun. Open moorland reveals Kilimanjaro's spectacular plants - endemic giant lobelia (up to 3m height) and giant groundsel (up to 5m). Reach Horombo hut for accommodation.",
                overnight: "Horombo Hut"
            },
            {
                day: 4,
                title: "Horombo Hut (3,705m) → Kibo Hut (4,730m)",
                description: "Hiking time: 6 hours | Distance: 9.6 km | Habitat: Alpine desert. Continue ascent into Alpine desert habitat. Two trails to 'Saddle' between Mawenzi and Kibo peaks. Upper route (right fork) very familiar from previous day toward Mawenzi hut - very stony and eroded. Recommended lower route (left fork) much easier, nearly hour shorter, passes last watering point at 4,130m. Fill water bottles for next two nights. Kibo hut is stone block house with bunk beds for 60 climbers, no streams nearby. Mineral water and soft drinks available at camp office. Platform toilets behind hut. Prepare equipment, ski-stick, thermal clothing for summit bid. Replace headlamp and camera batteries, carry spare set. Carry water in thermal flask to prevent freezing.",
                overnight: "Kibo Hut"
            },
            {
                day: 5,
                title: "Summit Day: Kibo Hut → Uhuru Peak (5,895m) → Horombo Hut",
                description: "Hiking time: 7-8 hours to Uhuru Peak | 6-8 hours descent to Horombo | Distance: 5.4km ascent, 15km descent | Habitat: Stone scree and ice-capped summit. Rise around 23:20, tea and biscuits, shuffle off into night - going really gets tough. First section rocky path to Hans Meyer Cave (5,150m) - good resting spot. Path zigzags up to Gillman's Point (5,681m) on crater rim - very steep with stone scree requiring great physical and mental effort. Most demanding section of entire route. Do Kili shuffle, move slowly. From Gillman's Point, normally encounter snow all way to Uhuru Peak (5,895m) - highest point in Africa. Weather conditions determine time spent taking photographs before 3-hour descent back to Kibo hut. Short rest, gather gear left behind, head down to Horombo hut (3 hours). Return seems surprisingly fast compared to ascent. Total walking time around 14 hours - very tough day. Last dinner on mountain, well-earned sleep.",
                overnight: "Horombo Hut"
            },
            {
                day: 6,
                title: "Horombo Hut (3,705m) → Marangu Gate (1,860m) → Moshi/Arusha",
                description: "Hiking time: 6 hours | Distance: 19.7 km. After breakfast, continue descent (6 hours) passing Mandara hut down to Marangu gate. At Marangu gate, receive summit certificates. Climbers who reached Gillman's Point (5,685m) issued green certificates; those who reached Uhuru Peak (5,895m) receive gold certificates. Drive back to Moshi/Arusha for long overdue hot shower, dinner and celebration. End of unforgettable Kilimanjaro climbing experience.",
                overnight: "Arusha Mvuli Hotel"
            }
        ],
        included: [
            "Arrival and departure transfers from/to Kilimanjaro International Airport",
            "Accommodation during trekking (huts/hotel)",
            "Meals during trekking (breakfast, lunch, dinner)",
            "Professional First Aider trained mountain guide",
            "All park fees, mountain rescue fees, government taxes",
            "Crew team, porters and cook",
            "Transport to and from mountain",
            "Emergency oxygen cylinder",
            "Summit certificates"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Travel insurance",
            "Personal gear rental",
            "Tips for crew (recommended: $10-15/porter/day, $15-20/cook/day, $20-25/guide/day)",
            "Medical equipment (hyperbaric chamber)",
            "Items of personal nature",
            "Extra accommodation before/after trek"
        ],
        priceFrom: 1850,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/6-days-kilimanjaro-machame-route/hero.jpg",
        destinations: []
    },
    {
        id: "7-days-shira-route-trekking",
        name: "7 Days Shira Route Trekking - Kilimanjaro Alternative Path",
        slug: "7-days-shira-route-trekking",
        category: "Trekking",
        shortDescription: "Unique Kilimanjaro trek via Shira Plateau with excellent acclimatization",
        overview: "The Shira Route offers a unique approach to Kilimanjaro starting at higher elevation via Shira Plateau. This alternative path provides excellent acclimatization opportunities and stunning volcanic landscapes. Trek through shrubs and giant heather, explore grassy moorland, visit Shira Cathedral rock formation, cross Lava Tower, climb Barranco Wall, and summit at Uhuru Peak. Ideal for trekkers seeking less crowded trails with spectacular scenery.",
        bestFor: ["Alternative route", "Acclimatization focus", "Volcanic landscapes", "Less crowded"],
        duration: "7 days / 6 nights on mountain",
        startEnd: "Moshi",
        highlights: [
            "Shira Plateau crossing",
            "Shira Cathedral rock formation",
            "Lava Tower acclimatization",
            "Barranco Wall climb",
            "Uhuru Peak summit (5,895m)"
        ],
        itinerary: [
            {
                day: 1,
                title: "Shira Gate to Simba Camp",
                description: "Depart Moshi for Londorossi Gate (4-hour drive). Complete entry formalities while guides and porters prepare equipment. Drive up steep path to Shira Gate where hike begins. Trek starts through shrubs and giant heather until reaching Simba Camp. Elevation: 11,800 ft. Hiking time: 1-2 hours. Distance: 4 km.",
                overnight: "Simba Camp"
            },
            {
                day: 2,
                title: "Simba Camp to Shira 2 Camp",
                description: "Fairly easy day helping with acclimatization. Explore grassy moorland and volcanic rock formations on plateau. Take scenic path to Shira Cathedral - huge buttress of rock surrounded by steep spires and pinnacles. Settle at Shira 2 Camp. Elevation: 11,800 ft to 12,500 ft. Hiking time: 2 hours. Distance: 6 km. Habitat: Heath.",
                overnight: "Shira 2 Camp"
            },
            {
                day: 3,
                title: "Shira 2 Camp → Lava Tower → Barranco Camp",
                description: "Continue east up ridge, head southeast toward Lava Tower - 300 ft tall volcanic rock formation. Descend through strange but beautiful Senecio Forest to Barranco Camp at 13,000 ft. Although beginning and ending day at same elevation, time spent at higher altitude very beneficial for acclimatization. Elevation: 12,500 ft to 15,190 ft to 13,044 ft. Hiking time: 4-5 hours + 2-3 hours. Distance: 7 km + 3 km. Habitat: Alpine Desert.",
                overnight: "Barranco Camp"
            },
            {
                day: 4,
                title: "Barranco Camp to Karanga Camp",
                description: "Begin day descending into ravine to base of Great Barranco Wall. Climb non-technical but steep, nearly 900 ft cliff. From top of Barranco Wall, cross series of hills and valleys until descending sharply into Karanga Valley. One more steep climb leads to Karanga Camp. Shorter day meant for acclimatization. Elevation: 13,044 ft to 13,106 ft. Hiking time: 4-5 hours. Distance: 5 km. Habitat: Alpine Desert.",
                overnight: "Karanga Camp"
            },
            {
                day: 5,
                title: "Karanga Camp to Barafu Camp",
                description: "Leave Karanga and hit junction connecting with Mweka Trail. Continue up to rocky section to Barafu Hut. At this point, completed Southern Circuit offering views of summit from many different angles. Make camp, rest, enjoy early dinner to prepare for summit day. Two peaks of Mawenzi and Kibo viewable from this position. Elevation: 13,106 ft to 15,331 ft. Hiking time: 4-5 hours. Distance: 4 km. Habitat: Alpine Desert.",
                overnight: "Barafu Camp"
            },
            {
                day: 6,
                title: "Summit Day: Barafu Camp → Uhuru Peak → Mweka Camp",
                description: "Very early morning (around midnight), begin push to summit - most mentally and physically challenging portion. Wind and cold at this elevation extreme. Ascend in darkness for several hours taking frequent short breaks. Near Stella Point (18,900 ft), rewarded with magnificent sunrise over Mawenzi Peak. Finally arrive at Uhuru Peak (19,341 ft) - highest point on Mount Kilimanjaro and continent of Africa. From summit, descend continuing straight down to Mweka Hut camp site, stopping at Barafu for lunch. Trail very rocky and hard on knees; trekking poles helpful. Mweka Camp situated in upper forest; mist or rain expected late afternoon. Evening enjoy last dinner on mountain and well-earned sleep. Hiking time: 7-8 hours up + 4-6 hours down. Distance: 5 km + 12 km.",
                overnight: "Mweka Camp"
            },
            {
                day: 7,
                title: "Mweka Camp to Mweka Gate → Moshi",
                description: "Last day, continue descent to Mweka Gate and collect summit certificates. At lower elevations, can be wet and muddy. From gate, continue another hour to Mweka Village. Vehicle meets at Mweka Village to drive back to hotel in Moshi. Elevation: 10,065 ft to 5,380 ft. Hiking time: 3-4 hours. Distance: 10 km. Habitat: Rain Forest.",
                overnight: "Moshi Hotel"
            }
        ],
        included: [
            "Arrival and departure transfers from/to Kilimanjaro International Airport",
            "Accommodation during trekking (tents/camps)",
            "Meals during trekking (breakfast, lunch, dinner - 3 times daily)",
            "Private portable toilet",
            "Professional First Aider trained guide",
            "All park fees, mountain rescue fees, government taxes",
            "Crew team, porters and cook",
            "Highest quality tents (Eureka or Mountain Hardware)",
            "Transport to and from mountain",
            "Emergency oxygen cylinder",
            "Mattress and sleeping bag",
            "Summit certificates"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Travel insurance",
            "Personal gear beyond provided equipment",
            "Tips for crew (recommended: $10-15/porter/day, $15-20/cook/day, $20-25/guide/day)",
            "Medical equipment (hyperbaric chamber)",
            "Items of personal nature",
            "Extra accommodation before/after trek"
        ],
        priceFrom: 2100,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/7-days-shira-route-trekking/hero.jpg",
        destinations: []
    },
    {
        id: "8-days-lemosho-route-kilimanjaro",
        name: "8 Days Lemosho Route Kilimanjaro - Most Scenic Trail",
        slug: "8-days-lemosho-route-kilimanjaro",
        category: "Trekking",
        shortDescription: "Premium 8-day Kilimanjaro climb via most scenic Lemosho Route",
        overview: "The Lemosho Route is considered the most scenic trail on Kilimanjaro, granting panoramic vistas on various sides of the mountain. As one of newer routes, Lemosho is superb choice due to ideal balance of low crowds, beautiful scenery, and high summit success rate. Route approaches from west, beginning with long drive to Londorossi Gate. First two days trek through rainforest to Shira Ridge. Cross entire Shira Plateau west to east in pleasant, relatively flat hike. Crowds low until joining Machame route near Lava Tower. Traverse underneath Southern Ice Field on Southern Circuit before summiting from Barafu. Descent via Mweka route.",
        bestFor: ["Most scenic route", "High success rate", "Low crowds", "Premium experience"],
        duration: "8 days / 7 nights on mountain",
        startEnd: "Moshi",
        highlights: [
            "Most scenic Kilimanjaro route",
            "Panoramic mountain vistas",
            "Low crowds and solitude",
            "High summit success rate",
            "Shira Plateau crossing",
            "Southern Circuit traverse"
        ],
        itinerary: [
            {
                day: 1,
                title: "Londorossi Gate to Mti Mkubwa",
                description: "Depart Moshi for Londorossi Gate (4-hour drive). Complete entry formalities. Drive to Lemosho trailhead. Begin hiking through undisturbed forest winding to first campsite. Exotic moss and flowers delight eye while bird calls entertain ear. May see Black and White Colobus monkeys and signs of elephants. Elevation: 7,742 ft to 9,498 ft. Hiking time: 3-4 hours. Distance: 6 km. Habitat: Rain Forest.",
                overnight: "Mti Mkubwa (Forest Camp)"
            },
            {
                day: 2,
                title: "Mti Mkubwa to Shira 1 Camp",
                description: "Continue on trail leading out of rain forest into savannah of tall grasses, heather, and volcanic rock draped with lichen beards. Ascend through lush rolling hills, cross several streams, reach Shira Ridge before dropping gently to Shira 1 Camp. Catch first glimpse of Kibo across plateau. Elevation: 9,498 ft to 11,500 ft. Hiking time: 5-6 hours. Distance: 8 km. Habitat: Heath.",
                overnight: "Shira 1 Camp"
            },
            {
                day: 3,
                title: "Shira 1 Camp to Moir Hut",
                description: "Explore Shira Plateau for full day. Gentle walk east on moorland meadows toward Shira 2 Camp. Divert from main trail to Moir Hut - little used site on base of Lent Hills. Variety of walks available on Lent Hills making excellent acclimatization opportunity. Shira Plateau is one of highest plateaus on earth. Elevation: 11,500 ft to 13,800 ft. Hiking time: 5-7 hours. Distance: 11 km. Habitat: Heath.",
                overnight: "Moir Hut"
            },
            {
                day: 4,
                title: "Moir Hut → Lava Tower → Barranco Camp",
                description: "Begin day climbing up ridge, head southeast toward Lava Tower - 300 ft tall volcanic rock formation. Descend through strange but beautiful Senecio Forest to Barranco Camp at 13,000 ft. Although beginning and ending day at same elevation, time spent at higher altitude benefits acclimatization. Elevation: 13,800 ft to 15,190 ft to 13,044 ft. Hiking time: 4-5 hours + 2-3 hours. Distance: 7 km + 3 km. Habitat: Alpine Desert.",
                overnight: "Barranco Camp"
            },
            {
                day: 5,
                title: "Barranco Camp to Karanga Camp",
                description: "Begin day descending into ravine to base of Great Barranco Wall. Climb non-technical but steep, nearly 900 ft cliff. From top of Barranco Wall, cross series of hills and valleys until descending sharply into Karanga Valley. One more steep climb leads to Karanga Camp. Shorter day meant for acclimatization. Elevation: 13,044 ft to 13,106 ft. Hiking time: 4-5 hours. Distance: 5 km. Habitat: Alpine Desert.",
                overnight: "Karanga Camp"
            },
            {
                day: 6,
                title: "Karanga Camp to Barafu Camp",
                description: "Leave Karanga and hit junction connecting with Mweka Trail. Continue up to rocky section to Barafu Hut. At this point, completed Southern Circuit offering views of summit from many different angles. Make camp, rest, enjoy early dinner to prepare for summit day. Two peaks of Mawenzi and Kibo viewable from this position. Elevation: 13,106 ft to 15,331 ft. Hiking time: 4-5 hours. Distance: 4 km. Habitat: Alpine Desert.",
                overnight: "Barafu Camp"
            },
            {
                day: 7,
                title: "Summit Day: Barafu Camp → Uhuru Peak → Mweka Camp",
                description: "Very early morning (around midnight), begin push to summit - most mentally and physically challenging portion. Wind and cold at this elevation extreme. Ascend in darkness for several hours taking frequent short breaks. Near Stella Point (18,900 ft), rewarded with magnificent sunrise over Mawenzi Peak. Finally arrive at Uhuru Peak (19,341 ft) - highest point on Mount Kilimanjaro and continent of Africa. From summit, descend continuing straight down to Mweka Hut camp site, stopping at Barafu for lunch. Trail very rocky and hard on knees; trekking poles helpful. Mweka Camp situated in upper forest; mist or rain expected late afternoon. Evening enjoy last dinner on mountain and well-earned sleep. Hiking time: 7-8 hours up + 4-6 hours down. Distance: 5 km + 12 km.",
                overnight: "Mweka Camp"
            },
            {
                day: 8,
                title: "Mweka Camp to Mweka Gate → Moshi",
                description: "Last day, continue descent to Mweka Gate and collect summit certificates. At lower elevations, can be wet and muddy. From gate, continue another hour to Mweka Village. Vehicle meets at Mweka Village to drive back to hotel in Moshi. Elevation: 10,065 ft to 5,380 ft. Hiking time: 3-4 hours. Distance: 10 km. Habitat: Rain Forest.",
                overnight: "Moshi Hotel"
            }
        ],
        included: [
            "Arrival and departure transfers from/to Kilimanjaro International Airport",
            "Accommodation during trekking (premium tents)",
            "Meals during trekking (breakfast, lunch, dinner - 3 times daily)",
            "Private portable toilet",
            "Professional First Aider trained guide",
            "All park fees, mountain rescue fees, government taxes",
            "Crew team, porters and cook",
            "Highest quality tents (Eureka or Mountain Hardware)",
            "Transport to and from mountain",
            "Emergency oxygen cylinder",
            "Mattress and sleeping bag",
            "Summit certificates"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Travel insurance",
            "Personal gear beyond provided equipment",
            "Tips for crew (recommended: $10-15/porter/day, $15-20/cook/day, $20-25/guide/day)",
            "Medical equipment (hyperbaric chamber)",
            "Items of personal nature",
            "Extra accommodation before/after trek"
        ],
        priceFrom: 2400,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/8-days-lemosho-route-kilimanjaro/hero.jpg",
        destinations: []
    },
    {
        id: "8-days-northern-circuit-route",
        name: "8 Days Northern Circuit Route Kilimanjaro - Newest & Best",
        slug: "8-days-northern-circuit-route",
        category: "Trekking",
        shortDescription: "Ultimate 8-day Kilimanjaro experience via newest Northern Circuit Route",
        overview: "The Northern Circuit Route is the newest route up Mount Kilimanjaro and arguably the best. Combination of all best elements of other routes rolled into one fantastic hike. Looking for beautiful scenery, plenty of solitude, healthy challenge, and potential to spot wildlife? This is definitely the route. Follows same route as Lemosho for first few days, but rather than sticking to south side of Kibo, turns to little-used northern trails instead. Path virtually devoid of other trekkers - campsites quiet, peaceful, practically deserted. Longer than other trails, gives trekkers chance to take in more of mountain. Hike across awe-inspiring Shira Plateau, catch glimpses of Kibo Peak and Uhuru Summit along way. Provides amazing views down onto open plains north of mountain - seen by only handful of other hikers.",
        bestFor: ["Newest route", "Maximum solitude", "Best acclimatization", "Wildlife spotting", "Longest trek"],
        duration: "8 days / 7 nights on mountain",
        startEnd: "Moshi / Arusha",
        highlights: [
            "Newest and longest Kilimanjaro route",
            "Virtually no other trekkers",
            "Northern trails solitude",
            "Amazing northern plains views",
            "Best acclimatization profile",
            "Highest summit success rate"
        ],
        itinerary: [
            {
                day: 1,
                title: "Lemosho Glades - Forest Camp",
                description: "From lodge, make way to Londorosi Gate on Western side of Mt. Kilimanjaro (few hours drive from Arusha). Begin hike at Lemosho trail head. Note: in rainy/muddy conditions, sometimes vehicles can't make it to true trailhead so there can be extra hiking. After picnic lunch, hike about 4 hours to forest camp. In forest, exotic moss and flowers delight eye while bird calls entertain ear. May see Black and White Colobus monkeys as well as signs of elephants traveling in area. Hiking: 4-5 hours. Overnight Altitude: ~9,498 ft.",
                overnight: "Forest Camp"
            },
            {
                day: 2,
                title: "Shira Plateau",
                description: "Leave Montane Forest, enter Hagenia zone. Views open and catch first views of Kibo peak. Good acclimatization hike - go up and down several ridges along way to highest point of day at 11,500 ft before descending to camp. Hiking: 6-9 hours. Overnight Altitude: 11,500 ft.",
                overnight: "Shira 1 Camp"
            },
            {
                day: 3,
                title: "Moir Camp",
                description: "Traverse Heath zone of Shira Plateau, begin climbing western slope of Kibo Massif. Along way, enjoy picnic lunch at Scott Fisher memorial camp (well-known Mt. Everest guide). Continue to upper heath zone and Moir camp. Depending on weather, acclimatization hikes can be arranged in late afternoon. Hiking: 5-6 hours. Overnight Altitude: ~13,580 ft.",
                overnight: "Moir Camp"
            },
            {
                day: 4,
                title: "Pofu/Buffalo Camp",
                description: "Hike about 4-7 hours depending on stops along way. Quite a ridge to climb up departing Moir camp, so best to start out very slowly until cresting ridge. Great acclimatization day. Hiking: 5-7 hours. Overnight Altitude: ~13,200 ft.",
                overnight: "Pofu/Buffalo Camp"
            },
            {
                day: 5,
                title: "Third Cave Camp",
                description: "Continue traverse around northern side of Mount Kilimanjaro with expansive views, finding way to Third Cave Camp. Hiking: 5-7 hours. Overnight Altitude: ~12,700 ft.",
                overnight: "Third Cave Camp"
            },
            {
                day: 6,
                title: "School Huts Camp",
                description: "Get into highest elevation camp today. Try to get to bed early for rest before starting night-time summit ascent (usually starting around midnight) to Gilman's Point, through Stella Point, and for final push up to summit. Hiking: 4-5 hours. Overnight Altitude: ~15,600 ft.",
                overnight: "School Huts Camp"
            },
            {
                day: 7,
                title: "Summit Day and Mweka Camp",
                description: "Summit day. Start ascent to summit (19,340 ft / 5,896 m) around 11:00 PM or midnight night prior. Goal for you and numerous other climbers is to reach peak right at sunrise. In reality, due to differences in hiking speed, energy, and altitude acclimatization, there is several hour span where most climbers reach summit. Using headlamps (bring extra lithium batteries which last much better in cold dark conditions!), ascend 6-7 hours to Gilman's Point, traverse Crater Rim to Stella Point, then up another 1-2 hours to Uhuru Peak - the summit. After summit celebration and photo, descend to Barafu camp for lunch, then to Mweka camp to sleep overnight. By advance request can sleep at Millennium Camp instead (at ~12,000 ft so less descent today but means more descent tomorrow). Hiking: Very variable on both up and down; 13-17 hours typical. Summit: 19,341 ft. Overnight Altitude: 10,065 ft.",
                overnight: "Mweka Camp (or Millennium Camp by request)"
            },
            {
                day: 8,
                title: "Mweka Park Gate → Town",
                description: "Make final descent to trailhead today - about 3-5 hours hiking. Here have lunch and say goodbye to mountain crew before leaving Mount Kilimanjaro and heading back to town. Arrive at lodge usually between 3-5 PM. Hiking: 3-5 hours.",
                overnight: "Moshi/Arusha Hotel"
            }
        ],
        included: [
            "Arrival and departure transfers from/to Kilimanjaro International Airport",
            "Accommodation during trekking (premium tents)",
            "Meals during trekking (breakfast, lunch, dinner - 3 times daily)",
            "Private portable toilet",
            "Professional First Aider trained guide",
            "All park fees, mountain rescue fees, government taxes",
            "Crew team, porters and cook",
            "Highest quality tents (Eureka or Mountain Hardware)",
            "Transport to and from mountain",
            "Emergency oxygen cylinder",
            "Mattress and sleeping bag",
            "Summit certificates"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Travel insurance",
            "Personal gear beyond provided equipment",
            "Tips for crew (recommended: $10-15/porter/day, $15-20/cook/day, $20-25/guide/day)",
            "Medical equipment (hyperbaric chamber)",
            "Items of personal nature",
            "Extra accommodation before/after trek"
        ],
        priceFrom: 3300,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/8-days-northern-circuit-route/hero.jpg",
        destinations: []
    },
    {
        id: "9-day-honeymoon-safari-zanzibar",
        name: "9-Day Best Honeymoon Safari & Zanzibar Beach Relaxation",
        slug: "9-day-honeymoon-safari-zanzibar",
        category: "Safari & Beach",
        shortDescription: "Ultimate 9-day honeymoon combining Tanzania's top parks with Zanzibar beaches",
        overview: "Enjoy 9-day honeymoon safari & Zanzibar beach holiday exploring Tanzania's top northern parks. Begin in Tarangire known for majestic baobab trees and large herds of African elephants. Visit Lake Manyara - beautiful park for tree-climbing lions and abundant birdlife. Discover breathtaking Ngorongoro Crater home to endangered black rhinos. Experience Serengeti famed for Great Wildebeest Migration. Conclude on Zanzibar Island relaxing and enjoying peaceful beaches. Perfect romantic combination of wildlife adventure and tropical relaxation.",
        bestFor: ["Honeymoon", "Romance", "Luxury experience", "Complete Tanzania", "Bush and beach"],
        duration: "9 days / 8 nights",
        startEnd: "Arusha • Zanzibar",
        highlights: [
            "All 4 northern circuit parks",
            "Great Migration viewing",
            "Ngorongoro Crater exploration",
            "Zanzibar beach extension",
            "Premium accommodations throughout",
            "Perfect for honeymooners"
        ],
        itinerary: [
            {
                day: 1,
                title: "Arrival at Airport → Arusha",
                description: "Upon arrival at Kilimanjaro International Airport or Arusha Airport, warmly welcomed by representative. Private driver-guide escorts to accommodation in Arusha. Enjoy delicious dinner and comfortable overnight stay. Time to relax and prepare for start of safari following day. Dinner included.",
                overnight: "Arusha Serena Hotel"
            },
            {
                day: 2,
                title: "Arusha → Tarangire National Park",
                description: "Early morning after breakfast, depart for Tarangire National Park. Park named after Tarangire River which flows through it and serves as only water source for wildlife during dry season. Landscape features dense vegetation including elephant grass, acacia woodlands, lush groundwater forests. Famous for large elephant herds often seen gathering near river, giraffes, bushbucks, hartebeests. Predators such as lions and leopards closely follow herds. Park hosts more breeding bird species than anywhere else in world. After picnic lunch, continue afternoon game drive enjoying incredible wildlife and scenery. Head to lodge in Tarangire for dinner and comfortable overnight stay.",
                overnight: "Tarangire Ndovu Tented Lodge"
            },
            {
                day: 3,
                title: "Tarangire → Lake Manyara National Park",
                description: "After breakfast, leave for Lake Manyara National Park - beautiful place known for many birds and tree-climbing lions. Park bordered by Rift Valley to west and shallow Lake Manyara to east which attracts thousands of flamingos during rainy season. Name comes from Maasai word emanyara - plant used to build protective homesteads (bomas). Park has mix of savannah and forest. Spot giraffes, zebras, wildebeests, buffaloes, elephants, lions in trees. Full day wildlife viewing and lunch. Head to Ngare Lodge for dinner and overnight stay.",
                overnight: "Ngare Lodge"
            },
            {
                day: 4,
                title: "Mto wa Mbu → Ngorongoro Crater → Serengeti",
                description: "Early morning after breakfast, depart for Ngorongoro Crater. First view of crater like stepping into lost world. See endangered black rhinos, lions, many other animals. Formed two to three million years ago from collapsed volcano - both natural wonder and rich wildlife reserve. Drive down exciting. On crater floor find wildebeest, zebras, gazelles, over 500 bird species. Packed lunch. Continue to Serengeti National Park. Dinner and overnight stay at Tukaone Hembe Camp.",
                overnight: "Tukaone Hembe Camp"
            },
            {
                day: 5,
                title: "Full Day Serengeti Game Drive",
                description: "Early morning after breakfast, set out for game drive in Serengeti National Park searching for big cats and experiencing park's incredible wildlife. World-famous for natural beauty and remarkable concentration of plains animals. Renowned for legendary great wildebeest migration when over million wildebeest and around 200,000 zebras move across plains in search of fresh grazing. Migration follows ancient patterns crossing rivers and rugged terrain with remarkable determination. Serengeti truly offers unforgettable wildlife experience. Late afternoon return to accommodation for dinner and overnight stay.",
                overnight: "Tukaone Hembe Camp"
            },
            {
                day: 6,
                title: "Central Serengeti → Northern Serengeti Migration Viewing",
                description: "Travel from Central to Northern Serengeti to witness amazing great wildebeest migration. See millions of wildebeest and thousands of zebras moving across plains along with lions, elephants, many other animals in natural habitat. Serengeti's wide-open landscapes and abundant wildlife make unforgettable experience. Full day game viewing. Return to Safari Haven for dinner and overnight stay.",
                overnight: "Safari Haven Migration Camp"
            },
            {
                day: 7,
                title: "Northern Serengeti → Fly to Zanzibar Island",
                description: "After final morning game drive in Northern Serengeti National Park, transferred to airstrip for flight to Zanzibar Island. On arrival, met and transferred to Z Hotel in Nungwi. Relax and enjoy beautiful beaches and tranquil surroundings marking perfect end to safari adventure. Breakfast and dinner included.",
                overnight: "Z Hotel, Nungwi"
            },
            {
                day: 8,
                title: "Relaxing Day in Nungwi - Northern Coast Zanzibar",
                description: "Spend relaxing day in Nungwi enjoying sun, white sandy beaches, turquoise waters at Z Hotel. Perfect opportunity to unwind and soak in peaceful atmosphere of tropical paradise. Nungwi on northern coast famous for glowing white coral sand. Despite lively atmosphere, still feels private and calm. Wide beach ideal for swimming and snorkeling in clear reef-filled waters. Unlike many other beaches in Zanzibar, Nungwi not affected by large tidal changes allowing water activities all day. Many activities to enjoy including walking tours, diving, parasailing, sunset cruises. Simply watching traditional dhow boats drift along horizon at sunset enough to fall in love with this beautiful beach. Breakfast and dinner included.",
                overnight: "Z Hotel, Nungwi"
            },
            {
                day: 9,
                title: "Departure from Zanzibar",
                description: "After breakfast and final moment to relax at hotel in Nungwi, transferred to airport or ferry. Marks conclusion of wonderful journey leaving cherished memories of stunning landscapes, wildlife, tranquil beaches experienced. Sincerely thank you for trusting and joining this trip. Warmly welcome to travel again in future. Breakfast included.",
                overnight: ""
            }
        ],
        included: [
            "All transfers as listed in itinerary",
            "Round-trip airport pick-up and drop-off",
            "Domestic flight from Serengeti to Zanzibar",
            "Dedicated professional driver-guide",
            "Private 4x4 Toyota Land Cruiser (safari-equipped)",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities listed in program",
            "Meals as specified per day"
        ],
        excluded: [
            "International flights",
            "Visa fees",
            "Drinks at lodges and camps",
            "Laundry services",
            "Tips and personal expenses",
            "Anything not clearly listed as included",
            "Extra accommodation before/after safari"
        ],
        priceFrom: 4902,
        rating: 0,
        reviewCount: 0,
        imageUrl: "/images/tours/9-day-honeymoon-safari-zanzibar/hero.jpg",
        destinations: ["tarangire", "lake-manyara", "ngorongoro", "serengeti", "zanzibar"]
    }
];

export function getTourBySlug(slug: string): TourPackage | undefined {
    return tourPackages.find(t => t.slug === slug);
}

export function getToursByCategory(category: string): TourPackage[] {
    return tourPackages.filter(t => t.category === category);
}

// NEW: Get tours by destination slug
export function getToursByDestination(destinationSlug: string): TourPackage[] {
    return tourPackages.filter(t => t.destinations?.includes(destinationSlug));
}
