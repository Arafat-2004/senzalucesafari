export default function TourDetailLoading() {
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
            <div className="relative h-[400px] md:h-[500px] bg-muted animate-pulse" />

            {/* Content Skeleton */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="container px-4">
                    <div className="h-8 w-40 bg-muted rounded animate-pulse mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-9 space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
                                    <div className="h-7 w-48 bg-muted rounded animate-pulse mb-4" />
                                    <div className="space-y-3">
                                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                        <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-3">
                            <div className="bg-card rounded-2xl p-6 border border-border/50 sticky top-24">
                                <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
                                <div className="h-12 w-full bg-muted rounded animate-pulse mb-4" />
                                <div className="h-12 w-full bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
