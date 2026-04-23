"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArticleCard } from "@/components/ui/article-card";
import { ArticleCategoryFilters } from "@/components/ui/article-category-filters";
import { ListingPageChangeLoader } from "@/components/ui/listing-page-change-loader";
import { ListingPaginationStatus } from "@/components/ui/listing-pagination-status";
import {
	ListingCardScrollReveal,
	ListingScrollRevealScope,
} from "@/components/ui/listing-scroll-reveal";
import { SearchField } from "@/components/ui/search-field";
import { useArticlesClientViewModel } from "@/hooks/use-articles-client-view-model";
import type { Article } from "@/lib/articles";

export function ArticlesClient({
	articles: initialArticles = [],
}: {
	articles?: Article[];
}) {
	const vm = useArticlesClientViewModel(initialArticles);

	return (
		<>
			<Stack
				alignItems="center"
				spacing={2}
				sx={{ mb: 4 }}>
				<Typography
					variant="h4"
					component="h1"
					sx={{
						fontWeight: 700,
						color: "#0f172a",
						fontSize: {
							xs: "1.75rem",
							sm: "2rem",
						},
					}}>
					Articles
				</Typography>

				<Typography
					variant="body1"
					sx={{
						maxWidth: 520,
						textAlign: "center",
						lineHeight: 1.6,
						px: 1,
						color: "#334155",
					}}>
					Découvrez nos articles sur la
					santé mentale et le bien-être
					validés par des professionnels
				</Typography>

				<SearchField
					value={vm.query}
					onChange={(e) => {
						vm.onQueryChange(e.target.value);
					}}
					showClearButton
					onClear={vm.clearQuery}
					placeholder="Rechercher un article…"
					aria-label="Rechercher un article"
					sx={{ mt: 1 }}
				/>

				<ArticleCategoryFilters
					selectedLabel={vm.activeCategory}
					onChange={vm.onCategoryChange}
					perPage={vm.perPage}
					onPerPageChange={vm.onPerPageChange}
					showPerPage={vm.showPerPage}
				/>
			</Stack>

			<Typography
				variant="body1"
				component="p"
				textAlign="center"
				fontWeight={600}
				sx={{ mb: 3, color: "#0f172a" }}>
				{vm.resultLine}
			</Typography>

			{vm.isLoading ? null : vm.showEmptyCatalog ? (
				<Typography
					textAlign="center"
					sx={{ color: "#475569" }}>
					Revenez bientôt pour découvrir
					nos prochains contenus.
				</Typography>
			) : !vm.showGrid ? null : (
				<ListingScrollRevealScope>
				<>
					{vm.isPageChangePending ? (
						<ListingPageChangeLoader ariaLabel="Chargement de la page" />
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{vm.displayedArticles.map(
								(article, index) => (
									<div
										key={article.id}
										ref={
											index ===
											vm.loadMoreAnchorIndex
												? vm.loadMoreAnchorRef
												: undefined
										}
										className="min-w-0 h-full">
										<ListingCardScrollReveal
											index={index}>
											<ArticleCard
												article={article}
											/>
										</ListingCardScrollReveal>
									</div>
								),
							)}
						</div>
					)}

					{vm.showLoadMoreHint ? (
						<Typography
							variant="body2"
							textAlign="center"
							sx={{
								mt: 3,
								color: "#64748b",
							}}>
							Affichez le dernier article de
							la ligne pour en charger
							d’autres…
						</Typography>
					) : null}

					<ListingPaginationStatus
						showPagination={vm.showPagination}
						showAllLoadedHint={vm.showAllLoadedHint}
						page={vm.page}
						totalPages={vm.totalPages}
						onPaginationChange={vm.onPaginationChange}
						paginationAriaLabel={`Pagination des articles, page ${vm.page} sur ${vm.totalPages}`}
						allLoadedText="Tous les articles sont affichés."
					/>
				</>
				</ListingScrollRevealScope>
			)}
		</>
	);
}
