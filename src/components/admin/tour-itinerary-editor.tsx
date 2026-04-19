'use client';

import { useState, useCallback } from 'react';
import { 
    Plus, 
    Trash2, 
    ChevronDown, 
    ChevronRight, 
    Copy,
    GripVertical,
    Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/ui/image-upload';

interface ItineraryDay {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation: string;
    imageUrl?: string;
}

interface ItineraryEditorProps {
    value?: ItineraryDay[];
    onChange?: (days: ItineraryDay[]) => void;
    name?: string;
}

const mealOptions = ['Breakfast', 'Lunch', 'Dinner'];

const activityOptions = [
    'Morning game drive',
    'Afternoon game drive',
    'Morning walk',
    'Bush breakfast',
    'Bush lunch',
    'Evening game drive',
    'Night drive',
    'Visit village',
    'Cultural visit',
    'Bird watching',
    'Hot air balloon',
    'Horse riding',
    'Canoeing',
    'Fishing',
];

export function ItineraryEditor({ value = [], onChange, name }: ItineraryEditorProps) {
    const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set(value.map((_, i) => i)));

    const addDay = useCallback(() => {
        const newDay: ItineraryDay = {
            day: value.length + 1,
            title: `Day ${value.length + 1}`,
            description: '',
            activities: [],
            meals: [],
            accommodation: '',
        };
        const newDays = [...value, newDay];
        onChange?.(newDays);
        setExpandedDays(new Set([...expandedDays, value.length]));
    }, [value, onChange, expandedDays]);

    const removeDay = useCallback((index: number) => {
        const newDays = value.filter((_, i) => i !== index).map((d, i) => ({
            ...d,
            day: i + 1,
        }));
        onChange?.(newDays);
    }, [value, onChange]);

    const updateDay = useCallback((index: number, updates: Partial<ItineraryDay>) => {
        const newDays = value.map((d, i) => i === index ? { ...d, ...updates } : d);
        onChange?.(newDays);
    }, [value, onChange]);

    const duplicateDay = useCallback((index: number) => {
        const dayToDuplicate = { ...value[index] };
        dayToDuplicate.day = value.length + 1;
        const newDays = [...value, dayToDuplicate];
        onChange?.(newDays);
        setExpandedDays(new Set([...expandedDays, value.length]));
    }, [value, onChange, expandedDays]);

    const toggleExpand = useCallback((index: number) => {
        const newExpanded = new Set(expandedDays);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedDays(newExpanded);
    }, [expandedDays]);

    const toggleMeal = useCallback((dayIndex: number, meal: string) => {
        const day = value[dayIndex];
        const meals = (day.meals || []).includes(meal)
            ? (day.meals || []).filter(m => m !== meal)
            : [...(day.meals || []), meal];
        updateDay(dayIndex, { meals });
    }, [value, updateDay]);

    const toggleActivity = useCallback((dayIndex: number, activity: string) => {
        const day = value[dayIndex];
        const activities = (day.activities || []).includes(activity)
            ? (day.activities || []).filter(a => a !== activity)
            : [...(day.activities || []), activity];
        updateDay(dayIndex, { activities });
    }, [value, updateDay]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">Itinerary</h3>
                    <p className="text-sm text-muted-foreground">
                        Add, remove, or reorder days
                    </p>
                </div>
                <Button type="button" onClick={addDay} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Day
                </Button>
            </div>

            {value.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">
                        No itinerary days yet
                    </p>
                    <Button type="button" onClick={addDay} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Day
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {value.map((day, index) => (
                        <div
                            key={index}
                            className="border rounded-lg bg-background"
                        >
                            <div 
                                className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50"
                                onClick={() => toggleExpand(index)}
                            >
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                {expandedDays.has(index) ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                                <span className="font-medium min-w-[60px]">
                                    Day {day.day}
                                </span>
                                <span className="flex-1 truncate text-sm">
                                    {day.title || 'Untitled day'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            duplicateDay(index);
                                        }}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-red-500 hover:text-red-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeDay(index);
                                        }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {expandedDays.has(index) && (
                                <div className="p-4 pt-0 space-y-4 border-t">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-2">
                                            <Label>Day Title</Label>
                                            <Input
                                                value={day.title}
                                                onChange={(e) => updateDay(index, { title: e.target.value })}
                                                placeholder="e.g., Arrival & Transfer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Accommodation</Label>
                                            <Input
                                                value={day.accommodation}
                                                onChange={(e) => updateDay(index, { accommodation: e.target.value })}
                                                placeholder="e.g., Tanzania Safari Lodge"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={day.description}
                                            onChange={(e) => updateDay(index, { description: e.target.value })}
                                            placeholder="Describe the day's activities and experience..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Meals Included</Label>
                                        <div className="flex flex-wrap gap-3">
                                            {mealOptions.map((meal) => (
                                                <label
                                                    key={meal}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Checkbox
                                                        checked={(day.meals || []).includes(meal)}
                                                        onCheckedChange={() => toggleMeal(index, meal)}
                                                    />
                                                    <span className="text-sm">{meal}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Activities</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {activityOptions.map((activity) => (
                                                <button
                                                    key={activity}
                                                    type="button"
                                                    onClick={() => toggleActivity(index, activity)}
                                                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                                                        (day.activities || []).includes(activity)
                                                            ? 'bg-primary text-primary-foreground border-primary'
                                                            : 'bg-background hover:bg-muted'
                                                    }`}
                                                >
                                                    {activity}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Day Image (optional)</Label>
                                        <ImageUpload
                                            value={day.imageUrl || ''}
                                            onChange={(url) => updateDay(index, { imageUrl: url })}
                                            folder="itinerary"
                                            label=""
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {name && (
                <input 
                    type="hidden" 
                    name={name} 
                    value={JSON.stringify(value)} 
                />
            )}
        </div>
    );
}