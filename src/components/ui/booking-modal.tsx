"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, MapPin, Star, CheckCircle2, Users, Minus, Plus, Tag, ChevronRight, ChevronLeft, Mail, Calendar, MessageSquare, Zap, Car, AlertCircle, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CountrySelector, countries } from "@/components/ui/country-selector";
import { TourPackage } from "@/data/tours";
import { calculateSafariPrice, formatPrice, ACCOMMODATION_LEVELS } from "@/lib/pricing-engine";
import { generateBookingPDF } from "@/lib/booking-pdf";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { BookingCalendar } from "@/components/ui/booking-calendar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookingModalProps {
    tour: TourPackage | null;
    isOpen: boolean;
    onClose: () => void;
}

export function BookingModal({ tour, isOpen, onClose }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [travelers, setTravelers] = useState(2);
    const [accommodationLevel, setAccommodationLevel] = useState("mid-range");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [bookingRef, setBookingRef] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
    const { toast } = useToast();

    const upsells = [
        { id: "transfer", name: "Airport Transfer", description: "Pick-up & drop-off service", price: 150 },
        { id: "privateguide", name: "Private Guide", description: "Dedicated guide throughout your safari", price: 200 },
        { id: "extraday", name: "Extra Safari Day", description: "Add one more day to your adventure", price: 350 },
    ];

    const toggleUpsell = (id: string) => {
        setSelectedUpsells(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const [personalInfo, setPersonalInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        travelDate: "",
        endDate: "",
        specialRequests: ""
    });

    if (!tour) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
                        <Dialog.Portal>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                                onClick={onClose}
                            />
                            <Dialog.Popup>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md bg-card rounded-2xl shadow-2xl z-50 border border-border/50 p-8 text-center"
                                >
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Tour Not Found</h3>
                                    <p className="text-muted-foreground mb-6">
                                        The tour you are trying to book could not be loaded. Please try again.
                                    </p>
                                    <Button onClick={onClose} className="w-full">
                                        Close
                                    </Button>
                                </motion.div>
                            </Dialog.Popup>
                        </Dialog.Portal>
                    </Dialog.Root>
                )}
            </AnimatePresence>
        );
    }

    const pricing = calculateSafariPrice(tour.priceFrom, travelers, accommodationLevel);

    const handleIncrementTravelers = () => {
        if (travelers < 20) setTravelers(prev => prev + 1);
    };

    const handleDecrementTravelers = () => {
        if (travelers > 1) setTravelers(prev => prev - 1);
    };

    const handleSubmit = async () => {
        // Validate form before submission
        if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email || !personalInfo.phone || !personalInfo.travelDate) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields before proceeding.",
                variant: "warning",
            });
            return;
        }

        setIsSubmitting(true);

        toast({
            title: "Processing Booking",
            description: "Please wait while we submit your booking request...",
            variant: "info",
        });

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const bookingData = {
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            email: personalInfo.email,
            phone: `${selectedCountry.dial} ${personalInfo.phone}`,
            country: selectedCountry.name,
            countryCode: selectedCountry.dial,
            safariType: tour.name,
            duration: tour.duration,
            numberOfPeople: travelers.toString(),
            accommodationLevel,
            travelDate: personalInfo.travelDate,
            specialRequests: personalInfo.specialRequests,
            packageSlug: tour.slug,
            basePrice: tour.priceFrom.toString(),
            totalPrice: pricing.totalPrice.toString(),
            discount: pricing.discountPercent.toString(),
            contactPreference: "email",
            destinations: [],
            flexibleDates: "no",
            childrenCount: "0",
            childAges: "",
            vehiclePreference: "",
            activities: [],
            budget: "",
            paymentPreference: "",
            pickupLocation: "",
            dropoffLocation: "",
            dietaryRequirements: "",
            medicalConditions: "",
            message: `Booking request for ${tour.name}`
        };

        // Generate PDF (always happens)
        const result = generateBookingPDF(bookingData);
        
        // Call API to save to database and send emails (non-blocking)
        try {
            const apiResponse = await fetch('/api/tours/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: personalInfo.firstName,
                    lastName: personalInfo.lastName,
                    email: personalInfo.email,
                    phone: `${selectedCountry.dial} ${personalInfo.phone}`,
                    country: selectedCountry.name,
                    countryCode: selectedCountry.dial,
                    tourId: tour.id,
                    tourName: tour.name,
                    tourSlug: tour.slug,
                    travelDate: personalInfo.travelDate,
                    endDate: personalInfo.endDate,
                    numberOfTravelers: travelers,
                    accommodationLevel,
                    specialRequests: personalInfo.specialRequests || undefined,
                    basePrice: tour.priceFrom,
                    totalPrice: pricing.totalPrice,
                    currency: 'USD',
                }),
            });

            const apiData = await apiResponse.json();
            
            if (apiResponse.ok && apiData.referenceNumber) {
                // Use API reference number if successful
                setBookingRef(apiData.referenceNumber);
            } else {
                // Fallback to PDF reference number
                setBookingRef(result.bookingRef);
                console.warn('[BookingModal] API returned no reference number, using PDF reference');
            }
        } catch (error) {
            // Non-blocking error - PDF still generated, user still gets reference
            setBookingRef(result.bookingRef);
            console.error('[BookingModal] API booking failed (non-blocking):', error);
            toast({
                title: "Booking Saved Locally",
                description: "Our team will contact you shortly.",
                variant: "info",
            });
        }

        setIsSubmitting(false);
        setIsSubmitted(true);

        toast({
            title: "Booking Submitted!",
            description: `Your booking reference is ${bookingRef || result.bookingRef}. We'll contact you shortly.`,
            variant: "success",
        });
    };

    const handleClose = () => {
        setStep(1);
        setTravelers(2);
        setAccommodationLevel("mid-range");
        setSelectedCountry(countries[0]);
        setPersonalInfo({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            country: "",
            travelDate: "",
            endDate: "",
            specialRequests: ""
        });
        setIsSubmitted(false);
        setBookingRef("");
        onClose();
    };

    const handleDateSelect = (dates: { from: Date | undefined; to: Date | undefined }) => {
        if (dates.from) {
            const startDate = dates.from.toISOString().split('T')[0];
            const endDate = dates.to ? dates.to.toISOString().split('T')[0] : '';
            setPersonalInfo(prev => ({
                ...prev,
                travelDate: startDate,
                endDate: endDate
            }));

            if (dates.to) {
                toast({
                    title: "Dates Selected",
                    description: `${dates.from.toLocaleDateString()} - ${dates.to.toLocaleDateString()}`,
                    variant: "success",
                });
            }
        }
    };

    const canProceedToStep3 = personalInfo.firstName && personalInfo.lastName && personalInfo.email && personalInfo.phone && personalInfo.travelDate && personalInfo.endDate;

    const stepIndicator = (
        <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                    Step 1: Configure
                </span>
                <span className={`font-medium ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                    Step 2: Details
                </span>
                <span className={`font-medium ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                    Step 3: Confirm
                </span>
            </div>
            <Progress value={(step / 3) * 100} className="h-2" />
            <div className="flex items-center justify-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${s < step ? 'bg-primary text-white' :
                            s === step ? 'bg-primary text-white ring-4 ring-primary/20' :
                                'bg-muted text-muted-foreground'
                            }`}>
                            {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                        </div>
                        {s < 3 && (
                            <div className={`w-16 sm:w-24 h-1 mx-2 transition-all ${s < step ? 'bg-primary' : 'bg-muted'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
                    <Dialog.Portal>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={handleClose}
                        />

                        <Dialog.Popup>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl z-50 border border-border/50"
                            >
                                <div className="relative">
                                    <button
                                        onClick={handleClose}
                                        className="absolute top-4 right-4 z-10 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors border border-border/50"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-4 h-4 text-foreground" />
                                    </button>

                                    {step === 1 && (
                                        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-muted">
                                            <Image
                                                src={tour.imageUrl}
                                                alt={tour.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 672px"
                                                priority
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-md">
                                                {tour.category}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6 md:p-8 space-y-6">
                                        {isSubmitted ? (
                                            <div className="text-center py-12 space-y-6">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", duration: 0.5 }}
                                                    className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                                                >
                                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                                </motion.div>
                                                <div>
                                                    <h2 className="text-3xl font-bold text-foreground mb-2">Booking Submitted!</h2>
                                                    <p className="text-muted-foreground mb-4">Your booking request has been received successfully.</p>
                                                    <div className="bg-primary/10 rounded-lg p-4 inline-block">
                                                        <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                                                        <p className="text-2xl font-bold text-primary">{bookingRef}</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-6 max-w-md mx-auto">
                                                        Our safari experts will contact you within 24 hours with a detailed quote.
                                                    </p>
                                                </div>
                                                <Button onClick={handleClose} variant="safari">Close</Button>
                                            </div>
                                        ) : (
                                            <>
                                                {stepIndicator}

                                                <AnimatePresence mode="wait">
                                                    {step === 1 && (
                                                        <motion.div
                                                            key="step1"
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            className="space-y-6"
                                                        >
                                                            <div className="text-center mb-6">
                                                                <h2 className="text-2xl font-bold text-foreground mb-2">{tour.name}</h2>
                                                                {tour.rating && (
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <div className="flex items-center">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(tour.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                                                                            ))}
                                                                        </div>
                                                                        <span className="text-sm font-semibold">{tour.rating.toFixed(1)} ({tour.reviewCount} reviews)</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <p className="text-muted-foreground">{tour.overview || tour.shortDescription}</p>

                                                            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-xl border">
                                                                <div className="flex items-start gap-3">
                                                                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground uppercase">Duration</p>
                                                                        <p className="text-sm font-semibold">{tour.duration}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-start gap-3">
                                                                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground uppercase">Start/End</p>
                                                                        <p className="text-sm font-semibold">{tour.startEnd}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {tour.highlights && tour.highlights.length > 0 && (
                                                                <div>
                                                                    <h3 className="text-sm font-bold uppercase tracking-wide mb-3">Highlights</h3>
                                                                    <ul className="space-y-2">
                                                                        {tour.highlights.map((highlight, index) => (
                                                                            <li key={index} className="flex items-start gap-2">
                                                                                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                                                <span className="text-sm text-muted-foreground">{highlight}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {/* Booking Calendar */}
                                                            <div>
                                                                <h3 className="text-sm font-bold uppercase tracking-wide mb-3">Select Your Dates</h3>
                                                                <BookingCalendar
                                                                    onDateSelect={handleDateSelect}
                                                                    className="shadow-sm"
                                                                />
                                                                {(personalInfo.travelDate || personalInfo.endDate) && (
                                                                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                                        <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                                                                            <CheckCircle2 className="w-4 h-4" />
                                                                            Selected: {personalInfo.travelDate} → {personalInfo.endDate || 'Select end date'}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20 space-y-4">
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <Users className="w-5 h-5 text-primary" />
                                                                            <span className="text-sm font-semibold">Number of Travelers</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <button onClick={handleDecrementTravelers} disabled={travelers <= 1} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                                                <Minus className="w-4 h-4" />
                                                                            </button>
                                                                            <span className="text-xl font-bold w-8 text-center">{travelers}</span>
                                                                            <button onClick={handleIncrementTravelers} disabled={travelers >= 20} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                                                <Plus className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        {ACCOMMODATION_LEVELS.map(level => (
                                                                            <button
                                                                                key={level.id}
                                                                                onClick={() => setAccommodationLevel(level.id)}
                                                                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${accommodationLevel === level.id ? 'bg-primary text-white shadow-md' : 'bg-card border border-border hover:border-primary'}`}
                                                                            >
                                                                                {level.label}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="bg-card rounded-lg p-3 space-y-2">
                                                                    <div className="flex justify-between text-sm">
                                                                        <span className="text-muted-foreground">Base price per person</span>
                                                                        <span className="font-medium">{formatPrice(pricing.basePrice)}</span>
                                                                    </div>
                                                                    {pricing.discountPercent > 0 && (
                                                                        <div className="flex justify-between text-sm">
                                                                            <span className="text-muted-foreground flex items-center gap-1">
                                                                                <Tag className="w-3 h-3 text-green-600" />
                                                                                Group discount ({pricing.discountPercent}%)
                                                                            </span>
                                                                            <span className="font-medium text-green-600">-{formatPrice(pricing.discountAmount)}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="border-t pt-2">
                                                                        <div className="flex justify-between">
                                                                            <span className="font-semibold">Your price per person</span>
                                                                            <span className="text-xl font-bold text-primary">{formatPrice(pricing.pricePerPerson)}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between text-sm pt-1 border-t">
                                                                        <span className="text-muted-foreground">Total ({travelers} traveler{travelers > 1 ? 's' : ''})</span>
                                                                        <span className="font-bold">{formatPrice(pricing.totalPrice + selectedUpsells.reduce((sum, id) => {
                                                                            const upsell = upsells.find(u => u.id === id);
                                                                            return sum + (upsell?.price || 0);
                                                                        }, 0))}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Upsell Section */}
                                                                <div className="border-t pt-4">
                                                                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                                                                        <Zap className="w-4 h-4 text-amber-500" />
                                                                        Enhance Your Safari
                                                                    </h4>
                                                                    <div className="space-y-2">
                                                                        {upsells.map(upsell => (
                                                                            <button
                                                                                key={upsell.id}
                                                                                onClick={() => toggleUpsell(upsell.id)}
                                                                                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${selectedUpsells.includes(upsell.id) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedUpsells.includes(upsell.id) ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                                                        {selectedUpsells.includes(upsell.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                                                    </div>
                                                                                    <div className="text-left">
                                                                                        <p className="text-sm font-medium">{upsell.name}</p>
                                                                                        <p className="text-xs text-muted-foreground">{upsell.description}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <span className="text-sm font-semibold text-green-600">+${upsell.price}</span>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {step === 2 && (
                                                        <motion.div
                                                            key="step2"
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            className="space-y-6"
                                                        >
                                                            <div className="text-center mb-6">
                                                                <h2 className="text-2xl font-bold text-foreground mb-2">Your Details</h2>
                                                                <p className="text-muted-foreground">Please provide your contact and travel information</p>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label htmlFor="firstName" className="mb-2">First Name *</Label>
                                                                    <Input id="firstName" value={personalInfo.firstName} onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))} placeholder="John" />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="lastName" className="mb-2">Last Name *</Label>
                                                                    <Input id="lastName" value={personalInfo.lastName} onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))} placeholder="Doe" />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <Label htmlFor="email" className="mb-2">Email *</Label>
                                                                <div className="relative">
                                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                                    <Input id="email" type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))} placeholder="john@example.com" className="pl-10" />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <Label htmlFor="phone" className="mb-2">Phone Number *</Label>
                                                                <CountrySelector
                                                                    selectedCountry={selectedCountry}
                                                                    onCountryChange={(country) => {
                                                                        setSelectedCountry(country);
                                                                        setPersonalInfo(prev => ({ ...prev, country: country.name }));
                                                                    }}
                                                                    phoneValue={personalInfo.phone}
                                                                    onPhoneChange={(phone) => setPersonalInfo(prev => ({ ...prev, phone }))}
                                                                    error={undefined}
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label className="mb-2">Travel Dates *</Label>
                                                                {personalInfo.travelDate && personalInfo.endDate ? (
                                                                    <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                                                                        <div className="flex items-center gap-3">
                                                                            <Calendar className="w-5 h-5 text-primary" />
                                                                            <div>
                                                                                <p className="text-sm font-semibold text-foreground">
                                                                                    {new Date(personalInfo.travelDate).toLocaleDateString('en-US', {
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                        year: 'numeric'
                                                                                    })}
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    to {new Date(personalInfo.endDate).toLocaleDateString('en-US', {
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                        year: 'numeric'
                                                                                    })}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {(() => {
                                                                            const start = new Date(personalInfo.travelDate);
                                                                            const end = new Date(personalInfo.endDate);
                                                                            const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                                                            return (
                                                                                <p className="text-xs text-primary mt-2 font-medium">
                                                                                    Duration: {nights} night{nights !== 1 ? 's' : ''}
                                                                                </p>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                                                        <p className="text-sm text-amber-800 dark:text-amber-200">
                                                                            Please select your travel dates in Step 1
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label htmlFor="specialRequests" className="mb-2">Special Requests (Optional)</Label>
                                                                <div className="relative">
                                                                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                                    <Textarea id="specialRequests" value={personalInfo.specialRequests} onChange={(e) => setPersonalInfo(prev => ({ ...prev, specialRequests: e.target.value }))} placeholder="Any dietary requirements, accessibility needs, or special requests..." className="pl-10 resize-none" rows={3} />
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {step === 3 && (
                                                        <motion.div
                                                            key="step3"
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            className="space-y-6"
                                                        >
                                                            <div className="text-center mb-6">
                                                                <h2 className="text-2xl font-bold text-foreground mb-2">Review & Submit</h2>
                                                                <p className="text-muted-foreground">Please review your booking details before submitting</p>
                                                            </div>

                                                            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
                                                                <h3 className="font-bold text-foreground mb-3">Package Details</h3>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Package</span>
                                                                        <span className="font-semibold">{tour.name}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Duration</span>
                                                                        <span>{tour.duration}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Travel Date</span>
                                                                        <span>{new Date(personalInfo.travelDate).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-muted/30 rounded-xl p-4 border">
                                                                <h3 className="font-bold text-foreground mb-3">Contact Information</h3>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Name</span>
                                                                        <span>{personalInfo.firstName} {personalInfo.lastName}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Email</span>
                                                                        <span>{personalInfo.email}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Phone</span>
                                                                        <span>{personalInfo.phone}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-card rounded-xl p-4 border-2 border-primary/30">
                                                                <h3 className="font-bold text-foreground mb-3">Pricing Summary</h3>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Travelers</span>
                                                                        <span>{travelers}</span>
                                                                    </div>
                                                                    {pricing.discountPercent > 0 && (
                                                                        <div className="flex justify-between text-green-600">
                                                                            <span>Group discount ({pricing.discountPercent}%)</span>
                                                                            <span>-{formatPrice(pricing.discountAmount)}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="border-t pt-2 mt-2">
                                                                        <div className="flex justify-between">
                                                                            <span className="font-bold">Total Price</span>
                                                                            <span className="text-2xl font-bold text-primary">{formatPrice(pricing.totalPrice)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                                                    By submitting, you agree that our team will contact you within 24 hours to confirm availability. No payment required now.
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="flex gap-3 pt-4 border-t">
                                                    {step > 1 && (
                                                        <Button onClick={() => setStep(step - 1)} variant="outline" className="flex-1" disabled={isSubmitting}>
                                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                                            Back
                                                        </Button>
                                                    )}

                                                    {step < 3 ? (
                                                        <Button onClick={() => setStep(step + 1)} variant="safari" className="flex-1" disabled={step === 2 && !canProceedToStep3}>
                                                            Continue
                                                            <ChevronRight className="w-4 h-4 ml-2" />
                                                        </Button>
                                                    ) : (
                                                        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="safari" className="flex-1" disabled={isSubmitting}>
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
                                                                            Submit Booking Request
                                                                            <CheckCircle2 className="w-4 h-4 ml-2" />
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Confirm Your Safari Booking</AlertDialogTitle>
                                                                    <AlertDialogDescription asChild>
                                                                        <div>
                                                                            Are you sure you want to book <strong>{tour.name}</strong>?
                                                                            <br /><br />
                                                                            <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                                                                                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Travelers: {travelers}</span>
                                                                                <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> Accommodation: {accommodationLevel}</span>
                                                                                <span className="flex items-center gap-2"><Star className="w-4 h-4" /> Total: {formatPrice(pricing.totalPrice)}</span>
                                                                            </div>
                                                                            <br />
                                                                            Our team will contact you within 24 hours to confirm availability and details. No payment required now.
                                                                        </div>
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => {
                                                                            setShowConfirmDialog(false);
                                                                            handleSubmit();
                                                                        }}
                                                                        className={buttonVariants({ variant: "safari" })}
                                                                    >
                                                                        Confirm Booking
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </Dialog.Popup>
                    </Dialog.Portal>
                </Dialog.Root>
            )}
        </AnimatePresence>
    );
}
