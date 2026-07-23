'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { createAuditLog } from '@/lib/admin-audit'
import { invalidateCache, invalidateTours } from '@/lib/reliability/cache-manager'

const priceSchema = z.object({
  id: z.string().uuid(),
  price: z.number().finite().min(0).max(1_000_000),
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/).default('USD'),
})

export async function updateTourCatalogPrice(input: z.input<typeof priceSchema>) {
  const admin = await requireAdmin('tours', 'EDIT')
  const data = priceSchema.parse(input)
  const previous = await prisma.tour.findUnique({ where: { id: data.id }, select: { name: true, priceFrom: true } })
  if (!previous) throw new Error('Tour package not found.')
  await prisma.tour.update({ where: { id: data.id }, data: { priceFrom: data.price } })
  await createAuditLog({ userId: admin.id, action: 'UPDATE', entityType: 'Tour', entityId: data.id, description: `Updated advertised starting price for ${previous.name}`, metadata: { previousPrice: previous.priceFrom, newPrice: data.price, currency: data.currency } })
  invalidateTours()
  return { success: true }
}

export async function updateAccommodationCatalogPrice(input: z.input<typeof priceSchema>) {
  const admin = await requireAdmin('tours', 'EDIT')
  const data = priceSchema.parse(input)
  const previous = await prisma.accommodation.findUnique({ where: { id: data.id }, select: { name: true, pricePerNight: true, currency: true } })
  if (!previous) throw new Error('Accommodation not found.')
  const formattedPrice = data.price.toFixed(2)
  await prisma.accommodation.update({ where: { id: data.id }, data: { pricePerNight: formattedPrice, currency: data.currency } })
  await createAuditLog({ userId: admin.id, action: 'UPDATE', entityType: 'Accommodation', entityId: data.id, description: `Updated nightly catalog rate for ${previous.name}`, metadata: { previousPrice: previous.pricePerNight, previousCurrency: previous.currency, newPrice: formattedPrice, currency: data.currency } })
  invalidateCache('accommodations')
  invalidateTours()
  return { success: true }
}
