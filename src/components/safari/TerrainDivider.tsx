import { cn } from "@/lib/utils";

type TerrainDividerProps = {
  className?: string;
  variant?: "horizon" | "dunes" | "acacia";
};

export function TerrainDivider({ className, variant = "horizon" }: TerrainDividerProps) {
  const path =
    variant === "dunes"
      ? "M0 68c100-50 190-50 290 0s190 50 290 0 190-50 290 0 190 50 290 0v52H0V68Z"
      : variant === "acacia"
        ? "M0 73c135-27 247-19 338 24 93 44 207 42 342-5 124-43 233-46 326-9 62 24 113 31 154 20v57H0V73Z"
        : "M0 80c138-37 258-38 360-3s218 39 348 11 246-29 452 26v46H0V80Z";

  return (
    <div className={cn("pointer-events-none relative h-12 overflow-hidden text-background", className)} aria-hidden="true">
      <svg viewBox="0 0 1160 160" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-full w-full fill-current">
        <path d={path} />
      </svg>
    </div>
  );
}
