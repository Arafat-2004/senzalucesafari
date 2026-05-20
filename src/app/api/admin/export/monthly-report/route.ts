import { NextResponse } from "next/server";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { logger } from "@/lib/reliability/logger";

interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable: { finalY: number };
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    // Fetch current month data
    const [
      monthBookings,
      totalRevenue,
      newCustomers,
      activeTours,
      bookingsByStatus,
      topTours,
    ] = await Promise.all([
      prisma.booking.findMany({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        include: { tour: { select: { name: true } } },
      }),
      prisma.booking.aggregate({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: { totalPrice: true },
      }),
      prisma.booking.groupBy({
        by: ["email"],
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _count: { id: true },
      }),
      prisma.tour.count({
        where: { isActive: true },
      }),
      prisma.booking.groupBy({
        by: ["status"],
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _count: { id: true },
      }),
      prisma.booking.groupBy({
        by: ["tourId"],
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    // Fetch top tour names
    const topTourIds = topTours.map((t) => t.tourId);
    const topTourNames = await prisma.tour.findMany({
      where: { id: { in: topTourIds } },
      select: { id: true, name: true },
    });

    // Fetch 6-month revenue trend
    const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1);
    const revenueTrend = await prisma.booking.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: sixMonthsAgo,
          lte: monthEnd,
        },
      },
      _sum: { totalPrice: true },
    });

    // Aggregate revenue by month
    const revenueByMonth: Record<string, number> = {};
    revenueTrend.forEach((booking) => {
      const monthKey = new Date(booking.createdAt).toISOString().slice(0, 7); // YYYY-MM
      revenueByMonth[monthKey] =
        (revenueByMonth[monthKey] || 0) + (booking._sum.totalPrice || 0);
    });

    // Generate PDF
    const doc = new jsPDF();
    const monthName = now.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Header
    doc.setFontSize(24);
    doc.setTextColor(13, 148, 136); // Teal color
    doc.text("Senza Luce Safaris", 14, 20);

    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text(`Monthly Report - ${monthName}`, 14, 30);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated: ${now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      14,
      38,
    );

    // Summary Metrics
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary Metrics", 14, 50);

    const summaryData = [
      ["Total Bookings", monthBookings.length.toString()],
      [
        "Total Revenue",
        `$${(totalRevenue._sum.totalPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      ],
      ["New Customers", newCustomers.length.toString()],
      ["Active Tours", activeTours.toString()],
    ];

    autoTable(doc, {
      startY: 55,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "grid",
      headStyles: { fillColor: [13, 148, 136] },
      styles: { fontSize: 11 },
    });

    // Bookings by Status
    const statusY =
      (doc as unknown as JsPDFWithAutoTable).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Bookings by Status", 14, statusY);

    const statusMap: Record<string, string> = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      NO_SHOW: "No Show",
    };

    const statusData = bookingsByStatus.map((s) => [
      statusMap[s.status] || s.status,
      s._count.id.toString(),
    ]);

    autoTable(doc, {
      startY: statusY + 5,
      head: [["Status", "Count"]],
      body: statusData,
      theme: "grid",
      headStyles: { fillColor: [124, 58, 237] }, // Purple
      styles: { fontSize: 11 },
    });

    // Top 5 Most Booked Tours
    const topToursY =
      (doc as unknown as JsPDFWithAutoTable).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Top 5 Most Booked Tours", 14, topToursY);

    const topToursData = topTours.map((t) => {
      const tour = topTourNames.find((tn) => tn.id === t.tourId);
      return [tour?.name || "Unknown Tour", t._count.id.toString()];
    });

    autoTable(doc, {
      startY: topToursY + 5,
      head: [["Tour Name", "Bookings"]],
      body: topToursData,
      theme: "grid",
      headStyles: { fillColor: [217, 119, 6] }, // Amber
      styles: { fontSize: 11 },
    });

    // Revenue Trend (Last 6 Months)
    const revenueY =
      (doc as unknown as JsPDFWithAutoTable).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Revenue Trend (Last 6 Months)", 14, revenueY);

    const sortedMonths = Object.keys(revenueByMonth).sort();
    const revenueData = sortedMonths.map((month) => {
      const [year, monthNum] = month.split("-");
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return [
        date.toLocaleString("default", { month: "short", year: "numeric" }),
        `$${revenueByMonth[month].toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      ];
    });

    autoTable(doc, {
      startY: revenueY + 5,
      head: [["Month", "Revenue"]],
      body: revenueData,
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] }, // Blue
      styles: { fontSize: 11 },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Senza Luce Safaris - Confidential Report - Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10,
      );
    }

    // Generate PDF blob
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    const filename = `senzaluce-report-${currentYear}-${String(currentMonth + 1).padStart(2, "0")}.pdf`;

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    logger.error("PDF report generation error", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to generate PDF report" },
      { status: 500 },
    );
  }
}
