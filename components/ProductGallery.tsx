"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = images[selectedIndex] ?? images[0];

  if (!images.length || !currentImage) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <img src={currentImage} alt={alt} />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                selectedIndex === i
                  ? "border-emerald-500 ring-2 ring-emerald-500/30"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <img src={src} alt={`${alt} ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
