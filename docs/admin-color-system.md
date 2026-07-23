# Admin color system

The admin interface uses a forest-charcoal palette scoped by `data-admin-theme`. Public-site colors must not be changed when maintaining this system.

## Semantic use

| Meaning | UI tone | Never substitute |
| --- | --- | --- |
| Confirmed, published, available, successful | `success` | Brand green utility classes |
| Pending, requires attention, draft | `warning` or `draft` | Gold/featured |
| Failed, rejected, cancelled, destructive | `danger` | Orange |
| In progress, informational, verified workflow step | `info` | Purple |
| Inactive, unknown, no-show, secondary state | `neutral` | Arbitrary gray/slate |
| Featured, premium, rating highlight | `featured` | Warning amber |

Use the semantic variants on `Badge` and `Alert`, or the `admin-tone-*` and `admin-text-*` classes. Do not add direct `green-*`, `amber-*`, `red-*`, or hex colors to admin operational states.

## Charts

Use `ADMIN_CHART_COLORS` from `src/lib/admin-colors.ts`. The sequence is green, blue, gold, violet, coral, and teal and automatically changes luminance between themes. Labels, icons, or values must accompany color; never communicate meaning through color alone.

## Accessibility rules

- Normal text: minimum contrast `4.5:1`.
- Large text, focus rings, controls, and meaningful graphics: minimum `3:1`.
- Use `text-muted-foreground` for secondary copy; never lower its opacity for required information.
- Use `border-input` for interactive boundaries and `border-border` for decorative separation.
- Gold is a restrained featured/premium accent, not a general action color.
- Destructive controls must include clear action text or an icon with an accessible label.
