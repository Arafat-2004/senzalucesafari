"use client";

import Link from 'next/link';
import { Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="container py-24 md:py-32">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Page Not Found</h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or doesn&apos;t exist.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white hover:bg-primary/90 rounded-md font-medium text-lg transition-colors"
                    >
                        <Home className="mr-2 h-5 w-5" />
                        Go Home
                    </Link>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-md font-medium text-lg transition-colors"
                    >
                        <Search className="mr-2 h-5 w-5" />
                        Contact Support
                    </Link>
                </div>

                <div className="mt-12 p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-4">Popular Pages</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Link href="/destinations" className="text-primary hover:underline">
                            Destinations
                        </Link>
                        <Link href="/safaris-tours" className="text-primary hover:underline">
                            Safari & Tours
                        </Link>
                        <Link href="/about" className="text-primary hover:underline">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-primary hover:underline">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
