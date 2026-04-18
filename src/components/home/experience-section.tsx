"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SlideInLeft, SlideInRight } from "@/components/ui/scroll-animation";

export function ExperienceSection() {
    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
                    {/* Left Side - Text Content */}
                    <SlideInLeft>
                        <div className="space-y-6 order-2 lg:order-1">
                            <div>
                                <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-3">
                                    Why Choose Us
                                </p>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                                    Authentic Tanzanian Safari Experiences
                                </h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        With over a decade of experience, we specialize in creating unforgettable safari adventures that connect you with Tanzania&apos;s incredible wildlife and rich cultural heritage.
                                    </p>
                                    <p>
                                        Our expert local guides bring decades of knowledge, ensuring you witness the Great Migration, spot the Big Five, and discover hidden gems off the beaten path.
                                    </p>
                                    <p>
                                        We believe in sustainable tourism that benefits local communities while preserving the natural beauty of Tanzania for future generations.
                                    </p>
                                    <p>
                                        From luxury lodges to authentic bush camps, every detail is carefully curated to provide you with an exceptional safari experience tailored to your dreams.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button className="btn-safari">
                                    <Link href="/about" className="inline-flex items-center font-semibold uppercase tracking-wide">
                                        Discover Our Story
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </SlideInLeft>

                    {/* Right Side - Image */}
                    <SlideInRight delay={0.2}>
                        <div className="relative h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl order-1 lg:order-2 bg-muted">
                            <Image
                                src="/images/home/features/planning-safari.jpg"
                                alt="Tanzania Safari Experience - Wildlife and Landscape"
                                fill
                                className="object-cover object-center"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            {/* Optional decorative elements */}
                            <div className="absolute bottom-4 right-4 flex space-x-2">
                                <div className="w-3 h-3 bg-white/60 dark:bg-white/40 rounded-full"></div>
                                <div className="w-3 h-3 bg-white/60 dark:bg-white/40 rounded-full"></div>
                            </div>
                        </div>
                    </SlideInRight>
                </div>
            </div>
        </section>
    );
}
