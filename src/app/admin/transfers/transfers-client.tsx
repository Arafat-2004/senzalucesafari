'use client';

import { useState, useMemo } from 'react';
import { AdminPageHeader } from '../components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2, Mail, Phone, CheckCircle, XCircle, Car, Search } from 'lucide-react';
import { format } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Transfer {
    id: string;
    referenceNumber: string;
    vehicleName: string;
    transferType: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: Date | string;
    pickupTime: string;
    flightNumber: string | null;
    passengers: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    specialRequests: string | null;
    status: string;
    createdAt: Date | string;
}

interface AdminTransfersClientProps {
    transfers: Transfer[];
}

function statusColor(status: string) {
    switch (status) {
        case 'confirmed':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
}

function formatTransferType(type: string) {
    return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function AdminTransfersClient({ transfers }: AdminTransfersClientProps) {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 20;

    // Filter by status
    const filteredByStatus = useMemo(() => {
        if (statusFilter === 'all') return transfers;
        return transfers.filter(t => t.status === statusFilter);
    }, [transfers, statusFilter]);

    // Filter by search
    const filteredTransfers = useMemo(() => {
        if (!searchQuery.trim()) return filteredByStatus;
        const query = searchQuery.toLowerCase();
        return filteredByStatus.filter(t =>
            t.customerName.toLowerCase().includes(query) ||
            t.referenceNumber.toLowerCase().includes(query) ||
            t.customerEmail.toLowerCase().includes(query)
        );
    }, [filteredByStatus, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);
    const paginatedTransfers = filteredTransfers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleExportCSV = () => {
        const headers = ['Reference', 'Customer', 'Email', 'Phone', 'Vehicle', 'Type', 'Pickup', 'Drop-off', 'Date', 'Time', 'Passengers', 'Status', 'Created'];
        const rows = filteredTransfers.map(t => [
            t.referenceNumber,
            t.customerName,
            t.customerEmail,
            t.customerPhone,
            t.vehicleName,
            t.transferType,
            t.pickupLocation,
            t.dropoffLocation,
            new Date(t.pickupDate).toLocaleDateString(),
            t.pickupTime,
            t.passengers.toString(),
            t.status,
            new Date(t.createdAt).toLocaleString(),
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transfers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exported ${filteredTransfers.length} transfers`);
    };

    const handleConfirm = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/transfers/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'confirmed' }),
            });
            if (response.ok) {
                toast.success('Transfer confirmed');
                window.location.reload();
            } else {
                toast.error('Failed to confirm transfer');
            }
        } catch (error) {
            toast.error('Failed to confirm transfer');
        } finally {
            setIsLoading(false);
            setConfirmingId(null);
        }
    };

    const handleCancel = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/transfers/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' }),
            });
            if (response.ok) {
                toast.success('Transfer cancelled');
                window.location.reload();
            } else {
                toast.error('Failed to cancel transfer');
            }
        } catch (error) {
            toast.error('Failed to cancel transfer');
        } finally {
            setIsLoading(false);
            setCancellingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Transfer Bookings"
                description="Manage vehicle transfer requests"
            />

            {/* Filters and Search */}
            <div className="space-y-4">
                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {status !== 'all' && (
                                <span className="ml-2 text-xs">
                                    ({transfers.filter(t => t.status === status).length})
                                </span>
                            )}
                        </Button>
                    ))}
                </div>

                {/* Search and Export */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or reference..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={handleExportCSV} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Results */}
            <div className="grid gap-4">
                {paginatedTransfers.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No transfer requests found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Try adjusting your filters or search query'
                                    : 'Transfer requests will appear here once customers submit them'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    paginatedTransfers.map((transfer) => (
                        <Card key={transfer.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold">{transfer.referenceNumber}</h3>
                                            <Badge className={statusColor(transfer.status)}>
                                                {transfer.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {transfer.vehicleName} • {formatTransferType(transfer.transferType)}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(transfer.createdAt), 'MMM dd, yyyy HH:mm')}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <strong>Route:</strong> {transfer.pickupLocation} → {transfer.dropoffLocation}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Date & Time:</strong> {format(new Date(transfer.pickupDate), 'MMM dd, yyyy')} at {transfer.pickupTime}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Passengers:</strong> {transfer.passengers}
                                        </p>
                                        {transfer.flightNumber && (
                                            <p className="text-sm">
                                                <strong>Flight:</strong> {transfer.flightNumber}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <strong>Customer:</strong> {transfer.customerName}
                                        </p>
                                        <p className="text-sm flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            <a href={`mailto:${transfer.customerEmail}`} className="text-primary hover:underline">
                                                {transfer.customerEmail}
                                            </a>
                                        </p>
                                        <p className="text-sm flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            {transfer.customerPhone}
                                        </p>
                                    </div>
                                </div>

                                {transfer.specialRequests && (
                                    <div className="mb-4 p-3 bg-muted/50 rounded">
                                        <p className="text-sm">
                                            <strong>Special Requests:</strong> {transfer.specialRequests}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {transfer.status === 'pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="default"
                                                disabled={isLoading}
                                                onClick={() => setConfirmingId(transfer.id)}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Confirm
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                disabled={isLoading}
                                                onClick={() => setCancellingId(transfer.id)}
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransfers.length)} of {filteredTransfers.length}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Confirm AlertDialog */}
            <AlertDialog open={!!confirmingId} onOpenChange={() => setConfirmingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Transfer?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to confirm this transfer? The customer will receive a confirmation email.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => confirmingId && handleConfirm(confirmingId)}>
                            Confirm Transfer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel AlertDialog */}
            <AlertDialog open={!!cancellingId} onOpenChange={() => setCancellingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Transfer?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this transfer? The customer will be notified.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => cancellingId && handleCancel(cancellingId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Cancel Transfer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
