"use client";

import { useState } from "react";
import { Calendar, Clock, Users, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "../hooks/use-analytics";

export default function BookingWidget() {
    const [formData, setFormData] = useState({
        vehicleType: "",
        date: "",
        duration: "",
        guests: "",
        pickupLocation: ""
    });
    const [showAvailability, setShowAvailability] = useState(false);
    const { trackEvent } = useAnalytics();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        trackEvent('booking_widget_submit', formData);
        setShowAvailability(true);
    };

    const vehicleTypes = [
        { id: "vx", name: "Land Cruiser VX", price: "$$$$", icon: "🚙" },
        { id: "gx", name: "Land Cruiser GX", price: "$$$", icon: "🚙" },
        { id: "minivan", name: "Safari Minivan", price: "$$", icon: "🚐" }
    ];

    const durations = [
        { id: "1-day", label: "1 Day", description: "Day trip" },
        { id: "3-day", label: "3 Days", description: "Weekend safari" },
        { id: "5-day", label: "5 Days", description: "Classic tour" },
        { id: "7-day", label: "7+ Days", description: "Full adventure" }
    ];

    const locations = [
        "Arusha Airport",
        "Kilimanjaro Airport",
        "Arusha City Center",
        "Moshi Town",
        "Custom Location"
    ];

    if (showAvailability) {
        return (
            <div className="max-w-2xl mx-auto text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Booking Request Sent!</h3>
                <p className="text-muted-foreground">
                    Thank you for your interest! Our team will contact you shortly to confirm availability and finalize your booking.
                </p>
                <div className="bg-card rounded-xl p-6 border border-border/50 text-left">
                    <h4 className="font-bold text-foreground mb-4">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Vehicle:</span> <span className="text-foreground font-medium">{vehicleTypes.find(v => v.id === formData.vehicleType)?.name}</span></p>
                        <p><span className="text-muted-foreground">Date:</span> <span className="text-foreground font-medium">{formData.date}</span></p>
                        <p><span className="text-muted-foreground">Duration:</span> <span className="text-foreground font-medium">{durations.find(d => d.id === formData.duration)?.label}</span></p>
                        <p><span className="text-muted-foreground">Guests:</span> <span className="text-foreground font-medium">{formData.guests}</span></p>
                        <p><span className="text-muted-foreground">Pickup:</span> <span className="text-foreground font-medium">{formData.pickupLocation}</span></p>
                    </div>
                </div>
                <Button onClick={() => setShowAvailability(false)} variant="outline">
                    Check Another Date
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Book Your Safari Vehicle
                </h3>
                <p className="text-muted-foreground">
                    Select your preferred vehicle and dates to get started
                </p>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Selection */}
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                        Select Vehicle Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {vehicleTypes.map(vehicle => (
                            <button
                                key={vehicle.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, vehicleType: vehicle.id })}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${formData.vehicleType === vehicle.id
                                    ? 'border-primary bg-primary/5 shadow-lg'
                                    : 'border-border/50 hover:border-primary/50'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{vehicle.icon}</div>
                                <h4 className="font-bold text-foreground text-sm mb-1">{vehicle.name}</h4>
                                <p className="text-xs text-muted-foreground">{vehicle.price}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date & Duration Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Preferred Date
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Duration
                        </label>
                        <select
                            required
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                            <option value="">Select duration</option>
                            {durations.map(d => (
                                <option key={d.id} value={d.id}>{d.label} - {d.description}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Guests & Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            <Users className="w-4 h-4 inline mr-2" />
                            Number of Guests
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            required
                            placeholder="Enter number of guests"
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Pickup Location
                        </label>
                        <select
                            required
                            value={formData.pickupLocation}
                            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                            <option value="">Select pickup location</option>
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full py-4 text-lg font-semibold"
                    disabled={!formData.vehicleType || !formData.date || !formData.duration || !formData.guests || !formData.pickupLocation}
                >
                    Check Availability
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {/* Info Notice */}
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        ⚡ Real-time availability checking requires backend integration. This is a demo form.
                    </p>
                </div>
            </form>
        </div>
    );
}
