"use client";

import { useState } from "react";
import { TourPackage } from "@/data/tours";
import { BookingModal } from "@/components/ui/booking-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookNowCTAProps {
    tour: TourPackage;
}

export function BookNowCTA({ tour }: BookNowCTAProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex gap-3 w-full sm:w-auto">
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary-dark"
                >
                    Book Now
                </Button>
                <Link href={`/enquiry?package=${encodeURIComponent(tour.name)}&slug=${tour.slug}&duration=${encodeURIComponent(tour.duration)}&basePrice=${tour.priceFrom}&category=${encodeURIComponent(tour.category)}`}>
                    <Button variant="outline" className="flex-1 sm:flex-none">Customize</Button>
                </Link>
            </div>

            <BookingModal
                tour={tour}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
