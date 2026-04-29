import { info, warn, debug } from './logger';
import type { LogEntry } from './logger';

interface EndpointStats {
    route: string;
    method: string;
    totalCalls: number;
    successCalls: number;
    failedCalls: number;
    totalLatencyMs: number;
    lastCalled: number;
}

const endpointStats = new Map<string, EndpointStats>();

function getStatsKey(route: string, method: string): string {
    return `${method}:${route}`;
}

export function trackEndpointCall(
    route: string,
    method: string,
    success: boolean,
    durationMs: number
): void {
    const key = getStatsKey(route, method);
    let stats = endpointStats.get(key);
    
    if (!stats) {
        stats = {
            route,
            method,
            totalCalls: 0,
            successCalls: 0,
            failedCalls: 0,
            totalLatencyMs: 0,
            lastCalled: 0,
        };
        endpointStats.set(key, stats);
    }
    
    stats.totalCalls++;
    if (success) {
        stats.successCalls++;
    } else {
        stats.failedCalls++;
    }
    stats.totalLatencyMs += durationMs;
    stats.lastCalled = Date.now();
    
    if (durationMs > 500) {
        warn(`Slow endpoint: ${method} ${route} took ${durationMs}ms`);
    }
}

export function getEndpointStats(route?: string, method?: string): EndpointStats[] {
    const stats = Array.from(endpointStats.values());
    
    if (route || method) {
        return stats.filter(s => {
            if (route && !s.route.includes(route)) return false;
            if (method && s.method !== method) return false;
            return true;
        });
    }
    
    return stats;
}

export function getHealthSummary(): {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageLatencyMs: number;
    errorRate: number;
    slowestEndpoint?: {
        route: string;
        method: string;
        averageLatency: number;
    };
    mostFailedEndpoint?: {
        route: string;
        method: string;
        errorRate: number;
    };
    uptime: number;
} {
    let totalRequests = 0;
    let successfulRequests = 0;
    let failedRequests = 0;
    let totalLatency = 0;
    
    let slowest: EndpointStats | null = null;
    let mostFailed: EndpointStats | null = null;
    
    for (const stats of endpointStats.values()) {
        totalRequests += stats.totalCalls;
        successfulRequests += stats.successCalls;
        failedRequests += stats.failedCalls;
        totalLatency += stats.totalLatencyMs;
        
        if (!slowest || (stats.totalLatencyMs / stats.totalCalls) > (slowest.totalLatencyMs / slowest.totalCalls)) {
            slowest = stats;
        }
        
        const errorRate = stats.failedCalls / stats.totalCalls;
        const currentMostFailedRate = mostFailed 
            ? mostFailed.failedCalls / mostFailed.totalCalls 
            : 0;
        
        if (!mostFailed || errorRate > currentMostFailedRate) {
            mostFailed = stats;
        }
    }
    
    const averageLatency = totalRequests > 0 ? totalLatency / totalRequests : 0;
    const errorRate = totalRequests > 0 ? failedRequests / totalRequests : 0;
    
    return {
        totalRequests,
        successfulRequests,
        failedRequests,
        averageLatencyMs: Math.round(averageLatency),
        errorRate: Math.round(errorRate * 100) / 100,
        slowestEndpoint: slowest ? {
            route: slowest.route,
            method: slowest.method,
            averageLatency: Math.round(slowest.totalLatencyMs / slowest.totalCalls),
        } : undefined,
        mostFailedEndpoint: mostFailed && mostFailed.failedCalls > 0 ? {
            route: mostFailed.route,
            method: mostFailed.method,
            errorRate: Math.round((mostFailed.failedCalls / mostFailed.totalCalls) * 100) / 100,
        } : undefined,
        uptime: process.uptime ? Math.round(process.uptime()) : 0,
    };
}

export function resetHealthStats(): void {
    endpointStats.clear();
    info('Health stats reset');
}

export function isHealthy(): boolean {
    const summary = getHealthSummary();
    return summary.errorRate < 0.5;
}

export function getAlertStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    reasons: string[];
} {
    const summary = getHealthSummary();
    const reasons: string[] = [];
    
    if (summary.errorRate > 0.2) {
        reasons.push(`High error rate: ${Math.round(summary.errorRate * 100)}%`);
    }
    
    if (summary.averageLatencyMs > 1000) {
        reasons.push(`High latency: ${summary.averageLatencyMs}ms`);
    }
    
    if (summary.slowestEndpoint && summary.slowestEndpoint.averageLatency > 2000) {
        reasons.push(`Slow endpoint: ${summary.slowestEndpoint.method} ${summary.slowestEndpoint.route}`);
    }
    
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (reasons.length >= 2) {
        status = 'critical';
    } else if (reasons.length >= 1) {
        status = 'warning';
    }
    
    return { status, reasons };
}