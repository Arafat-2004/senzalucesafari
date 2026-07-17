"use client";

import { Utensils, Wifi, Waves, AirVent, Coffee, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function AccommodationsSection() {
    const accommodations = [
        {
            category: 'Luxury Lodges',
            description: "Award-winning permanent lodges featuring private pools, gourmet dining, and unmatched wilderness views.",
            rating: 9.2,
            ratingText: 'Exceptional',
            priceFrom: 740,
            image: "/images/accommodations/luxury/luxury-lodge.jpg",
            features: ['All Meals Included', 'Swimming Pool', 'Free WiFi', 'Air Conditioning'],
            icons: [Utensils, Waves, Wifi, AirVent],
            link: "/accommodations#luxury"
        },
        {
            category: 'Mid-Range Lodges',
            description: "Comfortable, permanent tented camps and lodges balancing authentic bush ambiance with modern en-suite amenities.",
            rating: 8.6,
            ratingText: 'Excellent',
            priceFrom: 520,
            image: "/images/accommodations/midrange/midrange-lodge.jpg",
            features: ['Meals Included', 'Free WiFi', 'Swimming Pool', 'Bar & Lounge'],
            icons: [Utensils, Wifi, Waves, Coffee],
            link: "/accommodations#midrange"
        },
        {
            category: 'Budget Camps',
            description: "Secure, immersive public and private campsites that bring you closest to nature without compromising safety.",
            rating: 7.8,
            ratingText: 'Very Good',
            priceFrom: 260,
            image: "/images/accommodations/budget/budget-lodge.jpg",
            features: ['Comfortable Rooms', 'Meals Available', 'Game Drives', 'Wildlife Viewing'],
            icons: [AirVent, Utensils, Car, Utensils],
            link: "/accommodations#budget"
        }
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/20">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-10 sm:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="mb-3">Safari Accommodations for Every Budget</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        From luxury lodges to authentic tented camps, we offer comfortable stays that enhance your safari experience.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {accommodations.map((item, index) => (
                        <Link key={index} href={item.link} className="block group">
                            <Card variant="safari" className="overflow-hidden h-full border-0">
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.category}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-sm font-semibold ${item.rating >= 9 ? 'text-primary' :
                                                item.rating >= 8 ? 'text-primary' : 'text-accent'
                                                }`}>
                                                {item.rating}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{item.ratingText}</span>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-5 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">{item.category}</h3>
                                        <p className="text-sm text-muted-foreground min-h-[3rem] line-clamp-3 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        {item.icons.map((Icon, idx) => (
                                            <div key={idx} className="text-muted-foreground" title={item.features[idx]}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-3 border-t border-border flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-muted-foreground">From</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-bold text-primary">${item.priceFrom}</span>
                                                <span className="text-sm text-muted-foreground">/per night</span>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
