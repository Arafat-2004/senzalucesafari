import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, canAccess } from "@/lib/admin-auth";
import { z } from "zod";
import { logger } from "@/lib/reliability/logger";

const VALID_STATUSES = ["pending", "confirmed", "cancelled"] as const;
type TransferStatus = (typeof VALID_STATUSES)[number];

const statusSchema = z.object({
  status: z
    .string()
    .refine(
      (val): val is TransferStatus =>
        VALID_STATUSES.includes(val as TransferStatus),
      { message: "Status must be one of: pending, confirmed, cancelled" },
    ),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canAccess(session, 50)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const validation = statusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 },
      );
    }

    const { status } = validation.data;

    const transfer = await prisma.vehicleTransfer.findUnique({ where: { id } });
    if (!transfer) {
      return NextResponse.json(
        { error: "Transfer not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.vehicleTransfer.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      transfer: {
        id: updated.id,
        referenceNumber: updated.referenceNumber,
        status: updated.status,
      },
    });
  } catch (error) {
    logger.error("[Transfer Status] Error", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to update transfer status" },
      { status: 500 },
    );
  }
}
