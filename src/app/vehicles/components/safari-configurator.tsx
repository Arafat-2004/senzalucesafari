"use client";

import { useState } from "react";
import Link from 'next/link';
import { ChevronRight, CheckCircle2, Users, DollarSign, Camera, Clock, Sparkles, ArrowRight, Mail, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CountrySelector, countries, Country } from "@/components/ui/country-selector";
import { BookingModal } from "@/components/ui/booking-modal";
import { useAnalytics } from "../hooks/use-analytics";
import { TourPackage } from "@/data/tours";

interface ConfiguratorProps {
    onComplete?: (config: SafariConfig) => void;
}

interface SafariConfig {
    groupSize: string;
    budget: string;
    safariType: string;
    duration: string;
    specialRequirements: string[];
    // Personal details (Step 6)
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    countryCode: string;
    travelDate: string;
    specialRequests: string;
}

const groupSizes = [
    { id: "1-2", label: "1-2 People", icon: Users, description: "Intimate experience" },
    { id: "3-4", label: "3-4 People", icon: Users, description: "Small group" },
    { id: "5-6", label: "5-6 People", icon: Users, description: "Family or friends" },
    { id: "7+", label: "7+ People", icon: Users, description: "Large group" }
];

const budgets = [
    { id: "$$", label: "Budget-Friendly", icon: DollarSign, description: "$200-400/day", color: "text-green-600" },
    { id: "$$$", label: "Mid-Range", icon: DollarSign, description: "$400-700/day", color: "text-blue-600" },
    { id: "$$$$", label: "Luxury", icon: DollarSign, description: "$700-1200+/day", color: "text-purple-600" }
];

const safariTypes = [
    { id: "wildlife", label: "Wildlife Safari", icon: Camera, description: "Big Five & migration" },
    { id: "photography", label: "Photography Focus", icon: Camera, description: "Best photo opportunities" },
    { id: "family", label: "Family Adventure", icon: Users, description: "Kid-friendly activities" },
    { id: "luxury", label: "Luxury Experience", icon: Sparkles, description: "Premium lodges & service" },
    { id: "adventure", label: "Adventure Trekking", icon: Clock, description: "Hiking & exploration" }
];

const durations = [
    { id: "1-3", label: "1-3 Days", description: "Quick highlights" },
    { id: "4-7", label: "4-7 Days", description: "Classic safari" },
    { id: "8+", label: "8+ Days", description: "Comprehensive tour" }
];

const specialReqs = [
    "Vegetarian/Vegan Meals",
    "Gluten-Free Options",
    "Wheelchair Accessible",
    "Child Seats Needed",
    "Medical Conditions",
    "Dietary Restrictions",
    "Celebration/Special Occasion",
    "Honeymoon Package"
];

