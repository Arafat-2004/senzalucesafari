import { Metadata } from "next";
import { companyInfo } from "@/data/company";
import { Mail, Phone, MessageCircle, Target, Users, Star, CalendarDays, WalletCards, MapPinned, Contact } from "lucide-react";
import { EnquiryForm } from "@/components/ui/enquiry-form";
import { HeroSection } from "@/components/ui/hero-section";

export const metadata: Metadata = {
    title: "Safari Enquiry - Senza Luce Safari",
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

            <section className="site-section py-10 sm:py-12 md:py-14">
            <div className="container grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {/* Contact Information Cards */}
                <div className="flex h-full flex-col bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">Email Us</h3>
                    <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline block mb-2">
                        {companyInfo.email}
                    </a>
                    <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                </div>

                <div className="flex h-full flex-col bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">Call or WhatsApp</h3>
                    <a href={`https://wa.me/255699209980?text=${encodeURIComponent("Jambo Senza Luce Safaris! I'm visiting your website and would like to inquire about booking a safari tour. Please let me know the available packages and pricing.")}`} className="text-primary hover:underline block mb-2" target="_blank" rel="noopener noreferrer">
                        {companyInfo.phone}
                    </a>
                    <p className="text-sm text-muted-foreground">Available Mon-Fri, 8am-6pm EAT</p>
                </div>

                <div className="flex h-full flex-col bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">Quick Response Guaranteed</h3>
                    <p className="text-muted-foreground mb-2">Receive a detailed quote within 24 hours</p>
                    <p className="text-sm text-muted-foreground">Our experts are ready to help</p>
                </div>
            </div>
            </section>

            <section className="site-section-muted py-12 sm:py-16">
                <div className="container px-4">
                    <div className="mx-auto mb-10 max-w-3xl text-center">
                        <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Plan My Safari</span>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">A simple planning journey, no payment required</h2>
                        <p className="mt-3 text-muted-foreground">
                            Share the essentials and our team will turn them into a clear safari proposal. This website records enquiries and bookings only; payments are arranged outside the system.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-5">
                        {[
                            { icon: MapPinned, title: 'Destination', text: 'Tell us where you want to go or the safari style you like.' },
                            { icon: CalendarDays, title: 'Dates', text: 'Share your preferred travel date or choose flexible dates.' },
                            { icon: Users, title: 'Travelers', text: 'Add adults, children, group size, and any special needs.' },
                            { icon: WalletCards, title: 'Budget', text: 'Guide us on comfort level and budget so the quote feels realistic.' },
                            { icon: Contact, title: 'Contact', text: 'Leave the best way to reach you for the proposal and next steps.' },
                        ].map((step, index) => (
                            <div key={step.title} className="rounded-2xl border bg-card p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <step.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground">0{index + 1}</span>
                                </div>
                                <h3 className="font-semibold text-foreground">{step.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
            <section className="site-section-muted py-12 sm:py-16 md:py-20">
                <div className="container px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">Why Start With an Enquiry</h2>
                        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                            Get clear guidance before committing, so your safari plan fits your dates, budget, and travel style.
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
