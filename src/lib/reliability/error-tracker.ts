import { error, info, warn, debug } from './logger';

export interface TrackedError {
    id: string;
    name: string;
    message: string;
    stack?: string;
    timestamp: number;
    context?: Record<string, unknown>;
    route?: string;
    method?: string;
    userId?: string;
}

const errorBuffer: TrackedError[] = [];
const MAX_ERRORS = 200;

let errorIdCounter = 0;

function generateErrorId(): string {
    errorIdCounter = (errorIdCounter + 1) % 1000000;
    return `err_${Date.now()}_${errorIdCounter}`;
}

export function trackApiError(
    err: unknown,
    context?: Record<string, unknown>
): TrackedError {
    const tracked: TrackedError = {
        id: generateErrorId(),
        name: err instanceof Error ? err.name : 'Error',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: Date.now(),
        context,
    };
    
    errorBuffer.push(tracked);
    
    if (errorBuffer.length > MAX_ERRORS) {
        errorBuffer.shift();
    }
    
    error(`[${tracked.id}] ${tracked.message}`, {
        errorId: tracked.id,
        ...context,
    }, err instanceof Error ? err : undefined);
    
    return tracked;
}

export function trackPrismaError(
    err: unknown,
    operation: string,
    entity?: string
): TrackedError {
    const context = {
        operation,
        entity,
        layer: 'prisma',
    };
    
    return trackApiError(err, context);
}

export function trackApiRouteError(
    err: unknown,
    route: string,
    method: string
): TrackedError {
    const context = {
        route,
        method,
        layer: 'api',
    };
    
    return trackApiError(err, context);
}

export function trackServerActionError(
    err: unknown,
    action: string,
    entity?: string
): TrackedError {
    const context = {
        action,
        entity,
        layer: 'server_action',
    };
    
    return trackApiError(err, context);
}

export function getTrackedErrors(limit = 50): TrackedError[] {
    return errorBuffer.slice(-limit);
}

export function getErrorsByRoute(route: string): TrackedError[] {
    return errorBuffer.filter(e => e.context?.route === route);
}

export function getErrorsByLayer(layer: string): TrackedError[] {
    return errorBuffer.filter(e => e.context?.layer === layer);
}

export function clearErrors(): void {
    errorBuffer.length = 0;
}

export function getErrorSummary(): {
    total: number;
    byLayer: Record<string, number>;
    byRoute: Record<string, number>;
    recentErrors: TrackedError[];
} {
    const byLayer: Record<string, number> = {};
    const byRoute: Record<string, number> = {};
    
    for (const err of errorBuffer) {
        const layer = String(err.context?.layer || 'unknown');
        const route = String(err.context?.route || 'unknown');
        
        byLayer[layer] = (byLayer[layer] || 0) + 1;
        byRoute[route] = (byRoute[route] || 0) + 1;
    }
    
    return {
        total: errorBuffer.length,
        byLayer,
        byRoute,
        recentErrors: errorBuffer.slice(-10),
    };
}