export default function SafariConfigurator({ onComplete }: ConfiguratorProps) {
    const [step, setStep] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [config, setConfig] = useState<SafariConfig>({
        groupSize: "",
        budget: "",
        safariType: "",
        duration: "",
        specialRequirements: [],
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        countryCode: "",
        travelDate: "",
        specialRequests: ""
    });
    const { trackEvent } = useAnalytics();

    const handleNext = () => {
        trackEvent('configurator_step_complete', { step, ...config });
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const toggleRequirement = (req: string) => {
        setConfig(prev => ({
            ...prev,
            specialRequirements: prev.specialRequirements.includes(req)
                ? prev.specialRequirements.filter(r => r !== req)
                : [...prev.specialRequirements, req]
        }));
    };

    const getRecommendation = () => {
        let vehicle = "Toyota Land Cruiser GX";
        let itinerary = "4-Day Classic Tanzania Safari";

        if (config.budget === "$$$$") {
            vehicle = "Toyota Land Cruiser VX";
            itinerary = "7-Day Luxury Safari & Zanzibar";
        } else if (config.budget === "$$") {
            vehicle = "Custom Safari Minivan";
            itinerary = "3-Day Budget Safari Highlights";
        }

        if (config.safariType === "photography") {
            vehicle = "Toyota Land Cruiser VX";
            itinerary += " with Photography Focus";
        }

        return { vehicle, itinerary };
    };

    const recommendation = getRecommendation();

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Group Size</h3>
                            <p className="text-muted-foreground">What&apos;s your group size?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {groupSizes.map(size => {
                                const Icon = size.icon;
                                return (
                                    <button
                                        key={size.id}
                                        onClick={() => setConfig({ ...config, groupSize: size.id })}
                                        className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${config.groupSize === size.id
                                            ? 'border-primary bg-primary/5 shadow-lg'
                                            : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                                            }`}
                                    >
                                        <Icon className="w-8 h-8 text-primary mb-3" />
                                        <h4 className="font-bold text-foreground mb-1">{size.label}</h4>
                                        <p className="text-sm text-muted-foreground">{size.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Budget Range</h3>
                            <p className="text-muted-foreground">What&apos;s your budget per day?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {budgets.map(budget => {
                                const Icon = budget.icon;
                                return (
                                    <button
                                        key={budget.id}
                                        onClick={() => setConfig({ ...config, budget: budget.id })}
                                        className={`p-6 rounded-xl border-2 transition-all duration-300 text-center ${config.budget === budget.id
                                            ? 'border-primary bg-primary/5 shadow-lg'
                                            : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                                            }`}
                                    >
                                        <Icon className={`w-8 h-8 mx-auto mb-3 ${budget.color}`} />
                                        <h4 className="font-bold text-foreground mb-1">{budget.label}</h4>
                                        <p className="text-sm text-muted-foreground">{budget.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Safari Type</h3>
                            <p className="text-muted-foreground">What type of safari interests you?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {safariTypes.map(type => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setConfig({ ...config, safariType: type.id })}
                                        className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${config.safariType === type.id
                                            ? 'border-primary bg-primary/5 shadow-lg'
                                            : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                                            }`}
                                    >
                                        <Icon className="w-8 h-8 text-primary mb-3" />
                                        <h4 className="font-bold text-foreground mb-1">{type.label}</h4>
                                        <p className="text-sm text-muted-foreground">{type.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Duration</h3>
                            <p className="text-muted-foreground">How long would you like your safari to be?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {durations.map(duration => (
                                <button
                                    key={duration.id}
                                    onClick={() => setConfig({ ...config, duration: duration.id })}
                                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-center ${config.duration === duration.id
                                        ? 'border-primary bg-primary/5 shadow-lg'
                                        : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                                        }`}
                                >
                                    <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                                    <h4 className="font-bold text-foreground mb-1">{duration.label}</h4>
                                    <p className="text-sm text-muted-foreground">{duration.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Special Requirements</h3>
                            <p className="text-muted-foreground">Any special requirements we should know about?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {specialReqs.map(req => (
                                <button
                                    key={req}
                                    onClick={() => toggleRequirement(req)}
                                    className={`flex items-center p-4 rounded-xl border-2 transition-all duration-300 text-left ${config.specialRequirements.includes(req)
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border/50 hover:border-primary/50'
                                        }`}
                                >
                                    <CheckCircle2 className={`w-5 h-5 mr-3 flex-shrink-0 ${config.specialRequirements.includes(req) ? 'text-primary' : 'text-muted-foreground'
                                        }`} />
                                    <span className="text-sm text-foreground">{req}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-foreground mb-2">Your Contact Details</h3>
                            <p className="text-muted-foreground">Please provide your information so we can contact you</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName" className="mb-2 block">First Name *</Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    value={config.firstName}
                                    onChange={(e) => setConfig({ ...config, firstName: e.target.value })}
                                    className={config.firstName ? '' : 'border-red-500'}
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName" className="mb-2 block">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    value={config.lastName}
                                    onChange={(e) => setConfig({ ...config, lastName: e.target.value })}
                                    className={config.lastName ? '' : 'border-red-500'}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email" className="mb-2 block">Email Address *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={config.email}
                                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                                    className={`pl-10 ${config.email ? '' : 'border-red-500'}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="phone" className="mb-2 block">Phone Number *</Label>
                            <CountrySelector
                                selectedCountry={selectedCountry}
                                onCountryChange={(country) => {
                                    setSelectedCountry(country);
                                    setConfig({ ...config, country: country.name, countryCode: country.dial });
                                }}
                                phoneValue={config.phone}
                                onPhoneChange={(phone) => setConfig({ ...config, phone })}
                                error={config.phone ? undefined : 'Phone number is required'}
                            />
                        </div>

                        <div>
                            <Label htmlFor="travelDate" className="mb-2 block">Preferred Travel Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="travelDate"
                                    type="date"
                                    value={config.travelDate}
                                    onChange={(e) => setConfig({ ...config, travelDate: e.target.value })}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="specialRequests" className="mb-2 block">Special Requests (Optional)</Label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Textarea
                                    id="specialRequests"
                                    placeholder="Any dietary requirements, accessibility needs, or special requests..."
                                    value={config.specialRequests}
                                    onChange={(e) => setConfig({ ...config, specialRequests: e.target.value })}
                                    className="pl-10 resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-foreground mb-2">Your Perfect Safari</h3>
                            <p className="text-muted-foreground">Based on your preferences, we&apos;ve found the ideal match for you!</p>
                        </div>

                        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 md:p-8 border-2 border-primary/30">
                            <h4 className="text-xl font-bold text-foreground mb-4">Recommended Vehicle</h4>
                            <div className="bg-white dark:bg-card rounded-xl p-6 mb-6">
                                <h5 className="text-lg font-bold text-primary mb-2">{recommendation.vehicle}</h5>
                                <p className="text-sm text-muted-foreground mb-4">Perfect for {config.groupSize} people who enjoy {config.safariType} experiences</p>
                                <Button className="w-full" onClick={() => {
                                    trackEvent('configurator_complete', { ...config });
                                    trackEvent('book_vehicle_click', {
                                        vehicle: recommendation.vehicle,
                                        ...config
                                    });
                                    if (onComplete) onComplete(config);
                                    setShowBookingModal(true);
                                }}>
                                    Book This Vehicle <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>

                            <h4 className="text-xl font-bold text-foreground mb-4">Suggested Itinerary</h4>
                            <div className="bg-white dark:bg-card rounded-xl p-6">
                                <h5 className="text-lg font-bold text-primary mb-2">{recommendation.itinerary}</h5>
                                <p className="text-sm text-muted-foreground mb-4">Tailored to your {config.duration}-day preference</p>
                                <Link href="/safaris-tours" className="block" onClick={() => {
                                    trackEvent('view_itinerary_click', {
                                        itinerary: recommendation.itinerary,
                                        ...config
                                    });
                                }}>
                                    <Button variant="outline" className="w-full">
                                        View Full Itinerary <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Create a mock tour package for the booking modal based on recommendation
    const mockTourPackage: TourPackage = {
        id: `vehicle-${recommendation.vehicle.replace(/\s+/g, '-').toLowerCase()}`,
        slug: `vehicle-${recommendation.vehicle.replace(/\s+/g, '-').toLowerCase()}`,
        name: `${recommendation.vehicle} Safari Package`,
        shortDescription: `Custom ${config.safariType} safari with ${recommendation.vehicle}`,
        overview: `Experience your dream ${config.safariType} safari in our premium ${recommendation.vehicle}. This ${config.duration} package is tailored for ${config.groupSize} travelers.`,
        category: config.safariType || 'Custom Safari',
        duration: config.duration ? `${config.duration} Days` : 'Custom Duration',
        startEnd: 'Arusha, Tanzania',
        priceFrom: config.budget === '$$$$' ? 700 : config.budget === '$$$' ? 400 : 200,
        imageUrl: '/images/vehicles/land-cruiser-vx.jpg',
        rating: 4.9,
        reviewCount: 127,
        highlights: [
            `Professional ${config.safariType || 'safari'} guide`,
            `${recommendation.vehicle} with pop-up roof`,
            'All park fees and permits included',
            'Accommodation as per your preference',
            'Airport transfers included'
        ]
    } as TourPackage;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                        <div
                            key={num}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${num <= step
                                ? 'bg-primary text-white scale-110'
                                : 'bg-muted text-muted-foreground'
                                }`}
                        >
                            {num < step ? <CheckCircle2 className="w-5 h-5" /> : num}
                        </div>
                    ))}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${(step / 7) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step Content */}
            {renderStep()}

            {/* Navigation Buttons */}
            {step < 7 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handleBack}>
                            Back
                        </Button>
                    ) : (
                        <div />
                    )}
                    <Button
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !config.groupSize) ||
                            (step === 2 && !config.budget) ||
                            (step === 3 && !config.safariType) ||
                            (step === 4 && !config.duration) ||
                            (step === 6 && (!config.firstName || !config.lastName || !config.email || !config.phone))
                        }
                    >
                        {step === 5 ? 'Continue to Contact Details' : step === 6 ? 'See My Match' : 'Continue'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}

            {/* Booking Modal */}
            <BookingModal
                tour={mockTourPackage}
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
            />
        </div>
    );
}
