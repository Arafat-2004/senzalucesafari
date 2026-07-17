import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  suppressHydrationWarning,
  name,
  label,
  error,
  helperText,
  ...props
}: React.ComponentProps<"input"> & { label?: string; error?: string; helperText?: string }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-foreground mb-2">
          {label}
        </label>
      )}
      <InputPrimitive
        type={type}
        name={name || undefined}
        data-slot="input"
        suppressHydrationWarning={suppressHydrationWarning}
        className={cn(
          "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
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
