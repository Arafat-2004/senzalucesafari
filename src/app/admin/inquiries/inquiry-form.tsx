'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markAsRead, markAsReplied, updateInquiryNotes } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type InquiryData = {
    id: string
    name: string
    email: string
    phone: string | null
    country: string | null
    subject: string
    message: string
    inquiryType: string
    tourInterest: string | null
    travelDate: Date | null
    numberOfTravelers: number | null
    isRead: boolean
    isReplied: boolean
    repliedAt: Date | null
    internalNotes: string | null
    source: string | null
    createdAt: Date
}

export default function InquiryForm({ inquiry }: { inquiry: InquiryData }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleMarkRead() {
        startTransition(async () => { await markAsRead(inquiry.id) })
    }

    function handleMarkReplied() {
        startTransition(async () => { await markAsReplied(inquiry.id) })
    }

    function handleSaveNotes(formData: FormData) {
        startTransition(async () => { await updateInquiryNotes(inquiry.id, formData) })
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Inquiry: {inquiry.subject}</CardTitle>
                        <div className="flex gap-2">
                            <Badge variant={inquiry.isRead ? 'default' : 'destructive'}>
                                {inquiry.isRead ? 'Read' : 'Unread'}
                            </Badge>
                            <Badge variant={inquiry.isReplied ? 'default' : 'outline'}>
                                {inquiry.isReplied ? 'Replied' : 'Awaiting Reply'}
                            </Badge>
                            <Badge variant="secondary">{inquiry.inquiryType.replace(/_/g, ' ')}</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h3 className="font-semibold text-sm">Contact Info</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-muted-foreground">Name:</span> {inquiry.name}</div>
                            <div><span className="text-muted-foreground">Email:</span> {inquiry.email}</div>
                            {inquiry.phone && <div><span className="text-muted-foreground">Phone:</span> {inquiry.phone}</div>}
                            {inquiry.country && <div><span className="text-muted-foreground">Country:</span> {inquiry.country}</div>}
                        </div>
                    </div>
                    {(inquiry.tourInterest || inquiry.travelDate || inquiry.numberOfTravelers) && (
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h3 className="font-semibold text-sm">Travel Interest</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {inquiry.tourInterest && <div><span className="text-muted-foreground">Tour:</span> {inquiry.tourInterest}</div>}
                                {inquiry.travelDate && <div><span className="text-muted-foreground">Travel Date:</span> {new Date(inquiry.travelDate).toLocaleDateString()}</div>}
                                {inquiry.numberOfTravelers && <div><span className="text-muted-foreground">Travelers:</span> {inquiry.numberOfTravelers}</div>}
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm">Message</h3>
                        <div className="rounded-lg border p-4 text-sm whitespace-pre-wrap">{inquiry.message}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Received: {new Date(inquiry.createdAt).toLocaleString()}
                        {inquiry.repliedAt && <> · Replied: {new Date(inquiry.repliedAt).toLocaleString()}</>}
                        {inquiry.source && <> · Source: {inquiry.source}</>}
                    </div>

                    <hr />

                    <div className="flex gap-2">
                        {!inquiry.isRead && (
                            <Button type="button" variant="outline" size="sm" onClick={handleMarkRead} disabled={isPending}>
                                Mark as Read
                            </Button>
                        )}
                        {!inquiry.isReplied && (
                            <Button type="button" variant="outline" size="sm" onClick={handleMarkReplied} disabled={isPending}>
                                Mark as Replied
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <form action={handleSaveNotes}>
                <Card>
                    <CardHeader><CardTitle className="text-base">Internal Notes</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="internalNotes">Notes</Label>
                            <Textarea id="internalNotes" name="internalNotes" defaultValue={inquiry.internalNotes ?? ''} rows={3} placeholder="Add internal notes..." />
                        </div>
                        <div className="flex gap-3">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Saving...' : 'Save Notes'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.push('/admin/inquiries')}>Back</Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
