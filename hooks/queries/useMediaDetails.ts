"use client";

import { useQuery } from "@tanstack/react-query";

import {
    getMovie,
    getMovieCredits,
    getMovieVideos,
} from "@/lib/api/movies";

import {
    getSeriesById,
    getSeriesCredits,
    getSeriesVideos,
} from "@/lib/api/series";

export type MediaType = "movie" | "series";

interface MediaDetails {
    id: number;
    type: "movie" | "series";
    title: string;

    releaseDate: string | null;
    runtime: number | null;

    backdropUrl: string | null;
    posterUrl: string | null;

    trailer: {
        key: string;
        name: string;
    } | null;

    tagline: string | null;
    overview: string;

    voteAverage: number;

    genres: {
        id: number;
        name: string;
    }[];

    numberOfSeasons: number | null;
    numberOfEpisodes: number | null;

    status: string;

    directors: {
        id: number;
        name: string;
        profilePath: string | null;
    }[];

    cast: {
        id: number;
        name: string;
        character: string | null;
        profilePath: string | null;
    }[];
}

export function useMediaDetails(
    mediaId: number | null,
    mediaType: MediaType,
) {
    return useQuery({
        queryKey: [
            "media-details",
            mediaType,
            mediaId,
        ],

        queryFn: async (): Promise<MediaDetails> => {
            if (mediaId === null) {
                throw new Error("Media ID is required");
            }

            /*
             * ============================
             * MOVIE
             * ============================
             */
            if (mediaType === "movie") {
                const [
                    movie,
                    credits,
                    videos,
                ] = await Promise.all([
                    getMovie(mediaId),
                    getMovieCredits(mediaId),
                    getMovieVideos(mediaId),
                ]);

                const trailer =
                    videos.results.find(
                        (video) =>
                            video.site === "YouTube" &&
                            video.type === "Trailer" &&
                            video.official,
                    ) ??
                    videos.results.find(
                        (video) =>
                            video.site === "YouTube" &&
                            video.type === "Trailer",
                    ) ??
                    videos.results.find(
                        (video) =>
                            video.site === "YouTube" &&
                            video.type === "Teaser",
                    );

                return {
                    id: movie.id,
                    type: "movie",

                    title: movie.title,
                    overview: movie.overview,

                    posterUrl: movie.posterUrl,
                    backdropUrl: movie.backdropUrl,

                    releaseDate: movie.releaseDate,

                    voteAverage: movie.voteAverage,

                    tagline: movie.tagline,

                    genres: movie.genres,

                    runtime: movie.runtime,

                    numberOfSeasons: null,
                    numberOfEpisodes: null,

                    status: movie.status,

                    cast: credits.cast
                        .filter(
                            (person, index, array) =>
                                index ===
                                array.findIndex(
                                    (item) => item.id === person.id,
                                ),
                        )
                        .slice(0, 8)
                        .map((person) => ({
                            id: person.id,
                            name: person.name,
                            character: person.character ?? null,
                            profilePath: person.profilePath,
                        })),

                    directors: credits.crew
                        .filter(
                            (person) =>
                                person.job === "Director",
                        )
                        .filter(
                            (person, index, array) =>
                                index ===
                                array.findIndex(
                                    (item) => item.id === person.id,
                                ),
                        )
                        .slice(0, 3)
                        .map((person) => ({
                            id: person.id,
                            name: person.name,
                            profilePath: person.profilePath,
                        })),

                    trailer: trailer
                        ? {
                            key: trailer.key,
                            name: trailer.name,
                        }
                        : null,
                };
            }

            /*
             * ============================
             * SERIES
             * ============================
             */

            const [
                series,
                credits,
                videos,
            ] = await Promise.all([
                getSeriesById(mediaId),
                getSeriesCredits(mediaId),
                getSeriesVideos(mediaId),
            ]);

            const trailer =
                videos.results.find(
                    (video) =>
                        video.site === "YouTube" &&
                        video.type === "Trailer" &&
                        video.official,
                ) ??
                videos.results.find(
                    (video) =>
                        video.site === "YouTube" &&
                        video.type === "Trailer",
                ) ??
                videos.results.find(
                    (video) =>
                        video.site === "YouTube" &&
                        video.type === "Teaser",
                );

            const creators =
                credits.crew.filter(
                    (person) =>
                        person.job === "Director" ||
                        person.job === "Creator" ||
                        person.department === "Writing",
                );

            return {
                id: series.id,
                type: "series",

                title: series.name,
                overview: series.overview,

                posterUrl: series.posterUrl,
                backdropUrl: series.backdropUrl,

                releaseDate: series.firstAirDate,

                voteAverage: series.voteAverage,

                tagline: series.tagline,

                genres: series.genres,

                runtime:
                    series.episodeRunTime[0] ?? null,

                numberOfSeasons:
                    series.numberOfSeasons,

                numberOfEpisodes:
                    series.numberOfEpisodes,

                status: series.status,

                cast: credits.cast
                    .slice(0, 8)
                    .map((person) => ({
                        id: person.id,
                        name: person.name,
                        character: person.character ?? null,
                        profilePath: person.profilePath,
                    })),

                directors: creators
                    .slice(0, 3)
                    .map((person) => ({
                        id: person.id,
                        name: person.name,
                        profilePath: person.profilePath,
                    })),

                trailer: trailer
                    ? {
                        key: trailer.key,
                        name: trailer.name,
                    }
                    : null,
            };
        },

        enabled: mediaId !== null,
    });
}