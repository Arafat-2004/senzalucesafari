import { ArrowUpCircle, Truck, Camera, Wrench, Sun, Users } from "lucide-react";
import { Vehicle, SafariMoment, PhotographyTip, Testimonial, InstagramPost } from "./types";

export const vehicleFeatures = [
    {
        icon: ArrowUpCircle,
        title: "Pop-Up Roof",
        description: "Stand safely for 360-degree wildlife views."
    },
    {
        icon: Truck,
        title: "Heavy-Duty 4x4 Suspension",
        description: "Smooth rides on rough, muddy, or rocky terrain."
    },
    {
        icon: Camera,
        title: "Photography Seating",
        description: "Tiered seats with window access and beanbag supports."
    },
    {
        icon: Wrench,
        title: "Full Safety Gear",
        description: "Two-way radios, GPS tracking, first-aid kits, and fire extinguishers."
    }
];

export const vehicles: Vehicle[] = [
    {
        id: 1,
        name: "Toyota Land Cruiser VX",
        category: "Luxury Safari Vehicle",
        imageUrl: "/images/vehicles/land-cruiser-vx.jpg",
        capacity: "6 passengers",
        rating: 5.0,
        reviews: 128,
        priceRange: "Premium",
        bestFor: ["Photography", "Luxury Travel", "Small Groups"],
        features: [
            "Pop-up roof for 360° game viewing",
            "Extended fuel tanks for remote areas",
            "Refrigerator for cold beverages",
            "Charging ports for cameras & devices",
            "Professional binoculars provided",
            "Reference library & field guides"
        ],
        specifications: {
            engine: "V8 4.5L Turbo Diesel",
            power: "268 HP @ 3,400 RPM",
            torque: "650 Nm @ 1,600 RPM",
            transmission: "6-Speed Automatic",
            drive: "4WD with Low Range",
            suspension: "Heavy-duty off-road",
            tires: "All-terrain reinforced",
            fuelCapacity: "138L + 90L auxiliary",
            groundClearance: "225mm",
            length: "4.95m",
            width: "1.97m"
        },
        safetyFeatures: [
            "ABS + EBD + Brake Assist",
            "7 Airbags",
            "GPS Tracking System",
            "Two-Way Radio Communication",
            "Fire Extinguisher",
            "First Aid Kit"
        ],
        safariEquipment: [
            "Electric Pop-Up Roof (360° view)",
            "Tiered Seating (stadium-style)",
            "Window Seats for ALL passengers",
            "Bean Bag Mounts for cameras",
            "Professional Binoculars (per seat)",
            "Field Guide Library",
            "Refrigerator Box",
            "USB Charging Ports (4x)",
            "Inverter (220V AC outlet)"
        ],
        interiorImages: [
            "/images/vehicles/vx-interior-1.jpg",
            "/images/vehicles/vx-interior-2.jpg",
            "/images/vehicles/vx-dashboard.jpg",
            "/images/vehicles/vx-seating.jpg",
            "/images/vehicles/vx-fridge.jpg",
            "/images/vehicles/vx-charging.jpg"
        ],
        exteriorImages: [
            "/images/vehicles/vx-exterior-1.jpg",
            "/images/vehicles/vx-exterior-2.jpg",
            "/images/vehicles/vx-popup-roof.jpg",
            "/images/vehicles/vx-side-profile.jpg",
            "/images/vehicles/vx-rear.jpg",
            "/images/vehicles/vx-wheels.jpg"
        ],
        actionShots: [
            "/images/vehicles/vx-river-crossing.jpg",
            "/images/vehicles/vx-dust-cloud.jpg",
            "/images/vehicles/vx-sunset.jpg",
            "/images/vehicles/vx-wildlife-encounter.jpg"
        ]
    },
    {
        id: 2,
        name: "Toyota Land Cruiser GX",
        category: "Standard Safari Vehicle",
        imageUrl: "/images/vehicles/land-cruiser-gx.jpg",
        capacity: "6 passengers",
        rating: 4.8,
        reviews: 95,
        priceRange: "Standard",
        bestFor: ["Value Seekers", "Families", "Adventure"],
        features: [
            "Pop-up roof for game viewing",
            "Extended fuel capacity",
            "Cooler box for refreshments",
            "USB charging points",
            "Binoculars available",
            "Comfortable seating"
        ],
        specifications: {
            engine: "Inline-6 4.2L Diesel",
            power: "129 HP @ 3,800 RPM",
            torque: "285 Nm @ 2,200 RPM",
            transmission: "5-Speed Manual",
            drive: "4WD",
            suspension: "Off-road tuned",
            tires: "All-terrain",
            fuelCapacity: "90L + 90L auxiliary",
            groundClearance: "220mm",
            length: "4.95m",
            width: "1.97m"
        },
        safetyFeatures: [
            "ABS Brakes",
            "Dual Airbags",
            "GPS Tracking",
            "Radio Communication",
            "Fire Extinguisher",
            "First Aid Kit"
        ],
        safariEquipment: [
            "Manual Pop-Up Roof",
            "Standard Seating",
            "Window Access",
            "Camera Bean Bags",
            "Shared Binoculars",
            "Cooler Box",
            "USB Charging (2x)"
        ],
        interiorImages: [
            "/images/vehicles/gx-interior-1.jpg",
            "/images/vehicles/gx-interior-2.jpg",
            "/images/vehicles/gx-dashboard.jpg",
            "/images/vehicles/gx-seating.jpg"
        ],
        exteriorImages: [
            "/images/vehicles/gx-exterior-1.jpg",
            "/images/vehicles/gx-exterior-2.jpg",
            "/images/vehicles/gx-popup-roof.jpg",
            "/images/vehicles/gx-side.jpg"
        ],
        actionShots: [
            "/images/vehicles/gx-action-1.jpg",
            "/images/vehicles/gx-action-2.jpg",
            "/images/vehicles/gx-safari.jpg"
        ]
    },
    {
        id: 3,
        name: "Custom Safari Minivan",
        category: "Budget-Friendly Option",
        imageUrl: "/images/vehicles/safari-minivan.jpg",
        capacity: "7 passengers",
        rating: 4.5,
        reviews: 67,
        priceRange: "Economy",
        bestFor: ["Budget Travel", "Large Groups", "Short Safaris"],
        features: [
            "Raised roof for standing view",
            "Large windows on all sides",
            "Air conditioning",
            "PA system for guide commentary",
            "Ample luggage space",
            "Cost-effective option"
        ],
        specifications: {
            engine: "2.5L Diesel Turbo",
            power: "102 HP @ 3,600 RPM",
            torque: "260 Nm @ 2,000 RPM",
            transmission: "5-Speed Manual",
            drive: "RWD/4WD options",
            suspension: "Standard",
            tires: "Highway/all-terrain",
            fuelCapacity: "70L",
            groundClearance: "180mm",
            length: "4.70m",
            width: "1.70m"
        },
        safetyFeatures: [
            "ABS Brakes",
            "Driver Airbag",
            "Seat Belts (all seats)",
            "Fire Extinguisher",
            "First Aid Kit"
        ],
        safariEquipment: [
            "Raised Roof Hatch",
            "Large Side Windows",
            "Air Conditioning",
            "PA System",
            "Luggage Rack",
            "Basic Charging Port"
        ],
        interiorImages: [
            "/images/vehicles/minivan-interior-1.jpg",
            "/images/vehicles/minivan-interior-2.jpg",
            "/images/vehicles/minivan-seating.jpg"
        ],
        exteriorImages: [
            "/images/vehicles/minivan-exterior-1.jpg",
            "/images/vehicles/minivan-exterior-2.jpg",
            "/images/vehicles/minivan-side.jpg"
        ],
        actionShots: [
            "/images/vehicles/minivan-action-1.jpg",
            "/images/vehicles/minivan-safari.jpg"
        ]
    }
];

