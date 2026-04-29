"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { uploadMedia, validateImageFile, ALLOWED_EXTENSIONS } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ImageUploaderProps {
    value?: string;
    onChange?: (url: string) => void;
    placeholder?: string;
    accept?: string;
    maxSize?: number;
}

export function ImageUploader({
    value,
    onChange,
    placeholder = "Drop images here or click to upload",
    accept = "image/*",
    maxSize = 10,
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleUpload(files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleUpload(files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        setError(null);
        setUploading(true);

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            const result = await uploadMedia(file, {}, { compress: true, maxRetries: 3 });

            if (onChange) {
                onChange(result.publicUrl);
            }
            toast({ title: "Image uploaded successfully" });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Upload failed";
            setError(message);
            setPreview(null);
            toast({ title: "Upload failed", description: message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        if (onChange) {
            onChange("");
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <Input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
            />

            {preview ? (
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        cursor-pointer border-2 border-dashed rounded-lg p-8 text-center
                        transition-colors max-w-md
                        ${isDragging
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }
                    `}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span>Uploading...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                            <AlertCircle className="h-8 w-8" />
                            <p className="text-sm">{error}</p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setError(null);
                                }}
                                className="text-xs underline"
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        <>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {placeholder}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {ALLOWED_EXTENSIONS.join(", ")} • Max {maxSize}MB
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

interface ImageGalleryProps {
    images: string[];
    onChange?: (images: string[]) => void;
    maxImages?: number;
}

export function ImageGallery({
    images = [],
    onChange,
    maxImages = 10,
}: ImageGalleryProps) {
    const [uploading, setUploading] = useState(false);

    const handleAdd = async (url: string) => {
        if (images.length >= maxImages) {
            toast({ title: `Maximum ${maxImages} images allowed`, variant: "destructive" });
            return;
        }
        if (onChange) {
            onChange([...images, url]);
        }
    };

    const handleRemove = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        if (onChange) {
            onChange(newImages);
        }
    };

    const handleReorder = (fromIndex: number, toIndex: number) => {
        const newImages = [...images];
        const [moved] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, moved);
        if (onChange) {
            onChange(newImages);
        }
    };

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {images.map((url, index) => (
                    <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border"
                    >
                        <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => handleReorder(index, Math.max(0, index - 1))}
                                disabled={index === 0}
                            >
                                ←
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemove(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => handleReorder(index, Math.min(images.length - 1, index + 1))}
                                disabled={index === images.length - 1}
                            >
                                →
                            </Button>
                        </div>
                        {index === 0 && (
                            <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                                Cover
                            </span>
                        )}
                    </div>
                ))}

                {images.length < maxImages && (
                    <ImageUploader
                        onChange={handleAdd}
                        placeholder="Add image"
                    />
                )}
            </div>
            <p className="text-xs text-muted-foreground">
                {images.length} / {maxImages} images
            </p>
        </div>
    );
}