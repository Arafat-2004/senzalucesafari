import { Metadata } from "next";
import { companyInfo } from "@/data/company";
import { Mail, Phone, MessageCircle, Target, Users, Star } from "lucide-react";
import { EnquiryForm } from "@/components/ui/enquiry-form";
import { HeroSection } from "@/components/ui/hero-section";

export const metadata: Metadata = {
    title: "Safari Enquiry - Senza Luce Safaris",
    description: "Enquire about your perfect Tanzania safari adventure. Get a personalized quote from our safari experts.",
};

export default function EnquiryPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with Background Image */}
            <HeroSection
                title="Start Your Safari Adventure"
                subtitle="Tell us about your dream safari and we'll create a personalized itinerary just for you"
                backgroundImage="/images/contact/zanzibar.jpg"
                ctaText="Fill Out Enquiry"
                ctaLink="#enquiry-form"
            />

            <div className="container -mt-12 mb-16 grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {/* Contact Information Cards */}
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">Email Us</h3>
                    <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline block mb-2">
                        {companyInfo.email}
                    </a>
                    <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">Call or WhatsApp</h3>
                    <a href={`https://wa.me/${companyInfo.whatsapp}`} className="text-primary hover:underline block mb-2">
                        {companyInfo.phone}
                    </a>
                    <p className="text-sm text-muted-foreground">Available Mon-Fri, 8am-6pm EAT</p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">Quick Response Guaranteed</h3>
                    <p className="text-muted-foreground mb-2">Receive a detailed quote within 24 hours</p>
                    <p className="text-sm text-muted-foreground">Our experts are ready to help</p>
                </div>
            </div>

            {/* Enquiry Form */}
            <section id="enquiry-form" className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Tell Us About Your Dream Safari</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        The more details you share, the better we can tailor your perfect adventure
                    </p>
                </div>
                <EnquiryForm />
            </section>

            {/* Why Choose Us */}
            <section className="bg-muted/20 py-12 sm:py-16 md:py-20">
                <div className="container px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">Why Enquire With Us</h2>
                        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                            We make planning your safari easy and stress-free
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                        {
                            icon: Target,
                            title: 'Personalized Itineraries',
                            description: 'Every enquiry receives a custom-tailored safari proposal'
                        },
                        {
                            icon: Users,
                            title: 'Expert Advice',
                            description: 'Our guides share insider knowledge to enhance your experience'
                        },
                        {
                            icon: Star,
                            title: 'No Obligation',
                            description: 'Free, detailed quotes with zero pressure to book'
                        }
                    ].map((item, index) => (
                        <div key={index} className="rounded-2xl border border-border/50 bg-card p-6 text-center shadow-sm">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <item.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
