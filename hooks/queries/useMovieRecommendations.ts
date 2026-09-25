"use client";

import { useQuery } from "@tanstack/react-query";

import { getMovieRecommendations } from "@/lib/api/movies";

export function useMovieRecommendations(
    movieId: number | null,
) {
    return useQuery({
        queryKey: [
            "movie-recommendations",
            movieId,
        ],

        queryFn: () => {
            if (movieId === null) {
                throw new Error(
                    "Movie ID is required",
                );
            }

            return getMovieRecommendations(
                movieId,
            );
        },

        enabled: movieId !== null,
    });
}