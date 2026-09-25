"use client";

interface Filter {
  id: number;
  name: string;
}

interface FilterBarProps {
  genres: Filter[];
  selectedGenre?: number;
  onGenreChange: (genreId?: number) => void;
}

export function FilterBar({
  genres,
  selectedGenre,
  onGenreChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter by genre">
      <button
        type="button"
        className={selectedGenre === undefined ? "selected" : ""}
        onClick={() => onGenreChange(undefined)}
        aria-pressed={selectedGenre === undefined}
      >
        All
      </button>

      {genres.map((genre) => {
        const isSelected = selectedGenre === genre.id;

        return (
          <button
            key={genre.id}
            type="button"
            className={isSelected ? "selected" : ""}
            onClick={() => onGenreChange(genre.id)}
            aria-pressed={isSelected}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
