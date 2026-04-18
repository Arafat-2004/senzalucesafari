"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/ui/booking-modal";
import type { TourPackage } from "@/data/tours";

interface TourHeroProps {
    tour: TourPackage;
}

export default function TourHero({ tour }: TourHeroProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section className="relative h-[600px] md:h-[700px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={tour.imageUrl}
                        alt={tour.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                </div>

                {/* Content */}
                <div className="relative z-10 container h-full flex flex-col justify-end pb-12 md:pb-16">
                    {/* Category Badge & Rating */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-4 py-2 bg-primary text-white rounded-full font-semibold text-sm">
                            {tour.category}
                        </span>
                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-white font-semibold">{tour.rating}/10</span>
                            <span className="text-white/70 text-sm">({tour.reviewCount} reviews)</span>
                        </div>
                    </div>

                    {/* Tour Name */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        {tour.name}
                    </h1>

                    {/* Short Description */}
                    <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8">
                        {tour.shortDescription}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <Calendar className="w-6 h-6 text-primary mb-2" />
                            <p className="text-white/70 text-sm">Duration</p>
                            <p className="text-white font-bold text-lg">{tour.duration}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <MapPin className="w-6 h-6 text-primary mb-2" />
                            <p className="text-white/70 text-sm">Start/End</p>
                            <p className="text-white font-bold text-lg">{tour.startEnd}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                            <Users className="w-6 h-6 text-primary mb-2" />
                            <p className="text-white/70 text-sm">Group Size</p>
                            <p className="text-white font-bold text-lg">2-12 People</p>
                        </div>
                        <div className="bg-primary/20 backdrop-blur-sm rounded-lg p-4 border border-primary/30">
                            <p className="text-white/70 text-sm">From</p>
                            <p className="text-white font-bold text-2xl">${tour.priceFrom.toLocaleString()}</p>
                            <p className="text-white/70 text-xs">per person</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary hover:bg-primary-dark text-white px-8"
                        >
                            Book This Safari
                        </Button>
                        <Link href={`/enquiry?package=${encodeURIComponent(tour.name)}&slug=${tour.slug}&duration=${encodeURIComponent(tour.duration)}&basePrice=${tour.priceFrom}&category=${encodeURIComponent(tour.category)}`}>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-foreground px-8">Customize Tour</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <BookingModal
                tour={tour}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
