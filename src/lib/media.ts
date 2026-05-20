"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { logger } from "@/lib/reliability/logger";

export type StorageProvider = "supabase" | "cloudinary";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export interface MediaUploadResult {
    url: string;
    publicUrl: string;
    provider: StorageProvider;
}

export interface MediaServiceConfig {
    provider: StorageProvider;
    supabase?: {
        bucket?: string;
        folder?: string;
    };
    cloudinary?: {
        cloudName: string;
        uploadPreset?: string;
        folder?: string;
    };
}

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

export function validateImageFile(file: File): ValidationResult {
    if (!file || file.size === 0) {
        return { valid: false, error: "No file selected" };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            valid: false,
            error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB`
        };
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
        };
    }

    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext as typeof ALLOWED_EXTENSIONS[number])) {
        return {
            valid: false,
            error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
        };
    }

    return { valid: true };
}

const DEFAULT_CONFIG: MediaServiceConfig = {
    provider: (process.env.NEXT_PUBLIC_MEDIA_PROVIDER as StorageProvider) || "supabase",
    supabase: {
        bucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "images",
        folder: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_FOLDER || "uploads",
    },
    cloudinary: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
        folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "senza-luce",
    },
};

async function compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const maxSize = 2048;
            let { width, height } = img;

            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = (height / width) * maxSize;
                    width = maxSize;
                } else {
                    width = (width / height) * maxSize;
                    height = maxSize;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
            }

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        }));
                    } else {
                        resolve(file);
                    }
                },
                file.type,
                0.85
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file);
        };

        img.src = url;
    });
}

export async function uploadToSupabase(
    file: File,
    bucket: string = DEFAULT_CONFIG.supabase!.bucket!,
    folder: string = DEFAULT_CONFIG.supabase!.folder!,
    maxRetries: number = 3
): Promise<MediaUploadResult> {
    const supabase = createBrowserSupabaseClient();
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const { error } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: "31536000",
                    upsert: false,
                });

            if (error) {
                throw new Error(`Supabase upload failed: ${error.message}`);
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            return {
                url: fileName,
                publicUrl,
                provider: "supabase",
            };
        } catch (err) {
            lastError = err as Error;

            if (attempt < maxRetries) {
                await new Promise(r => setTimeout(r, attempt * 500));
            }
        }
    }

    throw lastError || new Error("Upload failed after retries");
}

export async function uploadToCloudinary(
    file: File,
    cloudName: string = DEFAULT_CONFIG.cloudinary!.cloudName!,
    uploadPreset: string = DEFAULT_CONFIG.cloudinary!.uploadPreset!,
    folder: string = DEFAULT_CONFIG.cloudinary!.folder!,
    maxRetries: number = 3
): Promise<MediaUploadResult> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Cloudinary upload failed: ${error.error?.message || "Unknown error"}`);
            }

            const result = await response.json();

            return {
                url: result.public_id,
                publicUrl: result.secure_url,
                provider: "cloudinary",
            };
        } catch (err) {
            lastError = err as Error;

            if (attempt < maxRetries) {
                await new Promise(r => setTimeout(r, attempt * 500));
            }
        }
    }

    throw lastError || new Error("Upload failed after retries");
}

export async function uploadMedia(
    file: File,
    config: Partial<MediaServiceConfig> = {},
    options: {
        compress?: boolean;
        maxRetries?: number;
    } = {}
): Promise<MediaUploadResult> {
    const validation = validateImageFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    const processedFile = options.compress !== false
        ? await compressImage(file)
        : file;

    const maxRetries = options.maxRetries ?? 3;
    const provider = config.provider || DEFAULT_CONFIG.provider;

    if (provider === "cloudinary") {
        return uploadToCloudinary(
            processedFile,
            config.cloudinary?.cloudName || DEFAULT_CONFIG.cloudinary!.cloudName!,
            config.cloudinary?.uploadPreset || DEFAULT_CONFIG.cloudinary!.uploadPreset!,
            config.cloudinary?.folder || DEFAULT_CONFIG.cloudinary!.folder!,
            maxRetries
        );
    }

    return uploadToSupabase(
        processedFile,
        config.supabase?.bucket || DEFAULT_CONFIG.supabase!.bucket!,
        config.supabase?.folder || DEFAULT_CONFIG.supabase!.folder!,
        maxRetries
    );
}

export async function deleteMedia(
    publicUrl: string,
    config: Partial<MediaServiceConfig> = {}
): Promise<void> {
    if (!publicUrl) return;

    const provider = config.provider || DEFAULT_CONFIG.provider;

    if (provider === "supabase") {
        const supabase = createBrowserSupabaseClient();
        const bucket = config.supabase?.bucket || DEFAULT_CONFIG.supabase!.bucket!;
        const path = publicUrl.split(`${bucket}/`)[1] || publicUrl.split("/").pop();
        if (path) {
            try {
                await supabase.storage.from(bucket).remove([path]);
            } catch (err) {
                logger.warn("Failed to delete media", { error: err instanceof Error ? err.message : String(err) });
            }
        }
    }
}

export async function getOptimizedUrl(
    publicUrl: string,
    options: {
        width?: number;
        height?: number;
        quality?: "auto" | number;
        format?: "auto" | "webp" | "avif" | "jpg" | "png";
    } = {}
): Promise<string> {
    if (!publicUrl) return publicUrl;

    const provider = DEFAULT_CONFIG.provider;

    if (provider === "cloudinary") {
        const transforms: string[] = [];
        if (options.width) transforms.push(`w_${options.width}`);
        if (options.height) transforms.push(`h_${options.height}`);
        if (options.quality) transforms.push(`q_${options.quality}`);
        if (options.format) transforms.push(`f_${options.format}`);

        const transformString = transforms.length > 0 ? transforms.join(",") + "/" : "";
        return publicUrl.replace("/upload/", `/upload/${transformString}`);
    }

    if (provider === "supabase") {
        if (publicUrl.includes("supabase.co/storage/v1/object/public")) {
            const params = new URLSearchParams();
            if (options.width) params.set("width", options.width.toString());
            if (options.height) params.set("height", options.height.toString());
            if (options.quality) params.set("quality", options.quality.toString());
            if (options.format) params.set("format", options.format);

            const queryString = params.toString();
            return queryString ? `${publicUrl}?${queryString}` : publicUrl;
        }
    }

    return publicUrl;
}