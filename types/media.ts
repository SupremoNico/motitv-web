export type MediaType = "movie" | "series";

export type MediaItem = {
  id: string;
  title: string;
  poster: string;
  backdrop?: string;
  genres: string[];
  year: number;
  rating: number;
  type: MediaType;
  description?: string;
};

export type MediaCredit = {
  director: string;
  cast: string[];
};