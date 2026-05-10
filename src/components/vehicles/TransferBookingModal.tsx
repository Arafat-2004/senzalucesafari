"use client";

import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CheckCircle, Loader2, Calendar, Clock, Users, MapPin, Plane, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TransferBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    id: string;
    name: string;
    type: string;
    capacity: number;
    imageUrl: string;
  } | null;
}

const transferSchema = z.object({
  transferType: z.string().min(1, "Transfer type is required"),
  pickupLocation: z.string().min(1, "Pickup location is required").max(200),
  dropoffLocation: z.string().min(1, "Drop-off location is required").max(200),
  pickupDate: z.string().min(1, "Pickup date is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  flightNumber: z.string().max(20).optional(),
  passengers: z.number().int().min(1, "At least 1 passenger required"),
  customerName: z.string().min(1, "Full name is required").max(100),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(6, "Phone number is required").max(20),
  specialRequests: z.string().max(500).optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

const TRANSFER_TYPES = [
  { value: "airport_arrival", label: "Airport Arrival (Airport → Your Hotel)" },
  { value: "airport_departure", label: "Airport Departure (Your Hotel → Airport)" },
  { value: "hotel_to_hotel", label: "Hotel to Hotel Transfer" },
  { value: "custom", label: "Custom Route" },
];

export default function TransferBookingModal({ isOpen, onClose, vehicle }: TransferBookingModalProps) {
  const [formData, setFormData] = useState<Partial<TransferFormData>>({
    transferType: "",
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    flightNumber: "",
    passengers: 1,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialRequests: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");

  const getPlaceholder = (field: "pickupLocation" | "dropoffLocation") => {
    const type = formData.transferType;
    if (field === "pickupLocation") {
      switch (type) {
        case "airport_arrival":
          return "e.g. Julius Nyerere International Airport";
        case "airport_departure":
          return "e.g. Your hotel name and area";
        case "hotel_to_hotel":
          return "e.g. Your current hotel name";
        case "custom":
          return "e.g. Starting location";
        default:
          return "Enter pickup location";
      }
    } else {
      switch (type) {
        case "airport_arrival":
          return "e.g. Your hotel name and area";
        case "airport_departure":
          return "e.g. Julius Nyerere International Airport";
        case "hotel_to_hotel":
          return "e.g. Destination hotel name";
        case "custom":
          return "e.g. Destination location";
        default:
          return "Enter drop-off location";
      }
    }
  };

  const validateForm = (): boolean => {
    try {
      const validatedData = transferSchema.parse({
        ...formData,
        passengers: Number(formData.passengers) || 1,
      });

      // Additional validation
      const pickupDate = new Date(validatedData.pickupDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (pickupDate < now) {
        setErrors({ pickupDate: "Pickup date cannot be in the past" });
        return false;
      }

      if (vehicle && validatedData.passengers > vehicle.capacity) {
        setErrors({ passengers: `Maximum ${vehicle.capacity} passengers for this vehicle` });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const field = err.path.join(".");
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !vehicle) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/transfers/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleType: vehicle.type,
          vehicleName: vehicle.name,
          ...formData,
          passengers: Number(formData.passengers),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit transfer request");
      }

      setReferenceNumber(result.referenceNumber);
      setSubmissionSuccess(true);
      setSubmissionError(false);
      toast.success("Transfer request submitted successfully!");
    } catch (error) {
      console.error("[Transfer] Submission error:", error);
      setSubmissionError(true);
      setSubmissionSuccess(false);
      toast.error(error instanceof Error ? error.message : "Failed to submit transfer request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      transferType: "",
      pickupLocation: "",
      dropoffLocation: "",
      pickupDate: "",
      pickupTime: "",
      flightNumber: "",
      passengers: 1,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      specialRequests: "",
    });
    setErrors({});
    setSubmissionSuccess(false);
    setSubmissionError(false);
    setReferenceNumber("");
  };

  if (!vehicle) return null;

  const isAirportTransfer = formData.transferType === "airport_arrival" || formData.transferType === "airport_departure";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="relative pr-8">
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">{vehicle.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Book a Transfer</p>
            </div>
          </div>
        </DialogHeader>

        {submissionSuccess ? (
          <div className="py-8 text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Transfer Request Received!</h3>
              <p className="text-sm text-muted-foreground">
                Your reference: <span className="font-mono font-bold text-foreground">{referenceNumber}</span>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2 text-left">
              <p className="text-sm"><strong>Vehicle:</strong> {vehicle.name}</p>
              <p className="text-sm"><strong>Route:</strong> {formData.pickupLocation} → {formData.dropoffLocation}</p>
              <p className="text-sm"><strong>Date:</strong> {formData.pickupDate && new Date(formData.pickupDate).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Time:</strong> {formData.pickupTime}</p>
            </div>

            <p className="text-sm text-muted-foreground">
              We will confirm your transfer within 2 hours. A confirmation has been sent to {formData.customerEmail}
            </p>

            <Button onClick={handleClose} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        ) : submissionError ? (
          <div className="py-8 text-center space-y-6">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Submission Failed</h3>
              <p className="text-sm text-muted-foreground">
                We were unable to process your transfer request. Please try again.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={resetForm} className="sm:w-auto">
                Try Again
              </Button>
              <Button onClick={handleClose} variant="outline" className="sm:w-auto">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Section 1 — Transfer Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Transfer Details
              </h3>

              {/* Transfer Type */}
              <div className="space-y-2">
                <Label htmlFor="transferType">Transfer Type *</Label>
                <Select
                  value={formData.transferType}
                  onValueChange={(value: string | null) => setFormData({ ...formData, transferType: value ?? "" })}
                >
                  <SelectTrigger id="transferType">
                    <SelectValue placeholder="Select transfer type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSFER_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.transferType && <p className="text-sm text-red-500">{errors.transferType}</p>}
              </div>

              {/* Pickup & Drop-off Locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupLocation" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Pickup Location *
                  </Label>
                  <Input
                    id="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    placeholder={getPlaceholder("pickupLocation")}
                  />
                  {errors.pickupLocation && <p className="text-sm text-red-500">{errors.pickupLocation}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropoffLocation" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Drop-off Location *
                  </Label>
                  <Input
                    id="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                    placeholder={getPlaceholder("dropoffLocation")}
                  />
                  {errors.dropoffLocation && <p className="text-sm text-red-500">{errors.dropoffLocation}</p>}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Pickup Date *</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.pickupDate && <p className="text-sm text-red-500">{errors.pickupDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pickup Time *
                  </Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    We recommend allowing 3 hours before international flights
                  </p>
                  {errors.pickupTime && <p className="text-sm text-red-500">{errors.pickupTime}</p>}
                </div>
              </div>

              {/* Passengers & Flight Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passengers" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Number of Passengers *
                  </Label>
                  <Input
                    id="passengers"
                    type="number"
                    min={1}
                    max={vehicle.capacity}
                    value={formData.passengers}
                    onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
                  />
                  {errors.passengers && <p className="text-sm text-red-500">{errors.passengers}</p>}
                </div>

                {isAirportTransfer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="flightNumber" className="flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      Flight Number (Optional)
                    </Label>
                    <Input
                      id="flightNumber"
                      value={formData.flightNumber}
                      onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                      placeholder="e.g. KQ101 (optional but helpful)"
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Section 2 — Your Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Details</h3>

              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Your full name"
                />
                {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="your@email.com"
                  />
                  {errors.customerEmail && <p className="text-sm text-red-500">{errors.customerEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+255 xxx xxx xxx"
                  />
                  {errors.customerPhone && <p className="text-sm text-red-500">{errors.customerPhone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Any special requirements, child seats, wheelchair access, extra luggage etc."
                  maxLength={500}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {(formData.specialRequests?.length || 0)}/500
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-3 pt-4 border-t">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Request Transfer"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We will confirm your transfer within 2 hours
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
