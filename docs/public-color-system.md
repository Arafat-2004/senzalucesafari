# Public Website Color System

The public website uses the same safari identity as the admin dashboard, with a slightly brighter canvas for editorial and travel content.

## Foundation

- Use `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, and `border-input` for ordinary structure.
- Use `bg-primary text-primary-foreground` for the main action. Use `hover:bg-primary-dark` for its hover state.
- Use gold only for ratings, premium accommodation, featured content, and highlights through `text-featured`, `text-brand-gold`, or `tone-featured`.
- Use `tone-success`, `tone-warning`, `tone-danger`, and `tone-info` when the color communicates a state. Each state must also include readable text or an icon.
- Use `text-success`, `text-warning`, `text-danger`, and `text-info` for semantic icons or short labels.
- Do not introduce direct Tailwind palette classes such as `green-600`, `amber-500`, or `red-500` in public components.

## Dark mode

Public dark mode uses forest-charcoal surfaces (`#0B120F`, `#121D18`, and `#17231E`) with high-contrast green actions and restrained gold highlights. Components must use tokens rather than adding separate `dark:` palette classes.

## External brands and media

- `brand-whatsapp`, `brand-instagram-gradient`, `brand-instagram-soft`, and `brand-instagram-mark` are approved external-brand exceptions.
- White or translucent white is allowed for copy displayed directly over photography or video when an adequate dark overlay is present.

## Tables

Every horizontally scrollable table must have exactly one overflow owner. The shared `Table` component already supplies `table-scroll`; do not wrap it in another `overflow-x-auto` container. Raw responsive tables should use `table-scroll` once on their immediate wrapper.
