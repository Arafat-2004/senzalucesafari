'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'

const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 3 months', days: 90 },
    { label: 'Last 12 months', days: 365 },
    { label: 'All time', days: null },
]

export function DashboardDateRangePicker() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<DateRange | undefined>(() => {
        const from = searchParams.get('startDate')
        const to = searchParams.get('endDate')
        return {
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
        }
    })

    const currentPreset = presets.find(p => {
        if (p.days === null) {
            return !searchParams.has('startDate') && !searchParams.has('endDate')
        }
        const from = searchParams.get('startDate')
        if (!from) return false
        const fromDate = new Date(from)
        const expectedFrom = new Date()
        expectedFrom.setDate(expectedFrom.getDate() - p.days)
        return Math.abs(fromDate.getTime() - expectedFrom.getTime()) < 86400000
    })

    const handlePresetClick = (days: number | null) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (days === null) {
            params.delete('startDate')
            params.delete('endDate')
        } else {
            const to = new Date()
            const from = new Date()
            from.setDate(from.getDate() - days)
            params.set('startDate', from.toISOString().split('T')[0])
            params.set('endDate', to.toISOString().split('T')[0])
        }

        startTransition(() => {
            router.push(`/admin?${params.toString()}`)
        })
        setOpen(false)
    }

    const handleDateSelect = (selectedDate: DateRange | undefined) => {
        if (!selectedDate?.from || !selectedDate?.to) {
            setDate(selectedDate || undefined)
            return
        }

        setDate(selectedDate)
        const params = new URLSearchParams(searchParams.toString())
        params.set('startDate', selectedDate.from.toISOString().split('T')[0])
        params.set('endDate', selectedDate.to.toISOString().split('T')[0])

        startTransition(() => {
            router.push(`/admin?${params.toString()}`)
        })
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-[280px] justify-start text-left font-normal text-foreground"
                    disabled={isPending}
                >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {date.from.toLocaleDateString()} - {date.to.toLocaleDateString()}
                            </>
                        ) : (
                            date.from.toLocaleDateString()
                        )
                    ) : (
                        <span className="text-foreground">Pick a date range</span>
                    )}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Quick presets</p>
                        <div className="flex flex-wrap gap-2">
                            {presets.map((preset) => (
                                <Button
                                    key={preset.label}
                                    variant={currentPreset?.label === preset.label ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handlePresetClick(preset.days)}
                                    disabled={isPending}
                                    className="text-xs"
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Custom range</p>
                        <CalendarComponent
                            mode="range"
                            selected={date}
                            onSelect={handleDateSelect}
                            numberOfMonths={2}
                            disabled={(date) => date > new Date()}
                            className="rounded-md border"
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
