import type { Article } from "@/lib/articles";

/** Paramètre d’URL pour la recherche (partageable / historique). */
export const ARTICLES_SEARCH_PARAM = "q";

export function articleMatchesQuery(
	article: Article,
	rawQuery: string,
): boolean {
	const q = rawQuery.trim().toLowerCase();
	if (!q) return true;
	const haystack = [
		article.title,
		article.category.label,
	]
		.join(" ")
		.toLowerCase();
	return haystack.includes(q);
}

export function articleMatchesCategory(
	article: Article,
	categoryLabel: string | null,
): boolean {
	if (categoryLabel === null) return true;
	return article.category.label === categoryLabel;
}

export function filterArticlesForListing(
	articles: Article[],
	query: string,
	activeCategory: string | null,
): Article[] {
	return articles.filter(
		(a) =>
			articleMatchesQuery(a, query) &&
			articleMatchesCategory(a, activeCategory),
	);
}

export function getArticlesResultLine(input: {
	isLoading: boolean;
	total: number;
	count: number;
	query: string;
	activeCategory: string | null;
}): string {
	const {
		isLoading,
		total,
		count,
		query,
		activeCategory,
	} = input;
	if (isLoading) {
		return "Chargement des articles...";
	}
	if (total === 0) {
		return "Aucun article disponible pour le moment";
	}
	if (count === 0) {
		return !query.trim() &&
			activeCategory !== null
			? "Aucun article dans cette catégorie"
			: "Aucun article ne correspond à votre recherche";
	}
	if (count === 1) {
		return "1 article trouvé";
	}
	return `${count} articles disponibles`;
}
