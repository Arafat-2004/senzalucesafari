"use client";

import { useState, useEffect } from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import type { TestimonialData } from "@/lib/db/reviews";
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

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialData[] }) {
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
        <section className="site-section py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="container px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16 flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Guest Stories From the Safari Trail
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg mb-6">
                        See how past travelers describe the planning, guiding, wildlife encounters, and care they received.
                    </p>
                    
                    {/* Trustpilot Rating Widget */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <a 
                            href="https://www.trustpilot.com/review/senzalucesafari.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-wrap items-center justify-center gap-3 bg-card border border-border/80 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
                        >
                            {/* Trustpilot Star Icon */}
                            <span className="flex items-center text-[#00b67a]">
                                <svg viewBox="0 0 100 100" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50 0l11.7 36.1h38L70.9 58.4 82.6 94.5 50 72.3 17.4 94.5 29.1 58.4 0 36.1h38z"/>
                                    <path d="M50 72.3L17.4 94.5l11.7-36.1L0 36.1h38L50 0v72.3z" fill="#73E6A6" opacity="0.3"/>
                                </svg>
                            </span>
                            <span className="text-sm font-bold tracking-tight text-foreground">
                                Trustpilot
                            </span>
                            <span className="h-4 w-px bg-border/80" />
                            <span className="text-xs text-muted-foreground">
                                TrustScore <strong className="font-semibold text-foreground">4.9</strong>
                            </span>
                            <span className="h-4 w-px bg-border/80" />
                            {/* Trustpilot Stars */}
                            <span className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="w-4 h-4 bg-[#00b67a] flex items-center justify-center rounded-sm">
                                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    </span>
                                ))}
                            </span>
                        </a>
                    </div>
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
                                                        {(testimonial.verified || testimonial.tour) && (
                                                            <p className="text-xs text-primary font-medium">
                                                                {testimonial.verified ? '✓ Verified Booking' : 'Traveler story'}
                                                                {testimonial.tour ? ` • ${testimonial.tour}` : ''}
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

                {/* Trustpilot Navigation/Action */}
                <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                    <a 
                        href="https://www.trustpilot.com/review/senzalucesafari.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00b67a]/10 hover:bg-[#00b67a]/15 text-[#00b67a] hover:text-[#00a36c] font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow"
                    >
                        <span>Read all guest reviews on Trustpilot</span>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
