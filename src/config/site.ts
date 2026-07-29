export const PRODUCTION_SITE_URL = 'https://www.senzalucesafari.com'

/**
 * Resolve the public origin used in links and SEO output.
 *
 * Production is intentionally strict: only the canonical www origin is
 * allowed. This prevents stale local, Vercel preview, or apex-domain values
 * from being frozen into a production build.
 */
export function resolveSiteUrl(
  configuredUrl = process.env.NEXT_PUBLIC_SITE_URL,
  environment = process.env.NODE_ENV,
): string {
  const value = configuredUrl?.trim()

  if (!value) {
    return environment === 'production' ? PRODUCTION_SITE_URL : 'http://localhost:3000'
  }

  try {
    const url = new URL(value)

    if (environment === 'production') {
      if (url.origin === PRODUCTION_SITE_URL) {
        return url.origin
      }

      return PRODUCTION_SITE_URL
    }

    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'http://localhost:3000'
    }

    return url.origin
  } catch {
    return environment === 'production' ? PRODUCTION_SITE_URL : 'http://localhost:3000'
  }
}

export const SITE_URL = resolveSiteUrl()
