"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, Mail, Phone, User, MapPin, MessageSquare, CheckCircle2, Star, Download, Loader2, Package, Tag, DollarSign, Check, ChevronDown } from "lucide-react";
import { generateBookingPDF } from "@/lib/booking-pdf";
import { calculateSafariPrice, formatPrice, getDiscountBadge } from "@/lib/pricing-engine";

interface EnquiryFormProps {
    className?: string;
}

export function EnquiryForm({ className }: EnquiryFormProps) {
    const searchParams = useSearchParams();

    // Extract package data from URL params
    const packageData = {
        name: searchParams.get('package') || '',
        slug: searchParams.get('slug') || '',
        duration: searchParams.get('duration') || '',
        basePrice: searchParams.get('basePrice') ? parseInt(searchParams.get('basePrice')!) : 0,
        travelers: searchParams.get('travelers') ? parseInt(searchParams.get('travelers')!) : 2,
        totalPrice: searchParams.get('totalPrice') ? parseInt(searchParams.get('totalPrice')!) : 0,
        discount: searchParams.get('discount') ? parseInt(searchParams.get('discount')!) : 0,
        category: searchParams.get('category') || '',
        accommodation: searchParams.get('accommodation') || 'mid-range'
    };

    const hasPackageContext = !!packageData.name;

    // Calculate pricing if package data exists
    const pricing = hasPackageContext && packageData.basePrice > 0
        ? calculateSafariPrice(packageData.basePrice, packageData.travelers, packageData.accommodation)
        : null;

    const [formData, setFormData] = useState({
        // Personal Details
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",

        // Contact Preference
        contactPreference: "email",

        // Safari Preferences
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

        // Additional Details
        dietaryRequirements: "",
        medicalConditions: "",
        message: "",
        specialRequests: "",
    });

    // Auto-prefill from URL parameters
    useEffect(() => {
        if (hasPackageContext) {
            setFormData(prev => ({
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
        } else {
            const packageName = searchParams.get('package');
            const duration = searchParams.get('duration');
            const price = searchParams.get('price');
            const category = searchParams.get('category');

            if (packageName) {
                setFormData(prev => ({
                    ...prev,
                    safariType: packageName,
                    message: `I'm interested in the ${packageName} package${duration ? ` (${duration})` : ''}${price ? `, $${price}/person` : ''}. Please provide more details and availability.`
                }));
            }
        }
    }, [searchParams, hasPackageContext, packageData, pricing]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [bookingReference, setBookingReference] = useState<string>("");
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [phoneCountryCode, setPhoneCountryCode] = useState("+1");

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Required fields validation
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.safariType) newErrors.safariType = "Please select a safari type";
        if (!formData.numberOfPeople) newErrors.numberOfPeople = "Number of people is required";
        if (!formData.travelDate) newErrors.travelDate = "Travel date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to first error
            const firstError = document.querySelector("[data-error]");
            firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate booking PDF with pricing info
        const bookingDataWithLocation = {
            ...formData,
            packageSlug: packageData.slug || undefined,
            basePrice: packageData.basePrice > 0 ? packageData.basePrice.toString() : undefined,
            totalPrice: pricing ? pricing.totalPrice.toString() : undefined,
            discount: pricing ? pricing.discountPercent.toString() : undefined
        };

        const result = generateBookingPDF(bookingDataWithLocation);
        setBookingReference(result.bookingRef);

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
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
        }, 3000);
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
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

    if (isSubmitted) {
        const handleDownloadPDF = () => {
            generateBookingPDF(formData);
        };

        return (
            <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground mb-2">
                    Your enquiry has been submitted successfully.
                </p>
                {bookingReference && (
                    <p className="text-sm font-semibold text-primary mb-4">
                        Booking Reference: {bookingReference}
                    </p>
                )}
                <p className="text-muted-foreground mb-6">
                    Our safari experts will contact you within 24 hours.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        className="btn-safari flex items-center gap-2"
                        onClick={handleDownloadPDF}
                    >
                        <Download className="w-5 h-5" />
                        Download Booking Details (PDF)
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => {
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
            {/* Package Summary Banner - Shows when booking a specific package */}
            {hasPackageContext && (
                <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-2 border-primary/30 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground mb-1">You're Inquiring About:</h3>
                            <p className="text-lg font-semibold text-primary">{packageData.name}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-semibold text-foreground">{packageData.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Travelers:</span>
                                <span className="font-semibold text-foreground">{packageData.travelers} {packageData.travelers === 1 ? 'person' : 'people'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Category:</span>
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
                                        <span className="text-muted-foreground">Base price</span>
                                        <span className="font-medium">{formatPrice(pricing.basePrice)} /person</span>
                                    </div>
                                    {pricing.discountPercent > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Tag className="w-3 h-3 text-green-600" />
                                                Group discount
                                            </span>
                                            <span className="font-medium text-green-600">-{pricing.discountPercent}%</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Your price</span>
                                            <span className="text-lg font-bold text-primary">{formatPrice(pricing.pricePerPerson)} /person</span>
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
                            <strong className="text-foreground">Note:</strong> This is an inquiry, not a confirmed booking. Our safari experts will review your request and send you a detailed quote within 24 hours. Prices are subject to availability and seasonal adjustments.
                        </p>
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
                        <p className="text-xs sm:text-sm text-muted-foreground">Tell us about yourself</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div data-error={errors.firstName ? "true" : undefined}>
                        <Label htmlFor="firstName" className="mb-2 block text-foreground">
                            First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                            className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                        )}
                    </div>

                    <div data-error={errors.lastName ? "true" : undefined}>
                        <Label htmlFor="lastName" className="mb-2 block text-foreground">
                            Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                        )}
                    </div>

                    <div data-error={errors.email ? "true" : undefined}>
                        <Label htmlFor="email" className="mb-2 block text-foreground">
                            Email Address <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div data-error={errors.phone ? "true" : undefined}>
                        <Label htmlFor="phone" className="mb-2 block text-foreground">
                            Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+1 234 567 8900"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="country" className="mb-2 block text-foreground">Country of Residence</Label>
                        <select
                            id="country"
                            value={formData.country}
                            onChange={(e) => handleChange("country", e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-card"
                        >
                            <option value="">Select your country</option>
                            <option value="us">United States</option>
                            <option value="uk">United Kingdom</option>
                            <option value="ca">Canada</option>
                            <option value="au">Australia</option>
                            <option value="de">Germany</option>
                            <option value="fr">France</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Section 2: Safari Preferences */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-sm">
                <div className="flex items-start sm:items-center space-x-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">Safari Preferences</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Help us design your perfect safari</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div data-error={errors.safariType ? "true" : undefined}>
                        <Label htmlFor="safariType" className="mb-2 block text-foreground">
                            Type of Safari <span className="text-red-500">*</span>
                        </Label>
                        <select
                            id="safariType"
                            value={formData.safariType}
                            onChange={(e) => handleChange("safariType", e.target.value)}
                            className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-card ${errors.safariType ? "border-red-500" : ""}`}
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
                            <p className="text-red-500 text-xs mt-1">{errors.safariType}</p>
                        )}
                    </div>

                    <div data-error={errors.numberOfPeople ? "true" : undefined}>
                        <Label htmlFor="numberOfPeople" className="mb-2 block text-foreground">
                            Number of Travelers <span className="text-red-500">*</span>
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
                                className={`pl-10 ${errors.numberOfPeople ? "border-red-500" : ""}`}
                            />
                        </div>
                        {errors.numberOfPeople && (
                            <p className="text-red-500 text-xs mt-1">{errors.numberOfPeople}</p>
                        )}
                    </div>

                    <div data-error={errors.travelDate ? "true" : undefined}>
                        <Label htmlFor="travelDate" className="mb-2 block text-foreground">
                            Preferred Travel Date <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="travelDate"
                                type="date"
                                value={formData.travelDate}
                                onChange={(e) => handleChange("travelDate", e.target.value)}
                                className={`pl-10 ${errors.travelDate ? "border-red-500" : ""}`}
                            />
                        </div>
                        {errors.travelDate && (
                            <p className="text-red-500 text-xs mt-1">{errors.travelDate}</p>
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

                    <div className="md:col-span-2">
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

            {/* Section 3: Additional Details */}
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
                    <div>
                        <Label htmlFor="message" className="mb-2 block text-foreground">Your Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Tell us about your dream safari experience..."
                            value={formData.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            rows={5}
                            className="resize-none"
                        />
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

            {/* Section 4: Contact Preference */}
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
                        { value: "email", label: "Email" },
                        { value: "whatsapp", label: "WhatsApp" },
                        { value: "phone", label: "Phone Call" },
                        { value: "sms", label: "SMS" }
                    ].map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${formData.contactPreference === option.value
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border/50 hover:border-primary/50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="contactPreference"
                                value={option.value}
                                checked={formData.contactPreference === option.value}
                                onChange={(e) => handleChange("contactPreference", e.target.value)}
                                className="sr-only"
                            />
                            <span className="text-sm font-medium">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Section 5: Destinations & Travelers */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-sm">
                <div className="flex items-start sm:items-center space-x-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">Destinations & Travelers</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Where do you want to go and who's coming?</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Destinations Checkboxes */}
                    <div>
                        <Label className="mb-3 block text-foreground">Select Destinations</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {["Serengeti", "Ngorongoro", "Tarangire", "Lake Manyara", "Zanzibar", "Kilimanjaro"].map((dest) => (
                                <label
                                    key={dest}
                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${formData.destinations.includes(dest)
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border/50 hover:border-primary/50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.destinations.includes(dest)}
                                        onChange={() => toggleDestination(dest)}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
                                    />
                                    <span className="text-sm">{dest}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Flexible Dates */}
                    <div>
                        <Label className="mb-3 block text-foreground">Are your travel dates flexible?</Label>
                        <div className="flex gap-4">
                            {["yes", "no"].map((option) => (
                                <label
                                    key={option}
                                    className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${formData.flexibleDates === option
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-border/50 hover:border-primary/50'
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
                                    <span className="text-sm font-medium capitalize">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Children Count and Ages */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="childrenCount" className="mb-2 block text-foreground">Number of Children</Label>
                            <select
                                id="childrenCount"
                                value={formData.childrenCount}
                                onChange={(e) => handleChange("childrenCount", e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-card"
                            >
                                {[0, 1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>

                        {parseInt(formData.childrenCount) > 0 && (
                            <div>
                                <Label htmlFor="childAges" className="mb-2 block text-foreground">Children Ages (comma-separated)</Label>
                                <Input
                                    id="childAges"
                                    placeholder="e.g., 5, 8, 12"
                                    value={formData.childAges}
                                    onChange={(e) => handleChange("childAges", e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 6: Preferences */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-sm">
                <div className="flex items-start sm:items-center space-x-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">Preferences</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Accommodation, vehicle, and activities</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Accommodation Level */}
                    <div>
                        <Label htmlFor="accommodationLevel" className="mb-2 block text-foreground">Accommodation Level</Label>
                        <select
                            id="accommodationLevel"
                            value={formData.accommodationLevel}
                            onChange={(e) => handleChange("accommodationLevel", e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-card"
                        >
                            <option value="">Select level</option>
                            <option value="budget">Budget</option>
                            <option value="mid-range">Mid-Range</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>

                    {/* Vehicle Preference */}
                    <div>
                        <Label htmlFor="vehiclePreference" className="mb-2 block text-foreground">Vehicle Preference</Label>
                        <select
                            id="vehiclePreference"
                            value={formData.vehiclePreference}
                            onChange={(e) => handleChange("vehiclePreference", e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-card"
                        >
                            <option value="">Select preference</option>
                            <option value="standard">Standard Safari Vehicle</option>
                            <option value="premium">Premium 4x4</option>
                            <option value="private">Private Vehicle</option>
                        </select>
                    </div>

                    {/* Activities Checkboxes */}
                    <div className="md:col-span-2">
                        <Label className="mb-3 block text-foreground">Activities of Interest</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {["Game Drive", "Balloon Safari", "Walking Safari", "Cultural Visit", "Bird Watching", "Photography Tour"].map((activity) => (
                                <label
                                    key={activity}
                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${formData.activities.includes(activity)
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border/50 hover:border-primary/50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.activities.includes(activity)}
                                        onChange={() => toggleActivity(activity)}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
                                    />
                                    <span className="text-sm">{activity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 7: Budget & Logistics */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-sm">
                <div className="flex items-start sm:items-center space-x-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">Budget & Logistics</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Payment and transportation details</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Payment Preference */}
                    <div>
                        <Label htmlFor="paymentPreference" className="mb-2 block text-foreground">Payment Preference</Label>
                        <select
                            id="paymentPreference"
                            value={formData.paymentPreference}
                            onChange={(e) => handleChange("paymentPreference", e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-card"
                        >
                            <option value="">Select method</option>
                            <option value="bank-transfer">Bank Transfer</option>
                            <option value="credit-card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="wise">Wise</option>
                        </select>
                    </div>

                    {/* Pickup Location */}
                    <div>
                        <Label htmlFor="pickupLocation" className="mb-2 block text-foreground">Pickup Location</Label>
                        <Input
                            id="pickupLocation"
                            placeholder="e.g., Kilimanjaro Airport, Arusha Hotel"
                            value={formData.pickupLocation}
                            onChange={(e) => handleChange("pickupLocation", e.target.value)}
                        />
                    </div>

                    {/* Drop-off Location */}
                    <div className="md:col-span-2">
                        <Label htmlFor="dropoffLocation" className="mb-2 block text-foreground">Drop-off Location</Label>
                        <Input
                            id="dropoffLocation"
                            placeholder="e.g., Same as pickup, Different location"
                            value={formData.dropoffLocation}
                            onChange={(e) => handleChange("dropoffLocation", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Section 8: Additional Information */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 md:p-8 border border-border/50 shadow-sm">
                <div className="flex items-start sm:items-center space-x-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">Additional Information</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Dietary, medical, and special requirements</p>
                    </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <Label htmlFor="dietaryRequirements" className="mb-2 block text-foreground">Dietary Requirements</Label>
                        <Textarea
                            id="dietaryRequirements"
                            placeholder="Vegetarian, vegan, gluten-free, allergies, etc."
                            value={formData.dietaryRequirements}
                            onChange={(e) => handleChange("dietaryRequirements", e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    <div>
                        <Label htmlFor="medicalConditions" className="mb-2 block text-foreground">Medical Conditions</Label>
                        <Textarea
                            id="medicalConditions"
                            placeholder="Any medical conditions or mobility issues we should be aware of..."
                            value={formData.medicalConditions}
                            onChange={(e) => handleChange("medicalConditions", e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    <div>
                        <Label htmlFor="message" className="mb-2 block text-foreground">Your Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Tell us about your dream safari experience..."
                            value={formData.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            rows={5}
                            className="resize-none"
                        />
                    </div>

                    <div>
                        <Label htmlFor="specialRequests" className="mb-2 block text-foreground">Special Requests</Label>
                        <Textarea
                            id="specialRequests"
                            placeholder="Any special accommodations or requests..."
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
                    <span className="text-red-500">*</span> Required fields
                </p>
                <Button
                    type="submit"
                    size="lg"
                    className="btn-safari w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 h-auto text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
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
