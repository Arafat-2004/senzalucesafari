"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useBeforeUnload } from "@/hooks/use-before-unload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, Mail, Phone, User, MapPin, MessageSquare, CheckCircle2, Download, Package, Tag, DollarSign, Check, ChevronDown, Globe, AlertCircle, Tent, Crown } from "lucide-react";
import { generateBookingPDF } from "@/lib/booking-pdf";
import { calculateSafariPrice, formatPrice } from "@/lib/pricing-engine";
import { logger } from "@/lib/reliability/logger";

// Country data with dial codes
const countries = [
    { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
    { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
    { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
    { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
    { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
    { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
    { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
    { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
    { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
    { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴" },
    { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰" },
    { code: "FI", name: "Finland", dial: "+358", flag: "🇫🇮" },
    { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
    { code: "AT", name: "Austria", dial: "+43", flag: "🇦🇹" },
    { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪" },
    { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
    { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
    { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
    { code: "HK", name: "Hong Kong", dial: "+852", flag: "🇭🇰" },
    { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
    { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
    { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
    { code: "AE", name: "UAE", dial: "+971", flag: "🇦🇪" },
    { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
    { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
    { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
    { code: "TZ", name: "Tanzania", dial: "+255", flag: "🇹🇿" },
    { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
    { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
    { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
    { code: "Other", name: "Other", dial: "+", flag: "GL" }
];

interface EnquiryFormProps {
    className?: string;
}

export function EnquiryForm({ className }: EnquiryFormProps) {
    const searchParams = useSearchParams();

    // Extract package data from URL params
    const packageData = useMemo(() => ({
        name: searchParams.get('package') || '',
        slug: searchParams.get('slug') || '',
        duration: searchParams.get('duration') || '',
        basePrice: searchParams.get('basePrice') ? parseInt(searchParams.get('basePrice')!) : 0,
        travelers: searchParams.get('travelers') ? parseInt(searchParams.get('travelers')!) : 2,
        totalPrice: searchParams.get('totalPrice') ? parseInt(searchParams.get('totalPrice')!) : 0,
        discount: searchParams.get('discount') ? parseInt(searchParams.get('discount')!) : 0,
        category: searchParams.get('category') || '',
        accommodation: searchParams.get('accommodation') || 'mid-range'
    }), [searchParams]);

    const hasPackageContext = !!packageData.name;

    // Extract accommodation details if we came from accommodations page
    const accommodationData = useMemo(() => {
        const name = searchParams.get('accommodation');
        // Only treat as accommodation inquiry if it's not a package-related accommodation type
        if (name && !hasPackageContext && name !== 'luxury' && name !== 'mid-range' && name !== 'budget') {
            return {
                name,
                tier: searchParams.get('tier') || '',
                location: searchParams.get('location') || ''
            };
        }
        return null;
    }, [searchParams, hasPackageContext]);

    const hasAccommodationContext = !!accommodationData;

    // Calculate pricing if package data exists
    const pricing = useMemo(() =>
        hasPackageContext && packageData.basePrice > 0
            ? calculateSafariPrice(packageData.basePrice, packageData.travelers, packageData.accommodation)
            : null,
        [hasPackageContext, packageData.basePrice, packageData.travelers, packageData.accommodation]
    );

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        contactPreference: "email",
        safariType: "",
        destinations: [] as string[],
        flexibleDates: "no",
        numberOfPeople: "",
        childrenCount: "0",
        childAges: "" as string,
        travelDate: "",
        duration: "",
        accommodationLevel: "",
        vehiclePreference: "",
        activities: [] as string[],
        budget: "",
        paymentPreference: "",
        pickupLocation: "",
        dropoffLocation: "",
        dietaryRequirements: "",
        medicalConditions: "",
        message: "",
        specialRequests: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    useBeforeUnload(isDirty && !isSubmitted);
    const [bookingReference, setBookingReference] = useState<string>("");
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");

    // Auto-prefill from URL parameters
    useEffect(() => {
        if (hasPackageContext) {
            setFormData(prev => ({ // eslint-disable-line react-hooks/set-state-in-effect -- intentional: one-time initialization from URL params
                ...prev,
                safariType: packageData.name,
                duration: packageData.duration,
                numberOfPeople: packageData.travelers.toString(),
                message: `I'm interested in booking the ${packageData.name}${packageData.duration ? ` (${packageData.duration})` : ''}. 
                
Package Details:
• Category: ${packageData.category}
• Travelers: ${packageData.travelers}
• Base Price: ${formatPrice(packageData.basePrice)} per person
${pricing ? `• Group Discount: ${pricing.discountPercent}% (${formatPrice(pricing.discountAmount)} off per person)` : ''}
${pricing ? `• Your Price: ${formatPrice(pricing.pricePerPerson)} per person` : ''}
${pricing ? `• Estimated Total: ${formatPrice(pricing.totalPrice)}` : ''}

Please confirm availability and provide a detailed quote.`
            }));
        } else if (hasAccommodationContext && accommodationData) {
            let level = "";
            if (accommodationData.tier === 'luxury') level = "luxury";
            else if (accommodationData.tier === 'midrange') level = "comfort";
            else if (accommodationData.tier === 'budget') level = "budget";

            setFormData(prev => ({ // eslint-disable-line react-hooks/set-state-in-effect -- intentional: one-time initialization from URL params
                ...prev,
                accommodationLevel: level,
                destinations: accommodationData.location ? [accommodationData.location] : prev.destinations,
                message: `I am interested in booking a stay at ${accommodationData.name}${accommodationData.location ? ` located in ${accommodationData.location}` : ''}. 

Please include this lodge in my custom safari itinerary and check its availability for my travel dates.`
            }));
        } else {
            const packageName = searchParams.get('package');
            const duration = searchParams.get('duration');
            const price = searchParams.get('price');

            if (packageName) {
                setFormData(prev => ({
                    ...prev,
                    safariType: packageName,
                    message: `I'm interested in the ${packageName} package${duration ? ` (${duration})` : ''}${price ? `, $${price}/person` : ''}. Please provide more details and availability.`
                }));
            }
        }
    }, [searchParams, hasPackageContext, packageData, pricing, hasAccommodationContext, accommodationData]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!hasPackageContext && !formData.safariType) newErrors.safariType = 'Please select a safari type';
        if (!formData.numberOfPeople) newErrors.numberOfPeople = 'Please select number of travelers';
        if (!formData.travelDate) newErrors.travelDate = 'Please select a travel date';
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            const firstError = document.querySelector("[data-error]");
            firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        const submissionData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            countryCode: selectedCountry.dial,
            contactPreference: formData.contactPreference,
            safariType: formData.safariType,
            destinations: formData.destinations,
            numberOfPeople: formData.numberOfPeople ? parseInt(formData.numberOfPeople) : undefined,
            travelDate: formData.travelDate,
            travelDateValue: formData.travelDate,
            duration: formData.duration,
            accommodationLevel: formData.accommodationLevel,
            activities: formData.activities,
            budget: formData.budget,
            flexibleDates: formData.flexibleDates as 'yes' | 'no',
            message: formData.message,
            specialRequests: formData.specialRequests,
            packageSlug: packageData.slug || undefined,
            basePrice: packageData.basePrice > 0 ? packageData.basePrice : undefined,
            totalPrice: pricing ? pricing.totalPrice : undefined,
            discount: pricing ? pricing.discountPercent : undefined,
            source: 'website',
        };

        try {
            const response = await fetch('/api/enquiry/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit enquiry');
            }

            if (result.enquiryId) {
                setBookingReference(result.enquiryId);
            }

            const pdfData = {
                ...formData,
                packageSlug: packageData.slug || undefined,
                basePrice: packageData.basePrice > 0 ? packageData.basePrice.toString() : undefined,
                totalPrice: pricing ? pricing.totalPrice.toString() : undefined,
                discount: pricing ? pricing.discountPercent.toString() : undefined,
                countryCode: selectedCountry.dial
            };
            generateBookingPDF(pdfData);

            setIsSubmitting(false);
            setIsSubmitted(true);

        } catch (error) {
            logger.error('Enquiry submission error', { error: error instanceof Error ? error.message : String(error) });
            setIsSubmitting(false);
            setErrors({ submit: 'Failed to submit enquiry. Please try again or contact us directly.' });
        }
    };

    const handleChange = (field: string, value: string) => {
        setIsDirty(true);
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const toggleDestination = (destination: string) => {
        setFormData((prev) => {
            const destinations = prev.destinations.includes(destination)
                ? prev.destinations.filter(d => d !== destination)
                : [...prev.destinations, destination];
            return { ...prev, destinations };
        });
    };

    const toggleActivity = (activity: string) => {
        setFormData((prev) => {
            const activities = prev.activities.includes(activity)
                ? prev.activities.filter(a => a !== activity)
                : [...prev.activities, activity];
            return { ...prev, activities };
        });
    };

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        country.dial.includes(countrySearch)
    );

    if (isSubmitted) {
        const handleDownloadPDF = () => {
            generateBookingPDF(formData);
        };

        return (
            <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground mb-2">
                    Your enquiry has been submitted successfully. We&apos;ll get back to you soon!
                </p>
                {bookingReference && (
                    <p className="text-sm font-semibold text-primary mb-4">
                        Booking Reference: {bookingReference}
                    </p>
                )}
                <p className="text-muted-foreground mb-6">
                    Our team will respond within 24-48 hours with a detailed itinerary.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="safari" className="flex items-center gap-2"
                        onClick={handleDownloadPDF}
                    >
                        <Download className="w-5 h-5" />
                        Download PDF
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => {
                            setFormData({
                                firstName: "",
                                lastName: "",
                                email: "",
                                phone: "",
                                country: "",
                                contactPreference: "email",
                                safariType: "",
                                destinations: [],
                                flexibleDates: "no",
                                numberOfPeople: "",
                                childrenCount: "0",
                                childAges: "",
                                travelDate: "",
                                duration: "",
                                accommodationLevel: "",
                                vehiclePreference: "",
                                activities: [],
                                budget: "",
                                paymentPreference: "",
                                pickupLocation: "",
                                dropoffLocation: "",
                                dietaryRequirements: "",
                                medicalConditions: "",
                                message: "",
                                specialRequests: "",
                            });
                            setIsSubmitted(false);
                            setBookingReference("");
                        }}
                    >
                        Submit Another Enquiry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 md:space-y-8 ${className}`}>
            {/* Package Summary Banner */}
            {hasPackageContext && (
                <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-2 border-primary/30 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground mb-1">Inquiring About</h3>
                            <p className="text-lg font-semibold text-primary">{packageData.name}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-semibold text-foreground">{packageData.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Travelers</span>
                                <span className="font-semibold text-foreground">{packageData.travelers} {packageData.travelers === 1 ? 'Person' : 'People'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Category</span>
                                <span className="font-semibold text-foreground">{packageData.category}</span>
                            </div>
                        </div>

                        {pricing && (
                            <div className="bg-white dark:bg-card rounded-xl p-4 border border-primary/20">
                                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    Pricing Breakdown
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Base Price</span>
                                        <span className="font-medium">{formatPrice(pricing.basePrice)} per person</span>
                                    </div>
                                    {pricing.discountPercent > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground flex items-center gap-1">
                            <Tag className="h-3 w-3 text-success" />
                                                Group Discount
                                            </span>
                            <span className="font-medium text-success">-{pricing.discountPercent}%</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Your Price</span>
                                            <span className="text-lg font-bold text-primary">{formatPrice(pricing.pricePerPerson)} per person</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                                        <span>Estimated Total</span>
                                        <span className="text-primary">{formatPrice(pricing.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                        <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground">Note:</strong> Final pricing may vary based on season, availability, and custom requirements.
                        </p>
                    </div>
                </div>
            )}

            {/* Accommodation Summary Banner */}
            {hasAccommodationContext && accommodationData && (
                <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-2 border-primary/30 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Tent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground mb-1">Inquiring About Lodge/Camp</h3>
                            <p className="text-lg font-semibold text-primary">{accommodationData.name}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Location:</span>
                                <span className="font-semibold text-foreground">{accommodationData.location || "Tanzania"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Crown className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Tier:</span>
                                <span className="font-semibold text-foreground uppercase">{accommodationData.tier || "Standard"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 1: Personal Details */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-sm">
                <div className="flex items-start sm:items-center space-x-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">Personal Details</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Please provide your contact information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div data-error={errors.firstName ? "true" : undefined}>
                        <Label htmlFor="firstName" className="mb-2 block text-foreground">
                                First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                                className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.firstName && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-destructive" role="alert">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {errors.firstName}
                            </p>
                        )}
                    </div>

                    <div data-error={errors.lastName ? "true" : undefined}>
                        <Label htmlFor="lastName" className="mb-2 block text-foreground">
                                Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                                className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.lastName && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-destructive" role="alert">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {errors.lastName}</p>
                        )}
                    </div>

                    <div data-error={errors.email ? "true" : undefined}>
                        <Label htmlFor="email" className="mb-2 block text-foreground">
                                Email Address <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                    className={`pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                        </div>
                        {errors.email && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-destructive" role="alert">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div data-error={errors.phone ? "true" : undefined}>
                        <Label htmlFor="phone" className="mb-2 block text-foreground">
                                Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative w-32 sm:w-36 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                    aria-label="Select country dial code"
                                    aria-expanded={showCountryDropdown}
                                    aria-haspopup="listbox"
                                    className="w-full h-10 px-3 flex items-center gap-2 rounded-md border border-input bg-background hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <span className="text-lg">{selectedCountry.flag}</span>
                                    <span className="text-sm text-foreground">{selectedCountry.dial}</span>
                                    <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto" />
                                </button>

                                {showCountryDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowCountryDropdown(false)} />
                                        <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                                        <div className="p-2 border-b border-border">
                                            <Input
                                                placeholder="Search country..."
                                                value={countrySearch}
                                                onChange={(e) => setCountrySearch(e.target.value)}
                                                aria-label="Search countries"
                                                className="h-9 text-sm"
                                                />
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredCountries.map((country) => (
                                                    <button
                                                        key={country.code}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedCountry(country);
                                                            setShowCountryDropdown(false);
                                                            setCountrySearch("");
                                                        }}
                                                        className="w-full px-3 py-2 flex items-center gap-3 hover:bg-accent transition-colors"
                                                    >
                                                        <span className="text-xl">{country.flag}</span>
                                                        <span className="text-sm flex-1 text-left">{country.name}</span>
                                                        <span className="text-xs text-muted-foreground">{country.dial}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="relative flex-1">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="234 567 8900"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^\d\s-()]/g, '');
                                        handleChange("phone", value);
                                    }}
                                className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                                />
                            </div>
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <Label htmlFor="country" className="mb-2 block text-foreground">Country of Residence</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                            <select
                                id="country"
                                value={formData.country}
                                onChange={(e) => handleChange("country", e.target.value)}
                                className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-card appearance-none cursor-pointer"
                            >
                                <option value="">Select your country</option>
                                {countries.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.flag} {country.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Package Booking Summary - Show only when booking a specific package */}
            {hasPackageContext && (
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-primary/30 shadow-lg">
                    <div className="flex items-start space-x-3 mb-5">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Package Selected</h3>
                            <p className="text-sm text-muted-foreground mb-4">You&apos;re booking this pre-designed safari package</p>

                            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-primary/20">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-foreground">{packageData.name}</p>
                                        {packageData.duration && (
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                <Calendar className="w-4 h-4" />
                                                {packageData.duration}
                                            </p>
                                        )}
                                        {packageData.category && (
                                            <p className="text-xs text-primary font-semibold mt-1 uppercase tracking-wide">
                                                {packageData.category}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing Summary */}
                                {pricing && (
                                    <div className="pt-3 border-t border-primary/20 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Travelers</span>
                                            <span className="font-semibold text-foreground">{packageData.travelers}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Price per person</span>
                                            <span className="font-semibold text-foreground">{formatPrice(pricing.pricePerPerson)}</span>
                                        </div>
                                        {pricing.discountPercent > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                            <Tag className="h-3 w-3 text-success" />
                                                    Group discount ({pricing.discountPercent}%)
                                                </span>
                                            <span className="font-semibold text-success">-{formatPrice(pricing.discountAmount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t border-primary/20">
                                            <span className="font-bold text-foreground">Total Price</span>
                                            <span className="text-xl font-bold text-primary">{formatPrice(pricing.totalPrice)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1">
                                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                This package includes fixed destinations, activities, and itinerary. You can mention any special requests in the message section below.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 2: Safari Preferences - ONLY show for custom enquiries */}
            {!hasPackageContext && (
                <div className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-sm">
                    <div className="flex items-start sm:items-center space-x-3 mb-5 sm:mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold">Safari Preferences</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">Help us design your perfect safari experience</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div data-error={errors.safariType ? "true" : undefined}>
                            <Label htmlFor="safariType" className="mb-2 block text-foreground">
                            Type of Safari <span className="text-destructive">*</span>
                            </Label>
                            <select
                                id="safariType"
                                value={formData.safariType}
                                onChange={(e) => handleChange("safariType", e.target.value)}
                                className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-card ${errors.safariType ? "border-destructive" : ""}`}
                            >
                                <option value="">Select safari type</option>
                                <option value="wildlife">Wildlife Safari</option>
                                <option value="migration">Great Migration</option>
                                <option value="beach">Beach Holiday</option>
                                <option value="kilimanjaro">Kilimanjaro Trek</option>
                                <option value="cultural">Cultural Tour</option>
                                <option value="luxury">Luxury Safari</option>
                                <option value="family">Family Safari</option>
                                <option value="honeymoon">Honeymoon Package</option>
                            </select>
                            {errors.safariType && (
                            <p className="mt-1 text-xs text-destructive">{errors.safariType}</p>
                            )}
                        </div>

                        <div data-error={errors.numberOfPeople ? "true" : undefined}>
                            <Label htmlFor="numberOfPeople" className="mb-2 block text-foreground">
                            Number of Travelers <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="numberOfPeople"
                                    type="number"
                                    min="1"
                                    max="50"
                                    placeholder="2"
                                    value={formData.numberOfPeople}
                                    onChange={(e) => handleChange("numberOfPeople", e.target.value)}
                                className={`pl-10 ${errors.numberOfPeople ? "border-destructive" : ""}`}
                                />
                            </div>
                            {errors.numberOfPeople && (
                            <p className="mt-1 text-xs text-destructive">{errors.numberOfPeople}</p>
                            )}
                        </div>

                        <div data-error={errors.travelDate ? "true" : undefined}>
                            <Label htmlFor="travelDate" className="mb-2 block text-foreground">
                            Preferred Travel Date <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="travelDate"
                                    type="date"
                                    value={formData.travelDate}
                                    onChange={(e) => handleChange("travelDate", e.target.value)}
                                className={`pl-10 ${errors.travelDate ? "border-destructive" : ""}`}
                                />
                            </div>
                            {errors.travelDate && (
                            <p className="mt-1 text-xs text-destructive">{errors.travelDate}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="duration" className="mb-2 block text-foreground">Preferred Duration</Label>
                            <select
                                id="duration"
                                value={formData.duration}
                                onChange={(e) => handleChange("duration", e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-card"
                            >
                                <option value="">Select duration</option>
                                <option value="1-3">1-3 Days</option>
                                <option value="4-6">4-6 Days</option>
                                <option value="7-10">7-10 Days</option>
                                <option value="11-14">11-14 Days</option>
                                <option value="15+">15+ Days</option>
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <Label htmlFor="budget" className="mb-2 block text-foreground">Budget Range (per person)</Label>
                            <select
                                id="budget"
                                value={formData.budget}
                                onChange={(e) => handleChange("budget", e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-card"
                            >
                                <option value="">Select your budget range</option>
                                <option value="1000-2000">$1,000 - $2,000</option>
                                <option value="2000-3500">$2,000 - $3,500</option>
                                <option value="3500-5000">$3,500 - $5,000</option>
                                <option value="5000-7500">$5,000 - $7,500</option>
                                <option value="7500+">$7,500+</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 3: Contact Preference */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-sm">
                <div className="flex items-start sm:items-center space-x-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">Contact Preference</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">How would you like us to contact you?</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { value: "email", label: "Email", icon: Mail },
                        { value: "whatsapp", label: "WhatsApp", icon: MessageSquare },
                        { value: "phone", label: "Phone Call", icon: Phone },
                        { value: "sms", label: "SMS", icon: MessageSquare }
                    ].map((option) => (
                        <label
                            key={option.value}
                            htmlFor={option.value}
                            className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.contactPreference === option.value
                                ? 'border-primary bg-primary/5 text-primary shadow-md scale-[1.02]'
                                : 'border-border/50 hover:border-primary/30 hover:shadow-sm'
                                }`}
                        >
                            <input
                                type="radio"
                                name="contactPreference"
                                id={option.value}
                                value={option.value}
                                checked={formData.contactPreference === option.value}
                                onChange={(e) => handleChange("contactPreference", e.target.value)}
                                className="sr-only"
                            />
                            <div className="flex flex-col items-center gap-2">
                                <option.icon className={`w-5 h-5 ${formData.contactPreference === option.value ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className="text-sm font-medium">{option.label}</span>
                            </div>
                            {formData.contactPreference === option.value && (
                                <div className="absolute top-2 right-2">
                                    <Check className="w-4 h-4 text-primary" />
                                </div>
                            )}
                        </label>
                    ))}
                </div>
            </div>

            {/* Section 4: Destinations & Activities - ONLY for custom enquiries */}
            {!hasPackageContext && (
                <div className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-sm">
                    <div className="flex items-start sm:items-center space-x-3 mb-5 sm:mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold">Destinations & Activities</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">Where do you want to go and what do you want to do?</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Destinations Checkboxes */}
                        <div>
                            <Label className="mb-3 block text-foreground">Select Destinations</Label>
                            <div className="grid grid-cols-3 gap-4">
                                {["Serengeti", "Ngorongoro", "Tarangire", "Lake Manyara", "Zanzibar", "Kilimanjaro"].map((dest) => (
                                    <label
                                        key={dest}
                                        className={`relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.destinations.includes(dest)
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-border/50 hover:border-primary/30 hover:shadow-sm'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.destinations.includes(dest)}
                                            onChange={() => toggleDestination(dest)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all ${formData.destinations.includes(dest)
                                            ? 'border-primary bg-primary'
                                            : 'border-border'
                                            }`}>
                                            {formData.destinations.includes(dest) && (
                                                <Check className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">{dest}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Activities Checkboxes */}
                        <div>
                            <Label className="mb-3 block text-foreground">Activities of Interest</Label>
                            <div className="grid grid-cols-3 gap-4">
                                {["Game Drive", "Balloon Safari", "Walking Safari", "Cultural Visit", "Bird Watching", "Photography Tour"].map((activity) => (
                                    <label
                                        key={activity}
                                        className={`relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.activities.includes(activity)
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-border/50 hover:border-primary/30 hover:shadow-sm'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.activities.includes(activity)}
                                            onChange={() => toggleActivity(activity)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all ${formData.activities.includes(activity)
                                            ? 'border-primary bg-primary'
                                            : 'border-border'
                                            }`}>
                                            {formData.activities.includes(activity) && (
                                                <Check className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">{activity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Flexible Dates */}
                        <div>
                            <Label className="mb-3 block text-foreground">Are your travel dates flexible?</Label>
                            <div className="flex gap-3">
                                {["yes", "no"].map((option) => (
                                    <label
                                        key={option}
                                        className={`relative flex-1 flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.flexibleDates === option
                                            ? 'border-primary bg-primary/5 text-primary shadow-md'
                                            : 'border-border/50 hover:border-primary/30 hover:shadow-sm'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="flexibleDates"
                                            value={option}
                                            checked={formData.flexibleDates === option}
                                            onChange={(e) => handleChange("flexibleDates", e.target.value)}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-semibold capitalize">{option}</span>
                                        {formData.flexibleDates === option && (
                                            <div className="absolute top-2 right-2">
                                                <Check className="w-4 h-4 text-primary" />
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 5: Additional Details */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-sm">
                <div className="flex items-start sm:items-center space-x-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">Additional Details</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Share any specific requirements or questions</p>
                    </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <div data-error={errors.message ? "true" : undefined}>
                        <Label htmlFor="message" className="mb-2 block text-foreground">
                            Your Message <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Tell us about your dream safari experience..."
                            value={formData.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            rows={5}
                            className={`resize-none ${errors.message ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        />
                        {errors.message && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-destructive" role="alert">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {errors.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="specialRequests" className="mb-2 block text-foreground">Special Requests or Dietary Requirements</Label>
                        <Textarea
                            id="specialRequests"
                            placeholder="Any special accommodations, dietary needs, or accessibility requirements..."
                            value={formData.specialRequests}
                            onChange={(e) => handleChange("specialRequests", e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                    <span className="text-destructive">*</span> Required fields
                </p>
                <Button
                    type="submit"
                    size="lg"
                    variant="safari" className="w-full sm:w-auto"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        <>
                            Send Enquiry
                            <Mail className="ml-2 w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
