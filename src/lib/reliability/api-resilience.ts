import { NextResponse } from 'next/server';
import { trackRequest, generateRequestId } from './request-tracker';
import { error, warn } from './logger';
import type { APIRouteMethod } from './log-types';

export type ApiHandler = (req: Request, ctx: any) => Promise<NextResponse> | NextResponse;

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

export function createSafeErrorResponse(
    err: unknown,
    requestId: string,
    route: string
): NextResponse {
    const status = err instanceof Error && 'status' in err 
        ? (err as any).status as number 
        : 500;
    
    const isClientError = status >= 400 && status < 500;
    const message = isClientError 
        ? (err instanceof Error ? err.message : 'Bad request')
        : 'An unexpected internal error occurred.';
    
    error(`[${requestId}] ${route} - ${status}: ${err instanceof Error ? err.message : String(err)}`, {
        requestId,
        route,
        status,
        isProductionError: isProductionError(status),
    }, err instanceof Error ? err : undefined);
    
    return NextResponse.json({
        error: message,
        requestId,
        success: false,
    }, { status });
}

export function withApiResilience(handler: ApiHandler, options: ResilienceOptions): ApiHandler {
    return async (req: Request, ctx: any) => {
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
                } catch (err: any) {
                    return createSafeErrorResponse(err, requestId, options.route);
                }
            }
        );
    };
}
