export default function EnquiryLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero Skeleton */}
            <div className="relative h-[500px] md:h-[600px] bg-muted animate-pulse" />

            {/* Contact Cards Skeleton */}
            <div className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
                            <div className="w-12 h-12 bg-muted rounded-full animate-pulse mb-4" />
                            <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2" />
                            <div className="h-4 w-48 bg-muted rounded animate-pulse mb-2" />
                            <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Skeleton */}
            <div className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="text-center mb-12">
                    <div className="h-10 w-80 bg-muted rounded animate-pulse mx-auto mb-4" />
                    <div className="h-5 w-96 bg-muted rounded animate-pulse mx-auto" />
                </div>
                <div className="max-w-3xl mx-auto space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-12 w-full bg-muted rounded animate-pulse" />
                        </div>
                    ))}
                    <div className="space-y-2">
                        <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                        <div className="h-32 w-full bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-12 w-full bg-muted rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}
