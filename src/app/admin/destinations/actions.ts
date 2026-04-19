'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

function safeJsonParse(val: string, fallback: unknown = []) {
    try { return JSON.parse(val) } catch { return fallback }
}

function extractData(f: FormData) {
    const bigFiveStr = f.get('bigFive') as string
    const keySpeciesStr = f.get('keySpecies') as string
    const uniqueSpeciesStr = f.get('uniqueSpecies') as string
    const highlightsStr = f.get('highlights') as string
    const ecosystemsStr = f.get('ecosystems') as string
    const bestTimeToGoStr = f.get('bestTimeToGo') as string
    const galleryImagesStr = f.get('galleryImages') as string

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
        bigFive: safeJsonParse(bigFiveStr, []),
        keySpecies: safeJsonParse(keySpeciesStr, []),
        uniqueSpecies: safeJsonParse(uniqueSpeciesStr, []),
        wildlifeRating: parseInt(f.get('wildlifeRating') as string) || 0,
        bestTimeToGo: safeJsonParse(bestTimeToGoStr, []),
        peakSeason: (f.get('peakSeason') as string) || null,
        lowSeason: (f.get('lowSeason') as string) || null,
        highlights: safeJsonParse(highlightsStr, []),
        landscape: (f.get('landscape') as string) || null,
        ecosystems: safeJsonParse(ecosystemsStr, []),
        conservation: (f.get('conservation') as string) || null,
        communityInitiatives: (f.get('communityInitiatives') as string) || null,
        culturalContext: (f.get('culturalContext') as string) || null,
        imageUrl: f.get('imageUrl') as string,
        galleryImages: safeJsonParse(galleryImagesStr, []),
        metaTitle: (f.get('metaTitle') as string) || null,
        metaDescription: (f.get('metaDescription') as string) || null,
        isActive: f.get('isActive') === 'on',
        birdWatching: f.get('birdWatching') === 'on',
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