export const safariMoments: SafariMoment[] = [
    {
        id: 1,
        photo: "/images/safaris/serengeti-migration.jpg",
        caption: "Got all Big Five in one day! The elevated view from the pop-up roof made all the difference.",
        guest: "John Anderson",
        location: "Serengeti National Park",
        vehicle: "Land Cruiser VX",
        date: "August 2025",
        rating: 5
    },
    {
        id: 2,
        photo: "/images/safaris/kilimanjaro.jpg",
        caption: "Front row seats to the Great Migration. Absolutely unforgettable experience!",
        guest: "Emma & James Wilson",
        location: "Mara River",
        vehicle: "Land Cruiser GX",
        date: "July 2025",
        rating: 5
    },
    {
        id: 3,
        photo: "/images/destinations/tarangire/tarangire.jpg",
        caption: "My daughter's first safari! She loved the bean bag camera mount - took amazing photos!",
        guest: "The Thompson Family",
        location: "Tarangire National Park",
        vehicle: "Safari Minivan",
        date: "December 2025",
        rating: 5
    },
    {
        id: 4,
        photo: "/images/destinations/ngorongoro/ngorongoro.jpg",
        caption: "5 AM wake-up call was worth it! The fridge had hot coffee ready. Best service ever!",
        guest: "Klaus Mueller",
        location: "Ngorongoro Crater",
        vehicle: "Land Cruiser VX",
        date: "September 2025",
        rating: 5
    },
    {
        id: 5,
        photo: "/images/destinations/lake-manyara/lake-manyara.jpg",
        caption: "Our guide positioned us perfectly for this leopard shot. Camera-ready in seconds!",
        guest: "Sarah Photography Pro",
        location: "Lake Manyara",
        vehicle: "Land Cruiser VX",
        date: "October 2025",
        rating: 5
    },
    {
        id: 6,
        photo: "/images/safaris/serengeti-migration.jpg",
        caption: "Sunset game drive with champagne from the fridge. Pure luxury in the wild!",
        guest: "Michael & Lisa Chen",
        location: "Central Serengeti",
        vehicle: "Land Cruiser VX",
        date: "November 2025",
        rating: 5
    }
];

