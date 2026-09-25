"use client";

import { useQuery } from "@tanstack/react-query";

import { getSeriesGenres } from "@/lib/api/series";

export function useSeriesGenres() {
    return useQuery({
        queryKey: ["series-genres"],
        queryFn: getSeriesGenres,
        staleTime: 1000 * 60 * 60,
    });
}