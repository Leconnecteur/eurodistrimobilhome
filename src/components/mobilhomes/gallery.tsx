"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { MobilHomeImage } from "@/types/mobilhome";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  title,
}: {
  images: MobilHomeImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {title}
      </div>
    );
  }

  const current = images[active];

  function next() {
    setActive((i) => (i + 1) % images.length);
  }
  function prev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={current.url}
          alt={current.alt || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-anthracite shadow hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-anthracite shadow hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <button
          onClick={() => setLightboxOpen(true)}
          aria-label="Plein écran"
          className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-anthracite shadow hover:bg-white"
        >
          <Expand className="h-4 w-4" />
        </button>
        <span className="absolute left-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
          {active + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8">
          {images.map((img, i) => (
            <button
              key={img.storagePath || img.url + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md ring-2 ring-transparent",
                i === active && "ring-brand-gold"
              )}
            >
              <Image src={img.url} alt={img.alt || title} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent showCloseButton={false} className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="relative aspect-video w-full">
            <Image
              src={current.url}
              alt={current.alt || title}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </Button>
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-anthracite shadow hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-anthracite shadow hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
