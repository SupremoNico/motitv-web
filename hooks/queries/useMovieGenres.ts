"use client";

import { useQuery } from "@tanstack/react-query";

import { getMovieGenres } from "@/lib/api/movies";

export function useMovieGenres() {
    return useQuery({
        queryKey: ["movie-genres"],
        queryFn: getMovieGenres,
        staleTime: 1000 * 60 * 60,
    });
}