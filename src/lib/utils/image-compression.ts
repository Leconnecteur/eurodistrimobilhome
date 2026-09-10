"use client";

import imageCompression from "browser-image-compression";

export interface CompressImageOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

/**
 * Compresses and resizes an image in the browser before upload, converting it
 * to WebP/JPEG, to keep Firebase Storage costs under control. Never uploads
 * the original, full-size file.
 */
export async function compressImage(
  file: File,
  { maxSizeMB = 0.6, maxWidthOrHeight = 1920 }: CompressImageOptions = {}
): Promise<File> {
  const isPng = file.type === "image/png";
  const compressed = await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: isPng ? "image/png" : "image/webp",
    initialQuality: 0.8,
  });
  return compressed;
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024; // hard cap before compression
