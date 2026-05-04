"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export type AdminActivityListItem = {
  id: string;
  title: string;
  author: string;
  tag: string;
  status: string;
};

type AdminActivitiesListResponse = {
  items: AdminActivityListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const ACTIVITIES_PAGE_SIZE = 10;

export function useAdminActivities(searchQuery: string) {
  const [activities, setActivities] = useState<AdminActivityListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadActivities = useCallback(async (targetPage: number) => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(ACTIVITIES_PAGE_SIZE),
      });
      const normalizedQuery = searchQuery.trim();
      if (normalizedQuery) {
        params.set("q", normalizedQuery);
      }

      const response = await fetch(`/api/admin/activities?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Impossible de récupérer les activités");
      }

      const data = (await response.json()) as AdminActivitiesListResponse;
      setActivities(data.items);
      setTotalActivities(data.pagination.total);
      setTotalPages(Math.max(1, data.pagination.totalPages));

      if (targetPage > data.pagination.totalPages && data.pagination.totalPages > 0) {
        setPage(data.pagination.totalPages);
      }
    } catch (error) {
      console.error(error);
      setActivities([]);
      setTotalActivities(0);
      setTotalPages(1);
      toast.error("Impossible de charger les activités.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    void loadActivities(page);
  }, [loadActivities, page]);

  const refresh = useCallback(() => {
    void loadActivities(page);
  }, [loadActivities, page]);

  return {
    activities,
    isLoading,
    page,
    totalActivities,
    totalPages,
    refresh,
    goToPreviousPage: () => {
      setPage((currentPage) => Math.max(1, currentPage - 1));
    },
    goToNextPage: () => {
      setPage((currentPage) => Math.min(totalPages, currentPage + 1));
    },
  };
}
