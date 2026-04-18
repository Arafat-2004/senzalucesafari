"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="container py-24 md:py-32">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-6xl font-bold text-destructive mb-6">Oops!</h1>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Something Went Wrong</h2>
                <p className="text-lg text-muted-foreground mb-8">
                    We encountered an unexpected error. Don&apos;t worry, our team has been notified.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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

                {process.env.NODE_ENV === "development" && (
                    <div className="mt-8 p-4 bg-muted rounded-lg text-left">
                        <h3 className="font-semibold mb-2">Error Details (Development Only)</h3>
                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                            {error.message}
                        </pre>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
