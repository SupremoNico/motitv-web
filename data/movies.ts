import type { MediaItem } from "@/types/media";

export const movies: MediaItem[] = [
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    poster:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=85",
    genres: ["Action", "Sci-Fi"],
    year: 2024,
    rating: 8.6,
    type: "movie",
  },
  {
    id: "deadpool-wolverine",
    title: "Deadpool & Wolverine",
    poster:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85",
    genres: ["Action", "Comedy"],
    year: 2024,
    rating: 8.1,
    type: "movie",
  },
  {
    id: "the-batman",
    title: "The Batman",
    poster:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=85",
    genres: ["Action", "Crime"],
    year: 2022,
    rating: 7.8,
    type: "movie",
  },
];