export const brand = {
  gold: "#D4A017",
  goldLight: "#FFD700",
  goldDark: "#B8860B",
  brown: "#17231E",
  brownDarker: "#0C1411",
  brownLighter: "#1B2822",
  green: "#2D9B5E",
  greenLight: "#4DB86F",
  greenBright: "#5FCC82",
  cream: "#EEDFC4",
  white: "#FFFFFF",
  sage: "#5E6B3A",
  sageLight: "#6B8B3C",
  tan: "#B9B680",
  charcoal: "#3D3D3D",
  grayLight: "#F5F5F5",
  gray: "#999999",
  orange: "#E67E22",
  orangeBright: "#FF9800",
} as const;

export const goldScale = {
  50: "#FAF5E4",
  100: "#F2E8BF",
  200: "#E8D48A",
  300: "#DCBC55",
  400: "#C8A84B",
  500: "#B08A2A",
  600: "#8A6B1E",
  700: "#664F16",
  800: "#42330E",
  900: "#211907",
} as const;

export const spacing = {
  container: {
    default: "1280px",
    xl: "1400px",
    "2xl": "1600px",
    "3xl": "1800px",
  },
  containerPadding: {
    default: "1rem",
    sm: "1.5rem",
    lg: "2rem",
  },
} as const;

export const radius = {
  sm: "0.45rem",
  md: "0.6rem",
  lg: "0.75rem",
  xl: "1.05rem",
  "2xl": "1.35rem",
  "3xl": "1.65rem",
  "4xl": "1.95rem",
  full: "9999px",
} as const;

export const animation = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
  },
  ease: {
    out: "cubic-bezier(0.4, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

export const fontFamily = {
  sans: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  heading: "Poppins, Inter, ui-sans-serif, system-ui, sans-serif",
  mono: "ui-monospace, 'SF Mono', Monaco, 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', monospace",
} as const;

export type BrandColor = keyof typeof brand;
export type GoldScaleStep = keyof typeof goldScale;
