export default function DestinationDetailLoading() {
    return (
        <main className="min-h-screen bg-background">
            {/* Breadcrumb Skeleton */}
            <div className="bg-muted/30 border-b">
                <div className="container px-4 py-4">
                    <div className="flex gap-2 items-center">
                        <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-3 bg-muted-foreground/30" />
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-3 bg-muted-foreground/30" />
                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Hero Skeleton */}
            <div className="relative h-[500px] md:h-[600px] bg-muted animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="container">
                        <div className="h-12 w-64 bg-white/20 rounded animate-pulse mb-4" />
                        <div className="h-16 w-96 bg-white/20 rounded animate-pulse mb-4" />
                        <div className="h-6 w-80 bg-white/20 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Table of Contents Skeleton */}
            <div className="bg-muted/20 border-b">
                <div className="container py-6">
                    <div className="flex flex-wrap gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-10 w-32 bg-muted rounded-full animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Overview Section Skeleton */}
            <div className="container py-12 md:py-16">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-10 w-48 bg-muted rounded animate-pulse" />
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-muted rounded animate-pulse" />
                            <div className="h-4 w-full bg-muted rounded animate-pulse" />
                            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-full bg-muted rounded animate-pulse" />
                            <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Quick Facts Skeleton */}
                    <div className="bg-card border border-border/50 rounded-2xl p-6 h-fit">
                        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="h-5 w-5 bg-muted rounded animate-pulse mt-0.5" />
                                    <div className="flex-1">
                                        <div className="h-3 w-24 bg-muted rounded animate-pulse mb-1" />
                                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Wildlife Section Skeleton */}
            <div className="bg-muted/20 py-12 md:py-16">
                <div className="container">
                    <div className="h-10 w-40 bg-muted rounded animate-pulse mb-8" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-card rounded-xl p-6 border border-border/50">
                                <div className="h-12 w-12 bg-muted rounded-full animate-pulse mb-3" />
                                <div className="h-5 w-40 bg-muted rounded animate-pulse mb-2" />
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Activities Section Skeleton */}
            <div className="container py-12 md:py-16">
                <div className="h-10 w-48 bg-muted rounded animate-pulse mb-8" />
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card rounded-xl overflow-hidden border border-border/50">
                            <div className="aspect-video bg-muted animate-pulse" />
                            <div className="p-4 space-y-2">
                                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Accommodations Skeleton */}
            <div className="bg-muted/20 py-12 md:py-16">
                <div className="container">
                    <div className="h-10 w-56 bg-muted rounded animate-pulse mb-8" />
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card rounded-xl overflow-hidden border border-border/50">
                                <div className="aspect-[4/3] bg-muted animate-pulse" />
                                <div className="p-5 space-y-3">
                                    <div className="h-6 w-40 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-10 w-32 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section Skeleton */}
            <div className="container py-12 md:py-16">
                <div className="bg-primary rounded-3xl p-12 md:p-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="h-10 w-80 bg-white/20 rounded animate-pulse mx-auto mb-4" />
                        <div className="h-5 w-full bg-white/20 rounded animate-pulse mb-8" />
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <div className="h-12 w-48 bg-white rounded animate-pulse" />
                            <div className="h-12 w-40 bg-white/20 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
