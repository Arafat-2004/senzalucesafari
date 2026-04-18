"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
    // Placeholder for future i18n implementation
    return (
        <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            aria-label="Switch language"
        >
            <Globe className="h-5 w-5" />
        </Button>
    )
}
