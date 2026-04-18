"use client"

import { useState, useCallback } from "react"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ImageUploadProps {
    value?: string
    onChange?: (url: string) => void
    bucket?: string
    folder?: string
    className?: string
    label?: string
}

export function ImageUpload({
    value,
    onChange,
    bucket = "images",
    folder = "uploads",
    className,
    label = "Upload Image"
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(value || "")
    const [error, setError] = useState("")

    const supabase = createBrowserSupabaseClient()

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
            const fileExt = file.name.split(".").pop()
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName)

            setPreview(publicUrl)
            onChange?.(publicUrl)
        } catch (err: any) {
            setError(err.message || "Upload failed")
        } finally {
            setUploading(false)
        }
    }, [supabase, bucket, folder, onChange])

    const handleDelete = useCallback(async () => {
        if (!preview) return

        setUploading(true)
        try {
            const path = preview.split(`${bucket}/`)[1]
            if (path) {
                await supabase.storage.from(bucket).remove([path])
            }
            setPreview("")
            onChange?.("")
        } catch (err: any) {
            console.error("Delete failed:", err)
        } finally {
            setUploading(false)
        }
    }, [supabase, bucket, preview, onChange])

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="text-sm font-medium">{label}</label>
            )}

            {preview ? (
                <div className="relative rounded-lg overflow-hidden border border-border aspect-video bg-muted">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon-sm"
                            onClick={handleDelete}
                            disabled={uploading}
                            aria-label="Remove image"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    {uploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    ) : (
                        <>
                            <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground">
                                Click to upload (max 10MB)
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
                        </>
                    )}
                </label>
            )}

            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}

            {value && !preview && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                    <span className="truncate">{value}</span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setPreview(value)
                        }}
                    >
                        Show
                    </Button>
                </div>
            )}
        </div>
    )
}