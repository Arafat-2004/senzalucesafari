import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export async function GET() {
  try {
    const [
      pendingBookings,
      unreadInquiries,
      pendingReviews,
      totalBookings,
      totalInquiries,
    ] = await Promise.all([
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.contactInquiry.count({ where: { isRead: false } }),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.booking.count(),
      prisma.contactInquiry.count(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        pendingBookings,
        unreadInquiries,
        pendingReviews,
        totalBookings,
        totalInquiries,
        lastUpdate: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
