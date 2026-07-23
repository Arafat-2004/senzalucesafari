"use client";

import Link from 'next/link';
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    return (
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background image - LCP element optimized */}
            <div className="absolute inset-0">
                <Image
                    src="/images/vehicles/land-cruiser-vx.jpg"
                    alt="Safari Vehicles Fleet"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                    fetchPriority="high"
                    quality={85}
                    // Disable blur to reduce layerize time
                    placeholder="empty"
                />
                {/* Gradient overlay — transparent at top, dark at bottom */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-black/40 to-black/75" />
            </div>

            <div className="relative z-10 container px-4 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    Our Vehicles
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                    Premium safari vehicles and reliable airport transfers for your Tanzania adventure. Comfort, safety, and unforgettable wildlife encounters.
                </p>
                <Button size="lg" className="bg-primary px-8 py-6 text-lg text-primary-foreground hover:bg-primary/90" nativeButton={false} render={<Link href="#fleet-details" className="inline-flex items-center" />}>
                    View Our Vehicles
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </section>
    );
}
