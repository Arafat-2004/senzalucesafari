'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateTeam } from '@/lib/reliability/cache-manager'
import { z } from 'zod'

const teamMemberSchema = z.object({
    name: z.string().trim().min(2, 'Name is required.').max(120),
    role: z.string().trim().min(2, 'Role / job title is required.').max(160),
    bio: z.string().trim().max(1000).optional(),
    imageUrl: z.string().trim().optional(),
    displayOrder: z.coerce.number().int().min(0).max(999).default(0),
    isVisible: z.boolean().default(true),
    linkedinUrl: z.string().trim().max(500).optional(),
    email: z.string().trim().email('Enter a valid email.').max(254).optional().or(z.literal('')),
})

function extractData(f: FormData) {
    const parsed = teamMemberSchema.parse({
        name: f.get('name'),
        role: f.get('role'),
        bio: f.get('bio') ?? '',
        imageUrl: f.get('imageUrl') ?? '',
        displayOrder: f.get('displayOrder') ?? 0,
        isVisible: f.get('isVisible') === 'on',
        linkedinUrl: f.get('linkedinUrl') ?? '',
        email: f.get('email') ?? '',
    })
    return {
        ...parsed,
        bio: parsed.bio || null,
        imageUrl: parsed.imageUrl || null,
        linkedinUrl: parsed.linkedinUrl || null,
        email: parsed.email || null,
    }
}

export async function createTeamMember(formData: FormData) {
    const admin = await requireAdmin('settings', 'CREATE')
    try {
        const data = extractData(formData)
        const member = await prisma.teamMember.create({ data })
        logCmsAction('team_member', 'create', { entityId: member.id, newValue: data, userId: admin.id })
        invalidateTeam()
        return { id: member.id }
    } catch (error) {
        throw new Error(`Failed to create team member: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateTeamMember(id: string, formData: FormData) {
    const admin = await requireAdmin('settings', 'EDIT')
    try {
        const data = extractData(formData)
        const existing = await prisma.teamMember.findUnique({ where: { id } })
        if (!existing) throw new Error('Team member not found.')
        await prisma.teamMember.update({ where: { id }, data })
        logCmsAction('team_member', 'update', { entityId: id, previousValue: existing, newValue: data, userId: admin.id })
        invalidateTeam()
        return { id }
    } catch (error) {
        throw new Error(`Failed to update team member: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function setTeamMemberVisibility(id: string, isVisible: boolean) {
    const admin = await requireAdmin('settings', 'EDIT')
    const existing = await prisma.teamMember.findUnique({ where: { id } })
    if (!existing) throw new Error('Team member not found.')
    await prisma.teamMember.update({ where: { id }, data: { isVisible } })
    logCmsAction('team_member', 'update', { entityId: id, previousValue: existing, newValue: { isVisible }, userId: admin.id })
    invalidateTeam()
}

export async function deleteTeamMember(id: string) {
    const admin = await requireAdmin('settings', 'DELETE')
    try {
        const existing = await prisma.teamMember.findUnique({ where: { id } })
        if (!existing) throw new Error('Team member not found.')
        await prisma.teamMember.delete({ where: { id } })
        logCmsAction('team_member', 'delete', { entityId: id, previousValue: existing, userId: admin.id })
        invalidateTeam()
    } catch (error) {
        throw new Error(`Failed to delete team member: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
