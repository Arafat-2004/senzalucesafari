'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Star, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { approveReview, rejectReview } from '../../actions'
import type { Review } from '@/generated/prisma/client'

interface ReviewApprovalCardProps {
    review: Review & { tour?: { name: string; slug: string } | null }
}

export function ReviewApprovalCard({ review }: ReviewApprovalCardProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [showRejectForm, setShowRejectForm] = useState(false)
    const [rejectionReason, setRejectionReason] = useState(review.rejectionReason || '')

    const handleApprove = () => {
        startTransition(async () => {
            try {
                await approveReview(review.id)
                toast.success('The review is now live on the tour page.')
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to approve review')
            }
        })
    }

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a reason.')
            return
        }
        startTransition(async () => {
            try {
                await rejectReview(review.id, rejectionReason)
                toast.success('The review has been hidden.')
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to reject review')
            }
        })
    }

    const status = review.status || 'PENDING'

    const statusBadge = status === 'APPROVED'
                    ? <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>
        : review.status === 'REJECTED'
                        ? <Badge variant="danger"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
                        : <Badge variant="warning"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle className="flex items-center gap-3">
                        Review Approval
                        {statusBadge}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${i < review.rating ? 'fill-current admin-text-featured' : 'text-muted-foreground/30'}`}
                            />
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                <div className="admin-tone-danger rounded-md border p-3">
                    <p className="text-sm">
                            <XCircle className="h-4 w-4 inline mr-1" />
                            <strong>Rejection Reason:</strong> {review.rejectionReason}
                        </p>
                    </div>
                )}

                {status !== 'APPROVED' && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t">
                        <Button onClick={handleApprove} disabled={isPending} className="min-h-[44px]">
                            {isPending ? (
                                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Approving...</>
                            ) : (
                                <><CheckCircle className="h-4 w-4 mr-2" /> Approve & Publish</>
                            )}
                        </Button>
                        {status !== 'REJECTED' && (
                            <Button variant="outline" onClick={() => setShowRejectForm(!showRejectForm)} className="min-h-[44px]">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                            </Button>
                        )}
                    </div>
                )}

                {status === 'APPROVED' && (
                    <div className="flex flex-col items-start gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">Need to remove it from the public site? Record a reason for the audit trail.</p>
                        <Button variant="outline" onClick={() => setShowRejectForm(!showRejectForm)} className="min-h-[44px] shrink-0">
                            <XCircle className="h-4 w-4 mr-2" />
                            Unpublish review
                        </Button>
                    </div>
                )}

                {showRejectForm && status !== 'REJECTED' && (
                    <div className="space-y-3 pt-2">
                        <Textarea
                            placeholder="Reason for rejection (e.g., Inappropriate language, Spam, Duplicate review...)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={3}
                        />
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <Button variant="destructive" onClick={handleReject} disabled={isPending} className="min-h-[44px]">
                                {isPending ? (
                                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Rejecting...</>
                                ) : (
                                    <><XCircle className="h-4 w-4 mr-2" /> Confirm Rejection</>
                                )}
                            </Button>
                            <Button variant="ghost" onClick={() => { setShowRejectForm(false); setRejectionReason('') }} className="min-h-[44px]">
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {status === 'APPROVED' && (
                <div className="admin-tone-success rounded-md border p-3">
                    <p className="text-sm">
                            <CheckCircle className="h-4 w-4 inline mr-1" />
                            This review is live and visible on the tour page.
                        </p>
                    </div>
                )}

                {status === 'REJECTED' && (
                <div className="admin-tone-danger rounded-md border p-3">
                    <p className="text-sm">
                            <XCircle className="h-4 w-4 inline mr-1" />
                            This review is hidden from the public site.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
