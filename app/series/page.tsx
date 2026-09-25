import { series } from "@/data/series";
import { FilterBar } from "@/components/media/FilterBar";
import { PosterGrid } from "@/components/media/PosterGrid";

export default function SeriesPage() {
  return (
    <div className="page-view">
      <div className="page-heading">
        <span>SERIES LIBRARY</span>

        <h1>Series</h1>

        <p>Binge-worthy worlds and unforgettable characters.</p>
      </div>

      <FilterBar />

      <PosterGrid items={series} />
    </div>
  );
}
