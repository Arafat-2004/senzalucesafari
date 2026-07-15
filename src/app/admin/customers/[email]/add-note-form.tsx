'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/reliability/logger'
import { Save, Loader2 } from 'lucide-react'

export function AddNoteForm({ email }: { email: string }) {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!content.trim()) return

        setLoading(true)
        try {
            const res = await fetch('/api/admin/customers/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, content })
            })
            if (res.ok) {
                setContent('')
                router.refresh()
            }
        } catch (error) {
            logger.error('Failed to add note', { error: error instanceof Error ? error.message : String(error) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                placeholder="Add a note about this customer..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
            />
            <Button type="submit" disabled={loading || !content.trim()} className="min-h-[44px]">
                {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</>
                ) : (
                    <><Save className="h-4 w-4 mr-2" /> Save Note</>
                )}
            </Button>
        </form>
    )
}
