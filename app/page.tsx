import { ContentRail } from "@/components/home/ContentRail";
import { Hero } from "@/components/home/Hero";
import { movies } from "@/data/movies";
import { series } from "@/data/series";

export default function HomePage() {
  return (
    <main className="app-shell">
      <Hero />

      <div className="content">
        <ContentRail title="Trending Movies" href="/movies" items={movies} />

        <ContentRail title="Popular Shows" href="/series" items={series} />
      </div>
    </main>
  );
}
