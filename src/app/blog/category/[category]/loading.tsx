export default function CategoryLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Skeleton */}
            <div className="relative h-[400px] md:h-[500px] bg-muted animate-pulse" />

            {/* Breadcrumb Skeleton */}
            <div className="container py-6">
                <div className="flex items-center space-x-2">
                    <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-10 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
            </div>

            {/* Back Button Skeleton */}
            <div className="container pb-8">
                <div className="h-10 w-40 bg-muted rounded animate-pulse" />
            </div>

            {/* Articles Grid Skeleton */}
            <div className="container mb-20">
                <div className="mb-12">
                    <div className="h-10 w-64 bg-muted rounded animate-pulse mb-4" />
                    <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50">
                            <div className="aspect-[16/10] bg-muted animate-pulse" />
                            <div className="p-6 space-y-4">
                                <div className="h-6 w-full bg-muted rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                                <div className="pt-4 border-t border-border/50 flex justify-between">
                                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Section Skeleton */}
            <div className="container mb-20">
                <div className="text-center mb-12">
                    <div className="h-10 w-80 bg-muted rounded animate-pulse mx-auto mb-4" />
                    <div className="h-5 w-96 bg-muted rounded animate-pulse mx-auto" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-card border border-border/50 rounded-xl p-6">
                            <div className="h-6 w-full bg-muted rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
