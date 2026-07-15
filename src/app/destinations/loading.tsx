export default function DestinationsLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Skeleton */}
            <div className="relative h-[500px] md:h-[600px] bg-muted animate-pulse" />

            {/* Destinations Grid Skeleton */}
            <div className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="text-center mb-10 sm:mb-12">
                    <div className="h-6 w-32 bg-muted rounded-full animate-pulse mx-auto mb-4" />
                    <div className="h-10 w-96 bg-muted rounded animate-pulse mx-auto mb-4" />
                    <div className="h-5 w-80 bg-muted rounded animate-pulse mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50">
                            <div className="aspect-video bg-muted animate-pulse" />
                            <div className="p-5 space-y-3">
                                <div className="h-6 w-40 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
