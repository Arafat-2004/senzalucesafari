'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

function splitLines(val: string | null): string[] {
    return (val ?? '').split('\n').map(s => s.trim()).filter(Boolean)
}

function extractData(f: FormData) {
    return {
        name: f.get('name') as string,
        slug: f.get('slug') as string,
        region: f.get('region') as string,
        shortDescription: f.get('shortDescription') as string,
        whyVisit: f.get('whyVisit') as string,
        fullDescription: f.get('fullDescription') as string,
        parkSize: (f.get('parkSize') as string) || null,
        elevation: (f.get('elevation') as string) || null,
        established: (f.get('established') as string) || null,
        nearestAirport: (f.get('nearestAirport') as string) || null,
        distanceFromArusha: (f.get('distanceFromArusha') as string) || null,
        recommendedStay: (f.get('recommendedStay') as string) || null,
        bigFive: splitLines(f.get('bigFive') as string),
        keySpecies: splitLines(f.get('keySpecies') as string),
        birdWatching: f.get('birdWatching') === 'on',
        uniqueSpecies: splitLines(f.get('uniqueSpecies') as string),
        wildlifeRating: parseInt(f.get('wildlifeRating') as string) || 0,
        bestTimeToGo: splitLines(f.get('bestTimeToGo') as string),
        peakSeason: (f.get('peakSeason') as string) || null,
        lowSeason: (f.get('lowSeason') as string) || null,
        highlights: splitLines(f.get('highlights') as string),
        landscape: (f.get('landscape') as string) || null,
        ecosystems: splitLines(f.get('ecosystems') as string),
        conservation: (f.get('conservation') as string) || null,
        communityInitiatives: (f.get('communityInitiatives') as string) || null,
        culturalContext: (f.get('culturalContext') as string) || null,
        imageUrl: f.get('imageUrl') as string,
        galleryImages: splitLines(f.get('galleryImages') as string),
        metaTitle: (f.get('metaTitle') as string) || null,
        metaDescription: (f.get('metaDescription') as string) || null,
        isActive: f.get('isActive') === 'on',
        displayOrder: parseInt(f.get('displayOrder') as string) || 0,
    }
}

export async function createDestination(formData: FormData) {
    await requireAdmin()
    try {
        await prisma.destination.create({ data: extractData(formData) })
    } catch (error) {
        throw new Error(`Failed to create destination: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/destinations')
    redirect('/admin/destinations')
}

export async function updateDestination(id: string, formData: FormData) {
    await requireAdmin()
    try {
        await prisma.destination.update({ where: { id }, data: extractData(formData) })
    } catch (error) {
        throw new Error(`Failed to update destination: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/destinations')
    redirect('/admin/destinations')
}

export async function deleteDestination(id: string) {
    await requireAdmin()
    try {
        await prisma.destination.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete destination: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/destinations')
}
