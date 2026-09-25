"use client";

import { useState } from "react";

const genres = [
  "All",
  "Action",
  "Drama",
  "Comedy",
  "Sci-Fi",
  "Animation",
  "Fantasy",
];

export function FilterBar() {
  const [selected, setSelected] = useState("All");

  return (
    <div className="filter-bar" role="group" aria-label="Filter by genre">
      {genres.map((genre) => {
        const isSelected = selected === genre;

        return (
          <button
            key={genre}
            type="button"
            className={isSelected ? "selected" : ""}
            onClick={() => setSelected(genre)}
            aria-pressed={isSelected}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}