export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: number;
    requestId?: string;
    duration?: number;
    context?: Record<string, unknown>;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

export interface RequestLogContext {
    apiRoute?: string;
    method?: string;
    userId?: string;
    duration?: number;
    statusCode?: number;
}

export interface CMSActionContext {
    entity: 'vehicle' | 'tour' | 'booking' | 'blog' | 'review' | 'user' | 'inquiry';
    action: 'create' | 'update' | 'delete';
    entityId?: string;
    userId?: string;
}

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'key', 'authorization', 'csrf', 'cookie'];

function isSensitiveKey(key: string): boolean {
    const lowerKey = key.toLowerCase();
    return SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive));
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (isSensitiveKey(key)) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value as Record<string, unknown>);
        } else {
            sanitized[key] = value;
        }
    }
    
    return sanitized;
}

function formatLogEntry(entry: LogEntry): string {
    const sanitizedContext = entry.context 
        ? sanitizeObject(entry.context as Record<string, unknown>)
        : undefined;
    
    return JSON.stringify({
        level: entry.level,
        message: entry.message,
        timestamp: entry.timestamp,
        requestId: entry.requestId,
        ...(sanitizedContext && { context: sanitizedContext }),
        ...(entry.error && { error: entry.error }),
    });
}

const logBuffer: LogEntry[] = [];
const MAX_BUFFER_SIZE = 1000;

export function log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
): void {
    const entry: LogEntry = {
        level,
        message,
        timestamp: Date.now(),
        context,
        ...(error && {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            },
        }),
    };
    
    logBuffer.push(entry);
    
    if (logBuffer.length > MAX_BUFFER_SIZE) {
        logBuffer.shift();
    }
    
    const formatted = formatLogEntry(entry);
    
    switch (level) {
        case 'error':
            console.error(formatted);
            break;
        case 'warn':
            console.warn(formatted);
            break;
        case 'info':
            console.log(formatted);
            break;
        case 'debug':
            if (process.env.NODE_ENV === 'development') {
                console.log(formatted);
            }
            break;
    }
}

export function info(message: string, context?: Record<string, unknown>): void {
    log('info', message, context);
}

export function warn(message: string, context?: Record<string, unknown>): void {
    log('warn', message, context);
}

export function error(message: string, context?: Record<string, unknown>, err?: Error): void {
    log('error', message, context, err);
}

export function debug(message: string, context?: Record<string, unknown>): void {
    log('debug', message, context);
}

export function getLogs(limit = 100): LogEntry[] {
    return logBuffer.slice(-limit);
}

export function getErrorLogs(limit = 50): LogEntry[] {
    return logBuffer
        .filter(entry => entry.level === 'error')
        .slice(-limit);
}

export function clearLogs(): void {
    logBuffer.length = 0;
}