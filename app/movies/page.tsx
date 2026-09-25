import { movies } from "@/data/movies";
import { FilterBar } from "@/components/media/FilterBar";
import { PosterGrid } from "@/components/media/PosterGrid";

export default function MoviesPage() {
  return (
    <div className="page-view">
      <div className="page-heading">
        <span>MOVIE LIBRARY</span>

        <h1>Movies</h1>

        <p>Big screen stories, ready whenever you are.</p>
      </div>

      <FilterBar />

      <PosterGrid items={movies} />
    </div>
  );
}