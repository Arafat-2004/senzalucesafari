import { info, error, warn, debug } from './logger';
import type { LogLevel, APIRouteMethod } from './log-types';

let requestCounter = 0;
const SLOW_QUERY_THRESHOLD = 500;

export function generateRequestId(): string {
    requestCounter = (requestCounter + 1) % 1000000;
    return `req_${Date.now()}_${requestCounter}`;
}

export async function withRequestId<T>(
    handler: () => Promise<T>
): Promise<{ result: T; requestId: string; duration: number }> {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    try {
        const result = await handler();
        const duration = Date.now() - startTime;
        return { result, requestId, duration };
    } catch (err) {
        const duration = Date.now() - startTime;
        const errorObj = err instanceof Error ? err : new Error(String(err));
        error(`[${requestId}] Operation failed`, {
            requestId,
            duration,
            status: 'error',
        }, errorObj);
        throw err;
    }
}

export interface TrackRequestOptions {
    route: string;
    method: APIRouteMethod;
    userId?: string;
    includeBody?: boolean;
}

export async function trackRequest<T>(
    options: TrackRequestOptions,
    handler: () => Promise<T>
): Promise<T> {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    debug(`[${requestId}] ${options.method} ${options.route} started`, { requestId });
    
    try {
        const result = await handler();
        const duration = Date.now() - startTime;
        
        const logData = {
            requestId,
            route: options.route,
            method: options.method,
            statusCode: 200,
            duration,
            userId: options.userId,
        };
        
        if (duration > 500) {
            warn(`Slow request: ${options.method} ${options.route}`, logData);
        } else {
            debug(`[${requestId}] ${options.method} ${options.route} completed`, logData);
        }
        
        return result;
    } catch (err) {
        const duration = Date.now() - startTime;
        const errorObj = err instanceof Error ? err : new Error(String(err));
        
        error(`[${requestId}] ${options.method} ${options.route} failed`, {
            requestId,
            route: options.route,
            method: options.method,
            statusCode: 500,
            duration,
            userId: options.userId,
        }, errorObj);
        
        throw err;
    }
}

export function wrapApiHandler(
    route: string,
    method: APIRouteMethod
): {
    onSuccess?: (duration: number) => void;
    onError?: (duration: number, error: Error) => void;
} {
    return {
        onSuccess: undefined,
        onError: undefined,
    };
}

export async function withRequestTracking<
    T extends (...args: unknown[]) => Promise<unknown>
>(
    route: string,
    method: APIRouteMethod,
    handler: T
): Promise<T> {
    return (async (...args: unknown[]) => {
        const requestId = generateRequestId();
        const startTime = Date.now();
        
        try {
            const result = await handler(...args);
            const duration = Date.now() - startTime;
            
            debug(`${method} ${route}`, {
                requestId,
                duration,
                status: 'success',
            });
            
            return result;
        } catch (err) {
            const duration = Date.now() - startTime;
            const errorObj = err instanceof Error ? err : new Error(String(err));
            
            error(`${method} ${route}`, {
                requestId,
                duration,
                status: 'error',
            }, errorObj);
            
            throw err;
        }
    }) as T;
}