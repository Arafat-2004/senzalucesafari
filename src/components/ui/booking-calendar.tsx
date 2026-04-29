"use client"

import * as React from "react"
import { format, isSameDay, addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Lightbulb } from "lucide-react"

interface BookingCalendarProps {
    className?: string
    onDateSelect?: (dates: { from: Date | undefined; to: Date | undefined }) => void
    bookedDates?: Date[]
    limitedDates?: Date[]
}

export function BookingCalendar({
    className,
    onDateSelect,
    bookedDates = [],
    limitedDates: _limitedDates = [], // eslint-disable-line @typescript-eslint/no-unused-vars -- part of component API, reserved for future use
}: BookingCalendarProps) {
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [dateRange, setDateRange] = React.useState<{
        from: Date | undefined
        to: Date | undefined
    }>({
        from: undefined,
        to: undefined,
    })
    const [selectingRange, setSelectingRange] = React.useState(false)

    const handleDayClick = (day: Date) => {
        if (!dateRange.from || (dateRange.from && dateRange.to)) {
            // Start new range
            setDateRange({ from: day, to: undefined })
            setSelectingRange(true)
        } else if (selectingRange) {
            if (day < dateRange.from!) {
                setDateRange({ from: day, to: dateRange.from })
            } else {
                setDateRange({ from: dateRange.from, to: day })
            }
            setSelectingRange(false)
            onDateSelect?.({ from: dateRange.from, to: day })
        }
    }

    const isDateBooked = (day: Date) => {
        return bookedDates.some((bookedDate) => isSameDay(day, bookedDate))
    }

    // Generate sample booked and limited dates (for demo purposes)
    const today = new Date()
    const sampleBookedDates = [
        addDays(today, 5),
        addDays(today, 6),
        addDays(today, 7),
        addDays(today, 15),
        addDays(today, 16),
    ]

    const sampleLimitedDates = [
        addDays(today, 10),
        addDays(today, 11),
        addDays(today, 20),
    ]

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Select Your Safari Dates</span>
                    <div className="flex gap-2 text-xs">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Available
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Limited
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Booked
                        </Badge>
                    </div>
                </CardTitle>
                <CardDescription>
                    Click to select your check-in and check-out dates
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    onDayClick={handleDayClick}
                    className="rounded-md border"
                    disabled={(date) => {
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
                        const isBooked = isDateBooked(date)
                        return isPast || isBooked
                    }}
                    modifiers={{
                        booked: sampleBookedDates,
                        limited: sampleLimitedDates,
                        range: dateRange.from && dateRange.to ?
                            { from: dateRange.from, to: dateRange.to } : undefined,
                    }}
                    modifiersClassNames={{
                        booked: "line-through opacity-50 cursor-not-allowed",
                        limited: "border-2 border-orange-500",
                    }}
                />

                {dateRange.from && dateRange.to && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium">
                            Selected Dates:
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {format(dateRange.from, "MMM dd, yyyy")} → {format(dateRange.to, "MMM dd, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Duration: {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nights
                        </p>
                    </div>
                )}

                <div className="mt-4 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Tip: Click once for check-in, then click again for check-out</p>
                </div>
            </CardContent>
        </Card>
    )
}
