"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { logger } from "@/lib/reliability/logger";

export default function AccommodationsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        logger.error("Accommodations page error", { error: error instanceof Error ? error.message : String(error) });
    }, [error]);

    return (
        <div className="container py-24 md:py-32">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-6xl font-bold text-destructive mb-6">Oops!</h1>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Unable to Load Accommodations</h2>
                <p className="text-lg text-muted-foreground mb-8">
                    We encountered an error while loading our accommodation listings. Please try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={reset}>
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Try Again
                    </Button>
                    <Button size="lg" variant="outline">
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Go to Homepage
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
