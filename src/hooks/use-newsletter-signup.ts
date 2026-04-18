"use client";

import { useState } from "react";

export function useNewsletterSignup() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent, email: string) => {
        e.preventDefault();
        
        if (!email || !email.includes("@")) {
            console.log("Invalid email");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                console.log("Subscribed successfully!");
            }
        } catch (error) {
            console.error("Subscription error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { handleSubmit, isSubmitting };
}