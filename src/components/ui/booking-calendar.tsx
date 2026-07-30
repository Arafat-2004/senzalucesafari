"use client"

import * as React from "react"
import { format, isSameDay, addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Lightbulb } from "lucide-react"
import { DateRange } from "react-day-picker"

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
    limitedDates: _limitedDates = [],
}: BookingCalendarProps) {
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })
    const [selectingRange, setSelectingRange] = React.useState(false)

    const handleDayClick = (day: Date) => {
        if (!dateRange || !dateRange.from || (dateRange.from && dateRange.to)) {
            // Start new range
            setDateRange({ from: day, to: undefined })
            setSelectingRange(true)
        } else if (selectingRange) {
            if (day < dateRange.from) {
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

    const from = dateRange?.from;
    const to = dateRange?.to;

    return (
        <Card className={cn("w-full min-w-0 overflow-hidden", className)}>
            <CardHeader className="p-3 sm:p-6 pb-2">
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base">
                    <span>Select Your Safari Dates</span>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-status-success"></span>
                            Available
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-status-warning"></span>
                            Limited
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-status-error"></span>
                            Booked
                        </Badge>
                    </div>
                </CardTitle>
                <CardDescription>
                    {sampleLimitedDates.length > 0 && "Prices may vary on limited availability days."}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
                {/* Explicit check-in / check-out status banner */}
                <div className="flex flex-col gap-2 p-3 bg-muted/40 rounded-xl mb-4 border border-border/50">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">Check-In:</span>
                            {from ? (
                                <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold border border-primary/25 text-xs">
                                    {format(from, "MMM dd, yyyy")}
                                </span>
                            ) : (
                                <span className="text-muted-foreground italic text-xs">Select starting date</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">Check-Out:</span>
                            {to ? (
                                <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold border border-primary/25 text-xs">
                                    {format(to, "MMM dd, yyyy")}
                                </span>
                            ) : (
                                <span className="text-muted-foreground italic text-xs">
                                    {from ? "Select ending date" : "Waiting..."}
                                </span>
                            )}
                        </div>
                    </div>
                    {from && (
                        <button
                            type="button"
                            onClick={() => {
                                setDateRange({ from: undefined, to: undefined });
                                setDate(undefined);
                                onDateSelect?.({ from: undefined, to: undefined });
                            }}
                            className="text-xs font-semibold text-destructive hover:underline text-right w-fit ml-auto mt-1"
                        >
                            Reset Dates
                        </button>
                    )}
                </div>

                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                        if (range) {
                            setDateRange(range);
                            if (range.from && range.to) {
                                onDateSelect?.({ from: range.from, to: range.to });
                            }
                        }
                    }}
                    onDayClick={handleDayClick}
                    className="w-full rounded-md border mx-auto"
                    disabled={(date) => {
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
                        const isBooked = isDateBooked(date)
                        return isPast || isBooked
                    }}
                    modifiers={{
                        booked: sampleBookedDates,
                        limited: sampleLimitedDates,
                    }}
                    modifiersClassNames={{
                        booked: "line-through opacity-50 cursor-not-allowed",
                        limited: "border-2 border-status-warning",
                    }}
                />

                {dateRange?.from && dateRange?.to && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
                        <p className="text-xs font-semibold text-foreground">
                            Duration:
                        </p>
                        <p className="text-sm font-bold text-primary mt-0.5">
                            {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} Days
                        </p>
                    </div>
                )}

                <div className="mt-4 text-xs text-muted-foreground">
                    <p className="flex items-start gap-1.5 leading-relaxed">
                        <Lightbulb className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>Tip: Click once for check-in, then click again for check-out.</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
