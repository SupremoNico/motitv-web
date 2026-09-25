export interface PosterItem {
  id: number;

  title: string;

  overview: string;

  posterUrl: string | null;

  releaseDate: string | null;

  voteAverage: number;

  genres: {
    id: number;
    name: string;
  }[];
}