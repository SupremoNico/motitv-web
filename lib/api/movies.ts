import { apiFetch } from "./client";
import type { PosterItem } from "@/components/media/types";

export interface MovieGenre {
    id: number;
    name: string;
}

export interface MovieGenreList {
    genres: MovieGenre[];
}

export interface Movie extends PosterItem {
    id: number;
    title: string;
    originalTitle: string;
    overview: string;

    posterPath: string | null;
    posterUrl: string | null;

    backdropPath: string | null;
    backdropUrl: string | null;

    releaseDate: string | null;

    runtime: number | null;
    status: string;
    tagline: string | null;

    voteAverage: number;
    voteCount: number;
    popularity: number;

    genres: MovieGenre[];

    originalLanguage: string;
    adult: boolean;
}

export interface MovieList {
    page: number;
    results: Movie[];
    totalPages: number;
    totalResults: number;
}

export async function getMovies(
    page = 1,
    genreId?: number,
): Promise<MovieList> {
    const params = new URLSearchParams({
        page: String(page),
    });

    if (genreId) {
        params.set("genre", String(genreId));
    }

    return apiFetch<MovieList>(
        `/movies?${params.toString()}`,
    );
}

export async function getMovieGenres(): Promise<MovieGenreList> {
    return apiFetch<MovieGenreList>(
        "/movies/genres",
    );
}

export async function getPopularMovies(
    page = 1,
): Promise<MovieList> {
    return apiFetch<MovieList>(
        `/movies/popular?page=${page}`,
    );
}

export async function getNowPlayingMovies(
    page = 1,
): Promise<MovieList> {
    return apiFetch<MovieList>(
        `/movies/now-playing?page=${page}`,
    );
}

export async function getUpcomingMovies(
    page = 1,
): Promise<MovieList> {
    return apiFetch<MovieList>(
        `/movies/upcoming?page=${page}`,
    );
}

export async function getTopRatedMovies(
    page = 1,
): Promise<MovieList> {
    return apiFetch<MovieList>(
        `/movies/top-rated?page=${page}`,
    );
}

export async function getMovie(
    id: number,
): Promise<Movie> {
    return apiFetch<Movie>(
        `/movies/${id}`,
    );
}