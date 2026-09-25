"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getSeries } from "@/lib/api/series";

export function useSeries(
    genreId?: number,
) {
    return useInfiniteQuery({
        queryKey: ["series", genreId],

        queryFn: ({ pageParam }) =>
            getSeries(pageParam, genreId),

        initialPageParam: 1,

        getNextPageParam: (lastPage) => {
            if (
                lastPage.page >=
                lastPage.totalPages
            ) {
                return undefined;
            }

            return lastPage.page + 1;
        },
    });
}