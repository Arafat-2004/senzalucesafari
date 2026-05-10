import { Metadata } from "next";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { getAllTours } from "@/lib/db";
import { FavouritesContent } from "./favourites-content";

export const metadata: Metadata = {
    title: "My Favourites - Senza Luce Safaris",
    description: "View your saved safari tours and packages.",
};

export default async function FavouritesPage() {
    const tours = await getAllTours();

    return (
        <main className="min-h-screen bg-background">
            <div className="bg-muted/30 border-b">
                <div className="container px-4 py-4">
                    <Link
                        href="/safaris-tours"
                        className="inline-flex items-center text-primary hover:underline text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        Back to Tours
                    </Link>
                </div>
            </div>

            <div className="container px-4 py-12 md:py-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">My Favourite Tours</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Tours you&apos;ve saved for quick access
                        </p>
                    </div>
                </div>

                <FavouritesContent tours={tours} />
            </div>
        </main>
    );
}
