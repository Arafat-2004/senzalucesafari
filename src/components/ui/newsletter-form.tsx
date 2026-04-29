"use client";

import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                toast({ title: "Successfully subscribed!" });
                setEmail("");
            } else {
                toast({ title: "Failed to subscribe. Please try again.", variant: "destructive" });
            }
        } catch {
            toast({ title: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isMounted) {
        return (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
                <div className="flex-1 px-4 py-3 rounded-full bg-white text-gray-900" />
                <div className="px-6 py-3 rounded-full bg-white" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                suppressHydrationWarning
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-primary hover:bg-gray-100 font-semibold whitespace-nowrap px-6 py-3 rounded-full transition-colors disabled:opacity-50"
            >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
        </form>
    );
}