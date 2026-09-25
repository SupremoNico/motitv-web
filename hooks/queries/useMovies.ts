"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getMovies } from "@/lib/api/movies";

export function useMovies(genreId?: number) {
    return useInfiniteQuery({
        queryKey: ["movies", genreId],

        queryFn: ({ pageParam }) =>
            getMovies(pageParam, genreId),

        initialPageParam: 1,

        getNextPageParam: (lastPage) => {
            if (lastPage.page >= lastPage.totalPages) {
                return undefined;
            }

            return lastPage.page + 1;
        },
    });
}