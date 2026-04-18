import { prisma } from '@/lib/prisma'
import SettingsClient from './settings-client'

export default async function SettingsPage() {
    const settings = await prisma.siteSettings.findMany({ orderBy: { key: 'asc' } })
    return <SettingsClient data={settings} />
}