export const photographyTips: PhotographyTip[] = [
    {
        icon: ArrowUpCircle,
        title: "Use the Pop-Up Roof",
        description: "Stand safely for eye-level shots of tall animals like giraffes and elephants. The 360° view ensures you never miss a moment."
    },
    {
        icon: Camera,
        title: "Bean Bag Stability",
        description: "Rest your lens on provided bean bags for shake-free telephoto shots. Essential for crisp wildlife photography."
    },
    {
        icon: Users,
        title: "Window Seat Advantage",
        description: "Every passenger gets a window seat—no fighting for views! Perfect for families and groups."
    },
    {
        icon: Sun,
        title: "Golden Hour Magic",
        description: "Early morning & late afternoon drives offer the best lighting conditions. Warm, soft light enhances every shot."
    }
];

export const testimonials: Testimonial[] = [
    {
        id: 1,
        text: "The VX was incredible! Comfortable, spacious, and the pop-up roof gave us amazing photo ops. Our guide knew exactly where to position the vehicle.",
        guest: "Michael Rodriguez",
        location: "Canada",
        rating: 5,
        vehicle: "Land Cruiser VX"
    },
    {
        id: 2,
        text: "Professional vehicle, knowledgeable driver, perfect for our family of 5. The kids loved having their own window seats!",
        guest: "The Johnson Family",
        location: "USA",
        rating: 5,
        vehicle: "Safari Minivan"
    },
    {
        id: 3,
        text: "Best safari vehicle I've experienced in 10+ African trips. The tiered seating means everyone sees everything. Brilliant design!",
        guest: "David Williams",
        location: "UK",
        rating: 5,
        vehicle: "Land Cruiser GX"
    }
];

export const instagramPosts: InstagramPost[] = [
    {
        id: 1,
        imageUrl: "/images/safaris/serengeti-migration.jpg",
        caption: "Witnessing the Great Migration from our Land Cruiser VX! #SenzaLuceSafaris",
        likes: 1247,
        comments: 89,
        timestamp: "2 days ago",
        hashtag: "#SenzaLuceSafaris"
    },
    {
        id: 2,
        imageUrl: "/images/destinations/ngorongoro/ngorongoro.jpg",
        caption: "Sunrise game drive magic! The pop-up roof gives the best views! #MySafariMoment",
        likes: 892,
        comments: 54,
        timestamp: "5 days ago",
        hashtag: "#MySafariMoment"
    },
    {
        id: 3,
        imageUrl: "/images/destinations/tarangire/tarangire.jpg",
        caption: "Family safari adventures! Kids loved the bean bag camera mounts! #SenzaLuceSafaris",
        likes: 1534,
        comments: 127,
        timestamp: "1 week ago",
        hashtag: "#SenzaLuceSafaris"
    },
    {
        id: 4,
        imageUrl: "/images/destinations/lake-manyara/lake-manyara.jpg",
        caption: "Leopard spotted! Our guide's expertise made this moment possible! #WildlifePhotography",
        likes: 2103,
        comments: 156,
        timestamp: "2 weeks ago",
        hashtag: "#WildlifePhotography"
    }
];
