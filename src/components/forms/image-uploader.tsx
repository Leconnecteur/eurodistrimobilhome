"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { compressImage, isImageFile, MAX_UPLOAD_SIZE_BYTES } from "@/lib/utils/image-compression";
import { cn } from "@/lib/utils";

export interface LocalImage {
  id: string;
  file: File;
  previewUrl: string;
}

export function ImageUploader({
  images,
  onChange,
  maxImages,
  label,
  countLabel,
}: {
  images: LocalImage[];
  onChange: (images: LocalImage[]) => void;
  maxImages: number;
  label: string;
  countLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} photos`);
      return;
    }

    const files = Array.from(fileList).slice(0, remaining);
    setIsProcessing(true);
    try {
      const compressedImages: LocalImage[] = [];
      for (const file of files) {
        if (!isImageFile(file)) continue;
        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
          toast.error(`"${file.name}" dépasse la taille maximale autorisée.`);
          continue;
        }
        const compressed = await compressImage(file);
        compressedImages.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file: compressed,
          previewUrl: URL.createObjectURL(compressed),
        });
      }
      onChange([...images, ...compressedImages]);
    } finally {
      setIsProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(id: string) {
    onChange(images.filter((img) => img.id !== id));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-brand-anthracite">{label}</span>
        <span className="text-xs text-muted-foreground">
          {countLabel.replace("{count}", String(images.length))}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
            <Image src={img.previewUrl} alt="" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => removeImage(img.id)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Supprimer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isProcessing}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-brand-gold hover:text-brand-gold",
              isProcessing && "pointer-events-none opacity-60"
            )}
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-xs">Ajouter</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
