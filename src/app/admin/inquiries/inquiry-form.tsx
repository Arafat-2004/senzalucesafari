'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markAsRead, markAsReplied, updateInquiryNotes } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

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
    const { toast } = useToast()
    const [localInquiry, setLocalInquiry] = useState(inquiry)

    function handleMarkRead() {
        startTransition(async () => {
            try {
                await markAsRead(inquiry.id)
                setLocalInquiry(prev => ({ ...prev, isRead: true }))
                router.refresh()
                toast({ title: 'Success', description: 'Inquiry marked as read', variant: 'default' })
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to mark as read', variant: 'destructive' })
            }
        })
    }

    function handleMarkReplied() {
        startTransition(async () => {
            try {
                await markAsReplied(inquiry.id)
                setLocalInquiry(prev => ({ ...prev, isReplied: true }))
                router.refresh()
                toast({ title: 'Success', description: 'Inquiry marked as replied', variant: 'default' })
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to mark as replied', variant: 'destructive' })
            }
        })
    }

    function handleSaveNotes(formData: FormData) {
        startTransition(async () => {
            try {
                await updateInquiryNotes(inquiry.id, formData)
                router.refresh()
                toast({ title: 'Success', description: 'Notes saved successfully', variant: 'default' })
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to save notes', variant: 'destructive' })
            }
        })
    }

return (
        <div className="space-y-6 max-w-3xl">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Inquiry: {localInquiry.subject}</CardTitle>
                        <div className="flex gap-2">
                            <Badge variant={localInquiry.isRead ? 'default' : 'destructive'}>
                                {localInquiry.isRead ? 'Read' : 'Unread'}
                            </Badge>
                            <Badge variant={localInquiry.isReplied ? 'default' : 'outline'}>
                                {localInquiry.isReplied ? 'Replied' : 'Awaiting Reply'}
                            </Badge>
                            <Badge variant="secondary">{localInquiry.inquiryType.replace(/_/g, ' ')}</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h3 className="font-semibold text-sm">Contact Info</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-muted-foreground">Name:</span> {localInquiry.name}</div>
                            <div><span className="text-muted-foreground">Email:</span> {localInquiry.email}</div>
                            {localInquiry.phone && <div><span className="text-muted-foreground">Phone:</span> {localInquiry.phone}</div>}
                            {localInquiry.country && <div><span className="text-muted-foreground">Country:</span> {localInquiry.country}</div>}
                        </div>
                    </div>
                    {(localInquiry.tourInterest || localInquiry.travelDate || localInquiry.numberOfTravelers) && (
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h3 className="font-semibold text-sm">Travel Interest</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {localInquiry.tourInterest && <div><span className="text-muted-foreground">Tour:</span> {localInquiry.tourInterest}</div>}
                                {localInquiry.travelDate && <div><span className="text-muted-foreground">Travel Date:</span> {new Date(localInquiry.travelDate).toLocaleDateString()}</div>}
                                {localInquiry.numberOfTravelers && <div><span className="text-muted-foreground">Travelers:</span> {localInquiry.numberOfTravelers}</div>}
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm">Message</h3>
                        <div className="rounded-lg border p-4 text-sm whitespace-pre-wrap">{localInquiry.message}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Received: {new Date(localInquiry.createdAt).toLocaleString()}
                        {localInquiry.repliedAt && <> · Replied: {new Date(localInquiry.repliedAt).toLocaleString()}</>}
                        {localInquiry.source && <> · Source: {localInquiry.source}</>}
                    </div>

                    <hr />

                    <div className="flex gap-2">
                        {!localInquiry.isRead && (
                            <Button type="button" variant="outline" size="sm" onClick={handleMarkRead} disabled={isPending}>
                                {isPending ? 'Processing...' : 'Mark as Read'}
                            </Button>
                        )}
                        {!localInquiry.isReplied && (
                            <Button type="button" variant="outline" size="sm" onClick={handleMarkReplied} disabled={isPending}>
                                {isPending ? 'Processing...' : 'Mark as Replied'}
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
                            <Textarea id="internalNotes" name="internalNotes" defaultValue={localInquiry.internalNotes ?? ''} rows={3} placeholder="Add internal notes..." />
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
