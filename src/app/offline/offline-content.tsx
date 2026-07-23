"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, RefreshCw, WifiOff } from "lucide-react";

export default function OfflineContent() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-border/50 bg-card shadow-xl">
                    <WifiOff className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-foreground">You&apos;re Offline</h1>
                    <p className="text-lg text-muted-foreground">
                        It looks like you&apos;ve lost your internet connection. Some safari content may still be available from your device.
                    </p>
                </div>

                <div className="space-y-4 rounded-xl border border-border/50 bg-card p-6 shadow-lg">
                    <h2 className="text-left font-semibold text-foreground">What you can do:</h2>
                    <ul className="space-y-2 text-left text-sm text-muted-foreground">
                        {[
                            "View previously visited pages if cached",
                            "Check your internet connection",
                            "Try refreshing the page when back online"
                        ].map(item => (
                            <li key={item} className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" aria-hidden="true" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Button onClick={() => window.location.reload()} size="lg" className="gap-2">
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" size="lg" className="w-full gap-2 sm:w-auto">
                            <Home className="h-4 w-4" aria-hidden="true" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
