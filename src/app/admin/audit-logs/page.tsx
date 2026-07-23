import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import { AdminPageHeader } from '../components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuditLogsFilter } from './audit-logs-filter'
import { 
    User, Calendar, FileText, 
    LogIn, LogOut, Plus, Pencil, Trash2, RefreshCw
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const revalidate = 15

interface PageProps {
    searchParams: Promise<{ 
        user?: string; 
        action?: string; 
        entity?: string 
    }>
}

type ActionGroupResult = { action: string; _count: number }

async function fetchActionCounts(): Promise<ActionGroupResult[]> {
    const result = await prisma.$queryRaw<Array<{ action: string; _count: bigint }>>`
        SELECT action, COUNT(*) as _count
        FROM admin_audit_logs
        GROUP BY action
    `
    return result.map(r => ({ action: r.action, _count: Number(r._count) }))
}

const actionIcons: Record<string, React.ReactNode> = {
    CREATE: <Plus className="h-4 w-4 admin-text-success" />,
    UPDATE: <Pencil className="h-4 w-4 admin-text-info" />,
    DELETE: <Trash2 className="h-4 w-4 admin-text-danger" />,
    LOGIN: <LogIn className="h-4 w-4 admin-text-success" />,
    LOGOUT: <LogOut className="h-4 w-4 text-muted-foreground" />,
    EXPORT: <FileText className="h-4 w-4 admin-text-info" />,
    BULK_UPDATE: <RefreshCw className="h-4 w-4 admin-text-warning" />,
    STATUS_CHANGE: <RefreshCw className="h-4 w-4 admin-text-warning" />,
}

export default async function AuditLogsPage({ searchParams }: PageProps) {
    await requireAdmin('settings', 'VIEW');
    const params = await searchParams
    
    const where: Record<string, unknown> = {}
    
    if (params.user && params.user !== 'all') {
        where.userId = params.user
    }
    if (params.action && params.action !== 'all') {
        where.action = params.action
    }
    if (params.entity && params.entity !== 'all') {
        where.entityType = params.entity
    }

    const [logs, users, actions, distinctEntities] = await Promise.all([
        prisma.adminAuditLog.findMany({
            where,
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true }
                }
            },
            orderBy: { timestamp: 'desc' },
            take: 100
        }),
        prisma.adminUser.findMany({
            select: { id: true, firstName: true, lastName: true },
            orderBy: { firstName: 'asc' }
        }),
        fetchActionCounts(),
        prisma.adminAuditLog.findMany({
            select: { entityType: true },
            distinct: ['entityType']
        })
    ]).catch(() => [[], [], [], []] as const)

    const actionCounts = actions.reduce((acc: Record<string, number>, a) => {
        acc[a.action] = a._count
        return acc
    }, {})

    // Format list of distinct entities
    const entityTypes = distinctEntities.map(e => e.entityType).filter(Boolean)
    // Format list of distinct action names for filtering
    const actionNames = Array.from(new Set([...Object.keys(actionIcons), ...actions.map(action => action.action)]))

    const formattedUsers = users.map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`
    }))

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Audit Logs"
                description="Track all admin activities, database mutations, and system security events."
            />

            <div className="grid gap-4 md:grid-cols-5">
                {Object.entries(actionCounts).slice(0, 5).map(([action, count]) => (
                    <Card key={action}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{action}</CardTitle>
                            {actionIcons[action]}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{count}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AuditLogsFilter 
                users={formattedUsers} 
                actions={actionNames} 
                entities={entityTypes} 
            />

            <Card>
                <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {logs.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No audit logs found
                            </div>
                        ) : (
                            logs.map(log => (
                                <div key={log.id} className="flex items-start gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="mt-1">
                                        {actionIcons[log.action] || <FileText className="h-4 w-4 text-muted-foreground" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-foreground">{log.action}</p>
                                            <Badge variant="outline">{log.entityType}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{log.description}</p>
                                        {log.metadata && typeof log.metadata === 'object' && !Array.isArray(log.metadata) && <div className="mt-2 flex flex-wrap gap-1">{Object.keys(log.metadata).map(field=><Badge key={field} variant="secondary" className="text-[10px] capitalize">{field.replace(/([A-Z])/g,' $1')}</Badge>)}</div>}
                                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1 font-medium">
                                                <User className="h-3 w-3" />
                                                {log.user.firstName} {log.user.lastName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                            </span>
                                            {log.ipAddress && (
                                                <span className="flex items-center gap-1">
                                                    IP: {log.ipAddress}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
