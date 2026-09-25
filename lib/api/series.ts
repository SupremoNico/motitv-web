import { apiFetch } from "./client";

import type { PosterItem } from "@/components/media/types";

export interface SeriesGenre {
    id: number;
    name: string;
}

export interface SeriesGenreList {
    genres: SeriesGenre[];
}

export interface SeriesList {
    page: number;
    results: PosterItem[];
    totalPages: number;
    totalResults: number;
}

export interface Series {
    id: number;
    name: string;
    originalName: string;
    overview: string;

    posterPath: string | null;
    posterUrl: string | null;

    backdropPath: string | null;
    backdropUrl: string | null;

    firstAirDate: string | null;
    lastAirDate: string | null;

    numberOfSeasons: number;
    numberOfEpisodes: number;

    status: string;
    tagline: string | null;

    voteAverage: number;
    voteCount: number;
    popularity: number;

    genres: SeriesGenre[];

    originalLanguage: string;
    episodeRunTime: number[];
}

interface SeriesApiListItem {
    id: number;
    name: string;
    originalName: string;
    overview: string;

    posterPath: string | null;
    posterUrl: string | null;

    backdropPath: string | null;
    backdropUrl: string | null;

    firstAirDate: string | null;

    voteAverage: number;
    voteCount: number;
    popularity: number;

    genres: SeriesGenre[];

    originalLanguage: string;
}

export async function getSeries(
    page = 1,
    genreId?: number,
): Promise<SeriesList> {
    const params = new URLSearchParams({
        page: String(page),
    });

    if (genreId) {
        params.set("genre", String(genreId));
    }

    const response =
        await apiFetch<{
            page: number;
            results: SeriesApiListItem[];
            totalPages: number;
            totalResults: number;
        }>(
            `/series?${params.toString()}`,
        );

    return {
        page: response.page,
        totalPages: response.totalPages,
        totalResults: response.totalResults,

        results: response.results.map(
            (series) => ({
                id: series.id,
                title: series.name,
                overview: series.overview,
                posterUrl: series.posterUrl,
                releaseDate: series.firstAirDate,
                voteAverage: series.voteAverage,
                genres: series.genres,
            }),
        ),
    };
}

export async function getPopularSeries(
    page = 1,
): Promise<SeriesList> {
    return apiFetch<SeriesList>(
        `/series/popular?page=${page}`,
    );
}

export async function getSeriesGenres(): Promise<SeriesGenreList> {
    return apiFetch<SeriesGenreList>(
        "/series/genres",
    );
}

export async function getSeriesById(
    id: number,
): Promise<Series> {
    return apiFetch<Series>(
        `/series/${id}`,
    );
}