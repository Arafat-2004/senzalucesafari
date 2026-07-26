import { cn } from "@/lib/utils";

type NatureTextureProps = {
  className?: string;
  variant?: "trail" | "sand" | "leaf";
};

export function NatureTexture({ className, variant = "trail" }: NatureTextureProps) {
  return (
    <div
      aria-hidden="true"
      data-safari-texture={variant}
      className={cn("pointer-events-none absolute inset-0 safari-nature-texture", className)}
    />
  );
}
