"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { testimonials } from "@/data/company";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export function TestimonialsSection() {
    const t = useTranslations();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsAutoPlaying(false);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAutoPlaying(false);
    };

    const currentTestimonial = testimonials[currentIndex];

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
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="container px-4">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        {t('home.testimonials.title')}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
                        {t('home.testimonials.subtitle')}
                    </p>
                </div>

                {/* Testimonial Carousel */}
                <div className="max-w-4xl mx-auto relative">
                    {/* Navigation Buttons */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-background/90 backdrop-blur shadow-lg hover:bg-primary hover:text-white transition-all"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-background/90 backdrop-blur shadow-lg hover:bg-primary hover:text-white transition-all"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>

                    {/* Testimonial Card */}
                    <div className="bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-border/50 relative overflow-hidden">
                        {/* Decorative Quote Icon */}
                        <Quote className="absolute top-6 right-6 w-16 h-16 text-primary/10" />

                        <div className="relative z-10">
                            {/* Stars Rating */}
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(currentTestimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 fill-accent text-accent"
                                    />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed mb-8 font-light italic">
                                "{currentTestimonial.text}"
                            </blockquote>

                            {/* Author Info */}
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">
                                    {getInitials(currentTestimonial.name)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-foreground text-base md:text-lg">
                                            {currentTestimonial.name}
                                        </h4>
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        {currentTestimonial.location}
                                    </p>
                                    {currentTestimonial.tour && (
                                        <p className="text-xs text-primary font-medium">
                                            ✓ Verified Booking • {currentTestimonial.tour}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index);
                                    setIsAutoPlaying(false);
                                }}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex
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
                    {testimonials.slice(0, 3).map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => {
                                setCurrentIndex(index);
                                setIsAutoPlaying(false);
                            }}
                        >
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                "{testimonial.text}"
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
