-- Migration: Add Customer Notes table
-- Created: 2026-04-21

-- Create customer_notes table
CREATE TABLE IF NOT EXISTS "customer_notes" (
    "id" UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "customerEmail" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "adminId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customer_notes_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for customer_notes
CREATE INDEX "customer_notes_customerEmail_idx" ON "customer_notes"("customerEmail");
CREATE INDEX "customer_notes_adminId_idx" ON "customer_notes"("adminId");

-- Comment for documentation
COMMENT ON TABLE "customer_notes" IS 'Customer notes for CRM functionality';
