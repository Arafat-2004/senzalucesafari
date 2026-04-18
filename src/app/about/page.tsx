import { Metadata } from "next";
import Link from "next/link";
import { companyInfo, testimonials } from "@/data/company";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, MapPin, Heart, CheckCircle } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section";

export const metadata: Metadata = {
    title: "About Us - Senza Luce Safaris",
    description: "Learn about Senza Luce Safaris - your trusted partner for authentic Tanzania safari experiences.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title={`About ${companyInfo.name}`}
                subtitle="Your trusted partner for authentic Tanzania safari experiences"
                backgroundImage="/images/about/kilimanjaro.jpg"
                ctaText="Get in Touch"
                ctaLink="/contact"
            />

            {/* Our Values */}
            <section className="container py-16 md:py-24 mb-20">
                <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: ShieldCheck, title: 'Safety & Comfort', description: 'Your safety is our top priority with well-maintained vehicles and experienced guides' },
                        { icon: Users, title: 'Honest Guidance', description: 'Transparent pricing and honest advice to help you make the best choices' },
                        { icon: MapPin, title: 'Local Expertise', description: 'Deep knowledge of Tanzania\'s best kept secrets and hidden gems' },
                        { icon: Heart, title: 'Respect for Nature', description: 'Committed to sustainable tourism that benefits local communities and wildlife' }
                    ].map(({ icon: Icon, title, description }, index) => (
                        <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                            <p className="text-muted-foreground">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Book With Us */}
            <section className="container mb-20 bg-muted p-8 md:p-12 rounded-lg">
                <h2 className="text-3xl font-bold mb-8 text-center">Why Book With Us</h2>
                <ul className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {[
                        'Locally owned and operated Tanzanian company',
                        'Experienced, certified safari guides',
                        'Customizable itineraries to match your dreams',
                        'Transparent pricing with no hidden fees',
                        '24/7 support during your safari',
                        'Committed to sustainable and responsible tourism'
                    ].map((reason, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                            <span>{reason}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Testimonials */}
            <section className="container mb-20">
                <h2 className="text-3xl font-bold mb-8 text-center">What Our Guests Say</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.slice(0, 3).map((testimonial) => (
                        <div key={testimonial.id} className="p-6 border rounded-lg">
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-500">★</span>
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                            <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                                {testimonial.tour && (
                                    <p className="text-xs text-primary mt-1">{testimonial.tour}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Ready for Your Safari Adventure?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Let us help you create unforgettable memories in the heart of Tanzania
                </p>
                <Link href="/contact">
                    <Button size="lg">Start Planning Today</Button>
                </Link>
            </section>
        </div>
    );
}
