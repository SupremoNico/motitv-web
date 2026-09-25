import type { MediaItem } from "@/types/media";

export const series: MediaItem[] = [
  {
    id: "one-piece",
    title: "One Piece",
    poster:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=85",
    genres: ["Adventure", "Fantasy"],
    year: 2023,
    rating: 8.4,
    type: "series",
  },
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    poster:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=85",
    genres: ["Crime", "Drama"],
    year: 2008,
    rating: 9.5,
    type: "series",
  },
];