export type AdminTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'featured' | 'draft'

export const ADMIN_TONE_CLASS: Record<AdminTone, string> = {
  success: 'admin-tone-success',
  warning: 'admin-tone-warning',
  danger: 'admin-tone-danger',
  info: 'admin-tone-info',
  neutral: 'admin-tone-neutral',
  featured: 'admin-tone-featured',
  draft: 'admin-tone-draft',
}

export const ADMIN_TEXT_TONE_CLASS: Record<Exclude<AdminTone, 'draft'>, string> = {
  success: 'admin-text-success',
  warning: 'admin-text-warning',
  danger: 'admin-text-danger',
  info: 'admin-text-info',
  neutral: 'admin-text-neutral',
  featured: 'admin-text-featured',
}

export const ADMIN_CHART_COLORS = [
  'var(--chart-green)',
  'var(--chart-blue)',
  'var(--chart-gold)',
  'var(--chart-violet)',
  'var(--chart-coral)',
  'var(--chart-teal)',
] as const
