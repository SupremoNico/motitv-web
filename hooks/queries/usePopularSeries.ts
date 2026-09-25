"use client";

import { useQuery } from "@tanstack/react-query";

import { getPopularSeries } from "@/lib/api/series";

export function usePopularSeries() {
    return useQuery({
        queryKey: ["popular-series"],
        queryFn: () => getPopularSeries(1),
    });
}