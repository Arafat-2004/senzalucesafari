import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { companyInfo } from "@/data/company";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, MapPin, Heart, CheckCircle, Star, Compass, Award, Quote } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section";

export const metadata: Metadata = {
    title: "About Us - Senza Luce Safaris",
    description: "Learn about Senza Luce Safaris - your trusted partner for authentic, locally-guided Tanzania safari experiences.",
};

export default function AboutPage() {
    const coreValues = [
        { 
            icon: ShieldCheck, 
            title: 'Safety & Comfort', 
            description: 'Your safety is our top priority. We maintain a state-of-the-art 4x4 fleet and adhere to rigorous safety standards.' 
        },
        { 
            icon: Users, 
            title: 'Honest Guidance', 
            description: 'Transparent pricing with no hidden fees. We provide honest, native advice to design your ideal itinerary.' 
        },
        { 
            icon: MapPin, 
            title: 'Local Expertise', 
            description: 'Born and raised in Tanzania, our guides possess unparalleled knowledge of remote wildlife paths.' 
        },
        { 
            icon: Heart, 
            title: 'Respect for Nature', 
            description: 'We practice and promote eco-friendly, carbon-offset travel that protects wildlife and respects Maasai heritage.' 
        }
    ];

    const team = [
        {
            name: "Emmanuel Mbaga",
            role: "Founder & Lead Safari Planner",
            bio: "Born in Arusha, Emmanuel founded Senza Luce Safaris to share his lifelong passion for the Tanzanian bush through personalized, authentic travel.",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: "Joseph",
            role: "Certified Kilimanjaro Lead Guide",
            bio: "With over 150 successful summits, Joseph is a certified wilderness responder who leads climbers safely up Uhuru Peak with songs and unmatched determination.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: "Sarah",
            role: "Senior Wildlife Safari Guide",
            bio: "An expert in avian biology and feline tracking, Sarah has spent 8 years guiding travelers through Serengeti river crossings and Ngorongoro crater paths.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: "Nassor",
            role: "Cultural Tour Coordinator",
            bio: "Nassor facilitates respectful, authentic community visits, connecting travelers directly with Maasai, Hadzabe, and Datoga tribal groups.",
            image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400"
        }
    ];

    const teamTestimonials = [
        {
            id: "about-t1",
            name: "Marcus & Clara Lindqvist",
            location: "Sweden",
            text: "Our guide Sarah was unbelievable. She was a master at finding leopards and cheetahs, but what truly touched us was her deep knowledge and how she shared stories about Tanzanian culture. We left feeling like family.",
            rating: 5,
            tour: "7 Days Classic Serengeti & Ngorongoro"
        },
        {
            id: "about-t2",
            name: "Dr. James Vance",
            location: "United Kingdom",
            text: "The planning team under Emmanuel designed a bespoke itinerary that catered perfectly to my wife's mobility limits while keeping the adventure alive. The guide's care and safety awareness were top-notch.",
            rating: 5,
            tour: "Bespoke Comfort Wildlife Safari"
        },
        {
            id: "about-t3",
            name: "Chloe Mercer",
            location: "Canada",
            text: "Summiting Kilimanjaro was only possible because of the amazing porters and lead guide Joseph. They sang songs to keep our spirits up, monitored our oxygen levels daily, and literally carried us to Uhuru Peak.",
            rating: 5,
            tour: "6 Days Machame Route Trek"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with background image and text protection overlay */}
            <HeroSection
                title={`About ${companyInfo.name}`}
                subtitle="Your trusted partner for authentic, locally-guided Tanzania safari experiences"
                backgroundImage="/images/about/kilimanjaro.jpg"
                ctaText="Start Planning"
                ctaLink="/enquiry"
            />

            {/* Our Story Section - Human element integration */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <span className="px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                            Our Story
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                            Built from a Deep Passion for the Wild
                        </h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
                            <p>
                                Senza Luce Safaris was founded in Arusha, Tanzania, with a simple yet powerful goal: to offer travelers authentic, intimate, and highly customizable adventures that depart from generic, commercialized tours.
                            </p>
                            <p>
                                We believe a safari is not just about checking boxes or taking photos of the Big Five. It is about understanding the delicate balance of the savanna, listening to the night calls from an open fire, and forming genuine connections with local communities.
                            </p>
                            <p>
                                As a 100% locally owned and operated business, we employ native guides, cooks, and porters, ensuring that every booking directly supports schools, wildlife conservation, and families in the Arusha and Serengeti regions.
                            </p>
                        </div>
                    </div>
                    <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-muted group">
                        <Image
                            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=600"
                            alt="Safari sunset in Tanzania"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                            <p className="text-sm font-semibold">Tanzanian Wilderness</p>
                            <p className="text-xs opacity-80">Our home and heritage</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Core Values - Rich card styles */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/20 border-y border-border/40">
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                        Integrity First
                    </span>
                    <h2 className="text-3xl font-bold text-foreground mt-3">Our Core Values</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coreValues.map(({ icon: Icon, title, description }, index) => (
                        <div key={index} className="p-6 bg-card border border-border/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Book With Us - Split 2-column layout */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
                    {/* Left side: Action Photo */}
                    <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-muted group order-2 lg:order-1">
                        <Image
                            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600"
                            alt="Custom 4x4 safari cruiser in Serengeti"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <p className="text-lg font-bold">Custom Fleet</p>
                            <p className="text-xs opacity-90">Fully modified Land Cruisers for maximum safety</p>
                        </div>
                    </div>

                    {/* Right side: Bold Bullets */}
                    <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                        <span className="px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                            The Senza Luce Standard
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                            Why Book With Us
                        </h2>
                        
                        <div className="grid gap-4 sm:gap-6 pt-2">
                            {[
                                { title: "Locally Owned", text: "Proudly Tanzanian operated company based in Arusha, ensuring your travel funds directly benefit local communities." },
                                { title: "Certified Guides", text: "Native guides with deep expertise in navigation, tracking, wildlife behaviors, and wilderness first aid." },
                                { title: "Tailored Itineraries", text: "No templates. Every trek and safari is designed from scratch around your exact dates, pace, and comfort level." },
                                { title: "Transparent Pricing", text: "Honest, all-inclusive quotes with no surprise permit surcharges or hidden service fees." },
                                { title: "24/7 Operations Backup", text: "Our ground control office coordinates permits, weather tracking, and schedules in real-time." },
                                { title: "Eco-Conscious Tourism", text: "Active measures to minimize carbon emissions, support local schools, and respect pristine ecosystems." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start space-x-3.5">
                                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-foreground text-sm sm:text-base">{item.title}</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-0.5">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the Team / Our Guides - Addressing the human element gap */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/20 border-t border-border/40">
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                        Local Experts
                    </span>
                    <h2 className="text-3xl font-bold text-foreground mt-3">Meet Your Safari Team</h2>
                    <p className="text-muted-foreground text-sm sm:text-base mt-2">
                        Friendly, licensed, and highly certified professionals dedicated to making your journey safe and unforgettable
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {team.map((member, index) => (
                        <div key={index} className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                            <div className="relative aspect-square w-full bg-muted">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </div>
                            <div className="p-5 flex flex-col flex-1 space-y-2">
                                <div>
                                    <h3 className="font-bold text-foreground text-base sm:text-lg">{member.name}</h3>
                                    <p className="text-xs text-primary font-semibold uppercase tracking-wide">{member.role}</p>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials - Filtered specifically for guiding/service theme */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                        Guest Stories
                    </span>
                    <h2 className="text-3xl font-bold text-foreground mt-3">Experience Through Their Eyes</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamTestimonials.map((testimonial) => (
                        <div key={testimonial.id} className="p-6 bg-card border border-border/50 rounded-xl hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-full relative">
                            <div className="absolute -top-4 -right-2 text-primary/15 pointer-events-none">
                                <Quote className="w-16 h-16 transform scale-y-[-1]" />
                            </div>
                            <div>
                                <div className="flex items-center mb-4 gap-0.5">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground mb-6 italic leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                            </div>
                            <div className="pt-4 border-t border-border/40">
                                <p className="font-bold text-foreground text-sm sm:text-base">{testimonial.name}</p>
                                <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                                {testimonial.tour && (
                                    <span className="inline-block mt-2 px-2.5 py-1 bg-primary/5 border border-primary/10 rounded-md text-[10px] text-primary font-semibold">
                                        {testimonial.tour}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA - Start Planning Today */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24 text-center">
                <div className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 rounded-3xl p-8 sm:p-12 border border-primary/20 shadow-xl">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Ready for Your Safari Adventure?</h2>
                    <p className="text-base sm:text-lg text-muted-foreground mb-8">
                        Let Emmanuel and our guide team help you create unforgettable memories in the heart of Tanzania
                    </p>
                    <Link href="/enquiry">
                        <Button size="lg" variant="safari" className="shadow-lg hover:shadow-primary/30 transition-all font-semibold uppercase tracking-wide">
                            Start Planning Today
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
