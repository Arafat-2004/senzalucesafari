import * as React from "react"
import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  suppressHydrationWarning,
  name,
  label,
  error,
  helperText,
  id,
  ...props
}: React.ComponentProps<"input"> & { label?: string; error?: string; helperText?: string }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-foreground mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name || undefined}
        data-slot="input"
        suppressHydrationWarning={suppressHydrationWarning}
        className={cn(
          "min-h-[48px] h-12 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-2 text-base text-foreground transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/75 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 md:text-sm",
          error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
      )}
    </div>
  )
}

export { Input }
