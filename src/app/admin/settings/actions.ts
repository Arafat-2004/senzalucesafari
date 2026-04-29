'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateSettings, invalidateCache } from '@/lib/reliability/cache-manager'

const SETTINGS_CATEGORIES = {
    general: [
        'company_name', 'company_tagline', 'company_description', 
        'company_email', 'company_phone', 'company_address',
        'logo_light', 'logo_dark', 'favicon', 'og_image'
    ],
    website: [
        'seo_default_title', 'seo_default_description', 'seo_keywords',
        'social_facebook', 'social_instagram', 'social_twitter', 'social_youtube', 'social_whatsapp',
        'footer_copyright', 'footer_links'
    ],
    booking: [
        'booking_min_advance_days', 'booking_max_advance_days', 
        'booking_min_travelers', 'booking_max_travelers',
        'cancellation_policy', 'payment_currency', 'payment_deposit_percent'
    ],
    notifications: [
        'notify_booking', 'notify_enquiry', 'notify_review', 'notify_newsletter', 'notify_email'
    ],
    security: [
        'security_session_timeout', 'security_max_attempts', 
        'security_2fa', 'security_password_expiry'
    ],
    system: [
        'system_maintenance', 'system_maintenance_message'
    ]
}

export async function saveAllSettings(formData: FormData) {
    const admin = await requireAdmin()
    
    const errors: string[] = []
    let updatedCount = 0
    
    for (const [key, value] of formData.entries()) {
        if (key === 'tab' || key === 'action') continue
        
        // Handle checkboxes - unchecked boxes won't be in formData
        const stringValue = value === 'on' ? 'true' : (value as string || '')
        
        if (!stringValue) continue
        
        try {
            await prisma.siteSettings.upsert({
                where: { key },
                create: { key, value: stringValue },
                update: { value: stringValue }
            })
            updatedCount++
        } catch (error) {
            errors.push(`Failed to save ${key}`)
        }
    }
    
    if (updatedCount > 0) {
        logCmsAction('settings', 'update', { 
            entityId: 'bulk', 
            newValue: { updatedKeysCount: updatedCount }, 
            userId: admin.id 
        })
        invalidateSettings()
    }
    
    if (errors.length > 0) {
        throw new Error(`Some settings failed: ${errors.join(', ')}`)
    }
    
    return { success: true, message: 'Settings saved successfully' }
}

export async function getSettingsByCategory(category: string) {
    await requireAdmin()
    
    const keys = SETTINGS_CATEGORIES[category as keyof typeof SETTINGS_CATEGORIES] || []
    
    if (keys.length === 0) {
        return {}
    }
    
    const settings = await prisma.siteSettings.findMany({
        where: { key: { in: keys } }
    })
    
    // Convert to key-value object
    return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
    }, {} as Record<string, string>)
}

export async function getAllSettings() {
    const settings = await prisma.siteSettings.findMany()
    
    return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
    }, {} as Record<string, string>)
}

export async function upsertSetting(formData: FormData) {
    const admin = await requireAdmin()
    const key = formData.get('key') as string
    const value = formData.get('value') as string
    const description = (formData.get('description') as string) || null

    try {
        const existing = await prisma.siteSettings.findUnique({ where: { key } })
        
        await prisma.siteSettings.upsert({
            where: { key },
            create: { key, value, description },
            update: { value, description },
        })
        
        logCmsAction('settings', existing ? 'update' : 'create', { 
            entityId: key, 
            previousValue: existing || undefined, 
            newValue: { key, value, description }, 
            userId: admin.id 
        })
        invalidateSettings()
    } catch (error) {
        throw new Error(`Failed to save setting: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateSetting(id: string, formData: FormData) {
    const admin = await requireAdmin()
    try {
        const data = {
            key: formData.get('key') as string,
            value: formData.get('value') as string,
            description: (formData.get('description') as string) || null,
        }
        
        const existing = await prisma.siteSettings.findUnique({ where: { id } })
        
        await prisma.siteSettings.update({
            where: { id },
            data,
        })
        
        if (existing) {
            logCmsAction('settings', 'update', { entityId: id, previousValue: existing, newValue: data, userId: admin.id })
        }
        invalidateSettings()
    } catch (error) {
        throw new Error(`Failed to update setting: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteSetting(id: string) {
    const admin = await requireAdmin()
    try {
        await prisma.siteSettings.delete({ where: { id } })
        
        logCmsAction('settings', 'delete', { entityId: id, userId: admin.id })
        invalidateSettings()
    } catch (error) {
        throw new Error(`Failed to delete setting: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}