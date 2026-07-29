import { NextResponse } from 'next/server';
import { trackRequest, generateRequestId } from './request-tracker';
import { error, warn, info } from './logger';
import type { APIRouteMethod } from './log-types';

export type RouteContext = { params: Promise<Record<string, string>> };
export type ApiHandler = (req: Request, ctx: RouteContext) => Promise<NextResponse> | NextResponse;

export interface ResilienceOptions {
    route: string;
    method: APIRouteMethod;
    requireAuth?: boolean;
    throttleMs?: number;
    slowThresholdMs?: number;
}

const recentRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 50;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const requests = recentRequests.get(ip) || [];
    
    const validRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
    validRequests.push(now);
    recentRequests.set(ip, validRequests);
    
    return validRequests.length <= RATE_LIMIT_MAX;
}

function isProductionError(status: number): boolean {
    return status >= 500;
}

function categorizeError(err: unknown): { category: string; severity: 'error' | 'warn' | 'info' } {
    const msg = err instanceof Error ? err.message : String(err);
    const name = err instanceof Error ? err.name : '';

    if (
        name.includes('Prisma') || 
        msg.includes('Prisma') || 
        msg.includes('database') || 
        msg.includes('connection') || 
        msg.includes('timeout') ||
        msg.includes('pool') ||
        msg.includes('pg')
    ) {
        return { category: 'Database Connection Error', severity: 'error' };
    }

    if (
        msg.includes('crypto') || 
        msg.includes('HMAC') || 
        msg.includes('decrypt') || 
        msg.includes('cipher') || 
        msg.includes('key') || 
        msg.includes('signing') || 
        msg.includes('subtle') || 
        msg.includes('bcrypt')
    ) {
        return { category: 'Cryptography Error', severity: 'error' };
    }

    if (
        msg.includes('credentials') || 
        msg.includes('unauthorized') || 
        msg.includes('locked') || 
        msg.includes('disabled') || 
        msg.includes('forbidden')
    ) {
        return { category: 'Authentication Error', severity: 'warn' };
    }

    return { category: 'Internal Error', severity: 'error' };
}

export function createSafeErrorResponse(
    err: unknown,
    requestId: string,
    route: string
): NextResponse {
    const status = err instanceof Error && 'status' in err 
        ? Number((err as { status?: unknown }).status) 
        : 500;
    
    const isClientError = status >= 400 && status < 500;
    const message = isClientError 
        ? (err instanceof Error ? err.message : 'Bad request')
        : 'An unexpected internal error occurred.';
    
    const { category, severity } = categorizeError(err);
    const logMsg = `[${requestId}] ${route} - [${category}] ${status}: ${err instanceof Error ? err.message : String(err)}`;
    const meta = {
        requestId,
        route,
        status,
        category,
        isProductionError: isProductionError(status),
    };

    if (severity === 'error') {
        error(logMsg, meta, err instanceof Error ? err : undefined);
    } else if (severity === 'warn') {
        warn(logMsg, meta);
    } else {
        info(logMsg, meta);
    }
    
    return NextResponse.json({
        error: message,
        requestId,
        category: process.env.NODE_ENV !== 'production' ? category : undefined,
        success: false,
    }, { status });
}

export function withApiResilience(handler: ApiHandler, options: ResilienceOptions): ApiHandler {
    return async (req: Request, ctx: RouteContext) => {
        const requestId = generateRequestId();
        const startTime = Date.now();
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const slowThreshold = options.slowThresholdMs || 500;
        
        if (!checkRateLimit(ip)) {
            warn(`Rate limit exceeded for IP: ${ip} on ${options.route}`, { requestId, route: options.route });
            return NextResponse.json({ 
                error: 'Too many requests. Please try again later.',
                requestId
            }, { status: 429 });
        }
        
        if (options.throttleMs) {
            await new Promise(resolve => setTimeout(resolve, options.throttleMs));
        }

        return await trackRequest(
            { route: options.route, method: options.method },
            async () => {
                try {
                    const response = await handler(req, ctx);
                    
                    const duration = Date.now() - startTime;
                    
                    if (duration > slowThreshold) {
                        warn(`Slow request: ${options.method} ${options.route}`, {
                            requestId,
                            duration,
                            threshold: slowThreshold,
                        });
                    }
                    
                    response.headers.set('x-request-id', requestId);
                    response.headers.set('x-response-time', String(duration));
                    
                    return response;
                } catch (err: unknown) {
                    return createSafeErrorResponse(err, requestId, options.route);
                }
            }
        );
    };
}
