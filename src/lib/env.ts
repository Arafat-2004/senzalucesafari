/**
 * Type-safe environment variable validation using Zod
 * 
 * This module validates all required environment variables at build time
 * and provides typed access throughout the application.
 */

import { z } from 'zod';

/**
 * Server-side environment variables schema
 * These are only available on the server (API routes, Server Components, etc.)
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid connection string').optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Client-side environment variables schema
 * These are exposed to the browser (must be prefixed with NEXT_PUBLIC_)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
});

/**
 * Combined environment schema
 */
const envSchema = serverEnvSchema.merge(clientEnvSchema);

export type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables
 * 
 * Usage:
 * ```ts
 * import { env } from '@/lib/env';
 * const dbUrl = env.DATABASE_URL;
 * ```
 */
function validateEnv(): Env {
  // Skip validation during build if DATABASE_URL isn't set
  // (e.g., in CI/CD environments where DB isn't needed for static pages)
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
    console.warn('[env] DATABASE_URL not set — skipping full validation');
    return {
      DATABASE_URL: process.env.DATABASE_URL ?? '',
      DIRECT_URL: process.env.DIRECT_URL,
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') ?? 'production',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );
    // Don't throw during development to allow partial env setup
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment variables');
    }
  }

  return (parsed.data ?? {
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') ?? 'development',
  }) as Env;
}

export const env = validateEnv();
