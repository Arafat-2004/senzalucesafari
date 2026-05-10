import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import type { LucideIcon } from "lucide-react";

interface StateWrapperProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
  onEmptyActionClick?: () => void;
  errorTitle?: string;
  skeleton?: ReactNode;
  children: ReactNode;
}

export function StateWrapper({
  loading,
  error,
  empty,
  emptyIcon,
  emptyTitle = "No results found",
  emptyDescription = "Try adjusting your search or filters.",
  emptyActionLabel,
  emptyActionHref,
  onEmptyActionClick,
  errorTitle = "Something went wrong",
  skeleton,
  children,
}: StateWrapperProps) {
  if (loading) {
    return skeleton ? <>{skeleton}</> : <DefaultSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        icon={emptyIcon || (() => null) as unknown as LucideIcon}
        title={errorTitle}
        description={error}
        actionLabel="Try Again"
        onActionClick={() => window.location.reload()}
      />
    );
  }

  if (empty) {
    return (
      <EmptyState
        icon={emptyIcon || (() => null) as unknown as LucideIcon}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        actionHref={emptyActionHref}
        onActionClick={onEmptyActionClick}
      />
    );
  }

  return <>{children}</>;
}

function DefaultSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-border/50 overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full rounded-lg mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
