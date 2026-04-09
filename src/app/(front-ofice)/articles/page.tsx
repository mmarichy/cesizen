import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticlesClient } from "./articles-client";
import { articles } from "./data";

export const metadata: Metadata = {
	title: "Articles | Cesizen",
	description:
		"Articles sur la santé mentale et le bien-être, rédigés avec le concours de professionnels.",
};

export default function ArticlesPage() {
	return (
		<div className="min-h-screen bg-linear-to-br from-white via-emerald-50/30 to-yellow-50/30 pb-28 md:pb-16">
			<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
				<Suspense
					fallback={
						<p className="py-12 text-center text-slate-600">
							Chargement…
						</p>
					}>
					<ArticlesClient articles={articles} />
				</Suspense>
			</div>
		</div>
	);
}
