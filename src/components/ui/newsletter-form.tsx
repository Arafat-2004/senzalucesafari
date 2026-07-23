"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast({ title: "Please enter a valid email address.", variant: "destructive" });
            return;
        }

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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
            <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 rounded-full border border-input bg-card px-4 py-3 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="whitespace-nowrap rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
        </form>
    );
}
