'use client';

import { useState, useCallback, useRef } from 'react';
import Image from "next/image";
import { 
    Upload, 
    X, 
    Image as ImageIcon, 
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2,
    GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GalleryImage {
    url: string;
    alt?: string;
}

interface GalleryManagerProps {
    value?: string[];
    onChange?: (images: string[]) => void;
    maxImages?: number;
    label?: string;
    description?: string;
    folder?: string;
    name?: string;
}

export function GalleryManager({
    value = [],
    onChange,
    maxImages = 10,
    label = 'Gallery Images',
    description,
    folder = 'gallery',
    name,
}: GalleryManagerProps) {
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addImages = useCallback((urls: string[]) => {
        const remaining = maxImages - value.length;
        const newImages = urls.slice(0, remaining);
        onChange?.([...value, ...newImages]);
    }, [value, onChange, maxImages]);

    const removeImage = useCallback((index: number) => {
        const newImages = value.filter((_, i) => i !== index);
        onChange?.(newImages);
    }, [value, onChange]);

    const reorderImage = useCallback((fromIndex: number, toIndex: number) => {
        const newImages = [...value];
        const [moved] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, moved);
        onChange?.(newImages);
    }, [value, onChange]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        
        // For demo, just use filenames as URLs
        const urls = Array.from(files).map(f => `/images/${folder}/${f.name}`);
        addImages(urls);
        
        // Reset input
        e.target.value = '';
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            addImages([urlInput.trim()]);
            setUrlInput('');
            setShowUrlInput(false);
        }
    };

    const nextPreview = () => {
        if (previewIndex === null) return;
        setPreviewIndex((previewIndex + 1) % value.length);
    };

    const prevPreview = () => {
        if (previewIndex === null) return;
        setPreviewIndex(previewIndex === 0 ? value.length - 1 : previewIndex - 1);
    };

    return (
        <div className="space-y-3">
            {label && (
                <div>
                    <Label className="text-sm font-medium">{label}</Label>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
            )}

            {/* Current Images Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {value.map((url, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-lg border overflow-hidden group"
                        >
                            <Image
                                src={url}
                                alt={`Image ${index + 1}`}
                                fill
                                unoptimized
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setPreviewIndex(index)}
                                >
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => removeImage(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            {index === 0 && (
                                <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                                    Cover
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Buttons */}
            {value.length < maxImages && (
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add URL
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </div>
            )}

            {/* URL Input */}
            {showUrlInput && (
                <div className="flex gap-2">
                    <Input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    />
                    <Button type="button" onClick={handleUrlSubmit} size="sm">
                        Add
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowUrlInput(false)}
                    >
                        Cancel
                    </Button>
                </div>
            )}

            {/* Count */}
            <p className="text-xs text-muted-foreground">
                {value.length} / {maxImages} images
            </p>

            {/* Preview Modal */}
            {previewIndex !== null && value[previewIndex] && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 text-white"
                        onClick={prevPreview}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <div className="relative max-h-[80vh] max-w-[90vw] w-[80vw] h-[80vh]">
                        <Image
                            src={value[previewIndex]}
                            alt={`Preview ${previewIndex + 1}`}
                            fill
                            unoptimized
                            className="object-contain"
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 text-white"
                        onClick={nextPreview}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white"
                        onClick={() => setPreviewIndex(null)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                        {previewIndex + 1} / {value.length}
                    </div>
                </div>
            )}

            {name && (
                <input type="hidden" name={name} value={JSON.stringify(value)} />
            )}
        </div>
    );
}