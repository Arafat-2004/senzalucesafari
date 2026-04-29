export default function BlogDetailLoading() {
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
            <div className="relative h-[400px] md:h-[500px] bg-muted animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="container max-w-4xl">
                        <div className="flex gap-2 mb-4">
                            <div className="h-6 w-24 bg-white/20 rounded-full animate-pulse" />
                            <div className="h-6 w-20 bg-white/20 rounded-full animate-pulse" />
                        </div>
                        <div className="h-12 w-full bg-white/20 rounded animate-pulse mb-4" />
                        <div className="h-6 w-3/4 bg-white/20 rounded animate-pulse mb-6" />
                        <div className="flex gap-6">
                            <div className="h-5 w-32 bg-white/20 rounded animate-pulse" />
                            <div className="h-5 w-24 bg-white/20 rounded animate-pulse" />
                            <div className="h-5 w-20 bg-white/20 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content Skeleton */}
            <div className="container max-w-4xl py-12 md:py-16">
                {/* Introduction */}
                <div className="mb-12">
                    <div className="border-l-4 border-primary pl-6 py-2 space-y-3">
                        <div className="h-6 w-full bg-muted rounded animate-pulse" />
                        <div className="h-6 w-5/6 bg-muted rounded animate-pulse" />
                        <div className="h-6 w-4/6 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8 mb-12">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                            <div className="space-y-3">
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Image Gallery Skeleton */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-video bg-muted rounded-xl animate-pulse" />
                    ))}
                </div>

                {/* Tips/Highlights Box */}
                <div className="bg-muted/20 border border-border/50 rounded-2xl p-8 mb-12">
                    <div className="h-7 w-48 bg-muted rounded animate-pulse mb-6" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-3">
                                <div className="h-5 w-5 bg-muted rounded animate-pulse mt-0.5" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quote Block */}
                <blockquote className="my-12 p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-l-4 border-primary">
                    <div className="space-y-3">
                        <div className="h-5 w-full bg-muted rounded animate-pulse" />
                        <div className="h-5 w-5/6 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="mt-4 h-4 w-32 bg-muted rounded animate-pulse" />
                </blockquote>

                {/* Author Bio Skeleton */}
                <div className="bg-card border border-border/50 rounded-2xl p-8 mb-12">
                    <div className="flex items-start gap-4">
                        <div className="h-16 w-16 bg-muted rounded-full animate-pulse" />
                        <div className="flex-1 space-y-3">
                            <div className="h-6 w-40 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-full bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Share Buttons Skeleton */}
                <div className="flex gap-3 mb-12">
                    <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                </div>

                {/* Related Articles Skeleton */}
                <div className="border-t pt-12">
                    <div className="h-8 w-56 bg-muted rounded animate-pulse mb-8" />
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card rounded-xl overflow-hidden border border-border/50">
                                <div className="aspect-[4/3] bg-muted animate-pulse" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                                    <div className="h-6 w-full bg-muted rounded animate-pulse" />
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
