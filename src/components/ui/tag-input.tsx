'use client';

import { useState, useCallback, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TagInputProps {
    value?: string[];
    onChange?: (tags: string[]) => void;
    placeholder?: string;
    label?: string;
    description?: string;
    suggestions?: string[];
    maxTags?: number;
    disabled?: boolean;
    name?: string;
}

export function TagInput({
    value = [],
    onChange,
    placeholder = 'Add tag...',
    label,
    description,
    suggestions = [],
    maxTags,
    disabled,
    name,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAdd = useCallback((tag: string) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        if (maxTags && value.length >= maxTags) return;
        if (value.includes(trimmed)) return;
        
        const newTags = [...value, trimmed];
        onChange?.(newTags);
        setInputValue('');
    }, [value, onChange, maxTags]);

    const handleRemove = useCallback((index: number) => {
        const newTags = value.filter((_, i) => i !== index);
        onChange?.(newTags);
    }, [value, onChange]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAdd(inputValue);
            setShowSuggestions(false);
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            handleRemove(value.length - 1);
        }
    };

    const filteredSuggestions = suggestions.filter(
        s => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
    );

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium">{label}</label>
            )}
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 p-3 min-h-[42px] rounded-md border border-input bg-background">
                {value.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-sm"
                    >
                        {tag}
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </span>
                ))}
                
                {!disabled && (
                    <div className="relative flex-1 min-w-[120px]">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder={value.length === 0 ? placeholder : ''}
                            className="w-full bg-transparent border-0 outline-none text-sm p-0"
                        />
                        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 mt-1 z-10 w-full max-h-32 overflow-auto rounded-md border bg-background shadow-lg">
                                {filteredSuggestions.slice(0, 5).map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleAdd(s)}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {maxTags && (
                <p className="text-xs text-muted-foreground">
                    {value.length} / {maxTags} tags
                </p>
            )}
            
            {name && (
                <input type="hidden" name={name} value={JSON.stringify(value)} />
            )}
        </div>
    );
}