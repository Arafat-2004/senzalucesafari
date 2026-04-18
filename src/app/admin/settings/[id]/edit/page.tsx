import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SettingForm from '../../setting-form'

export default async function EditSettingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const setting = await prisma.siteSettings.findUnique({ where: { id } })
    if (!setting) notFound()
    return <SettingForm setting={setting} />
}
