'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { 
  CalendarCheck, 
  MessageSquare, 
  Clock, 
  Check, 
  Reply, 
  CheckCircle,
  Eye,
  User,
  Mail,
  Users as UsersIcon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface BookingData {
  id: string;
  bookingRef: string;
  firstName: string;
  lastName: string;
  email: string;
  travelDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  tour?: { name: string } | null;
  specialRequests?: string | null;
}

interface InquiryData {
  id: string;
  name: string;
  email: string;
  message: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
  inquiryType?: string;
  tourInterest?: string;
  numberOfTravelers?: number;
  travelDate?: string;
}

export interface ActivityItem {
  id: string;
  type: 'booking' | 'inquiry';
  clientName: string;
  email: string;
  packageName: string;
  details: string;
  status: string;
  date: Date;
  rawItem: BookingData | InquiryData;
}

interface RecentActivityFeedProps {
  bookings: BookingData[];
  inquiries: InquiryData[];
  onRefresh?: () => void;
}

// Utility to format relative time dynamically
function formatRelativeTime(date: Date): string {
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'just now';
  }
}

// Helper to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format inquiry intent summary snippet
function getInquiryIntent(item: InquiryData): string {
  const parts: string[] = [];
  
  if (item.inquiryType) {
    const typeLabel = item.inquiryType === 'TOUR_INQUIRY' ? 'Tour Inquiry' : 'Custom Safari';
    parts.push(typeLabel);
  } else {
    parts.push('Inquiry');
  }

  if (item.numberOfTravelers) {
    parts.push(`${item.numberOfTravelers} ${item.numberOfTravelers > 1 ? 'Guests' : 'Guest'}`);
  }

  if (item.travelDate) {
    try {
      const year = new Date(item.travelDate).getFullYear();
      parts.push(String(year));
    } catch {}
  }

  return parts.join(' • ');
}

// Status Pill color mapper
function getStatusStyles(type: 'booking' | 'inquiry', status: string) {
  if (type === 'booking') {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
      case 'COMPLETED':
      case 'PAID':
      return 'admin-tone-success border';
      case 'PENDING':
      return 'admin-tone-warning border';
      default:
      return 'admin-tone-danger border';
    }
  } else {
    // Inquiries: Read vs Unread
    const isUnread = status === 'Unread' || status === 'UNREAD';
    if (isUnread) {
      return 'admin-tone-danger border font-semibold';
    } else {
      return 'admin-tone-neutral border';
    }
  }
}

