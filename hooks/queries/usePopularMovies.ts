"use client";

import { useQuery } from "@tanstack/react-query";

import { getPopularMovies } from "@/lib/api/movies";

export function usePopularMovies() {
    return useQuery({
        queryKey: ["popular-movies"],
        queryFn: () => getPopularMovies(1),
    });
}