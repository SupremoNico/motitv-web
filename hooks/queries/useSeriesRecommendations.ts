"use client";

import { useQuery } from "@tanstack/react-query";

import { getSeriesRecommendations } from "@/lib/api/series";

export function useSeriesRecommendations(
    seriesId: number | null,
) {
    return useQuery({
        queryKey: [
            "series-recommendations",
            seriesId,
        ],

        queryFn: () => {
            if (seriesId === null) {
                throw new Error(
                    "Series ID is required",
                );
            }

            return getSeriesRecommendations(
                seriesId,
            );
        },

        enabled: seriesId !== null,
    });
}