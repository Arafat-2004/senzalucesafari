export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type APIRouteMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: number;
    requestId?: string;
    context?: Record<string, unknown>;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

export interface RequestLogContext {
    route: string;
    method: APIRouteMethod;
    statusCode?: number;
    duration?: number;
    userId?: string;
}

export interface CMSActionLogContext {
    entity: CMSEntityType;
    action: CMSActionType;
    entityId?: string;
    userId?: string;
    previousValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
}

export type CMSEntityType = 'vehicle' | 'tour' | 'booking' | 'blog' | 'review' | 'user' | 'inquiry' | 'notification' | 'settings' | 'destination' | 'accommodation' | 'faq' | 'guide';
export type CMSActionType = 'create' | 'update' | 'delete';

export interface HealthMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageLatencyMs: number;
    slowestEndpoint?: string;
    errorRate: number;
}

export interface EndpointMetrics {
    route: string;
    method: APIRouteMethod;
    totalCalls: number;
    successCount: number;
    errorCount: number;
    averageLatencyMs: number;
    lastCalled: number;
}