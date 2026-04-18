"use client";

import { useState, useEffect } from "react";
import { useNewsletterSignup } from "@/hooks/use-newsletter-signup";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const { handleSubmit, isSubmitting } = useNewsletterSignup();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
                <div className="flex-1 px-4 py-3 rounded-full bg-white text-gray-900" />
                <div className="px-6 py-3 rounded-full bg-white" />
            </div>
        );
    }

    return (
        <form onSubmit={(e) => handleSubmit(e, email)} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
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