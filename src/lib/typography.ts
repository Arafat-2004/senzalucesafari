/**
 * ============================================
 * TYPOGRAPHY SYSTEM - CLEAN & CONSISTENT
 * Safari Website Typography Guidelines
 * ============================================
 * 
 * Principles:
 * - Clear hierarchy (H1 → H6)
 * - Responsive scaling (mobile → desktop)
 * - Consistent spacing and line heights
 * - Limited font weights (400, 500, 600, 700)
 * - Excellent readability on all devices
 */

// Font Families
export const fonts = {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
};

// Font Weights - Limited and intentional
export const weights = {
    regular: 'font-normal',      // 400 - Body text
    medium: 'font-medium',       // 500 - Emphasis
    semibold: 'font-semibold',   // 600 - Headings
    bold: 'font-bold',           // 700 - Key titles only
};

// Line Heights
export const lineHeights = {
    tight: 'leading-tight',      // 1.25 - Large headings
    snug: 'leading-snug',        // 1.375 - Medium headings
    normal: 'leading-normal',    // 1.5 - Small headings
    relaxed: 'leading-relaxed',  // 1.625 - Body text
    loose: 'leading-loose',      // 2 - Captions/long text
};

// Letter Spacing
export const tracking = {
    tighter: 'tracking-tighter',  // -0.05em
    tight: 'tracking-tight',      // -0.025em
    normal: 'tracking-normal',    // 0em
    wide: 'tracking-wide',        // 0.025em
};

/**
 * HEADING STYLES - Responsive Scale
 * Usage: Apply className to any element
 */
export const headings = {
    // H1 - Hero titles (largest)
    h1: 'font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight',

    // H2 - Section titles
    h2: 'font-heading font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight',

    // H3 - Subsections
    h3: 'font-heading font-semibold text-xl sm:text-2xl md:text-3xl leading-snug tracking-tight',

    // H4 - Small titles
    h4: 'font-heading font-semibold text-lg sm:text-xl md:text-2xl leading-snug',

    // H5 - Minor headings
    h5: 'font-heading font-medium text-base sm:text-lg md:text-xl leading-normal',

    // H6 - Smallest heading
    h6: 'font-heading font-medium text-sm sm:text-base md:text-lg leading-normal uppercase tracking-wide',
};

/**
 * BODY TEXT STYLES
 */
export const body = {
    // Default paragraph
    base: 'font-body font-normal text-base sm:text-lg leading-relaxed',

    // Large body text (for emphasis)
    large: 'font-body font-normal text-lg sm:text-xl leading-relaxed',

    // Small body text
    small: 'font-body font-normal text-sm leading-relaxed',

    // Extra small (captions, fine print)
    xs: 'font-body font-normal text-xs leading-relaxed',
};

/**
 * SUPPORTING TEXT STYLES
 */
export const supporting = {
    // Labels and badges
    label: 'font-body font-medium text-xs sm:text-sm uppercase tracking-wider',

    // Captions
    caption: 'font-body font-normal text-xs sm:text-sm text-muted-foreground',

    // Overline (above headings)
    overline: 'font-body font-semibold text-xs sm:text-sm uppercase tracking-widest text-primary',

    // Lead text (intro paragraphs)
    lead: 'font-body font-normal text-lg sm:text-xl md:text-2xl leading-relaxed text-muted-foreground',
};

/**
 * BUTTON TEXT STYLES
 */
export const button = {
    // Default button
    default: 'font-body font-semibold text-sm sm:text-base',

    // Large button
    large: 'font-body font-semibold text-base sm:text-lg',

    // Small button
    small: 'font-body font-semibold text-xs sm:text-sm',
};

/**
 * UTILITY CLASSES FOR COMMON PATTERNS
 */
export const utilities = {
    // Text truncation with ellipsis
    truncate: 'truncate',

    // Multi-line clamp (requires custom CSS or Tailwind plugin)
    'clamp-2': 'line-clamp-2',
    'clamp-3': 'line-clamp-3',

    // Text alignment
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',

    // Text colors (semantic)
    primary: 'text-primary',
    secondary: 'text-secondary-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-accent',
    foreground: 'text-foreground',

    // Readability helpers
    readable: 'max-w-prose',  // Optimal line length (~65 characters)
    'readable-sm': 'max-w-2xl',
    'readable-lg': 'max-w-3xl',
};

/**
 * COMBINED PRESETS FOR COMMON USE CASES
 */
export const presets = {
    // Hero section title
    heroTitle: `${headings.h1} mb-4`,

    // Hero section subtitle
    heroSubtitle: `${body.large} ${utilities.muted}`,

    // Section header
    sectionTitle: `${headings.h2} mb-4`,

    // Section subtitle
    sectionSubtitle: `${supporting.lead} mt-2`,

    // Card title
    cardTitle: `${headings.h4} mb-2`,

    // Card description
    cardDescription: `${body.small} ${utilities.muted}`,

    // Form label
    formLabel: `${supporting.label} mb-2 block`,

    // Form input text
    formInput: `${body.base}`,

    // Navigation link
    navLink: `${body.small} ${weights.medium}`,

    // Footer heading
    footerHeading: `${headings.h6} mb-4`,

    // Footer link
    footerLink: `${body.small} ${utilities.muted} hover:${utilities.foreground}`,

    // Badge text
    badge: `${supporting.label}`,

    // Price display
    price: `${headings.h3} ${utilities.accent}`,

    // Feature list item
    featureItem: `${body.small}`,
};

/**
 * RESPONSIVE SPACING SCALE
 * Use these for consistent vertical rhythm
 */
export const spacing = {
    // Between heading and content
    afterHeading: 'mb-4 md:mb-6',

    // Between paragraphs
    afterParagraph: 'mb-4',

    // Between sections
    sectionGap: 'py-12 md:py-16 lg:py-24',

    // Between cards/items
    itemGap: 'gap-4 md:gap-6 lg:gap-8',
};

/**
 * ACCESSIBILITY HELPERS
 */
export const accessibility = {
    // Screen reader only (visually hidden but accessible)
    srOnly: 'sr-only',

    // Focus visible styles
    focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

    // Minimum touch target size (44x44px)
    touchTarget: 'min-h-[44px] min-w-[44px]',
};

/**
 * EXPORT ALL AS SINGLE OBJECT FOR EASY IMPORT
 */
export const typography = {
    fonts,
    weights,
    lineHeights,
    tracking,
    headings,
    body,
    supporting,
    button,
    utilities,
    presets,
    spacing,
    accessibility,
};

export default typography;
