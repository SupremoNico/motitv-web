"use client";

import { useEffect, useMemo, useState } from "react";

import { BackToTop } from "@/components/ui/BackToTop";
import { FilterBar } from "@/components/media/FilterBar";
import { PosterGrid } from "@/components/media/PosterGrid";
import { PosterSkeletonGrid } from "@/components/media/PosterSkeletonGrid";
import { useMovieGenres } from "@/hooks/queries/useMovieGenres";
import { useMovies } from "@/hooks/queries/useMovies";

export default function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(
    undefined,
  );

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMovies(selectedGenre);

  const { data: genreData } = useMovieGenres();

  const movies = useMemo(() => {
    const allMovies = data?.pages.flatMap((page) => page.results) ?? [];

    return Array.from(
      new Map(allMovies.map((movie) => [movie.id, movie])).values(),
    );
  }, [data]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 800;

      if (scrollPosition >= threshold) {
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
          <span>MOVIE LIBRARY</span>

          <h1>Movies</h1>

          <p>Big screen stories, ready whenever you are.</p>
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
          <span>MOVIE LIBRARY</span>

          <h1>Movies</h1>

          <p>Big screen stories, ready whenever you are.</p>
        </div>

        <FilterBar
          genres={genreData?.genres ?? []}
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
        />

        <div className="page-error">
          <p>Failed to load movies.</p>

          <span>
            {error instanceof Error ? error.message : "Unknown error"}
          </span>
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="page-view">
        <div className="page-heading">
          <span>MOVIE LIBRARY</span>

          <h1>Movies</h1>

          <p>Big screen stories, ready whenever you are.</p>
        </div>

        <FilterBar
          genres={genreData?.genres ?? []}
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
        />

        <div className="empty-search">
          <p>No movies found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-view">
      <div className="page-heading">
        <span>MOVIE LIBRARY</span>

        <h1>Movies</h1>

        <p>Big screen stories, ready whenever you are.</p>
      </div>

      <FilterBar
        genres={genreData?.genres ?? []}
        selectedGenre={selectedGenre}
        onGenreChange={handleGenreChange}
      />

      <PosterGrid
        items={movies}
        mediaType="movie"
        isLoadingMore={isFetchingNextPage}
        skeletonCount={6}
      />

      {!hasNextPage && movies.length > 0 && (
        <div className="pagination-end">You've reached the end.</div>
      )}

      <BackToTop />
    </div>
  );
}
