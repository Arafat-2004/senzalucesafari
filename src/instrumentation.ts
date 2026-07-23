export async function register() {
  // Intentionally empty. The previous Sentry import pulled Prisma's complete
  // OpenTelemetry instrumentation graph into every Next.js startup and caused
  // both development and production compilation to stall. Monitoring should be
  // reintroduced only through a supported Next.js/Sentry configuration that is
  // verified against the installed Next.js canary release.
}
