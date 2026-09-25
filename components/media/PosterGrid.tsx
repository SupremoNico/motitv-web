import type { PosterItem } from "./types";

import { PosterCard } from "./PosterCard";
import { PosterSkeleton } from "./PosterSkeleton";

interface PosterGridProps {
  items: PosterItem[];
  mediaType?: "movie" | "series";
  isLoadingMore?: boolean;
  skeletonCount?: number;
}

export function PosterGrid({
  items,
  mediaType = "movie",
  isLoadingMore = false,
  skeletonCount = 6,
}: PosterGridProps) {
  return (
    <div className="poster-grid page-grid">
      {items.map((item) => (
        <PosterCard key={item.id} item={item} mediaType={mediaType} />
      ))}

      {isLoadingMore &&
        Array.from({
          length: skeletonCount,
        }).map((_, index) => <PosterSkeleton key={`skeleton-${index}`} />)}
    </div>
  );
}
