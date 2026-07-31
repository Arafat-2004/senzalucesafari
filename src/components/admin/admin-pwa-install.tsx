'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

interface InstallPrompt extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function AdminPwaInstall() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null)

  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault()
      setPrompt(event as InstallPrompt)
    }
    const installed = () => setPrompt(null)
    window.addEventListener('beforeinstallprompt', capture)
    window.addEventListener('appinstalled', installed)
    return () => {
      window.removeEventListener('beforeinstallprompt', capture)
      window.removeEventListener('appinstalled', installed)
    }
  }, [])

  if (!prompt) return null
  return (
    <button
      onClick={async () => { await prompt.prompt(); await prompt.userChoice; setPrompt(null) }}
      title="Install Admin App"
      aria-label="Install Admin App"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Download className="h-4 w-4" />
    </button>
  )
}
