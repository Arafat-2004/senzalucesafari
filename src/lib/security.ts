import bcrypt from 'bcrypt';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { cookies } from 'next/headers';
import { logger } from "@/lib/reliability/logger";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    return false;
  }
}

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export const rateLimit = redis
  ? {
      general: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        prefix: 'ratelimit:general',
      }),
      auth: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '60 s'),
        prefix: 'ratelimit:auth',
      }),
      enquiry: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '60 s'),
        prefix: 'ratelimit:enquiry',
      }),
      booking: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '60 s'),
        prefix: 'ratelimit:booking',
      }),
      api: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '60 s'),
        prefix: 'ratelimit:api',
      }),
    }
  : null;

export async function checkRateLimit(
  identifier: string,
  limitType: 'general' | 'auth' | 'enquiry' | 'booking' | 'api' = 'general'
): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (!redis || !rateLimit) {
    logger.warn('[RateLimit] Redis not configured, skipping rate limit');
    return { allowed: true };
  }

  const limiter = rateLimit[limitType];
  const result = await limiter.limit(identifier);

  return {
    allowed: result.success,
    retryAfter: result.reset ? Math.ceil((result.reset - Date.now()) / 1000) : undefined,
  };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function sanitizeHtml(input: string): string {
  const allowedTags = ['p', 'br', 'b', 'i', 'u', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  let sanitized = input;
  
  for (const tag of allowedTags) {
    const regex = new RegExp(`<(?!\/?(?:${allowedTags.join('|')})\\b)[^>]*>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  }
  
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  
  return sanitized;
}

const CSRF_TOKEN_LENGTH = 32;
const CSRF_SECRET_COOKIE = 'csrf_secret';
const CSRF_PUBLIC_COOKIE = 'csrf_token';

export async function generateCsrfToken(): Promise<string> {
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < CSRF_TOKEN_LENGTH; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function getCsrfSecret(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_SECRET_COOKIE)?.value;
}

export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_PUBLIC_COOKIE)?.value;
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  const secretToken = await getCsrfSecret();
  const publicToken = await getCsrfToken();
  
  if (!secretToken || !publicToken) return false;
  if (token !== publicToken) return false;
  
  const timingSafeEqual = (a: string, b: string): boolean => {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  };
  
  return timingSafeEqual(token, secretToken);
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function generateRequestId(): string {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function getRequestId(request: Request): string {
  const existing = request.headers.get('x-request-id');
  if (existing) return existing;
  return generateRequestId();
}

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_LOCKED = 'LOGIN_LOCKED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_REQUEST = 'SUSPICIOUS_REQUEST',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  FORBIDDEN_ACCESS = 'FORBIDDEN_ACCESS',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  USER_ACTION = 'USER_ACTION',
  MFA_SUCCESS = 'MFA_SUCCESS',
  MFA_FAILED = 'MFA_FAILED',
  MFA_RESET = 'MFA_RESET',
  MFA_RESET_FAILED = 'MFA_RESET_FAILED',
  SESSION_CREATED = 'SESSION_CREATED',
  SESSION_INVALIDATED = 'SESSION_INVALIDATED',
}

export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export interface SecurityLogEntry {
  type: SecurityEventType;
  message: string;
  ip?: string;
  userId?: string;
  email?: string;
  path?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export function logSecurityEvent(entry: Omit<SecurityLogEntry, 'timestamp'>): void {
  const logEntry: SecurityLogEntry = {
    ...entry,
    timestamp: new Date(),
  };

  if (process.env.NODE_ENV !== 'test') {
    logger.error('[SECURITY]', { logEntry: JSON.stringify(logEntry) });
  }
}

export async function logFailedLogin(
  email: string,
  ip: string,
  reason: string
): Promise<void> {
  logSecurityEvent({
    type: SecurityEventType.LOGIN_FAILED,
    message: `Failed login attempt for ${email}`,
    email,
    ip,
    metadata: { reason },
  });
}

export async function logSuccessfulLogin(
  userId: string,
  email: string,
  ip: string
): Promise<void> {
  logSecurityEvent({
    type: SecurityEventType.LOGIN_SUCCESS,
    message: `Successful login for ${email}`,
    userId,
    email,
    ip,
  });
}