export function RecentActivityFeed({ bookings, inquiries, onRefresh }: RecentActivityFeedProps) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [inboxState, setInboxState] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Convert and merge bookings and inquiries chronologically
  const bookingItems: ActivityItem[] = bookings.map((b) => ({
    id: b.id,
    type: 'booking',
    clientName: `${b.firstName} ${b.lastName}`,
    email: b.email,
    packageName: b.tour?.name || 'Custom Safari Package',
    details: `${b.numberOfTravelers} ${b.numberOfTravelers > 1 ? 'Guests' : 'Guest'} • ${formatCurrency(b.totalPrice)}`,
    status: b.status,
    date: new Date(b.createdAt),
    rawItem: b,
  }));

  const inquiryItems: ActivityItem[] = inquiries.map((i) => {
    const isRead = inboxState[i.id] !== undefined ? inboxState[i.id] : i.isRead;
    return {
      id: i.id,
      type: 'inquiry',
      clientName: i.name,
      email: i.email,
      packageName: i.tourInterest ? `Interest: ${i.tourInterest}` : 'General Safari Enquiry',
      details: getInquiryIntent(i),
      status: isRead ? 'Read' : 'Unread',
      date: new Date(i.createdAt),
      rawItem: i,
    };
  });

  const allActivities = [...bookingItems, ...inquiryItems].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Group activities by Today, Yesterday, Earlier
  const todayActivities: ActivityItem[] = [];
  const yesterdayActivities: ActivityItem[] = [];
  const earlierActivities: ActivityItem[] = [];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  allActivities.forEach((item) => {
    if (item.date >= startOfToday) {
      todayActivities.push(item);
    } else if (item.date >= startOfYesterday) {
      yesterdayActivities.push(item);
    } else {
      earlierActivities.push(item);
    }
  });

  // Action: Mark inquiry as Read/Unread programmatically
  const handleMarkAsRead = async (id: string, currentlyRead: boolean) => {
    setIsUpdating(id);
    try {
      const response = await fetch(`/api/admin/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !currentlyRead }),
      });
      if (response.ok) {
        setInboxState((prev) => ({ ...prev, [id]: !currentlyRead }));
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Failed to update inquiry status', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const renderSection = (title: string, items: ActivityItem[]) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-2 mb-6">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
          {title}
        </h4>
        <div className="table-scroll rounded-xl border border-border/60 bg-card">
          <table className="min-w-[640px] w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase">
                <th className="py-3 px-4 w-[25%]">Client</th>
                <th className="py-3 px-4 w-[15%]">Type</th>
                <th className="py-3 px-4 w-[35%]">Package / Details</th>
                <th className="py-3 px-4 w-[15%]">Status</th>
                <th className="py-3 px-4 w-[10%] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {items.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-muted/30 transition-colors group cursor-pointer focus:outline-none focus:bg-muted/50"
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${item.clientName}'s ${item.type}`}
                  onClick={() => setSelectedActivity(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedActivity(item);
                    }
                  }}
                >
                  {/* CLIENT COLUMN */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate block max-w-[200px]">
                        {item.clientName}
                      </span>
                      <span className="text-xs text-muted-foreground truncate block max-w-[200px]">
                        {item.email}
                      </span>
                    </div>
                  </td>

                  {/* TYPE COLUMN */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      {item.type === 'booking' ? (
                        <>
                    <CalendarCheck className="h-3.5 w-3.5 admin-text-success shrink-0" />
                    <span className="admin-text-success font-medium">Booking</span>
                        </>
                      ) : (
                        <>
                    <MessageSquare className="h-3.5 w-3.5 admin-text-info shrink-0" />
                    <span className="admin-text-info font-medium">Inquiry</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* DETAILS COLUMN */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground truncate block max-w-[300px]">
                        {item.packageName}
                      </span>
                      <span className="text-xs text-muted-foreground truncate block max-w-[300px]">
                        {item.details}
                      </span>
                    </div>
                  </td>

                  {/* STATUS COLUMN */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${getStatusStyles(item.type, item.status)}`}>
                        {item.status.toLowerCase()}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 whitespace-nowrap">
                        <Clock className="h-2.5 w-2.5 shrink-0" />
                        {formatRelativeTime(item.date)}
                      </span>
                    </div>
                  </td>

                  {/* ACTION COLUMN */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      {item.type === 'booking' ? (
                        <Link href={`/admin/bookings/${item.id}/edit`}>
                          <Button variant="outline" size="sm" className="h-8 px-2 flex items-center gap-1 hover:border-primary hover:text-primary">
                            <Eye className="h-3.5 w-3.5" />
                            <span>Manage</span>
                          </Button>
                        </Link>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                          className="h-8 px-2 flex items-center gap-1 hover:border-primary hover:text-primary"
                            onClick={() => setSelectedActivity(item)}
                          >
                            <Reply className="h-3.5 w-3.5" />
                            <span>Reply</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                          className={`h-8 w-8 rounded-lg shrink-0 ${item.status === 'Read' ? 'text-muted-foreground' : 'text-primary'}`}
                            onClick={() => handleMarkAsRead(item.id, item.status === 'Read')}
                            disabled={isUpdating === item.id}
                            title={item.status === 'Read' ? 'Mark as Unread' : 'Mark as Read'}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="lg:col-span-2 flex flex-col justify-between">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-green" />
              Recent Activity Logs
            </CardTitle>
            <div className="flex gap-2">
              <Link href="/admin/bookings" className="text-xs font-semibold text-brand-green hover:underline">
                Bookings
              </Link>
                              <span className="text-border">|</span>
              <Link href="/admin/inquiries" className="text-xs font-semibold text-brand-green hover:underline">
                Inquiries
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 px-4 sm:px-6 flex-1">
          {allActivities.length > 0 ? (
            <>
              {renderSection('Today', todayActivities)}
              {renderSection('Yesterday', yesterdayActivities)}
              {renderSection('Earlier this Week', earlierActivities)}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No recent activity logged (last 7 days)
            </div>
          )}
        </CardContent>
        {allActivities.length > 0 && (
          <div className="p-4 border-t bg-muted/10 flex justify-between items-center text-xs font-semibold px-6 shrink-0 rounded-b-xl">
            <span className="text-muted-foreground">Showing last 7 days of activity</span>
            <div className="flex gap-4">
              <Link href="/admin/bookings" className="text-brand-green hover:underline flex items-center gap-1">
                All Bookings &rarr;
              </Link>
              <Link href="/admin/inquiries" className="text-brand-green hover:underline flex items-center gap-1">
                All Inquiries &rarr;
              </Link>
            </div>
          </div>
        )}
      </Card>

      {/* Modern Overlay Side-Drawer for Item Details using accessible Sheet */}
      <Sheet open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <SheetContent className="w-[85vw] max-w-lg flex flex-col h-full bg-background border-l p-0 text-foreground animate-slide-in">
          {selectedActivity && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  {selectedActivity.type === 'booking' ? (
                  <CalendarCheck className="h-5 w-5 admin-text-success" />
                  ) : (
                  <MessageSquare className="h-5 w-5 admin-text-info" />
                  )}
                  {selectedActivity.type === 'booking' ? 'Booking Details' : 'Inquiry Details'}
                </h3>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Client Info Card */}
                <div className="p-4 bg-muted/40 rounded-xl space-y-3 border border-border/40">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider font-heading">Client Contact</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground leading-snug">{selectedActivity.clientName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        {selectedActivity.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider font-heading">Details & Package</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/20 border border-border/30 rounded-lg">
                      <span className="text-xs text-muted-foreground block mb-0.5">Package/Subject</span>
                      <span className="font-semibold text-foreground text-sm">{selectedActivity.packageName}</span>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border/30 rounded-lg">
                      <span className="text-xs text-muted-foreground block mb-0.5">Status</span>
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full mt-0.5 ${getStatusStyles(selectedActivity.type, selectedActivity.status)}`}>
                        {selectedActivity.status}
                      </span>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border/30 rounded-lg">
                      <span className="text-xs text-muted-foreground block mb-0.5">Logged Time</span>
                      <span className="font-medium text-foreground text-sm flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatRelativeTime(selectedActivity.date)}
                      </span>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border/30 rounded-lg">
                      <span className="text-xs text-muted-foreground block mb-0.5">Travel Info</span>
                      <span className="font-medium text-foreground text-sm flex items-center gap-1">
                    <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        {selectedActivity.details}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message/Note (Inquiries) */}
                {selectedActivity.type === 'inquiry' && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider font-heading">Client Inquiry Message</h4>
                    <div className="p-4 bg-muted/40 border rounded-xl text-sm leading-relaxed text-foreground max-h-[220px] overflow-y-auto whitespace-pre-wrap font-sans">
                      {(selectedActivity.rawItem as InquiryData).message}
                    </div>
                  </div>
                )}

                {/* Special Requests (Bookings) */}
                {selectedActivity.type === 'booking' && (selectedActivity.rawItem as BookingData).specialRequests && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider font-heading">Special Requests</h4>
                    <div className="p-4 bg-muted/40 border rounded-xl text-sm leading-relaxed text-foreground max-h-[220px] overflow-y-auto whitespace-pre-wrap font-sans">
                      {(selectedActivity.rawItem as BookingData).specialRequests}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-border/50 bg-muted/20 flex gap-3">
                {selectedActivity.type === 'booking' ? (
                  <>
                    <Link href={`/admin/bookings/${selectedActivity.id}/edit`} className="flex-1">
                      <Button className="w-full flex items-center justify-center gap-2">
                        <CalendarCheck className="h-4 w-4" />
                        Manage Booking
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedActivity(null)}>
                      Close
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href={`/admin/inquiries/${selectedActivity.id}/edit`} className="flex-1">
                      <Button className="w-full flex items-center justify-center gap-2">
                        <Reply className="h-4 w-4" />
                        Reply Inquiry
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center justify-center gap-1.5"
                      onClick={() => {
                        handleMarkAsRead(selectedActivity.id, selectedActivity.status === 'Read');
                        setSelectedActivity(null);
                      }}
                    >
                  <CheckCircle className="h-4 w-4 admin-text-success" />
                      <span>{selectedActivity.status === 'Read' ? 'Mark Unread' : 'Mark Read'}</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
