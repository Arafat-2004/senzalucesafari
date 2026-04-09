export interface Testimonial {
    id: string;
    name: string;
    location: string;
    text: string;
    rating: number;
    tour?: string;
}

export const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Sarah Johnson",
        location: "United States",
        text: "An absolutely life-changing experience! The guides were knowledgeable, the animals were incredible, and every detail was perfectly planned. We saw the Big Five and created memories that will last a lifetime.",
        rating: 5,
        tour: "5 Days Tanzania Wildlife Safari"
    },
    {
        id: "2",
        name: "Michael & Emma Thompson",
        location: "United Kingdom",
        text: "Our honeymoon safari + Zanzibar trip was beyond our wildest dreams. The perfect combination of adventure and relaxation. Senza Luce Safaris took care of everything!",
        rating: 5,
        tour: "9 Days Safari + Zanzibar Beach Experience"
    },
    {
        id: "3",
        name: "David Chen",
        location: "Australia",
        text: "Climbing Kilimanjaro was the toughest challenge of my life, but with the expert guidance and support from the team, I made it to the summit! Highly recommend their trekking packages.",
        rating: 5,
        tour: "Mount Kilimanjaro Trekking"
    },
    {
        id: "4",
        name: "Lisa Anderson",
        location: "Canada",
        text: "The Serengeti exceeded all expectations. Our guide was incredibly knowledgeable about animal behavior and always positioned us for the best photos. Worth every penny!",
        rating: 5,
        tour: "5 Days Tanzania Wildlife Safari"
    },
    {
        id: "5",
        name: "Roberto Martinez",
        location: "Spain",
        text: "Professional, safe, and unforgettable. The team's attention to detail and commitment to making our trip special was evident throughout. Already planning our return!",
        rating: 5
    }
];

export const companyInfo = {
    name: "Senza Luce Safaris",
    tagline: "Explore Tanzania like never before",
    location: "Arusha, Tanzania",
    email: "info@senzalucesafaris.com",
    phone: "+255629123246",
    whatsapp: "+255629123246",

    values: [
        {
            title: "Safety and comfort",
            description: "Your well-being is our top priority"
        },
        {
            title: "Honest guidance",
            description: "Transparent planning with no hidden costs"
        },
        {
            title: "Local expertise",
            description: "Born and raised in Tanzania"
        },
        {
            title: "Respect for nature",
            description: "Sustainable tourism practices"
        }
    ],

    whyBookWithUs: [
        "Tailor-made itineraries designed around your preferences",
        "Reliable vehicles and experienced, certified guides",
        "24/7 support before, during, and after your trip",
        "Competitive pricing with excellent value",
        "Small groups for personalized experiences",
        "Deep knowledge of Tanzania's parks and culture"
    ]
};
