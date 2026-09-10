"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { GripVertical, Loader2, Star, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { MAX_MOBILHOME_IMAGES } from "@/lib/validation/mobilhome.schema";
import { compressImage, isImageFile, MAX_UPLOAD_SIZE_BYTES } from "@/lib/utils/image-compression";
import { cn } from "@/lib/utils";
import type { MobilHomeImage } from "@/types/mobilhome";

export interface PendingPhoto {
  id: string;
  file?: File; // present for newly added photos not yet uploaded
  existing?: MobilHomeImage; // present for already-uploaded photos
  previewUrl: string;
}

export function PhotoManager({
  photos,
  onChange,
}: {
  photos: PendingPhoto[];
  onChange: (photos: PendingPhoto[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dragIndex = useRef<number | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const remaining = MAX_MOBILHOME_IMAGES - photos.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_MOBILHOME_IMAGES} photos par mobil-home.`);
      return;
    }
    const files = Array.from(fileList).slice(0, remaining);
    setIsProcessing(true);
    try {
      const added: PendingPhoto[] = [];
      for (const file of files) {
        if (!isImageFile(file)) continue;
        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
          toast.error(`"${file.name}" dépasse la taille maximale autorisée.`);
          continue;
        }
        const compressed = await compressImage(file);
        added.push({
          id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file: compressed,
          previewUrl: URL.createObjectURL(compressed),
        });
      }
      onChange([...photos, ...added]);
    } finally {
      setIsProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removePhoto(id: string) {
    onChange(photos.filter((p) => p.id !== id));
  }

  function setAsMain(id: string) {
    const index = photos.findIndex((p) => p.id === id);
    if (index <= 0) return;
    const next = [...photos];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  }

  function handleDrop(index: number) {
    if (dragIndex.current === null || dragIndex.current === index) return;
    const next = [...photos];
    const [item] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, item);
    dragIndex.current = null;
    onChange(next);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-brand-anthracite">Photos</p>
        <p className="text-xs text-muted-foreground">
          {photos.length} / {MAX_MOBILHOME_IMAGES} photos
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            draggable
            onDragStart={() => (dragIndex.current = index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className={cn(
              "group relative aspect-square cursor-grab overflow-hidden rounded-lg border border-border active:cursor-grabbing",
              index === 0 && "ring-2 ring-brand-gold"
            )}
          >
            <Image src={photo.previewUrl} alt="" fill unoptimized={Boolean(photo.file)} className="object-cover" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-1.5">
              <GripVertical className="h-4 w-4 text-white/80" />
              {index === 0 ? (
                <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
              ) : (
                <button
                  type="button"
                  onClick={() => setAsMain(photo.id)}
                  title="Définir comme photo principale"
                  className="rounded bg-black/40 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => removePhoto(photo.id)}
              className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Supprimer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {photos.length < MAX_MOBILHOME_IMAGES && (
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
