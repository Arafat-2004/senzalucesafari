"use client";

import { useState, useEffect } from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { testimonials } from "@/data/company";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

export function TestimonialsSection() {
    const [api, setApi] = useState<CarouselApi>(undefined);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        // Update current slide indicator
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });

        // Pause when tab is hidden
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Autoplay handled by plugin
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [api]);

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
            <div className="container px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        What Our Travelers Say
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
                        Real experiences from real adventurers who explored Tanzania with us.
                    </p>
                </div>

                {/* Testimonial Carousel */}
                <div className="max-w-4xl mx-auto relative">
                    <Carousel
                        setApi={setApi}
                        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
                        opts={{ loop: true }}
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial) => (
                                <CarouselItem key={testimonial.id}>
                                    <Card className="bg-card border-border/50 shadow-xl">
                                        <CardContent className="p-8 md:p-12">
                                            {/* Decorative Quote Icon */}
                                            <Quote className="absolute top-6 right-6 w-16 h-16 text-primary/10" />

                                            <div className="relative z-10">
                                                {/* Stars Rating */}
                                                <div className="flex items-center gap-1 mb-6">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-5 h-5 fill-accent text-accent"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Testimonial Text */}
                                                <blockquote className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed mb-8 font-light italic">
                                                    &quot;{testimonial.text}&quot;
                                                </blockquote>

                                                {/* Author Info */}
                                                <div className="flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">
                                                        {testimonial.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()
                                                            .slice(0, 2)}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-foreground text-base md:text-lg">
                                                                {testimonial.name}
                                                            </h4>
                                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-1">
                                                            {testimonial.location}
                                                        </p>
                                                        {testimonial.tour && (
                                                            <p className="text-xs text-primary font-medium">
                                                                ✓ Verified Booking • {testimonial.tour}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-4 md:-left-12 bg-background/90 backdrop-blur shadow-lg hover:bg-primary hover:text-white" />
                        <CarouselNext className="-right-4 md:-right-12 bg-background/90 backdrop-blur shadow-lg hover:bg-primary hover:text-white" />
                    </Carousel>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${index === current
                                    ? "bg-primary w-8"
                                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* All Testimonials Grid (Desktop) */}
                <div className="hidden lg:grid grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
                    {testimonials.slice(0, 3).map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                &quot;{testimonial.text}&quot;
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm">
                                    {getInitials(testimonial.name)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {testimonial.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
