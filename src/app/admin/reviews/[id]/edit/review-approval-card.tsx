'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Star, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { approveReview, rejectReview } from '../../actions'
import type { Review } from '@/generated/prisma/client'

interface ReviewApprovalCardProps {
    review: Review & { tour?: { name: string; slug: string } | null }
}

export function ReviewApprovalCard({ review }: ReviewApprovalCardProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const { toast } = useToast()
    const [showRejectForm, setShowRejectForm] = useState(false)
    const [rejectionReason, setRejectionReason] = useState(review.rejectionReason || '')

    const handleApprove = () => {
        startTransition(async () => {
            try {
                await approveReview(review.id)
                toast({ title: 'Review approved', description: 'The review is now live on the tour page.' })
                router.refresh()
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Failed to approve review',
                    variant: 'destructive',
                })
            }
        })
    }

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            toast({ title: 'Rejection reason required', description: 'Please provide a reason.', variant: 'destructive' })
            return
        }
        startTransition(async () => {
            try {
                await rejectReview(review.id, rejectionReason)
                toast({ title: 'Review rejected', description: 'The review has been hidden.' })
                router.refresh()
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Failed to reject review',
                    variant: 'destructive',
                })
            }
        })
    }

    const status = review.status || 'PENDING'

    const statusBadge = status === 'APPROVED'
        ? <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>
        : review.status === 'REJECTED'
            ? <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
            : <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                        Review Approval
                        {statusBadge}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            />
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Customer:</span>
                        <p className="font-medium">{review.customerName}</p>
                        {review.customerEmail && <p className="text-muted-foreground">{review.customerEmail}</p>}
                    </div>
                    <div>
                        <span className="text-muted-foreground">Tour:</span>
                        <p className="font-medium">{review.tour?.name || 'Unknown'}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Submitted:</span>
                        <p className="font-medium">{review.createdAt ? new Date(review.createdAt).toLocaleString() : 'N/A'}</p>
                    </div>
                    {review.approvedAt && (
                        <div>
                            <span className="text-muted-foreground">Approved:</span>
                            <p className="font-medium">{new Date(review.approvedAt).toLocaleString()}</p>
                        </div>
                    )}
                </div>

                <div>
                    <span className="text-muted-foreground text-sm">Review Title:</span>
                    <p className="font-medium">{review.title}</p>
                </div>
                <div>
                    <span className="text-muted-foreground text-sm">Review Content:</span>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">{review.comment}</p>
                </div>

                {review.rejectionReason && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-700 dark:text-red-400">
                            <XCircle className="h-4 w-4 inline mr-1" />
                            <strong>Rejection Reason:</strong> {review.rejectionReason}
                        </p>
                    </div>
                )}

                {status === 'PENDING' && (
                    <div className="flex items-center gap-3 pt-2 border-t">
                        <Button onClick={handleApprove} disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Approve & Publish
                        </Button>
                        <Button variant="outline" onClick={() => setShowRejectForm(!showRejectForm)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                        </Button>
                    </div>
                )}

                {showRejectForm && status === 'PENDING' && (
                    <div className="space-y-3 pt-2">
                        <Textarea
                            placeholder="Reason for rejection (e.g., Inappropriate language, Spam, Duplicate review...)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={3}
                        />
                        <div className="flex items-center gap-3">
                            <Button variant="destructive" onClick={handleReject} disabled={isPending}>
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <XCircle className="h-4 w-4 mr-2" />
                                )}
                                Confirm Rejection
                            </Button>
                            <Button variant="ghost" onClick={() => { setShowRejectForm(false); setRejectionReason('') }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {status === 'APPROVED' && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                        <p className="text-sm text-green-700 dark:text-green-400">
                            <CheckCircle className="h-4 w-4 inline mr-1" />
                            This review is live and visible on the tour page.
                        </p>
                    </div>
                )}

                {status === 'REJECTED' && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-700 dark:text-red-400">
                            <XCircle className="h-4 w-4 inline mr-1" />
                            This review is hidden from the public site.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
