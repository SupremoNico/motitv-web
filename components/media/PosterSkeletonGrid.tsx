import { PosterSkeleton } from "./PosterSkeleton";

interface PosterSkeletonGridProps {
  count?: number;
}

export function PosterSkeletonGrid({ count = 12 }: PosterSkeletonGridProps) {
  return (
    <div className="poster-grid page-grid">
      {Array.from({ length: count }).map((_, index) => (
        <PosterSkeleton key={index} />
      ))}
    </div>
  );
}
