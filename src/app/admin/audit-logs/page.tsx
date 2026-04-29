import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
    Search, Filter, User, Calendar, FileText, 
    LogIn, LogOut, Plus, Pencil, Trash2, RefreshCw
} from 'lucide-react'

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
    CREATE: <Plus className="h-4 w-4 text-green-500" />,
    UPDATE: <Pencil className="h-4 w-4 text-blue-500" />,
    DELETE: <Trash2 className="h-4 w-4 text-red-500" />,
    LOGIN: <LogIn className="h-4 w-4 text-green-500" />,
    LOGOUT: <LogOut className="h-4 w-4 text-muted-foreground" />,
    EXPORT: <FileText className="h-4 w-4 text-purple-500" />,
    BULK_UPDATE: <RefreshCw className="h-4 w-4 text-orange-500" />,
    STATUS_CHANGE: <RefreshCw className="h-4 w-4 text-yellow-500" />,
}

export default async function AuditLogsPage({ searchParams }: PageProps) {
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

    const [logs, users, actions] = await Promise.all([
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
        fetchActionCounts()
    ])

    const actionCounts = actions.reduce((acc: Record<string, number>, a) => {
        acc[a.action] = a._count
        return acc
    }, {})

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
                <p className="text-muted-foreground">Track all admin activities and security events</p>
            </div>

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
                                <div key={log.id} className="flex items-start gap-4 p-3 border rounded-lg hover:bg-muted/50">
                                    <div className="mt-1">
                                        {actionIcons[log.action] || <FileText className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{log.action}</p>
                                            <Badge variant="outline">{log.entityType}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{log.description}</p>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {log.user.firstName} {log.user.lastName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {log.timestamp.toLocaleString()}
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