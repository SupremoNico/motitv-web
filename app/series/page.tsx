"use client";

import { useEffect, useMemo, useState } from "react";

import { BackToTop } from "@/components/ui/BackToTop";
import { FilterBar } from "@/components/media/FilterBar";
import { PosterGrid } from "@/components/media/PosterGrid";
import { PosterSkeletonGrid } from "@/components/media/PosterSkeletonGrid";

import { useSeries } from "@/hooks/queries/useSeries";
import { useSeriesGenres } from "@/hooks/queries/useSeriesGenres";

export default function SeriesPage() {
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSeries(selectedGenre);

  const { data: genreData } = useSeriesGenres();

  const series = useMemo(() => {
    const allSeries = data?.pages.flatMap((page) => page.results) ?? [];

    return Array.from(
      new Map(allSeries.map((item) => [item.id, item])).values(),
    );
  }, [data]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const handleScroll = () => {
      const position = window.innerHeight + window.scrollY;

      const threshold = document.documentElement.scrollHeight - 800;

      if (position >= threshold) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleGenreChange = (genreId?: number) => {
    setSelectedGenre(genreId);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="page-view">
        <div className="page-heading">
          <span>SERIES LIBRARY</span>

          <h1>Series</h1>

          <p>Binge-worthy worlds and unforgettable characters.</p>
        </div>

        <FilterBar
          genres={genreData?.genres ?? []}
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
        />

        <PosterSkeletonGrid count={12} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-view">
        <div className="page-heading">
          <span>SERIES LIBRARY</span>

          <h1>Series</h1>

          <p>Binge-worthy worlds and unforgettable characters.</p>
        </div>

        <FilterBar
          genres={genreData?.genres ?? []}
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
        />

        <div className="page-error">
          <p>Failed to load series.</p>

          <span>
            {error instanceof Error ? error.message : "Unknown error"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-view">
      <div className="page-heading">
        <span>SERIES LIBRARY</span>

        <h1>Series</h1>

        <p>Binge-worthy worlds and unforgettable characters.</p>
      </div>

      <FilterBar
        genres={genreData?.genres ?? []}
        selectedGenre={selectedGenre}
        onGenreChange={handleGenreChange}
      />

      {series.length > 0 ? (
        <PosterGrid
          items={series}
          mediaType="series"
          isLoadingMore={isFetchingNextPage}
          skeletonCount={6}
        />
      ) : (
        <div className="empty-search">
          <p>No series found.</p>
        </div>
      )}

      {!hasNextPage && series.length > 0 && (
        <div className="pagination-end">You've reached the end.</div>
      )}

      <BackToTop />
    </div>
  );
}
