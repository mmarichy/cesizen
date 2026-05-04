"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export type AdminArticleListItem = {
  id: string;
  title: string;
  author: string;
  tag: string;
  status: string;
};

type AdminArticlesListResponse = {
  items: AdminArticleListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const ARTICLES_PAGE_SIZE = 10;

export function useAdminArticles(searchQuery: string) {
  const [articles, setArticles] = useState<AdminArticleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadArticles = useCallback(async (targetPage: number) => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(ARTICLES_PAGE_SIZE),
      });
      const normalizedQuery = searchQuery.trim();
      if (normalizedQuery) {
        params.set("q", normalizedQuery);
      }

      const response = await fetch(`/api/admin/articles?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Impossible de récupérer les articles");
      }

      const data = (await response.json()) as AdminArticlesListResponse;
      setArticles(data.items);
      setTotalArticles(data.pagination.total);
      setTotalPages(Math.max(1, data.pagination.totalPages));

      if (targetPage > data.pagination.totalPages && data.pagination.totalPages > 0) {
        setPage(data.pagination.totalPages);
      }
    } catch (error) {
      console.error(error);
      setArticles([]);
      setTotalArticles(0);
      setTotalPages(1);
      toast.error("Impossible de charger les articles.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    void loadArticles(page);
  }, [loadArticles, page]);

  const refresh = useCallback(() => {
    void loadArticles(page);
  }, [loadArticles, page]);

  return {
    articles,
    isLoading,
    page,
    totalArticles,
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
