"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/articles";

export function useArticlesFromApi(
	initialArticles: Article[],
) {
	const [articles, setArticles] = useState<Article[]>(
		initialArticles,
	);
	const [isLoading, setIsLoading] = useState(
		initialArticles.length === 0,
	);

	useEffect(() => {
		let cancelled = false;

		const fetchArticles = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					"/api/articles",
					{
						method: "GET",
						cache: "no-store",
					},
				);
				if (!response.ok) {
					throw new Error(
						"Échec de récupération des articles",
					);
				}
				const data =
					(await response.json()) as Article[];
				if (!cancelled) {
					setArticles(data);
				}
			} catch (error) {
				console.error(error);
				if (!cancelled) {
					setArticles([]);
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		};

		void fetchArticles();

		return () => {
			cancelled = true;
		};
	}, []);

	return { articles, isLoading };
}
