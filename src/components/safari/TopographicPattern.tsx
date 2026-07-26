import { cn } from "@/lib/utils";

type TopographicPatternProps = {
  className?: string;
};

export function TopographicPattern({ className }: TopographicPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 safari-topographic-pattern",
        className
      )}
    />
  );
}
