"use client"

import { useState, useCallback } from "react"
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon, Check, FileImage } from "lucide-react"
import { uploadMedia, deleteMedia, type MediaServiceConfig } from "@/lib/media"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { toast } from "sonner"
import { logger } from "@/lib/reliability/logger"

interface ImageUploadProps {
    value?: string
    onChange?: (url: string) => void
    bucket?: string
    folder?: string
    className?: string
    label?: string
    config?: Partial<MediaServiceConfig>
}

export function ImageUpload({
    value,
    onChange,
    bucket = "images",
    folder = "uploads",
    className,
    label = "Upload Image",
    config
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(value || "")
    const [error, setError] = useState("")
    const [mode, setMode] = useState<"file" | "url">("file")
    const [urlInput, setUrlInput] = useState("")

    const handleUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file")
            return
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("Image must be less than 10MB")
            return
        }

        setUploading(true)
        setError("")

        try {
            const result = await uploadMedia(file, {
                ...config,
                supabase: { bucket, folder }
            })

            setPreview(result.publicUrl)
            onChange?.(result.publicUrl)
            toast.success("Image uploaded successfully")
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Upload failed"
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setUploading(false)
        }
    }, [bucket, folder, onChange, config])

    const handleUrlSubmit = useCallback(() => {
        const trimmed = urlInput.trim()
        if (!trimmed) {
            setError("Please enter a valid image URL")
            return
        }
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("data:")) {
            setError("Image URL must start with http:// or https://")
            return
        }

        setError("")
        setPreview(trimmed)
        onChange?.(trimmed)
        setUrlInput("")
        toast.success("Image URL applied successfully")
    }, [urlInput, onChange])

    const handleDelete = useCallback(async () => {
        if (!preview) return

        setUploading(true)
        try {
            if (preview.includes("supabase.co") || preview.includes("cloudinary.com")) {
                await deleteMedia(preview, { supabase: { bucket } }).catch(() => {})
            }
            setPreview("")
            onChange?.("")
            toast.success("Image removed")
        } catch (err) {
            logger.error("Delete failed", { error: err instanceof Error ? err.message : String(err) })
            setPreview("")
            onChange?.("")
        } finally {
            setUploading(false)
        }
    }, [preview, onChange, bucket])

    return (
        <div className={cn("space-y-3", className)}>
            {label && (
                <label className="block text-sm font-medium text-foreground">{label}</label>
            )}

            {preview ? (
                <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border border-border/60 aspect-video bg-muted shadow-xs group max-h-72">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                            onError={() => setError("Unable to load preview from URL. Please check the image link.")}
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                disabled={uploading}
                                className="h-8 px-2 text-xs"
                                aria-label="Remove image"
                            >
                                <X className="w-4 h-4 mr-1" /> Remove
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border/30">
                        <ImageIcon className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                        <span className="truncate flex-1 font-mono text-[11px]">{preview}</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Mode Toggle Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-lg w-fit border border-border/40">
                        <button
                            type="button"
                            onClick={() => { setMode("file"); setError(""); }}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
                                mode === "file" 
                                    ? "bg-card text-foreground shadow-xs border border-border/50" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <FileImage className="w-3.5 h-3.5 text-primary" />
                            Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode("url"); setError(""); }}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
                                mode === "url" 
                                    ? "bg-card text-foreground shadow-xs border border-border/50" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <LinkIcon className="w-3.5 h-3.5 text-primary" />
                            Paste Image URL
                        </button>
                    </div>

                    {mode === "file" ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all bg-card/50">
                            {uploading ? (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    <span>Processing & uploading image...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4 text-center px-4">
                                    <Upload className="w-6 h-6 text-muted-foreground mb-2 text-primary" />
                                    <span className="text-xs font-medium text-foreground mb-0.5">
                                        Click or drag image file here
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                        PNG, JPG, WebP, GIF (max 10MB)
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleUpload(file)
                                        }}
                                        disabled={uploading}
                                    />
                                </div>
                            )}
                        </label>
                    ) : (
                        <div className="space-y-2 p-3 rounded-xl border border-border/60 bg-card/60 shadow-2xs">
                            <div className="flex gap-2">
                                <Input
                                    type="url"
                                    placeholder="Paste image link e.g. https://images.unsplash.com/photo-..."
                                    value={urlInput}
                                    onChange={(e) => { setUrlInput(e.target.value); setError(""); }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleUrlSubmit();
                                        }
                                    }}
                                    className="text-xs h-9"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleUrlSubmit}
                                    disabled={!urlInput.trim()}
                                    className="h-9 px-3 shrink-0"
                                >
                                    <Check className="w-4 h-4 mr-1" /> Add URL
                                </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Paste any public image web link (Unsplash, Cloudinary, direct URL).
                            </p>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <p className="text-xs text-destructive font-medium mt-1">
                    {error}
                </p>
            )}
        </div>
    )
}