import { Metadata } from "next";
import { Target, Users, Star } from "lucide-react";
import { EnquiryForm } from "@/components/ui/enquiry-form";
import { HeroSection } from "@/components/ui/hero-section";
import { ContactContent } from "./ContactContent";
import { AnimatedSection } from "@/components/ui/contact-card";
import { FloatingParticles } from "@/components/ui/animated-background";

export const metadata: Metadata = {
    title: "Contact Us - Senza Luce Safaris",
    description: "Get in touch with Senza Luce Safaris to plan your perfect Tanzania safari adventure.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title="Contact Us"
                subtitle="Get in touch to start planning your dream safari"
                backgroundImage="/images/destinations/zanzibar/zanzibar.jpg"
                ctaText="Fill Out Form"
                ctaLink="#enquiry-form"
                overlayStyle={{ background: 'linear-gradient(rgba(18, 43, 32, 0.4), rgba(18, 43, 32, 0.65))' }}
            />

            {/* Contact Information Cards - Client Component */}
            <ContactContent />

            {/* Enquiry Form Section - Enhanced with animations */}
            <section id="enquiry-form" className="relative container py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
                {/* Background particles */}
                <FloatingParticles className="opacity-20" />

                <AnimatedSection delay={0.2}>
                    <div className="relative z-10 text-center mb-8 sm:mb-10 md:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                            Send Us a Message
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                            Fill out the form below and our team will get back to you within 24 hours
                        </p>
                    </div>
                </AnimatedSection>

                {/* Direct render with animation wrapper */}
                <AnimatedSection delay={0.4}>
                    <EnquiryForm />
                </AnimatedSection>
            </section>

            {/* Why Choose Us - Enhanced with animations */}
            <AnimatedSection delay={0.3}>
                <section className="relative container mb-8 sm:mb-12 md:mb-16 bg-muted/30 dark:bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
                    {/* Floating particles */}
                    <FloatingParticles className="opacity-20" />

                    <div className="relative z-10">
                        <div className="text-center mb-8 sm:mb-10 md:mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Why Choose Senza Luce Safaris</h2>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                                We&apos;re committed to making your safari experience unforgettable
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                            {[
                                {
                                    icon: Target,
                                    title: 'Tailored Experiences',
                                    description: 'Every safari is customized to your interests, budget, and travel style'
                                },
                                {
                                    icon: Users,
                                    title: 'Expert Local Guides',
                                    description: 'Our certified guides bring Tanzania\'s wildlife to life with deep knowledge'
                                },
                                {
                                    icon: Star,
                                    title: '5-Star Service',
                                    description: 'From inquiry to return home, we provide exceptional care and attention'
                                }
                            ].map((item, index) => (
                                <AnimatedSection key={index} delay={0.2 + index * 0.1} className="h-full">
                                    <div className="text-center p-8 md:p-10 bg-card dark:bg-muted/10 border border-border/40 rounded-2xl shadow-sm hover:shadow-md transition-all group h-full flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground max-w-[60ch] mx-auto leading-relaxed">{item.description}</p>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
}
