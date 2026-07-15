export default function AccommodationsLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Skeleton */}
            <div className="relative h-[500px] md:h-[600px] bg-muted animate-pulse" />

            {/* Introduction Skeleton */}
            <div className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="h-6 w-40 bg-muted rounded-full animate-pulse mx-auto mb-4" />
                    <div className="h-10 w-96 bg-muted rounded animate-pulse mx-auto mb-6" />
                    <div className="space-y-3 mb-8">
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-muted rounded animate-pulse mx-auto" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Accommodation Cards Skeleton */}
            <div className="py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="container">
                    <div className="text-center mb-12">
                        <div className="h-10 w-80 bg-muted rounded animate-pulse mx-auto mb-4" />
                        <div className="h-5 w-96 bg-muted rounded animate-pulse mx-auto" />
                    </div>
                    <div className="space-y-12">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-card rounded-3xl overflow-hidden border border-border/50">
                                <div className="grid lg:grid-cols-2 gap-0">
                                    <div className="aspect-video lg:aspect-auto bg-muted animate-pulse" />
                                    <div className="p-6 space-y-4">
                                        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                                        <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                                        </div>
                                        <div className="h-12 w-full bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
