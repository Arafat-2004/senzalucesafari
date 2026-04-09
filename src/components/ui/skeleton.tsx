import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted",
                className
            )}
        />
    );
}

// Pre-built skeleton components for common use cases

export function CardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm">
            {/* Image placeholder */}
            <Skeleton className="aspect-[16/10] w-full" />

            {/* Content */}
            <div className="p-5 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />

                {/* Footer */}
                <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
}

export function TourCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm">
            {/* Image placeholder */}
            <Skeleton className="aspect-[4/3] w-full" />

            {/* Content */}
            <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />

                {/* Features */}
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-32 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function DestinationCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm">
            {/* Image placeholder */}
            <Skeleton className="aspect-[16/10] w-full" />

            {/* Content */}
            <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {[...Array(lines)].map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
                />
            ))}
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center bg-muted">
            <div className="container text-center space-y-6">
                <Skeleton className="h-16 md:h-24 lg:h-32 w-3/4 mx-auto" />
                <Skeleton className="h-6 md:h-8 w-2/3 mx-auto" />
                <Skeleton className="h-14 w-48 mx-auto rounded-full" />
            </div>
        </section>
    );
}
