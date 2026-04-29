import type { 
    Wildlife, 
    Activity, 
    DestinationAccommodation, 
    Itinerary, 
    TravelTip, 
    DestinationFAQ, 
    Destination 
} from '@/types/destinations';

// Re-export types with original names for backward compatibility
export type { Wildlife, Activity, Itinerary, TravelTip, Destination };
export type Accommodation = DestinationAccommodation;
export type FAQ = DestinationFAQ;

export const destinations: Destination[] = [
    {
        id: "serengeti",
        name: "Serengeti National Park",
        slug: "serengeti",
        region: "Northern Circuit",
        shortDescription: "Tanzania's most famous park, known for big cats and the Great Migration",
        whyVisit: "The Serengeti is Tanzania's most famous park, known for big cats, endless plains, and the Great Migration (seasonal).",
        fullDescription: "The Serengeti National Park is Tanzania's oldest and most popular national park, a world heritage site and recently proclaimed one of the 7 natural wonders of Africa. The word 'Serengeti' comes from the Maasai language meaning 'endless plains'. This iconic destination covers 14,750 square kilometers of rolling grasslands, savanna, and riverine forests, supporting the largest remaining unaltered animal migration in the world.\n\nHome to over 3 million large mammals, including the spectacular Great Migration of 1.5 million wildebeest and hundreds of thousands of zebras and gazelles, the Serengeti offers unparalleled wildlife viewing opportunities year-round. The park boasts exceptional predator populations with lions, leopards, cheetahs, and hyenas thriving in this abundant ecosystem.",

        // Quick Facts
        parkSize: "14,750 km²",
        elevation: "920-1,850m above sea level",
        established: "1951",
        nearestAirport: "Seronera Airstrip (SEU)",
        distanceFromArusha: "325 km (8-9 hours drive) or 1 hour flight",
        recommendedStay: "3-4 nights minimum",

        // Wildlife
        bigFive: ["Lion", "Leopard", "Elephant", "Buffalo", "Rhino (rare)"],
        keySpecies: ["Wildebeest", "Zebra", "Gazelle", "Giraffe", "Hippos", "Crocodiles"],
        birdWatching: true,
        uniqueSpecies: ["Kori Bustard (heaviest flying bird)", "Secretary Bird", "Ostrich"],
        wildlifeRating: 5,

        // Best Time
        bestTimeToGo: [
            "Year-round for wildlife",
            "Migration focus: June-October"
        ],
        peakSeason: "June-October (dry season, migration crossings)",
        lowSeason: "March-May (long rains)",
        monthlyBreakdown: [
            { month: "Jan-Feb", wildlife: "Calving season in Southern Serengeti", weather: "Warm, short rains possible", rating: 4 },
            { month: "Mar-May", wildlife: "Migration moves west", weather: "Long rains, lush green", rating: 3 },
            { month: "Jun-Jul", wildlife: "Grumeti River crossings begin", weather: "Cool, dry", rating: 5 },
            { month: "Aug-Oct", wildlife: "Mara River crossings (peak)", weather: "Dry, excellent visibility", rating: 5 },
            { month: "Nov-Dec", wildlife: "Migration returns south", weather: "Short rains, good birding", rating: 4 }
        ],

        // Activities
        activities: [
            { name: "Game Drives", description: "Morning, afternoon, and full-day drives across the plains", duration: "2-8 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Hot Air Balloon Safari", description: "Sunrise balloon flight over the Serengeti with champagne breakfast", duration: "3-4 hours", difficulty: "Easy", bestTime: "Dry season" },
            { name: "Walking Safaris", description: "Guided nature walks in designated areas", duration: "2-3 hours", difficulty: "Moderate", bestTime: "Dry season" },
            { name: "Photography Safaris", description: "Specialized tours for wildlife photographers", duration: "Full day", difficulty: "Easy", bestTime: "Golden hours" },
            { name: "Maasai Village Visit", description: "Cultural experience with local Maasai communities", duration: "2-3 hours", difficulty: "Easy", bestTime: "Year-round" }
        ],

        // Highlights
        highlights: [
            "Lions, leopards, cheetahs",
            "Sunrise game drives",
            "Migration river crossings (seasonal)"
        ],

        // Landscape
        landscape: "Vast open grasslands, kopjes (rocky outcrops), acacia woodlands, and riverine forests along the Grumeti and Mara rivers",
        ecosystems: ["Short-grass plains", "Wooded grasslands", "Riverine forests", "Kopje formations"],

        // Accommodations
        accommodations: [
            { name: "Four Seasons Safari Lodge", type: "Luxury", description: "Ultra-luxury lodge with infinity pool overlooking waterhole", priceRange: "$1,500-$3,000/night", features: ["Spa", "Fine dining", "Private plunge pools"] },
            { name: "Serengeti Serena Lodge", type: "Mid-Range", description: "Hilltop lodge with panoramic views", priceRange: "$400-$700/night", features: ["Pool", "Restaurant", "Cultural boma"] },
            { name: "Serengeti Kati Kati Tented Camp", type: "Mid-Range", description: "Mobile camp following the migration", priceRange: "$350-$600/night", features: ["En-suite tents", "Bush dining", "Migration proximity"] },
            { name: "Public Campsites", type: "Camping", description: "Basic campsites throughout the park", priceRange: "$30-$50/person", features: ["Shared facilities", "Bring own equipment"] }
        ],

        // Getting There
        gettingThere: {
            byAir: "Daily scheduled flights from Arusha, Kilimanjaro, Dar es Salaam, and Nairobi to Seronera, Kogatende, or Kusini airstrips",
            byRoad: "8-9 hour drive from Arusha via Ngorongoro Conservation Area (scenic route)",
            transferTime: "1 hour by air, 8-9 hours by road"
        },

        // Itineraries
        suggestedItineraries: "3–4 nights for a strong safari experience",
        sampleItineraries: [
            {
                title: "Serengeti Express",
                duration: "3 days",
                days: [
                    { day: 1, title: "Central Serengeti Exploration", description: "Arrive at Seronera, afternoon game drive in central Serengeti focusing on big cats" },
                    { day: 2, title: "Full Day Game Drive", description: "Full day exploring northern or southern regions depending on migration location" },
                    { day: 3, title: "Seronera River Valley & Departure", description: "Morning game drive along Seronera River, departure after lunch" }
                ]
            },
            {
                title: "Complete Serengeti Experience",
                duration: "5 days",
                days: [
                    { day: 1, title: "Arrival & Central Serengeti", description: "Fly into Seronera, afternoon game drive" },
                    { day: 2, title: "Seronera Valley", description: "Full day exploring Seronera Valley - prime lion territory" },
                    { day: 3, title: "Western Corridor", description: "Drive to western corridor, Grumeti River exploration" },
                    { day: 4, title: "Northern Serengeti", description: "Head north towards Mara River for crossing opportunities (seasonal)" },
                    { day: 5, title: "Final Game Drive & Departure", description: "Morning game drive, fly out from Kogatende airstrip" }
                ]
            }
        ],

        // Conservation
        conservation: "The Serengeti is part of the larger Serengeti-Mara ecosystem, one of the most intact ecosystems on Earth. Conservation efforts focus on anti-poaching patrols, human-wildlife conflict mitigation, and maintaining wildlife corridors.",
        communityInitiatives: "Revenue sharing with local Maasai communities, employment opportunities, and support for schools and health clinics",

        // Cultural
        culturalContext: "The Serengeti region is traditional Maasai land. The Maasai people have coexisted with wildlife for centuries, their pastoral lifestyle complementing conservation efforts.",
        localTribes: ["Maasai"],

        // Travel Tips
        travelTips: [
            { category: "What to Pack", tips: ["Neutral-colored clothing", "Binoculars", "Camera with telephoto lens", "Sunscreen and hat", "Warm layers for early mornings"] },
            { category: "Health", tips: ["Malaria prophylaxis recommended", "Yellow fever vaccination required", "Drink bottled water only"] },
            { category: "Best Photography Times", tips: ["Golden hour (6-8 AM, 5-7 PM)", "Overcast days for soft light", "Dust adds atmosphere during dry season"] }
        ],

        // FAQs
        faqs: [
            { question: "When is the best time to see the Great Migration?", answer: "The migration is year-round, but river crossings occur July-October in the north. Calving season is January-February in the south." },
            { question: "How many days do I need in Serengeti?", answer: "Minimum 3 days, but 4-5 days allows better exploration of different regions." },
            { question: "Is Serengeti safe?", answer: "Yes, when staying in your vehicle during game drives and following guide instructions. Lodges and camps are secure." },
            { question: "Can I self-drive in Serengeti?", answer: "Self-driving is allowed but not recommended for first-time visitors. Guided safaris provide better wildlife spotting and safety." }
        ],

        // Related
        relatedDestinations: ["ngorongoro", "tarangire", "lake-manyara"],

        // Media
        imageUrl: "/images/destinations/serengeti/serengeti.jpg",
        gallery: [
            "/images/destinations/serengeti/serengeti.jpg",
            "/images/destinations/serengeti/serengeti-lions.jpg",
            "/images/destinations/serengeti/serengeti-sunset.jpg",
            "/images/destinations/serengeti/serengeti-elephants.jpg",
            "/images/destinations/serengeti/serengeti-cheetah.jpg"
        ]
    },
    {
        id: "ngorongoro",
        name: "Ngorongoro Crater",
        slug: "ngorongoro",
        region: "Northern Circuit",
        shortDescription: "A natural wildlife sanctuary inside an ancient volcanic caldera",
        whyVisit: "A natural wildlife sanctuary inside an ancient volcanic caldera with excellent game viewing in one day.",
        fullDescription: "The Ngorongoro Crater is the world's largest intact volcanic caldera and one of Africa's most spectacular natural wonders. Formed 2-3 million years ago when a massive volcano exploded and collapsed on itself, this UNESCO World Heritage Site creates a natural enclosure spanning 260 square kilometers.\n\nOften called 'Africa's Eden' or 'The Eighth Wonder of the World', the crater floor sits 600 meters below the rim and supports an incredible density of wildlife. With over 25,000 large animals including the endangered black rhino, the Ngorongoro Crater offers some of the best game viewing in Africa, all within a single day's drive.\n\nBeyond the crater, the Ngorongoro Conservation Area encompasses diverse landscapes from highland forests to grassy plains, and is home to the Maasai people who continue their traditional pastoral lifestyle alongside wildlife.",

        // Quick Facts
        parkSize: "8,292 km² (Conservation Area), Crater floor: 260 km²",
        elevation: "1,027-3,648m (crater floor to rim)",
        established: "1959 (Conservation Area)",
        nearestAirport: "Lake Manyara Airport (LKY) or Kilimanjaro (JRO)",
        distanceFromArusha: "180 km (3-4 hours drive)",
        recommendedStay: "1-2 nights",

        // Wildlife
        bigFive: ["Lion", "Leopard", "Elephant", "Buffalo", "Black Rhino"],
        keySpecies: ["Spotted Hyena", "Wildebeest", "Zebra", "Flamingos", "Hippos"],
        birdWatching: true,
        uniqueSpecies: ["Black Rhino (endangered)", "Lesser Flamingos", "Kori Bustard"],
        wildlifeRating: 5,

        // Best Time
        bestTimeToGo: [
            "Year-round",
            "Dry season offers easier viewing"
        ],
        peakSeason: "June-October (dry season)",
        lowSeason: "March-May (long rains)",
        monthlyBreakdown: [
            { month: "Jan-Feb", wildlife: "Excellent year-round viewing", weather: "Warm, occasional rain", rating: 4 },
            { month: "Mar-May", wildlife: "Good viewing, fewer crowds", weather: "Long rains, muddy roads", rating: 3 },
            { month: "Jun-Oct", wildlife: "Peak season, best visibility", weather: "Cool, dry, clear skies", rating: 5 },
            { month: "Nov-Dec", wildlife: "Good wildlife, migratory birds arrive", weather: "Short rains possible", rating: 4 }
        ],

        // Activities
        activities: [
            { name: "Crater Floor Game Drive", description: "Full-day descent into the crater for exceptional wildlife viewing", duration: "6-8 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Empakaai Crater Hike", description: "Hike to beautiful crater lake with flamingos", duration: "Half day", difficulty: "Moderate", bestTime: "Dry season" },
            { name: "Maasai Village Visit", description: "Cultural experience with local Maasai communities", duration: "2-3 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Olduvai Gorge Tour", description: "Visit the 'Cradle of Mankind' archaeological site", duration: "2-3 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Sunset at Crater Rim", description: "Spectacular sunset views from the crater rim", duration: "1-2 hours", difficulty: "Easy", bestTime: "Clear evenings" }
        ],

        // Highlights
        highlights: [
            "High chance to see rhino (when conditions allow)",
            "Scenic crater views",
            "Dense wildlife concentration"
        ],

        // Landscape
        landscape: "Ancient volcanic caldera with steep walls rising 600m, grassy plains, swamps, and Lerai Forest on the crater floor",
        ecosystems: ["Grassland plains", "Acacia woodlands", "Swamp areas", "Crater wall forests"],

        // Accommodations
        accommodations: [
            { name: "Ngorongoro Crater Lodge", type: "Luxury", description: "Ultra-luxury lodge on crater rim with butler service", priceRange: "$1,200-$2,500/night", features: ["Butler service", "Gourmet dining", "Crater views"] },
            { name: "Ngorongoro Serena Safari Lodge", type: "Mid-Range", description: "Maasai-inspired architecture on crater rim", priceRange: "$400-$700/night", features: ["Pool", "Restaurant", "Cultural shows"] },
            { name: "Karatu Lodges", type: "Mid-Range", description: "Various lodges in Karatu town (30 min from crater)", priceRange: "$200-$400/night", features: ["Coffee tours", "Mountain views", "Value pricing"] },
            { name: "Simba Campsite", type: "Camping", description: "Public campsite on crater rim", priceRange: "$60/person", features: ["Basic facilities", "Stunning location"] }
        ],

        // Getting There
        gettingThere: {
            byAir: "Fly to Lake Manyara Airport (1 hour from Arusha), then 1.5 hour drive to crater",
            byRoad: "3-4 hour scenic drive from Arusha via Makuyuni",
            transferTime: "1.5 hours by air + road, 3-4 hours by road only"
        },

        // Itineraries
        suggestedItineraries: "1 night in Karatu or crater rim lodge",
        sampleItineraries: [
            {
                title: "Ngorongoro Day Trip",
                duration: "1 day",
                days: [
                    { day: 1, title: "Crater Exploration", description: "Early morning descent into crater, full-day game drive, picnic lunch, afternoon ascent and departure" }
                ]
            },
            {
                title: "Ngorongoro & Highlands Experience",
                duration: "2 days",
                days: [
                    { day: 1, title: "Arrival & Olduvai Gorge", description: "Drive from Arusha, visit Olduvai Gorge museum, sunset at crater rim" },
                    { day: 2, title: "Crater Floor Safari", description: "Early descent for game drive, picnic lunch, Maasai village visit, depart to next destination" }
                ]
            }
        ],

        // Conservation
        conservation: "The Ngorongoro Conservation Area pioneered multiple land-use management, allowing wildlife, Maasai pastoralism, and tourism to coexist. Anti-poaching efforts protect the critically important black rhino population.",
        communityInitiatives: "Maasai communities receive revenue sharing, employment opportunities, and support for education and healthcare facilities",

        // Cultural
        culturalContext: "The Ngorongoro area is traditional Maasai homeland. The Maasai continue grazing cattle on the crater highlands, maintaining centuries-old traditions while coexisting with wildlife.",
        localTribes: ["Maasai"],

        // Travel Tips
        travelTips: [
            { category: "What to Pack", tips: ["Warm layers (crater rim is cold)", "Binoculars essential", "Camera with zoom lens", "Sunscreen", "Cash for Maasai village visits"] },
            { category: "Health", tips: ["Altitude considerations (rim is 2,200m)", "Malaria risk lower than Serengeti", "Drink bottled water"] },
            { category: "Best Times", tips: ["Descend early (6 AM) to avoid crowds", "Afternoon light is best for photography", "Allow full 6-8 hours on crater floor"] }
        ],

        // FAQs
        faqs: [
            { question: "How long do I need in Ngorongoro?", answer: "One full day on the crater floor is sufficient for most visitors. Add 1-2 nights if exploring the highlands." },
            { question: "Can I see all Big Five in the crater?", answer: "Yes! Ngorongoro is one of the few places where you can potentially see all Big Five in a single day, though leopard sightings are less common." },
            { question: "Is it crowded in the crater?", answer: "The crater can get busy, especially mid-morning. Early entry (6 AM) provides a more exclusive experience." },
            { question: "Do I need a guide?", answer: "Yes, all vehicles must have a licensed guide. This enhances wildlife spotting and ensures safety." }
        ],

        // Related
        relatedDestinations: ["serengeti", "tarangire", "lake-manyara"],

        // Media
        imageUrl: "/images/destinations/ngorongoro/ngorongoro.jpg",
        gallery: [
            "/images/destinations/ngorongoro/ngorongoro.jpg",
            "/images/destinations/ngorongoro/ngorongoro-rhino.jpg",
            "/images/destinations/ngorongoro/ngorongoro-lions.jpg",
            "/images/destinations/ngorongoro/ngorongoro-flamingos.jpg",
            "/images/destinations/ngorongoro/ngorongoro-sunset.jpg",
            "/images/destinations/ngorongoro/ngorongoro-elephants.jpg"
        ]
    },
    {
        id: "tarangire",
        name: "Tarangire National Park",
        slug: "tarangire",
        region: "Northern Circuit",
        shortDescription: "Famous for large elephant herds, baobab trees, and strong wildlife viewing",
        whyVisit: "Famous for large elephant herds, baobab trees, and strong wildlife viewing—especially in the dry season.",
        fullDescription: "Tarangire National Park is Tanzania's sixth-largest park and a hidden gem of the Northern Circuit. Named after the Tarangire River that flows through it, this 2,850 square kilometer park is renowned for having the highest concentration of elephants in Tanzania—up to 300 during the dry season.\n\nThe landscape is dominated by ancient baobab trees, some over 1,000 years old, creating an otherworldly backdrop for game drives. During the dry season (June-October), wildlife from surrounding areas converges on the Tarangire River, creating spectacular viewing opportunities as animals dig for water in dry riverbeds.\n\nLess crowded than Serengeti and Ngorongoro, Tarangire offers an authentic safari experience with excellent predator sightings, diverse birdlife (over 550 species), and unique ecosystems ranging from swamps to granite ridges.",

        // Quick Facts
        parkSize: "2,850 km²",
        elevation: "900-1,300m above sea level",
        established: "1970",
        nearestAirport: "Kilimanjaro International Airport (JRO) or Arusha Airport",
        distanceFromArusha: "120 km (2 hours drive)",
        recommendedStay: "1-2 nights",

        // Wildlife
        bigFive: ["Lion", "Leopard", "Elephant", "Buffalo"],
        keySpecies: ["Giraffe", "Zebra", "Wildebeest", "Impala", "Pythons"],
        birdWatching: true,
        uniqueSpecies: ["Ashy Starling", "Yellow-collared Lovebird", "Red-and-yellow Barbet"],
        wildlifeRating: 4.5,

        // Best Time
        bestTimeToGo: [
            "Dry season: June–October",
            "Great year-round"
        ],
        peakSeason: "July-October (dry season, wildlife concentration)",
        lowSeason: "March-May (long rains)",
        monthlyBreakdown: [
            { month: "Jan-Feb", wildlife: "Good viewing, calving season", weather: "Warm, occasional rain", rating: 4 },
            { month: "Mar-May", wildlife: "Dispersed wildlife, lush green", weather: "Long rains, challenging roads", rating: 3 },
            { month: "Jun-Oct", wildlife: "Peak elephant herds, concentrated wildlife", weather: "Dry, excellent visibility", rating: 5 },
            { month: "Nov-Dec", wildlife: "Migratory birds arrive", weather: "Short rains, good birding", rating: 4 }
        ],

        // Activities
        activities: [
            { name: "Game Drives", description: "Morning and afternoon drives along Tarangire River", duration: "3-4 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Walking Safaris", description: "Guided nature walks outside park boundaries", duration: "2-3 hours", difficulty: "Moderate", bestTime: "Dry season" },
            { name: "Night Game Drives", description: "Nocturnal wildlife spotting in private concessions", duration: "2-3 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Maasai Cultural Visit", description: "Visit traditional Maasai bomas near the park", duration: "2 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Bird Watching", description: "Over 550 bird species, including endemics", duration: "Half day", difficulty: "Easy", bestTime: "November-April" }
        ],

        // Highlights
        highlights: [
            "Elephants + baobab landscapes",
            "River ecosystem",
            "Great start/end point for Northern Circuit safaris"
        ],

        // Landscape
        landscape: "Granite hills, swampy valleys, acacia woodlands, and the life-giving Tarangire River with iconic baobab trees dotting the landscape",
        ecosystems: ["Riverine forests", "Swamp areas", "Acacia woodlands", "Granite kopjes"],

        // Accommodations
        accommodations: [
            { name: "Tarangire Treetops", type: "Luxury", description: "Elevated treehouse suites with panoramic views", priceRange: "$800-$1,500/night", features: ["Treehouse rooms", "Infinity pool", "Spa"] },
            { name: "Tarangire Serena Safari Lodge", type: "Mid-Range", description: "Hilltop lodge overlooking the valley", priceRange: "$300-$500/night", features: ["Pool", "Restaurant", "Cultural performances"] },
            { name: "Kikoti Tented Camp", type: "Mid-Range", description: "Intimate tented camp in private concession", priceRange: "$250-$450/night", features: ["Night drives", "Walking safaris", "Bush dining"] },
            { name: "Public Campsites", type: "Camping", description: "Basic campsites inside the park", priceRange: "$30/person", features: ["Shared facilities", "River proximity"] }
        ],

        // Getting There
        gettingThere: {
            byAir: "Fly to Kilimanjaro Airport, then 2-hour drive to park",
            byRoad: "Easy 2-hour drive from Arusha via well-maintained road",
            transferTime: "2 hours by road from Arusha"
        },

        // Itineraries
        suggestedItineraries: "1–2 nights",
        sampleItineraries: [
            {
                title: "Tarangire Express",
                duration: "1 day",
                days: [
                    { day: 1, title: "Day Trip from Arusha", description: "Early departure from Arusha, full-day game drive focusing on elephant herds and baobabs, return evening" }
                ]
            },
            {
                title: "Tarangire Immersion",
                duration: "2 days",
                days: [
                    { day: 1, title: "Arrival & Afternoon Drive", description: "Drive from Arusha, check-in, afternoon game drive along Tarangire River" },
                    { day: 2, title: "Full Day Exploration & Departure", description: "Early morning game drive, walking safari option, depart after lunch to next destination" }
                ]
            }
        ],

        // Conservation
        conservation: "Tarangire is part of a larger ecosystem extending into community lands. Conservation efforts focus on maintaining wildlife corridors and reducing human-wildlife conflict with neighboring communities.",
        communityInitiatives: "Community-based tourism projects, employment for local people, and revenue sharing with villages bordering the park",

        // Cultural
        culturalContext: "The Tarangire region is home to Maasai, Barabaig, and Hadzabe communities. The Hadzabe are one of Africa's last hunter-gatherer tribes, offering unique cultural experiences.",
        localTribes: ["Maasai", "Barabaig", "Hadzabe"],

        // Travel Tips
        travelTips: [
            { category: "What to Pack", tips: ["Lightweight clothing", "Binoculars", "Camera with telephoto lens", "Insect repellent", "Sunscreen"] },
            { category: "Health", tips: ["Malaria prophylaxis recommended", "Drink bottled water", "Sun protection essential"] },
            { category: "Photography", tips: ["Baobabs best at sunrise/sunset", "Elephant herds near river midday", "Bring wide-angle for landscapes"] }
        ],

        // FAQs
        faqs: [
            { question: "When is the best time to see elephants?", answer: "June-October during the dry season when up to 300 elephants gather along the Tarangire River." },
            { question: "Is Tarangire worth visiting?", answer: "Absolutely! It offers excellent wildlife viewing with fewer crowds than Serengeti/Ngorongoro, plus unique baobab landscapes." },
            { question: "Can I visit Tarangire as a day trip?", answer: "Yes, it's only 2 hours from Arusha, making it perfect for day trips or as a first/last stop on a safari circuit." },
            { question: "Are there lions in Tarangire?", answer: "Yes, Tarangire has a healthy lion population, plus leopards, cheetahs, and wild dogs." }
        ],

        // Related
        relatedDestinations: ["serengeti", "ngorongoro", "lake-manyara"],

        // Media
        imageUrl: "/images/destinations/tarangire/tarangire.jpg",
        gallery: [
            "/images/destinations/tarangire/tarangire.jpg",
            "/images/destinations/tarangire/tarangire-elephants.jpg",
            "/images/destinations/tarangire/tarangire-baobabs.jpg",
            "/images/destinations/tarangire/tarangire-lions.jpg",
            "/images/destinations/tarangire/tarangire-sunset.jpg",
            "/images/destinations/tarangire/tarangire-giraffe.jpg"
        ]
    },
    {
        id: "lake-manyara",
        name: "Lake Manyara National Park",
        slug: "lake-manyara",
        region: "Northern Circuit",
        shortDescription: "A compact park with beautiful groundwater forest and diverse birdlife",
        whyVisit: "A compact park with beautiful groundwater forest, flamingos (seasonal), and diverse birdlife.",
        fullDescription: "Lake Manyara National Park is a compact but incredibly diverse destination covering 330 square kilometers along the Great Rift Valley. Despite its small size, the park packs an extraordinary variety of ecosystems—from underground forests to alkaline lake shores—supporting remarkable biodiversity.\n\nMade famous by Ernest Hemingway who described it as 'the loveliest I had seen in Africa', the park is renowned for its tree-climbing lions (though sightings are rare), large flocks of pink flamingos that color the lake shore, and over 400 bird species. The groundwater forest, fed by underground springs, creates a lush green canopy home to baboons, blue monkeys, and numerous bird species.\n\nPerfect as a day trip or overnight stop, Lake Manyara offers excellent value and diversity, making it an ideal introduction to Tanzanian safaris or a pleasant break between Arusha and the northern circuit parks.",

        parkSize: "330 km² (60% is lake)",
        elevation: "960-1,790m above sea level",
        established: "1960",
        nearestAirport: "Lake Manyara Airport (LKY) - 20 minutes away",
        distanceFromArusha: "125 km (2 hours drive)",
        recommendedStay: "Day trip or 1 night",

        bigFive: ["Lion (tree-climbing, rare)", "Elephant", "Buffalo"],
        keySpecies: ["Flamingos", "Baboons", "Hippos", "Giraffe", "Blue Monkeys"],
        birdWatching: true,
        uniqueSpecies: ["Silvery-cheeked Hornbill", "Red-billed Firefinch", "Hartlaub's Turaco"],
        wildlifeRating: 4,

        bestTimeToGo: [
            "Year-round",
            "Birdlife often best in wetter months"
        ],
        peakSeason: "June-October (dry season)",
        lowSeason: "March-May (long rains)",
        monthlyBreakdown: [
            { month: "Jan-Feb", wildlife: "Good birding, flamingos present", weather: "Warm, occasional rain", rating: 4 },
            { month: "Mar-May", wildlife: "Peak bird watching season", weather: "Long rains, lush vegetation", rating: 4 },
            { month: "Jun-Oct", wildlife: "Wildlife concentrates near water", weather: "Dry, clear skies", rating: 5 },
            { month: "Nov-Dec", wildlife: "Migratory birds arrive", weather: "Short rains possible", rating: 4 }
        ],

        activities: [
            { name: "Game Drives", description: "Explore groundwater forest, lakeshore, and escarpment", duration: "3-4 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Canoeing", description: "Paddle on the lake when water levels permit", duration: "2 hours", difficulty: "Easy", bestTime: "High water season" },
            { name: "Walking Safaris", description: "Guided nature walks outside park boundaries", duration: "2-3 hours", difficulty: "Moderate", bestTime: "Dry season" },
            { name: "Mountain Biking", description: "Cycle around the park perimeter", duration: "Half day", difficulty: "Moderate", bestTime: "Dry season" },
            { name: "Bird Watching", description: "Over 400 species including endemics and migrants", duration: "Half day", difficulty: "Easy", bestTime: "November-April" }
        ],

        highlights: [
            "Birdwatching",
            "Scenic lake views",
            "Great as a day trip from Arusha/Karatu"
        ],

        landscape: "Alkaline lake, groundwater forest, hot springs, steep escarpment, and open grasslands creating diverse microhabitats",
        ecosystems: ["Groundwater forest", "Alkaline lake", "Escarpment woodlands", "Hot springs"],

        accommodations: [
            { name: "Lake Manyara Tree Lodge", type: "Luxury", description: "Elevated treehouse suites in mahogany forest", priceRange: "$700-$1,200/night", features: ["Treehouse rooms", "Infinity pool", "Forest setting"] },
            { name: "Lake Manyara Serena Safari Lodge", type: "Mid-Range", description: "Clifftop lodge with lake views", priceRange: "$250-$400/night", features: ["Pool", "Restaurant", "Panoramic views"] },
            { name: "Kirurumu Tented Camp", type: "Mid-Range", description: "Tented camp on escarpment rim", priceRange: "$200-$350/night", features: ["Lake views", "Cultural visits", "Intimate setting"] },
            { name: "Endabash Campsite", type: "Camping", description: "Public campsite inside the park", priceRange: "$30/person", features: ["Basic facilities", "Forest location"] }
        ],

        gettingThere: {
            byAir: "Fly to Lake Manyara Airport (20 min from Arusha), then 30 min drive to park",
            byRoad: "2-hour scenic drive from Arusha via well-maintained road",
            transferTime: "2 hours by road, 1 hour by air + road"
        },

        suggestedItineraries: "Day trip or 1 night",
        sampleItineraries: [
            {
                title: "Lake Manyara Day Trip",
                duration: "1 day",
                days: [
                    { day: 1, title: "Park Exploration", description: "Early departure from Arusha, morning game drive in groundwater forest, picnic lunch, afternoon lakeshore drive, return evening" }
                ]
            }
        ],

        conservation: "The park protects critical groundwater forest and wetland habitats. Conservation efforts focus on maintaining water quality and protecting migratory bird populations.",
        communityInitiatives: "Employment opportunities for local communities, cultural tourism programs, and revenue sharing",

        culturalContext: "The area is inhabited by Maasai communities who traditionally grazed cattle in the region before the park's establishment.",
        localTribes: ["Maasai"],

        travelTips: [
            { category: "What to Pack", tips: ["Binoculars essential for birding", "Camera with zoom lens", "Light layers", "Insect repellent"] },
            { category: "Best For", tips: ["Bird enthusiasts", "Photography", "Short safari introduction", "Combination with Ngorongoro"] },
            { category: "Timing", tips: ["Morning drives best for forest wildlife", "Afternoon good for lakeshore", "Allow 3-4 hours minimum"] }
        ],

        faqs: [
            { question: "Are the tree-climbing lions still there?", answer: "Tree-climbing lions are occasionally spotted but not guaranteed. They're more commonly seen in neighboring Tarangire." },
            { question: "Is Lake Manyara worth visiting?", answer: "Yes! It's perfect for bird lovers, offers diverse landscapes, and makes an excellent first safari experience or day trip." },
            { question: "How many flamingos are there?", answer: "Flamingo numbers vary with water conditions. During peak season, thousands can line the shore creating a spectacular pink display." },
            { question: "Can I combine Lake Manyara with other parks?", answer: "Absolutely! It's ideally located between Arusha and Ngorongoro/Serengeti, making it a convenient stopover." }
        ],

        relatedDestinations: ["tarangire", "ngorongoro", "serengeti"],

        imageUrl: "/images/destinations/lake-manyara/lake-manyara.jpg",
        gallery: [
            "/images/destinations/lake-manyara/lake-manyara.jpg",
            "/images/destinations/lake-manyara/lake-manyara-flamingos.jpg",
            "/images/destinations/lake-manyara/lake-manyara-forest.jpg",
            "/images/destinations/lake-manyara/lake-manyara-baboons.jpg",
            "/images/destinations/lake-manyara/lake-manyara-sunset.jpg",
            "/images/destinations/lake-manyara/lake-manyara-hippos.jpg"
        ]
    },
    {
        id: "zanzibar",
        name: "Zanzibar",
        slug: "zanzibar",
        region: "Islands",
        shortDescription: "A perfect beach extension after safari with white sand and turquoise water",
        whyVisit: "A perfect beach extension after safari: white sand, turquoise water, and cultural history in Stone Town.",
        fullDescription: "Zanzibar, known as the 'Spice Island', is a tropical paradise off Tanzania's coast offering the perfect contrast to mainland safaris. This semi-autonomous archipelago combines pristine white-sand beaches, crystal-clear turquoise waters, and rich cultural heritage shaped by African, Arab, Indian, and European influences.\n\nStone Town, a UNESCO World Heritage Site, is a labyrinth of narrow alleys, historic buildings, bustling markets, and aromatic spice shops. Beyond the capital, the island boasts some of the world's most beautiful beaches, excellent diving and snorkeling sites, and traditional dhow sailing experiences.\n\nWhether you seek relaxation after an intense safari, underwater adventures, cultural immersion, or romantic getaways, Zanzibar delivers an unforgettable Indian Ocean experience.",

        parkSize: "1,658 km² (main island Unguja)",
        elevation: "Sea level to 120m",
        established: "N/A (Archipelago)",
        nearestAirport: "Abeid Amani Karume International Airport (ZNZ)",
        distanceFromDarEsSalaam: "40 km by ferry (2 hours) or 20 min flight",
        recommendedStay: "3-7 nights",

        bigFive: [],
        keySpecies: ["Red Colobus Monkeys", "Green Turtles", "Dolphins", "Whale Sharks (seasonal)"],
        birdWatching: true,
        uniqueSpecies: ["Zanzibar Red Colobus Monkey (endangered)", "Aders' Duiker", "Pemba Flying Fox"],
        wildlifeRating: 3,

        bestTimeToGo: [
            "Beach season: June-October",
            "December-February"
        ],
        peakSeason: "June-October, December-February (dry, sunny)",
        lowSeason: "March-May (long rains), November (short rains)",
        monthlyBreakdown: [
            { month: "Jan-Feb", wildlife: "Whale sharks possible", weather: "Hot, humid, dry", rating: 5 },
            { month: "Mar-May", wildlife: "Turtle nesting begins", weather: "Long rains, high humidity", rating: 2 },
            { month: "Jun-Oct", wildlife: "Excellent diving visibility", weather: "Cool, dry, perfect beach weather", rating: 5 },
            { month: "Nov-Dec", wildlife: "Migratory birds", weather: "Short rains, improving", rating: 3 }
        ],

        activities: [
            { name: "Beach Relaxation", description: "Pristine white-sand beaches with turquoise waters", duration: "Full day", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Stone Town Tour", description: "UNESCO World Heritage Site walking tour", duration: "Half day", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Spice Tour", description: "Visit spice farms and learn about Zanzibar's history", duration: "Half day", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Snorkeling & Diving", description: "Explore coral reefs and marine life", duration: "Half/Full day", difficulty: "Moderate", bestTime: "June-October" },
            { name: "Dhow Sunset Cruise", description: "Traditional sailing boat sunset experience", duration: "2-3 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Jozani Forest Visit", description: "See endemic red colobus monkeys", duration: "Half day", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Prison Island", description: "Giant tortoises and snorkeling", duration: "Half day", difficulty: "Easy", bestTime: "Year-round" }
        ],

        highlights: [
            "Beach relaxation",
            "Stone Town",
            "Spice tour (optional)",
            "Snorkeling/diving (seasonal)"
        ],

        landscape: "White-sand beaches, coral reefs, turquoise lagoons, historic stone town, spice plantations, and tropical forests",
        ecosystems: ["Coral reefs", "Mangrove forests", "Spice plantations", "Coastal forests"],

        accommodations: [
            { name: "Baraza Resort & Spa", type: "Luxury", description: "Ultra-luxury all-villa resort on Bwejuu Beach", priceRange: "$800-$2,000/night", features: ["Private villas", "Spa", "Fine dining"] },
            { name: "Essque Zalu Zanzibar", type: "Luxury", description: "Modern luxury resort in Nungwi", priceRange: "$400-$800/night", features: ["Infinity pools", "Multiple restaurants", "Water sports"] },
            { name: "Kendwa Rocks", type: "Mid-Range", description: "Beachfront hotel with famous parties", priceRange: "$150-$300/night", features: ["Beach bar", "Sunset views", "Social atmosphere"] },
            { name: "Budget Guesthouses", type: "Budget", description: "Local guesthouses in various locations", priceRange: "$30-$80/night", features: ["Basic amenities", "Local experience", "Value pricing"] }
        ],

        gettingThere: {
            byAir: "Direct flights from Dar es Salaam (20 min), Nairobi, and international destinations",
            byRoad: "Ferry from Dar es Salaam (2 hours) or fast ferry (90 minutes)",
            transferTime: "20 min by air, 2 hours by ferry"
        },

        suggestedItineraries: "3–7 nights",
        sampleItineraries: [
            {
                title: "Zanzibar Beach Escape",
                duration: "3 days",
                days: [
                    { day: 1, title: "Arrival & Beach Time", description: "Arrive, check into beach resort, relax and enjoy the ocean" },
                    { day: 2, title: "Stone Town & Spice Tour", description: "Morning spice tour, afternoon Stone Town exploration, sunset dhow cruise" },
                    { day: 3, title: "Beach Activities & Departure", description: "Morning snorkeling or spa, afternoon departure" }
                ]
            },
            {
                title: "Complete Zanzibar Experience",
                duration: "7 days",
                days: [
                    { day: 1, title: "Arrival & Nungwi Beach", description: "Arrive, transfer to Nungwi, beach relaxation" },
                    { day: 2, title: "Stone Town Discovery", description: "Full day exploring Stone Town's history and culture" },
                    { day: 3, title: "Spice & Prison Island", description: "Morning spice farm tour, afternoon Prison Island visit" },
                    { day: 4, title: "Jozani Forest & East Coast", description: "Morning Jozani Forest, afternoon at east coast beach" },
                    { day: 5, title: "Diving or Snorkeling", description: "Full day exploring coral reefs and marine life" },
                    { day: 6, title: "Relaxation & Water Sports", description: "Beach day with optional kayaking, paddleboarding" },
                    { day: 7, title: "Departure", description: "Final beach morning, depart" }
                ]
            }
        ],

        conservation: "Marine conservation efforts protect coral reefs and sea turtle nesting sites. Jozani Forest conserves the endemic red colobus monkey population.",
        communityInitiatives: "Community-based tourism projects, local guide employment, and support for schools and healthcare",

        culturalContext: "Zanzibar's culture is a unique blend of African, Arab, Persian, Indian, and European influences, evident in architecture, cuisine, and traditions.",
        localTribes: ["Swahili", "Arab descendants", "Indian community"],

        travelTips: [
            { category: "What to Pack", tips: ["Swimwear", "Sunscreen (reef-safe)", "Light cotton clothing", "Modest dress for Stone Town", "Snorkeling gear (optional)"] },
            { category: "Health", tips: ["Malaria prophylaxis recommended", "Drink bottled water", "Sun protection essential", "Travel insurance with medical coverage"] },
            { category: "Culture", tips: ["Dress modestly in Stone Town", "Ask permission before photographing people", "Respect Islamic customs", "Friday is holy day"] }
        ],

        faqs: [
            { question: "Is Zanzibar safe for tourists?", answer: "Yes, Zanzibar is generally very safe. Exercise normal precautions, especially in Stone Town at night." },
            { question: "What's the best beach area?", answer: "Nungwi and Kendwa (north) have best swimming year-round. Paje and Jambiani (east) are great for kitesurfing." },
            { question: "Do I need a visa for Zanzibar?", answer: "Same visa requirements as mainland Tanzania. Most nationalities can get visa on arrival or e-visa." },
            { question: "Can I drink alcohol in Zanzibar?", answer: "Yes, alcohol is available in tourist areas and hotels, though Zanzibar is predominantly Muslim." }
        ],

        relatedDestinations: ["serengeti", "ngorongoro", "tarangire"],

        imageUrl: "/images/destinations/zanzibar/zanzibar.jpg",
        gallery: [
            "/images/destinations/zanzibar/zanzibar.jpg",
            "/images/destinations/zanzibar/zanzibar-beach.jpg",
            "/images/destinations/zanzibar/zanzibar-stone-town.jpg",
            "/images/destinations/zanzibar/zanzibar-spices.jpg",
            "/images/destinations/zanzibar/zanzibar-dhow.jpg",
            "/images/destinations/zanzibar/zanzibar-diving.jpg"
        ]
    }
];

// Additional Major Destinations
export const additionalDestinations: Destination[] = [
    {
        id: "ruaha",
        name: "Ruaha National Park",
        slug: "ruaha",
        region: "Southern Circuit",
        shortDescription: "Tanzania's largest park with wild landscapes and exceptional predator viewing",
        whyVisit: "Tanzania's largest national park offering remote wilderness, huge elephant herds, and excellent predator sightings without crowds.",
        fullDescription: "Ruaha National Park is Tanzania's largest national park at 20,226 square kilometers, yet remains one of Africa's best-kept secrets. Located in the southern circuit, Ruaha offers a truly wild safari experience with minimal tourist traffic and pristine landscapes.\n\nThe Great Ruaha River is the park's lifeline, attracting massive concentrations of wildlife during the dry season. Ruaha is famous for having one of the largest elephant populations in East Africa, plus healthy populations of lions (including large prides), leopards, wild dogs, and both greater and lesser kudu.\n\nWith its rugged terrain of baobab-dotted hills, miombo woodlands, and riverine forests, Ruaha provides an authentic African wilderness experience far from the beaten path.",

        parkSize: "20,226 km²",
        elevation: "750-1,800m above sea level",
        established: "1964",
        nearestAirport: "Msembe Airstrip or Iringa Airport",
        distanceFromDarEsSalaam: "625 km (1 hour flight or 10+ hours drive)",
        recommendedStay: "3-4 nights minimum",

        bigFive: ["Lion", "Leopard", "Elephant", "Buffalo"],
        keySpecies: ["Wild Dog", "Greater Kudu", "Lesser Kudu", "Sable Antelope", "Roan Antelope"],
        birdWatching: true,
        uniqueSpecies: ["Ashy Starling", "Ruaha Red-billed Hornbill", "Black-collared Lovebird"],
        wildlifeRating: 4.5,

        bestTimeToGo: ["Dry season: June-October", "Wildlife concentrates along rivers"],
        peakSeason: "July-October (dry season)",
        lowSeason: "January-April (wet season)",
        monthlyBreakdown: [
            { month: "Jan-Apr", wildlife: "Green season, bird watching", weather: "Wet, some roads impassable", rating: 3 },
            { month: "May-Jun", wildlife: "Wildlife begins concentrating", weather: "Cooling, drying", rating: 4 },
            { month: "Jul-Oct", wildlife: "Peak wildlife viewing, predators active", weather: "Dry, excellent visibility", rating: 5 },
            { month: "Nov-Dec", wildlife: "Short rains, newborn animals", weather: "Occasional rain", rating: 3 }
        ],

        activities: [
            { name: "Game Drives", description: "Full-day drives exploring diverse habitats", duration: "Full day", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Walking Safaris", description: "Guided walks with armed rangers", duration: "2-4 hours", difficulty: "Moderate", bestTime: "Dry season" },
            { name: "Night Drives", description: "Nocturnal wildlife spotting", duration: "2-3 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Bird Watching", description: "Over 570 bird species recorded", duration: "Half day", difficulty: "Easy", bestTime: "November-April" }
        ],

        highlights: ["Large elephant herds", "Wild dog packs", "Remote wilderness", "Baobab landscapes"],
        landscape: "Rugged hills, miombo woodlands, riverine forests, and the Great Ruaha River creating diverse ecosystems",
        ecosystems: ["Miombo woodlands", "Riverine forests", "Grasslands", "Rocky outcrops"],

        accommodations: [
            { name: "Jongomero Camp", type: "Luxury", description: "Exclusive camp in remote northern Ruaha", priceRange: "$1,000-$1,800/night", features: ["Remote location", "Walking safaris", "Intimate"] },
            { name: "Mdonya Old River Camp", type: "Mid-Range", description: "Tented camp along seasonal river", priceRange: "$400-$700/night", features: ["River setting", "Game drives", "Bush dining"] },
            { name: "Public Campsites", type: "Camping", description: "Basic campsites throughout the park", priceRange: "$30/person", features: ["Self-catering", "Bring equipment"] }
        ],

        gettingThere: {
            byAir: "Scheduled flights from Dar es Salaam, Arusha, or Zanzibar to Msembe Airstrip (1-1.5 hours)",
            byRoad: "10+ hour drive from Dar es Salaam via Iringa (4WD essential)",
            transferTime: "1-1.5 hours by air, 10+ hours by road"
        },

        suggestedItineraries: "3-4 nights minimum",
        sampleItineraries: [
            {
                title: "Ruaha Wilderness Experience",
                duration: "4 days",
                days: [
                    { day: 1, title: "Arrival & Introduction", description: "Fly into Msembe, afternoon game drive along Great Ruaha River" },
                    { day: 2, title: "Northern Ruaha Exploration", description: "Full day exploring northern sector, walking safari option" },
                    { day: 3, title: "Predator Focus", description: "Full day searching for lions, leopards, and wild dogs" },
                    { day: 4, title: "Final Game Drive & Departure", description: "Morning game drive, fly out after breakfast" }
                ]
            }
        ],

        conservation: "Ruaha is part of the larger Rungwa-Kizigo-Muhesi ecosystem. Conservation focuses on anti-poaching, particularly for elephants, and maintaining wildlife corridors.",
        communityInitiatives: "Community-based natural resource management, employment opportunities, and revenue sharing with local villages",
        culturalContext: "The area is home to Hehe and Barabaig communities who have traditional connections to the land.",
        localTribes: ["Hehe", "Barabaig"],

        travelTips: [
            { category: "What to Pack", tips: ["All safari essentials", "Extra camera batteries", "Binoculars", "Warm layers for mornings"] },
            { category: "Health", tips: ["Malaria prophylaxis essential", "Comprehensive travel insurance", "Emergency evacuation coverage"] },
            { category: "Best For", tips: ["Experienced safari-goers", "Photography", "Wilderness seekers", "Avoiding crowds"] }
        ],

        faqs: [
            { question: "Is Ruaha safe?", answer: "Yes, Ruaha is very safe when following guide instructions. The remote location means fewer tourists but excellent guiding." },
            { question: "How do I get to Ruaha?", answer: "Flying is highly recommended. Scheduled flights connect from Dar es Salaam, Arusha, and Zanzibar." },
            { question: "Can I see wild dogs?", answer: "Ruaha has one of East Africa's healthiest wild dog populations, though sightings are never guaranteed." },
            { question: "When is the best time to visit?", answer: "July-October during the dry season when wildlife concentrates along rivers." }
        ],

        relatedDestinations: ["nyerere", "mikumi", "udzungwa"],
        imageUrl: "/images/destinations/ruaha/ruaha.jpg",
        gallery: ["/images/destinations/ruaha/ruaha.jpg", "/images/destinations/ruaha/ruaha-elephants.jpg", "/images/destinations/ruaha/ruaha-lions.jpg", "/images/destinations/ruaha/ruaha-wild-dogs.jpg", "/images/destinations/ruaha/ruaha-river.jpg", "/images/destinations/ruaha/ruaha-sunset.jpg"]
    },
    {
        id: "nyerere",
        name: "Nyerere National Park",
        slug: "nyerere",
        region: "Southern Circuit",
        shortDescription: "Africa's largest game reserve with boat safaris and diverse ecosystems",
        whyVisit: "Formerly Selous Game Reserve, this vast wilderness offers boat safaris, walking safaris, and exceptional wildlife diversity.",
        fullDescription: "Nyerere National Park, formerly known as Selous Game Reserve, is Africa's largest protected area at 30,893 square kilometers. Renamed in 2019 to honor Tanzania's first president, this UNESCO World Heritage Site represents one of the last great wildernesses on Earth.\n\nUnlike most Tanzanian parks, Nyerere allows walking safaris, boat safaris, and night drives, offering diverse ways to experience wildlife. The Rufiji River system creates unique aquatic habitats where hippos, crocodiles, and abundant birdlife thrive.\n\nWith only a fraction of visitors compared to northern parks, Nyerere provides an exclusive, uncrowded safari experience in pristine wilderness. The park is home to significant populations of elephants, wild dogs, lions, and over 440 bird species.",

        parkSize: "30,893 km²",
        elevation: "100-1,000m above sea level",
        established: "1922 (as Game Reserve), 2019 (as National Park)",
        nearestAirport: "Selous Airstrip or Mtemere Airstrip",
        distanceFromDarEsSalaam: "220 km (1 hour flight or 5-6 hours drive)",
        recommendedStay: "2-3 nights",

        bigFive: ["Lion", "Leopard", "Elephant", "Buffalo"],
        keySpecies: ["Wild Dog", "Hippo", "Crocodile", "Giraffe", "Zebra"],
        birdWatching: true,
        uniqueSpecies: ["African Fish Eagle", "Carmine Bee-eater", "Pel's Fishing Owl"],
        wildlifeRating: 4.5,

        bestTimeToGo: ["June-October (dry season)", "Year-round for boat safaris"],
        peakSeason: "July-October",
        lowSeason: "March-May (long rains)",
        monthlyBreakdown: [
            { month: "Jan-Feb", wildlife: "Good viewing, hot weather", weather: "Hot, humid", rating: 4 },
            { month: "Mar-May", wildlife: "Dispersed wildlife, lush", weather: "Long rains", rating: 3 },
            { month: "Jun-Oct", wildlife: "Peak season, concentrated wildlife", weather: "Dry, pleasant", rating: 5 },
            { month: "Nov-Dec", wildlife: "Short rains, migratory birds", weather: "Variable", rating: 4 }
        ],

        activities: [
            { name: "Boat Safaris", description: "Explore Rufiji River by boat for hippos, crocs, birds", duration: "2-3 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Walking Safaris", description: "Guided walks with armed rangers", duration: "2-4 hours", difficulty: "Moderate", bestTime: "Dry season" },
            { name: "Game Drives", description: "Traditional vehicle-based safaris", duration: "Half/Full day", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Night Drives", description: "Nocturnal wildlife experiences", duration: "2-3 hours", difficulty: "Easy", bestTime: "Year-round" },
            { name: "Fishing", description: "Catch-and-release fishing in Rufiji River", duration: "Half day", difficulty: "Easy", bestTime: "Dry season" }
        ],

        highlights: ["Boat safaris", "Walking safaris", "Wild dog packs", "Vast wilderness"],
        landscape: "Mi woodlands, grasslands, rocky hills, and the extensive Rufiji River system with lakes and channels",
        ecosystems: ["Riverine systems", "Miombo woodlands", "Grasslands", "Swamps"],

        accommodations: [
            { name: "Selous Serena Camp", type: "Luxury", description: "Riverside luxury tented camp", priceRange: "$600-$1,000/night", features: ["River views", "Boat safaris", "Fine dining"] },
            { name: "Mbuyu Safari Camp", type: "Mid-Range", description: "Intimate tented camp", priceRange: "$300-$500/night", features: ["Personalized service", "Walking safaris", "Bush meals"] },
            { name: "Public Campsites", type: "Camping", description: "Basic campsites near headquarters", priceRange: "$30/person", features: ["Self-catering", "Bring equipment"] }
        ],

        gettingThere: {
            byAir: "Scheduled flights from Dar es Salaam or Zanzibar to Selous airstrips (45-60 minutes)",
            byRoad: "5-6 hour drive from Dar es Salaam via Kibiti (4WD recommended)",
            transferTime: "1 hour by air, 5-6 hours by road"
        },

        suggestedItineraries: "2-3 nights",
        sampleItineraries: [
            {
                title: "Nyerere Discovery",
                duration: "3 days",
                days: [
                    { day: 1, title: "Arrival & Boat Safari", description: "Fly in, afternoon boat safari on Rufiji River" },
                    { day: 2, title: "Walking & Game Drive", description: "Morning walking safari, afternoon game drive" },
                    { day: 3, title: "Final Activities & Departure", description: "Morning game drive or fishing, depart after lunch" }
                ]
            }
        ],

        conservation: "Anti-poaching efforts protect elephants and wild dogs. The park's size makes enforcement challenging but critical for wildlife survival.",
        communityInitiatives: "Buffer zone management with surrounding communities, employment, and education programs",
        culturalContext: "The area has historical significance as a hunting reserve and now serves as a model for multiple-use conservation.",
        localTribes: ["Matumbi", "Ndengereko"],

        travelTips: [
            { category: "What to Pack", tips: ["Lightweight clothing", "Sturdy walking shoes", "Insect repellent", "Sunscreen", "Camera"] },
            { category: "Health", tips: ["Malaria prophylaxis essential", "Yellow fever certificate required", "Travel insurance with evacuation"] },
            { category: "Activities", tips: ["Book boat safaris in advance", "Walking safaris require fitness", "Night drives reveal different wildlife"] }
        ],

        faqs: [
            { question: "What's the difference between Nyerere and Selous?", answer: "Nyerere National Park is the northern section of the former Selous Game Reserve, designated as a national park in 2019." },
            { question: "Can I combine Nyerere with other parks?", answer: "Yes! It pairs well with Ruaha, Mikumi, or as a beach extension before/after Zanzibar." },
            { question: "Are boat safaris safe?", answer: "Yes, boats are operated by experienced guides. Maintain safe distances from hippos and crocodiles." },
            { question: "Is it crowded?", answer: "No, Nyerere receives far fewer visitors than northern parks, offering an exclusive experience." }
        ],

        relatedDestinations: ["ruaha", "mikumi", "zanzibar"],
        imageUrl: "/images/destinations/nyerere/nyerere.jpg",
        gallery: ["/images/destinations/nyerere/nyerere.jpg", "/images/destinations/nyerere/nyerere-boat.jpg", "/images/destinations/nyerere/nyerere-hippos.jpg", "/images/destinations/nyerere/nyerere-wild-dogs.jpg", "/images/destinations/nyerere/nyerere-sunset.jpg", "/images/destinations/nyerere/nyerere-elephants.jpg"]
    }
];

// Merge all destinations
export const allDestinations = [...destinations, ...additionalDestinations];

export function getDestinationBySlug(slug: string): Destination | undefined {
    return allDestinations.find(d => d.slug === slug);
}

export function getDestinationsByRegion(region: string): Destination[] {
    return allDestinations.filter(d => d.region === region);
}
