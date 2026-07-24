/**
 * apply-primary-color.ts
 *
 * Injects a dynamically-chosen primary color (from AppSettings) into the
 * document root as CSS custom properties.  Because the entire design system
 * cascades from `--primary`, every element that uses `var(--primary)` —
 * buttons, gradients, nav accents, shadows, focus rings, etc. — immediately
 * reflects the new value with zero additional component changes.
 *
 * Safe to call in SSR contexts (no-ops when `window` is absent).
 * Safe to call multiple times (idempotent).
 */

/** Parse a #rrggbb or #rgb hex string into [r, g, b] (0-255). */
function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '').trim()

  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    return [r, g, b]
  }

  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    return [r, g, b]
  }

  return null
}

/** Convert [r,g,b] back to a #rrggbb hex string. */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
  )
}

/**
 * Lighten a color by mixing it with white by `amount` (0–1).
 * amount = 0.2 → 20% white mixed in → slightly lighter.
 */
function lighten(r: number, g: number, b: number, amount: number): string {
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount,
  )
}

/**
 * Darken a color by mixing it with black by `amount` (0–1).
 * amount = 0.15 → 15% black mixed in → slightly darker.
 */
function darken(r: number, g: number, b: number, amount: number): string {
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount))
}

/**
 * Determine the best foreground text color (black or white) to satisfy
 * WCAG AA contrast (4.5:1) against the given background color.
 *
 * Uses the relative luminance formula from WCAG 2.1.
 */
function contrastForeground(r: number, g: number, b: number): string {
  // Linearize sRGB channels
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

  // Contrast ratio against white (L=1) vs black (L=0)
  const contrastWhite = (1.05) / (L + 0.05)
  const contrastBlack = (L + 0.05) / (0.05)

  return contrastWhite >= contrastBlack ? '#FFFFFF' : '#000000'
}

/**
 * Apply a primary color to the document root as CSS custom properties.
 *
 * Sets:
 *   --primary            → the chosen hex value
 *   --primary-light      → ~20% lighter variant
 *   --primary-dark       → ~15% darker variant
 *   --primary-foreground → auto-chosen white or black for readable contrast
 *
 * @param color - A hex color string, e.g. `"#176B45"` or `"#7c3aed"`.
 *                Passing `null`, `undefined`, or an invalid string is a no-op.
 */
export function applyPrimaryColor(color: string | null | undefined): void {
  if (typeof window === 'undefined') return
  if (!color) return

  const rgb = hexToRgb(color)
  if (!rgb) return

  const [r, g, b] = rgb
  const root = document.documentElement

  root.style.setProperty('--primary', rgbToHex(r, g, b))
  root.style.setProperty('--primary-light', lighten(r, g, b, 0.22))
  root.style.setProperty('--primary-dark', darken(r, g, b, 0.18))
  root.style.setProperty('--primary-foreground', contrastForeground(r, g, b))
}
