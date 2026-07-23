import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
    User, Mail, Phone, MapPin, Calendar, DollarSign, 
    Clock, FileText, MessageSquare, CheckCircle, XCircle 
} from 'lucide-react'
import Link from 'next/link'
import { AddNoteForm } from './add-note-form'

export const revalidate = 30

interface PageProps {
    params: Promise<{ email: string }>
}

async function getCustomerData(email: string) {
    const decodedEmail = decodeURIComponent(email)
    
    const [bookings, inquiries, notes] = await Promise.all([
        prisma.booking.findMany({
            where: { email: { equals: decodedEmail, mode: 'insensitive' } },
            include: { tour: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.contactInquiry.findMany({
            where: { email: { equals: decodedEmail, mode: 'insensitive' } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.customerNote.findMany({
            where: { customerEmail: { equals: decodedEmail, mode: 'insensitive' } },
            include: { admin: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
            take: 20
        })
    ])

    if (bookings.length === 0 && inquiries.length === 0) {
        return {
            email: decodedEmail,
            name: decodedEmail,
            phone: null,
            country: null,
            totalSpent: 0,
            bookingCount: 0,
            inquiryCount: 0,
            tours: [],
            activities: [],
            notes: [],
            bookings: [],
            inquiries: []
        }
    }

    const totalSpent = bookings.reduce((sum, b) => sum + b.totalPrice, 0)
    const customerName = bookings[0] 
        ? `${bookings[0].firstName} ${bookings[0].lastName}`
        : inquiries[0]?.name || decodedEmail

    const activities: Array<{
        id: string
        type: 'booking' | 'inquiry' | 'note'
        title: string
        description: string
        date: Date
        status?: string
    }> = []

    for (const b of bookings) {
        activities.push({
            id: b.id,
            type: 'booking',
            title: `Booking ${b.bookingRef}`,
            description: `${b.tour?.name || 'Tour'} - ${b.numberOfTravelers} travelers - $${b.totalPrice.toLocaleString()}`,
            date: b.createdAt,
            status: b.status
        })
    }

    for (const i of inquiries) {
        activities.push({
            id: i.id,
            type: 'inquiry',
            title: `${i.inquiryType} Inquiry`,
            description: i.subject,
            date: i.createdAt,
            status: i.isReplied ? 'replied' : 'pending'
        })
    }

    for (const n of notes) {
        activities.push({
            id: n.id,
            type: 'note',
            title: 'Note added',
            description: n.content,
            date: n.createdAt,
            status: `${n.admin.firstName} ${n.admin.lastName}`
        })
    }

    activities.sort((a, b) => b.date.getTime() - a.date.getTime())

    return {
        email: decodedEmail,
        name: customerName,
        phone: bookings[0]?.phone || inquiries[0]?.phone,
        country: bookings[0]?.country || inquiries[0]?.country,
        totalSpent,
        bookingCount: bookings.length,
        inquiryCount: inquiries.length,
        tours: [...new Set(bookings.map(b => b.tour?.name).filter(Boolean))] as string[],
        activities,
        notes,
        bookings: bookings.slice(0, 5),
        inquiries: inquiries.slice(0, 5)
    }
}

export default async function CustomerDetailPage({ params }: PageProps) {
    const { email } = await params
    await requireAdmin('bookings', 'VIEW');
    const customer = await getCustomerData(email)

    if (!customer) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{customer.name}</h2>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {customer.email}
                        </div>
                    </div>
                </div>
                <Badge variant={customer.bookingCount > 0 ? 'default' : 'outline'}>
                    {customer.bookingCount > 0 ? 'Customer' : 'Prospect'}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${customer.totalSpent.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customer.bookingCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customer.inquiryCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Location</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customer.country || '-'}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="activity" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings ({customer.bookingCount})</TabsTrigger>
                    <TabsTrigger value="inquiries">Inquiries ({customer.inquiryCount})</TabsTrigger>
                    <TabsTrigger value="notes">Notes ({customer.notes.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {customer.activities.map((activity, idx) => (
                                    <div key={activity.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                            activity.type === 'booking' ? 'admin-tone-success border' :
                                            activity.type === 'inquiry' ? 'admin-tone-info border' :
                                            'admin-tone-featured border'
                                            }`}>
                                                {activity.type === 'booking' ? <Calendar className="h-5 w-5" /> :
                                                 activity.type === 'inquiry' ? <MessageSquare className="h-5 w-5" /> :
                                                 <FileText className="h-5 w-5" />}
                                            </div>
                                            {idx < customer.activities.length - 1 && (
                                                <div className="w-0.5 h-full bg-muted mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{activity.title}</p>
                                                {activity.status === 'CONFIRMED' && (
                                                    <CheckCircle className="h-4 w-4 admin-text-success" />
                                                )}
                                                {activity.status === 'CANCELLED' && (
                                                    <XCircle className="h-4 w-4 admin-text-danger" />
                                                )}
                                                {activity.status === 'replied' && (
                                                    <CheckCircle className="h-4 w-4 admin-text-success" />
                                                )}
                                                {activity.status === 'pending' && (
                                                    <Clock className="h-4 w-4 admin-text-warning" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {activity.date.toLocaleDateString()} - {activity.date.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {customer.activities.length === 0 && (
                                    <p className="text-muted-foreground text-center py-8">No activity yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bookings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {customer.bookings.map(booking => (
                                    <Link 
                                        key={booking.id} 
                                        href={`/admin/bookings/${booking.id}/edit`}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted"
                                    >
                                        <div>
                                            <p className="font-medium">{booking.bookingRef}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.tour?.name} - {booking.numberOfTravelers} travelers
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {booking.travelDate.toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">${booking.totalPrice.toLocaleString()}</p>
                                            <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                                                {booking.status}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
                                {customer.bookings.length === 0 && (
                                    <p className="text-muted-foreground text-center py-8">No bookings yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="inquiries" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Inquiries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {customer.inquiries.map(inquiry => (
                                    <Link 
                                        key={inquiry.id} 
                                        href={`/admin/inquiries/${inquiry.id}/edit`}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted"
                                    >
                                        <div>
                                            <p className="font-medium">{inquiry.subject}</p>
                                            <p className="text-sm text-muted-foreground">{inquiry.inquiryType}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {inquiry.createdAt.toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge variant={inquiry.isReplied ? 'default' : 'outline'}>
                                            {inquiry.isReplied ? 'Replied' : 'Pending'}
                                        </Badge>
                                    </Link>
                                ))}
                                {customer.inquiries.length === 0 && (
                                    <p className="text-muted-foreground text-center py-8">No inquiries yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AddNoteForm email={customer.email} />
                            <Separator className="my-4" />
                            <div className="space-y-4">
                                {customer.notes.map(note => (
                                    <div key={note.id} className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm">{note.content}</p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {note.admin.firstName} {note.admin.lastName} - {note.createdAt.toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                                {customer.notes.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No notes yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
