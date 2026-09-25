export function PosterSkeleton() {
  return (
    <article className="poster-card poster-skeleton">
      <div className="poster-image-wrap">
        <div className="skeleton-block skeleton-poster" />
      </div>

      <div className="poster-info">
        <div className="skeleton-block skeleton-title" />
        <div className="skeleton-block skeleton-rating" />
      </div>

      <div className="skeleton-block skeleton-meta" />
    </article>
  );
}
