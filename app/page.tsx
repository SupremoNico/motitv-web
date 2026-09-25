"use client";

import { ContentRail } from "@/components/home/ContentRail";
import { Hero } from "@/components/home/Hero";
import { PosterSkeletonGrid } from "@/components/media/PosterSkeletonGrid";
import { usePopularMovies } from "@/hooks/queries/usePopularMovies";
import { usePopularSeries } from "@/hooks/queries/usePopularSeries";

export default function HomePage() {
  const {
    data: movieData,
    isLoading: isMoviesLoading,
    isError: isMoviesError,
  } = usePopularMovies();

  const {
    data: seriesData,
    isLoading: isSeriesLoading,
    isError: isSeriesError,
  } = usePopularSeries();

  const movies = movieData?.results ?? [];
  const series = seriesData?.results ?? [];

  const isLoading = isMoviesLoading || isSeriesLoading;

  return (
    <main className="app-shell">
      <Hero />

      <div className="content">
        {isLoading ? (
          <section className="rail">
            <div className="rail-heading">
              <h2>Trending Movies</h2>
            </div>

            <PosterSkeletonGrid count={6} />
          </section>
        ) : isMoviesError ? (
          <section className="rail">
            <div className="rail-heading">
              <h2>Trending Movies</h2>
            </div>

            <div className="page-error">
              <p>Failed to load movies.</p>
            </div>
          </section>
        ) : (
          <ContentRail title="Trending Movies" href="/movies" items={movies} />
        )}

        {isLoading ? (
          <section className="rail">
            <div className="rail-heading">
              <h2>Popular Shows</h2>
            </div>

            <PosterSkeletonGrid count={6} />
          </section>
        ) : isSeriesError ? (
          <section className="rail">
            <div className="rail-heading">
              <h2>Popular Shows</h2>
            </div>

            <div className="page-error">
              <p>Failed to load shows.</p>
            </div>
          </section>
        ) : (
          <ContentRail title="Popular Shows" href="/series" items={series} />
        )}
      </div>
    </main>
  );
}
