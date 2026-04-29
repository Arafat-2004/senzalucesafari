import { info, debug, warn } from './logger';
import type { CMSEntityType, CMSActionType } from './log-types';

export interface AuditEntry {
    id: string;
    timestamp: number;
    entity: CMSEntityType;
    action: CMSActionType;
    entityId?: string;
    userId?: string;
    changes?: {
        previous?: Record<string, unknown>;
        new?: Record<string, unknown>;
    };
    metadata?: Record<string, unknown>;
}

const auditBuffer: AuditEntry[] = [];
const MAX_AUDIT_ENTRIES = 500;

let auditCounter = 0;

function generateAuditId(): string {
    auditCounter = (auditCounter + 1) % 1000000;
    return `audit_${Date.now()}_${auditCounter}`;
}

function sanitizeRecord(record: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'hashedPassword'];
    
    for (const [key, value] of Object.entries(record)) {
        if (sensitiveFields.includes(key.toLowerCase())) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = '[OBJECT]';
        } else {
            sanitized[key] = value;
        }
    }
    
    return sanitized;
}

export function logCmsAction(
    entity: CMSEntityType,
    action: CMSActionType,
    options?: {
        entityId?: string;
        userId?: string;
        previousValue?: Record<string, unknown>;
        newValue?: Record<string, unknown>;
        metadata?: Record<string, unknown>;
    }
): AuditEntry {
    const entry: AuditEntry = {
        id: generateAuditId(),
        timestamp: Date.now(),
        entity,
        action,
        entityId: options?.entityId,
        userId: options?.userId,
        metadata: options?.metadata,
    };
    
    if (options?.previousValue || options?.newValue) {
        entry.changes = {
            previous: options.previousValue 
                ? sanitizeRecord(options.previousValue) 
                : undefined,
            new: options.newValue 
                ? sanitizeRecord(options.newValue) 
                : undefined,
        };
    }
    
    auditBuffer.push(entry);
    
    if (auditBuffer.length > MAX_AUDIT_ENTRIES) {
        auditBuffer.shift();
    }
    
    const context = {
        auditId: entry.id,
        entity,
        action,
        entityId: entry.entityId,
    };
    
    info(`CMS ${action} ${entity}`, context);
    
    return entry;
}

export function logVehicleCreate(vehicleId: string, data: Record<string, unknown>, userId?: string): AuditEntry {
    return logCmsAction('vehicle', 'create', { entityId: vehicleId, newValue: data, userId });
}

export function logVehicleUpdate(vehicleId: string, previous: Record<string, unknown>, updated: Record<string, unknown>, userId?: string): AuditEntry {
    return logCmsAction('vehicle', 'update', { entityId: vehicleId, previousValue: previous, newValue: updated, userId });
}

export function logVehicleDelete(vehicleId: string, userId?: string): AuditEntry {
    return logCmsAction('vehicle', 'delete', { entityId: vehicleId, userId });
}

export function logTourCreate(tourId: string, data: Record<string, unknown>, userId?: string): AuditEntry {
    return logCmsAction('tour', 'create', { entityId: tourId, newValue: data, userId });
}

export function logTourUpdate(tourId: string, previous: Record<string, unknown>, updated: Record<string, unknown>, userId?: string): AuditEntry {
    return logCmsAction('tour', 'update', { entityId: tourId, previousValue: previous, newValue: updated, userId });
}

export function logTourDelete(tourId: string, userId?: string): AuditEntry {
    return logCmsAction('tour', 'delete', { entityId: tourId, userId });
}

export function logBookingUpdate(bookingId: string, previous: Record<string, unknown>, updated: Record<string, unknown>, userId?: string): AuditEntry {
    return logCmsAction('booking', 'update', { entityId: bookingId, previousValue: previous, newValue: updated, userId });
}

export function logBlogCreate(blogId: string, data: Record<string, unknown>, userId?: string): AuditEntry {
    return logCmsAction('blog', 'create', { entityId: blogId, newValue: data, userId });
}

export function logBlogUpdate(blogId: string, previous: Record<string, unknown>, updated: Record<string, unknown>, userId?: string): AuditEntry {
    return logCmsAction('blog', 'update', { entityId: blogId, previousValue: previous, newValue: updated, userId });
}

export function logReviewCreate(reviewId: string, data: Record<string, unknown>, userId?: string): AuditEntry {
    return logCmsAction('review', 'create', { entityId: reviewId, newValue: data, userId });
}

export function logInquiryUpdate(inquiryId: string, previous: Record<string, unknown>, updated: Record<string, unknown>, userId?: string): AuditEntry {
    return logCmsAction('inquiry', 'update', { entityId: inquiryId, previousValue: previous, newValue: updated, userId });
}

export function getAuditLogs(options?: {
    entity?: CMSEntityType;
    action?: CMSActionType;
    limit?: number;
    since?: number;
}): AuditEntry[] {
    let results = [...auditBuffer];
    
    if (options?.entity) {
        results = results.filter(e => e.entity === options.entity);
    }
    
    if (options?.action) {
        results = results.filter(e => e.action === options.action);
    }
    
    const sinceTime = options?.since;
    if (sinceTime) {
        results = results.filter(e => e.timestamp >= sinceTime);
    }
    
    const limit = options?.limit || 50;
    return results.slice(-limit);
}

export function getRecentAuditByEntity(entity: CMSEntityType, limit = 20): AuditEntry[] {
    return auditBuffer
        .filter(e => e.entity === entity)
        .slice(-limit);
}

export function clearAuditLog(): void {
    auditBuffer.length = 0;
}