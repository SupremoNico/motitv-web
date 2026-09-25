"use client";

import type { MediaItem } from "@/types/media";
import { PosterCard } from "./PosterCard";

type PosterGridProps = {
  items: MediaItem[];
};

export function PosterGrid({ items }: PosterGridProps) {
  return (
    <div className="poster-grid page-grid">
      {items.map((item) => (
        <PosterCard key={item.id} item={item} />
      ))}
    </div>
  );
}
