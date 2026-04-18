export default function ToursLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Skeleton */}
            <div className="relative h-[400px] md:h-[500px] bg-muted animate-pulse" />

            {/* Introduction Section Skeleton */}
            <div className="container py-16 md:py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="h-10 w-96 bg-muted rounded animate-pulse mx-auto mb-6" />
                    <div className="space-y-3 mb-8">
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-muted rounded animate-pulse mx-auto" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-10 w-40 bg-muted rounded-full animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Tour Skeleton */}
            <div className="container mb-20">
                <div className="bg-secondary/30 rounded-3xl p-8 md:p-12">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="aspect-video rounded-2xl bg-muted animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-10 w-full bg-muted rounded animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                            </div>
                            <div className="flex gap-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-8 w-24 bg-muted rounded-full animate-pulse" />
                                ))}
                            </div>
                            <div className="pt-4 border-t border-border/50">
                                <div className="h-12 w-40 bg-muted rounded animate-pulse mb-4" />
                                <div className="h-12 w-full bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tours Grid Skeleton */}
            <div className="container mb-20">
                <div className="text-center mb-12">
                    <div className="h-10 w-80 bg-muted rounded animate-pulse mx-auto mb-4" />
                    <div className="h-5 w-96 bg-muted rounded animate-pulse mx-auto" />
                </div>

                {/* Filter Buttons Skeleton */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 w-32 bg-muted rounded-full animate-pulse" />
                    ))}
                </div>

                {/* Tour Cards Skeleton */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50">
                            <div className="aspect-[4/3] bg-muted animate-pulse" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-6 w-full bg-muted rounded animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                                <div className="pt-4 border-t border-border/50">
                                    <div className="h-10 w-32 bg-muted rounded animate-pulse mb-3" />
                                    <div className="h-12 w-full bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Choose Us Skeleton */}
            <div className="container mb-20">
                <div className="text-center mb-12">
                    <div className="h-10 w-72 bg-muted rounded animate-pulse mx-auto mb-4" />
                    <div className="h-5 w-96 bg-muted rounded animate-pulse mx-auto" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 text-center">
                            <div className="h-12 w-12 bg-muted rounded-full animate-pulse mx-auto mb-4" />
                            <div className="h-6 w-32 bg-muted rounded animate-pulse mx-auto mb-2" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                <div className="h-4 w-5/6 bg-muted rounded animate-pulse mx-auto" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section Skeleton */}
            <div className="container mb-20">
                <div className="bg-secondary/20 rounded-3xl p-8 md:p-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="text-center">
                                <div className="h-10 w-20 bg-muted rounded animate-pulse mx-auto mb-2" />
                                <div className="h-4 w-24 bg-muted rounded animate-pulse mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section Skeleton */}
            <div className="container mb-16">
                <div className="bg-primary rounded-3xl p-12 md:p-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="h-10 w-96 bg-white/20 rounded animate-pulse mx-auto mb-6" />
                        <div className="space-y-2 mb-8">
                            <div className="h-5 w-full bg-white/20 rounded animate-pulse" />
                            <div className="h-5 w-5/6 bg-white/20 rounded animate-pulse mx-auto" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <div className="h-12 w-48 bg-white/20 rounded animate-pulse" />
                            <div className="h-12 w-40 bg-white/20 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
